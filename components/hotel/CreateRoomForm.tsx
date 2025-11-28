// components/hotel/CreateRoomForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hotel } from "@/types/appwrite.types";
import { createRoom } from "@/lib/actions/room.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";

const roomSchema = z.object({
  hotelId: z.string().min(1, "Please select a hotel"),
  label: z.string().min(2, "Room name must be at least 2 characters"),
  type: z.string().min(1, "Please select a room type"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  rate: z.number().min(0, "Rate must be a positive number"),
  description: z.string().optional(),
  amenities: z.string().optional(),
  image: z.any().optional(),
  bedCount: z.number().optional(),
  floorNumber: z.number().optional(),
});

interface CreateRoomFormProps {
  hotels: Hotel[];
  onSuccess: () => void;
  onCancel: () => void;
  onRoomCreate: (room: any) => void;
}

export function CreateRoomForm({
  hotels,
  onSuccess,
  onCancel,
  onRoomCreate,
}: CreateRoomFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      hotelId: hotels[0]?.$id || "",
      label: "",
      type: "",
      capacity: 2,
      rate: 100,
      description: "",
      amenities: "",
      image: null,
      bedCount: undefined,
      floorNumber: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof roomSchema>) => {
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all room data
      formData.append("hotelId", values.hotelId);
      formData.append("label", values.label);
      formData.append("type", values.type);
      formData.append("capacity", values.capacity.toString());
      formData.append("rate", values.rate.toString());
      formData.append("description", values.description || "");
      formData.append("bedCount", values.bedCount?.toString() || "");
      formData.append("floorNumber", values.floorNumber?.toString() || "");
      formData.append(
        "amenities",
        values.amenities
          ? values.amenities
              .split(",")
              .map((a) => a.trim())
              .join(",")
          : ""
      );

      // Append the image file if it exists
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]); // Directly append the file
      }

      // Use FormData in the server action
      await createRoom(formData);
      onRoomCreate(values);
      onSuccess();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
      <h2 className="text-24-bold mb-6">Create New Room</h2>

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
              <SelectItem key={hotel.$id} value={hotel.$id}>
                <span className="text-14-medium">{hotel.name}</span>
                <span className="text-12-regular text-dark-600 pl-2">
                  {hotel.location}
                </span>
              </SelectItem>
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
              <SelectItem value="Suite">Suite</SelectItem>
              <SelectItem value="King">King</SelectItem>
              <SelectItem value="Queen">Queen</SelectItem>
              <SelectItem value="Twin">Twin</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
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

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="image"
            label="Add Room Image"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="shad-primary-btn flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Room"}
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
