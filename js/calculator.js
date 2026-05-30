const PPCalculator = {
  bindLiveCalculations() {
    const form = document.getElementById('ppCoreBookingForm');
    if (!form) return;

    const tierInput = document.getElementById('b_tier');
    const typeInput = document.getElementById('b_type');
    const distInput = document.getElementById('b_distance');
    const liveDisplay = document.getElementById('liveOutputQuoteAmount');

    function executeLiveUpdate() {
      const calculation = PPUtils.calculatePricing(
        tierInput.value,
        typeInput.value,
        distInput.value
      );
      liveDisplay.textContent = `₹${calculation.total.toLocaleString('en-IN')}`;
    }

    [tierInput, typeInput, distInput].forEach(element => {
      element.addEventListener('input', executeLiveUpdate);
    });
  }
};


