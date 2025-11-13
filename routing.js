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
function navigateToRoute(path, pushState = true) {
    const screenId = routes[path] || routes['/'];

    if (pushState) {
        history.pushState({ path }, '', path);
    }

    showScreenWithTransition(screenId);
    updateActiveNavButton(path);
}

// Show screen with smooth transition
function showScreenWithTransition(screenId) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);

    if (!targetScreen) return;

    // Fade out current screen
    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.style.opacity = '0';
            screen.style.transform = 'translateY(20px)';
        }
    });

    // Wait for fade out, then switch
    setTimeout(() => {
        allScreens.forEach(screen => screen.classList.remove('active'));
        targetScreen.classList.add('active');

        // Update current index
        currentScreenIndex = screenOrder.indexOf(screenId);

        // Fade in new screen
        setTimeout(() => {
            targetScreen.style.opacity = '1';
            targetScreen.style.transform = 'translateY(0)';
        }, 50);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Check if element or its parents are scrollable and not at boundary
function isScrollableAndNotAtBoundary(element, deltaY) {
    let currentElement = element;

    while (currentElement && currentElement !== document.body) {
        const hasVerticalScrollbar = currentElement.scrollHeight > currentElement.clientHeight;

        if (hasVerticalScrollbar) {
            const scrollTop = currentElement.scrollTop;
            const scrollHeight = currentElement.scrollHeight;
            const clientHeight = currentElement.clientHeight;

            // Scrolling down (deltaY > 0)
            if (deltaY > 0) {
                // Not at bottom - allow normal scroll
                if (scrollTop + clientHeight < scrollHeight - 1) {
                    return true;
                }
            }
            // Scrolling up (deltaY < 0)
            else {
                // Not at top - allow normal scroll
                if (scrollTop > 1) {
                    return true;
                }
            }
        }

        currentElement = currentElement.parentElement;
    }

    return false;
}

// Full-page scroll with mouse wheel
function handleWheelScroll(e) {
    // Check if we're scrolling inside a scrollable element that hasn't reached its boundary
    if (isScrollableAndNotAtBoundary(e.target, e.deltaY)) {
        // Allow normal scrolling within the element
        return;
    }

    e.preventDefault();
    e.stopPropagation();

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

    // Invert scroll direction: scroll down = previous, scroll up = next
    const scrollDirection = e.deltaY > 0 ? -1 : 1;
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
        navigateToRoute(newPath);

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

    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
            if (currentScreenIndex < screenOrder.length - 1) {
                newIndex = currentScreenIndex + 1;
            }
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            if (currentScreenIndex > 0) {
                newIndex = currentScreenIndex - 1;
            }
            break;
        case 'Home':
            newIndex = 0;
            break;
        case 'End':
            newIndex = screenOrder.length - 1;
            break;
        default:
            return;
    }

    if (newIndex !== currentScreenIndex) {
        e.preventDefault();
        isScrolling = true;
        const newScreenId = screenOrder[newIndex];
        const newPath = getPathFromScreenId(newScreenId);
        navigateToRoute(newPath);

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

    // Add wheel scroll listener with capture phase to ensure we catch it first
    window.addEventListener('wheel', handleWheelScroll, { passive: false, capture: true });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Initial route
    const initialPath = window.location.pathname;
    navigateToRoute(initialPath, false);

    // Add smooth transitions to screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Disable default scroll behavior
    document.body.style.overflow = 'hidden';
});

console.log('🎮 Routing enabled! Use arrow keys or scroll to navigate between pages.');
