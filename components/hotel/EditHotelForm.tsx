// components/hotel/EditHotelForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hotel } from "@/types/appwrite.types";
import { updateHotel } from "@/lib/actions/hotel.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";

const hotelSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().optional(),
  amenities: z.string().optional(),
});

interface EditHotelFormProps {
  hotel: Hotel;
  onSuccess: () => void;
  onCancel: () => void;
  onHotelUpdate: (hotel: Hotel) => void;
}

export function EditHotelForm({
  hotel,
  onSuccess,
  onCancel,
  onHotelUpdate,
}: EditHotelFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof hotelSchema>>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || "",
      amenities: hotel.amenities?.join(", ") || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof hotelSchema>) => {
    setIsLoading(true);
    try {
      await updateHotel(hotel.$id, {
        ...values,
        amenities: values.amenities
          ? values.amenities.split(",").map((a) => a.trim())
          : [],
      });
      onHotelUpdate({
        ...hotel,
        ...values,
        amenities: values.amenities
          ? values.amenities.split(",").map((a) => a.trim())
          : [],
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("Failed to update hotel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-8">
      <h2 className="text-24-bold mb-6">Edit Hotel: {hotel.name}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Hotel Name"
            placeholder="e.g., Grand Plaza Hotel"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="location"
            label="Location"
            placeholder="e.g., New York, NY"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label="Description"
            placeholder="Describe the hotel and its features..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="amenities"
            label="Hotel Amenities (comma-separated)"
            placeholder="Swimming Pool, Gym, Restaurant, Spa..."
          />

          <div className="rounded-2xl border border-dark-500 bg-dark-300 p-4">
            <p className="text-14-medium mb-2">Hotel Information:</p>
            <div className="text-14-regular text-dark-600 space-y-1">
              <p>Slug: {hotel.slug}</p>
              <p>Created: {new Date(hotel.$createdAt).toLocaleDateString()}</p>
              <p>
                Last Updated: {new Date(hotel.$updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="shad-primary-btn flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Hotel"}
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
