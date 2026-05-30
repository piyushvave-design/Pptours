const PPScroll = {
  setupHardwareAcceleration() {
    const scroller = document.getElementById('main-scroll-engine');
    if (scroller) {
      // Force GPU layer composition maps explicitly on primary display arrays
      scroller.style.transform = 'translateZ(0)';
      scroller.style.willChange = 'transform';
    }
  }
};


