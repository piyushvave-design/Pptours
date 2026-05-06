<script>
  (function () {
    var APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwVYgc5XKi1EltBG9_dC-8ZcRO83t_3wJaH0ozb3ozpN2E2Dia1fUA1EvhSaKHYj3tK3A/exec";

    var form = document.getElementById("booking-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = {
        name: document.getElementById("b-name").value.trim(),
        phone: document.getElementById("b-phone").value.trim(),
        pickup: document.getElementById("b-pickup").value.trim(),
        drop: document.getElementById("b-drop").value.trim(),
        distance: document.getElementById("b-distance").value.trim(),
      };

      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        mode: "no-cors",
      })
        .then(function () {
          alert("✅ Booking received! We'll confirm on WhatsApp shortly.");
          form.reset();
        })
        .catch(function () {
          alert("❌ Something went wrong. Please call us or book via WhatsApp.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  })();
</script>

