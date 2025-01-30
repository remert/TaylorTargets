let selectedProduct = null;

function createLanes() {
    const numLanes = document.getElementById('numLanes').value;
    const laneWidth = document.getElementById('laneWidth').value;
    const laneDistance = document.getElementById('laneDistance').value;
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear previous lanes

    const laneHeight = `${laneDistance * 10}px`; // Adjusted height for the lane based on the distance in yards
    const totalLaneWidth = parseInt(laneWidth * 10); // Set lane width based on the width in yards

    for (let i = 0; i < numLanes; i++) {
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.style.width = `${totalLaneWidth}px`; // Fixed width for the lane
        lane.style.height = '100%'; // Full height of canvas
        lane.style.position = 'absolute';
        lane.style.left = `${i * (totalLaneWidth + 10)}px`; // Adjust to fit within canvas width with some spacing
        lane.style.top = '0px';
        lane.style.border = '1px solid black';
        canvas.appendChild(lane);

        // Add selection box at the bottom for distance modification
        const selectionBox = document.createElement('div');
        selectionBox.className = 'distance-selector';
        selectionBox.style.position = 'absolute';
        selectionBox.style.bottom = '0px';
        selectionBox.style.width = '100%';
        selectionBox.style.display = 'flex';
        selectionBox.style.justifyContent = 'space-between';

        const minusButton = document.createElement('button');
        minusButton.innerHTML = '-';
        minusButton.onclick = () => {
            const currentHeight = parseInt(lane.style.height);
            const newHeight = Math.max(0, currentHeight - 10);
            lane.style.height = `${newHeight}px`;
        };

        const plusButton = document.createElement('button');
        plusButton.innerHTML = '+';
        plusButton.onclick = () => {
            const currentHeight = parseInt(lane.style.height);
            const newHeight = currentHeight + 10;
            lane.style.height = `${newHeight}px`;
        };

        selectionBox.appendChild(minusButton);
        selectionBox.appendChild(plusButton);
        lane.appendChild(selectionBox);
    }

    // Add outer border to the canvas
    canvas.style.border = '2px solid black';
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
    overlayImage.style.width = '100%'; // Match the width of the lane
    overlayImage.style.height = '100%'; // Maintain aspect ratio

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

    // Center the overlay container within the lane
    overlayContainer.style.position = 'absolute';
    overlayContainer.style.left = '50%';
    overlayContainer.style.top = '50%';
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