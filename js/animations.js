const PPAnimations = {
  initScrollReveals() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Kill tracking immediately to optimize performance
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
      revealObserver.observe(element);
    });
  }
};


