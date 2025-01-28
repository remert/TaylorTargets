function updateOverlay() {
    const productSelect = document.getElementById('product');
    const overlayImage = document.getElementById('overlay');
    overlayImage.src = productSelect.value;
}
