function main() {
    const imageContainer = document.getElementById('imageContainer');
    const mainImage = document.getElementById('mainImage');
    let selectedSquareStyle = 'liten';
    const placedSquares1 = {};
    const placedSquares2 = {};
    const placedSquares3 = {};

    // Function to create or update a square
    function createOrUpdateSquare(x, y, style, placedSquares) {
        let square;
        if (placedSquares[style]) {
            square = placedSquares[style];
            square.style.left = `${x}px`;
            square.style.top = `${y}px`;
        } else {
            square = document.createElement('div');
            square.classList.add('square', style);
            square.style.left = `${x}px`;
            square.style.top = `${y}px`;

            const removeBtn = document.createElement('div');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'X';
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                square.remove();
                delete placedSquares[style];
                saveMarkers();
            });

            square.appendChild(removeBtn);
            imageContainer.appendChild(square);
            placedSquares[style] = square;
        }
    }

    function saveMarkers() {
        const markers1 = Object.entries(placedSquares1).map(([style, square]) => {
            const rect = square.getBoundingClientRect();
            const offsetX = rect.left - imageContainer.getBoundingClientRect().left;
            const offsetY = rect.top - imageContainer.getBoundingClientRect().top;
            return { style, x: offsetX, y: offsetY };
        });
        const markers2 = Object.entries(placedSquares2).map(([style, square]) => {
            const rect = square.getBoundingClientRect();
            const offsetX = rect.left - imageContainer.getBoundingClientRect().left;
            const offsetY = rect.top - imageContainer.getBoundingClientRect().top;
            return { style, x: offsetX, y: offsetY };
        });
        const markers3 = Object.entries(placedSquares3).map(([style, square]) => {
            const rect = square.getBoundingClientRect();
            const offsetX = rect.left - imageContainer.getBoundingClientRect().left;
            const offsetY = rect.top - imageContainer.getBoundingClientRect().top;
            return { style, x: offsetX, y: offsetY };
        });
        localStorage.setItem('markers1', JSON.stringify(markers1));
        localStorage.setItem('markers2', JSON.stringify(markers2));
        localStorage.setItem('markers3', JSON.stringify(markers3));
    }

    function loadMarkers(placedSquares, storageKey) {
        const markers = JSON.parse(localStorage.getItem(storageKey));
        if (markers) {
            markers.forEach(marker => {
                createOrUpdateSquare(marker.x, marker.y, marker.style, placedSquares);
            });
        }
    }

    // Function to deselect all menu squares
    function deselectAllMenus() {
        document.querySelectorAll('.menu-square').forEach(square => square.classList.remove('active'));
    }

    // Menu event listeners with cross-menu deselection
    document.getElementById('squareMenu1').addEventListener('click', (event) => {
        if (event.target.classList.contains('menu-square')) {
            deselectAllMenus();
            selectedSquareStyle = event.target.getAttribute('data-style');
            event.target.classList.add('active');
        }
    });

    document.getElementById('squareMenu2').addEventListener('click', (event) => {
        if (event.target.classList.contains('menu-square')) {
            deselectAllMenus();
            selectedSquareStyle = event.target.getAttribute('data-style');
            event.target.classList.add('active');
        }
    });

    document.getElementById('squareMenu3').addEventListener('click', (event) => {
        if (event.target.classList.contains('menu-square')) {
            deselectAllMenus();
            selectedSquareStyle = event.target.getAttribute('data-style');
            event.target.classList.add('active');
        }
    });

    imageContainer.addEventListener('click', (event) => {
        const rect = mainImage.getBoundingClientRect();
        const x = event.clientX - rect.left - 25;
        const y = event.clientY - rect.top - 25;

        if (document.querySelector('#squareMenu1 .active')) {
            createOrUpdateSquare(x, y, selectedSquareStyle, placedSquares1);
        } else if (document.querySelector('#squareMenu2 .active')) {
            createOrUpdateSquare(x, y, selectedSquareStyle, placedSquares2);
        } else if (document.querySelector('#squareMenu3 .active')) {
            createOrUpdateSquare(x, y, selectedSquareStyle, placedSquares3);
        }
    });

    // Clear buttons
    document.getElementById('clearButton1').addEventListener('click', () => {
        for (const style in placedSquares1) {
            placedSquares1[style].remove();
            delete placedSquares1[style];
        }
        localStorage.removeItem('markers1');
    });

    document.getElementById('clearButton2').addEventListener('click', () => {
        for (const style in placedSquares2) {
            placedSquares2[style].remove();
            delete placedSquares2[style];
        }
        localStorage.removeItem('markers2');
    });

    document.getElementById('clearButton3').addEventListener('click', () => {
        for (const style in placedSquares3) {
            placedSquares3[style].remove();
            delete placedSquares3[style];
        }
        localStorage.removeItem('markers3');
    });

    // Save buttons
    document.getElementById('saveButton1').addEventListener('click', saveMarkers);

    window.onload = () => {
        loadMarkers(placedSquares1, 'markers1');
        loadMarkers(placedSquares2, 'markers2');
        loadMarkers(placedSquares3, 'markers3');
    };
}