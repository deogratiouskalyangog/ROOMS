'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SearchModal from '@/components/search/SearchModal';
import { Search } from 'lucide-react';

const SearchBanner = () => {
  return (
    <div className="relative">
      {/* Background image container with gradient overlay */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 z-10"></div>
        <Image
          src="https://ext.same-assets.com/3140348022/3923490053.jpeg"
          alt="Beautiful travel destination"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-2xl">
          Find your perfect getaway
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-xl">
          Search millions of listings worldwide to find the ideal place for your next stay
        </p>

        {/* Search button for desktop */}
        <div className="hidden md:block w-full max-w-lg">
          <SearchModal>
            <Button
              className="bg-white text-gray-800 hover:bg-gray-100 rounded-full h-14 w-full shadow-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Where are you going?
            </Button>
          </SearchModal>
        </div>

        {/* Search button for mobile */}
        <div className="md:hidden w-full max-w-xs">
          <SearchModal>
            <Button
              className="bg-white text-gray-800 hover:bg-gray-100 rounded-full h-12 w-full shadow-lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Search destinations
            </Button>
          </SearchModal>
        </div>
      </div>
    </div>
  );
};

export default SearchBanner;
