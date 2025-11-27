"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";

import { HotelMetricSnapshot } from "@/constants";
import { Appointment } from "@/types/appwrite.types";

import { columns } from "../table/columns";
import { DataTable } from "../table/DataTable";

import { HotelBookingRow, hotelColumns } from "./hotelColumns";

type AdminDualTabsProps = {
  clinicAppointments: Appointment[];
  clinicCounts: {
    scheduledCount: number;
    pendingCount: number;
    cancelledCount: number;
  };
  hotelBookings?: any[]; // Booking[] from Appwrite
  hotelCounts?: {
    scheduledCount: number;
    pendingCount: number;
    cancelledCount: number;
  };
};

const MetricCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "green" | "blue" | "red";
}) => (
  <div className="rounded-2xl border border-dark-400 bg-dark-300 p-4 shadow-lg">
    <p
      className={clsx("text-12-semibold uppercase", {
        "text-green-500": accent === "green",
        "text-blue-500": accent === "blue",
        "text-red-500": accent === "red",
      })}
    >
      {label}
    </p>
    <p className="text-32-bold">{value}</p>
  </div>
);

export const AdminDualTabs = ({
  clinicAppointments,
  clinicCounts,
  hotelBookings = [],
  hotelCounts = {
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  },
}: AdminDualTabsProps) => {
  const [activeTab, setActiveTab] = useState<"clinic" | "hotel">("clinic");

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-12-semibold uppercase text-dark-600">
            Unified admin
          </p>
          <h2 className="text-24-bold">
            Manage clinic appointments & hotel bookings side by side
          </h2>
        </div>
        <div className="flex gap-2 rounded-full border border-dark-500 p-1">
          {["clinic", "hotel"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "clinic" | "hotel")}
              className={clsx(
                "rounded-full px-4 py-2 text-14-medium capitalize transition",
                {
                  "bg-green-500 text-white": activeTab === tab,
                  "text-dark-600": activeTab !== tab,
                }
              )}
            >
              {tab === "clinic" ? "Clinic ops" : "Hotel ops"}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-dark-400 bg-dark-200/80 p-5">
          <p className="text-12-semibold uppercase text-dark-600">
            Clinic snapshot
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Scheduled appointments"
              value={clinicCounts.scheduledCount}
              accent="green"
            />
            <MetricCard
              label="Pending requests"
              value={clinicCounts.pendingCount}
              accent="blue"
            />
            <MetricCard
              label="Cancelled"
              value={clinicCounts.cancelledCount}
              accent="red"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-dark-400 bg-dark-200/80 p-5">
          <p className="text-12-semibold uppercase text-dark-600">
            Hotel snapshot
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Confirmed stays"
              value={hotelCounts.scheduledCount}
              accent="green"
            />
            <MetricCard
              label="Pending holds"
              value={hotelCounts.pendingCount}
              accent="blue"
            />
            <MetricCard
              label="Cancelled"
              value={hotelCounts.cancelledCount}
              accent="red"
            />
          </div>
          <p className="mt-4 text-12-regular text-dark-600">
            SMS sent this week: {HotelMetricSnapshot.smsSentThisWeek} • Payment-ready
            deposits: {HotelMetricSnapshot.confirmed}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-dark-400 bg-dark-200">
        {activeTab === "clinic" ? (
          <DataTable columns={columns} data={clinicAppointments} />
        ) : (
          <DataTable columns={hotelColumns} data={hotelBookings} />
        )}
      </div>
    </section>
  );
};

