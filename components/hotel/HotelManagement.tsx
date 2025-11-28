// components/hotel/HotelManagement.tsx
"use client";

import { useState } from "react";
import { Hotel } from "@/types/appwrite.types";
import { Button } from "@/components/ui/button";
import { deleteHotel } from "@/lib/actions/hotel.actions";
import { CreateHotelForm } from "./CreateHotelForm";
import { EditHotelForm } from "./EditHotelForm";

interface HotelManagementProps {
  hotels: Hotel[];
  onDataUpdate: () => void;
  onHotelUpdate: (hotel: Hotel) => void;
  onHotelCreate: (hotel: Hotel) => void;
  onHotelDelete: (hotelId: string) => void;
}

export function HotelManagement({
  hotels,
  onDataUpdate,
  onHotelUpdate,
  onHotelCreate,
  onHotelDelete,
}: HotelManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<string | null>(null);

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      setDeletingHotel(hotelId);
      await deleteHotel(hotelId);
      onHotelDelete(hotelId);
      onDataUpdate();
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Failed to delete hotel");
    } finally {
      setDeletingHotel(null);
    }
  };

  if (isCreating) {
    return (
      <CreateHotelForm
        onSuccess={() => {
          setIsCreating(false);
          onDataUpdate();
        }}
        onCancel={() => setIsCreating(false)}
        onHotelCreate={onHotelCreate}
      />
    );
  }

  if (editingHotel) {
    return (
      <EditHotelForm
        hotel={editingHotel}
        onSuccess={() => {
          setEditingHotel(null);
          onDataUpdate();
        }}
        onCancel={() => setEditingHotel(null)}
        onHotelUpdate={onHotelUpdate}
      />
    );
  }

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-24-bold">Manage Hotels</h1>
          <p className="text-16-regular text-dark-700 mt-2">
            Create and manage hotel properties in your system.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="shad-primary-btn rounded-full"
        >
          Add New Hotel
        </Button>
      </div>

      {/* Hotels Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {hotels.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-dark-500 bg-dark-300 p-8 text-center">
            <p className="text-16-regular text-dark-600 mb-4">
              No hotels found
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="shad-primary-btn rounded-full"
            >
              Create Your First Hotel
            </Button>
          </div>
        ) : (
          hotels.map((hotel) => (
            <div
              key={hotel.$id}
              className="rounded-2xl border border-dark-500 bg-dark-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-18-bold">{hotel.name}</h3>
                  <p className="text-14-regular text-dark-600">
                    {hotel.location}
                  </p>
                  {hotel.description && (
                    <p className="text-14-regular text-dark-600 mt-2">
                      {hotel.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingHotel(hotel)}
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteHotel(hotel.$id)}
                    disabled={deletingHotel === hotel.$id}
                    className="rounded-full"
                  >
                    {deletingHotel === hotel.$id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-12-regular text-dark-600">
                <span>Slug: {hotel.slug}</span>
                <span>
                  Created: {new Date(hotel.$createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
