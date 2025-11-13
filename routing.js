// Client-side routing and smooth page transitions

const routes = {
    '/': 'about-screen',
    '/about': 'about-screen',
    '/education': 'education-screen',
    '/experience': 'experience-screen',
    '/projects': 'projects-screen',
    '/skills': 'skills-screen',
    '/awards': 'awards-screen',
    '/interests': 'interests-screen',
    '/contact': 'contact-screen'
};

let isScrolling = false;
let currentScreenIndex = 0;
let lastScrollTime = 0;
let isAtBoundary = false; // Track if we're at a scroll boundary
let lastWheelEventTime = 0; // Track for detecting new scroll gestures
const SCROLL_GESTURE_TIMEOUT = 250; // ms gap to consider a new scroll gesture
const NAVIGATION_DELTA_THRESHOLD = 50; // Require bigger scroll for navigation
const screenOrder = [
    'about-screen',
    'education-screen',
    'experience-screen',
    'projects-screen',
    'skills-screen',
    'awards-screen',
    'interests-screen',
    'contact-screen'
];

// Navigate to a route
function navigateToRoute(path, pushState = true, direction = 1) {
    const screenId = routes[path] || routes['/'];

    if (pushState) {
        history.pushState({ path }, '', path);
    }

    showScreenWithTransition(screenId, direction);
    updateActiveNavButton(path);
}

// Show screen with smooth transition
function showScreenWithTransition(screenId, direction = 1) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);

    if (!targetScreen) return;

    // Reset boundary flag when changing screens
    isAtBoundary = false;

    // Direction determines animation: 1 = down/next, -1 = up/previous
    const exitTransform = direction === 1 ? 'translateY(20px)' : 'translateY(-20px)';
    const enterTransform = direction === 1 ? 'translateY(-20px)' : 'translateY(20px)';

    // Fade out current screen with directional movement
    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.style.opacity = '0';
            screen.style.transform = exitTransform;
        }
    });

    // Wait for fade out, then switch
    setTimeout(() => {
        allScreens.forEach(screen => screen.classList.remove('active'));
        targetScreen.classList.add('active');

        // Update current index
        currentScreenIndex = screenOrder.indexOf(screenId);

        // Set initial position for fade in (opposite direction)
        targetScreen.style.opacity = '0';
        targetScreen.style.transform = enterTransform;

        // Scroll new screen to top
        targetScreen.scrollTop = 0;

        // Fade in new screen
        setTimeout(() => {
            targetScreen.style.opacity = '1';
            targetScreen.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

// Update active navigation button
function updateActiveNavButton(path) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnPath = btn.getAttribute('data-route');
        if (btnPath === path) {
            btn.classList.add('active');
        }
    });
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    const path = e.state?.path || '/';
    navigateToRoute(path, false);
});

// Check if element is currently at a scroll boundary
function isCurrentlyAtBoundary(element, deltaY) {
    let currentElement = element;

    // Walk up the DOM tree
    while (currentElement && currentElement !== document.body && currentElement !== document.documentElement) {
        const styles = window.getComputedStyle(currentElement);
        const overflowY = styles.overflowY;

        // Check if this element is scrollable
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay');
        const hasScrollableContent = currentElement.scrollHeight > currentElement.clientHeight + 1;

        if (isScrollable && hasScrollableContent) {
            const scrollTop = Math.round(currentElement.scrollTop);
            const scrollHeight = currentElement.scrollHeight;
            const clientHeight = currentElement.clientHeight;
            const maxScroll = scrollHeight - clientHeight;

            // Scrolling down (deltaY > 0) - check if at bottom
            if (deltaY > 0 && scrollTop >= maxScroll - 3) {
                return true; // At bottom boundary
            }

            // Scrolling up (deltaY < 0) - check if at top
            if (deltaY < 0 && scrollTop <= 3) {
                return true; // At top boundary
            }

            // Not at boundary - still can scroll
            return false;
        }

        currentElement = currentElement.parentElement;
    }

    // No scrollable element found - we're at page boundary
    return true;
}

