'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ImageUploader({ roomId, onUploadComplete }: { roomId: string, onUploadComplete?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setError(null);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    setUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${roomId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `rooms/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('room-images')
        .getPublicUrl(filePath);
        
      // Save image reference to the room in the database
      const { error: dbError } = await supabase
        .from('room_images')
        .insert([
          { 
            room_id: roomId,
            image_url: publicUrlData.publicUrl,
            created_at: new Date()
          }
        ]);
        
      if (dbError) throw dbError;
      
      if (onUploadComplete) onUploadComplete();
      
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      
      {preview && (
        <div className="relative h-48 w-full">
          <Image 
            src={preview} 
            alt="Preview" 
            fill 
            style={{ objectFit: 'cover' }} 
            className="rounded-md"
          />
        </div>
      )}
      
      <label className="block">
        <span className="sr-only">Choose file</span>
        <input 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </label>
      
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}