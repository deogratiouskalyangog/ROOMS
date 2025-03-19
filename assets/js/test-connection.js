document.addEventListener('DOMContentLoaded', async function() {
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');
  
  try {
    // Test connection by getting the current session
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    // Connection successful
    connectionStatus.textContent = 'Successfully connected to Supabase!';
    connectionStatus.style.color = 'green';
    
    if (data.session) {
      userCount.textContent = `Logged in as: ${data.session.user.email}`;
    } else {
      userCount.textContent = 'Not logged in. Some features may be restricted.';
    }
    
    // Try to check if the users table exists
    try {
      const { error: tableError } = await supabaseClient
        .from('users')
        .select('id', { count: 'exact', head: true });
      
      if (tableError) {
        if (tableError.code === 'PGRST116') {
          // Permission error - expected when not authenticated
          userCount.textContent += ' (Authentication required to access user data)';
        } else if (tableError.code === '42P01') {
          // Table doesn't exist
          userCount.textContent += ' (Users table not found - run the SQL schema)';
        } else {
          // Other error
          userCount.textContent += ` (Table error: ${tableError.message})`;
        }
      } else {
        userCount.textContent += ' (Users table exists)';
      }
    } catch (tableCheckError) {
      console.error('Table check error:', tableCheckError);
    }
    
  } catch (error) {
    console.error('Connection error:', error);
    connectionStatus.textContent = `Connection issue: ${error.message}`;
    connectionStatus.style.color = 'red';
    userCount.textContent = 'Please verify your Supabase URL and API key in supabase.js';
  }
});