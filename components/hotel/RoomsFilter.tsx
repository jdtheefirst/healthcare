"use client";

import { useState, useMemo } from "react";
import RoomCard from "./RoomCard";
import { RoomTypeFilters } from "@/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Search, Filter, X } from "lucide-react";

interface RoomsFilterProps {
  rooms: any[];
  hotels: any[];
}

export default function RoomsFilter({ rooms, hotels }: RoomsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Rooms");
  const [selectedHotel, setSelectedHotel] = useState("All Hotels");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Available amenities from all rooms
  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    rooms.forEach((room) => {
      room.amenities?.forEach((amenity: string) => amenities.add(amenity));
    });
    return Array.from(amenities).sort();
  }, [rooms]);

  // Filter rooms based on all criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesCategory =
        selectedCategory === "All Rooms" || room.type === selectedCategory;

      const matchesHotel =
        selectedHotel === "All Hotels" || room.hotel?.$id === selectedHotel;

      const matchesPrice =
        room.rate >= priceRange[0] && room.rate <= priceRange[1];

      const matchesSearch =
        searchQuery === "" ||
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => room.amenities?.includes(amenity));

      return (
        matchesCategory &&
        matchesHotel &&
        matchesPrice &&
        matchesSearch &&
        matchesAmenities
      );
    });
  }, [
    rooms,
    selectedCategory,
    selectedHotel,
    priceRange,
    searchQuery,
    selectedAmenities,
  ]);

  const clearFilters = () => {
    setSelectedCategory("All Rooms");
    setSelectedHotel("All Hotels");
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setSelectedAmenities([]);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const hasActiveFilters =
    selectedCategory !== "All Rooms" ||
    selectedHotel !== "All Hotels" ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    searchQuery !== "" ||
    selectedAmenities.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-600 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search rooms by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-full border-dark-400 bg-dark-300 focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle for Mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-full border-dark-400"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {
                [
                  selectedCategory !== "All Rooms",
                  selectedHotel !== "All Hotels",
                  priceRange[0] > 0 || priceRange[1] < 1000,
                  searchQuery !== "",
                  selectedAmenities.length > 0,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div
          className={`
          ${showFilters ? "block" : "hidden"} 
          lg:block lg:w-80 space-y-6
        `}
        >
          <div className="rounded-2xl border border-dark-400 bg-dark-200 p-6 space-y-6">
            {/* Room Type Filter */}
            <div>
              <h3 className="text-16-semibold mb-3">Room Type</h3>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="rounded-full border-dark-400 bg-dark-300">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-dark-400 bg-dark-300">
                  {RoomTypeFilters.map((type) => (
                    <SelectItem key={type} value={type} className="rounded-lg">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hotel Filter */}
            {hotels.length > 1 && (
              <div>
                <h3 className="text-16-semibold mb-3">Hotel</h3>
                <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                  <SelectTrigger className="rounded-full border-dark-400 bg-dark-300">
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-dark-400 bg-dark-300">
                    <SelectItem value="All Hotels" className="rounded-lg">
                      All Hotels
                    </SelectItem>
                    {hotels.map((hotel) => (
                      <SelectItem
                        key={hotel.$id}
                        value={hotel.$id}
                        className="rounded-lg"
                      >
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-16-semibold">Price Range</h3>
                <span className="text-14-regular text-dark-600">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="my-4"
              />
              <div className="flex justify-between text-14-regular text-dark-600">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Amenities Filter */}
            {allAmenities.length > 0 && (
              <div>
                <h3 className="text-16-semibold mb-3">Amenities</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded border-dark-400 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-14-regular capitalize">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full rounded-full border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="rounded-2xl border border-dark-400 bg-dark-200 p-4">
            <p className="text-14-regular text-dark-600">
              Showing{" "}
              <span className="text-12-semibold text-white">
                {filteredRooms.length}
              </span>{" "}
              of{" "}
              <span className="text-12-semibold text-white">
                {rooms.length}
              </span>{" "}
              rooms
            </p>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="flex-1">
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== "All Rooms" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-12-medium">
                  {selectedCategory}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory("All Rooms")}
                  />
                </span>
              )}

              {selectedHotel !== "All Hotels" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-12-medium">
                  {hotels.find((h) => h.$id === selectedHotel)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedHotel("All Hotels")}
                  />
                </span>
              )}

              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded-full text-12-medium">
                  ${priceRange[0]} - ${priceRange[1]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setPriceRange([0, 1000])}
                  />
                </span>
              )}

              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-full text-12-medium"
                >
                  {amenity}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Rooms Grid */}
          {filteredRooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard key={room.$id || room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dark-400 bg-dark-200">
              <div className="text-24-bold text-dark-600 mb-2">
                No rooms found
              </div>
              <p className="text-16-regular text-dark-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={clearFilters}
                className="rounded-full bg-blue-500 hover:bg-blue-600"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
