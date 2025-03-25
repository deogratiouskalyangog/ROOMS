'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO, differenceInDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn') as string) : null;
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut') as string) : null;
  const guests = Number(searchParams.get('guests') || '1');
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchRooms() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('rooms')
          .select(`
            *,
            room_images!inner(*)
          `)
          .eq('room_images.is_primary', true)
          .gte('max_guests', guests);
        
        // Add location filter if provided
        if (location) {
          query = query.ilike('location', `%${location}%`);
        }
        
        const { data, error: searchError } = await query;
        
        if (searchError) throw searchError;
        
        if (data) {
          // Process the results to get unique rooms with their primary image
          const uniqueRooms = data.reduce((acc: any[], current) => {
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
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while searching for rooms');
      } finally {
        setLoading(false);
      }
    }
    
    searchRooms();
  }, [location, guests]);

  const calculateTotalPrice = (pricePerNight: number) => {
    if (!checkIn || !checkOut) return pricePerNight;
    
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return pricePerNight * (nights || 1);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        {location && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Location: {location}
          </span>
        )}
        
        {checkIn && checkOut && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Dates: {checkIn?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {checkOut?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Guests: {guests}
        </span>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <p>Searching for rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No rooms found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <Link 
              key={room.id} 
              href={`/rooms/${room.id}?checkIn=${checkIn?.toISOString()}&checkOut=${checkOut?.toISOString()}&guests=${guests}`}
              className="block"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={room.primaryImage}
                    alt={room.name}
                    fill
                    style={{ objectFit: 'cover' }}
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
                      
                      {checkIn && checkOut && (
                        <p className="text-sm text-gray-600">
                          ${calculateTotalPrice(room.price_per_night)} total
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}