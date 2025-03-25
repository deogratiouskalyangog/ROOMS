"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share, Heart, Star, Award, BedDouble, Bath, Users, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import ReviewSection from "./ReviewSection";

type RoomAvailability = {
  date: string;
  price: number;
};

type Room = {
  id: string;
  title: string;
  location: string;
  host: string;
  hostJoined: string;
  superhost: boolean;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  amenities: string[];
  images: string[];
  availabilities: RoomAvailability[];
  houseRules: string[];
  latitude: number;
  longitude: number;
};

type RoomDetailProps = {
  room: Room;
};

const RoomDetail = ({ room }: RoomDetailProps) => {
  // State for date selection in booking panel
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  // Add a mounted state to ensure client-side only rendering for interactive elements
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return room.price;

    // Calculate number of nights
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Basic calculation based on the room's price
    return room.price * nights;
  };

  // Calculate service fee (typically around 12-15% of the subtotal)
  const calculateServiceFee = () => {
    return Math.round(calculateTotalPrice() * 0.15);
  };

  // Calculate the total with fees
  const calculateTotal = () => {
    return calculateTotalPrice() + calculateServiceFee();
  };

  if (!mounted) {
    // Return a skeleton/loading state that matches the structure but has no interactive elements
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-100 animate-pulse h-10 w-3/4 mb-4 rounded"></div>
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="bg-gray-100 animate-pulse h-6 w-1/2 rounded"></div>
          <div className="bg-gray-100 animate-pulse h-8 w-32 rounded-md"></div>
        </div>
        <div className="bg-gray-100 animate-pulse aspect-[3/2] w-full rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-100 animate-pulse h-32 w-full rounded mb-6"></div>
            <div className="bg-gray-100 animate-pulse h-64 w-full rounded mb-6"></div>
          </div>
          <div>
            <div className="bg-gray-100 animate-pulse h-96 w-full rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Section */}
      <h1 className="text-2xl font-semibold mb-1">{room.title}</h1>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-medium">{room.rating}</span>
          </div>
          <span className="text-gray-500">·</span>
          <span className="text-gray-700 underline">{room.reviews} reviews</span>
          {room.superhost && (
            <>
              <span className="text-gray-500">·</span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Superhost
              </span>
            </>
          )}
          <span className="text-gray-500">·</span>
          <span className="text-gray-700 underline">{room.location}</span>
        </div>
        <div className="flex mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" className="rounded-md flex items-center">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="rounded-md flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Images Section */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2 relative aspect-[3/2]">
            <Image
              src={room.images[0]}
              alt={room.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {room.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative hidden md:block aspect-square">
              <Image
                src={image}
                alt={`${room.title} - image ${index + 2}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}

          <Button
            variant="secondary"
            className="absolute bottom-4 right-4 bg-white"
            onClick={() => setShowAllPhotos(true)}
          >
            Show all photos
          </Button>
        </div>

        {/* Photos Modal */}
        <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
          <DialogContent className="max-w-5xl w-full p-0">
            <div className="p-4 sticky top-0 bg-white z-10 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setShowAllPhotos(false)}>
                ← Back to listing
              </Button>
              <div className="flex gap-4">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 gap-4">
              {room.images.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] w-full">
                  <Image
                    src={image}
                    alt={`${room.title} - photo ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Room Info & Booking Panel */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Room Details */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-start pb-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">
                {room.superhost ? `${room.title} hosted by ${room.host}` : `Entire cabin hosted by ${room.host}`}
              </h2>
              <p className="mt-1 text-gray-700">
                {room.guests} guests · {room.bedrooms} bedrooms · {room.beds} beds · {room.bathrooms} baths
              </p>
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-2xl font-medium">
                {room.host.charAt(0)}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="py-6 border-b space-y-4">
            <div className="flex items-start">
              <Award className="h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">{room.host} is a Superhost</h3>
                <p className="text-gray-500">Superhosts are experienced, highly rated hosts.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BedDouble className="h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Dedicated workspace</h3>
                <p className="text-gray-500">A private room with wifi that's well-suited for working.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold">Free cancellation before April 1</h3>
                <p className="text-gray-500">Cancel before check-in for a partial refund.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b">
            <p className="text-gray-700 whitespace-pre-line">{room.description}</p>
            <Button variant="link" className="mt-2 px-0 text-black font-semibold">
              Show more →
            </Button>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.amenities.slice(0, 10).map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-6 w-6 mr-4 flex items-center justify-center">
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            {room.amenities.length > 10 && (
              <Button variant="outline" className="mt-6 border-black text-black">
                Show all {room.amenities.length} amenities
              </Button>
            )}
          </div>

          {/* Calendar */}
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">{room.availabilities.length} nights available</h2>
            <p className="mb-4 text-gray-700">Add your travel dates for exact pricing</p>
            <div className="bg-white border rounded-xl p-6">
              <Calendar
                mode="range"
                selected={{
                  from: checkIn,
                  to: checkOut,
                }}
                onSelect={(range) => {
                  setCheckIn(range?.from);
                  setCheckOut(range?.to);
                }}
                className="rounded-md"
                numberOfMonths={2}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection roomId={room.id} totalReviews={room.reviews} rating={room.rating} />
        </div>

        {/* Right Column - Booking Panel */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 border rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xl font-semibold">${room.price}</span>
                <span className="text-gray-500"> night</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1">{room.rating}</span>
                <span className="text-gray-500 mx-1">·</span>
                <span className="text-gray-700 underline">{room.reviews} reviews</span>
              </div>
            </div>

            <div className="border rounded-t-lg overflow-hidden mb-4">
              <div className="grid grid-cols-2 divide-x">
                <div className="p-3">
                  <div className="text-xs font-semibold">CHECK-IN</div>
                  <div>
                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold">CHECKOUT</div>
                  <div>
                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
                  </div>
                </div>
              </div>
              <div className="border-t p-3">
                <div className="text-xs font-semibold">GUESTS</div>
                <div className="flex justify-between items-center">
                  <div>{guests} guest{guests !== 1 ? 's' : ''}</div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      -
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGuests(Math.min(room.guests, guests + 1))}
                      disabled={guests >= room.guests}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full py-6 bg-primary text-white rounded-lg mb-4">
              {checkIn && checkOut ? "Reserve" : "Check availability"}
            </Button>

            {checkIn && checkOut && (
              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <div className="underline">
                    ${room.price} x {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                  </div>
                  <div>${calculateTotalPrice()}</div>
                </div>
                <div className="flex justify-between">
                  <div className="underline">Service fee</div>
                  <div>${calculateServiceFee()}</div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <div>Total before taxes</div>
                  <div>${calculateTotal()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* House Rules */}
      <div className="mt-8 py-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Things to know</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">House rules</h3>
            <ul className="space-y-2 text-gray-700">
              {room.houseRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Safety & property</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Carbon monoxide alarm</li>
              <li>Smoke alarm</li>
              <li>Security camera/recording device</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cancellation policy</h3>
            <p className="text-gray-700">Free cancellation before April 1. Review the host's full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
