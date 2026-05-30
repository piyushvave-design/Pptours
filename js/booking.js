const PPBooking = {
  initFormHandler() {
    const form = document.getElementById('ppCoreBookingForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = document.getElementById('bookNowBtn');
      submitButton.disabled = true;
      submitButton.textContent = "Processing Secure Vault Space...";

      const payload = {
        bookingId: 'PP-' + Date.now().toString().slice(-6),
        timestamp: new Date().toISOString(),
        name: document.getElementById('b_name').value,
        phone: document.getElementById('b_phone').value,
        tier: document.getElementById('b_tier').value,
        type: document.getElementById('b_type').value,
        distance: document.getElementById('b_distance').value
      };

      const pricing = PPUtils.calculatePricing(payload.tier, payload.type, payload.distance);
      payload.computedPrice = pricing.total;

      try {
        // Core fetch transaction request execution context layer configuration parameters
        await fetch(window.PP_CONFIG.SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(payload).toString()
        });

        PPUtils.showToast(`Reservation Authenticated Successfully. ID: ${payload.bookingId}`);
        
        // Open the premium WhatsApp context fallback gateway channel directly
        const textTemplate = `Hello P&P Travels, I would like to confirm my Premium Reservation request under token assignment label ${payload.bookingId}. Passenger: ${payload.name}. Route Allocation Estimate: ${payload.distance}KM.`;
        window.open(`https://wa.me/${window.PP_CONFIG.WA_NUMBER}?text=${encodeURIComponent(textTemplate)}`, '_blank');
        
        form.reset();
      } catch (error) {
        PPUtils.showToast("Internal Service Communication Disruption. Please contact dispatch via phone lines directly.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Dispatch Reservation Request";
      }
    });
  }
};


