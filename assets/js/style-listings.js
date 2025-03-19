/**
 * Utility script to add visual styling to listing elements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the listings container
    const listingsContainer = document.getElementById('listingsGrid');
    if (!listingsContainer) return;
    
    // Get all listing elements (once they're loaded)
    setTimeout(() => {
        const listingElements = Array.from(listingsContainer.querySelectorAll('.listing-card'));
        
        // Add borders to each listing
        addBorders(listingElements);
        
        // Add background to the container
        addBackground(listingsContainer);
    }, 2000); // Wait for listings to load
    
    // Function to add borders to elements
    function addBorders(elements) {
        for (const el of elements) {
            setElementStyles(el, {
                border: '2px solid #FF385C',
                borderRadius: '12px',
                margin: '5px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
            });
        }
    }
    
    // Function to add background to an element
    function addBackground(element) {
        setElementStyles(element, {
            border: '2px dashed #00A699',
            backgroundColor: '#F7F7F7',
            padding: '20px',
            borderRadius: '16px'
        });
    }
    
    // Helper function to set multiple styles on an element
    function setElementStyles(element, styles) {
        for (const [property, value] of Object.entries(styles)) {
            element.style[property] = value;
        }
    }
});