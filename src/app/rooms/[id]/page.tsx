'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RoomDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id;
  
  const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn') as string) : null;
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut') as string) : null;
  const guests = Number(searchParams.get('guests') || '1');
  
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        setLoading(true);
        
        const { data, error: roomError } = await supabase
          .from('rooms')
          .select(`
            *,
            room_images(*)
          `)
          .eq('id', roomId)
          .single();
        
        if (roomError) throw roomError;
        
        setRoom(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    }
    
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);
  
  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !room) return 0;
    
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return room.price_per_night * (nights || 1);
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !room) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error || 'Room not found'}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }
  
  const primaryImage = room.room_images.find((img: any) => img.is_primary)?.image_url || room.room_images[0]?.image_url;
  const otherImages = room.room_images.filter((img: any) => !img.is_primary).map((img: any) => img.image_url);
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
      <p className="text-gray-600 mb-6">{room.location}</p>
      
      {/* Room images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative h-96 rounded-lg overflow-hidden">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={room.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {otherImages.slice(0, 4).map((imageUrl: string, index: number) => (
            <div key={index} className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={`${room.name} - Image ${index + 2}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-700">{room.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-4">
              {room.has_wifi && (
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>WiFi</span>
                </div>
              )}
              {room.has_kitchen && (
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Kitchen</span>
                </div>
              )}
              {room.has_pool && (
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Pool</span>
                </div>
              )}
              {room.has_free_parking && (
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Free parking</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <p className="text-xl font-semibold">${room.price_per_night} <span className="text-sm font-normal">night</span></p>
            </div>
            
            {checkIn && checkOut && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Dates</span>
                  <span>{checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Guests</span>
                  <span>{guests}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button className="w-full">Book this room</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
