// components/ConfirmStayModal.tsx
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateBooking } from "@/lib/actions/hotel.actions";
import { formatDateTime } from "@/lib/utils";
import { Booking } from "@/types/appwrite.types";

interface ConfirmStayModalProps {
  booking: Booking;
  onSuccess?: () => void;
}

export const ConfirmStayModal = ({
  booking,
  onSuccess,
}: ConfirmStayModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmStay = async () => {
    setIsLoading(true);

    try {
      await updateBooking({
        bookingId: booking.$id,
        booking: {
          roomType: (booking.room as any)?.name || booking.roomType || "TBD",
          cancellationReason: "", // Not needed for confirmation
        },
        type: "schedule",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to confirm stay:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract guest information
  const guest = booking.guest as any;
  const guestName = guest?.name || "Unknown Guest";
  const guestPhone = guest?.phone || "";
  const guestEmail = guest?.email || "";

  // Extract room information
  const roomName =
    (booking.room as any)?.name || booking.roomType || "Unknown Room";

  // Format dates
  const checkInDate = formatDateTime(new Date(booking.checkIn));
  const checkOutDate = formatDateTime(new Date(booking.checkOut));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-green-500">
          Confirm Stay
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Confirm Hotel Stay</DialogTitle>
          <DialogDescription>
            Please review the booking details before confirming this stay.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Guest Information */}
          <div className="rounded-lg border border-dark-400 bg-dark-300 p-4">
            <h4 className="text-14-semibold mb-3">Guest Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600">Name:</span>
                <span className="text-14-medium">{guestName}</span>
              </div>
              {guestPhone && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Phone:</span>
                  <span className="text-14-medium">{guestPhone}</span>
                </div>
              )}
              {guestEmail && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Email:</span>
                  <span className="text-14-medium">{guestEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stay Details */}
          <div className="rounded-lg border border-dark-400 bg-dark-300 p-4">
            <h4 className="text-14-semibold mb-3">Stay Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600">Room:</span>
                <span className="text-14-medium">{roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Check-in:</span>
                <span className="text-14-medium">{checkInDate.dateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Check-out:</span>
                <span className="text-14-medium">{checkOutDate.dateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Guests:</span>
                <span className="text-14-medium">
                  {booking.guestCount || 1}
                </span>
              </div>
              {booking.purpose && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Purpose:</span>
                  <span className="text-14-medium capitalize">
                    {booking.purpose}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="rounded-lg border border-dark-400 bg-dark-300 p-4">
              <h4 className="text-14-semibold mb-2">Special Requests</h4>
              <p className="text-14-regular text-dark-600">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStay}
              className="shad-primary-btn flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Confirming..." : "Confirm Stay"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
