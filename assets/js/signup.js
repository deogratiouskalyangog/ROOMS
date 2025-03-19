document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signupForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const terms = document.getElementById('terms');
  
  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const termsError = document.getElementById('termsError');
  
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthText = document.getElementById('strengthText');
  
  // Validate full name
  fullName.addEventListener('input', function() {
    if (fullName.value.trim().length < 3) {
      fullNameError.textContent = 'Name must be at least 3 characters';
      fullName.classList.add('error');
    } else {
      fullNameError.textContent = '';
      fullName.classList.remove('error');
    }
  });
  
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
  
  // Password strength checker
  password.addEventListener('input', function() {
    const value = password.value;
    let strength = 0;
    
    // Check password length
    if (value.length >= 8) {
      strength += 25;
    }
    
    // Check for mixed case
    if (value.match(/[a-z]/) && value.match(/[A-Z]/)) {
      strength += 25;
    }
    
    // Check for numbers
    if (value.match(/\d/)) {
      strength += 25;
    }
    
    // Check for special characters
    if (value.match(/[^a-zA-Z\d]/)) {
      strength += 25;
    }
    
    // Update strength meter
    strengthMeter.style.width = strength + '%';
    
    // Update text and color based on strength
    if (strength < 25) {
      strengthMeter.style.backgroundColor = '#FF4D4F';
      strengthText.textContent = 'Very Weak';
      passwordError.textContent = 'Password is too weak';
      password.classList.add('error');
    } else if (strength < 50) {
      strengthMeter.style.backgroundColor = '#FFAA5F';
      strengthText.textContent = 'Weak';
      passwordError.textContent = 'Password is weak';
      password.classList.add('error');
    } else if (strength < 75) {
      strengthMeter.style.backgroundColor = '#FFD666';
      strengthText.textContent = 'Medium';
      passwordError.textContent = '';
      password.classList.remove('error');
    } else if (strength < 100) {
      strengthMeter.style.backgroundColor = '#52C41A';
      strengthText.textContent = 'Strong';
      passwordError.textContent = '';
      password.classList.remove('error');
    } else {
      strengthMeter.style.backgroundColor = '#008A05';
      strengthText.textContent = 'Very Strong';
      passwordError.textContent = '';
      password.classList.remove('error');
    }
    
    // Check confirm password match
    if (confirmPassword.value && confirmPassword.value !== value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      confirmPassword.classList.add('error');
    } else if (confirmPassword.value) {
      confirmPasswordError.textContent = '';
      confirmPassword.classList.remove('error');
    }
  });
  
  // Validate confirm password
  confirmPassword.addEventListener('input', function() {
    if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      confirmPassword.classList.add('error');
    } else {
      confirmPasswordError.textContent = '';
      confirmPassword.classList.remove('error');
    }
  });
  
  // Validate terms
  terms.addEventListener('change', function() {
    if (!terms.checked) {
      termsError.textContent = 'You must agree to the terms';
    } else {
      termsError.textContent = '';
    }
  });
  
  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    // Validate full name
    if (fullName.value.trim().length < 3) {
      fullNameError.textContent = 'Name must be at least 3 characters';
      fullName.classList.add('error');
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.textContent = 'Please enter a valid email address';
      email.classList.add('error');
      isValid = false;
    }
    
    // Validate password
    if (password.value.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters';
      password.classList.add('error');
      isValid = false;
    }
    
    // Validate confirm password
    if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      confirmPassword.classList.add('error');
      isValid = false;
    }
    
    // Validate terms
    if (!terms.checked) {
      termsError.textContent = 'You must agree to the terms';
      isValid = false;
    }
    
    // If all validations pass
    if (isValid) {
      try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Creating account...';
        submitButton.disabled = true;
        
        // Sign up with Supabase
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.value,
          password: password.value,
          options: {
            data: {
              full_name: fullName.value,
              role: 'guest' // Default role for new users
            }
          }
        });
        
        if (error) throw error;
        
        // After successful signup, create a user record in the users table
        if (data.user) {
          const { error: profileError } = await supabaseClient
            .from('users')
            .insert([
              { 
                id: data.user.id,
                email: email.value,
                full_name: fullName.value,
                role: 'guest',
                joined_date: new Date()
              }
            ]);
            
          if (profileError) console.error('Error creating user profile:', profileError);
        }
        
        // Check if email confirmation is required
        if (data.user && data.session) {
          // Auto sign-in (if email confirmation is not required)
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Show success message
          alert('Registration successful! Redirecting to login page...');
          
          // Redirect to login page
          window.location.href = 'login.html';
        } else {
          // Email confirmation required
          alert('Registration successful! Please check your email to confirm your account before logging in.');
          
          // Redirect to login page
          window.location.href = 'login.html';
        }
      } catch (error) {
        // Handle error
        alert(`Registration failed: ${error.message}`);
        
        // Reset button state
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Sign Up';
        submitButton.disabled = false;
      }
    }
  });
});