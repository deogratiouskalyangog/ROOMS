document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  
  // Validate email
  email.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.textContent = 'Please enter a valid email address';
      email.classList.add('error');
    } else {
      emailError.textContent = '';
      email.classList.remove('error');
    }
  });
  
  // Validate password
  password.addEventListener('input', function() {
    if (password.value.length < 1) {
      passwordError.textContent = 'Please enter your password';
      password.classList.add('error');
    } else {
      passwordError.textContent = '';
      password.classList.remove('error');
    }
  });
  
  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.textContent = 'Please enter a valid email address';
      email.classList.add('error');
      isValid = false;
    }
    
    // Validate password
    if (password.value.length < 1) {
      passwordError.textContent = 'Please enter your password';
      password.classList.add('error');
      isValid = false;
    }
    
    // If all validations pass
    if (isValid) {
      try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;
        
        // Sign in with Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });
        
        if (error) throw error;
        
        // Store user session
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        alert('Login successful! Redirecting to home page...');
        
        // Redirect to home page
        window.location.href = '../index.html';
      } catch (error) {
        // Handle error
        alert(`Login failed: ${error.message}`);
        
        // Reset button state
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Log In';
        submitButton.disabled = false;
      }
    }
  });
  
  // Social login buttons
  const socialButtons = document.querySelectorAll('.social-button');
  socialButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const provider = this.classList.contains('google') ? 'google' : 'facebook';
      
      try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: provider,
        });
        
        if (error) throw error;
        
        // OAuth redirect will happen automatically
      } catch (error) {
        alert(`${provider} login failed: ${error.message}`);
      }
    });
  });
});