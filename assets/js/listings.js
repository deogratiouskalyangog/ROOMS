document.addEventListener('DOMContentLoaded', function() {
  // Fetch and display listings
  fetchListings();
});

async function fetchListings() {
  try {
    const { data: listings, error } = await supabaseClient
      .from('listings')
      .select(`
        *,
        listing_photos(*)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    displayListings(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    document.getElementById('listingsGrid').innerHTML = `
      <div class="error-message">
        <p>Unable to load properties. Please try again later.</p>
      </div>
    `;
  }
}

function displayListings(listings) {
  const listingsGrid = document.getElementById('listingsGrid');
  
  // Clear loading spinner
  listingsGrid.innerHTML = '';
  
  if (!listings || listings.length === 0) {
    listingsGrid.innerHTML = `
      <div class="no-listings">
        <p>No properties available at the moment. Check back soon!</p>
      </div>
    `;
    return;
  }
  
  // Create listing cards
  listings.forEach(listing => {
    // Find main photo or use first photo
    let mainPhoto = listing.listing_photos.find(photo => photo.is_main);
    if (!mainPhoto && listing.listing_photos.length > 0) {
      mainPhoto = listing.listing_photos[0];
    }
    
    const photoUrl = mainPhoto ? mainPhoto.photo_url : '../assets/images/placeholder-property.jpg';
    
    const listingCard = document.createElement('div');
    listingCard.className = 'listing-card';
    listingCard.innerHTML = `
      <div class="listing-image">
        <img src="${photoUrl}" alt="${listing.title}">
      </div>
      <div class="listing-content">
        <h3 class="listing-title">${listing.title}</h3>
        <p class="listing-location">${listing.city}, ${listing.country}</p>
        <div class="listing-details">
          <span>${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>${listing.beds} bed${listing.beds !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>${listing.bathrooms} bathroom${listing.bathrooms !== 1 ? 's' : ''}</span>
        </div>
        <div class="listing-price">
          <span class="price">$${listing.price_per_night}</span> night
        </div>
      </div>
    `;
    
    // Add click event to navigate to listing details page
    listingCard.addEventListener('click', function() {
      window.location.href = `listing-details.html?id=${listing.id}`;
    });
    
    listingsGrid.appendChild(listingCard);
  });
}