"use server";

import { ID, Query } from "node-appwrite";

import { HotelRoomTypes } from "@/constants";
import { Hotel, Room } from "@/types/appwrite.types";

import {
  DATABASE_ID,
  HOTEL_COLLECTION_ID,
  ROOM_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// SYNC ROOMS FROM CONSTANTS TO APPWRITE
// This ensures HotelRoomTypes constants are backed by real room documents
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

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
        // Create default hotel with slug
        const newHotel = await databases.createDocument(
          DATABASE_ID!,
          HOTEL_COLLECTION_ID!,
          ID.unique(),
          {
            name: "CareStay Hotel",
            location: "Default Location",
            description: "Default hotel for room management",
            slug: "carestay-hotel", // Add slug for hotel too if required
          }
        );
        defaultHotelId = newHotel.$id;
      }
    }

    if (!defaultHotelId) {
      throw new Error("Hotel ID is required. Please create a hotel first.");
    }

    const syncedRooms: any[] = [];

    // For each room type in constants, create or update room document
    for (const roomType of HotelRoomTypes) {
      try {
        const roomSlug = generateSlug(roomType.name);

        // Check if room already exists by matching the slug or name
        const existingRooms = await databases.listDocuments(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          [
            Query.equal("slug", roomSlug),
            Query.equal("label", roomType.name),
            Query.equal("type", roomType.type),
          ]
        );

        // Common room data for both create and update
        const roomData = {
          hotelId: defaultHotelId,
          label: roomType.name,
          type: roomType.type,
          slug: roomSlug,
          capacity: roomType.capacity,
          amenities: roomType.amenities || [],
          rate: roomType.rate,
          pricePerNight: roomType.rate,
          bedCount: Math.ceil(roomType.capacity / 2),
          floorNumber: 1,
          availabilityStatus: "available",
          availableFrom: new Date(),
          availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          description:
            roomType.description ||
            `Comfortable ${roomType.type.toLowerCase()} room`,
          image: "/assets/images/room-placeholder.jpg",
        };

        let room;
        if (existingRooms.documents.length > 0) {
          // Update existing room
          room = await databases.updateDocument(
            DATABASE_ID!,
            ROOM_COLLECTION_ID!,
            existingRooms.documents[0].$id,
            roomData
          );
        } else {
          // Create new room with required slug
          room = await databases.createDocument(
            DATABASE_ID!,
            ROOM_COLLECTION_ID!,
            ID.unique(),
            roomData
          );
        }

        syncedRooms.push(parseStringify(room));
        console.log(`✅ Synced room: ${roomType.name} (${roomSlug})`);
      } catch (error) {
        console.error(`❌ Error syncing room ${roomType.name}:`, error);
      }
    }

    return {
      success: true,
      rooms: syncedRooms,
      hotelId: defaultHotelId,
      message: `Successfully synced ${syncedRooms.length} rooms`,
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

export const getRoomsByHotel = async (hotelId: string) => {
  try {
    if (!ROOM_COLLECTION_ID) return [];

    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("hotelId", hotelId)]
    );

    return rooms.documents as unknown as Room[];
  } catch (error) {
    console.error("Error fetching rooms by hotel:", error);
    return [];
  }
};

// Get room with full details including hotel
export const getRoomWithHotel = async (roomId: string) => {
  try {
    if (!ROOM_COLLECTION_ID) return null;

    const room = (await databases.getDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId
    )) as unknown as Room;

    // If we have the room and it has a hotelId, try to get hotel details
    let hotel = null;
    if (room.hotelId && HOTEL_COLLECTION_ID) {
      try {
        hotel = (await databases.getDocument(
          DATABASE_ID!,
          HOTEL_COLLECTION_ID!,
          room.hotelId
        )) as unknown as Hotel;
      } catch (error) {
        console.warn("Hotel not found for room:", room.hotelId);
      }
    }

    return {
      ...room,
      hotel,
    };
  } catch (error) {
    console.error("Error fetching room with hotel:", error);
    return null;
  }
};
