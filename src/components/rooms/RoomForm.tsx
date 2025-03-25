'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export default function RoomForm({ room = null }: { room?: any }) {
  const { user } = useAuth();
  const [name, setName] = useState(room?.name || '');
  const [description, setDescription] = useState(room?.description || '');
  const [price, setPrice] = useState(room?.price_per_night || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to create a room' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const roomData = {
        name,
        description,
        price_per_night: parseFloat(price),
        user_id: user.id,
        ...(room ? {} : { created_at: new Date() })
      };
      
      let result;
      
      if (room) {
        // Update existing room
        result = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', room.id);
      } else {
        // Insert new room
        result = await supabase
          .from('rooms')
          .insert([roomData]);
      }
      
      if (result.error) throw result.error;
      
      setMessage({ 
        type: 'success', 
        text: room ? 'Room updated successfully!' : 'Room created successfully!' 
      });
      
      if (!room) {
        // Clear form after creating new room
        setName('');
        setDescription('');
        setPrice('');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Room Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium">Price per Night ($)</label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Saving...' : (room ? 'Update Room' : 'Create Room')}
      </button>
    </form>
  );
}