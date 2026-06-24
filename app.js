/* ==========================================================================
   AuraNativa Beauty - Interactive Scripts
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
    const particleCount = 15; // Apenas 15 folhas visíveis por vez para maior leveza e foco no conteúdo

    // Objeto mouse para interação física de repulsão
    let mouse = { x: null, y: null, radius: 110 };

    // Rastreia coordenadas do mouse dentro da Hero apenas para desktop
    if (window.innerWidth >= 768 && hero) {
      hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      hero.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

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
        // Distribui o Y inicial aleatoriamente para evitar que todas caiam juntas no início
        this.y = Math.random() * canvas.height;
      }

      reset() {
        const borderPercent = canvas.width < 768 ? 0.12 : 0.28; // Mobile: 12% margem, Desktop: 28% margem
        
        // Define a zona de spawn (evita o centro onde estão o título, textos e botões)
        if (Math.random() < 0.45) {
          this.x = Math.random() * (canvas.width * borderPercent);
          this.zone = 'left';
        } else {
          this.x = canvas.width * (1 - borderPercent) + Math.random() * (canvas.width * borderPercent);
          this.zone = 'right';
        }
        
        this.y = -40;
        this.size = Math.random() * 6 + 10; // Folhas menores (de 10px a 16px) para evitar poluição visual
        
        // Mapeamento de profundidade e velocidade super lentas (Float)
        if (this.size > 14) {
          // Primeiro plano: Médio-grandes, flutuação lenta, opacidade sutil (25% a 35%)
          this.speedY = Math.random() * 0.15 + 0.25;
          this.speedX = Math.random() * 0.1 + 0.1;
          this.blur = Math.random() * 1 + 1; // Desfoque de movimento muito leve
          this.opacity = Math.random() * 0.1 + 0.25; // 25% - 35%
        } else if (this.size > 12) {
          // Plano Médio (Focado): Tamanho normal, nítido, opacidade média (30% a 45%)
          this.speedY = Math.random() * 0.1 + 0.15;
          this.speedX = Math.random() * 0.08 + 0.08;
          this.blur = 0; // Perfeitamente nítido
          this.opacity = Math.random() * 0.15 + 0.3; // 30% - 45%
        } else {
          // Fundo: Pequenas, bem lentas e com desfoque de profundidade suave
          this.speedY = Math.random() * 0.05 + 0.08;
          this.speedX = Math.random() * 0.05 + 0.05;
          this.blur = Math.random() * 1.5 + 1.5; // Desfoque de profundidade suave
          this.opacity = Math.random() * 0.1 + 0.2; // 20% - 30%
        }

        // Propriedades de balanço (Sway lateral reduzido para não invadir o centro)
        this.swaySpeed = Math.random() * 0.008 + 0.004;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayRange = Math.random() * 10 + 6; // Balanço curto para se manter nas laterais

        // Rotação sutil e lenta
        this.rotation = Math.random() * Math.PI * 2;
        this.baseRotationSpeed = Math.random() * 0.006 - 0.003;
        this.rotationSpeed = this.baseRotationSpeed;

        // Tipo de cor (75% verde floresta, 25% dourado)
        this.isGold = Math.random() < 0.25;

        // Deslocamento acumulado de forças externas (como o mouse)
        this.dispX = 0;
        this.dispY = 0;
      }

      update() {
        // Aplica repulsão ao passar o mouse perto (Efeito Brisa/Sopro)
        if (mouse.x !== null && mouse.y !== null) {
          const currentX = this.x + Math.sin(this.swayAngle) * this.swayRange + this.dispX;
          const dx = currentX - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Calcula intensidade da força (quanto mais perto, mais forte empurra)
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Empurra a folha na direção oposta ao mouse
            const pushX = Math.cos(angle) * force * 2.2;
            const pushY = Math.sin(angle) * force * 1.8;

            this.dispX += pushX;
            this.dispY += pushY;

            // Adiciona rotação extra ao ser empurrada por um vento simulado
            this.rotationSpeed += (pushX > 0 ? 0.003 : -0.003);
          }
        }

        this.y += this.speedY + this.dispY;
        this.swayAngle += this.swaySpeed;
        
        // Aplica atrito suave no deslocamento acumulado para desaceleração
        this.x += Math.sin(this.swayAngle) * (this.speedX * 0.8) + (this.isGold ? 0.04 : -0.02) + this.dispX;
        
        this.dispX *= 0.92; // Dissipação da força no eixo X
        this.dispY *= 0.92; // Dissipação da força no eixo Y

        // Desacelera lentamente a velocidade de rotação extra de volta ao padrão
        this.rotationSpeed = this.rotationSpeed * 0.96 + this.baseRotationSpeed * 0.04;
        this.rotation += this.rotationSpeed;

        // Restringe dinamicamente para que a folha não invada o centro
        const borderPercent = canvas.width < 768 ? 0.12 : 0.28;
        const currentXFinal = this.x + Math.sin(this.swayAngle) * this.swayRange;
        if (this.zone === 'left' && currentXFinal > canvas.width * borderPercent) {
          this.swayAngle = Math.PI - this.swayAngle; // Inverte o balanço para a esquerda
        } else if (this.zone === 'right' && currentXFinal < canvas.width * (1 - borderPercent)) {
          this.swayAngle = Math.PI - this.swayAngle; // Inverte o balanço para a direita
        }

        // Reseta ao sair pela parte inferior ou laterais
        if (this.y > canvas.height + 30 || this.x < -30 || this.x > canvas.width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + Math.sin(this.swayAngle) * this.swayRange + this.dispX, this.y);
        ctx.rotate(this.rotation);

        // Aplica o filtro de desfoque (blur) se disponível no navegador
        if (this.blur > 0) {
          ctx.filter = `blur(${this.blur}px)`;
        }

        ctx.globalAlpha = this.opacity;

        // Gradients de cor (luxo)
        let mainColor, veinColor;
        if (this.isGold) {
          const grad = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
          grad.addColorStop(0, '#E6C56E');
          grad.addColorStop(0.5, '#D4AF37');
          grad.addColorStop(1, '#A58221');
          mainColor = grad;
          veinColor = 'rgba(255, 255, 255, 0.3)';
        } else {
          const grad = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
          grad.addColorStop(0, '#2D5842');
          grad.addColorStop(0.5, '#1B3B2B');
          grad.addColorStop(1, '#11251B');
          mainColor = grad;
          veinColor = 'rgba(212, 175, 55, 0.12)';
        }

        // Desenho da folha
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.6, this.size * 0.3, -this.size * 0.4, -this.size * 0.2);
        ctx.quadraticCurveTo(-this.size * 0.2, -this.size * 0.8, 0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.2, -this.size * 0.8, this.size * 0.4, -this.size * 0.2);
        ctx.quadraticCurveTo(this.size * 0.6, this.size * 0.3, 0, this.size);
        ctx.closePath();
        ctx.fill();

        // Nervura central da folha
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

    // Inicializa a lista de partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Leaf());
    }

    // Loop de Animação
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

  // --- 7. FAQ Accordion Toggle ---
  const faqToggles = document.querySelectorAll('.faq-toggle');
  
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const contentId = toggle.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      // Close other open FAQ items for a clean accordion behavior
      faqToggles.forEach(otherToggle => {
        if (otherToggle !== toggle && otherToggle.getAttribute('aria-expanded') === 'true') {
          otherToggle.setAttribute('aria-expanded', 'false');
          const otherContent = document.getElementById(otherToggle.getAttribute('aria-controls'));
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        if (content) {
          content.style.maxHeight = null;
          content.setAttribute('aria-hidden', 'true');
        }
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.setAttribute('aria-hidden', 'false');
        }
      }
    });
  });

  // --- 8. Interactive Experience Simulator ---
  const simForm = document.getElementById('sim-form');
  if (simForm) {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const stepContents = document.querySelectorAll('.sim-step-content');
    const stepIndicators = document.querySelectorAll('.sim-step-indicator');
    const serviceCheckboxes = document.querySelectorAll('.sim-checkbox');
    const radioNeighborhoods = document.querySelectorAll('.sim-radio');
    const clientNameInput = document.getElementById('client-name');
    const btnToStep2 = document.getElementById('sim-btn-to-step2');
    const submitBtn = document.getElementById('btn-submit-simulator');
    
    // Date & Time Inputs
    const dateInput = document.getElementById('booking-date');
    const radioTimes = document.getElementsByName('booking-time');

    // Receipt Elements
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptTotalTime = document.getElementById('receipt-total-time');
    const receiptTotalPrice = document.getElementById('receipt-total-price');
    const receiptDateVal = document.getElementById('receipt-date-val');
    const receiptTimeVal = document.getElementById('receipt-time-val');

    let selectedServices = [];
    let selectedAddons = [];
    let selectedNeighborhood = 'Jaraguá';

    // Set tomorrow's date as the minimum date limit
    if (dateInput) {
      const today = new Date();
      today.setDate(today.getDate() + 1); // Amanhã
      const tomorrowStr = today.toISOString().split('T')[0];
      dateInput.min = tomorrowStr;
      dateInput.value = tomorrowStr;
    }

    // Enable/Disable Avançar button in Step 1 based on selection
    const checkStep1Validation = () => {
      const anyChecked = Array.from(serviceCheckboxes).some(cb => cb.checked && cb.name === 'services');
      if (btnToStep2) {
        btnToStep2.disabled = !anyChecked;
      }
    };

    serviceCheckboxes.forEach(cb => {
      cb.addEventListener('change', checkStep1Validation);
    });

    // Step navigation
    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextStepNum = parseInt(btn.getAttribute('data-next'));
        
        // Validation before moving past step 1 (Services selection)
        if (nextStepNum > 1) {
          const step1Checked = Array.from(serviceCheckboxes).some(cb => cb.checked && cb.name === 'services');
          if (!step1Checked) {
            alert('Por favor, selecione pelo menos um serviço principal.');
            goToStep(1);
            return;
          }
        }

        // Validation for step 3 (Date Selection) before moving to step 4
        if (nextStepNum === 4) {
          if (dateInput && !dateInput.value) {
            alert('Por favor, escolha uma data para o seu atendimento.');
            dateInput.focus();
            return;
          }
        }
        
        goToStep(nextStepNum);
      });
    });

    prevButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prevStepNum = parseInt(btn.getAttribute('data-prev'));
        goToStep(prevStepNum);
      });
    });

    const goToStep = (stepNum) => {
      // Toggle contents
      stepContents.forEach(content => {
        content.classList.remove('active');
        if (parseInt(content.getAttribute('data-step')) === stepNum) {
          content.classList.add('active');
        }
      });

      // Toggle indicators
      stepIndicators.forEach(indicator => {
        const indicatorStep = parseInt(indicator.getAttribute('data-step'));
        indicator.classList.remove('active', 'completed');
        
        if (indicatorStep === stepNum) {
          indicator.classList.add('active');
        } else if (indicatorStep < stepNum) {
          indicator.classList.add('completed');
        }
      });

      // Calculate and update receipt if moving to step 4
      if (stepNum === 4) {
        updateReceipt();
      }
    };

    const updateReceipt = () => {
      selectedServices = [];
      selectedAddons = [];
      let totalMinutes = 0;
      let totalPrice = 0;
      
      receiptItemsList.innerHTML = '';

      serviceCheckboxes.forEach(cb => {
        if (cb.checked) {
          const price = parseInt(cb.getAttribute('data-price'));
          const time = parseInt(cb.getAttribute('data-time'));
          const label = cb.closest('.sim-option-card').querySelector('.option-title').innerText;
          
          if (cb.name === 'services') {
            selectedServices.push({ label, price, time });
          } else {
            selectedAddons.push({ label, price, time });
          }
          
          totalPrice += price;
          totalMinutes += time;

          // Add item row to receipt
          const row = document.createElement('div');
          row.classList.add('receipt-item-row');
          row.innerHTML = `
            <span>• ${label}</span>
            <span class="receipt-item-price">R$ ${price},00</span>
          `;
          receiptItemsList.appendChild(row);
        }
      });

      // Neighborhood selection
      const checkedNeighborhood = Array.from(radioNeighborhoods).find(r => r.checked);
      selectedNeighborhood = checkedNeighborhood ? checkedNeighborhood.value : 'Jaraguá';

      // Date and Time selection
      let selectedDate = '-';
      if (dateInput && dateInput.value) {
        const parts = dateInput.value.split('-');
        if (parts.length === 3) {
          selectedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }
      const checkedTime = Array.from(radioTimes).find(t => t.checked);
      const selectedTime = checkedTime ? checkedTime.value : '-';

      if (receiptDateVal) receiptDateVal.innerText = selectedDate;
      if (receiptTimeVal) receiptTimeVal.innerText = selectedTime;
      
      // Format Duration
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedDuration = hours > 0 
        ? `${hours}h${minutes > 0 ? minutes + 'min' : ''}` 
        : `${minutes}min`;

      receiptTotalTime.innerText = formattedDuration;
      receiptTotalPrice.innerText = `R$ ${totalPrice},00`;
    };

    // Form Submit Event (Build wa.me link dynamically)
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const clientName = clientNameInput.value.trim();
        if (!clientName) {
          alert('Por favor, informe seu nome completo para o agendamento.');
          clientNameInput.focus();
          return;
        }

        if (selectedServices.length === 0) {
          alert('Por favor, selecione pelo menos um serviço.');
          goToStep(1);
          return;
        }

        // Date and Time selection
        let selectedDate = '-';
        if (dateInput && dateInput.value) {
          const parts = dateInput.value.split('-');
          if (parts.length === 3) {
            selectedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }
        const checkedTime = Array.from(radioTimes).find(t => t.checked);
        const selectedTime = checkedTime ? checkedTime.value : '-';

        // Build WhatsApp text
        let messageText = `Olá! Gostaria de solicitar um agendamento de unhas a domicílio no AuraNativa.\n\n`;
        messageText += `*Dados do Agendamento:*\n`;
        messageText += `• Nome: ${clientName}\n`;
        messageText += `• Bairro: ${selectedNeighborhood}\n`;
        messageText += `• Data Sugerida: ${selectedDate}\n`;
        messageText += `• Período Sugerido: ${selectedTime}\n\n`;
        
        messageText += `*Serviços Escolhidos:*\n`;
        selectedServices.forEach(s => {
          messageText += `• ${s.label} (R$ ${s.price},00)\n`;
        });
        
        if (selectedAddons.length > 0) {
          messageText += `\n*Adicionais:*\n`;
          selectedAddons.forEach(a => {
            messageText += `• ${a.label} (R$ ${a.price},00)\n`;
          });
        }

        // Calculations
        let totalMinutes = 0;
        let totalPrice = 0;
        selectedServices.concat(selectedAddons).forEach(item => {
          totalPrice += item.price;
          totalMinutes += item.time;
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedDuration = hours > 0 
          ? `${hours}h${minutes > 0 ? minutes + 'min' : ''}` 
          : `${minutes}min`;

        messageText += `\n*Estimativa do Atendimento:*\n`;
        messageText += `• Duração: ${formattedDuration}\n`;
        messageText += `• Valor Estimado: *R$ ${totalPrice},00*\n\n`;
        messageText += `Qual é a sua disponibilidade de horários para esta semana?`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappNumber = '5511925867177'; // Novo número da especialista
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank', 'noopener');
      });
    }
  }

  // --- 9. Smooth Scroll for Custom Anchor Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Adjust offset if header is fixed
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
