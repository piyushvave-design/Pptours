(function () {
  'use strict';

  var APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwVYgc5XKi1EltBG9_dC-8ZcRO83t_3wJaH0ozb3ozpN2E2Dia1fUA1EvhSaKHYj3tK3A/exec';

  // ─── 1. SMOOTH SCROLLING ────────────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var targetId = link.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  // ─── 2. CTA BUTTON TRACKING ─────────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('a, button');
    if (!btn) return;
    var href = btn.getAttribute('href') || '';
    if (href.startsWith('https://wa.me/')) {
      console.log('[P&P] WhatsApp CTA clicked:', btn.textContent.trim());
    } else if (href.startsWith('tel:')) {
      console.log('[P&P] Call CTA clicked:', href);
    }
  });

  // ─── 3. BOOKING FORM ─────────────────────────────────────────────────────────

  var PHONE_RE = /^[+]?[\d\s\-(). ]{7,15}$/;

  function showError(input, message) {
    clearError(input);
    var err = document.createElement('span');
    err.className = '__pp-error';
    err.textContent = message;
    input.classList.add('__pp-invalid');
    input.parentNode.appendChild(err);
  }

  function clearError(input) {
    var existing = input.parentNode.querySelector('.__pp-error');
    if (existing) existing.remove();
    input.classList.remove('__pp-invalid');
  }

  function attachClearOnInput(input) {
    input.addEventListener('input', function () { clearError(input); });
  }

  var form = document.getElementById('booking-form');

  if (form) {
    var fields = {
      name:   document.getElementById('b-name'),
      phone:  document.getElementById('b-phone'),
      pickup: document.getElementById('b-pickup'),
      drop:   document.getElementById('b-drop'),
    };

    Object.values(fields).forEach(attachClearOnInput);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      if (!fields.name.value.trim()) {
        showError(fields.name, 'Please enter your name.');
        valid = false;
      }

      if (!fields.phone.value.trim()) {
        showError(fields.phone, 'Please enter your phone number.');
        valid = false;
      } else if (!PHONE_RE.test(fields.phone.value.trim())) {
        showError(fields.phone, 'Please enter a valid phone number.');
        valid = false;
      }

      if (!fields.pickup.value.trim()) {
        showError(fields.pickup, 'Please enter a pickup location.');
        valid = false;
      }

      if (!fields.drop.value.trim()) {
        showError(fields.drop, 'Please enter a drop location.');
        valid = false;
      }

      if (!valid) {
        var firstError = form.querySelector('.__pp-invalid');
        if (firstError) firstError.focus();
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      var name     = fields.name.value.trim();
      var phone    = fields.phone.value.trim();
      var pickup   = fields.pickup.value.trim();
      var drop     = fields.drop.value.trim();
      var distance = document.getElementById('b-distance').value.trim() || 'Not specified';
      var date     = document.getElementById('b-date').value || 'Not specified';

      var sheetData = { name: name, phone: phone, pickup: pickup, drop: drop, distance: distance, date: date };

      function openWhatsApp() {
        var message =
          'Hi, I want to book a car.\n' +
          'Name: '     + name     + '\n' +
          'Phone: '    + phone    + '\n' +
          'Pickup: '   + pickup   + '\n' +
          'Drop: '     + drop     + '\n' +
          'Distance: ' + distance + (distance !== 'Not specified' ? ' km' : '') + '\n' +
          'Date: '     + date;

        var waUrl = 'https://wa.me/917870737475?text=' + encodeURIComponent(message);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetData),
        mode: 'no-cors',
      })
        .then(function () { openWhatsApp(); })
        .catch(function () {
          // Sheet failed silently — still open WhatsApp so user is never blocked
          openWhatsApp();
        });
    });
  }

})();
