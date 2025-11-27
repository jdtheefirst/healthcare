// components/HotelBookingForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { HotelRoomTypes } from "@/constants";
import {
  createBooking,
  getGuestByEmail,
  updateBooking,
} from "@/lib/actions/hotel.actions";
import { getAllHotels, getRoomsByHotel } from "@/lib/actions/hotel.actions";
import { formatDateTime } from "@/lib/utils";
import { CancelBookingSchema, HotelBookingSchema } from "@/lib/validation";
import { Booking, Room, Hotel } from "@/types/appwrite.types";

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
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState<string | null>(
    propGuestEmail || null
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<(Room | any)[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [useRealRooms, setUseRealRooms] = useState(false);
  const [selectedRoomState, setSelectedRoomState] = useState<Room | any>(null);

  // Get preselected room from URL
  const preselectedRoomId = searchParams?.get("roomId");
  const preselectedRoomName = searchParams?.get("roomName");
  const preselectedHotelId = searchParams?.get("hotelId");

  // Get guest info from sessionStorage if available
  useEffect(() => {
    if (typeof window !== "undefined" && !propGuestEmail) {
      const storedEmail = sessionStorage.getItem("hotelGuestEmail");
      if (storedEmail) {
        setGuestEmail(storedEmail);
      }
    }
  }, [propGuestEmail]);

  // Single useEffect to handle data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all hotels
        const appwriteHotels = await getAllHotels();
        setHotels(appwriteHotels as Hotel[]);

        let defaultHotelId = preselectedHotelId || "";
        let fetchedRooms: (Room | any)[] = [];
        let hasRealRooms = false;

        if (appwriteHotels.length > 0) {
          // Use preselected hotel or first hotel as default
          if (
            preselectedHotelId &&
            appwriteHotels.some((h) => h.$id === preselectedHotelId)
          ) {
            defaultHotelId = preselectedHotelId;
          } else {
            defaultHotelId = appwriteHotels[0].$id;
          }
          setSelectedHotelId(defaultHotelId);

          // Fetch rooms for the first hotel
          const hotelRooms = await getRoomsByHotel(defaultHotelId);
          if (hotelRooms.length > 0) {
            fetchedRooms = hotelRooms as Room[];
            hasRealRooms = true;
          } else {
            // Fallback to constants if no rooms
            fetchedRooms = HotelRoomTypes;
          }
        } else {
          // No hotels, use constants
          fetchedRooms = HotelRoomTypes;
        }

        setRooms(fetchedRooms);
        setUseRealRooms(hasRealRooms);

        // Handle preselected room
        if (preselectedRoomId && hasRealRooms) {
          const room = fetchedRooms.find((r) => r.$id === preselectedRoomId);
          if (room) {
            setSelectedRoomState(room);
            form.setValue("roomType", getRoomLabel(room));
          }
        } else if (preselectedRoomName) {
          const room = fetchedRooms.find(
            (r) =>
              getRoomLabel(r) === preselectedRoomName ||
              r.name === preselectedRoomName
          );
          if (room) {
            setSelectedRoomState(room);
            form.setValue("roomType", getRoomLabel(room));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRooms(HotelRoomTypes);
      }
    };

    fetchData();
  }, [preselectedRoomId, preselectedRoomName, preselectedHotelId]);

  // Helper function to safely get room label
  const getRoomLabel = (room: Room | any): string => {
    return room.label || room.name || "Unknown Room";
  };

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
            hotelId: selectedHotelId,
            roomType: selectedRoomState
              ? getRoomLabel(selectedRoomState)
              : booking?.roomType || firstRoom?.name || "",
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

  // Use selectedRoomState instead of recalculating selectedRoom
  const displayRoom =
    selectedRoomState ||
    availableRooms.find(
      (room) => getRoomLabel(room) === form.watch("roomType")
    );

  // Separate handlers for each form type
  const handleCancelBooking = async (values: {
    cancellationReason: string;
  }) => {
    if (!booking) throw new Error("Booking is required for cancellation");

    const updated = await updateBooking({
      bookingId: booking.$id,
      booking: {
        cancellationReason: values.cancellationReason,
      },
      type: "cancel",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (updated) {
      setStatusMessage("✓ Booking cancelled successfully.");
      setOpen?.(false);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  const handleScheduleBooking = async (
    values: z.infer<typeof HotelBookingSchema>
  ) => {
    if (!booking) throw new Error("Booking is required for scheduling");

    const updated = await updateBooking({
      bookingId: booking.$id,
      booking: {},
      type: "schedule",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (updated) {
      setStatusMessage("✓ Booking confirmed! SMS notification sent.");
      setOpen?.(false);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  const handleCreateBooking = async (
    values: z.infer<typeof HotelBookingSchema>
  ) => {
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

    // Use the selected room from form
    const roomId =
      selectedRoomState?.$id || selectedRoomState?.id || values.roomType;
    const roomType = getRoomLabel(selectedRoomState) || values.roomType;

    const newBooking = await createBooking({
      guestId: finalGuestId,
      roomId: roomId,
      roomType: roomType,
      hotelId: selectedHotelId,
      status: "pending",
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      specialRequests: values.specialRequests || "",
      channel: values.channel || "web",
      guestEmail: guestEmail || undefined,
      guestName: sessionStorage.getItem("hotelGuestName") || undefined,
      guestPhone: sessionStorage.getItem("hotelGuestPhone") || undefined,
      purpose: "Leisure",
    });

    if (newBooking) {
      setStatusMessage(
        "✓ Booking created! Admin will confirm and send SMS notification."
      );
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("hotelGuestId");
        sessionStorage.removeItem("hotelGuestEmail");
        sessionStorage.removeItem("hotelGuestName");
        sessionStorage.removeItem("hotelGuestPhone");
      }
      setTimeout(() => {
        router.push(`/hotel-demo/success?bookingId=${newBooking.$id}`);
      }, 2000);
    }
  };

  // Main onSubmit function
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
      switch (type) {
        case "cancel":
          await handleCancelBooking(values as { cancellationReason: string });
          break;
        case "schedule":
          await handleScheduleBooking(
            values as z.infer<typeof HotelBookingSchema>
          );
          break;
        case "create":
          await handleCreateBooking(
            values as z.infer<typeof HotelBookingSchema>
          );
          break;
        default:
          throw new Error(`Unknown booking type: ${type}`);
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
            Hotels & Rooms
          </p>
          <h2 className="text-18-bold">Booking preferences</h2>
          <p className="text-14-regular text-dark-600">
            Select your hotel and room preferences.
          </p>
        </section>

        {/* Selected Room Display */}
        {selectedRoomState && (
          <div className="rounded-2xl border border-green-500 bg-green-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-14-semibold text-green-500">Selected Room</p>
                <p className="text-16-bold">
                  {getRoomLabel(selectedRoomState)}
                </p>
                <p className="text-14-regular text-dark-600">
                  ${selectedRoomState.rate || selectedRoomState.pricePerNight}
                  /night • Sleeps {selectedRoomState.capacity}
                </p>
              </div>
              <Link
                href="/rooms"
                className="shad-gray-btn rounded-full px-4 py-2 text-sm"
              >
                Change Room
              </Link>
            </div>
          </div>
        )}

        {/* Browse Rooms CTA */}
        {!selectedRoomState && (
          <div className="rounded-2xl border border-dark-500 bg-dark-400 p-6 text-center">
            <p className="text-14-regular text-dark-600 mb-4">
              Browse our available rooms to get started
            </p>
            <Link
              href="/rooms"
              className="shad-primary-btn rounded-full px-6 py-3 inline-block"
            >
              Browse Available Rooms
            </Link>
          </div>
        )}

        {/* Hotel Selection */}
        {hotels.length > 0 && type !== "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="hotelId"
            label="Select Hotel"
            placeholder="Choose a hotel"
            disabled={type === "schedule"}
            onValueChange={(value) => setSelectedHotelId(value)}
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
        )}

        {/* Room Selection Dropdown (only show if no room is preselected) */}
        {!selectedRoomState && type !== "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="roomType"
            label="Room / room type"
            placeholder="Select a room"
            disabled={type === "schedule" || rooms.length === 0}
            onValueChange={(value) => {
              const room = availableRooms.find(
                (r) => getRoomLabel(r) === value
              );
              setSelectedRoomState(room);
            }}
          >
            {availableRooms.map((room) => (
              <SelectItem key={room.$id || room.id} value={getRoomLabel(room)}>
                <span className="text-14-medium">{getRoomLabel(room)}</span>
                <span className="text-12-regular text-dark-600 pl-2">
                  Sleeps {room.capacity} • ${room.rate || room.pricePerNight}
                  /night
                </span>
              </SelectItem>
            ))}
          </CustomFormField>
        )}

        {/* Date Pickers and Special Requests (only show if a room is selected) */}
        {selectedRoomState && type !== "cancel" && (
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
          {selectedRoomState && selectedRoomState.description && (
            <p className="mt-2 text-white">{selectedRoomState.description}</p>
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
