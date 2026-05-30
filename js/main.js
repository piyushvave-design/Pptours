document.addEventListener('DOMContentLoaded', async () => {
  console.log("[P&P Core Application Engine Initialization Sequence Activated]");

  // Centralized Partial Templates Component Injector Engine Core Pipeline List Matrix
  const viewsToRender = ['hero', 'services', 'fleet', 'pricing', 'testimonials', 'faq', 'footer'];
  
  const processInjections = viewsToRender.map(async (viewName) => {
    const placementContainer = document.getElementById(viewName);
    if (placementContainer) {
      try {
        const structuralFetchResponse = await fetch(`sections/${viewName}.html`);
        if (structuralFetchResponse.ok) {
          placementContainer.innerHTML = await structuralFetchResponse.text();
        }
      } catch (error) {
        console.error(`Component Interception Failure within structural token: ${viewName}`, error);
      }
    }
  });

  // Await perfect generation of structural app layout bindings before listening for state interactions
  await Promise.all(processInjections);

  // Initialize modular domain logic arrays safely
  PPScroll.setupHardwareAcceleration();
  PPNavigation.init();
  PPAnimations.initScrollReveals();
  PPCalculator.bindLiveCalculations();
  PPBooking.initFormHandler();
});


