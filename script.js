(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu-principal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  }));

  document.addEventListener('click', event => {
    if (menu?.classList.contains('open') && menuButton && !menu.contains(event.target) && !menuButton.contains(event.target)) {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.classList.contains('open')) {
      menu.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menu');
      menuButton?.focus();
    }
  });

  const desktopMenu = window.matchMedia('(min-width: 981px)');
  const closeMenuOnDesktop = event => {
    if (!event.matches) return;
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  };
  desktopMenu.addEventListener?.('change', closeMenuOnDesktop);

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealItems.forEach(item => observer.observe(item));
  }

  document.querySelectorAll('.js-whatsapp').forEach(link => {
    link.addEventListener('click', () => {
      const source = link.dataset.source || 'unknown';
      try {
        const key = 'apmais_whatsapp_clicks';
        const clicks = JSON.parse(localStorage.getItem(key) || '[]');
        clicks.push({ source, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(clicks.slice(-20)));
      } catch (_) {
        // Analytics fallback is intentionally silent.
      }
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
