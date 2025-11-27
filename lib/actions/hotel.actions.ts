"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import {
  Booking,
  CreateBookingParams,
  Guest,
  Hotel,
  Room,
  UpdateBookingParams,
} from "@/types/appwrite.types";

import {
  BOOKING_COLLECTION_ID,
  DATABASE_ID,
  GUEST_COLLECTION_ID,
  HOTEL_COLLECTION_ID,
  ROOM_COLLECTION_ID,
  databases,
  messaging,
  users,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

// CREATE GUEST (no auth required - direct collection write)
export const createGuest = async (guest: CreateGuestParams) => {
  try {
    // Check if guest already exists by email
    const existingGuests = await databases.listDocuments(
      DATABASE_ID!,
      GUEST_COLLECTION_ID!,
      [Query.equal("email", [guest.email])]
    );

    if (existingGuests.documents.length > 0) {
      // Return existing guest
      return parseStringify(existingGuests.documents[0] as Guest);
    }

    // Create new guest document
    const newGuest = await databases.createDocument(
      DATABASE_ID!,
      GUEST_COLLECTION_ID!,
      ID.unique(),
      {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        purpose: guest.purpose,
        guestsCount: guest.guestsCount || 1,
        vipNotes: guest.vipNotes || "",
        consent: guest.consent || false,
      }
    );

    return parseStringify(newGuest);
  } catch (error) {
    console.error("An error occurred while creating a new guest:", error);
    throw error;
  }
};

// GET GUEST BY EMAIL
export const getGuestByEmail = async (email: string) => {
  try {
    const guests = await databases.listDocuments(
      DATABASE_ID!,
      GUEST_COLLECTION_ID!,
      [Query.equal("email", [email])]
    );

    return guests.documents.length > 0
      ? parseStringify(guests.documents[0] as Guest)
      : null;
  } catch (error) {
    console.error("An error occurred while retrieving guest:", error);
    return null;
  }
};

// CREATE BOOKING - CORRECTED VERSION
export const createBooking = async (booking: CreateBookingParams) => {
  try {
    // First, get or create guest if guestId not provided
    let guestId = booking.guestId;

    if (!guestId && booking.guestEmail) {
      const existingGuest = (await getGuestByEmail(
        booking.guestEmail
      )) as Guest | null;
      if (existingGuest) {
        guestId = existingGuest.$id;
      } else {
        // Create guest on the fly with required fields
        const newGuest = (await createGuest({
          name: booking.guestName || "Guest",
          email: booking.guestEmail!,
          phone: booking.guestPhone || "+0000000000",
          purpose: (booking.purpose || "Business") as BookingPurpose,
          guestsCount: booking.guestsCount || 1,
        })) as Guest;
        guestId = newGuest.$id;
      }
    }

    if (!guestId) {
      throw new Error("Guest ID or email is required");
    }

    // Resolve hotelId and roomId properly
    let finalHotelId = booking.hotelId || "";
    let finalRoomId = booking.roomId || "";

    // Check if roomId is a valid Appwrite document ID
    const isValidDocumentId = booking.roomId && booking.roomId.length === 13;

    if (isValidDocumentId && ROOM_COLLECTION_ID) {
      try {
        const room = (await databases.getDocument(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          booking.roomId
        )) as unknown as Room;

        // Use the room document's hotelId
        finalHotelId = room.hotelId || finalHotelId;
        finalRoomId = booking.roomId;

        console.log(
          `✅ Using room document: ${room.label} from hotel: ${finalHotelId}`
        );
      } catch (error) {
        console.warn(
          "❌ Room document not found, falling back to roomType:",
          error
        );
        finalRoomId = booking.roomType || booking.roomId;
      }
    } else {
      // Not a document ID, store as roomType string
      finalRoomId = booking.roomType || booking.roomId || "";

      // Try to find a hotel that has this room type
      if (!finalHotelId && HOTEL_COLLECTION_ID && ROOM_COLLECTION_ID) {
        try {
          const rooms = await databases.listDocuments(
            DATABASE_ID!,
            ROOM_COLLECTION_ID!,
            [
              Query.equal("label", booking.roomType || booking.roomId),
              Query.limit(1),
            ]
          );

          if (rooms.documents.length > 0) {
            const room = rooms.documents[0] as unknown as Room;
            finalHotelId = room.hotelId;
            finalRoomId = room.$id;
            console.log(`✅ Found room document for type: ${booking.roomType}`);
          }
        } catch (error) {
          console.warn(
            "Could not find room document for type:",
            booking.roomType
          );
        }
      }
    }

    // If we still don't have a hotelId, use the default hotel
    if (!finalHotelId && HOTEL_COLLECTION_ID) {
      try {
        const hotels = await databases.listDocuments(
          DATABASE_ID!,
          HOTEL_COLLECTION_ID!,
          [Query.limit(1)]
        );
        if (hotels.documents.length > 0) {
          const hotel = hotels.documents[0] as unknown as Hotel;
          finalHotelId = hotel.$id;
          console.log(`✅ Using default hotel: ${finalHotelId}`);
        }
      } catch (error) {
        console.warn(
          "No hotels found, booking will be created without hotelId"
        );
      }
    }

    // Prepare booking data
    const bookingData = {
      guestId: guestId,
      roomId: finalRoomId,
      roomType: booking.roomType || finalRoomId,
      status: booking.status || "pending",
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      specialRequests: booking.specialRequests || "",
      channel: booking.channel || "web",
      purpose: booking.purpose || "Business",
      ...(finalHotelId && { hotelId: finalHotelId }),
    };

    console.log("📝 Creating booking with data:", bookingData);

    // Create booking document
    const newBooking = (await databases.createDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      ID.unique(),
      bookingData
    )) as unknown as Booking;

    console.log("✅ Booking created successfully:", newBooking.$id);

    revalidatePath("/admin/dashboard");
    revalidatePath("/hotel-demo");
    return parseStringify(newBooking);
  } catch (error) {
    console.error("❌ An error occurred while creating a new booking:", error);
    throw error;
  }
};

