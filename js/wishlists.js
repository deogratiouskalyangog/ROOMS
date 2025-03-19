// Sample wishlist data (replace with actual data or API calls)
const wishlists = [
  // This array will be populated when users create wishlists
];

// Function to display wishlists
function displayWishlists() {
  const container = document.getElementById('wishlists-container');
  
  if (!wishlists || wishlists.length === 0) {
    // Show empty state if no wishlists
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;fill:none;height:64px;width:64px;stroke:currentColor;stroke-width:2;overflow:visible">
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
          </svg>
        </div>
        <h2>Create your first wishlist</h2>
        <p>As you search, click the heart icon to save your favorite places and experiences to a wishlist.</p>
        <button class="start-searching-button">Start searching</button>
      </div>
    `;
    
    // Add event listener to the start searching button
    const startSearchingButton = container.querySelector('.start-searching-button');
    startSearchingButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    
    return;
  }
  
  // Display wishlists if they exist
  container.innerHTML = '';
  
  wishlists.forEach(wishlist => {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.setAttribute('data-id', wishlist.id);
    
    card.innerHTML = `
      <img src="${wishlist.image_url}" alt="${wishlist.title}" class="wishlist-image">
      <div class="wishlist-details">
        <div class="wishlist-title">${wishlist.title}</div>
        <div class="wishlist-count">${wishlist.count} saved</div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `wishlist.html?id=${wishlist.id}`;
    });
    
    container.appendChild(card);
  });
}

// Function to create a new wishlist
function createWishlist(title) {
  const newWishlist = {
    id: Date.now(), // Simple unique ID
    title: title,
    count: 0,
    image_url: 'images/wishlist-placeholder.jpg', // Default image
    items: []
  };
  
  wishlists.push(newWishlist);
  
  // Save to localStorage (simple client-side storage)
  localStorage.setItem('jcp_wishlists', JSON.stringify(wishlists));
  
  // Refresh the display
  displayWishlists();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Load wishlists from localStorage
  const savedWishlists = localStorage.getItem('jcp_wishlists');
  if (savedWishlists) {
    wishlists.push(...JSON.parse(savedWishlists));
  }
  
  // Display wishlists
  displayWishlists();
  
  // Set up create wishlist button
  const createWishlistButton = document.querySelector('.create-wishlist-button');
  createWishlistButton.addEventListener('click', () => {
    const title = prompt('Enter a name for your wishlist:');
    if (title) {
      createWishlist(title);
    }
  });
  
  // Set up search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  
  searchButton.addEventListener('click', () => {
    searchWishlists(searchInput.value);
  });
  
  searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      searchWishlists(searchInput.value);
    }
  });
});

// Function to search wishlists
function searchWishlists(query) {
  if (!query) {
    displayWishlists();
    return;
  }
  
  const searchTerm = query.toLowerCase();
  const filtered = wishlists.filter(wishlist => 
    wishlist.title.toLowerCase().includes(searchTerm)
  );
  
  const container = document.getElementById('wishlists-container');
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No wishlists found</h2>
        <p>We couldn't find any wishlists matching "${query}".</p>
        <button class="start-searching-button">Clear search</button>
      </div>
    `;
    
    const clearButton = container.querySelector('.start-searching-button');
    clearButton.addEventListener('click', () => {
      document.querySelector('.search-input').value = '';
      displayWishlists();
    });
    
    return;
  }
  
  // Display filtered wishlists
  container.innerHTML = '';
  
  filtered.forEach(wishlist => {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.setAttribute('data-id', wishlist.id);
    
    card.innerHTML = `
      <img src="${wishlist.image_url}" alt="${wishlist.title}" class="wishlist-image">
      <div class="wishlist-details">
        <div class="wishlist-title">${wishlist.title}</div>
        <div class="wishlist-count">${wishlist.count} saved</div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `wishlist.html?id=${wishlist.id}`;
    });
    
    container.appendChild(card);
  });
}