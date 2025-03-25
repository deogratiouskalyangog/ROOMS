'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ListingWorkflow from '@/components/host/ListingWorkflow';

export default function PricingPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { roomId } = params;
  const [price, setPrice] = useState('');
  const [weekendPrice, setWeekendPrice] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('You must be logged in to update pricing');
          return;
        }
        
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
        
        if (roomData.user_id !== user.id) {
          setError('You do not have permission to update this room');
          return;
        }
        
        setRoomDetails(roomData);
        setPrice(roomData.price_per_night?.toString() || '');
        setWeekendPrice(roomData.weekend_price?.toString() || '');
        setCleaningFee(roomData.cleaning_fee?.toString() || '');
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching room details');
      }
    }
    
    fetchRoomDetails();
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          price_per_night: parseFloat(price) || 0,
          weekend_price: parseFloat(weekendPrice) || null,
          cleaning_fee: parseFloat(cleaningFee) || null,
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      router.push(`/become-a-host/availability/${roomId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating pricing');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push('/become-a-host')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Listing Form
        </button>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <p>Loading room details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Set Your Pricing</h1>
      <p className="text-gray-600 mb-8">for {roomDetails.name}</p>
      
      <ListingWorkflow roomId={roomId} currentStep="pricing" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Base Price per Night ($)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">This is the standard nightly rate for your property.</p>
        </div>
        
        <div>
          <label htmlFor="weekendPrice" className="block text-sm font-medium text-gray-700">
            Weekend Price per Night ($) (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="weekendPrice"
              value={weekendPrice}
              onChange={(e) => setWeekendPrice(e.target.value)}
              min="0"
              step="0.01"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Set a different rate for Friday and Saturday nights.</p>
        </div>
        
        <div>
          <label htmlFor="cleaningFee" className="block text-sm font-medium text-gray-700">
            Cleaning Fee ($) (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="cleaningFee"
              value={cleaningFee}
              onChange={(e) => setCleaningFee(e.target.value)}
              min="0"
              step="0.01"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">One-time fee for cleaning the property after each stay.</p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/become-a-host/images/${roomId}`)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}