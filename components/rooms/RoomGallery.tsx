// components/rooms/RoomGallery.tsx
"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export function RoomGallery({
  images,
  selectedImage,
  onImageSelect,
}: RoomGalleryProps) {
  const nextImage = () => {
    onImageSelect((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    onImageSelect((selectedImage - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-dark-300">
        <Image
          src={images[selectedImage]}
          alt="Room image"
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 border-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 border-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 relative aspect-square w-20 rounded-2xl overflow-hidden border-2 ${
                selectedImage === index ? "border-blue-500" : "border-dark-400"
              }`}
            >
              <Image
                src={image}
                alt={`Room image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
