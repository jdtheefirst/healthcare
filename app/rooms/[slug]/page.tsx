// app/rooms/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getRoomBySlug } from "@/lib/actions/room.actions";
import { RoomClient } from "@/components/rooms/RoomClient";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const roomData = await getRoomBySlug(params.slug);

  if (!roomData) {
    return {
      title: "Room Not Found",
    };
  }

  return {
    title: `${roomData.label} - ${roomData.hotel?.name || "CareStay"}`,
    description: roomData.description,
    openGraph: {
      title: `${roomData.label} - ${roomData.hotel?.name || "CareStay"}`,
      description: roomData.description,
      images: [roomData.image || "/assets/images/room-placeholder.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${roomData.label} - ${roomData.hotel?.name || "CareStay"}`,
      description: roomData.description,
      images: [roomData.image || "/assets/images/room-placeholder.jpg"],
    },
  };
}

export default async function RoomPage({ params }: PageProps) {
  const roomData = await getRoomBySlug(params.slug);

  if (!roomData) {
    notFound();
  }

  return <RoomClient roomData={roomData} />;
}
