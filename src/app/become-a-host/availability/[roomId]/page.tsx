'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ListingWorkflow from '@/components/host/ListingWorkflow';

export default function AvailabilityPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { roomId } = params;
  const [minStay, setMinStay] = useState(1);
  const [maxStay, setMaxStay] = useState(30);
  const [instantBook, setInstantBook] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('You must be logged in to update availability');
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
        if (roomData.min_stay) setMinStay(roomData.min_stay);
        if (roomData.max_stay) setMaxStay(roomData.max_stay);
        if (roomData.instant_book !== undefined) setInstantBook(roomData.instant_book);
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
          min_stay: minStay,
          max_stay: maxStay,
          instant_book: instantBook
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      router.push(`/become-a-host/publish/${roomId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating availability');
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
      <h1 className="text-3xl font-bold mb-2">Set Availability</h1>
      <p className="text-gray-600 mb-8">for {roomDetails.name}</p>
      
      <ListingWorkflow roomId={roomId} currentStep="availability" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="minStay" className="block text-sm font-medium text-gray-700">
              Minimum Stay (nights)
            </label>
            <select
              id="minStay"
              value={minStay}
              onChange={(e) => setMinStay(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 14].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">The minimum number of nights guests can book.</p>
          </div>
          
          <div>
            <label htmlFor="maxStay" className="block text-sm font-medium text-gray-700">
              Maximum Stay (nights)
            </label>
            <select
              id="maxStay"
              value={maxStay}
              onChange={(e) => setMaxStay(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[7, 14, 30, 60, 90, 180, 365].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">The maximum number of nights guests can book.</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="instantBook"
                type="checkbox"
                checked={instantBook}
                onChange={(e) => setInstantBook(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="instantBook" className="font-medium text-gray-700">Enable Instant Book</label>
              <p className="text-gray-500">Allow guests to book automatically without requiring your approval.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => router.push(`/become-a-host/pricing/${roomId}`)}
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