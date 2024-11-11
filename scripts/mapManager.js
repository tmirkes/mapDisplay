// Load the div containing the image
const imageContainer = document.getElementById('image-container');
// Load the image to mark
const mainImage = document.getElementById('map');
// Default marker type to be created
let currentMarkerType = "none";
// Build the maps to contain placed markers
let placedMarkers = {};
// Get a unique key for each origin
const storagePrefix = `${window.location.href}_`;

// Event listener for menu marker selection
const markerMenu = document.getElementById('marker-palettes');
markerMenu.addEventListener('click', (event) => {
    const isSample = event.target.className.includes('sample');
    if (!isSample) {
        return;
    }
    document.querySelectorAll(".sample").forEach(option => option.classList.remove('selected'))
    document.getElementById(event.target.id).classList.add('selected');
    currentMarkerType = event.target.id;
});

// Function to create or update a marker
function placeMarker(x, y) {
    let markerData = document.getElementById(currentMarkerType);
    let newMarker;
    // Do nothing if no marker option is selected
    if (currentMarkerType === "none") {
        return;
    }
    // Place a new marker or update an existing one
    if (placedMarkers[currentMarkerType]) {
        newMarker = placedMarkers[currentMarkerType];
        newMarker.style.left = `${x}px`;
        newMarker.style.top = `${y}px`;
    } else {
        const markerName = currentMarkerType + "Marker";
        newMarker = document.createElement('div');
        newMarker.classList.add('marker')
        if (markerData.className.includes('npc')) {
            newMarker.classList.add('npc');
        } else if (markerData.className.includes('character')) {
            newMarker.classList.add('character');
        } else {
            newMarker.classList.add('monster');
        }
        newMarker.id = markerName;
        newMarker.style.left = `${x}px`;
        newMarker.style.top = `${y}px`;

        const removeButton = document.createElement('div');
        removeButton.classList.add('marker-remove');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', (event) => {
            currentMarkerType = newMarker.id.replace("Marker","");
            event.stopPropagation();
            newMarker.remove();
            delete placedMarkers[currentMarkerType];
            document.querySelectorAll(".sample").forEach(option => option.classList.remove('selected'));
        });
        newMarker.appendChild(removeButton);
        imageContainer.appendChild(newMarker);
        placedMarkers[currentMarkerType] = newMarker;
    }
};

// Event listener for marker placement on image
imageContainer.addEventListener('click', (event) => {
    const rectangle = mainImage.getBoundingClientRect();
    const x = event.clientX - rectangle.left - 25;
    const y = event.clientY - rectangle.top - 25;
    placeMarker(x, y);
});

// Function to save placed markers
function saveMarkers() {
    const scrollYOffset = document.getElementById('image-container').scrollTop * 1.0;
    const scrollXOffset = document.getElementById('image-container').scrollLeft * 1.0;

    const markersToSave = Object.entries(placedMarkers).map(([currentMarkerType, marker]) => {
        const markerName = currentMarkerType;
        const bounds = marker.getBoundingClientRect();
        let offsetX = bounds.left - imageContainer.getBoundingClientRect().left + scrollXOffset;
        let offsetY = bounds.top - imageContainer.getBoundingClientRect().top + scrollYOffset;
        return { markerName, x: offsetX, y: offsetY };
    });
    localStorage.setItem(storagePrefix + 'marker_save', JSON.stringify(markersToSave));
};

// Event listeners for clear buttons
document.getElementById("clear-characters").addEventListener('click', () => {
    for (const marker in placedMarkers) {
        if (placedMarkers[marker].className.includes("character")) {
            placedMarkers[marker].remove();
            delete placedMarkers[marker];
        }
    }
});
document.getElementById("clear-npcs").addEventListener('click', () => {
    for (const marker in placedMarkers) {
        if (placedMarkers[marker].className.includes("npc")) {
            placedMarkers[marker].remove();
            delete placedMarkers[marker];
        }
    }
});
document.getElementById("clear-monsters").addEventListener('click', () => {
    for (const marker in placedMarkers) {
        if (placedMarkers[marker].className.includes("monster")) {
            placedMarkers[marker].remove();
            delete placedMarkers[marker];
        }
    }
});
document.getElementById("clear-all").addEventListener('click', () => {
    for (const marker in placedMarkers) {
        if (placedMarkers[marker].className.includes("marker")) {
            placedMarkers[marker].remove();
            delete placedMarkers[marker];
        }
    }
});

// Event listner for save button
document.getElementById('save-all').addEventListener('click', saveMarkers);

// Function to load saved markers
function loadMarkers(placedMarkers) {
    const savedMarkers = JSON.parse(localStorage.getItem(storagePrefix + 'marker_save'));
    if (savedMarkers) {
        savedMarkers.forEach(marker => {
            currentMarkerType = marker.markerName;
            placeMarker(marker.x, marker.y);
        })
    }
}

// Load all saved markers for the loaded page
window.onload = () => {
    loadMarkers(placedMarkers);
};
