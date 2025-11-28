// components/rooms/SimilarRooms.tsx
import Link from "next/link";
import Image from "next/image";
import { Room } from "@/types/appwrite.types";
import { Button } from "@/components/ui/button";

interface SimilarRoomsProps {
  rooms: Room[];
  currentRoomId: string;
}

export function SimilarRooms({ rooms, currentRoomId }: SimilarRoomsProps) {
  const filteredRooms = rooms.filter((room) => room.$id !== currentRoomId);

  if (filteredRooms.length === 0) return null;

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-6">
      <h2 className="text-20-bold mb-6">Similar Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <Link
            key={room.$id}
            href={`/rooms/${room.slug}`}
            className="block group"
          >
            <div className="rounded-2xl border border-dark-400 bg-dark-300 overflow-hidden transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-lg">
              <div className="relative aspect-video">
                <Image
                  src={room.image || "/assets/images/room-placeholder.jpg"}
                  alt={room.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-16-semibold mb-1 group-hover:text-blue-500 transition-colors">
                  {room.label}
                </h3>
                <p className="text-14-regular text-dark-600 mb-2">
                  {room.type} • {room.capacity} Guests
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-16-semibold text-green-500">
                    ${room.pricePerNight}
                    <span className="text-12-regular text-dark-600">
                      /night
                    </span>
                  </span>
                  <Button size="sm" className="rounded-full">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
