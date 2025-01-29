function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const product = document.getElementById(data);
    const overlayImage = document.createElement('img');
    overlayImage.src = product.src;
    overlayImage.className = 'overlay';
    
    grid position
    const gridSize = 50; // Adjust grid size as needed
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;

    overlayImage.style.left = `${gridX}px`;
    overlayImage.style.top = `${gridY}px`;
    overlayImage.style.transform = 'translate(-50%, -50%)';
    
    document.getElementById('overlays').appendChild(overlayImage);
}
