document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated
  checkAuthentication();
  
  // Initialize form navigation
  initFormNavigation();
  
  // Initialize photo upload
  initPhotoUpload();
  
  // Initialize form submission
  initFormSubmission();
  
  // Initialize logout button
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// Check if user is authenticated
async function checkAuthentication() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
      // Redirect to login page if not authenticated
      window.location.href = '../auth/login.html?redirect=host/add-property.html';
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
    window.location.href = '../auth/login.html';
  }
}

// Handle logout
async function handleLogout(e) {
  e.preventDefault();
  
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) throw error;
    
    // Redirect to home page after logout
    window.location.href = '../index.html';
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed: ' + error.message);
  }
}

// Initialize form navigation
function initFormNavigation() {
  const form = document.getElementById('propertyForm');
  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  // Next buttons
  const nextButtons = form.querySelectorAll('.next-button');
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.dataset.next) - 1;
      const nextStep = parseInt(this.dataset.next);
      
      // Validate current step
      if (validateStep(currentStep)) {
        // Hide current step
        steps[currentStep - 1].classList.remove('active');
        
        // Show next step
        steps[nextStep - 1].classList.add('active');
        
        // Update progress bar
        progressSteps[currentStep - 1].classList.add('completed');
        progressSteps[nextStep - 1].classList.add('active');
        
        // If it's the review step, populate review data
        if (nextStep === 5) {
          populateReviewData();
        }
      }
    });
  });
  
  // Back buttons
  const backButtons = form.querySelectorAll('.back-button');
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.dataset.back) + 1;
      const prevStep = parseInt(this.dataset.back);
      
      // Hide current step
      steps[currentStep - 1].classList.remove('active');
      
      // Show previous step
      steps[prevStep - 1].classList.add('active');
      
      // Update progress bar
      progressSteps[currentStep - 1].classList.remove('active');
      progressSteps[prevStep - 1].classList.add('active');
    });
  });
}

// Validate form step
function validateStep(stepNumber) {
  const form = document.getElementById('propertyForm');
  let isValid = true;
  
  switch(stepNumber) {
    case 1:
      // Validate basic info
      const title = document.getElementById('title');
      const description = document.getElementById('description');
      const propertyType = document.getElementById('propertyType');
      const roomType = document.getElementById('roomType');
      
      if (!title.value.trim()) {
        showError(title, 'titleError', 'Property title is required');
        isValid = false;
      } else {
        clearError(title, 'titleError');
      }
      
      if (!description.value.trim()) {
        showError(description, 'descriptionError', 'Description is required');
        isValid = false;
      } else if (description.value.trim().length < 50) {
        showError(description, 'descriptionError', 'Description should be at least 50 characters');
        isValid = false;
      } else {
        clearError(description, 'descriptionError');
      }
      
      if (!propertyType.value) {
        showError(propertyType, 'propertyTypeError', 'Please select a property type');
        isValid = false;
      } else {
        clearError(propertyType, 'propertyTypeError');
      }
      
      if (!roomType.value) {
        showError(roomType, 'roomTypeError', 'Please select a room type');
        isValid = false;
      } else {
        clearError(roomType, 'roomTypeError');
      }
      break;
      
    case 2:
      // Validate property details
      const address = document.getElementById('address');
      const city = document.getElementById('city');
      const country = document.getElementById('country');
      const bedrooms = document.getElementById('bedrooms');
      const beds = document.getElementById('beds');
      const bathrooms = document.getElementById('bathrooms');
      const maxGuests = document.getElementById('maxGuests');
      
      if (!address.value.trim()) {
        showError(address, 'addressError', 'Address is required');
        isValid = false;
      } else {
        clearError(address, 'addressError');
      }
      
      if (!city.value.trim()) {
        showError(city, 'cityError', 'City is required');
        isValid = false;
      } else {
        clearError(city, 'cityError');
      }
      
      if (!country.value.trim()) {
        showError(country, 'countryError', 'Country is required');
        isValid = false;
      } else {
        clearError(country, 'countryError');
      }
      
      if (!bedrooms.value || bedrooms.value < 0) {
        showError(bedrooms, 'bedroomsError', 'Please enter a valid number of bedrooms');
        isValid = false;
      } else {
        clearError(bedrooms, 'bedroomsError');
      }
      
      if (!beds.value || beds.value < 1) {
        showError(beds, 'bedsError', 'At least 1 bed is required');
        isValid = false;
      } else {
        clearError(beds, 'bedsError');
      }
      
      if (!bathrooms.value || bathrooms.value < 0.5) {
        showError(bathrooms, 'bathroomsError', 'Please enter a valid number of bathrooms');
        isValid = false;
      } else {
        clearError(bathrooms, 'bathroomsError');
      }
      
      if (!maxGuests.value || maxGuests.value < 1) {
        showError(maxGuests, 'maxGuestsError', 'At least 1 guest is required');
        isValid = false;
      } else {
        clearError(maxGuests, 'maxGuestsError');
      }
      break;
      
    case 3:
      // Validate photos
      const photoPreviewContainer = document.getElementById('photoPreviewContainer');
      const photos = photoPreviewContainer.querySelectorAll('.photo-preview');
      
      if (photos.length < 1) {
        alert('Please upload at least one photo of your property');
        isValid = false;
      }
      break;
      
    case 4:
      // Validate pricing
      const pricePerNight = document.getElementById('pricePerNight');
      
      if (!pricePerNight.value || pricePerNight.value <= 0) {
        showError(pricePerNight, 'pricePerNightError', 'Please enter a valid price per night');
        isValid = false;
      } else {
        clearError(pricePerNight, 'pricePerNightError');
      }
      break;
  }
  
  return isValid;
}

