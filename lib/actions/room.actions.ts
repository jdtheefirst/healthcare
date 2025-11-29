"use server";

import { ID, InputFile, Query } from "node-appwrite";

import { HotelRoomTypes } from "@/constants";
import { Hotel, Room } from "@/types/appwrite.types";

import {
  BOOKING_COLLECTION_ID,
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  HOTEL_COLLECTION_ID,
  PROJECT_ID,
  ROOM_COLLECTION_ID,
  databases,
  storage,
} from "../appwrite.config";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

// CREATE ROOM
export const createRoom = async (formData: FormData) => {
  try {
    // Extract form data
    const hotelId = formData.get("hotelId") as string;
    const label = formData.get("label") as string;
    const type = formData.get("type") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const rate = parseInt(formData.get("rate") as string);
    const description = formData.get("description") as string;
    const bedCount = formData.get("bedCount") as string;
    const floorNumber = formData.get("floorNumber") as string;
    const amenitiesString = formData.get("amenities") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!hotelId || !label || !type || !capacity || !rate) {
      throw new Error(
        "Missing required fields: hotelId, label, type, capacity, rate"
      );
    }

    // Validate that the hotel exists
    if (!HOTEL_COLLECTION_ID) {
      throw new Error("HOTEL_COLLECTION_ID is not configured");
    }

    const hotel = await databases.getDocument(
      DATABASE_ID!,
      HOTEL_COLLECTION_ID!,
      hotelId
    );

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    // Generate slug from label
    const slug = label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim();

    // Check if Room with same slug already exists
    const existingRooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("slug", slug)]
    );

    if (existingRooms.total > 0) {
      throw new Error("A room with this name already exists");
    }

    let imageUrl = "/assets/images/room-placeholder.jpg";

    // Handle image upload if file exists
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert File to Buffer for Appwrite
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create InputFile for Appwrite
        const inputFile = InputFile.fromBuffer(buffer, imageFile.name);

        // Upload to Appwrite Storage
        const file = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          inputFile
        );

        // Construct the file URL
        // For Appwrite Cloud:
        imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;

        // For self-hosted Appwrite:
        // imageUrl = `https://your-domain/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        console.log("✅ Room image uploaded successfully:", file.$id);
      } catch (uploadError) {
        console.error("❌ Error uploading room image:", uploadError);
        // Continue with placeholder image if upload fails
      }
    }

    // Parse amenities
    const amenities = amenitiesString
      ? amenitiesString
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0)
      : [];

    // Calculate default bedCount if not provided
    const calculatedBedCount = bedCount
      ? parseInt(bedCount)
      : Math.ceil(capacity / 2);

    // Calculate default floorNumber if not provided
    const calculatedFloorNumber = floorNumber ? parseInt(floorNumber) : 1;

    const newRoom = await databases.createDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      ID.unique(),
      {
        hotelId: hotelId,
        label: label,
        type: type,
        slug: slug,
        capacity: capacity,
        amenities: amenities,
        rate: rate,
        pricePerNight: rate,
        bedCount: calculatedBedCount,
        floorNumber: calculatedFloorNumber,
        availabilityStatus: "available",
        availableFrom: new Date().toISOString(),
        availableTo: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 year from now
        description: description || `Comfortable ${type.toLowerCase()} room`,
        image: imageUrl,
      }
    );

    console.log("✅ Room created successfully:", newRoom.$id);

    // Revalidate paths
    revalidatePath("/admin/rooms");
    revalidatePath("/admin/dashboard");
    revalidatePath("/rooms");

    return parseStringify(newRoom);
  } catch (error) {
    console.error("❌ Error creating room:", error);
    throw error;
  }
};

// UPDATE ROOM
export const updateRoom = async (
  roomId: string,
  updates: {
    label?: string;
    type?: string;
    capacity?: number;
    rate?: number;
    description?: string;
    amenities?: string[];
    bedCount?: number;
    floorNumber?: number;
    availabilityStatus?: "available" | "maintenance" | "occupied";
    image?: string;
  }
) => {
  try {
    // Check if room exists
    const existingRoom = await databases.getDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId
    );

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    // If label is being updated, regenerate slug
    let updateData: any = { ...updates };
    if (updates.label) {
      const slug = updates.label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .trim();
      updateData.slug = slug;
    }

    // If rate is updated, also update pricePerNight
    if (updates.rate) {
      updateData.pricePerNight = updates.rate;
    }

    const updatedRoom = await databases.updateDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId,
      updateData
    );

    console.log("✅ Room updated successfully:", roomId);

    revalidatePath("/admin/rooms");
    revalidatePath("/admin/dashboard");
    revalidatePath("/rooms");

    return parseStringify(updatedRoom);
  } catch (error) {
    console.error("❌ Error updating room:", error);
    throw error;
  }
};

// DELETE ROOM
export const deleteRoom = async (roomId: string) => {
  try {
    // Check if room exists
    const existingRoom = await databases.getDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId
    );

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    // Check if room has any active bookings
    if (BOOKING_COLLECTION_ID) {
      const activeBookings = await databases.listDocuments(
        DATABASE_ID!,
        BOOKING_COLLECTION_ID!,
        [Query.equal("roomId", roomId), Query.notEqual("status", "cancelled")]
      );

      if (activeBookings.total > 0) {
        throw new Error(
          "Cannot delete room with active bookings. Cancel bookings first."
        );
      }
    }

    // Delete the room
    await databases.deleteDocument(DATABASE_ID!, ROOM_COLLECTION_ID!, roomId);

    console.log("✅ Room deleted successfully:", roomId);

    revalidatePath("/admin/rooms");
    revalidatePath("/admin/dashboard");
    revalidatePath("/rooms");

    return { success: true, message: "Room deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting room:", error);
    throw error;
  }
};

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

// lib/actions/room.actions.ts
export const getRoomBySlug = async (slug: string) => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("slug", slug)]
    );

    if (rooms.documents.length === 0) return null;

    const room = rooms.documents[0] as unknown as Room;

    // Get hotel details
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

    // Get other rooms from the same hotel
    let similarRooms: Room[] = [];
    if (room.hotelId) {
      try {
        similarRooms = (await databases.listDocuments(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          [
            Query.equal("hotelId", room.hotelId),
            Query.notEqual("$id", room.$id),
            Query.limit(3),
          ]
        )) as unknown as Room[];
      } catch (error) {
        console.warn("Error fetching similar rooms:", error);
      }
    }

    return parseStringify({
      ...room,
      hotel,
      similarRooms,
    });
  } catch (error) {
    console.error("Error fetching room by slug:", error);
    return null;
  }
};
