function main() {
    const imageContainer = document.getElementById('imageContainer');
    const mainImage = document.getElementById('mainImage');
    const squareMenu = document.getElementById('squareMenu');
    const clearButton = document.getElementById('clearButton');
    const saveButton = document.getElementById('saveButton');
    let selectedSquareStyle = 'square-red'; // Default square style

    // Store references to placed squares by style
    const placedSquares = {};

    // Function to create or update a square at the clicked position
    function createOrUpdateSquare(x, y, style) {
        let square;

        // Check if a square of the selected style already exists
        if (placedSquares[style]) {
            // Update existing square's position
            square = placedSquares[style];
            square.style.left = `${x}px`;
            square.style.top = `${y}px`;
        } else {
            // Create a new square if it doesn't exist
            square = document.createElement('div');
            square.classList.add('square', style); // Apply selected style to new square

            // Position the square relative to the image
            square.style.left = `${x}px`;
            square.style.top = `${y}px`;

            // Create the remove button
            const removeBtn = document.createElement('div');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'X';

            // Remove the square on clicking the 'X' button
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                square.remove();
                delete placedSquares[style]; // Remove reference
                saveMarkers(); // Save the updated markers
            });

            // Append remove button to square
            square.appendChild(removeBtn);

            // Add the square to the image container and store its reference
            imageContainer.appendChild(square);
            placedSquares[style] = square;
        }
    }

    // Function to save markers to localStorage
    function saveMarkers() {
        const markers = Object.entries(placedSquares).map(([style, square]) => {
            const rect = square.getBoundingClientRect();
            const offsetX = rect.left - imageContainer.getBoundingClientRect().left;
            const offsetY = rect.top - imageContainer.getBoundingClientRect().top;
            return { style, x: offsetX, y: offsetY };
        });
        localStorage.setItem('markers', JSON.stringify(markers));
    }

    // Function to load markers from localStorage
    function loadMarkers() {
        const markers = JSON.parse(localStorage.getItem('markers'));
        if (markers) {
            markers.forEach(marker => {
                createOrUpdateSquare(marker.x, marker.y, marker.style);
            });
        }
    }

    // Event listener for selecting a square style from the menu
    squareMenu.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('menu-square')) {
            // Get the style of the clicked menu square
            selectedSquareStyle = target.getAttribute('data-style');

            // Remove active highlight from other squares
            document.querySelectorAll('.menu-square').forEach(square => square.classList.remove('active'));

            // Highlight the selected square
            target.classList.add('active');
        }
    });

    // Add click event listener to the image container
    imageContainer.addEventListener('click', (event) => {
        const rect = mainImage.getBoundingClientRect();
        const scrollLeft = imageContainer.scrollLeft; // Get horizontal scroll offset
        const scrollTop = imageContainer.scrollTop; // Get vertical scroll offset

        // Calculate adjusted x and y coordinates accounting for scroll offset
        const x = event.clientX - rect.left - 25; // Center the square
        const y = event.clientY - rect.top - 25;  // Center the square

        // Create or update a square at the clicked position with the selected style
        createOrUpdateSquare(x, y, selectedSquareStyle);
    });

    // Clear all squares when "Clear All" button is clicked
    clearButton.addEventListener('click', () => {
        // Remove each square element from the DOM and clear the references
        for (const style in placedSquares) {
            placedSquares[style].remove();
            delete placedSquares[style];
        }
        localStorage.removeItem('markers'); // Clear saved markers from localStorage
    });

    // Save markers when the Save button is clicked
    saveButton.addEventListener('click', saveMarkers);

    // Load markers when the page is loaded
    window.onload = loadMarkers;
}