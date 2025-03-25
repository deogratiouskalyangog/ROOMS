"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  images: string[];
  location: string;
  price: number;
  rating?: number;
  dates?: string;
  isFavorite?: boolean;
  isTopRated?: boolean;
};

const ListingCard = ({
  id,
  title,
  subtitle,
  images,
  location,
  price,
  rating,
  dates,
  isFavorite = false,
  isTopRated = false,
}: ListingCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className="group">
      <Link href={`/rooms/${id}`} className="block">
        <div
          className="relative aspect-square rounded-xl overflow-hidden mb-2"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Image carousel */}
          <div className="absolute inset-0">
            <Image
              src={images[currentImageIndex]}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>

          {/* Top rated badge */}
          {isTopRated && (
            <div className="absolute top-3 left-3 bg-white text-black rounded-md text-xs font-semibold px-2 py-1 z-10">
              Top Guest Favorite
            </div>
          )}

          {/* Navigation arrows - only shown on hover */}
          {images.length > 1 && showControls && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:scale-105 transition z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:scale-105 transition z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image pagination dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full bg-white bg-opacity-80 transition-all",
                    currentImageIndex === index ? "w-2.5" : "opacity-70"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Listing details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm truncate">{location}</h3>
            {rating && (
              <div className="flex items-center gap-1 min-w-[30px]">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm">{rating.toFixed(2)}</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate">{subtitle || title}</p>
          <p className="text-muted-foreground text-sm">{dates}</p>
          <p className="mt-1">
            <span className="font-semibold">${price}</span>
            <span className="text-sm"> night</span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
