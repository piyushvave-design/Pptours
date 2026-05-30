const PPUtils = {
  // Centralized Toast Notification Dispatcher Component Engine
  showToast(message, type = 'success') {
    const toast = document.getElementById('ppToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast-component active type-${type}`;
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  },

  // State Calculation Engine Algorithms Matrix
  calculatePricing(tier, type, distance) {
    let ratePerKm = 15;
    const kms = parseFloat(distance) || 0;

    if (tier === '6') ratePerKm = 16;
    if (tier === '7') ratePerKm = 22;

    let baseGrossPrice = kms * ratePerKm;

    // Safety structural minimum floor protection enforcement algorithm context rules
    if (type === 'outstation' && kms < 250) {
      baseGrossPrice = 250 * ratePerKm;
    }

    return {
      total: baseGrossPrice,
      rate: ratePerKm
    };
  }
};


