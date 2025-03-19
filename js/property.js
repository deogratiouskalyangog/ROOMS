// Sample property data (replace with actual data or API calls)
const properties = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Mombasa, Kenya",
    price: 250,
    category: "Villas",
    image_url: "images/property1.jpg",
    description: "Experience luxury living in this stunning beachfront villa with panoramic ocean views. This spacious property features 4 bedrooms, a private pool, and direct beach access.",
    features: ["4 Bedrooms", "3 Bathrooms", "Private Pool", "Beach Access", "Air Conditioning", "Free WiFi", "Kitchen", "Parking"]
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Nairobi, Kenya",
    price: 120,
    category: "Apartments",
    image_url: "images/property2.jpg",
    description: "Stylish and modern apartment in the heart of Nairobi. Perfect for business travelers or tourists looking to explore the city. Walking distance to major attractions and shopping centers.",
    features: ["2 Bedrooms", "1 Bathroom", "City View", "Air Conditioning", "Free WiFi", "Kitchen", "Gym Access"]
  },
  {
    id: 3,
    title: "Cozy Family House",
    location: "Nakuru, Kenya",
    price: 180,
    category: "Houses",
    image_url: "images/property3.jpg",
    description: "Comfortable family house in a quiet neighborhood. Ideal for families looking for a peaceful stay with all the comforts of home.",
    features: ["3 Bedrooms", "2 Bathrooms", "Garden", "Parking", "Free WiFi", "Kitchen", "Washing Machine"]
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    location: "Nairobi, Kenya",
    price: 300,
    category: "Luxury",
    image_url: "images/property4.jpg",
    description: "Exclusive penthouse with stunning city views. This luxury accommodation offers premium amenities and an unforgettable experience.",
    features: ["3 Bedrooms", "2 Bathrooms", "Rooftop Terrace", "Hot Tub", "Air Conditioning", "Free WiFi", "Kitchen", "Parking"]
  },
  {
    id: 5,
    title: "Beach House Retreat",
    location: "Diani, Kenya",
    price: 220,
    category: "Beachfront",
    image_url: "images/property5.jpg",
    description: "Relax in this beautiful beach house just steps from the white sands of Diani Beach. Perfect for a beach getaway.",
    features: ["2 Bedrooms", "2 Bathrooms", "Beach Access", "Outdoor Shower", "Air Conditioning", "Free WiFi", "Kitchen"]
  },
  {
    id: 6,
    title: "Downtown Apartment",
    location: "Nairobi, Kenya",
    price: 95,
    category: "Apartments",
    image_url: "images/property6.jpg",
    description: "Affordable and convenient apartment in downtown Nairobi. Great location for exploring the city.",
    features: ["1 Bedroom", "1 Bathroom", "City View", "Free WiFi", "Kitchen"]
  }
];

// Function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to display property details
function displayPropertyDetails(propertyId) {
  const property = properties.find(p => p.id === parseInt(propertyId));
  const container = document.getElementById('property-details');
  
  if (!property) {
    container.innerHTML = '<div class="loading">Property not found.</div>';
    return;
  }
  
  // Create HTML for property details
  const html = `
    <div class="property-image-container">
      <img src="${property.image_url}" alt="${property.title}" class="property-main-image">
    </div>
    
    <h1 class="property-title">${property.title}</h1>
    
    <div class="property-location">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;height:16px;width:16px;fill:currentColor">
        <path d="M16 0c-5.523 0-10 4.477-10 10 0 7.5 10 22 10 22s10-14.5 10-22c0-5.523-4.477-10-10-10zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
      </svg>
      ${property.location}
    </div>
    
    <div class="property-price">$${property.price} per night</div>
    
    <div class="property-description">
      ${property.description}
    </div>
    
    <div class="property-features">
      <h2 class="feature-title">What this place offers</h2>
      <div class="features-list">
        ${property.features.map(feature => `
          <div class="feature-item">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;height:16px;width:16px;fill:currentColor">
              <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm0 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm6.707 10.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L14 19.586l7.293-7.293a1 1 0 0 1 1.414 0z"></path>
            </svg>
            ${feature}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="booking-container">
      <h2 class="booking-title">Book this place</h2>
      <div class="date-picker">
        <input type="date" class="date-input" placeholder="Check-in">
        <input type="date" class="date-input" placeholder="Check-out">
      </div>
      <button class="book-button">Book Now</button>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listener to the book button
  const bookButton = container.querySelector('.book-button');
  bookButton.addEventListener('click', () => {
    alert('Booking functionality will be implemented soon!');
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  const propertyId = getUrlParameter('id');
  
  if (!propertyId) {
    window.location.href = 'index.html';
    return;
  }
  
  displayPropertyDetails(propertyId);
});