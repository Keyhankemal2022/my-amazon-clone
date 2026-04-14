// Amazon-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            if (query) {
                alert(`Searching for: ${query}`);
                // In real app: window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }
    
    // Header hover effects
    const accountLink = document.querySelector('.account-link');
    if (accountLink) {
        accountLink.addEventListener('mouseenter', () => {
            accountLink.textContent = 'Hello, Sign in';
        });
        accountLink.addEventListener('mouseleave', () => {
            accountLink.textContent = 'Account & Lists';
        });
    }
});