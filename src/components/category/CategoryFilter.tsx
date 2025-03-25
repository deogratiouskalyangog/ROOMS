"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Cabins",
    imageUrl: "https://ext.same-assets.com/3140348022/1238042795.jpeg",
  },
  {
    name: "Icons",
    imageUrl: "https://ext.same-assets.com/3140348022/703751024.png",
  },
  {
    name: "Amazing views",
    imageUrl: "https://ext.same-assets.com/3140348022/1268037615.jpeg",
  },
  {
    name: "Amazing pools",
    imageUrl: "https://ext.same-assets.com/3140348022/3606661436.jpeg",
  },
  {
    name: "Off-the-grid",
    imageUrl: "https://ext.same-assets.com/3140348022/394266566.jpeg",
  },
  {
    name: "Domes",
    imageUrl: "https://ext.same-assets.com/3140348022/11039670.jpeg",
  },
  {
    name: "OMG!",
    imageUrl: "https://ext.same-assets.com/3140348022/892890163.jpeg",
  },
  {
    name: "Mansions",
    imageUrl: "https://ext.same-assets.com/3140348022/3454955637.jpeg",
  },
  {
    name: "Beachfront",
    imageUrl: "https://ext.same-assets.com/3140348022/2938564312.jpeg",
  },
  {
    name: "Lakefront",
    imageUrl: "https://ext.same-assets.com/3140348022/1505426862.jpeg",
  },
  {
    name: "Tiny homes",
    imageUrl: "https://ext.same-assets.com/3140348022/2445057694.jpeg",
  },
];

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.5;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Only render scroll buttons on the client, after hydration
  const renderScrollButtons = isMounted && (
    <>
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md bg-white"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md bg-white"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );

  return (
    <div className="relative pt-6 pb-4 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {renderScrollButtons}

        {/* Category list */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 gap-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex flex-col items-center min-w-fit space-y-2 ${
                activeCategory === category.name ? "opacity-100 border-b-2 border-black pb-2" : "opacity-60"
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className="w-6 h-6 relative">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
