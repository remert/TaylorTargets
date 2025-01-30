function createLanes() {
    const numLanes = document.getElementById('numLanes').value;
    const laneWidth = document.getElementById('laneWidth').value;
    const laneDistance = document.getElementById('laneDistance').value;
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear previous lanes

    for (let i = 0; i < numLanes; i++) {
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.style.width = `${laneWidth * 10}px`; // Assuming 1 yard = 10px
        lane.style.height = '50px'; // Fixed height for the lane
        lane.style.position = 'absolute';
        lane.style.top = `${i * (Number(laneDistance) * 10 + 10)}px`; // 10px margin between lanes
        lane.style.left = '0px';
        lane.style.border = '1px solid black';
        canvas.appendChild(lane);
    }
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const product = document.getElementById(data);
    const lane = document.querySelector('.lane'); // Assuming all lanes have the same width
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'overlay-container';
    overlayContainer.draggable = true; // Make the overlay container draggable
    overlayContainer.ondragstart = dragOverlay; // Add drag start event
    overlayContainer.ondragend = dropOverlay; // Add drag end event

    const overlayImage = document.createElement('img');
    overlayImage.src = product.src;
    overlayImage.className = 'overlay';
    overlayImage.style.width = lane.style.width; // Match the width of the lane

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.innerHTML = 'x';
    removeButton.onclick = () => {
        if (confirm('Are you sure you want to remove this item?')) {
            overlayContainer.remove();
            updateTable(data, -1);
        }
    };

    overlayContainer.appendChild(overlayImage);
    overlayContainer.appendChild(removeButton);

    // Calculate the grid position
    const gridSize = 50; // Adjust grid size as needed
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;

    overlayContainer.style.left = `${gridX}px`;
    overlayContainer.style.top = `${gridY}px`;
    overlayContainer.style.transform = 'translate(-50%, -50%)';

    document.getElementById('canvas').appendChild(overlayContainer);
    updateTable(data, 1);
}

function dropOverlay(event) {
    event.preventDefault();
    const overlayContainer = document.getElementById(event.dataTransfer.getData("text"));
    const lane = document.querySelector('.lane'); // Assuming all lanes have the same width
    const rect = overlayContainer.parentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = lane.offsetWidth; // Snap to the end of the lane
    const gridY = Math.round(y / gridSize) * gridSize;

    overlayContainer.style.left = `${gridX}px`;
    overlayContainer.style.top = `${gridY}px`;
    overlayContainer.style.transform = 'translate(-50%, -50%)';
}