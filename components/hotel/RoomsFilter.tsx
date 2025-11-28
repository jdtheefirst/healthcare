"use client";

import { useState } from "react";
import RoomCard from "./RoomCard";
import { RoomTypeFilters } from "@/constants";
import { Button } from "../ui/button";

export default function RoomsFilter({
  rooms,
  hotels,
}: {
  rooms: any[];
  hotels: any[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Rooms");
  const [priceRange, setPriceRange] = useState([0, 700]);

  // Filter rooms based on selection
  const filteredRooms = rooms.filter((room) => {
    const matchesCategory =
      selectedCategory === "All Rooms" || room.type === selectedCategory;
    const matchesPrice =
      room.rate >= priceRange[0] && room.rate <= priceRange[1];
    return matchesCategory && matchesPrice;
  });
  return (
    <div>
      {/* Add filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-dark-400 border border-dark-500 rounded-full px-4 py-2"
        >
          {RoomTypeFilters.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Hotels Filter (if multiple hotels) */}
        {hotels.length > 1 && (
          <section className="mb-8">
            <h2 className="text-18-bold mb-4">Select Hotel</h2>
            <div className="flex flex-wrap gap-3">
              {hotels.map((hotel) => (
                <Button
                  key={hotel.$id}
                  variant="outline"
                  className="rounded-full border-dark-400"
                >
                  {hotel.name}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Price range slider */}
        <div className="flex items-center gap-2">
          <span>${priceRange[0]}</span>
          <input
            type="range"
            min="0"
            max="700"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-32"
          />
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Rooms grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <RoomCard key={room.$id || room.id} room={room} />
        ))}
      </section>
    </div>
  );
}
