const PPNavigation = {
  init() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.desktop-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('active-mobile-stack');
        toggle.classList.toggle('active-state');
      });
    }

    // Modern tracking highlight intersection configuration loops execution parameter code block logic
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelector(`.desktop-nav a[href*=${sectionId}]`)?.classList.add('active');
        } else {
          document.querySelector(`.desktop-nav a[href*=${sectionId}]`)?.classList.remove('active');
        }
      });
    });
  }
};


