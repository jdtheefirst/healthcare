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
import { Booking } from "@/types/appwrite.types";

import { HotelBookingForm } from "./HotelBookingForm";

import "react-datepicker/dist/react-datepicker.css";

export const HotelBookingModal = ({
  guestId,
  guestEmail,
  booking,
  type,
  title,
  description,
}: {
  guestId?: string;
  guestEmail?: string;
  booking?: Booking;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Booking</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <HotelBookingForm
          guestId={guestId}
          guestEmail={guestEmail}
          booking={booking}
          type={type}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

