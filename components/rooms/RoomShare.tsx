// components/rooms/RoomShare.tsx
"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from "next-share";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room } from "@/types/appwrite.types";
import { useState } from "react";

interface RoomShareProps {
  room: Room;
  onClose: () => void;
}

export function RoomShare({ room, onClose }: RoomShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${room.label} - ${room.hotel?.name || "CareStay"}`;
  const shareDescription = room.description;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-200 rounded-3xl border border-dark-400 max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-20-bold">Share this room</h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-dark-300 border border-dark-400 rounded-2xl text-14-regular"
            />
            <Button onClick={handleCopyLink} className="rounded-full px-4">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-12-regular text-green-500 mt-2">
              Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Social Share Buttons */}
        <div className="flex justify-center gap-4">
          <FacebookShareButton url={shareUrl} quote={shareTitle}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>

          <LinkedinShareButton url={shareUrl} title={shareTitle}>
            <LinkedinIcon size={48} round />
          </LinkedinShareButton>

          <EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            body={shareDescription}
          >
            <EmailIcon size={48} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
}
