import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if the room-images bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Check if room-images bucket exists
    const roomImagesBucketExists = buckets.some(bucket => bucket.name === 'room-images');
    
    // Create the bucket if it doesn't exist
    if (!roomImagesBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('room-images', {
        public: true, // Make files publicly accessible
      });
      
      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      
      return NextResponse.json({ message: 'Bucket created successfully' });
    }
    
    return NextResponse.json({ message: 'Bucket already exists' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}