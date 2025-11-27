"use server";

import { ID, Query } from "node-appwrite";

import { HotelRoomTypes } from "@/constants";
import { Room } from "@/types/appwrite.types";

import {
  DATABASE_ID,
  HOTEL_COLLECTION_ID,
  ROOM_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// SYNC ROOMS FROM CONSTANTS TO APPWRITE
// This ensures HotelRoomTypes constants are backed by real room documents
export const syncRoomsToAppwrite = async (hotelId?: string) => {
  try {
    // Get or create default hotel if hotelId not provided
    let defaultHotelId = hotelId;
    if (!defaultHotelId && HOTEL_COLLECTION_ID) {
      const hotels = await databases.listDocuments(
        DATABASE_ID!,
        HOTEL_COLLECTION_ID!
      );
      if (hotels.documents.length > 0) {
        defaultHotelId = hotels.documents[0].$id;
      } else {
        // Create default hotel
        const newHotel = await databases.createDocument(
          DATABASE_ID!,
          HOTEL_COLLECTION_ID!,
          ID.unique(),
          {
            name: "CareStay Hotel",
            location: "Default Location",
            description: "Default hotel for room management",
          }
        );
        defaultHotelId = newHotel.$id;
      }
    }

    if (!defaultHotelId) {
      throw new Error("Hotel ID is required. Please create a hotel first.");
    }

    const syncedRooms: Room[] = [];

    // For each room type in constants, create or update room document
    for (const roomType of HotelRoomTypes) {
      try {
        // Check if room already exists by matching the ID or name
        const existingRooms = await databases.listDocuments(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          [
            Query.or([
              Query.equal("label", [roomType.name]),
              Query.equal("type", [roomType.type]),
            ]),
          ]
        );

        let room: Room;
        if (existingRooms.documents.length > 0) {
          // Update existing room
          room = (await databases.updateDocument(
            DATABASE_ID!,
            ROOM_COLLECTION_ID!,
            existingRooms.documents[0].$id,
            {
              hotelId: defaultHotelId,
              label: roomType.name,
              type: roomType.type,
              capacity: roomType.capacity,
              amenities: roomType.amenities || [],
              rate: roomType.rate,
              availableFrom: new Date(), // Available now
              availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Available for 1 year
            }
          )) as Room;
        } else {
          // Create new room
          room = (await databases.createDocument(
            DATABASE_ID!,
            ROOM_COLLECTION_ID!,
            ID.unique(),
            {
              hotelId: defaultHotelId,
              label: roomType.name,
              type: roomType.type,
              capacity: roomType.capacity,
              amenities: roomType.amenities || [],
              rate: roomType.rate,
              availableFrom: new Date(),
              availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            }
          )) as Room;
        }

        syncedRooms.push(parseStringify(room));
      } catch (error) {
        console.error(`Error syncing room ${roomType.name}:`, error);
      }
    }

    return {
      success: true,
      rooms: syncedRooms,
      hotelId: defaultHotelId,
    };
  } catch (error) {
    console.error("Error syncing rooms to Appwrite:", error);
    throw error;
  }
};

// GET ALL ROOMS
export const getAllRooms = async (hotelId?: string) => {
  try {
    const queries = hotelId
      ? [Query.equal("hotelId", [hotelId])]
      : [Query.orderAsc("rate")];

    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      queries
    );

    return parseStringify(rooms.documents as Room[]);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

// GET ROOM BY ID
export const getRoomById = async (roomId: string) => {
  try {
    const room = await databases.getDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId
    );

    return parseStringify(room as Room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
};

// GET ROOM BY NAME (for mapping from constants)
export const getRoomByName = async (roomName: string) => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("label", [roomName])]
    );

    return rooms.documents.length > 0
      ? parseStringify(rooms.documents[0] as Room)
      : null;
  } catch (error) {
    console.error("Error fetching room by name:", error);
    return null;
  }
};

