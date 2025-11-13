// Arrow key visualization with press highlighting

document.addEventListener('DOMContentLoaded', () => {
    // Track which keys are currently pressed
    const pressedKeys = new Set();

    // Add keydown listener for arrow key visualization
    document.addEventListener('keydown', (e) => {
        // Only handle arrow keys
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(e.key)) {
            return;
        }

        // Prevent repeated keydown events when holding key
        if (pressedKeys.has(e.key)) {
            return;
        }

        pressedKeys.add(e.key);

        // Find the corresponding arrow key element
        const keyElement = document.querySelector(`.arrow-key[data-key="${e.key}"]`);
        if (!keyElement) {
            return;
        }

        // Add pressed class for visual feedback
        keyElement.classList.add('pressed');
    });

    // Add keyup listener to remove pressed state
    document.addEventListener('keyup', (e) => {
        // Only handle arrow keys
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(e.key)) {
            return;
        }

        pressedKeys.delete(e.key);

        // Find the corresponding arrow key element
        const keyElement = document.querySelector(`.arrow-key[data-key="${e.key}"]`);
        if (!keyElement) {
            return;
        }

        // Remove pressed class
        keyElement.classList.remove('pressed');
    });

    // Optional: Make arrow keys clickable to navigate
    document.querySelectorAll('.arrow-key').forEach(keyBtn => {
        keyBtn.addEventListener('click', () => {
            const keyName = keyBtn.getAttribute('data-key');
            const keyElement = keyBtn;

            // Add pressed class with animation
            keyElement.classList.add('pressed', 'clicked');

            // Simulate keyboard event
            const event = new KeyboardEvent('keydown', {
                key: keyName,
                bubbles: true
            });
            document.dispatchEvent(event);

            // Remove pressed class after a short delay for click feedback
            setTimeout(() => {
                keyElement.classList.remove('pressed', 'clicked');
            }, 300);
        });
    });
});

console.log('⌨️ Arrow key visualization loaded! Press arrow keys to navigate.');