// Full-page scroll with mouse wheel
function handleWheelScroll(e) {
    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelEventTime;
    const isNewGesture = timeSinceLastWheel > SCROLL_GESTURE_TIMEOUT;

    // Update last wheel event time
    lastWheelEventTime = now;

    // Check if we're currently at a scroll boundary (BEFORE this scroll happens)
    const atBoundary = isCurrentlyAtBoundary(e.target, e.deltaY);

    if (!atBoundary) {
        // Not at boundary - allow normal scrolling and reset flag
        isAtBoundary = false;
        return; // Let browser handle the scroll naturally
    }

    // We ARE at a boundary
    e.preventDefault(); // Always prevent scroll at boundary

    // If flag is not set yet, set it and return (don't navigate)
    if (!isAtBoundary) {
        isAtBoundary = true;
        return;
    }

    // Flag is already set - check if this is a NEW gesture with BIG scroll
    if (!isNewGesture) {
        // Same gesture, ignore
        return;
    }

    // This is a NEW gesture at boundary - check if it's big enough
    const delta = Math.abs(e.deltaY);
    if (delta < NAVIGATION_DELTA_THRESHOLD) {
        return; // Too small, ignore
    }

    // This is a unique, deliberate, BIG scroll action!

    // Check if already navigating
    if (isScrolling) {
        return;
    }

    // Time-based throttle for navigation
    if (now - lastScrollTime < 1500) {
        return;
    }

    // Natural scroll direction: scroll down = next, scroll up = previous
    const scrollDirection = e.deltaY > 0 ? 1 : -1;
    let newIndex = currentScreenIndex + scrollDirection;

    // Clamp to valid range
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= screenOrder.length) newIndex = screenOrder.length - 1;

    // Only navigate if we're actually changing screens
    if (newIndex !== currentScreenIndex) {
        isScrolling = true;
        lastScrollTime = now;
        isAtBoundary = false; // Reset boundary flag after navigation

        const newScreenId = screenOrder[newIndex];
        const newPath = getPathFromScreenId(newScreenId);

        // Pass direction for animation: scrollDirection (1 = forward, -1 = backward)
        navigateToRoute(newPath, true, scrollDirection);

        // Reset after navigation completes
        setTimeout(() => {
            isScrolling = false;
        }, 1500);
    }
}

// Get path from screen ID
function getPathFromScreenId(screenId) {
    for (const [path, id] of Object.entries(routes)) {
        if (id === screenId) {
            return path === '/' ? '/about' : path;
        }
    }
    return '/about';
}

// Enhanced keyboard navigation
function handleKeyNavigation(e) {
    if (isScrolling) return;

    let newIndex = currentScreenIndex;
    let direction = 1;

    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
            if (currentScreenIndex < screenOrder.length - 1) {
                newIndex = currentScreenIndex + 1;
                direction = 1;
            }
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            if (currentScreenIndex > 0) {
                newIndex = currentScreenIndex - 1;
                direction = -1;
            }
            break;
        case 'Home':
            newIndex = 0;
            direction = -1;
            break;
        case 'End':
            newIndex = screenOrder.length - 1;
            direction = 1;
            break;
        default:
            return;
    }

    if (newIndex !== currentScreenIndex) {
        e.preventDefault();
        isScrolling = true;
        const newScreenId = screenOrder[newIndex];
        const newPath = getPathFromScreenId(newScreenId);
        navigateToRoute(newPath, true, direction);

        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}

// Initialize routing
document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const route = btn.getAttribute('data-route');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToRoute(route);
        });
    });

    // Add wheel scroll listener
    window.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Initial route
    const initialPath = window.location.pathname;
    navigateToRoute(initialPath, false);

    // Add smooth transitions to screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});

console.log('🎮 Routing enabled! Use arrow keys or scroll to navigate between pages.');
