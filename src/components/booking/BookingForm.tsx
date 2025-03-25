'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

type BookingFormProps = {
  roomId: string;
  pricePerNight: number;
  cleaningFee?: number | null;
  maxGuests: number;
  minStay?: number;
  maxStay?: number;
};

export default function BookingForm({ 
  roomId, 
  pricePerNight, 
  cleaningFee = 0,
  maxGuests,
  minStay = 1,
  maxStay = 30
}: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Initialize from URL params if available
  const initialCheckIn = searchParams.get('checkIn') 
    ? new Date(searchParams.get('checkIn') as string) 
    : new Date();
  
  const initialCheckOut = searchParams.get('checkOut') 
    ? new Date(searchParams.get('checkOut') as string) 
    : addDays(new Date(), 7);
  
  const initialGuests = Number(searchParams.get('guests') || 1);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: initialCheckIn,
    to: initialCheckOut
  });
  
  const [guests, setGuests] = useState(Math.min(initialGuests, maxGuests));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  
  useEffect(() => {
    // Fetch existing bookings to disable those dates
    async function fetchBookedDates() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('room_id', roomId)
          .eq('status', 'confirmed');
          
        if (error) throw error;
        
        if (data) {
          // Create array of all booked dates
          const allBookedDates: Date[] = [];
          
          data.forEach(booking => {
            const start = new Date(booking.check_in);
            const end = new Date(booking.check_out);
            const days = differenceInDays(end, start);
            
            for (let i = 0; i <= days; i++) {
              allBookedDates.push(addDays(start, i));
            }
          });
          
          setBookedDates(allBookedDates);
        }
      } catch (err) {
        console.error('Error fetching booked dates:', err);
      }
    }
    
    fetchBookedDates();
  }, [roomId]);
  
  const nights = date?.from && date?.to 
    ? differenceInDays(date.to, date.from) 
    : 0;
  
  const subtotal = pricePerNight * nights;
  const cleaningFeeAmount = cleaningFee || 0;
  const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
  const total = subtotal + cleaningFeeAmount + serviceFee;
  
  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=/rooms/${roomId}`);
      return;
    }
    
    if (!date?.from || !date?.to) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create booking in database
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            room_id: roomId,
            user_id: user.id,
            check_in: format(date.from, 'yyyy-MM-dd'),
            check_out: format(date.to, 'yyyy-MM-dd'),
            guests: guests,
            total_price: total,
            status: 'confirmed',
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (bookingError) throw bookingError;
      
      // Redirect to booking confirmation page
      if (data && data[0]) {
        router.push(`/bookings/${data[0].id}/confirmation`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your booking');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Check if date is in bookedDates array
    return bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  };

  return (
    <div className="border rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold">
          ${pricePerNight} <span className="text-sm font-normal">night</span>
        </span>
        
        {date?.from && date?.to && (
          <span className="text-sm text-gray-600">
            {format(date.from, 'MMM d')} - {format(date.to, 'MMM d, yyyy')}
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          disabled={{ 
            before: new Date(),
            after: addDays(new Date(), 365),
            // Add custom disabled dates
            dates: bookedDates
          }}
          min={minStay}
          max={maxStay}
          className="rounded-md border"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
          Guests
        </label>
        <select
          id="guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
          ))}
        </select>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Button 
        onClick={handleBooking} 
        disabled={loading || !date?.from || !date?.to || nights < minStay}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
      >
        {loading ? 'Processing...' : 'Reserve'}
      </Button>
      
      {date?.from && date?.to && nights < minStay && (
        <p className="text-sm text-red-600 mb-4">
          Minimum stay is {minStay} night{minStay !== 1 ? 's' : ''}
        </p>
      )}
      
      <div className="text-sm">
        <p className="text-gray-500 mb-1">You won't be charged yet</p>
        
        <div className="space-y-2 border-b pb-4 mb-4">
          <div className="flex justify-between">
            <span>${pricePerNight} x {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>${subtotal}</span>
          </div>
          
          {cleaningFeeAmount > 0 && (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${cleaningFeeAmount}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
        </div>
        
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}