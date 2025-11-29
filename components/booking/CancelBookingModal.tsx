// components/booking/CancelBookingModal.tsx
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
import { Booking } from "@/types/appwrite.types";

interface CancelBookingModalProps {
  booking: Booking;
  onSuccess?: () => void;
}

export const CancelBookingModal = ({
  booking,
  onSuccess,
}: CancelBookingModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    setIsLoading(true);

    try {
      await updateBooking({
        bookingId: booking.$id,
        booking: {
          cancellationReason: cancellationReason.trim(),
          roomType: (booking.room as any)?.name || booking.roomType || "TBD",
        },
        type: "cancel",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      setOpen(false);
      setCancellationReason("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-500">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cancellation Reason */}
          <div>
            <label
              htmlFor="cancellationReason"
              className="text-14-semibold mb-2 block"
            >
              Reason for cancellation *
            </label>
            <textarea
              id="cancellationReason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Change of plans, found alternative accommodation..."
              className="w-full rounded-lg border border-dark-400 bg-dark-300 px-3 py-2 text-14-regular placeholder:text-dark-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setCancellationReason("");
              }}
              className="flex-1"
              disabled={isLoading}
            >
              Go Back
            </Button>
            <Button
              onClick={handleCancelBooking}
              className="shad-danger-btn flex-1"
              disabled={isLoading || !cancellationReason.trim()}
            >
              {isLoading ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
