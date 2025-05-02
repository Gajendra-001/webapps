// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation observers
    initAnimations();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize scroll progress bar
    initScrollProgress();
    
    // Initialize contact form
    initContactForm();
});

// Handle fade-in animations on scroll
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach((element) => {
        observer.observe(element);
    });
    
    // Manually trigger animations that are already visible on page load
    setTimeout(() => {
        animatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }, 100);
}

// Custom cursor implementation
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    // Show cursors after a short delay
    setTimeout(() => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    }, 1000);
    
    document.addEventListener('mousemove', (e) => {
        // Main cursor follows with some delay
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Dot cursor follows instantly
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Handle hover effects
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-badge');
    
    hoverElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'var(--accent)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'var(--accent)';
        });
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    
    if (!typingElement) return;
    
    // Get the text to type
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Contact form handling with Formspree
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // Create notification function for form feedback
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.fontWeight = '500';
        notification.style.transition = 'all 0.3s ease';
        
        if (type === 'success') {
            notification.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
            notification.style.color = 'white';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Add form submission event listener
    contactForm.addEventListener('submit', function(e) {
        // Don't prevent default - let Formspree handle the submission
        // But we can still do client-side validation
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form data
        if (!name || !email || !subject || !message) {
            e.preventDefault(); // Prevent form submission if validation fails
            showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        // Change button text during submission
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Show sending notification
        showNotification('Sending your message...', 'success');
        
        // We'll let the form submit naturally to Formspree
        // The page will redirect back after submission based on the _next hidden field
        
        // After 5 seconds, reset button in case submission is taking long
        setTimeout(function() {
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }, 5000);
    });
    
    // Check if user was redirected back after submission (URL has ?submitted=true)
    if (window.location.search.includes('submitted=true')) {
        showNotification('Message sent successfully!', 'success');
        // Clear the URL parameter
        window.history.replaceState(null, null, window.location.pathname + window.location.hash);
    }
}