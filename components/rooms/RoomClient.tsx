// components/rooms/RoomClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  MapPin,
  Users,
  Bed,
  Building,
  Star,
  Calendar,
  ArrowLeft,
  Wifi,
  Tv,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room, Hotel } from "@/types/appwrite.types";
import { RoomShare } from "@/components/rooms/RoomShare";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { SimilarRooms } from "@/components/rooms/SimilarRooms";
import { BookingWidget } from "@/components/booking/BookingWidget";

interface RoomClientProps {
  roomData: Room & {
    hotel: Hotel;
    similarRooms: Room[];
  };
}

export function RoomClient({ roomData }: RoomClientProps) {
  const [showShare, setShowShare] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    roomData.image,
    "/assets/images/room-2.jpg", // You can add more images
    "/assets/images/room-3.jpg",
  ].filter((img): img is string => Boolean(img));

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="h-4 w-4" />;
    if (lowerAmenity.includes("tv")) return <Tv className="h-4 w-4" />;
    if (lowerAmenity.includes("air") || lowerAmenity.includes("ac"))
      return <Wind className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <header className="border-b border-dark-400 bg-dark-200">
        <div className="mx-auto max-w-7xl px-[5%] py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/rooms"
              className="flex items-center gap-2 text-14-regular text-dark-600 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Rooms
            </Link>

            <Button
              variant="outline"
              onClick={() => setShowShare(true)}
              className="rounded-full border-dark-400"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-2 sm:px-[5%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Gallery */}
            <RoomGallery
              images={images}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />

            {/* Room Header */}
            <div className="rounded-3xl border border-dark-400 bg-dark-200 p-3 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-32-bold mb-2">{roomData.label}</h1>
                  <div className="flex items-center gap-4 text-14-regular text-dark-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {roomData.hotel?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {roomData.hotel?.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {roomData.capacity} Guests
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-24-bold text-green-500">
                    ${roomData.pricePerNight}
                    <span className="text-14-regular text-dark-600 ml-1">
                      /night
                    </span>
                  </div>
                  <div className="text-14-regular text-dark-600">
                    {roomData.availabilityStatus === "available" ? (
                      <span className="text-green-500">Available</span>
                    ) : (
                      <span className="text-red-500">Not Available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="rounded-3xl border border-dark-400 bg-dark-200 p-3 sm:p-6">
              <h2 className="text-20-bold mb-4 ">Description</h2>
              <p className="text-16-regular text-dark-700 leading-relaxed">
                {roomData.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="rounded-3xl border border-dark-400 bg-dark-200 p-3 sm:p-6">
              <h2 className="text-20-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roomData.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-dark-300"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-14-regular">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Room Details */}
            <section className="rounded-3xl border border-dark-400 bg-dark-200 p-3 sm:p-6">
              <h2 className="text-20-bold mb-6">Room Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-14-medium">
                    {roomData.bedCount} Bed{roomData.bedCount !== 1 ? "s" : ""}
                  </div>
                  <div className="text-12-regular text-dark-600">
                    Comfortable
                  </div>
                </div>

                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-14-medium">
                    {roomData.capacity} Guest
                    {roomData.capacity !== 1 ? "s" : ""}
                  </div>
                  <div className="text-12-regular text-dark-600">Capacity</div>
                </div>

                <div className="text-center">
                  <Building className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-14-medium">
                    Floor {roomData.floorNumber}
                  </div>
                  <div className="text-12-regular text-dark-600">Location</div>
                </div>

                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-14-medium">{roomData.type}</div>
                  <div className="text-12-regular text-dark-600">Room Type</div>
                </div>
              </div>
            </section>

            {/* Hotel Information */}
            {roomData.hotel && (
              <section className="rounded-3xl border border-dark-400 bg-dark-200 p-3 sm:p-6">
                <h2 className="text-20-bold mb-4">Hotel Information</h2>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-18-semibold mb-2">
                      {roomData.hotel.name}
                    </h3>
                    <p className="text-14-regular text-dark-600 mb-3">
                      {roomData.hotel.location}
                    </p>
                    <p className="text-14-regular text-dark-700">
                      {roomData.hotel.description}
                    </p>

                    {roomData.hotel.amenities &&
                      roomData.hotel.amenities.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-14-medium mb-2">
                            Hotel Amenities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {roomData.hotel.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-dark-300 rounded-full text-12-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </section>
            )}

            {/* Similar Rooms */}
            {roomData.similarRooms && roomData.similarRooms.length > 0 && (
              <SimilarRooms
                rooms={roomData.similarRooms}
                currentRoomId={roomData.$id}
              />
            )}
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingWidget room={roomData} />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <RoomShare room={roomData} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
