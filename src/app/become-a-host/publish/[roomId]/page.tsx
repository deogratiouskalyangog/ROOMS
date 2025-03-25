'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ListingWorkflow from '@/components/host/ListingWorkflow';

export default function PublishPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { roomId } = params;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('You must be logged in to publish your listing');
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
          setError('You do not have permission to publish this room');
          return;
        }
        
        setRoomDetails(roomData);
        setIsPublished(roomData.is_published || false);
        
        // Get primary image
        const { data: imageData, error: imageError } = await supabase
          .from('room_images')
          .select('image_url')
          .eq('room_id', roomId)
          .eq('is_primary', true)
          .single();
          
        if (!imageError && imageData) {
          setPrimaryImage(imageData.image_url);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching room details');
      }
    }
    
    fetchRoomDetails();
  }, [roomId]);

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          is_published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      setIsPublished(true);
      setTimeout(() => {
        router.push(`/rooms/${roomId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while publishing your listing');
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
      <h1 className="text-3xl font-bold mb-2">Review and Publish</h1>
      <p className="text-gray-600 mb-8">for {roomDetails.name}</p>
      
      <ListingWorkflow roomId={roomId} currentStep="publish" />
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Listing Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {primaryImage ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={primaryImage}
                    alt={roomDetails.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-500">No primary image set</p>
                </div>
              )}
              
              <h3 className="text-xl font-semibold">{roomDetails.name}</h3>
              <p className="text-gray-600">{roomDetails.location}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-gray-600">{roomDetails.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Details</h4>
                <ul className="text-gray-600">
                  <li>Price: ${roomDetails.price_per_night} per night</li>
                  <li>Max Guests: {roomDetails.max_guests}</li>
                  <li>Bedrooms: {roomDetails.bedrooms}</li>
                  <li>Bathrooms: {roomDetails.bathrooms}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Amenities</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  {roomDetails.has_wifi && <span>WiFi</span>}
                  {roomDetails.has_kitchen && <span>Kitchen</span>}
                  {roomDetails.has_air_conditioning && <span>Air Conditioning</span>}
                  {roomDetails.has_heating && <span>Heating</span>}
                  {roomDetails.has_tv && <span>TV</span>}
                  {roomDetails.has_parking && <span>Parking</span>}
                  {roomDetails.has_pool && <span>Pool</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push(`/become-a-host/availability/${roomId}`)}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          Back
        </button>
        
        {isPublished ? (
          <div className="bg-green-100 text-green-700 px-6 py-2 rounded-md">
            Your listing is published! Redirecting to your listing page...
          </div>
        ) : (
          <button
            onClick={handlePublish}
            disabled={loading || !primaryImage}
            className={`px-6 py-2 rounded-md ${
              !primaryImage 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        )}
      </div>
      
      {!primaryImage && (
        <div className="mt-4 text-red-600 text-sm">
          You need to add at least one image and set it as primary before publishing.
        </div>
      )}
    </div>
  );
}