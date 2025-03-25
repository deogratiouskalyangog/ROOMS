import { supabase } from './supabase';

export async function ensureStorageBuckets() {
  try {
    // Check if the room-images bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return;
    }
    
    // Check if room-images bucket exists
    const roomImagesBucketExists = buckets.some(bucket => bucket.name === 'room-images');
    
    // Create the bucket if it doesn't exist
    if (!roomImagesBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('room-images', {
        public: true, // Make files publicly accessible
      });
      
      if (createError) {
        console.error('Error creating room-images bucket:', createError);
      } else {
        console.log('Successfully created room-images bucket');
      }
    }
  } catch (err) {
    console.error('Error ensuring storage buckets:', err);
  }
}