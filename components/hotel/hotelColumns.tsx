"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/lib/utils";

import { StatusBadge } from "../StatusBadge";

export type HotelBookingRow = {
  id: string;
  guestName: string;
  phone: string;
  roomType: string;
  status: Status;
  purpose: BookingPurpose;
  checkIn: string;
  checkOut: string;
  specialRequests: string;
};

export const hotelColumns: ColumnDef<HotelBookingRow>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => (
      <div>
        <p className="text-14-medium">{row.original.guestName}</p>
        <p className="text-12-regular text-dark-600">{row.original.phone}</p>
      </div>
    ),
  },
  {
    accessorKey: "roomType",
    header: "Room",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.roomType}</p>
    ),
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
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.purpose}</p>
    ),
  },
  {
    accessorKey: "checkIn",
    header: "Stay",
    cell: ({ row }) => (
      <div className="text-12-regular">
        <p>{formatDateTime(row.original.checkIn).dateOnly}</p>
        <p className="text-dark-600">
          → {formatDateTime(row.original.checkOut).dateOnly}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "specialRequests",
    header: "Special requests",
    cell: ({ row }) => (
      <p className="text-12-regular text-dark-600 max-w-xs">
        {row.original.specialRequests}
      </p>
    ),
  },
];

