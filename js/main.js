// Main JavaScript for JCP Properties

// Sample property data (replace with actual data or API calls)
const properties = [
  {
    id: 1,
    title: "Modern Apartment with City View",
    location: "Downtown",
    distance: "2 miles away",
    dates: "Nov 5-10",
    price: 120,
    rating: 4.92,
    reviews: 128,
    images: ["images/property1.jpg"]
  },
  {
    id: 2,
    title: "Cozy Beach House",
    location: "Oceanfront",
    distance: "5 miles away",
    dates: "Nov 12-17",
    price: 180,
    rating: 4.85,
    reviews: 95,
    images: ["images/property2.jpg"]
  },
  {
    id: 3,
    title: "Luxury Villa with Pool",
    location: "Hillside",
    distance: "8 miles away",
    dates: "Nov 20-25",
    price: 250,
    rating: 4.98,
    reviews: 210,
    images: ["images/property3.jpg"]
  },
  {
    id: 4,
    title: "Rustic Cabin in the Woods",
    location: "Forest",
    distance: "12 miles away",
    dates: "Dec 1-6",
    price: 95,
    rating: 4.79,
    reviews: 68,
    images: ["images/property4.jpg"]
  },
  {
    id: 5,
    title: "Penthouse with Panoramic Views",
    location: "City Center",
    distance: "1 mile away",
    dates: "Dec 10-15",
    price: 220,
    rating: 4.95,
    reviews: 156,
    images: ["images/property5.jpg"]
  },
  {
    id: 6,
    title: "Charming Cottage",
    location: "Countryside",
    distance: "15 miles away",
    dates: "Dec 20-25",
    price: 110,
    rating: 4.88,
    reviews: 82,
    images: ["images/property6.jpg"]
  }
];

// Function to display properties
function displayProperties(propertiesArray) {
  const container = document.querySelector('.property-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  propertiesArray.forEach(property => {
    const propertyCard = document.createElement('div');
    propertyCard.className = 'property-card';
    propertyCard.setAttribute('data-id', property.id);
    
    propertyCard.innerHTML = `
      <div class="property-image-container">
        <img src="${property.images[0]}" alt="${property.title}" class="property-image">
        <button class="wishlist-button" aria-label="Add to wishlist">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;fill:rgba(0,0,0,0.5);height:24px;width:24px;stroke:white;stroke-width:2;overflow:visible">
            <path d="m16 28c7-4.73 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.27 14 17z"></path>
          </svg>
        </button>
      </div>
      <div class="property-info">
        <div class="property-location">
          <span class="location-name">${property.location}</span>
          <div class="property-rating">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;height:12px;width:12px;fill:currentColor">
              <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" fill-rule="evenodd"></path>
            </svg>
            ${property.rating}
          </div>
        </div>
        <div class="property-details">${property.distance} · ${property.dates}</div>
        <div class="property-price">$${property.price} <span class="price-total">night</span></div>
      </div>
    `;
    
    container.appendChild(propertyCard);
    
    // Add event listener for wishlist button
    const wishlistButton = propertyCard.querySelector('.wishlist-button');
    wishlistButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWishlist(property.id);
    });
    
    // Add event listener for property card click
    propertyCard.addEventListener('click', (e) => {
      if (!e.target.closest('.wishlist-button')) {
        window.location.href = `property.html?id=${property.id}`;
      }
    });
  });
}

// Function to toggle wishlist status
function toggleWishlist(propertyId) {
  let wishlist = JSON.parse(localStorage.getItem('jcp_wishlist') || '[]');
  
  const index = wishlist.indexOf(propertyId);
  if (index === -1) {
    wishlist.push(propertyId);
    showToast('Added to wishlist');
  } else {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  }
  
  localStorage.setItem('jcp_wishlist', JSON.stringify(wishlist));
  updateWishlistButtons();
}

// Function to update wishlist buttons
function updateWishlistButtons() {
  const wishlist = JSON.parse(localStorage.getItem('jcp_wishlist') || '[]');
  const buttons = document.querySelectorAll('.wishlist-button');
  
  buttons.forEach(button => {
    const propertyId = parseInt(button.closest('.property-card').getAttribute('data-id'));
    const isFavorite = wishlist.includes(propertyId);
    
    if (isFavorite) {
      button.querySelector('svg').style.fill = '#FF5A5F';
    } else {
      button.querySelector('svg').style.fill = 'rgba(0,0,0,0.5)';
    }
  });
}

// Function to show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Function to filter properties by category
function filterByCategory(category) {
  const categoryButtons = document.querySelectorAll('.category-item');
  categoryButtons.forEach(button => {
    button.classList.remove('active');
    if (button.querySelector('span').textContent === category) {
      button.classList.add('active');
    }
  });
  
  // In a real application, you would filter the properties based on the category
  // For this demo, we'll just display all properties
  displayProperties(properties);
}

// Function to check login status
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('jcp_logged_in') === 'true';
  const loginNavItem = document.querySelector('[data-veloute="pwa-tab-bar-item-login"]');
  
  if (isLoggedIn && loginNavItem) {
    const userEmail = localStorage.getItem('jcp_user_email');
    loginNavItem.querySelector('._q2c5o4u').textContent = 'Profile';
    loginNavItem.href = 'profile.html';
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Display properties
  displayProperties(properties);
  
  // Set up category filters
  const categoryButtons = document.querySelectorAll('.category-item');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.querySelector('span').textContent;
      filterByCategory(category);
    });
  });
  
  // Update wishlist buttons
  updateWishlistButtons();
  
  // Check login status
  checkLoginStatus();
  
  // Set up search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  
  if (searchInput && searchButton) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      if (searchTerm) {
        const filteredProperties = properties.filter(property => 
          property.title.toLowerCase().includes(searchTerm) || 
          property.location.toLowerCase().includes(searchTerm)
        );
        displayProperties(filteredProperties);
      } else {
        displayProperties(properties);
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });
  }
});