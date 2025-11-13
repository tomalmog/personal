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

// Check if we should allow normal scrolling (not trigger page transition)
function shouldAllowNormalScroll(element, deltaY) {
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

            // Scrolling down (deltaY > 0) - check if not at bottom
            if (deltaY > 0 && scrollTop < maxScroll - 3) {
                return true;
            }

            // Scrolling up (deltaY < 0) - check if not at top
            if (deltaY < 0 && scrollTop > 3) {
                return true;
            }
        }

        currentElement = currentElement.parentElement;
    }

    return false;
}

// Full-page scroll with mouse wheel
function handleWheelScroll(e) {
    // Check if we're scrolling inside a scrollable element that hasn't reached its boundary
    if (shouldAllowNormalScroll(e.target, e.deltaY)) {
        // Allow normal scrolling within the element - don't prevent default
        return;
    }

    // Only prevent default if we're actually going to do page navigation
    e.preventDefault();

    // Check if already scrolling
    if (isScrolling) {
        return;
    }

    // Time-based throttle - ignore events within 1500ms of last scroll
    const now = Date.now();
    if (now - lastScrollTime < 1500) {
        return;
    }

    // Only trigger on significant scroll
    const delta = Math.abs(e.deltaY);
    if (delta < 10) return; // Ignore tiny movements

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
