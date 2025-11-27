"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HotelRoomTypes } from "@/constants";
import {
  createBooking,
  getGuestByEmail,
  updateBooking,
} from "@/lib/actions/hotel.actions";
import { getAllRooms, getRoomByName } from "@/lib/actions/room.actions";
import { formatDateTime } from "@/lib/utils";
import { CancelBookingSchema, HotelBookingSchema } from "@/lib/validation";
import { Booking } from "@/types/appwrite.types";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

type HotelBookingFormProps = {
  guestId?: string;
  guestEmail?: string;
  booking?: Booking;
  type?: "create" | "schedule" | "cancel";
  setOpen?: (open: boolean) => void;
};

export const HotelBookingForm = ({
  guestId,
  guestEmail: propGuestEmail,
  booking,
  type = "create",
  setOpen,
}: HotelBookingFormProps = {}) => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState<string | null>(
    propGuestEmail || null
  );
  const [rooms, setRooms] = useState<any[]>([]);
  const [useRealRooms, setUseRealRooms] = useState(false);

  // Get guest info from sessionStorage if available
  useEffect(() => {
    if (typeof window !== "undefined" && !propGuestEmail) {
      const storedEmail = sessionStorage.getItem("hotelGuestEmail");
      if (storedEmail) {
        setGuestEmail(storedEmail);
      }
    }
  }, [propGuestEmail]);

  // Fetch rooms from Appwrite on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const appwriteRooms = await getAllRooms();
        if (appwriteRooms && appwriteRooms.length > 0) {
          setRooms(appwriteRooms);
          setUseRealRooms(true);
        } else {
          // Fallback to constants if no rooms in Appwrite
          setRooms(HotelRoomTypes);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms(HotelRoomTypes);
      }
    };
    fetchRooms();
  }, []);

  const availableRooms = useRealRooms ? rooms : HotelRoomTypes;
  const firstRoom = availableRooms[0];

  // Use appropriate schema based on type
  const BookingFormValidation =
    type === "cancel" ? CancelBookingSchema : HotelBookingSchema;

  const form = useForm<z.infer<typeof BookingFormValidation>>({
    resolver: zodResolver(BookingFormValidation),
    defaultValues:
      type === "cancel"
        ? {
            cancellationReason: "",
          }
        : {
            roomType:
              booking && (booking.room as any)?.label
                ? (booking.room as any).label
                : firstRoom?.name || "",
            checkIn: booking
              ? new Date(booking.checkIn)
              : new Date(Date.now() + 86400000),
            checkOut: booking
              ? new Date(booking.checkOut)
              : new Date(Date.now() + 86400000 * 2),
            channel: booking?.channel || "web",
            specialRequests: booking?.specialRequests || "",
          },
  });

  const selectedRoom = availableRooms.find(
    (room) => room.name === form.watch("roomType") || room.label === form.watch("roomType")
  );

  const onSubmit = async (values: z.infer<typeof BookingFormValidation>) => {
    setIsLoading(true);
    setStatusMessage(
      type === "cancel"
        ? "Cancelling booking..."
        : type === "schedule"
          ? "Confirming booking..."
          : "Creating booking..."
    );

    try {
      if (type === "cancel") {
        // Cancel booking
        if (!booking) throw new Error("Booking is required for cancellation");

        const updated = await updateBooking({
          bookingId: booking.$id,
          booking: {
            cancellationReason: (values as any).cancellationReason,
          },
          type: "cancel",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        if (updated) {
          setStatusMessage("✓ Booking cancelled successfully.");
          setOpen && setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      } else if (type === "schedule") {
        // Schedule/confirm booking
        if (!booking) throw new Error("Booking is required for scheduling");

        const updated = await updateBooking({
          bookingId: booking.$id,
          booking: {},
          type: "schedule",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        if (updated) {
          setStatusMessage("✓ Booking confirmed! SMS notification sent.");
          setOpen && setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      } else {
        // Create new booking
        let finalGuestId = guestId;
        if (!finalGuestId && typeof window !== "undefined") {
          finalGuestId = sessionStorage.getItem("hotelGuestId") || undefined;
        }

        if (!finalGuestId && guestEmail) {
          const existingGuest = await getGuestByEmail(guestEmail);
          if (existingGuest) {
            finalGuestId = existingGuest.$id;
          }
        }

        // Get room ID from Appwrite if using real rooms
        let roomId = selectedRoom?.id || (values as any).roomType;
        if (useRealRooms && selectedRoom?.$id) {
          roomId = selectedRoom.$id;
        } else if (useRealRooms) {
          // Try to find room by name
          const roomDoc = await getRoomByName((values as any).roomType);
          if (roomDoc) {
            roomId = roomDoc.$id;
          }
        }

        const newBooking = await createBooking({
          guestId: finalGuestId,
          roomId: roomId,
          status: "pending",
          checkIn: (values as any).checkIn,
          checkOut: (values as any).checkOut,
          specialRequests: (values as any).specialRequests || "",
          channel: (values as any).channel || "web",
          roomType: (values as any).roomType,
          guestEmail: guestEmail || undefined,
        });

        if (newBooking) {
          setStatusMessage(
            "✓ Booking created! Admin will confirm and send SMS notification."
          );
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("hotelGuestId");
            sessionStorage.removeItem("hotelGuestEmail");
          }
          setTimeout(() => {
            router.push(`/hotel-demo/success?bookingId=${newBooking.$id}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error(`Error ${type}ing booking:`, error);
      setStatusMessage(`Error ${type}ing booking. Please try again.`);
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-12-semibold uppercase text-blue-500 p-2 sm:p-0">
            Rooms
          </p>
          <h2 className="text-18-bold">Booking preferences</h2>
          <p className="text-14-regular text-dark-600">
            Scheduling engine now points to `rooms` availability instead of
            physician calendars.
          </p>
        </section>

        {type !== "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="roomType"
            label="Room / room type"
            placeholder="Select a room"
            disabled={type === "schedule"}
          >
            {availableRooms.map((room) => (
              <SelectItem
                key={room.$id || room.id}
                value={room.label || room.name}
              >
                <span className="text-14-medium">{room.label || room.name}</span>
                <span className="text-12-regular text-dark-600 pl-2">
                  Sleeps {room.capacity} • ${room.rate}/night
                </span>
              </SelectItem>
            ))}
          </CustomFormField>
        )}

        {type !== "cancel" && (
          <>
            <div className="flex flex-col gap-6 md:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="checkIn"
                label="Check-in"
                dateFormat="MM/dd/yyyy"
                disabled={type === "schedule"}
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="checkOut"
                label="Check-out"
                dateFormat="MM/dd/yyyy"
                disabled={type === "schedule"}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="specialRequests"
              label="Special requests"
              placeholder="Hypoallergenic bedding, minibar removal, airport transfers…"
              disabled={type === "schedule"}
            />
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Change of plans, found alternative accommodation..."
          />
        )}

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

        {guestEmail && (
          <p className="text-12-regular text-green-500">
            ✓ Guest profile found: {guestEmail}
          </p>
        )}
        {!guestEmail && (
          <p className="text-12-regular text-dark-600">
            ℹ Please register as a guest first, or we'll create a profile for
            you.
          </p>
        )}

        <SubmitButton
          className={`w-full ${type === "cancel" ? "shad-danger-btn" : ""}`}
          isLoading={isLoading}
        >
          {type === "cancel"
            ? "Cancel Booking"
            : type === "schedule"
              ? "Confirm Booking"
              : "Hold room & send confirmation"}
        </SubmitButton>
      </form>
    </Form>
  );
};
