// app/admin/rooms/page.tsx
import Link from "next/link";
import { getAllRooms } from "@/lib/actions/room.actions";
import { getAllHotels } from "@/lib/actions/hotel.actions";
import AdminManagementClient from "@/components/hotel/RoomsManagementClient";

const RoomsManagementPage = async () => {
  // Server-side data fetching
  const [rooms, hotels] = await Promise.all([
    getAllRooms(),
    getAllHotels() as any,
  ]);

  return <AdminManagementClient initialRooms={rooms} initialHotels={hotels} />;
};

export default RoomsManagementPage;