// Show error message
function showError(input, errorId, message) {
  input.classList.add('error');
  document.getElementById(errorId).textContent = message;
}

// Clear error message
function clearError(input, errorId) {
  input.classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

// Initialize photo upload
function initPhotoUpload() {
  const photoUploadArea = document.getElementById('photoUploadArea');
  const photoUpload = document.getElementById('photoUpload');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  
  // Click on upload area to trigger file input
  photoUploadArea.addEventListener('click', function() {
    photoUpload.click();
  });
  
  // Handle drag and drop
  photoUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    photoUploadArea.classList.add('dragover');
  });
  
  photoUploadArea.addEventListener('dragleave', function() {
    photoUploadArea.classList.remove('dragover');
  });
  
  photoUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    photoUploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });
  
  // Handle file selection
  photoUpload.addEventListener('change', function() {
    if (this.files.length) {
      handleFiles(this.files);
    }
  });
  
  // Handle selected files
  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const photoPreview = document.createElement('div');
        photoPreview.className = 'photo-preview';
        photoPreview.innerHTML = `
          <img src="${e.target.result}" alt="Property photo">
          <div class="remove-photo">×</div>
        `;
        
        // Add data attribute to store the file
        photoPreview.dataset.file = file.name;
        
        // Add remove button functionality
        const removeButton = photoPreview.querySelector('.remove-photo');
        removeButton.addEventListener('click', function() {
          photoPreview.remove();
        });
        
        photoPreviewContainer.appendChild(photoPreview);
      };
      
      reader.readAsDataURL(file);
    }
  }
}

// Populate review data
function populateReviewData() {
  // Basic info
  document.getElementById('reviewTitle').textContent = document.getElementById('title').value;
  
  const propertyTypeSelect = document.getElementById('propertyType');
  document.getElementById('reviewPropertyType').textContent = 
    propertyTypeSelect.options[propertyTypeSelect.selectedIndex].text;
  
  const roomTypeSelect = document.getElementById('roomType');
  document.getElementById('reviewRoomType').textContent = 
    roomTypeSelect.options[roomTypeSelect.selectedIndex].text;
  
  // Location
  document.getElementById('reviewAddress').textContent = document.getElementById('address').value;
  document.getElementById('reviewCity').textContent = document.getElementById('city').value;
  document.getElementById('reviewCountry').textContent = document.getElementById('country').value;
  
  // Details
  document.getElementById('reviewBedrooms').textContent = document.getElementById('bedrooms').value;
  document.getElementById('reviewBeds').textContent = document.getElementById('beds').value;
  document.getElementById('reviewBathrooms').textContent = document.getElementById('bathrooms').value;
  document.getElementById('reviewMaxGuests').textContent = document.getElementById('maxGuests').value;
  
  // Pricing
  document.getElementById('reviewPrice').textContent = '$' + document.getElementById('pricePerNight').value;
  document.getElementById('reviewCleaningFee').textContent = '$' + document.getElementById('cleaningFee').value;
  document.getElementById('reviewServiceFee').textContent = '$' + document.getElementById('serviceFee').value;
  
  // Photos
  const reviewPhotos = document.getElementById('reviewPhotos');
  reviewPhotos.innerHTML = '';
  
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photos = photoPreviewContainer.querySelectorAll('.photo-preview img');
  
  photos.forEach(photo => {
    const reviewPhoto = document.createElement('div');
    reviewPhoto.className = 'review-photo';
    reviewPhoto.innerHTML = `<img src="${photo.src}" alt="Property photo">`;
    reviewPhotos.appendChild(reviewPhoto);
  });
}

