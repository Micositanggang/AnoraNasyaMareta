// Background Music Control
let musicPlaying = false;
let musicStarted = false;
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');

// ===== REALTIME RELATIONSHIP COUNTER =====
// GANTI TANGGAL & JAM MULAI JADIAN DI SINI (Format: "YYYY-MM-DD HH:MM:SS")
const RELATIONSHIP_START = new Date("2025-10-17 14:10:10"); // GANTI SESUAI TANGGAL & JAM JADIAN

function updateRelationshipCounter() {
    // Get current time in WIB (UTC+7)
    const now = new Date();
    const wibOffset = 7 * 60; // WIB is UTC+7
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibTime = new Date(utc + (wibOffset * 60000));
    
    // Calculate months properly
    let years = wibTime.getFullYear() - RELATIONSHIP_START.getFullYear();
    let months = wibTime.getMonth() - RELATIONSHIP_START.getMonth();
    let days = wibTime.getDate() - RELATIONSHIP_START.getDate();
    let hours = wibTime.getHours() - RELATIONSHIP_START.getHours();
    let minutes = wibTime.getMinutes() - RELATIONSHIP_START.getMinutes();
    let seconds = wibTime.getSeconds() - RELATIONSHIP_START.getSeconds();
    
    // Adjust for negative values
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Get days in previous month
        const prevMonth = new Date(wibTime.getFullYear(), wibTime.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    
    // Total months including years
    const totalMonths = (years * 12) + months;
    
    // Update DOM
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (monthsEl) monthsEl.textContent = totalMonths;
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
}

// Update counter every second
setInterval(updateRelationshipCounter, 1000);

// Initialize counter on page load
window.addEventListener('load', () => {
    updateRelationshipCounter();
    updateMusicButton();
});

// Auto-start music on first click anywhere
document.addEventListener('click', function initMusic() {
    if (!musicStarted) {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicStarted = true;
            updateMusicButton();
        }).catch(error => {
            console.log('Waiting for user interaction to play music');
        });
    }
}, { once: false });

// Toggle music on/off
function toggleMusic(event) {
    // Prevent event bubbling that might trigger scroll
    event.preventDefault();
    event.stopPropagation();
    
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicStarted = true;
            updateMusicButton();
        }).catch(error => {
            console.log('Error playing audio:', error);
        });
    }
    updateMusicButton();
}

// Update music button appearance
function updateMusicButton() {
    const playingIcon = musicControl.querySelector('.playing');
    const pausedIcon = musicControl.querySelector('.paused');
    
    if (musicPlaying) {
        playingIcon.style.display = 'block';
        pausedIcon.style.display = 'none';
        musicControl.classList.add('active');
    } else {
        playingIcon.style.display = 'none';
        pausedIcon.style.display = 'block';
        musicControl.classList.remove('active');
    }
}

// Smooth scroll behavior
function scrollToNext() {
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
}

function resetToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe timeline items
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));
    
    // Observe new sections
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => observer.observe(card));
    
    const factCards = document.querySelectorAll('.fact-card');
    factCards.forEach(card => observer.observe(card));
    
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => observer.observe(item));
    
    const wishCards = document.querySelectorAll('.wish-card');
    wishCards.forEach(card => observer.observe(card));
});

// Reason cards flip interaction
const reasonCards = document.querySelectorAll('.reason-card');
reasonCards.forEach(card => {
    card.addEventListener('click', () => {
        const isRevealed = card.getAttribute('data-reveal') === 'true';
        card.setAttribute('data-reveal', !isRevealed);
        
        // Add subtle animation feedback
        if (!isRevealed) {
            createSparkles(card);
        }
    });
});

// Create sparkle effect
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';
        sparkle.style.width = '8px';
        sparkle.style.height = '8px';
        sparkle.style.background = 'linear-gradient(135deg, #ff6b9d, #ffa5c0)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        
        document.body.appendChild(sparkle);
        
        const angle = (Math.PI * 2 / 6) * i;
        const distance = 60;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => sparkle.remove(), 800);
    }
}

// Scroll to message section
function scrollToMessage() {
    document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
}

// Final message modal
function showFinalMessage() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.add('active');
    createHeartExplosion();
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
}

// Thank you modal
function showThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    modal.classList.add('active');
    createHeartExplosion();
}

function closeThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    modal.classList.remove('active');
}

// Handle message form submission
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(messageForm);
            
            // Submit form using fetch
            fetch(messageForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show thank you modal
                    showThankYouModal();
                    // Reset form
                    messageForm.reset();
                } else {
                    // If FormSubmit redirects, just show modal anyway
                    showThankYouModal();
                    messageForm.reset();
                }
            })
            .catch(error => {
                // Even on error, show modal (FormSubmit might redirect)
                console.log('Form submitted');
                showThankYouModal();
                messageForm.reset();
            });
        });
    }
});

// Click outside modal to close
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const thankYouModal = document.getElementById('thankYouModal');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                closeModal();
            }
        });
    }
    
    if (thankYouModal) {
        thankYouModal.addEventListener('click', (e) => {
            if (e.target.id === 'thankYouModal') {
                closeThankYouModal();
            }
        });
    }
});

// Heart explosion effect
function createHeartExplosion() {
    const colors = ['#ff6b9d', '#ffa5c0', '#ff8fab'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = `
                <svg viewBox="0 0 24 24" fill="${colors[Math.floor(Math.random() * colors.length)]}">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            `;
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.width = (Math.random() * 30 + 20) + 'px';
            heart.style.height = (Math.random() * 30 + 20) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10001';
            
            document.body.appendChild(heart);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 300 + 200;
            const targetX = Math.cos(angle) * velocity;
            const targetY = Math.sin(angle) * velocity;
            
            heart.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 0
                },
                {
                    transform: `translate(calc(-50% + ${targetX * 0.3}px), calc(-50% + ${targetY * 0.3}px)) scale(1) rotate(180deg)`,
                    opacity: 1,
                    offset: 0.3
                },
                {
                    transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(0.5) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

// Parallax effect for floating shapes
let ticking = false;
let lastScrollY = window.scrollY;

function updateParallax() {
    const scrollY = window.scrollY;
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrollY * speed);
        shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Add hover effect to timeline cards
const timelineCards = document.querySelectorAll('.content-card');
timelineCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy load animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.timeline-item, .reason-card, .letter-paper');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Space to reveal all cards
    if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        reasonCards.forEach(card => {
            card.setAttribute('data-reveal', 'true');
        });
    }
});

// Add smooth reveal animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Track progress through sections
let currentSection = 'hero';
const sections = ['hero', 'timeline', 'reasons', 'letter', 'final'];

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    // Can trigger analytics or other events here
                }
            }
        }
    });
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log('%c💕 Made with love for Nora', 'font-size: 16px; color: #ff6b9d; font-weight: bold;');
console.log('%c- Toga', 'font-size: 14px; color: #6b6b6b;');
console.log('%cTip: Press Ctrl+Space to reveal all cards at once!', 'font-size: 12px; color: #9b9b9b; font-style: italic;');

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedAnimateOnScroll = debounce(animateOnScroll, 10);
window.addEventListener('scroll', debouncedAnimateOnScroll);
