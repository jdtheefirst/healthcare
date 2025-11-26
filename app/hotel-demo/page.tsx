import Image from "next/image";
import Link from "next/link";

import { HotelBookingForm } from "@/components/hotel/HotelBookingForm";
import { HotelFlowComparison } from "@/components/hotel/HotelFlowComparison";
import { HotelGuestForm } from "@/components/hotel/HotelGuestForm";
import { HotelSellingPoints } from "@/components/hotel/HotelSellingPoints";
import { Button } from "@/components/ui/button";

const HotelDemoPage = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-2 sm:px-[5%] py-12">
      <section className="grid gap-8 rounded-3xl border border-dark-400 bg-gradient-to-br from-green-600/30 to-blue-600/10 p-2 sm:p-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <p className="text-12-semibold uppercase text-green-500">
            Northwind → Hotels
          </p>
          <h1 className="text-36-bold">
            A live, industry-ready booking journey
          </h1>
          <p className="text-16-regular text-dark-700">
            Patients become guests, doctors become rooms, appointments become
            bookings. Same Appwrite backend, same SMS notifications, new revenue
            channel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild>
              <Link href="/admin/dashboard">Explore dual admin</Link>
            </Button>

            <Button asChild variant="secondary">
              <Link href="/features">View feature matrix</Link>
            </Button>
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
            Clinic engine already speaks hotel: availability grids, SMS, and
            Appwrite collections are industry agnostic.
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