// GET RECENT BOOKINGS (for admin dashboard)
export const getRecentBookingList = async () => {
  try {
    const bookings = await databases.listDocuments(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // Type the bookings as Booking[]
    const bookingDocuments = bookings.documents as unknown as Booking[];

    // Fetch related guest and room data
    const enrichedBookings = await Promise.all(
      bookingDocuments.map(async (booking) => {
        try {
          const guest = (await databases.getDocument(
            DATABASE_ID!,
            GUEST_COLLECTION_ID!,
            booking.guestId
          )) as unknown as Guest;

          // Try to get room, but handle if it doesn't exist
          let room: Room | { name: string; label: string } = {
            name: booking.roomType || "Unknown Room",
            label: booking.roomType || "Unknown Room",
          };

          // If roomId looks like a document ID, try to fetch it
          if (
            ROOM_COLLECTION_ID &&
            booking.roomId &&
            booking.roomId.length > 10 &&
            !booking.roomId.includes(" ")
          ) {
            try {
              room = (await databases.getDocument(
                DATABASE_ID!,
                ROOM_COLLECTION_ID!,
                booking.roomId
              )) as unknown as Room;
            } catch {
              // Room document doesn't exist, use roomType
              console.warn(`Room document ${booking.roomId} not found`);
            }
          }

          return {
            ...booking,
            guest: parseStringify(guest),
            room: parseStringify(room),
          };
        } catch (error) {
          console.error("Error enriching booking:", error);
          return booking;
        }
      })
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = enrichedBookings.reduce((acc, booking) => {
      switch (booking.status) {
        case "scheduled":
          acc.scheduledCount++;
          break;
        case "pending":
          acc.pendingCount++;
          break;
        case "cancelled":
          acc.cancelledCount++;
          break;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: bookings.total,
      ...counts,
      documents: enrichedBookings,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent bookings:",
      error
    );
    return {
      totalCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      documents: [],
    };
  }
};

// CREATE OR GET GUEST USER (for SMS notifications)
const getOrCreateGuestUser = async (guest: Guest) => {
  try {
    // Check if user already exists by email
    const existingUsers = await users.list([
      Query.equal("email", [guest.email]),
    ]);

    if (existingUsers.users.length > 0) {
      return existingUsers.users[0];
    }

    // Create new Appwrite user for guest (required for SMS)
    const newUser = await users.create(
      ID.unique(),
      guest.email,
      guest.phone,
      undefined,
      guest.name
    );

    return newUser;
  } catch (error: any) {
    // User might already exist (409 conflict)
    if (error?.code === 409) {
      const existingUsers = await users.list([
        Query.equal("email", [guest.email]),
      ]);
      return existingUsers.users[0];
    }
    console.error("Error creating guest user:", error);
    throw error;
  }
};

// SEND HOTEL SMS NOTIFICATION
export const sendHotelSMSNotification = async (
  guest: Guest,
  content: string
) => {
  try {
    // Create or get Appwrite user for guest (required for Appwrite SMS)
    const guestUser = await getOrCreateGuestUser(guest);

    // Send SMS using Appwrite messaging (same as appointments)
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [guestUser.$id]
    );

    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending hotel SMS:", error);
    // Fallback: log the SMS (could integrate Twilio here as alternative)
    console.log(`[SMS Fallback] To ${guest.phone}: ${content}`);
    return { success: false, error };
  }
};

// UPDATE BOOKING (for admin to schedule/cancel)
export const updateBooking = async ({
  bookingId,
  booking,
  type,
  timeZone,
}: UpdateBookingParams) => {
  try {
    const updateData: any = {};

    if (type === "cancel") {
      updateData.status = "cancelled";
      updateData.cancellationReason = booking.cancellationReason;
    } else if (type === "schedule") {
      updateData.status = "scheduled";
    }

    const updatedBooking = (await databases.updateDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      bookingId,
      updateData
    )) as unknown as Booking;

    if (!updatedBooking) throw new Error("Failed to update booking");

    // Get guest for SMS
    const guest = (await databases.getDocument(
      DATABASE_ID!,
      GUEST_COLLECTION_ID!,
      updatedBooking.guestId
    )) as unknown as Guest;

    // Send SMS notification
    const checkInDate = formatDateTime(
      new Date(updatedBooking.checkIn),
      timeZone
    ).dateTime;
    const checkOutDate = formatDateTime(
      new Date(updatedBooking.checkOut),
      timeZone
    ).dateTime;

    const smsMessage =
      type === "schedule"
        ? `Greetings! Your hotel booking is confirmed. Check-in: ${checkInDate}, Check-out: ${checkOutDate}. Room: ${booking.roomType || "TBD"}.`
        : `We regret to inform that your booking for ${checkInDate} is cancelled. Reason: ${booking.cancellationReason || "Not specified"}.`;

    await sendHotelSMSNotification(guest as Guest, smsMessage);

    revalidatePath("/admin/dashboard");
    return parseStringify(updatedBooking);
  } catch (error) {
    console.error("An error occurred while updating booking:", error);
    throw error;
  }
};

// GET BOOKING
export const getBooking = async (bookingId: string) => {
  try {
    const booking = (await databases.getDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      bookingId
    )) as unknown as Booking;

    // Enrich with guest data
    try {
      const guest = (await databases.getDocument(
        DATABASE_ID!,
        GUEST_COLLECTION_ID!,
        booking.guestId
      )) as unknown as Guest;
      // Add guest to booking object
      (booking as any).guest = guest;
    } catch {
      // Guest might not exist
    }

    return parseStringify(booking);
  } catch (error) {
    console.error("An error occurred while retrieving booking:", error);
    return null;
  }
};

export const getBookingWithDetails = async (bookingId: string) => {
  try {
    const booking = (await databases.getDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      bookingId
    )) as unknown as Booking;

    // Fetch guest details
    let guest: Guest | null = null;
    if (booking.guestId) {
      try {
        guest = (await databases.getDocument(
          DATABASE_ID!,
          GUEST_COLLECTION_ID!,
          booking.guestId
        )) as unknown as Guest;
      } catch (error) {
        console.warn("Guest not found for booking:", booking.guestId);
      }
    }

    // Fetch room details if roomId is a document ID
    let room: Room | null = null;
    if (booking.roomId && booking.roomId.length === 13) {
      try {
        room = (await databases.getDocument(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          booking.roomId
        )) as unknown as Room;
      } catch (error) {
        console.warn("Room document not found:", booking.roomId);
      }
    }

    return {
      ...booking,
      guest,
      room,
    };
  } catch (error) {
    console.error("Error fetching booking with details:", error);
    throw error;
  }
};

export const getAllHotels = async () => {
  try {
    const hotels = await databases.listDocuments(
      DATABASE_ID!,
      HOTEL_COLLECTION_ID!
    );
    return hotels.documents;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
};

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await databases.getDocument(
      DATABASE_ID!,
      HOTEL_COLLECTION_ID!,
      hotelId
    );
    return hotel;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
};

export const getRoomsByHotel = async (hotelId: string) => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("hotelId", hotelId)]
    );
    return rooms.documents;
  } catch (error) {
    console.error("Error fetching rooms by hotel:", error);
    return [];
  }
};

export const getRoomById = async (roomId: string) => {
  try {
    if (!ROOM_COLLECTION_ID) return null;

    const room = await databases.getDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomId
    );
    return room;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};
