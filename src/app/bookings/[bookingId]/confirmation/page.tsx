'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';

export default function BookingConfirmationPage({ params }: { params: { bookingId: string } }) {
  const { bookingId } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        if (!user) {
          router.push('/login');
          return;
        }
        
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();
          
        if (bookingError) throw bookingError;
        
        if (!bookingData) {
          setError('Booking not found');
          return;
        }
        
        if (bookingData.user_id !== user.id) {
          setError('You do not have permission to view this booking');
          return;
        }
        
        setBooking(bookingData);
        
        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select(`
            *,
            room_images!inner(*)
          `)
          .eq('id', bookingData.room_id)
          .eq('room_images.is_primary', true)
          .single();
          
        if (roomError) throw roomError;
        
        if (roomData) {
          setRoom({
            ...roomData,
            primaryImage: roomData.room_images[0].image_url
          });
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching booking details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookingDetails();
  }, [bookingId, user, router]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4">
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
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-green-50 p-6 rounded-lg mb-8 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700">Your reservation has been successfully booked.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Trip Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                {room?.primaryImage && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                      src={room.primaryImage}
                      alt={room.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold">{room?.name}</h3>
                <p className="text-gray-600 mb-4">{room?.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Check-in</h4>
                    <p>{format(new Date(booking.check_in), 'EEEE, MMM d, yyyy')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Check-out</h4>
                    <p>{format(new Date(booking.check_out), 'EEEE, MMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">Guests</h4>
                  <p>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Booking ID</h4>
                  <p className="text-sm text-gray-500">{booking.id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
            <p className="flex justify-between mb-2">
              <span>Total</span>
              <span>${booking.total_price}</span>
            </p>
            <p className="text-sm text-gray-500">Paid in full</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link href="/bookings" className="text-blue-600 hover:underline">
            View All Bookings
          </Link>
          
          <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}