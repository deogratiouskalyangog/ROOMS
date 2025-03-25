'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import Navbar from '@/components/layout/Navbar';

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchUserBookings() {
      try {
        if (!user) {
          router.push('/login');
          return;
        }
        
        const { data, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            rooms:room_id (
              id,
              name,
              location,
              room_images!inner (*)
            )
          `)
          .eq('user_id', user.id)
          .eq('room_images.is_primary', true)
          .order('check_in', { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        if (data) {
          // Process the data to get the primary image
          const processedBookings = data.map(booking => ({
            ...booking,
            room: {
              ...booking.rooms,
              primaryImage: booking.rooms.room_images[0].image_url
            }
          }));
          
          setBookings(processedBookings);
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'An error occurred while fetching your bookings');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserBookings();
  }, [user, router]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-4">Start exploring places to stay</p>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Find Places to Stay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-64">
                    {booking.room.primaryImage ? (
                      <div className="relative h-48 md:h-full w-full">
                        <Image
                          src={booking.room.primaryImage}
                          alt={booking.room.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 md:h-full w-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{booking.room.name}</h2>
                        <p className="text-gray-600 mb-4">{booking.room.location}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-700">Check-in</h4>
                            <p>{format(new Date(booking.check_in), 'MMM d, yyyy')}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700">Check-out</h4>
                            <p>{format(new Date(booking.check_out), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Guests</h4>
                          <p>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                        <p className="font-semibold mb-1">${booking.total_price}</p>
                        <p className="text-sm text-gray-500 mb-4">Paid in full</p>
                        
                        <Link 
                          href={`/bookings/${booking.id}/confirmation`}
                          className="text-blue-600 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}