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

  // --- 6. Falling Leaves Canvas Particle System ---
  const canvas = document.getElementById('leaves-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let particles = [];
    const particleCount = 24; // Balanced count for high performance and clean aesthetics

    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Leaf shapes generator
    class Leaf {
      constructor() {
        this.reset();
        // Randomize initial Y so they don't all start falling from the top at once
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.size = Math.random() * 15 + 12; // Leaf scale (12px to 27px)
        
        // Depth-of-field layer mapping
        if (this.size > 22) {
          // Foreground: Large, fast, blurry, higher opacity
          this.speedY = Math.random() * 0.8 + 1.2;
          this.speedX = Math.random() * 0.4 + 0.3;
          this.blur = Math.random() * 2 + 2; 
          this.opacity = Math.random() * 0.2 + 0.5; // 0.5 - 0.7
          this.zIndex = 3; 
        } else if (this.size > 16) {
          // Midground (In-focus): Medium, average speed, sharp, fully visible
          this.speedY = Math.random() * 0.5 + 0.7;
          this.speedX = Math.random() * 0.3 + 0.2;
          this.blur = 0; 
          this.opacity = Math.random() * 0.3 + 0.6; // 0.6 - 0.9
          this.zIndex = 2;
        } else {
          // Background: Small, slow, very blurry, faint opacity
          this.speedY = Math.random() * 0.3 + 0.3;
          this.speedX = Math.random() * 0.2 + 0.1;
          this.blur = Math.random() * 3 + 3;
          this.opacity = Math.random() * 0.2 + 0.3; // 0.3 - 0.5
          this.zIndex = 1;
        }

        // Sway properties (Wind sway)
        this.swaySpeed = Math.random() * 0.015 + 0.008;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayRange = Math.random() * 25 + 15;

        // Rotation properties
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.015 - 0.007;

        // Type color mapping (75% forest green, 25% metallic gold)
        this.isGold = Math.random() < 0.25;
      }

      update() {
        this.y += this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * (this.speedX * 0.8) + (this.isGold ? 0.1 : -0.05); // slight overall breeze
        this.rotation += this.rotationSpeed;

        // Reset when leaf exits the bottom or sides of the hero
        if (this.y > canvas.height + 40 || this.x < -40 || this.x > canvas.width + 40) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + Math.sin(this.swayAngle) * this.swayRange, this.y);
        ctx.rotate(this.rotation);

        // Apply blur filter if supported to simulate depth of field
        if (this.blur > 0) {
          ctx.filter = `blur(${this.blur}px)`;
        }

        ctx.globalAlpha = this.opacity;

        // Colors
        let mainColor, veinColor;
        if (this.isGold) {
          // Metallic Gold Gradient
          const grad = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
          grad.addColorStop(0, '#E6C56E'); // Pale glowing gold
          grad.addColorStop(0.5, '#D4AF37'); // Base gold
          grad.addColorStop(1, '#A58221'); // Deep shadow gold
          mainColor = grad;
          veinColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          // Deep Forest Green Gradient
          const grad = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
          grad.addColorStop(0, '#2D5842'); // Light moss green
          grad.addColorStop(0.5, '#1B3B2B'); // Main forest green
          grad.addColorStop(1, '#11251B'); // Dark forest green
          mainColor = grad;
          veinColor = 'rgba(212, 175, 55, 0.15)'; // faint gold highlight for vein
        }

        // Draw leaf path
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        // Start from stem base
        ctx.moveTo(0, this.size);
        // Left curve
        ctx.quadraticCurveTo(-this.size * 0.6, this.size * 0.3, -this.size * 0.4, -this.size * 0.2);
        ctx.quadraticCurveTo(-this.size * 0.2, -this.size * 0.8, 0, -this.size);
        // Right curve
        ctx.quadraticCurveTo(this.size * 0.2, -this.size * 0.8, this.size * 0.4, -this.size * 0.2);
        ctx.quadraticCurveTo(this.size * 0.6, this.size * 0.3, 0, this.size);
        ctx.closePath();
        ctx.fill();

        // Draw center vein
        ctx.strokeStyle = veinColor;
        ctx.lineWidth = this.size * 0.05;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, this.size);
        ctx.quadraticCurveTo(0, 0, 0, -this.size * 0.85);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Populate particles list
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Leaf());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
});
