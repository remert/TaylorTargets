function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add('highlight'); // Add highlight class
}

function removeHighlight(event) {
    event.target.classList.remove('highlight'); // Remove highlight class
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const product = document.getElementById(data);
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'overlay-container';
    overlayContainer.draggable = true; // Make the overlay container draggable
    overlayContainer.ondragstart = dragOverlay; // Add drag start event
    overlayContainer.ondragend = dropOverlay; // Add drag end event

    const overlayImage = document.createElement('img');
    overlayImage.src = product.src;
    overlayImage.className = 'overlay';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.innerHTML = 'x';
    removeButton.onclick = () => {
        if (confirm('Are you sure you want to remove this item?')) {
            overlayContainer.remove();
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

    document.getElementById('overlays').appendChild(overlayContainer);
}

function dragOverlay(event) {
    event.dataTransfer.setData("text", event.target.parentElement.id);
}

function dropOverlay(event) {
    event.preventDefault();
    const overlayContainer = document.getElementById(event.dataTransfer.getData("text"));
    const gridSize = 50; // Adjust grid size as needed
    const rect = overlayContainer.parentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;

    overlayContainer.style.left = `${gridX}px`;
    overlayContainer.style.top = `${gridY}px`;
    overlayContainer.style.transform = 'translate(-50%, -50%)';
}
