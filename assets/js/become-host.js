document.addEventListener('DOMContentLoaded', function() {
  // Initialize FAQ accordion
  initFaqAccordion();
  
  // Initialize logout button
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// Initialize FAQ accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Toggle active class on the clicked item
      item.classList.toggle('active');
      
      // Update toggle icon
      const toggleIcon = question.querySelector('.toggle-icon');
      toggleIcon.textContent = item.classList.contains('active') ? '−' : '+';
    });
  });
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