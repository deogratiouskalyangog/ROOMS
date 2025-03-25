'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type Room = {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  has_wifi: boolean;
  has_kitchen: boolean;
  has_pool: boolean;
  primaryImage: string;
};

export default function FeaturedListings() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedRooms() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('rooms')
          .select(`
            *,
            room_images!inner(*)
          `)
          .eq('is_published', true)
          .eq('room_images.is_primary', true)
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        
        // Process the results to get unique rooms with their primary image
        const uniqueRooms = data.reduce((acc: Room[], current) => {
          const existingRoom = acc.find(room => room.id === current.id);
          if (!existingRoom) {
            acc.push({
              ...current,
              primaryImage: current.room_images[0].image_url
            });
          }
          return acc;
        }, []);
        
        setRooms(uniqueRooms);
      } catch (err: any) {
        console.error('Error fetching featured rooms:', err);
        setError(err.message || 'An error occurred while fetching rooms');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedRooms();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative h-48 w-full">
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>
            
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2"></div>
              
              <div className="flex justify-between items-end">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
                
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error loading listings: {error}</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No listings available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map(room => (
        <Link 
          key={room.id} 
          href={`/rooms/${room.id}`}
          className="block"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={room.primaryImage}
                alt={room.name}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg'; // Fallback image
                }}
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{room.name}</h2>
              <p className="text-gray-600 mb-2">{room.location}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">
                    {room.max_guests} guests · {room.bedrooms} bedroom{room.bedrooms !== 1 ? 's' : ''} · {room.bathrooms} bathroom{room.bathrooms !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="mt-2 flex items-center">
                    {room.has_wifi && <span className="mr-2 text-xs bg-gray-100 px-2 py-1 rounded">WiFi</span>}
                    {room.has_kitchen && <span className="mr-2 text-xs bg-gray-100 px-2 py-1 rounded">Kitchen</span>}
                    {room.has_pool && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Pool</span>}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">${room.price_per_night} <span className="text-sm font-normal">night</span></p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}