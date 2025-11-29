import { Room } from "@/types/appwrite.types";
import Link from "next/link";

// Room Card Component - Updated to include hotelId in URL
export default function RoomCard({
  room,
  hotelName,
}: {
  room: Room | any;
  hotelName?: string;
}) {
  const roomData = {
    id: room.$id,
    name: room.label || room.name,
    slug: room.slug,
    type: room.type,
    capacity: room.capacity,
    rate: room.rate || room.pricePerNight,
    amenities: room.amenities || [],
    description: room.description,
    image: room.image || "/assets/images/room-placeholder.jpg",
    hotelId: room.hotelId, // Include hotelId
  };

  console.log("RoomCard roomData:", roomData);

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
          <Link
            href={`/rooms/${roomData.slug}`}
            className="text-18-semibold text-dark-800 hover:text-green-500 transition-colors"
          >
            {roomData.name}
          </Link>
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
