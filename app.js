/* ==========================================================================
   AuraNativa Studio - Interactive Scripts
   Features: Mobile Navigation Toggle, Intersection Observer Scroll Animations,
             Active Section Navigation Highlighting, Header Scroll Effects.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Page Load Entrance Animations ---
  document.body.classList.add('loaded');

  // --- 1. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('navigation-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. Header Scroll Effect ---
  const header = document.querySelector('.main-header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Call immediately on page load to set correct state

  // --- 3. Intersection Observer for Scroll Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animationObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, animationObserverOptions);

  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });

  // --- 4. Active Section Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const activeNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 120; // Offset to trigger before section reaches the top of the screen

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavigation);
  highlightNavigation(); // Initialize on load

  // --- 5. WhatsApp Message Customizer (Optional Analytics Event) ---
  const whatsappButton = document.getElementById('btn-whatsapp');
  if (whatsappButton) {
    whatsappButton.addEventListener('click', (e) => {
      // Optional analytics track console log
      console.log('User initiated WhatsApp booking workflow.');
    });
  }

});
