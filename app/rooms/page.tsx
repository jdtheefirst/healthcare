// app/rooms/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllRooms } from "@/lib/actions/room.actions";
import { getAllHotels } from "@/lib/actions/hotel.actions";
import { HotelRoomTypes } from "@/constants";
import { Hotel, Room } from "@/types/appwrite.types";

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

        {/* Hotels Filter (if multiple hotels) */}
        {hotels.length > 1 && (
          <section className="mb-8">
            <h2 className="text-18-bold mb-4">Select Hotel</h2>
            <div className="flex flex-wrap gap-3">
              {hotels.map((hotel) => (
                <Button
                  key={hotel.$id}
                  variant="outline"
                  className="rounded-full border-dark-400"
                >
                  {hotel.name}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Rooms Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.$id}
              room={room}
              // Pass hotel name for display if available
              hotelName={hotels.find((h) => h.$id === room.hotelId)?.name}
            />
          ))}
        </section>

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

// Room Card Component - Updated to include hotelId in URL
function RoomCard({
  room,
  hotelName,
}: {
  room: Room | any;
  hotelName?: string;
}) {
  const roomData = {
    id: room.$id,
    name: room.label || room.name,
    type: room.type,
    capacity: room.capacity,
    rate: room.rate || room.pricePerNight,
    amenities: room.amenities || [],
    description: room.description,
    image: room.image || "/assets/images/room-placeholder.jpg",
    hotelId: room.hotelId, // Include hotelId
  };

  return (
    <div className="rounded-3xl border border-dark-400 bg-dark-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Room Image */}
      <div className="aspect-[4/3] bg-dark-300 relative">
        <img
          src={roomData.image}
          alt={roomData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-12-semibold">
          ${roomData.rate}/night
        </div>
        {hotelName && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-12-regular">
            {hotelName}
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-18-bold">{roomData.name}</h3>
          <span className="text-12-regular text-dark-600 bg-dark-400 px-2 py-1 rounded">
            {roomData.type}
          </span>
        </div>

        <p className="text-14-regular text-dark-600 mb-4 line-clamp-2">
          {roomData.description ||
            `Comfortable ${roomData.type.toLowerCase()} room perfect for your stay.`}
        </p>

        {/* Capacity */}
        <div className="flex items-center gap-2 mb-4 text-14-regular text-dark-600">
          <span>👤 Sleeps {roomData.capacity}</span>
          <span>•</span>
          <span>🛏️ {Math.ceil(roomData.capacity / 2)} beds</span>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <p className="text-12-semibold text-dark-600 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-2">
            {roomData.amenities
              .slice(0, 3)
              .map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="text-12-regular text-dark-600 bg-dark-400 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
            {roomData.amenities.length > 3 && (
              <span className="text-12-regular text-dark-600">
                +{roomData.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Book Button - Now includes hotelId in URL */}
        <Link
          href={`/hotel-demo?roomId=${roomData.id}&roomName=${encodeURIComponent(roomData.name)}&hotelId=${roomData.hotelId}&scrollTo=booking-form`}
          className="shad-primary-btn w-full rounded-full py-3 text-center block"
        >
          Select Room
        </Link>
      </div>
    </div>
  );
}
