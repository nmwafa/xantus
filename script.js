/* ==========================================================================
   XANTUS — site script
   - smooth-scroll navigation (single page)
   - mobile nav toggle
   - scroll-spy active link
   - hero terminal typing effect
   - contact form submission (Formspree)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('nav');
  const headerHeight = () => header.offsetHeight;

  /* ---------- Smooth scroll for in-page links ---------- */
  const scrollLinks = document.querySelectorAll('[data-scroll]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() + 1;
      window.scrollTo({ top, behavior: 'smooth' });

      // close mobile menu after navigating
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');

      history.pushState(null, '', href);
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- Scroll-spy: highlight current section in nav ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('[data-nav]');

  const setActive = (id) => {
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: `-${headerHeight() + 40}px 0px -55% 0px`, threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Hero terminal typing effect ---------- */
  const typedEl = document.getElementById('typedCode');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    '$ xantus scan --target your-app.com',
    '[*] reconnaissance ............ done',
    '[*] vulnerability checks ...... done',
    '[*] hardening review .......... done',
    '[OK] report ready — let\'s talk'
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = lines.join('\n');
    } else {
      let lineIndex = 0;
      let charIndex = 0;
      let output = '';

      const typeNext = () => {
        if (lineIndex >= lines.length) return;
        const currentLine = lines[lineIndex];

        if (charIndex < currentLine.length) {
          output += currentLine.charAt(charIndex);
          charIndex++;
          typedEl.textContent = output;
          setTimeout(typeNext, 18 + Math.random() * 28);
        } else {
          output += '\n';
          lineIndex++;
          charIndex = 0;
          typedEl.textContent = output;
          setTimeout(typeNext, 280);
        }
      };

      setTimeout(typeNext, 500);
    }
  }

  /* ---------- Contact form submission ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {
        statusEl.textContent = '[ERROR] form endpoint not configured yet — see README.md to connect an email backend.';
        statusEl.className = 'form-status err';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const response = await fetch(action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (response.ok) {
          statusEl.textContent = '[OK] message sent — we\'ll reply within one business day.';
          statusEl.className = 'form-status ok';
          form.reset();
        } else {
          statusEl.textContent = '[ERROR] something went wrong — please email contact@xantus.dev directly.';
          statusEl.className = 'form-status err';
        }
      } catch (err) {
        statusEl.textContent = '[ERROR] could not reach the server — please email contact@xantus.dev directly.';
        statusEl.className = 'form-status err';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

});
