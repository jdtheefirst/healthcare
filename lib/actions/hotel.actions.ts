"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Booking, Guest } from "@/types/appwrite.types";

import {
  BOOKING_COLLECTION_ID,
  DATABASE_ID,
  GUEST_COLLECTION_ID,
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

// CREATE BOOKING
export const createBooking = async (booking: CreateBookingParams) => {
  try {
    // First, get or create guest if guestId not provided
    let guestId = booking.guestId;

    if (!guestId && booking.guestEmail) {
      const existingGuest = await getGuestByEmail(booking.guestEmail);
      if (existingGuest) {
        guestId = existingGuest.$id;
      } else {
        // Create guest on the fly
        const newGuest = await createGuest({
          name: booking.guestName || "Guest",
          email: booking.guestEmail!,
          phone: booking.guestPhone || "",
          purpose: booking.purpose || "Business",
          guestsCount: booking.guestsCount || 1,
        });
        guestId = newGuest.$id;
      }
    }

    if (!guestId) {
      throw new Error("Guest ID or email is required");
    }

    // Get room to extract hotelId (if roomId is a document ID)
    let hotelId = booking.hotelId || "";
    let roomId = booking.roomId || "";
    
    // If roomId looks like a document ID (not a room type string), try to fetch it
    if (ROOM_COLLECTION_ID && booking.roomId && booking.roomId.length > 10) {
      try {
        const room = await databases.getDocument(
          DATABASE_ID!,
          ROOM_COLLECTION_ID!,
          booking.roomId
        );
        hotelId = (room as any).hotelId || hotelId;
        roomId = booking.roomId;
      } catch (error) {
        // Room document doesn't exist, store roomType as string
        console.warn("Room document not found, storing roomType:", error);
        roomId = booking.roomType || booking.roomId;
      }
    } else {
      // Store roomType directly (from constants)
      roomId = booking.roomType || booking.roomId || "";
    }

    // Create booking document
    const newBooking = await databases.createDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      ID.unique(),
      {
        guestId: guestId,
        roomId: roomId, // Can be document ID or room type string
        roomType: booking.roomType || roomId, // Store for display
        hotelId: hotelId,
        status: booking.status || "pending",
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        specialRequests: booking.specialRequests || "",
        channel: booking.channel || "web",
        purpose: booking.purpose || "Business",
      }
    );

    revalidatePath("/admin/dashboard");
    revalidatePath("/hotel-demo");
    return parseStringify(newBooking);
  } catch (error) {
    console.error("An error occurred while creating a new booking:", error);
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

    // Fetch related guest and room data
    const enrichedBookings = await Promise.all(
      bookings.documents.map(async (booking) => {
        try {
          const guest = await databases.getDocument(
            DATABASE_ID!,
            GUEST_COLLECTION_ID!,
            booking.guestId
          );

          // Try to get room, but handle if it doesn't exist
          let room: any = null;
          const bookingData = booking as any;
          
          // If roomId looks like a document ID, try to fetch it
          if (
            ROOM_COLLECTION_ID &&
            booking.roomId &&
            booking.roomId.length > 10 &&
            !booking.roomId.includes(" ")
          ) {
            try {
              room = await databases.getDocument(
                DATABASE_ID!,
                ROOM_COLLECTION_ID!,
                booking.roomId
              );
            } catch {
              // Room document doesn't exist, use roomType
              room = {
                name: bookingData.roomType || booking.roomId || "Unknown Room",
                label: bookingData.roomType || booking.roomId || "Unknown Room",
              };
            }
          } else {
            // roomId is actually a roomType string
            room = {
              name: bookingData.roomType || booking.roomId || "Unknown Room",
              label: bookingData.roomType || booking.roomId || "Unknown Room",
            };
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

    const counts = (enrichedBookings as Booking[]).reduce(
      (acc, booking) => {
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
      },
      initialCounts
    );

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
}: {
  bookingId: string;
  booking: Partial<Booking>;
  type: "schedule" | "cancel";
  timeZone?: string;
}) => {
  try {
    const updateData: any = {
      status: type === "schedule" ? "scheduled" : "cancelled",
      ...booking,
    };

    if (type === "cancel" && booking.cancellationReason) {
      updateData.cancellationReason = booking.cancellationReason;
    }

    const updatedBooking = await databases.updateDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      bookingId,
      updateData
    );

    if (!updatedBooking) throw Error;

    // Get guest for SMS
    const guest = await databases.getDocument(
      DATABASE_ID!,
      GUEST_COLLECTION_ID!,
      updatedBooking.guestId
    );

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
    const booking = await databases.getDocument(
      DATABASE_ID!,
      BOOKING_COLLECTION_ID!,
      bookingId
    );

    // Enrich with guest data
    try {
      const guest = await databases.getDocument(
        DATABASE_ID!,
        GUEST_COLLECTION_ID!,
        booking.guestId
      );
      booking.guest = guest;
    } catch {
      // Guest might not exist
    }

    return parseStringify(booking);
  } catch (error) {
    console.error("An error occurred while retrieving booking:", error);
    return null;
  }
};

