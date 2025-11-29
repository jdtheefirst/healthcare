// components/booking/BookingWidget.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, DollarSign, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Room, Hotel } from "@/types/appwrite.types";
import { createBooking, getGuestByEmail } from "@/lib/actions/hotel.actions";

// Simplified booking schema for the widget
const BookingWidgetSchema = z
  .object({
    checkIn: z
      .date()
      .min(new Date(), { message: "Check-in must be in the future" }),
    checkOut: z
      .date()
      .min(new Date(), { message: "Check-out must be in the future" }),
    specialRequests: z.string().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

interface BookingWidgetProps {
  room: Room & {
    hotel?: Hotel;
  };
}

export function BookingWidget({ room }: BookingWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState<string | null>(null);

  const form = useForm<z.infer<typeof BookingWidgetSchema>>({
    resolver: zodResolver(BookingWidgetSchema),
    defaultValues: {
      checkIn: new Date(Date.now() + 86400000), // Tomorrow
      checkOut: new Date(Date.now() + 86400000 * 2), // Day after tomorrow
      specialRequests: "",
    },
  });

  // Watch form values
  const watchDates = form.watch(["checkIn", "checkOut"]);

  // Calculate stay length and total price using useMemo to avoid recalculating unnecessarily
  const { stayLength, totalPrice } = useMemo(() => {
    if (!watchDates[0] || !watchDates[1]) {
      return { stayLength: 1, totalPrice: room.pricePerNight ?? 0 };
    }

    const nights = Math.max(
      1,
      Math.round((watchDates[1].getTime() - watchDates[0].getTime()) / 86400000)
    );

    return {
      stayLength: nights,
      totalPrice: nights * (room.pricePerNight ?? 0),
    };
  }, [watchDates, room.pricePerNight]);

  // Get guest info from sessionStorage - only once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("hotelGuestEmail");
      if (storedEmail) {
        setGuestEmail(storedEmail);
      }
    }
  }, []); // Empty dependency array - runs only once

  const onSubmit = async (values: z.infer<typeof BookingWidgetSchema>) => {
    setIsLoading(true);
    setStatusMessage("Creating your booking...");

    try {
      let guestId = null;

      // Try to get existing guest
      if (guestEmail) {
        const existingGuest = await getGuestByEmail(guestEmail);
        if (existingGuest) {
          guestId = existingGuest.$id;
        }
      }

      // Get guest info from session storage
      const guestName =
        typeof window !== "undefined"
          ? sessionStorage.getItem("hotelGuestName")
          : null;
      const guestPhone =
        typeof window !== "undefined"
          ? sessionStorage.getItem("hotelGuestPhone")
          : null;

      const newBooking = await createBooking({
        guestId: guestId || undefined,
        roomId: room.$id,
        roomType: room.label,
        hotelId: room.hotelId,
        status: "pending",
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        specialRequests: values.specialRequests || "",
        channel: "web",
        guestEmail: guestEmail || undefined,
        guestName: guestName || undefined,
        guestPhone: guestPhone || undefined,
        guestsCount: sessionStorage.getItem("hotelGuestGuestsCount")
          ? parseInt(sessionStorage.getItem("hotelGuestGuestsCount") || "1", 10)
          : undefined,
        purpose: "Leisure",
      });

      if (newBooking) {
        setStatusMessage("✓ Booking created successfully! Redirecting...");

        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("hotelGuestId");
          sessionStorage.removeItem("hotelGuestEmail");
          sessionStorage.removeItem("hotelGuestName");
          sessionStorage.removeItem("hotelGuestPhone");
        }

        // Redirect to success page
        setTimeout(() => {
          window.location.href = `/hotel-demo/success?bookingId=${newBooking.$id}`;
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setStatusMessage("Error creating booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="text-24-bold text-green-500 mb-2">
          ${room.pricePerNight}
          <span className="text-14-regular text-dark-600 ml-1">/night</span>
        </div>
        <div className="flex items-center gap-2 text-14-regular text-dark-600">
          <CheckCircle className="h-4 w-4 text-green-500" />
          {room.availabilityStatus === "available"
            ? "Available"
            : "Not Available"}
        </div>
      </div>

      {/* Booking Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Date Pickers */}
          <div className="space-y-3">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="checkIn"
              label="Check-in Date"
              dateFormat="MMM dd, yyyy"
            />

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="checkOut"
              label="Check-out Date"
              dateFormat="MMM dd, yyyy"
            />
          </div>

          {/* Stay Summary */}
          <div className="rounded-2xl border border-dark-500 bg-dark-300 p-2 sm:p-4 space-y-2">
            <div className="flex justify-between text-14-regular">
              <span>
                ${room.pricePerNight} × {stayLength} night
                {stayLength !== 1 ? "s" : ""}
              </span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-14-regular">
              <span>Service fee</span>
              <span>$0</span>
            </div>
            <div className="border-t border-dark-400 pt-2 flex justify-between text-16-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {/* Special Requests */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="specialRequests"
            label="Special Requests (Optional)"
            placeholder="Early check-in, dietary requirements, airport transfer..."
          />

          {/* Guest Status */}
          {guestEmail ? (
            <div className="flex items-center gap-2 text-12-regular text-green-500 bg-green-500/10 p-2 rounded-lg">
              <CheckCircle className="h-3 w-3" />
              Guest profile: {guestEmail}
            </div>
          ) : (
            <div className="text-12-regular text-dark-600 bg-dark-300 p-2 rounded-lg">
              ℹ We'll create a guest profile for you during booking
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`text-14-regular p-3 rounded-2xl ${
                statusMessage.includes("✓")
                  ? "bg-green-500/10 text-green-500"
                  : statusMessage.includes("Error")
                    ? "bg-red-500/10 text-red-500"
                    : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {statusMessage}
            </div>
          )}

          {/* Book Button */}
          <Button
            type="submit"
            disabled={isLoading || room.availabilityStatus !== "available"}
            className="w-full rounded-full py-3 text-16-semibold bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Booking...
              </>
            ) : room.availabilityStatus === "available" ? (
              `Book Now - $${totalPrice}`
            ) : (
              "Not Available"
            )}
          </Button>
        </form>
      </Form>

      {/* Features */}
      <div className="space-y-3 pt-4 border-t border-dark-400">
        <div className="flex items-center gap-3 text-14-regular text-dark-600">
          <Shield className="h-4 w-4 text-blue-500" />
          <span>Free cancellation until 24 hours before check-in</span>
        </div>
        <div className="flex items-center gap-3 text-14-regular text-dark-600">
          <Users className="h-4 w-4 text-green-500" />
          <span>Sleeps up to {room.capacity} guests</span>
        </div>
        <div className="flex items-center gap-3 text-14-regular text-dark-600">
          <DollarSign className="h-4 w-4 text-purple-500" />
          <span>No hidden fees</span>
        </div>
      </div>

      {/* Need to Register? */}
      {!guestEmail && (
        <div className="text-center">
          <p className="text-12-regular text-dark-600 mb-2">
            Need to register first?
          </p>
          <Button
            variant="outline"
            className="rounded-full w-full border-dark-400"
            onClick={() =>
              (window.location.href = "/hotel-demo?scrollTo=guest-form")
            }
          >
            Register as Guest
          </Button>
        </div>
      )}
    </div>
  );
}
