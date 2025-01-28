function updateOverlay() {
    const overlaysContainer = document.getElementById('overlays');
    overlaysContainer.innerHTML = ''; // Clear previous overlays

    const selectedProducts = document.querySelectorAll('input[name="product"]:checked');
    const totalProducts = selectedProducts.length;

    selectedProducts.forEach((product, index) => {
        const overlayImage = document.createElement('img');
        overlayImage.src = product.value;
        overlayImage.className = 'overlay';
        overlayImage.style.left = `${(index + 1) / (totalProducts + 1) * 100}%`;
        overlayImage.style.transform = 'translateX(-50%)';
        overlaysContainer.appendChild(overlayImage);
    });
}
