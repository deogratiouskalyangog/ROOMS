'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function UploadImagesPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { roomId } = params;
  const [images, setImages] = useState<{ id: string; url: string; isPrimary: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roomDetails, setRoomDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch room details to verify ownership and display info
    async function fetchRoomDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('You must be logged in to upload images');
          return;
        }
        
        // Get room details
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
        
        // Check if user owns this room
        if (roomData.user_id !== user.id) {
          setError('You do not have permission to upload images to this room');
          return;
        }
        
        setRoomDetails(roomData);
        
        // Fetch existing images
        const { data: imageData, error: imageError } = await supabase
          .from('room_images')
          .select('*')
          .eq('room_id', roomId);
          
        if (imageError) throw imageError;
        
        if (imageData) {
          setImages(imageData.map(img => ({
            id: img.id,
            url: img.image_url,
            isPrimary: img.is_primary
          })));
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching room details');
      }
    }
    
    fetchRoomDetails();
  }, [roomId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${roomId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `rooms/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('room-images')
        .getPublicUrl(filePath);
        
      // Determine if this is the first image (make it primary if so)
      const isPrimary = images.length === 0;
      
      // Save image reference to the room in the database
      const { data: imageData, error: dbError } = await supabase
        .from('room_images')
        .insert([
          { 
            room_id: roomId,
            image_url: publicUrlData.publicUrl,
            is_primary: isPrimary,
            created_at: new Date()
          }
        ])
        .select();
        
      if (dbError) throw dbError;
      
      if (imageData && imageData[0]) {
        setImages(prev => [...prev, {
          id: imageData[0].id,
          url: publicUrlData.publicUrl,
          isPrimary: isPrimary
        }]);
        
        setSuccess('Image uploaded successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const setAsPrimary = async (imageId: string) => {
    try {
      setError(null);
      
      // Update all images to not be primary
      await supabase
        .from('room_images')
        .update({ is_primary: false })
        .eq('room_id', roomId);
        
      // Set the selected image as primary
      const { error } = await supabase
        .from('room_images')
        .update({ is_primary: true })
        .eq('id', imageId);
        
      if (error) throw error;
      
      // Update local state
      setImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
      
      setSuccess('Primary image updated!');
    } catch (err: any) {
      setError(err.message || 'Error updating primary image');
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      setError(null);
      
      // Get the image URL to delete from storage
      const imageToDelete = images.find(img => img.id === imageId);
      
      if (!imageToDelete) return;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('room_images')
        .delete()
        .eq('id', imageId);
        
      if (dbError) throw dbError;
      
      // Extract the file path from the URL
      const urlParts = imageToDelete.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('room-images')
        .remove([`rooms/${fileName}`]);
        
      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue anyway as the database record is deleted
      }
      
      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      setSuccess('Image deleted successfully!');
      
      // If we deleted the primary image and have other images, set a new primary
      if (imageToDelete.isPrimary && images.length > 1) {
        const remainingImages = images.filter(img => img.id !== imageId);
        if (remainingImages.length > 0) {
          await setAsPrimary(remainingImages[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting image');
    }
  };

  const finishListing = () => {
    router.push(`/rooms/${roomId}`);
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
      <h1 className="text-3xl font-bold mb-2">Upload Images</h1>
      <p className="text-gray-600 mb-8">for {roomDetails.name}</p>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          {success}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Photos</h2>
        <p className="mb-4">
          Photos help guests imagine staying in your place. You can start with one and add more after you publish.
        </p>
        
        <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50">
          <span className="text-gray-700">
            {uploading ? 'Uploading...' : 'Click to upload an image'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      
      {images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Photos ({images.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative border rounded-lg overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={image.url}
                    alt="Room"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-2 flex justify-between items-center">
                  {image.isPrimary ? (
                    <span className="text-sm text-green-600 font-medium">Primary Photo</span>
                  ) : (
                    <button
                      onClick={() => setAsPrimary(image.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/become-a-host')}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={finishListing}
          disabled={images.length === 0}
          className={`px-6 py-2 rounded-md ${
            images.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {images.length === 0 ? 'Add at least one image' : 'Finish Listing'}
        </button>
      </div>
    </div>
  );
}