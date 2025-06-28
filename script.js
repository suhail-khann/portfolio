// Matrix animation setup
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
let hue = 120; // Starting with green

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    // Slowly shift hue for color variation
    hue = (hue + 0.1) % 360;
}

setInterval(drawMatrix, 50);

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 100
    });

    // Smooth scroll with enhanced easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return; // Guard clause if target doesn't exist
            
            const startPosition = window.pageYOffset;
            const targetPosition = target.getBoundingClientRect().top + startPosition;
            const startTime = performance.now();
            const duration = 1000;

            function animation(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                
                window.scrollTo(0, startPosition + (targetPosition - startPosition) * ease(progress));

                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        });
    });

    // Enhanced navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return; // Guard clause
        
        const scrolled = window.scrollY > 50;
        
        navbar.style.background = scrolled ? 
            'rgba(0, 20, 0, 0.95)' : 
            'rgba(0, 20, 0, 0.8)';
        
        navbar.style.boxShadow = scrolled ?
            '0 0 20px rgba(0, 255, 0, 0.1)' :
            'none';
    });

    // Enhanced form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formElements = this.elements;
            let isValid = true;
        
            for (let element of formElements) {
                if (element.required && !element.value.trim()) {
                    element.style.borderColor = '#ff0000';
                    isValid = false;
                } else {
                    element.style.borderColor = 'rgba(0, 255, 0, 0.3)';
                }
            }
        
            if (isValid) {
                // Show loading indicator
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
                
                // Get form data
                const name = this.querySelector('input[type="text"]').value;
                const email = this.querySelector('input[type="email"]').value;
                const message = this.querySelector('textarea').value;
        
                // Send email using EmailJS
                emailjs.send(
                    'service_l32mhuj',
                    'template_l5gthwh',
                    {
                        user_name: name,
                        user_email: email,
                        message: message
                    }
                ).then(
                    function(response) {
                        alert('Thank you for your message! I will get back to you soon.');
                        document.getElementById('contactForm').reset();
                        // Reset button
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    },
                    function(error) {
                        alert('Sorry, there was an error sending your message. Please try again later.');
                        console.error('EmailJS error:', error);
                        // Reset button
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    }
                );
            }
        });
    }

    // Dynamic year in footer
    const footerP = document.querySelector('footer p');
    if (footerP) {
        footerP.innerHTML = `&copy; ${new Date().getFullYear()} Suhail Khan. All rights reserved.`;
    }

    // Particle effect configuration
    const particlesConfig = {
        particles: {
            number: { value: 80 },
            color: { value: "#00ff00" },
            shape: { type: "char", character: ["0", "1"] },
            opacity: { value: 0.5 },
            size: { value: 10 },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" }
            }
        }
    };

    // Initialize particles if available
    if (typeof particlesJS !== 'undefined') {
        particlesJS('matrixCanvas', particlesConfig);
    }

    // Image display functions
    window.showImage = function() {
        const sihImage = document.getElementById("SIH-image");
        if (sihImage) sihImage.style.display = "block";
    }

    window.showImage2 = function() {
        const encryptImage = document.getElementById("encrypt-image");
        if (encryptImage) encryptImage.style.display = "block";
    }

    // About section animation
    const aboutSection = document.querySelector('.about');
    const lockContainer = document.querySelector('.lock-container');
    
    if (aboutSection && lockContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lockContainer.classList.add('unlock-animation');
                } else {
                    lockContainer.classList.remove('unlock-animation');
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutSection);
    }

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(event) {
            navLinks.classList.toggle('active');
            event.stopPropagation(); // Stop event from bubbling up to document
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-toggle') && 
            navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Computer intro animation
    const computer = document.getElementById('computer');
    if (computer) {
        computer.addEventListener('click', function() {
            // Add zoom effect to computer
            this.classList.add('zoom-effect');
            
            // Show matrix animation
            const introContainer = document.querySelector('.intro-container');
            if (introContainer) {
                setTimeout(() => {
                    introContainer.classList.add('hide-intro');
                    if (canvas) canvas.classList.add('show-matrix-entry');
                    
                    // Show main content after matrix effect
                    const mainContent = document.querySelector('main') || document.body;
                    setTimeout(() => {
                        if (mainContent) mainContent.classList.add('show-content');
                        if (canvas) canvas.style.opacity = '0.3'; // Reduce matrix opacity
                    }, 1500);
                }, 1000);
            }
        });
    }

    // Certificate toggle functionality
    window.toggleCertificate = function(certId) {
        const container = document.getElementById(certId);
        if (container) {
            container.classList.toggle('show');
        }
    }

    // Add modal functionality for certificates
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <img class="modal-content">
    `;
    document.body.appendChild(modal);

    // Add click handlers to all certificate images
    document.querySelectorAll('.certification-images').forEach(img => {
        img.addEventListener('click', function(e) {
            const modalImg = modal.querySelector('.modal-content');
            modalImg.src = this.src;
            modal.classList.add('show');
            e.stopPropagation();
        });
    });

    // Close modal on click outside or close button
    modal.addEventListener('click', function() {
        this.classList.remove('show');
    });

    const modalClose = modal.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            modal.classList.remove('show');
            e.stopPropagation();
        });
    }

    // Resume download functionality
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});