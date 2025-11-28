// app/rooms/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllRooms } from "@/lib/actions/room.actions";
import { getAllHotels } from "@/lib/actions/hotel.actions";
import { HotelRoomTypes } from "@/constants";
import { Hotel, Room } from "@/types/appwrite.types";
import RoomsFilter from "@/components/hotel/RoomsFilter";

export default async function RoomsPage() {
  // Try to get rooms from Appwrite first, fallback to constants
  let rooms = (await getAllRooms()) as Room[];
  const hotels = (await getAllHotels()) as Hotel[];

  // If no rooms in Appwrite, use constants with proper hotel assignment
  if (!rooms || rooms.length === 0) {
    // Assign rooms to the first hotel if available, otherwise use "default"
    const defaultHotelId =
      hotels.length > 0 ? hotels[0].$id : HotelRoomTypes[0].hotelId;

    rooms = HotelRoomTypes.map((room) => ({
      ...room,
      $id: room.id,
      hotelId: defaultHotelId,
      pricePerNight: room.rate, // Add missing fields for consistency
      availabilityStatus: "available",
      bedCount: Math.ceil(room.capacity / 2),
      floorNumber: 1,
    })) as any[];
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-36-bold">Available Rooms</h1>
            <p className="text-16-regular text-dark-700 mt-2">
              Choose your perfect room for a comfortable stay
            </p>
          </div>
          <Link
            href="/hotel-demo"
            className="shad-gray-btn rounded-full px-5 py-2"
          >
            Back to Hotel Demo
          </Link>
        </header>

        {/* Hotels Filter (if multiple hotels) & Rooms Grid  */}
        <RoomsFilter rooms={rooms} hotels={hotels} />

        {/* Sync Notice for Admin */}
        <div className="mt-12 rounded-2xl border border-dark-400 bg-dark-200 p-6 text-center">
          <p className="text-14-regular text-dark-600 mb-4">
            Don't see the rooms you expected?
          </p>
          <Link
            href="/admin/rooms"
            className="shad-primary-btn rounded-full px-6 py-3"
          >
            Sync Rooms to Database
          </Link>
        </div>
      </main>
    </div>
  );
}
