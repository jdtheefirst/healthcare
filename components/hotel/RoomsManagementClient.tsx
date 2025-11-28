// components/hotel/AdminManagementClient.tsx
"use client";

import { useState, useTransition } from "react";
import { SyncRoomsForm } from "@/components/hotel/SyncRoomsForm";
import { RoomManagement } from "@/components/hotel/RoomManagement";
import { HotelManagement } from "@/components/hotel/HotelManagement";
import { Button } from "@/components/ui/button";
import { Room, Hotel } from "@/types/appwrite.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ManagementView = "rooms" | "hotels" | "sync";

interface AdminManagementClientProps {
  initialRooms: Room[];
  initialHotels: Hotel[];
}

const AdminManagementClient = ({
  initialRooms,
  initialHotels,
}: AdminManagementClientProps) => {
  const [activeView, setActiveView] = useState<ManagementView>("rooms");
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDataUpdate = () => {
    // Refresh the server component to get fresh data
    startTransition(() => {
      router.refresh();
    });
  };

  // Optimistic updates for immediate UI feedback
  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms((prev) =>
      prev.map((room) => (room.$id === updatedRoom.$id ? updatedRoom : room))
    );
  };

  const handleRoomCreate = (newRoom: Room) => {
    setRooms((prev) => [...prev, newRoom]);
  };

  const handleRoomDelete = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.$id !== roomId));
  };

  const handleHotelUpdate = (updatedHotel: Hotel) => {
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.$id === updatedHotel.$id ? updatedHotel : hotel
      )
    );
  };

  const handleHotelCreate = (newHotel: Hotel) => {
    setHotels((prev) => [...prev, newHotel]);
  };

  const handleHotelDelete = (hotelId: string) => {
    setHotels((prev) => prev.filter((hotel) => hotel.$id !== hotelId));
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-2 sm:px-[5%] py-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="rounded-full border border-dark-400 px-3 py-1 text-14-semibold">
            Hotel & Room Management
          </h1>
        </div>
        <Link
          href="/admin/dashboard"
          className="shad-gray-btn rounded-full px-5 py-2"
        >
          Back to Dashboard
        </Link>
      </header>
      {/* Loading indicator during refresh */}
      {isPending && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full">
          Refreshing...
        </div>
      )}

      {/* Navigation Tabs */}
      <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={activeView === "rooms" ? "default" : "outline"}
            onClick={() => setActiveView("rooms")}
            className="rounded-full"
          >
            Manage Rooms
          </Button>
          <Button
            variant={activeView === "hotels" ? "default" : "outline"}
            onClick={() => setActiveView("hotels")}
            className="rounded-full"
          >
            Manage Hotels
          </Button>
          <Button
            variant={activeView === "sync" ? "default" : "outline"}
            onClick={() => setActiveView("sync")}
            className="rounded-full"
          >
            Sync Default Rooms
          </Button>
        </div>
      </section>

      {/* Content Based on Active View */}
      <>
        {/* Room Management View */}
        {activeView === "rooms" && (
          <RoomManagement
            rooms={rooms}
            hotels={hotels}
            onDataUpdate={handleDataUpdate}
            onRoomUpdate={handleRoomUpdate}
            onRoomCreate={handleRoomCreate}
            onRoomDelete={handleRoomDelete}
          />
        )}

        {/* Hotel Management View */}
        {activeView === "hotels" && (
          <HotelManagement
            hotels={hotels}
            onDataUpdate={handleDataUpdate}
            onHotelUpdate={handleHotelUpdate}
            onHotelCreate={handleHotelCreate}
            onHotelDelete={handleHotelDelete}
          />
        )}

        {/* Sync View */}
        {activeView === "sync" && (
          <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
            <h1 className="text-24-bold mb-4">Sync Default Rooms</h1>
            <p className="text-16-regular text-dark-700 mb-6">
              This will create or update room documents in Appwrite based on the
              HotelRoomTypes constants. Use this to initialize your room
              inventory.
            </p>

            <SyncRoomsForm onSyncComplete={handleDataUpdate} />

            <div className="mt-6 rounded-2xl border border-dark-500 bg-dark-300 p-4">
              <p className="text-14-medium mb-2">What this does:</p>
              <ul className="list-disc list-inside space-y-1 text-14-regular text-dark-600">
                <li>
                  Creates or updates room documents in the `rooms` collection
                </li>
                <li>
                  Links rooms to the default hotel (or creates one if needed)
                </li>
                <li>Maps HotelRoomTypes constants to Appwrite documents</li>
                <li>Enables bookings to reference actual room IDs</li>
              </ul>
            </div>
          </section>
        )}
      </>
    </div>
  );
};

export default AdminManagementClient;
