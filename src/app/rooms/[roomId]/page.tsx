'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import BookingForm from '@/components/booking/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RoomDetailPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const searchParams = useSearchParams();
  const [room, setRoom] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState<any>(null);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        setLoading(true);
        
        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();
          
        if (roomError) throw roomError;
        
        if (!roomData) {
          setError('Room not found');
          return;
        }
        
        setRoom(roomData);
        
        // Fetch room images
        const { data: imageData, error: imageError } = await supabase
          .from('room_images')
          .select('*')
          .eq('room_id', roomId)
          .order('is_primary', { ascending: false });
          
        if (imageError) throw imageError;
        
        if (imageData) {
          setImages(imageData);
        }
        
        // Fetch host details
        if (roomData.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', roomData.user_id)
            .single();
            
          if (!userError && userData) {
            setHost(userData);
          }
        }
      } catch (err: any) {
        console.error('Error fetching room details:', err);
        setError(err.message || 'An error occurred while fetching room details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-44 bg-gray-200 rounded"></div>
                <div className="h-44 bg-gray-200 rounded"></div>
                <div className="h-44 bg-gray-200 rounded"></div>
                <div className="h-44 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error || 'Room not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = images.find(img => img.is_primary)?.image_url || (images.length > 0 ? images[0].image_url : null);
  const additionalImages = images.filter(img => !img.is_primary).slice(0, 4);

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
        <p className="text-gray-600 mb-6">{room.location}</p>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {primaryImage ? (
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={primaryImage}
                alt={room.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {additionalImages.map((image, index) => (
              <div key={index} className="relative h-44 rounded-lg overflow-hidden">
                <Image
                  src={image.image_url}
                  alt={`${room.name} - Image ${index + 2}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
            
            {/* Fill with empty placeholders if less than 4 additional images */}
            {Array.from({ length: Math.max(0, 4 - additionalImages.length) }).map((_, index) => (
              <div key={`empty-${index}`} className="h-44 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {room.property_type || 'Entire place'} hosted by {host?.full_name || 'Host'}
                </h2>
                <p className="text-gray-600">
                  {room.max_guests} guests · {room.bedrooms} bedroom{room.bedrooms !== 1 ? 's' : ''} · {room.bathrooms} bathroom{room.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
              
              {host?.avatar_url && (
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={host.avatar_url}
                    alt={host.full_name || 'Host'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
            
            <hr className="my-6" />
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{room.description}</p>
                </div>
                
                {room.min_stay && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Stay Information</h3>
                    <p className="text-gray-700">Minimum stay: {room.min_stay} night{room.min_stay !== 1 ? 's' : ''}</p>
                    {room.max_stay && (
                      <p className="text-gray-700">Maximum stay: {room.max_stay} nights</p>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="amenities">
                <h3 className="text-lg font-medium mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {room.has_wifi && (
                    <div className="flex items-center">
                      <span className="mr-2">🌐</span>
                      <span>WiFi</span>
                    </div>
                  )}
                  {room.has_kitchen && (
                    <div className="flex items-center">
                      <span className="mr-2">🍳</span>
                      <span>Kitchen</span>
                    </div>
                  )}
                  {room.has_air_conditioning && (
                    <div className="flex items-center">
                      <span className="mr-2">❄️</span>
                      <span>Air conditioning</span>
                    </div>
                  )}
                  {room.has_heating && (
                    <div className="flex items-center">
                      <span className="mr-2">🔥</span>
                      <span>Heating</span>
                    </div>
                  )}
                  {room.has_tv && (
                    <div className="flex items-center">
                      <span className="mr-2">📺</span>
                      <span>TV</span>
                    </div>
                  )}
                  {room.has_parking && (
                    <div className="flex items-center">
                      <span className="mr-2">🚗</span>
                      <span>Free parking</span>
                    </div>
                  )}
                  {room.has_pool && (
                    <div className="flex items-center">
                      <span className="mr-2">🏊</span>
                      <span>Pool</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <p className="text-gray-700 mb-4">{room.location}</p>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map view will be available soon</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <hr className="my-6" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">House Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Check-in: After 3:00 PM</li>
                <li>Checkout: 11:00 AM</li>
                <li>No smoking</li>
                <li>No pets</li>
                {room.min_stay && <li>Minimum stay: {room.min_stay} night{room.min_stay !== 1 ? 's' : ''}</li>}
              </ul>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              roomId={roomId}
              pricePerNight={room.price_per_night}
              cleaningFee={room.cleaning_fee}
              maxGuests={room.max_guests}
              minStay={room.min_stay || 1}
              maxStay={room.max_stay || 30}
            />
          </div>
        </div>
      </div>
    </div>
  );
}