// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize resume download functionality
    initResumeDownload();
    
    // Initialize modal for potential resume detail view
    initResumeModal();

    // Initialize floating icons for social media links
    initFloatingIcons();
});

// Handle resume download button
function initResumeDownload() {
    const resumeBtn = document.getElementById('resumeBtn');
    
    if (!resumeBtn) return;
    
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Path to your resume PDF file
        const pdfPath = './assets/Gajendra_resume.pdf';
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'Gajendra_Singh_Resume.pdf'; // Name for the downloaded file
        
        // Append link to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Simulating download started notification
        const originalText = resumeBtn.innerHTML;
        resumeBtn.innerHTML = '<i class="fas fa-check"></i> <span>Download Started</span>';
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            resumeBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Modal for potential detailed resume view
function initResumeModal() {
    // This function would create and handle a modal for displaying detailed resume
    // For now, we'll just prepare the structure for future implementation
    
    // Create modal elements if they don't exist in HTML
    if (!document.querySelector('.resume-modal')) {
        const modalHTML = `
            <div class="resume-modal modal" id="resumeModal">
                <div class="modal-content p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-2xl font-semibold">Detailed Resume</h3>
                        <button class="close-modal text-text-light hover:text-accent">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Detailed resume content would go here -->
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
    }
    
    // Function to open resume modal (can be called from elsewhere)
    window.openResumeModal = function() {
        const modal = document.getElementById('resumeModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Close modal when clicking the close button
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside the content
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Add project detail modal functionality
function initProjectDetails() {
    const projectLinks = document.querySelectorAll('.project-card a:not([target="_blank"])');
    
    projectLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get project info from parent card
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            
            // Show alert for demonstration
            alert(`Project details for "${projectTitle}" would be shown in a modal. This functionality can be implemented in the future.`);
            
            // In a full implementation, you would:
            // 1. Create a modal component
            // 2. Populate it with project details
            // 3. Show the modal
        });
    });
}

// Initialize skills progress bars if needed
function initSkillBars() {
    // This function could be used to animate skill proficiency bars
    // if they are added to the resume section in the future
    
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    
    skillBars.forEach((bar) => {
        const progress = bar.getAttribute('data-progress') || '0';
        
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 500);
    });
}

// Initialize floating icons for social media links
function initFloatingIcons() {
    const socialIcons = document.querySelectorAll('.social-links a i');
    
    socialIcons.forEach(icon => {
        const floatingIcon = document.createElement('i');
        floatingIcon.className = icon.className + ' floating-icon';
        
        icon.parentElement.appendChild(floatingIcon);
        
        icon.parentElement.addEventListener('mouseenter', () => {
            floatingIcon.style.animation = 'float-up 1s ease-out';
            setTimeout(() => {
                floatingIcon.remove();
                const newFloatingIcon = document.createElement('i');
                newFloatingIcon.className = icon.className + ' floating-icon';
                icon.parentElement.appendChild(newFloatingIcon);
            }, 1000);
        });
    });
}