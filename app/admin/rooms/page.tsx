import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { syncRoomsToAppwrite } from "@/lib/actions/room.actions";

const RoomsManagementPage = async () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-[5%] py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
          <span className="rounded-full border border-dark-400 px-3 py-1 text-12-semibold text-dark-600">
            Room Management
          </span>
        </div>
        <Link href="/admin/dashboard" className="shad-gray-btn rounded-full px-5 py-2">
          Back to Dashboard
        </Link>
      </header>

      <section className="rounded-3xl border border-dark-400 bg-dark-200 p-8">
        <h1 className="text-24-bold mb-4">Sync Rooms to Appwrite</h1>
        <p className="text-16-regular text-dark-700 mb-6">
          This will create or update room documents in Appwrite based on the
          HotelRoomTypes constants. Rooms are required for bookings to link to
          actual room documents.
        </p>

        <form action={syncRoomsToAppwrite}>
          <Button type="submit" className="shad-primary-btn">
            Sync Rooms to Appwrite
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-dark-500 bg-dark-300 p-4">
          <p className="text-14-medium mb-2">What this does:</p>
          <ul className="list-disc list-inside space-y-1 text-14-regular text-dark-600">
            <li>Creates or updates room documents in the `rooms` collection</li>
            <li>Links rooms to the default hotel (or creates one if needed)</li>
            <li>Maps HotelRoomTypes constants to Appwrite documents</li>
            <li>Enables bookings to reference actual room IDs</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RoomsManagementPage;

