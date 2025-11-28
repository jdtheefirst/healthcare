// components/hotel/EditRoomForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Room, Hotel } from "@/types/appwrite.types";
import { updateRoom } from "@/lib/actions/room.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";

const roomSchema = z.object({
  hotelId: z.string().min(1, "Please select a hotel"),
  label: z.string().min(2, "Room name must be at least 2 characters"),
  type: z.string().min(1, "Please select a room type"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  rate: z.number().min(0, "Rate must be a positive number"),
  description: z.string().optional(),
  amenities: z.string().optional(),
  availabilityStatus: z.enum(["available", "maintenance", "occupied"]),
});

interface EditRoomFormProps {
  room: Room;
  hotels: Hotel[];
  onSuccess: () => void;
  onCancel: () => void;
  onRoomUpdate: (room: Room) => void;
}

export function EditRoomForm({
  room,
  hotels,
  onSuccess,
  onCancel,
  onRoomUpdate,
}: EditRoomFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      hotelId: room.hotelId,
      label: room.label,
      type: room.type,
      capacity: room.capacity,
      rate: room.rate,
      description: room.description || "",
      amenities: room.amenities?.join(", ") || "",
      availabilityStatus: room.availabilityStatus as
        | "available"
        | "maintenance"
        | "occupied",
    },
  });

  const onSubmit = async (values: z.infer<typeof roomSchema>) => {
    setIsLoading(true);
    try {
      const amenitiesArray = values.amenities
        ? values.amenities.split(",").map((a) => a.trim())
        : [];
      await updateRoom(room.$id, {
        ...values,
        amenities: amenitiesArray,
      });
      onRoomUpdate({ ...room, ...values, amenities: amenitiesArray });
      onSuccess();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
      <h2 className="text-24-bold mb-6">Edit Room: {room.label}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="hotelId"
            label="Hotel"
            placeholder="Select hotel"
          >
            {hotels.map((hotel) => (
              <option key={hotel.$id} value={hotel.$id}>
                {hotel.name} - {hotel.location}
              </option>
            ))}
          </CustomFormField>

          <div className="grid gap-6 md:grid-cols-2">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="label"
              label="Room Name"
              placeholder="e.g., Ocean View Suite"
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="type"
              label="Room Type"
              placeholder="Select type"
            >
              <option value="Suite">Suite</option>
              <option value="King">King</option>
              <option value="Queen">Queen</option>
              <option value="Twin">Twin</option>
              <option value="Apartment">Apartment</option>
            </CustomFormField>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="capacity"
              label="Capacity"
              placeholder="2"
              inputType="number"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="rate"
              label="Nightly Rate ($)"
              placeholder="100"
              inputType="number"
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="availabilityStatus"
            label="Availability Status"
          >
            <option value="available">Available</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="occupied">Occupied</option>
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label="Description"
            placeholder="Describe the room features and amenities..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="amenities"
            label="Amenities (comma-separated)"
            placeholder="WiFi, TV, Air Conditioning, Mini Bar..."
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="shad-primary-btn flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Room"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
