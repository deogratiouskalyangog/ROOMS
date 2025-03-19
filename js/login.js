// Function to handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simple validation
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  // In a real application, you would send this data to a server
  // For demo purposes, we'll just simulate a successful login
  
  // Store login state in localStorage
  localStorage.setItem('jcp_user_email', email);
  localStorage.setItem('jcp_logged_in', 'true');
  
  // Redirect to home page
  window.location.href = 'index.html';
}

// Function to handle social login
function handleSocialLogin(provider) {
  // In a real application, you would implement OAuth flow
  // For demo purposes, we'll just simulate a successful login
  
  localStorage.setItem('jcp_user_email', `user@${provider}.com`);
  localStorage.setItem('jcp_logged_in', 'true');
  
  // Redirect to home page
  window.location.href = 'index.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem('jcp_logged_in') === 'true';
  
  if (isLoggedIn) {
    // If already logged in, redirect to home page
    window.location.href = 'index.html';
  }
  
  // Set up login form submission
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', handleLogin);
  
  // Set up social login buttons
  const googleButton = document.querySelector('.google-button');
  googleButton.addEventListener('click', () => handleSocialLogin('google'));
  
  const facebookButton = document.querySelector('.facebook-button');
  facebookButton.addEventListener('click', () => handleSocialLogin('facebook'));
  
  // Set up signup link
  const signupLink = document.querySelector('.signup-link');
  signupLink.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Signup functionality will be implemented soon!');
  });
});