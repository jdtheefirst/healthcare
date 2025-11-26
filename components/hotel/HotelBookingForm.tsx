"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HotelRoomTypes } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { HotelBookingSchema } from "@/lib/validation";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export const HotelBookingForm = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const firstRoom = HotelRoomTypes[0];
  const form = useForm<z.infer<typeof HotelBookingSchema>>({
    resolver: zodResolver(HotelBookingSchema),
    defaultValues: {
      roomType: firstRoom?.name || "",
      checkIn: new Date(Date.now() + 86400000),
      checkOut: new Date(Date.now() + 86400000 * 2),
      channel: "web",
      specialRequests: "",
    },
  });

  const selectedRoom = HotelRoomTypes.find(
    (room) => room.name === form.watch("roomType")
  );

  const onSubmit = async (values: z.infer<typeof HotelBookingSchema>) => {
    setStatusMessage("Mirroring appointment scheduling logic…");
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log("Hotel booking preview payload", values);
    setStatusMessage("Booking structure ready for `bookings` collection.");
  };

  const stayLength = Math.max(
    1,
    Math.round(
      (form.watch("checkOut").getTime() - form.watch("checkIn").getTime()) /
        86400000
    )
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-dark-400 bg-dark-200/80 p-2 sm:p-6 shadow-lg backdrop-blur"
      >
        <section className="space-y-1">
          <p className="text-12-semibold uppercase text-blue-500">Rooms</p>
          <h2 className="text-18-bold">Booking preferences</h2>
          <p className="text-14-regular text-dark-600">
            Scheduling engine now points to `rooms` availability instead of
            physician calendars.
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="roomType"
          label="Room / room type"
          placeholder="Select a room"
        >
          {HotelRoomTypes.map((room) => (
            <SelectItem key={room.id} value={room.name}>
              <span className="text-14-medium">{room.name}</span>
              <span className="text-12-regular text-dark-600 pl-2">
                Sleeps {room.capacity} • ${room.rate}/night
              </span>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 md:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="checkIn"
            label="Check-in"
            dateFormat="MM/dd/yyyy"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="checkOut"
            label="Check-out"
            dateFormat="MM/dd/yyyy"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="specialRequests"
          label="Special requests"
          placeholder="Hypoallergenic bedding, minibar removal, airport transfers…"
        />

        <section className="rounded-2xl border border-dark-500 bg-dark-400 p-2 sm:p-4 text-7-regular sm:text-14-regular text-dark-600 text-xs">
          <p>
            ✓ SMS & email notifications already wired: `
            {formatDateTime(form.watch("checkIn")).dateDay}` check-in reminder
            mirrors appointment reminder.
          </p>
          <p className="mt-2">
            ✓ {stayLength || 1} night stay auto-syncs with payment intent logic.
          </p>
          {selectedRoom && (
            <p className="mt-2 text-white">{selectedRoom.description}</p>
          )}
          {statusMessage && (
            <p className="mt-2 text-green-500">{statusMessage}</p>
          )}
        </section>

        <SubmitButton
          className="w-full"
          isLoading={form.formState.isSubmitting}
        >
          Hold room & send confirmation
        </SubmitButton>
      </form>
    </Form>
  );
};
