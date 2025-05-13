document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const linkDisplay = document.getElementById('link-display');
    const copyButton = document.getElementById('copy-button');
    const copyMessage = document.getElementById('copy-message');
    const homeContainer = document.getElementById('home-container');
    const animationContainer = document.getElementById('animation-container');
    const typedText = document.getElementById('typed-text');
    const searchNowButton = document.getElementById('search-now-button');
    const cursor = document.getElementById('cursor');
    const loading = document.getElementById('loading');
    const steps = document.querySelectorAll('.step');
    
    // Phind URL
    const phindUrl = 'https://phind.com/search';
    
    // Check URL for query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    // If query parameter exists, show animation
    if (query) {
        // Show animation container, hide home container
        homeContainer.classList.add('hidden');
        animationContainer.classList.remove('hidden');
        
        // Decode the query
        const decodedQuery = decodeURIComponent(query);
        
        // Start animation sequence
        setTimeout(startAnimation, 1000, decodedQuery);
    } else {
        // Update link on input change
        searchInput.addEventListener('input', updateLink);
        
        // Button click handlers
        searchButton.addEventListener('click', function() {
            if (searchInput.value.trim() !== '') {
                window.location.href = `?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
        
        // Enter key handler
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                window.location.href = `?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
        
        // Copy link button
        copyButton.addEventListener('click', copyLink);
        
        // Initialize link
        updateLink();
    }
    
    // Functions
    function updateLink() {
        const query = searchInput.value.trim();
        if (query === '') {
            linkDisplay.value = window.location.origin + window.location.pathname;
        } else {
            linkDisplay.value = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(query)}`;
        }
    }
    
    function copyLink() {
        linkDisplay.select();
        document.execCommand('copy');
        
        // Show copied message
        copyMessage.classList.remove('hidden');
        setTimeout(function() {
            copyMessage.classList.add('hidden');
        }, 2000);
    }
    
    function updateStepStatus(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function startAnimation(text) {
        updateStepStatus(0); // Activate step 1
        
        // Start cursor animation
        cursor.style.animation = 'moveToInput 2s forwards';
        
        // After cursor moves to input area, start typing
        setTimeout(function() {
            startTyping(text);
        }, 2000);
    }
    
    function startTyping(text) {
        let i = 0;
        const typingSpeed = 70; // milliseconds per character
        
        // Clear any previous text
        typedText.textContent = '';
        
        // Type each character one by one
        const typingInterval = setInterval(function() {
            if (i < text.length) {
                typedText.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                
                // Update step indicator
                updateStepStatus(1); // Activate step 2
                
                // Move cursor to search button
                cursor.style.animation = 'clickSearch 1.5s forwards';
                
                // After a delay, "click" search button
                setTimeout(function() {
                    simulateSearchClick();
                }, 1500);
            }
        }, typingSpeed);
    }
    
    function simulateSearchClick() {
        // Visual feedback of button click
        searchNowButton.style.animation = 'buttonPulse 0.3s';
        
        setTimeout(function() {
            searchNowButton.style.animation = '';
            
            // Update step indicator
            updateStepStatus(2); // Activate step 3
            
            // Show loading screen
            document.querySelector('.animation-container').classList.add('fade-out');
            
            setTimeout(function() {
                document.querySelector('.animation-container').classList.add('hidden');
                loading.classList.remove('hidden');
                loading.classList.add('fade-in');
                
                // After a delay, redirect to Phind
                setTimeout(function() {
                    redirectToPhind();
                }, 2000);
            }, 500);
        }, 300);
    }
    
    function redirectToPhind() {
        // Get the question from the typed text
        const question = typedText.textContent;
        
        // Redirect to Phind with the query parameter
        window.location.href = phindUrl + (question ? `?q=${encodeURIComponent(question)}` : '');
    }
});