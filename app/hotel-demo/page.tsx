import Image from "next/image";
import Link from "next/link";

import { HotelBookingForm } from "@/components/hotel/HotelBookingForm";
import { HotelFlowComparison } from "@/components/hotel/HotelFlowComparison";
import { HotelGuestForm } from "@/components/hotel/HotelGuestForm";
import { HotelSellingPoints } from "@/components/hotel/HotelSellingPoints";

const HotelDemoPage = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-[5%] py-12">
      <section className="grid gap-8 rounded-3xl border border-dark-400 bg-gradient-to-br from-green-600/30 to-blue-600/10 p-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <p className="text-12-semibold uppercase text-green-500">
            CarePulse → Hotels
          </p>
          <h1 className="text-36-bold">
            Show hoteliers a live, industry-ready booking journey
          </h1>
          <p className="text-16-regular text-dark-700">
            Patients become guests, doctors become rooms, appointments become
            bookings. Same Appwrite backend, same SMS notifications, new revenue
            channel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/dashboard" className="shad-primary-btn rounded-full px-6 py-3">
              Explore dual admin
            </Link>
            <Link href="/features" className="shad-gray-btn rounded-full px-6 py-3">
              View feature matrix
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-12-semibold text-dark-600">
            <div>
              Check-in/out = Appointment start/end • Special requests = Medical
              notes
            </div>
            <div>Booking purpose = Appointment reason</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dark-400 bg-dark-200 p-6 text-center">
          <Image
            src="/assets/images/admin.png"
            width={320}
            height={320}
            alt="Hotel admin"
            className="rounded-xl border border-dark-400"
          />
          <p className="text-14-regular text-dark-600">
            Your clinic engine already speaks hotel: availability grids, SMS,
            and Appwrite collections are industry agnostic.
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <HotelGuestForm />
        <HotelBookingForm />
      </section>

      <HotelFlowComparison />
      <HotelSellingPoints />
    </div>
  );
};

export default HotelDemoPage;

