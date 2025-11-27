// lib/type-guards.ts
import { Booking, Room, Hotel, Guest } from "@/types/appwrite.types";

// Type guards to safely check document types
export function isBooking(document: any): document is Booking {
  return (
    document &&
    typeof document.guestId === "string" &&
    typeof document.roomId === "string" &&
    document.checkIn instanceof Date
  );
}

export function isRoom(document: any): document is Room {
  return (
    document &&
    typeof document.hotelId === "string" &&
    typeof document.label === "string"
  );
}

export function isHotel(document: any): document is Hotel {
  return (
    document &&
    typeof document.name === "string" &&
    typeof document.location === "string"
  );
}

export function isGuest(document: any): document is Guest {
  return (
    document &&
    typeof document.name === "string" &&
    typeof document.email === "string"
  );
}
