'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RoomsList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*');
          
        if (error) {
          console.error('Error fetching rooms:', error);
          return;
        }
        
        setRooms(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p>{room.description}</p>
          <p className="font-bold mt-2">${room.price_per_night} per night</p>
        </div>
      ))}
    </div>
  );
}