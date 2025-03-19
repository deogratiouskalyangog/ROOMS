document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    // Redirect to login page if not logged in
    window.location.href = 'login.html';
    return;
  }

  // DOM elements
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const avatarImg = document.getElementById('avatar');
  const changeAvatarBtn = document.getElementById('changeAvatar');
  const saveProfileBtn = document.getElementById('saveProfile');
  const logoutBtn = document.getElementById('logoutButton');

  // Load user profile data
  async function loadUserProfile() {
    try {
      // Get user profile from Supabase
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Fill form with user data
      if (data) {
        fullNameInput.value = data.full_name || user.user_metadata?.full_name || '';
        emailInput.value = user.email;
        phoneInput.value = data.phone || '';
        
        // Set avatar if exists
        if (data.avatar_url) {
          const { data: avatarData } = await supabaseClient
            .storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);
            
          if (avatarData) {
            avatarImg.src = avatarData.publicUrl;
          }
        }
      } else {
        // Create profile if it doesn't exist
        fullNameInput.value = user.user_metadata?.full_name || '';
        emailInput.value = user.email;
        
        // Create a new profile record
        await supabaseClient
          .from('profiles')
          .insert([
            { 
              id: user.id, 
              full_name: user.user_metadata?.full_name || '',
              email: user.email
            }
          ]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile data. Please try again later.');
    }
  }

  // Save profile changes
  saveProfileBtn.addEventListener('click', async function() {
    try {
      saveProfileBtn.textContent = 'Saving...';
      saveProfileBtn.disabled = true;

      // Update profile in Supabase
      const { error } = await supabaseClient
        .from('profiles')
        .update({ 
          full_name: fullNameInput.value,
          phone: phoneInput.value,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    } finally {
      saveProfileBtn.textContent = 'Save Changes';
      saveProfileBtn.disabled = false;
    }
  });

  // Handle avatar change
  changeAvatarBtn.addEventListener('click', function() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Handle file selection
    fileInput.addEventListener('change', async function() {
      if (fileInput.files && fileInput.files[0]) {
        try {
          const file = fileInput.files[0];
          
          // Show loading state
          changeAvatarBtn.textContent = 'Uploading...';
          changeAvatarBtn.disabled = true;
          
          // Upload file to Supabase Storage
          const fileName = `${user.id}-${Date.now()}`;
          const { data, error } = await supabaseClient
            .storage
            .from('avatars')
            .upload(fileName, file);
            
          if (error) throw error;
          
          // Get public URL
          const { data: urlData } = await supabaseClient
            .storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          // Update avatar in profile
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ 
              avatar_url: fileName
            })
            .eq('id', user.id);
            
          if (updateError) throw updateError;
          
          // Update avatar in UI
          avatarImg.src = urlData.publicUrl;
          
          alert('Avatar updated successfully!');
        } catch (error) {
          console.error('Error uploading avatar:', error);
          alert('Failed to upload avatar. Please try again later.');
        } finally {
          changeAvatarBtn.textContent = 'Change Avatar';
          changeAvatarBtn.disabled = false;
        }
      }
    });
    
    // Trigger file selection
    fileInput.click();
  });

  // Handle logout
  logoutBtn.addEventListener('click', async function() {
    try {
      // Sign out from Supabase
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again later.');
    }
  });

  // Load user profile on page load
  await loadUserProfile();
});