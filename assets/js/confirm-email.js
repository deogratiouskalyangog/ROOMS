document.addEventListener('DOMContentLoaded', async function() {
  // Get elements
  const loadingElement = document.getElementById('loading');
  const successElement = document.getElementById('success');
  const errorElement = document.getElementById('error');
  const errorMessageElement = document.getElementById('error-message');
  const countdownElement = document.getElementById('countdown');
  const resendButton = document.getElementById('resendButton');
  
  // Get the token from the URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const type = params.get('type');
  
  // If no token is provided, show error
  if (!token) {
    showError('No verification token found. Please check your email link.');
    return;
  }
  
  try {
    // Verify the token with Supabase
    const { error } = await supabaseClient.auth.verifyOtp({
      token_hash: token,
      type: type || 'signup'
    });
    
    if (error) {
      throw error;
    }
    
    // Show success and start countdown
    showSuccess();
    startCountdown();
  } catch (error) {
    console.error('Verification error:', error);
    showError(error.message || 'Failed to verify email. Please try again.');
  }
  
  // Handle resend button click
  resendButton.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Get email from local storage if available
    const userEmail = localStorage.getItem('pendingEmail');
    
    if (!userEmail) {
      alert('Please go back to the login page and try again.');
      window.location.href = 'login.html';
      return;
    }
    
    try {
      resendButton.textContent = 'Sending...';
      resendButton.disabled = true;
      
      // Resend verification email
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: userEmail
      });
      
      if (error) throw error;
      
      alert('Verification email has been resent. Please check your inbox.');
      resendButton.textContent = 'Email Sent';
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend verification email: ' + error.message);
      resendButton.textContent = 'Resend Email';
      resendButton.disabled = false;
    }
  });
  
  // Function to show success state
  function showSuccess() {
    loadingElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    successElement.classList.remove('hidden');
  }
  
  // Function to show error state
  function showError(message) {
    loadingElement.classList.add('hidden');
    successElement.classList.add('hidden');
    errorElement.classList.remove('hidden');
    errorMessageElement.textContent = message;
  }
  
  // Function to start countdown and redirect
  function startCountdown() {
    let seconds = 5;
    countdownElement.textContent = seconds;
    
    const interval = setInterval(() => {
      seconds--;
      countdownElement.textContent = seconds;
      
      if (seconds <= 0) {
        clearInterval(interval);
        window.location.href = 'profile.html';
      }
    }, 1000);
  }
});