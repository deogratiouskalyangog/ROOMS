'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const destinations = [
  {
    id: 1,
    name: 'New York',
    image: '/images/destinations/new-york.jpg',
    properties: 120,
  },
  {
    id: 2,
    name: 'London',
    image: '/images/destinations/london.jpg',
    properties: 95,
  },
  {
    id: 3,
    name: 'Paris',
    image: '/images/destinations/paris.jpg',
    properties: 88,
  },
  {
    id: 4,
    name: 'Tokyo',
    image: '/images/destinations/tokyo.jpg',
    properties: 65,
  },
];

export default function PopularDestinations() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {destinations.map((destination) => (
        <Link 
          key={destination.id}
          href={`/rooms/search?location=${encodeURIComponent(destination.name)}`}
          className="block group"
        >
          <div className="relative h-64 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gray-800 opacity-40 group-hover:opacity-30 transition-opacity z-10"></div>
            
            {/* Fallback for missing images */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 z-0"></div>
            
            {!imageErrors[destination.id] && (
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                style={{ objectFit: 'cover' }}
                className="z-0"
                onError={() => handleImageError(destination.id)}
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <h3 className="text-xl font-bold">{destination.name}</h3>
              <p>{destination.properties} properties</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}