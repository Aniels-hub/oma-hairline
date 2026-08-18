'use strict';

(function () {
  const OWNER_WHATSAPP = '2349135028166';
  const OWNER_EMAIL = 'Faceofoma@gmail.com';

  // -------------------- Utilities --------------------
  function sanitise(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.textContent;
  }

  function $(sel) {
    return document.querySelector(sel);
  }

  function $all(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  // -------------------- Toast --------------------
  let toastEl = null;
  let toastTimer = null;

  function showToast(message, duration = 3500) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');

      Object.assign(toastEl.style, {
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(10px)',
        background: '#1A1810',
        color: '#fff',
        fontSize: '0.85rem',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '600',
        padding: '0.85rem 1.75rem',
        borderRadius: '100px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '99999',
        opacity: '0',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100vw - 2rem)',
        textAlign: 'center',
      });

      document.body.appendChild(toastEl);
    }

    toastEl.textContent = String(message ?? '');
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(10px)';
    }, duration);
  }

  //-------------------- Hairline helpers --------------------
  function initCopyrightYear() {
    const yearEl = $('#currentYear');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initMobileMenu() {
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      this.classList.toggle('active', isOpen);
      this.setAttribute('aria-expanded', String(isOpen));
      this.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    $all('#mobileNav a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  function initNavbarScrollShadow() {
    const navbar = $('#navbar');
    if (!navbar) return;

    window.addEventListener(
      'scroll',
      () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      },
      { passive: true }
    );
  }

  // ── NAVBAR SCROLL SHADOW ────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function initRevealAnimations() {
    const elements = $all('.fade-in, .fade-in-left, .fade-in-right');
    if (elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      elements.forEach((el) => observer.observe(el));
    } else {
      elements.forEach((el) => el.classList.add('visible'));
    }
  }

  function initHeroSlideshow() {
    const heroMedia = $('#heroMedia');
    if (!heroMedia) return;

    const slides = $all('.hero-slide');
    if (slides.length < 2) return;

    let activeIndex = 0;

    setInterval(() => {
      slides[activeIndex].classList.remove('active');
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add('active');
    }, 5000);
  }

  function initFAQAccordion() {
    const faqItems = $all('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((i) => {
          i.classList.remove('active');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initSectionLinkTriggers() {
    const triggers = $all('[data-target]');
    if (triggers.length === 0) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const targetSelector = trigger.getAttribute('data-target');
        if (!targetSelector) return;

        const target = document.querySelector(targetSelector);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initExitIntent() {
    const exitOverlay = $('#exitOverlay');
    if (!exitOverlay) return;

    const closeExit = $('#closeExit');
    const exitNoThanks = $('#exitNoThanks');
    const exitClaimBtn = $('#exitClaimBtn');

    let exitShown = false;

    const closeExitModal = () => {
      exitOverlay.classList.remove('open');
      const focusTarget = document.querySelector('.hero .btn-primary');
      if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus();
    };

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown) {
        exitShown = true;
        exitOverlay.classList.add('open');
      }
    });

    if (closeExit) closeExit.addEventListener('click', closeExitModal);
    if (exitNoThanks) exitNoThanks.addEventListener('click', closeExitModal);

    exitOverlay.addEventListener('click', (e) => {
      if (e.target === exitOverlay) closeExitModal();
    });

    if (exitClaimBtn) {
      exitClaimBtn.addEventListener('click', () => {
        closeExitModal();
        showToast('🎉 10% off applied! Use code OMA10 at checkout.');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeExitModal();
    });
  }

  function initCaptureForm() {
    const captureForm = $('#captureForm');
    if (!captureForm) return;

    captureForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = captureForm.querySelector('input[type="text"]');
      const emailInput = captureForm.querySelector('input[type="email"]');

      const name = sanitise(nameInput?.value?.trim() || '');
      const email = sanitise(emailInput?.value?.trim() || '');

      if (!name) {
        showToast('Please enter your name.');
        nameInput?.focus?.();
        return;
      }

      if (!email || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address.');
        emailInput?.focus?.();
        return;
      }

      showToast(`🎉 Welcome ${name}! Check your email for exclusive offers.`);
      captureForm.reset();
    });
  }

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const serviceInput = form.querySelector('select[name="service"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      const name = sanitise(nameInput?.value?.trim() || '');
      const email = sanitise(emailInput?.value?.trim() || '');
      const phone = sanitise(phoneInput?.value?.trim() || '');
      const service = sanitise(serviceInput?.value?.trim() || '');
      const message = sanitise(messageInput?.value?.trim() || '');

      if (!name) {
        showToast('Please enter your name.');
        nameInput?.focus?.();
        return;
      }

      if (!email || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address.');
        emailInput?.focus?.();
        return;
      }

      const inquiryMessage = [
        'New inquiry from Oma Hairline website',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service: ${service || 'Not specified'}`,
        '',
        'Message:',
        message || 'No additional message provided.',
      ].join('\n');

      const waUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(inquiryMessage)}`;
      const mailUrl = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('New Inquiry - Oma Hairline')}&body=${encodeURIComponent(inquiryMessage)}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp with your inquiry…');

      setTimeout(() => {
        window.location.href = mailUrl;
      }, 350);

      form.reset();
    });
  }

  function initWhatsAppChatButton() {
    const btn = $('#whatsappChatBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const message = encodeURIComponent('Hi! I have a question about your products.');
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${message}`, '_blank', 'noopener,noreferrer');
    });
  }

  function initAddToCartButtons() {
    $all('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const productCard = btn.closest('.product-card');
        const name = productCard?.querySelector('h4')?.textContent?.trim() || 'Selected item';
        const priceText = productCard?.querySelector('.price')?.textContent?.replace(/[^\d]/g, '') || '0';
        const price = Number(priceText) || 0;
        const image = productCard?.querySelector('img')?.getAttribute('src') || '';

        const originalText = btn.textContent;
        btn.textContent = '✓ Added';
        btn.style.background = '#16A34A';
        btn.style.borderColor = '#16A34A';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 1800);

        const cart = window.__OMA_CART__;
        if (cart) {
          cart.add({ name, price, image });
          const badge = $('.cart-count');
          if (badge) {
            badge.textContent = String(cart.totalItems());
            badge.hidden = cart.totalItems() === 0;
          }
        } else {
          const cartDrawer = $('#cartDrawer');
          if (cartDrawer) {
            cartDrawer.classList.add('open');
            document.getElementById('cartOverlay')?.classList.add('open');
          }
          showToast('Cart is ready. Please refresh and try again.');
        }

        showToast('Item added to cart 🛍️');
      });
    });
  }

  function initScrollToTop() {
    const scrollTopBtn = $('#scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener(
      'scroll',
      () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initVideoItems() {
    $all('.video-item').forEach((item) => {
      item.addEventListener('click', () => showToast('🎬 Video preview coming soon.'));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showToast('🎬 Video preview coming soon.');
        }
      });
    });
  }

  // ── VIDEO PRODUCT CARDS (hover play/pause) ────────────────────
  function initVideoCards() {
    const videoCards = $all('.video-card');
    if (!videoCards.length) return;

    videoCards.forEach((card) => {
      const container = card.querySelector('.video-container');
      const video = card.querySelector('.video-product');
      if (!container || !video) return;

      let isPlaying = false;
      let hoverTimer = null;

      // Mouse enter — play video after short delay (prevents accidental plays)
      card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          video.muted = true;
          video.currentTime = 0;
          video.play().then(() => {
            isPlaying = true;
            container.classList.add('playing');
          }).catch(() => {
            // Autoplay blocked by browser — keep poster showing
          });
        }, 300);
      });

      // Mouse leave — pause and reset
      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        if (isPlaying) {
          video.pause();
          isPlaying = false;
          container.classList.remove('playing');
        }
      });

      // Touch device support — tap to toggle play/pause
      card.addEventListener('click', (e) => {
        // Don't interfere with button clicks
        if (e.target.closest('.btn, .add-to-cart')) return;

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          e.preventDefault();
          if (isPlaying) {
            video.pause();
            isPlaying = false;
            container.classList.remove('playing');
          } else {
            video.muted = true;
            video.currentTime = 0;
            video.play().then(() => {
              isPlaying = true;
              container.classList.add('playing');
            }).catch(() => {});
          }
        }
      });

      // Clean up on video end — reset to poster
      video.addEventListener('ended', () => {
        isPlaying = false;
        container.classList.remove('playing');
      });
    });
  }

  function initConcernButtons() {
    const concernBtns = $all('.concern-btn');
    if (concernBtns.length === 0) return;

    concernBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const bestsellers = $('.bestsellers');
        if (!bestsellers) return;

        bestsellers.scrollIntoView({ behavior: 'smooth' });

        $all('.product-card').forEach((card, index) => {
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.boxShadow = '0 0 0 3px var(--primary)';
            setTimeout(() => {
              card.style.boxShadow = '';
            }, 1200);
          }, index * 150);
        });
      });
    });
  }

  function initRecentPurchaseNotification() {
    const recentPurchase = $('#recentPurchase');
    const closeRecent = $('#closeRecent');
    if (!recentPurchase || !closeRecent) return;

    setTimeout(() => {
      recentPurchase.classList.add('hidden');
    }, 8000);

    closeRecent.addEventListener('click', () => {
      recentPurchase.classList.add('hidden');
    });

    const names = ['Adeola', 'Zainab', 'Ngozi', 'Temi', 'Bola', 'Kemi', 'Lola', 'Sade'];
    const products = ['Moisturizing Cream', 'Edge Control Gel', 'Luxury Wig Bundle', 'Hair Growth Oil', 'Shampoo Set'];

    setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const hours = Math.floor(Math.random() * 5) + 1;

      const avatar = recentPurchase.querySelector('.avatar');
      const strongs = recentPurchase.querySelectorAll('.text strong');
      const timeEl = recentPurchase.querySelector('.text .time');

      if (avatar) avatar.textContent = name.charAt(0);
      if (strongs[0]) strongs[0].textContent = name;
      if (strongs[1]) strongs[1].textContent = product;
      if (timeEl) timeEl.textContent = `${hours} hour${hours > 1 ? 's' : ''} ago`;

      recentPurchase.classList.remove('hidden');
      setTimeout(() => {
        recentPurchase.classList.add('hidden');
      }, 6000);
    }, 25000);
  }

  // -------------------- Index page cart drawer --------------------
  function initIndexCartDrawer() {
    const cartDrawer = $('#cartDrawer');
    const cartOverlay = $('#cartOverlay');
    const cartItemsEl = $('#cartItems');
    const cartFooterEl = $('#cartFooter');
    const cartCountEl = $('#cartCount');
    const cartSubtotalEl = $('#cartSubtotal');
    const cartToggle = $('#cartToggle');
    const cartClose = $('#cartClose');
    const checkoutBtn = $('#checkoutBtn');
    const clearCartBtn = $('#clearCartBtn');

    if (!cartDrawer || !cartOverlay || !cartItemsEl || !cartFooterEl || !cartCountEl || !cartSubtotalEl || !cartToggle || !cartClose || !checkoutBtn || !clearCartBtn) {
      return;
    }

    const Cart = {
      items: [],
      add(product) {
        if (!product?.name) return;
        const existing = this.items.find((i) => i.name === product.name);
        if (existing) existing.quantity += 1;
        else this.items.push({ ...product, quantity: 1 });
        this.render();
        openCart();
      },
      remove(name) {
        this.items = this.items.filter((i) => i.name !== name);
        this.render();
      },
      updateQuantity(name, quantity) {
        if (quantity <= 0) return this.remove(name);
        const item = this.items.find((i) => i.name === name);
        if (item) item.quantity = quantity;
        this.render();
      },
      totalItems() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
      },
      totalPrice() {
        return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      clear() {
        this.items = [];
        this.render();
      },
      render() {
        const total = this.totalItems();
        cartCountEl.textContent = String(total);
        cartCountEl.hidden = total === 0;

        if (this.items.length === 0) {
          cartItemsEl.innerHTML = `
            <div class="cart-empty">
              <p class="cart-empty-title">Your cart is empty</p>
              <p class="cart-empty-sub">Add some beautiful wigs to get started</p>
            </div>`;
          cartFooterEl.hidden = true;
          return;
        }

        cartItemsEl.innerHTML = this.items
          .map((item) => `
            <div class="cart-item" data-product-name="${item.name}">
              <img src="${item.image}" alt="${item.name}" />
              <div class="cart-item-body">
                <div class="cart-item-top">
                  <h3 class="cart-item-name">${item.name}</h3>
                  <button class="remove-btn" data-action="remove" data-name="${item.name}" aria-label="Remove item">
                    <i class="fas fa-trash-can" aria-hidden="true"></i>
                  </button>
                </div>
                <p class="cart-item-price">₦${Number(item.price).toLocaleString()}</p>
                <div class="cart-item-controls">
                  <button class="qty-btn" data-action="decrease" data-name="${item.name}" aria-label="Decrease quantity">
                    <i class="fas fa-minus" aria-hidden="true"></i>
                  </button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn" data-action="increase" data-name="${item.name}" aria-label="Increase quantity">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>`)
          .join('');

        cartFooterEl.hidden = false;
        cartSubtotalEl.textContent = `₦${this.totalPrice().toLocaleString()}`;
      },
    };

    function openCart() {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
    }

    function closeCart() {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    clearCartBtn.addEventListener('click', () => {
      Cart.clear();
      showToast('Cart cleared');
    });

    cartItemsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const name = btn.dataset.name;
      const action = btn.dataset.action;
      const item = Cart.items.find((i) => i.name === name);
      if (!item) return;

      if (action === 'increase') Cart.updateQuantity(name, item.quantity + 1);
      if (action === 'decrease') Cart.updateQuantity(name, item.quantity - 1);
      if (action === 'remove') Cart.remove(name);
    });

    checkoutBtn.addEventListener('click', () => {
      if (Cart.items.length === 0) return;
      const nameInput = $('#checkoutName');
      const phoneInput = $('#checkoutPhone');
      const name = (nameInput?.value || '').trim();
      const phone = (phoneInput?.value || '').trim();
      if (!name || !phone) {
        showToast('Enter your name and phone to checkout.');
        return;
      }

      const message = [
        'New order from Oma Hairline website',
        '',
        `Customer: ${name}`,
        `Phone: ${phone}`,
        '',
        'Items:',
        ...Cart.items.map((i) => `• ${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`),
        '',
        `Total: ₦${Cart.totalPrice().toLocaleString()}`,
      ].join('\n');

      const waUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
      const mailUrl = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('New Order - Oma Hairline')}&body=${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        window.location.href = mailUrl;
      }, 300);

      Cart.clear();
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      closeCart();
    });

    window.__OMA_CART__ = Cart;
    Cart.render();
  }

  // ── EMAIL CAPTURE FORM ──────────────────────────────────
  const captureForm = document.getElementById('captureForm');
  if (captureForm) {
    captureForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput  = captureForm.querySelector('input[type="text"]');
      const emailInput = captureForm.querySelector('input[type="email"]');

      const name  = sanitise(nameInput?.value?.trim()  || '');
      const email = sanitise(emailInput?.value?.trim() || '');

      if (!name) {
        showToast('Please enter your name.');
        nameInput?.focus();
        return;
      }
      if (!email || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address.');
        emailInput?.focus();
        return;
      }

      showToast(`🎉 Welcome ${name}! Check your email for exclusive offers.`);
      captureForm.reset();
    });
  }

  // ── WHATSAPP CHAT BUTTON ────────────────────────────────
  const whatsappChatBtn = document.getElementById('whatsappChatBtn');
  if (whatsappChatBtn) {
    whatsappChatBtn.addEventListener('click', () => {
      const waNumber = '2349135028166';
      const message  = encodeURIComponent('Hi! I have a question about your products.');
      window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    });
  }

  // -------------------- Boot --------------------
  document.addEventListener('DOMContentLoaded', () => {
    initCopyrightYear();
    initMobileMenu();
    initNavbarScrollShadow();
    initRevealAnimations();

    // hairline UI
    initHeroSlideshow();
    initFAQAccordion();
    initSectionLinkTriggers();
    initExitIntent();
    initCaptureForm();
    initContactForm();
    initWhatsAppChatButton();
    initIndexCartDrawer();
    initAddToCartButtons();
    initScrollToTop();
    initVideoItems();
    initVideoCards();
    initConcernButtons();
    initRecentPurchaseNotification();

    if (window.innerWidth <= 768) {
      document.body.classList.add('has-sticky-cart');
    }
  });
})();

