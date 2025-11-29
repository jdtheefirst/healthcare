// components/hotelColumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Booking } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";

import { StatusBadge } from "../StatusBadge";
import { ConfirmStayModal } from "../ConfirmStayModal";
import { CancelBookingModal } from "../booking/CancelBookingModal";

export type HotelBookingRow = Booking & {
  guestName?: string;
  guestPhone?: string;
  roomName?: string;
  roomType?: string;
};

export const hotelColumns: ColumnDef<HotelBookingRow>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "guest",
    header: "Guest",
    cell: ({ row }) => {
      const booking = row.original;
      const guest = booking.guest as any;
      const guestName =
        booking.guestName ||
        guest?.name ||
        (typeof guest === "string" ? "Unknown" : "Unknown");
      const guestPhone =
        booking.guestPhone ||
        guest?.phone ||
        (typeof guest === "string" ? "" : "");

      return (
        <div>
          <p className="text-14-medium">{guestName}</p>
          {guestPhone && (
            <p className="text-12-regular text-dark-600">{guestPhone}</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => {
      const booking = row.original;
      const room = booking.room as any;
      const roomName =
        booking.roomType ||
        booking.roomName ||
        room?.name ||
        room?.label ||
        (typeof room === "string" ? room : "Unknown Room");

      return <p className="text-14-regular">{roomName}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => {
      const purpose =
        (row.original as any).purpose ||
        (row.original.guest as any)?.purpose ||
        "N/A";
      return <p className="text-14-regular">{purpose}</p>;
    },
  },
  {
    accessorKey: "checkIn",
    header: "Stay",
    cell: ({ row }) => {
      const booking = row.original;
      const checkIn =
        booking.checkIn instanceof Date
          ? booking.checkIn
          : new Date(booking.checkIn);
      const checkOut =
        booking.checkOut instanceof Date
          ? booking.checkOut
          : new Date(booking.checkOut);

      return (
        <div className="text-12-regular">
          <p>{formatDateTime(checkIn).dateOnly}</p>
          <p className="text-dark-600">→ {formatDateTime(checkOut).dateOnly}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "specialRequests",
    header: "Special requests",
    cell: ({ row }) => {
      const requests = row.original.specialRequests || "";
      return (
        <p className="text-12-regular text-dark-600 max-w-xs truncate">
          {requests || "—"}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const booking = row.original;

      const handleSuccess = () => {
        // Refresh the page to show updated status
        window.location.reload();
      };

      return (
        <div className="flex gap-1">
          {booking.status === "pending" && (
            <ConfirmStayModal booking={booking} onSuccess={handleSuccess} />
          )}
          {booking.status !== "cancelled" && (
            <CancelBookingModal booking={booking} onSuccess={handleSuccess} />
          )}
        </div>
      );
    },
  },
];
