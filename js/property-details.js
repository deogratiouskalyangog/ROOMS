// Function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to display property details
async function displayPropertyDetails() {
  const propertyId = getUrlParameter('id');
  
  if (!propertyId) {
    document.getElementById('property-container').innerHTML = `
      <div class="error-message">
        <h2>Property Not Found</h2>
        <p>No property ID was specified. <a href="index.html">Return to listings</a></p>
      </div>
    `;
    return;
  }
  
  try {
    const property = await fetchPropertyById(propertyId);
    
    if (!property) {
      document.getElementById('property-container').innerHTML = `
        <div class="error-message">
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist or has been removed. <a href="index.html">Return to listings</a></p>
        </div>
      `;
      return;
    }
    
    // Update page title
    document.title = `${property.title} - JCP Properties`;
    
    // Create property details HTML
    const propertyHTML = `
      <div class="property-header">
        <h1 class="property-title">${property.title || 'Unnamed Property'}</h1>
        <p class="property-location">${property.location || 'Location not specified'}</p>
      </div>
      
      <div class="property-images">
        <div class="property-main-image">
          <img src="${property.image_url || 'https://via.placeholder.com/600x400?text=JCP+Property'}" alt="${property.title}" class="property-image">
        </div>
        ${property.additional_images ? 
          `<div>
            <img src="${property.additional_images[0] || property.image_url || 'https://via.placeholder.com/300x200?text=JCP+Property'}" alt="${property.title}" class="property-image">
          </div>
          <div>
            <img src="${property.additional_images[1] || property.image_url || 'https://via.placeholder.com/300x200?text=JCP+Property'}" alt="${property.title}" class="property-image">
          </div>` 
          : 
          `<div>
            <img src="${property.image_url || 'https://via.placeholder.com/300x200?text=JCP+Property'}" alt="${property.title}" class="property-image">
          </div>
          <div>
            <img src="${property.image_url || 'https://via.placeholder.com/300x200?text=JCP+Property'}" alt="${property.title}" class="property-image">
          </div>`
        }
      </div>
      
      <div class="property-details">
        <div class="property-description">
          <h2>About this place</h2>
          <p>${property.description || 'No description available for this property.'}</p>
          
          <h3>Amenities</h3>
          <ul>
            ${property.amenities ? 
              property.amenities.map(amenity => `<li>${amenity}</li>`).join('') 
              : 
              '<li>Information not available</li>'
            }
          </ul>
        </div>
        
        <div class="property-booking">
          <div class="property-price">${property.price ? '$' + property.price + ' night' : 'Price on request'}</div>
          
          <div class="booking-form">
            <div class="date-picker">
              <label for="check-in">Check-in</label>
              <input type="date" id="check-in" name="check-in">
            </div>
            
            <div class="date-picker">
              <label for="check-out">Check-out</label>
              <input type="date" id="check-out" name="check-out">
            </div>
            
            <div class="guests">
              <label for="guests">Guests</label>
              <select id="guests" name="guests">
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
              </select>
            </div>
            
            <button class="book-button">Book this place</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('property-container').innerHTML = propertyHTML;
    
    // Add event listener to the book button
    document.querySelector('.book-button').addEventListener('click', function() {
      alert('Booking functionality will be implemented soon!');
    });
    
  } catch (error) {
    console.error('Error displaying property details:', error);
    document.getElementById('property-container').innerHTML = `
      <div class="error-message">
        <h2>Error Loading Property</h2>
        <p>There was an error loading the property details. Please try again later.</p>
        <p><a href="index.html">Return to listings</a></p>
      </div>
    `;
  }
}

// Load property details when page loads
document.addEventListener('DOMContentLoaded', displayPropertyDetails);