import Image from "next/image";
import Link from "next/link";

import { AdminDualTabs } from "@/components/hotel/AdminDualTabs";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { getRecentBookingList } from "@/lib/actions/hotel.actions";

const AdminDashboardPage = async () => {
  const appointments = await getRecentAppointmentList();
  const bookings = await getRecentBookingList();

  const clinicDocuments = appointments?.documents ?? [];
  const clinicCounts = {
    scheduledCount: appointments?.scheduledCount ?? 0,
    pendingCount: appointments?.pendingCount ?? 0,
    cancelledCount: appointments?.cancelledCount ?? 0,
  };

  const hotelDocuments = bookings?.documents ?? [];
  const hotelCounts = {
    scheduledCount: bookings?.scheduledCount ?? 0,
    pendingCount: bookings?.pendingCount ?? 0,
    cancelledCount: bookings?.cancelledCount ?? 0,
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-[5%] py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
          <span className="rounded-full border border-dark-400 px-3 py-1 text-12-semibold text-dark-600">
            Dual admin dashboard
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/hotel-demo" className="shad-gray-btn rounded-full px-5 py-2">
            View hotel flow
          </Link>
          <Link href="/admin/rooms" className="shad-gray-btn rounded-full px-5 py-2">
            Manage Rooms
          </Link>
          <Link href="/features" className="shad-primary-btn rounded-full px-5 py-2">
            Feature matrix
          </Link>
        </div>
      </header>

      <AdminDualTabs
        clinicAppointments={clinicDocuments}
        clinicCounts={clinicCounts}
        hotelBookings={hotelDocuments}
        hotelCounts={hotelCounts}
      />
    </div>
  );
};

export default AdminDashboardPage;

