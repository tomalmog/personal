// RPG Portfolio - Interactive Elements

// Screen Navigation
function showScreen(screenId) {
    // Remove active class from all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');

        // Add active class to corresponding nav button
        const activeBtn = document.querySelector(`[onclick="showScreen('${screenId}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const screens = [
        'about-screen',
        'education-screen',
        'experience-screen',
        'projects-screen',
        'skills-screen',
        'awards-screen',
        'interests-screen',
        'contact-screen'
    ];

    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return;

    const currentIndex = screens.indexOf(activeScreen.id);

    // Arrow keys for navigation
    if (e.key === 'ArrowRight' && currentIndex < screens.length - 1) {
        showScreen(screens[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        showScreen(screens[currentIndex - 1]);
    } else if (e.key === 'Home') {
        showScreen(screens[0]);
    } else if (e.key === 'End') {
        showScreen(screens[screens.length - 1]);
    }
});

// Add particle effect on button clicks
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#16c79a';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let posX = x;
    let posY = y;
    let opacity = 1;

    function animate() {
        posX += vx;
        posY += vy;
        vy += 0.2; // gravity
        opacity -= 0.02;

        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }

    animate();
}

// Add particle effect to nav button clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-btn, .social-link')) {
        for (let i = 0; i < 6; i++) {
            createParticle(e.clientX, e.clientY);
        }
    }
});

// Smooth hover effects for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.info-card, .skill-item, .interest-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Optional: add sound effect here
        });
    });
});

// Page load fade-in effect
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Add a fun effect when Konami code is entered
    const root = document.documentElement;
    root.style.setProperty('--border-color', '#ff69b4');
    root.style.setProperty('--text-yellow', '#00ffff');

    // Create a notification
    const notification = document.createElement('div');
    notification.textContent = '✨ SECRET CODE ACTIVATED! ✨';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 46, 0.95);
        border: 4px solid #ff69b4;
        padding: 2rem;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.875rem;
        color: #00ffff;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transition = 'opacity 1s ease-out';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 1000);
    }, 2000);

    // Reset colors after 10 seconds
    setTimeout(() => {
        root.style.setProperty('--border-color', '#16c79a');
        root.style.setProperty('--text-yellow', '#ffd700');
    }, 10000);
}

// Console easter egg
console.log('%c🎮 RPG PORTFOLIO LOADED', 'color: #16c79a; font-size: 20px; font-weight: bold;');
console.log('%c⚔️ USE ARROW KEYS TO NAVIGATE', 'color: #11aed8; font-size: 12px;');
console.log('%c🏠 PRESS HOME FOR FIRST SECTION', 'color: #ffd700; font-size: 12px;');
console.log('%c✨ TRY THE KONAMI CODE...', 'color: #ff69b4; font-size: 12px;');

// Track which sections user has visited (optional analytics)
const visitedSections = new Set();
const observer = new MutationObserver(() => {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        visitedSections.add(activeScreen.id);
    }
});

// Optional: Log visited sections
document.querySelectorAll('.screen').forEach(screen => {
    observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});

// Responsive navigation - collapse on mobile
function handleResize() {
    const width = window.innerWidth;
    const navButtons = document.querySelectorAll('.nav-btn span');

    // Optional: Could abbreviate button text on smaller screens
    // Not implemented to keep it simple
}

window.addEventListener('resize', handleResize);
handleResize();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add typing effect for dialogue boxes (optional)
function typeText(element, text, speed = 30) {
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Optional: Add typing effect to first dialogue box on load
// Uncomment to enable:
/*
document.addEventListener('DOMContentLoaded', () => {
    const firstDialogue = document.querySelector('.dialogue-text');
    if (firstDialogue) {
        const originalText = firstDialogue.textContent;
        typeText(firstDialogue, originalText);
    }
});
*/
