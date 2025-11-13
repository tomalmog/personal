// Font selector functionality with localStorage persistence

// Load saved font preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const fontSelect = document.getElementById('font-select');

    // Load saved preference from localStorage
    const savedFont = localStorage.getItem('preferredFont') || 'pixel';

    // Apply the saved font
    applyFont(savedFont);

    // Set the select value
    if (fontSelect) {
        fontSelect.value = savedFont;

        // Listen for changes
        fontSelect.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            applyFont(selectedFont);
            localStorage.setItem('preferredFont', selectedFont);
        });
    }
});

// Apply font to body
function applyFont(fontType) {
    // Remove all font classes
    document.body.classList.remove('font-pixel', 'font-sans', 'font-serif');

    // Add the selected font class
    if (fontType !== 'pixel') {
        document.body.classList.add(`font-${fontType}`);
    }
}

console.log('🎨 Font selector loaded! Choose your preferred reading style.');
