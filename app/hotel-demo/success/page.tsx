import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HotelRoomTypes } from "@/constants";
import { getBooking } from "@/lib/actions/hotel.actions";
import { formatDateTime } from "@/lib/utils";

const HotelBookingSuccess = async ({ searchParams }: SearchParamProps) => {
  const bookingId = (searchParams?.bookingId as string) || "";
  const booking = bookingId ? await getBooking(bookingId) : null;

  const room = booking
    ? HotelRoomTypes.find(
        (r) =>
          r.name === (booking.room as any)?.label ||
          r.name === (booking.room as any)?.name ||
          r.id === booking.roomId
      )
    : null;

  return (
    <div className="flex h-screen max-h-screen px-2 sm:px-[5%]">
      <div className="success-img">
        <Link href="/" className="flex items-center gap-2" passHref>
          <h1 className="logo-text text-2xl sm:text-3xl">CareStay</h1>
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">hotel booking request</span>{" "}
            has been successfully submitted!
          </h2>
          <p className="text-16-regular text-dark-700">
            We&apos;ll confirm your stay and send SMS notification shortly.
          </p>
        </section>

        {booking && (
          <section className="request-details">
            <p>Booking details: </p>
            <div className="flex items-center gap-3">
              <p className="text-14-medium">
                {room?.name || (booking.room as any)?.label || "Room"}
              </p>
              <p className="text-12-regular text-dark-600">
                ${room?.rate || "TBD"}/night
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <div className="text-14-regular">
                <p>
                  Check-in: {formatDateTime(booking.checkIn).dateOnly} at 3:00
                  PM
                </p>
                <p className="text-dark-600">
                  Check-out: {formatDateTime(booking.checkOut).dateOnly} at
                  11:00 AM
                </p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="text-12-regular text-dark-600">
                <p className="font-medium">Special requests:</p>
                <p>{booking.specialRequests}</p>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href="/hotel-demo">New Booking</Link>
          </Button>
          <Button variant="outline" className="shad-gray-btn" asChild>
            <Link href="/admin/dashboard">View Admin Dashboard</Link>
          </Button>
        </div>

        <p className="copyright">© {new Date().getFullYear()} Northwind</p>
      </div>
    </div>
  );
};

export default HotelBookingSuccess;