// Initialize form submission
function initFormSubmission() {
  const form = document.getElementById('propertyForm');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate final step
    const confirmAccurate = document.getElementById('confirmAccurate');
    if (!confirmAccurate.checked) {
      showError(confirmAccurate, 'confirmAccurateError', 'Please confirm that all information is accurate');
      return;
    }
    
    // Disable submit button and show loading state
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
      // Get current user
      const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
      
      if (authError) {
        throw new Error(authError.message || 'Authentication error');
      }
      
      if (!session) {
        throw new Error('You must be logged in to create a listing');
      }
      
      // Collect form data
      const formData = new FormData(form);
      
      // Simplify the data structure to avoid potential issues
      const listingData = {
        user_id: session.user.id,
        title: formData.get('title'),
        description: formData.get('description'),
        property_type: formData.get('propertyType'),
        room_type: formData.get('roomType'),
        address: formData.get('address'),
        city: formData.get('city'),
        country: formData.get('country'),
        bedrooms: parseInt(formData.get('bedrooms')),
        beds: parseInt(formData.get('beds')),
        bathrooms: parseFloat(formData.get('bathrooms')),
        max_guests: parseInt(formData.get('maxGuests')),
        price_per_night: parseFloat(formData.get('pricePerNight')),
        status: 'pending'
      };
      
      // Optional fields - only add if they have values
      if (formData.get('state')) listingData.state = formData.get('state');
      if (formData.get('zipCode')) listingData.zip_code = formData.get('zipCode');
      if (formData.get('cleaningFee')) listingData.cleaning_fee = parseFloat(formData.get('cleaningFee'));
      if (formData.get('serviceFee')) listingData.service_fee = parseFloat(formData.get('serviceFee'));
      if (formData.get('checkInTime')) listingData.check_in_time = formData.get('checkInTime');
      if (formData.get('checkOutTime')) listingData.check_out_time = formData.get('checkOutTime');
      if (formData.get('houseRules')) listingData.house_rules = formData.get('houseRules');
      
      const amenities = getSelectedAmenities();
      if (amenities.length > 0) listingData.amenities = amenities;
      
      console.log('Submitting listing data:', listingData);
      
      // Insert listing into database
      const { data: listing, error: listingError } = await supabaseClient
        .from('listings')
        .insert([listingData])
        .select();
      
      if (listingError) {
        console.error('Database error:', listingError);
        throw new Error(listingError.message || 'Error saving listing');
      }
      
      if (!listing || listing.length === 0) {
        throw new Error('Failed to create listing record');
      }
      
      console.log('Listing created:', listing);
      
      // Upload photos
      const photoPreviewContainer = document.getElementById('photoPreviewContainer');
      const photos = photoPreviewContainer.querySelectorAll('.photo-preview img');
      
      if (photos.length === 0) {
        throw new Error('At least one photo is required');
      }
      
      // Create storage bucket if it doesn't exist
      const { error: bucketError } = await supabaseClient
        .storage
        .createBucket('property_photos', {
          public: true
        })
        .catch(err => {
          // Ignore error if bucket already exists
          if (err.message !== 'Bucket already exists') {
            throw err;
          }
          return { error: null };
        });
      
      if (bucketError) {
        console.error('Bucket creation error:', bucketError);
        throw new Error(bucketError.message || 'Error creating storage bucket');
      }
      
      // Upload each photo
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          const photoBlob = await fetch(photo.src).then(r => r.blob());
          const fileExt = photoBlob.type.split('/')[1] || 'jpg';
          const fileName = `listing_${listing[0].id}_photo_${i + 1}.${fileExt}`;
          
          console.log(`Uploading photo ${i+1}:`, fileName);
          
          const { error: uploadError } = await supabaseClient
            .storage
            .from('property_photos')
            .upload(fileName, photoBlob, {
              contentType: photoBlob.type,
              upsert: true
            });
          
          if (uploadError) {
            console.error('Photo upload error:', uploadError);
            throw new Error(uploadError.message || `Error uploading photo ${i+1}`);
          }
          
          // Get public URL for the uploaded photo
          const { data: publicUrlData } = supabaseClient
            .storage
            .from('property_photos')
            .getPublicUrl(fileName);
          
          if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error(`Could not get public URL for photo ${i+1}`);
          }
          
          // Add photo reference to database
          const photoData = {
            listing_id: listing[0].id,
            photo_url: publicUrlData.publicUrl,
            is_main: i === 0 // First photo is the main photo
          };
          
          console.log(`Saving photo ${i+1} data:`, photoData);
          
          const { error: photoError } = await supabaseClient
            .from('listing_photos')
            .insert([photoData]);
          
          if (photoError) {
            console.error('Photo data error:', photoError);
            throw new Error(photoError.message || `Error saving photo ${i+1} data`);
          }
        } catch (photoError) {
          console.error(`Error processing photo ${i+1}:`, photoError);
          throw new Error(photoError.message || `Error processing photo ${i+1}`);
        }
      }
      
      // Success! Redirect to profile page
      alert('Your property has been successfully listed! It will be reviewed by our team shortly.');
      window.location.href = '../auth/profile.html';
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit listing: ' + (error.message || 'Unknown error occurred'));
      
      // Reset submit button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
}

// Get selected amenities
function getSelectedAmenities() {
  const amenityCheckboxes = document.querySelectorAll('input[name="amenities"]:checked');
  const selectedAmenities = [];
  
  amenityCheckboxes.forEach(checkbox => {
    selectedAmenities.push(checkbox.value);
  });
  
  return selectedAmenities;
}