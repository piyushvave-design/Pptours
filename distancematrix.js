(function () {
  'use strict';

  var MAPS_API_KEY = 'AIzaSyBvQh2S5oO_b_FuyVa9yUzi2nP79pnXTdM';
  var mapsReady    = false;
  var mapsLoading  = false;
  var pendingCalc  = false;
  var debounceTimer = null;

  function loadMapsApi() {
    if (mapsLoading || document.querySelector('script[data-gm-distance]')) return;
    mapsLoading = true;
    var script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' +
      MAPS_API_KEY +
      '&callback=__gmDistanceReady&loading=async';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-gm-distance', '1');
    document.head.appendChild(script);
  }

  window.__gmDistanceReady = function () {
    mapsReady = true;
    mapsLoading = false;
    if (pendingCalc) {
      pendingCalc = false;
      calculateDistance();
    }
  };

  function setDistanceField(state, value) {
    var el = document.getElementById('b-distance');
    if (!el) return;
    if (state === 'loading') {
      el.value = '';
      el.placeholder = 'Calculating…';
      el.disabled = true;
    } else if (state === 'error') {
      el.value = '';
      el.placeholder = 'Enter manually';
      el.disabled = false;
    } else if (state === 'reset') {
      el.placeholder = 'e.g. 50';
      el.disabled = false;
    } else if (state === 'value') {
      el.value = value;
      el.placeholder = 'e.g. 50';
      el.disabled = false;
    }
  }

  function calculateDistance() {
    var pickupEl = document.getElementById('b-pickup');
    var dropEl   = document.getElementById('b-drop');

    if (!pickupEl || !dropEl) return;

    var pickup = pickupEl.value.trim();
    var drop   = dropEl.value.trim();

    if (!pickup || !drop) {
      setDistanceField('reset');
      return;
    }

    if (!mapsReady) {
      pendingCalc = true;
      loadMapsApi();
      setDistanceField('loading');
      return;
    }

    setDistanceField('loading');

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins:      [pickup],
        destinations: [drop],
        travelMode:   google.maps.TravelMode.DRIVING,
        unitSystem:   google.maps.UnitSystem.METRIC,
      },
      function (response, status) {
        if (status !== 'OK') {
          setDistanceField('error');
          return;
        }
        try {
          var element = response.rows[0].elements[0];
          if (element.status !== 'OK') {
            setDistanceField('error');
            return;
          }
          var km = Math.round(element.distance.value / 1000);
          setDistanceField('value', km);
        } catch (e) {
          setDistanceField('error');
        }
      }
    );
  }

  function debouncedCalculate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var pickupEl = document.getElementById('b-pickup');
      var dropEl   = document.getElementById('b-drop');
      if (!pickupEl || !dropEl) return;
      if (pickupEl.value.trim() && dropEl.value.trim()) {
        calculateDistance();
      }
    }, 700);
  }

  function init() {
    var pickupEl = document.getElementById('b-pickup');
    var dropEl   = document.getElementById('b-drop');

    if (pickupEl) {
      pickupEl.addEventListener('blur',  debouncedCalculate);
      pickupEl.addEventListener('input', debouncedCalculate);
    }
    if (dropEl) {
      dropEl.addEventListener('blur',  debouncedCalculate);
      dropEl.addEventListener('input', debouncedCalculate);
    }

    // Maps API is loaded lazily on first interaction — not on page load
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
