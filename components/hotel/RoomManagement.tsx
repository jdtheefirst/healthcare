// components/hotel/RoomManagement.tsx
"use client";

import { useState } from "react";
import { Room, Hotel } from "@/types/appwrite.types";
import { Button } from "@/components/ui/button";
import { deleteRoom, updateRoom } from "@/lib/actions/room.actions";
import { CreateRoomForm } from "./CreateRoomForm";
import { EditRoomForm } from "./EditRoomForm";

interface RoomManagementProps {
  rooms: Room[];
  hotels: Hotel[];
  onDataUpdate: () => void;
  onRoomUpdate: (room: Room) => void;
  onRoomCreate: (room: Room) => void;
  onRoomDelete: (roomId: string) => void;
}

export function RoomManagement({
  rooms,
  hotels,
  onDataUpdate,
  onRoomUpdate,
  onRoomCreate,
  onRoomDelete,
}: RoomManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<string | null>(null);

  const handleDeleteRoom = async (roomId: string) => {
    try {
      setDeletingRoom(roomId);
      await deleteRoom(roomId);
      onRoomDelete(roomId);
      onDataUpdate();
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    } finally {
      setDeletingRoom(null);
    }
  };

  const handleToggleAvailability = async (room: Room) => {
    try {
      await updateRoom(room.$id, {
        availabilityStatus:
          room.availabilityStatus === "available" ? "maintenance" : "available",
      });
      onDataUpdate();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room availability");
    }
  };

  if (isCreating) {
    return (
      <CreateRoomForm
        hotels={hotels}
        onSuccess={() => {
          setIsCreating(false);
          onDataUpdate();
        }}
        onCancel={() => setIsCreating(false)}
        onRoomCreate={onRoomCreate}
      />
    );
  }

  if (editingRoom) {
    return (
      <EditRoomForm
        room={editingRoom}
        hotels={hotels}
        onSuccess={() => {
          setEditingRoom(null);
          onDataUpdate();
        }}
        onCancel={() => setEditingRoom(null)}
        onRoomUpdate={onRoomUpdate}
      />
    );
  }

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-24-bold">Manage Rooms</h1>
          <p className="text-16-regular text-dark-700 mt-2">
            Create, edit, and manage your room inventory across all hotels.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="shad-primary-btn rounded-full"
        >
          Add New Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4">
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dark-500 bg-dark-300 p-8 text-center">
            <p className="text-16-regular text-dark-600 mb-4">No rooms found</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="shad-primary-btn rounded-full"
            >
              Create Your First Room
            </Button>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.$id}
              className="rounded-2xl border border-dark-500 bg-dark-300 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-18-bold">{room.label}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-12-semibold ${
                        room.availabilityStatus === "available"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {room.availabilityStatus}
                    </span>
                  </div>
                  <p className="text-14-regular text-dark-600 mb-2">
                    {room.type} • Sleeps {room.capacity} • ${room.rate}/night
                  </p>
                  <p className="text-14-regular text-dark-600">
                    Hotel:{" "}
                    {hotels.find((h) => h.$id === room.hotelId)?.name ||
                      "Unknown"}
                  </p>
                  {room.description && (
                    <p className="text-14-regular text-dark-600 mt-2">
                      {room.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingRoom(room)}
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAvailability(room)}
                    className="rounded-full"
                  >
                    {room.availabilityStatus === "available"
                      ? "Mark Maintenance"
                      : "Mark Available"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRoom(room.$id)}
                    disabled={deletingRoom === room.$id}
                    className="rounded-full"
                  >
                    {deletingRoom === room.$id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
