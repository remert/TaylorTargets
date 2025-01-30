let selectedProduct = null;

function createLanes() {
    const numLanes = document.getElementById('numLanes').value;
    const laneWidth = document.getElementById('laneWidth').value;
    const laneDistance = document.getElementById('laneDistance').value;
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear previous lanes

    const laneHeight = `${laneWidth * 10}px`; // Adjusted height for the lane (previously width)
    const totalLaneHeight = parseInt(laneHeight) + parseInt(laneDistance); // Adjusted to provide proper spacing

    for (let i = 0; i < numLanes; i++) {
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.style.height = laneHeight; // Fixed height for the lane
        lane.style.width = `${canvas.offsetWidth}px`; // Full width of canvas
        lane.style.position = 'absolute';
        lane.style.top = `${i * totalLaneHeight}px`; // Adjust to fit within canvas height
        lane.style.left = '0px';
        lane.style.border = '1px solid black';
        canvas.appendChild(lane);

        // Add selection box below each lane for distance modification
        const selectionBox = document.createElement('div');
        selectionBox.className = 'distance-selector';

        const minusButton = document.createElement('button');
        minusButton.innerHTML = '-';
        minusButton.onclick = () => {
            const currentDistance = parseInt(lane.style.top);
            const newDistance = Math.max(0, currentDistance - 10);
            lane.style.top = `${newDistance}px`;
        };

        const plusButton = document.createElement('button');
        plusButton.innerHTML = '+';
        plusButton.onclick = () => {
            const currentDistance = parseInt(lane.style.top);
            const newDistance = currentDistance + 10;
            lane.style.top = `${newDistance}px`;
        };

        selectionBox.appendChild(minusButton);
        selectionBox.appendChild(plusButton);
        lane.appendChild(selectionBox);
    }

    // Add bold separating line at the bottom
    const separatingLine = document.createElement('div');
    separatingLine.style.position = 'absolute';
    separatingLine.style.bottom = '0';
    separatingLine.style.left = '0';
    separatingLine.style.width = '100%';
    separatingLine.style.height = '5px';
    separatingLine.style.backgroundColor = 'black';
    canvas.appendChild(separatingLine);
}

function clearLanes() {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
}

function clearProducts() {
    const overlays = document.querySelectorAll('.overlay-container');
    overlays.forEach(overlay => overlay.remove());
}

function selectProduct(event) {
    if (selectedProduct) {
        selectedProduct.classList.remove('highlight');
        if (selectedProduct === event.target) {
            selectedProduct = null;
            return;
        }
    }
    selectedProduct = event.target;
    selectedProduct.classList.add('highlight');
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    if (!selectedProduct) return;

    const canvas = document.getElementById('canvas');
    const lane = event.target.closest('.lane');
    if (!lane || !canvas.contains(lane)) return;

    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'overlay-container';
    overlayContainer.ontouchstart = event => event.stopPropagation(); // Prevent re-selection during drop

    const overlayImage = document.createElement('img');
    overlayImage.src = selectedProduct.src;
    overlayImage.className = 'overlay';
    overlayImage.style.width = lane.style.width; // Match the width of the lane
    overlayImage.style.height = 'auto'; // Maintain aspect ratio

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.innerHTML = 'x';
    removeButton.onclick = () => {
        if (confirm('Are you sure you want to remove this item?')) {
            overlayContainer.remove();
            updateTable(selectedProduct.id, -1);
        }
    };

    overlayContainer.appendChild(overlayImage);
    overlayContainer.appendChild(removeButton);

    // Calculate the grid position
    const gridSize = 50; // Adjust grid size as needed
    const rect = event.target.getBoundingClientRect();
    const x = event.touches[0] ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = event.touches[0] ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;

    overlayContainer.style.left = `${gridX}px`;
    overlayContainer.style.top = `${gridY}px`;
    overlayContainer.style.transform = 'translate(-50%, -50%)';

    lane.appendChild(overlayContainer);
    updateTable(selectedProduct.id, 1);

    selectedProduct.classList.remove('highlight');
    selectedProduct = null;
}

// Add event listeners to product images for touch events
document.querySelectorAll('.draggable').forEach(img => {
    img.ontouchstart = selectProduct;
});

// Add event listener to canvas for placing product images
document.getElementById('canvas').ontouchstart = drop;

function updateTable(productId, quantityChange) {
    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    let row = document.getElementById(`row-${productId}`);

    if (!row) {
        row = table.insertRow();
        row.id = `row-${productId}`;
        const productName = row.insertCell(0);
        const productQty = row.insertCell(1);
        const productPrice = row.insertCell(2);
        productName.innerHTML = document.getElementById(productId).alt;
        productQty.innerHTML = 0;
        productPrice.innerHTML = '$0.00'; // Placeholder, update with actual price
    }

    const qtyCell = row.cells[1];
    const newQty = Math.max(0, parseInt(qtyCell.innerHTML) + quantityChange);
    qtyCell.innerHTML = newQty;

    if (newQty === 0) {
        row.remove();
    }
}

function completeRangeBuild() {
    const products = document.querySelectorAll('.overlay');
    const tableData = {};

    products.forEach(product => {
        const productId = product.src.split('/').pop().split('.')[0];
        if (!tableData[productId]) {
            tableData[productId] = { name: productId, quantity: 0, price: 0 }; // Update with actual data as needed
        }
        tableData[productId].quantity += 1;
    });

    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows

    Object.keys(tableData).forEach(productId => {
        const row = table.insertRow();
        const productName = row.insertCell(0);
        const productQty = row.insertCell(1);
        const productPrice = row.insertCell(2);
        productName.innerHTML = tableData[productId].name;
        productQty.innerHTML = tableData[productId].quantity;
        productPrice.innerHTML = `$${tableData[productId].price.toFixed(2)}`; // Update with actual price
    });
}