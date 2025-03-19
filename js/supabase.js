// Supabase configuration
const SUPABASE_URL = 'https://kqeplyjhyrkkcupsnbtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZXBseWpoeXJra2N1cHNuYnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjQ0MDcsImV4cCI6MjA1NzgwMDQwN30.wNaf5ajFiIDfHFwVdBnzD6sKygPLLd-znhPzBb4BFuE';

// Initialize the Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to fetch listings from Supabase
async function fetchListings() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

// Function to fetch a single property by ID
async function fetchPropertyById(id) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Function to filter properties by category
async function filterPropertiesByCategory(category) {
  try {
    if (category === 'All') {
      return await fetchListings();
    }
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('category', category);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error filtering properties:', error);
    return [];
  }
}

// Function to search properties
async function searchProperties(query) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .ilike('title', `%${query}%`)
      .or(`location.ilike.%${query}%`);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}