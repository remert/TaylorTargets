function updateOverlay() {
    const productSelect = document.getElementById('product');
    const overlaysContainer = document.getElementById('overlays');
    overlaysContainer.innerHTML = ''; // Clear previous overlays

    const selectedOptions = Array.from(productSelect.selectedOptions);
    const totalProducts = selectedOptions.length;

    selectedOptions.forEach((option, index) => {
        const overlayImage = document.createElement('img');
        overlayImage.src = option.value;
        overlayImage.className = 'overlay';
        overlayImage.style.left = `${(index + 1) / (totalProducts + 1) * 100}%`;
        overlayImage.style.transform = 'translateX(-50%)';
        overlaysContainer.appendChild(overlayImage);
    });
}
