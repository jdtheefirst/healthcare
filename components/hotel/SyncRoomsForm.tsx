// components/hotel/SyncRoomsForm.tsx - Updated
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { syncRoomsToAppwrite } from "@/lib/actions/room.actions";

interface SyncRoomsFormProps {
  onSyncComplete?: () => void;
}

export function SyncRoomsForm({ onSyncComplete }: SyncRoomsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const result = await syncRoomsToAppwrite();
        if (result.success) {
          alert(`Successfully synced ${result.rooms.length} rooms!`);
          onSyncComplete?.();
        }
      } catch (error) {
        alert("Failed to sync rooms. Check console for details.");
        console.error(error);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <Button type="submit" className="shad-primary-btn" disabled={isPending}>
        {isPending ? "Syncing..." : "Sync Rooms to Appwrite"}
      </Button>
    </form>
  );
}
