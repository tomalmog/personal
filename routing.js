// Client-side routing and smooth page transitions

const routes = {
    '/': 'about-screen',
    '/about': 'about-screen',
    '/education': 'education-screen',
    '/experience': 'experience-screen',
    '/projects': 'projects-screen',
    '/contact': 'contact-screen'
};

let isScrolling = false;
let currentScreenIndex = 0;
let lastScrollTime = 0;
let horizontalScrollAccumulator = 0;
let lastHorizontalScrollTime = 0;
const HORIZONTAL_SCROLL_THRESHOLD = 50; // Pixels needed to trigger navigation
const HORIZONTAL_SCROLL_RESET_TIME = 200; // Reset accumulator after this many ms
const screenOrder = [
    'about-screen',
    'education-screen',
    'experience-screen',
    'projects-screen',
    'contact-screen'
];

// Navigate to a route
function navigateToRoute(path, pushState = true, direction = 1) {
    // Normalize path - treat root as about
    const normalizedPath = (path === '/' || path === '/index.html') ? '/about' : path;
    const screenId = routes[normalizedPath] || routes['/'];

    if (pushState) {
        // Push the actual path to history (keep "/" as "/")
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

    // Reset accumulator when changing screens
    horizontalScrollAccumulator = 0;

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
    // Treat root path "/" as "/about" for highlighting
    const activePath = (path === '/' || path === '/index.html') ? '/about' : path;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnPath = btn.getAttribute('data-route');
        if (btnPath === activePath) {
            btn.classList.add('active');
        }
    });
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    const path = e.state?.path || '/';
    navigateToRoute(path, false);
});

// Horizontal scroll/swipe navigation with mouse wheel
function handleWheelScroll(e) {
    const now = Date.now();

    // Check if there's horizontal scroll component (trackpad swipe or shift+scroll)
    const horizontalDelta = e.deltaX;

    // If no horizontal scroll, let default vertical scrolling happen
    if (Math.abs(horizontalDelta) < 5) {
        return; // Allow normal vertical scrolling
    }

    // We have horizontal scrolling - prevent default immediately to block browser navigation
    e.preventDefault();
    e.stopPropagation();

    // Reset accumulator if too much time has passed (new gesture)
    if (now - lastHorizontalScrollTime > HORIZONTAL_SCROLL_RESET_TIME) {
        horizontalScrollAccumulator = 0;
    }

    lastHorizontalScrollTime = now;

    // Accumulate horizontal scroll
    horizontalScrollAccumulator += horizontalDelta;

    // Check if we've accumulated enough to navigate
    if (Math.abs(horizontalScrollAccumulator) < HORIZONTAL_SCROLL_THRESHOLD) {
        return; // Not enough yet
    }

    // Check if already navigating
    if (isScrolling) {
        return;
    }

    // Time-based throttle for navigation
    if (now - lastScrollTime < 1000) {
        return;
    }

    // Determine direction: positive deltaX = swipe left = next, negative = previous
    const scrollDirection = horizontalScrollAccumulator > 0 ? 1 : -1;
    let newIndex = currentScreenIndex + scrollDirection;

    // Clamp to valid range
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= screenOrder.length) newIndex = screenOrder.length - 1;

    // Only navigate if we're actually changing screens
    if (newIndex !== currentScreenIndex) {
        isScrolling = true;
        lastScrollTime = now;
        horizontalScrollAccumulator = 0; // Reset accumulator

        const newScreenId = screenOrder[newIndex];
        const newPath = getPathFromScreenId(newScreenId);

        // Pass direction for animation: scrollDirection (1 = forward, -1 = backward)
        navigateToRoute(newPath, true, scrollDirection);

        // Reset after navigation completes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    } else {
        // Can't navigate further - reset accumulator
        horizontalScrollAccumulator = 0;
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

    // Setup nav title link (home link)
    const navTitleLink = document.querySelector('.nav-title-link');
    if (navTitleLink) {
        navTitleLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToRoute('/');
        });
    }

    // Add wheel scroll listener
    window.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Initial route - handle root and /about as same
    const initialPath = window.location.pathname;
    const routePath = (initialPath === '/' || initialPath === '/index.html') ? '/about' : initialPath;
    navigateToRoute(routePath, false);

    // Add smooth transitions to screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});

console.log('🎮 Routing enabled! Use arrow keys or horizontal swipe to navigate between pages.');
