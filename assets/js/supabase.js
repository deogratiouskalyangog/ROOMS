// Supabase configuration
const SUPABASE_URL = 'https://kqeplyjhyrkkcupsnbtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZXBseWpoeXJra2N1cHNuYnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjQ0MDcsImV4cCI6MjA1NzgwMDQwN30.wNaf5ajFiIDfHFwVdBnzD6sKygPLLd-znhPzBb4BFuE';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);