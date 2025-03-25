"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/listing/ListingCard";
import { Calendar } from "lucide-react";
import { parseISO, format } from "date-fns";

// Import mock listings data
const LISTINGS_DATA = [
  {
    id: "762632213174916471",
    title: "Cabin in Lake Arrowhead",
    subtitle: "61 miles away · 5 nights · Apr 6-11",
    location: "Lake Arrowhead, California",
    price: 249,
    rating: 5.0,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/3923490053.jpeg",
      "https://ext.same-assets.com/3140348022/2690710167.jpeg",
      "https://ext.same-assets.com/3140348022/1423073146.jpeg",
    ],
  },
  {
    id: "47818404",
    title: "Cabin in Lake Arrowhead",
    subtitle: "63 miles away · 5 nights · Mar 30-Apr 4",
    location: "Lake Arrowhead, California",
    price: 195,
    rating: 4.98,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/843743078.jpeg",
      "https://ext.same-assets.com/3140348022/2690710167.jpeg",
      "https://ext.same-assets.com/3140348022/808373612.jpeg",
    ],
  },
  {
    id: "804497309451316843",
    title: "Cabin in Lake Arrowhead",
    subtitle: "62 miles away · 5 nights · Mar 30-Apr 4",
    location: "Lake Arrowhead, California",
    price: 215,
    rating: 4.96,
    images: [
      "https://ext.same-assets.com/3140348022/277918512.jpeg",
      "https://ext.same-assets.com/3140348022/2676372492.jpeg",
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
    ],
  },
  {
    id: "1003992571704084083",
    title: "Cabin in Lake Arrowhead",
    subtitle: "64 miles away · 5 nights · Apr 28-May 3",
    location: "Lake Arrowhead, California",
    price: 275,
    rating: 4.99,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/3811120941.jpeg",
      "https://ext.same-assets.com/3140348022/540570917.jpeg",
      "https://ext.same-assets.com/3140348022/2933046090.jpeg",
    ],
  },
  {
    id: "45954588",
    title: "Cabin in Crestline",
    subtitle: "56 miles away · 5 nights · Apr 27-May 2",
    location: "Crestline, California",
    price: 189,
    rating: 4.94,
    images: [
      "https://ext.same-assets.com/3140348022/2676372492.jpeg",
      "https://ext.same-assets.com/3140348022/554927045.jpeg",
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
    ],
  },
  {
    id: "50402801",
    title: "Cabin in Lebec",
    subtitle: "68 miles away · 5 nights · Apr 7-12",
    location: "Lebec, California",
    price: 209,
    rating: 4.91,
    images: [
      "https://ext.same-assets.com/3140348022/808373612.jpeg",
      "https://ext.same-assets.com/3140348022/2975331289.jpeg",
      "https://ext.same-assets.com/3140348022/540570917.jpeg",
    ],
  },
  {
    id: "689896224520282255",
    title: "Cabin in Big Bear",
    subtitle: "84 miles away · 5 nights · Apr 8-13",
    location: "Big Bear, California",
    price: 225,
    rating: 4.85,
    images: [
      "https://ext.same-assets.com/3140348022/554927045.jpeg",
      "https://ext.same-assets.com/3140348022/2933046090.jpeg",
      "https://ext.same-assets.com/3140348022/843743078.jpeg",
    ],
  },
  {
    id: "964501064620071613",
    title: "Cabin in Big Bear Lake",
    subtitle: "81 miles away · 5 nights · Mar 23-28",
    location: "Big Bear Lake, California",
    price: 265,
    rating: 5.0,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
      "https://ext.same-assets.com/3140348022/277918512.jpeg",
      "https://ext.same-assets.com/3140348022/3811120941.jpeg",
    ],
  },
  {
    id: "123456",
    title: "Luxury Apartment",
    subtitle: "15 miles away · Available all year",
    location: "Los Angeles, California",
    price: 320,
    rating: 4.92,
    images: [
      "https://ext.same-assets.com/3140348022/554927045.jpeg",
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
      "https://ext.same-assets.com/3140348022/3923490053.jpeg",
    ],
  },
  {
    id: "789012",
    title: "Central Loft",
    subtitle: "City center · Close to attractions",
    location: "New York, New York",
    price: 399,
    rating: 4.88,
    images: [
      "https://ext.same-assets.com/3140348022/843743078.jpeg",
      "https://ext.same-assets.com/3140348022/2933046090.jpeg",
      "https://ext.same-assets.com/3140348022/808373612.jpeg",
    ],
  },
  {
    id: "345678",
    title: "Beachfront Condo",
    subtitle: "Ocean view · Walk to beach",
    location: "Miami, Florida",
    price: 289,
    rating: 4.95,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/3811120941.jpeg",
      "https://ext.same-assets.com/3140348022/2690710167.jpeg",
      "https://ext.same-assets.com/3140348022/540570917.jpeg",
    ],
  },
  {
    id: "901234",
    title: "Modern Studio",
    subtitle: "Near tech district · Business friendly",
    location: "San Francisco, California",
    price: 275,
    rating: 4.87,
    images: [
      "https://ext.same-assets.com/3140348022/2676372492.jpeg",
      "https://ext.same-assets.com/3140348022/277918512.jpeg",
      "https://ext.same-assets.com/3140348022/1423073146.jpeg",
    ],
  },
];

const ClientSearchResults = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredListings, setFilteredListings] = useState<typeof LISTINGS_DATA>([]);
  const [totalListings, setTotalListings] = useState(0);

  // Get search parameters
  const location = searchParams.get("location");
  const checkInStr = searchParams.get("checkIn");
  const checkOutStr = searchParams.get("checkOut");
  const guestsStr = searchParams.get("guests");

  const checkIn = checkInStr ? parseISO(checkInStr) : null;
  const checkOut = checkOutStr ? parseISO(checkOutStr) : null;
  const guests = guestsStr ? parseInt(guestsStr, 10) : 1;

  // Format date range for display
  const dateRangeText = checkIn && checkOut ?
    `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}` :
    "Any dates";

  useEffect(() => {
    if (!searchParams) return;

    // Filter listings based on search criteria
    let results = [...LISTINGS_DATA];

    if (location) {
      // Simple location filter - case insensitive partial match
      results = results.filter(listing =>
        listing.location.toLowerCase().includes(location.toLowerCase().split(',')[0].trim())
      );
    }

    // Here you could add date filtering logic if you had availability data

    // Here you could add guest filtering logic if you had capacity data

    setFilteredListings(results);
    setTotalListings(results.length);
    setIsLoading(false);
  }, [searchParams, location, checkInStr, checkOutStr, guestsStr]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search summary */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {totalListings} {totalListings === 1 ? 'home' : 'homes'} {location ? `in ${location}` : ''}
        </h1>
        <div className="flex items-center text-sm text-gray-600">
          {dateRangeText}
          {guests > 1 && (
            <>
              <span className="mx-2">·</span>
              <span>{guests} guests</span>
            </>
          )}
        </div>
      </div>

      {/* Results grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              subtitle={listing.subtitle}
              images={listing.images}
              location={listing.location}
              price={listing.price}
              rating={listing.rating}
              isTopRated={listing.isTopRated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No exact matches</h3>
          <p className="text-gray-500 max-w-lg mx-auto">
            Try changing or removing some of your filters or adjusting your search area.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientSearchResults;
