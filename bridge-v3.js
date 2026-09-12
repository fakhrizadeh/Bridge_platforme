(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formatFa = new Intl.NumberFormat('fa-IR');
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
  document.documentElement.classList.add('motion-ready');
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  function swapImage(image, source, altText) {
    if (!image || image.getAttribute('src') === source) return;
    image.classList.add('is-swapping');
    window.setTimeout(() => {
      image.src = source;
      if (altText) image.alt = altText;
      requestAnimationFrame(() => image.classList.remove('is-swapping'));
    }, reduceMotion ? 0 : 220);
  }

  const counters = [...document.querySelectorAll('[data-count]')];
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || '';

      if (reduceMotion) {
        element.textContent = `${formatFa.format(target)}${suffix}`;
        observer.unobserve(element);
        return;
      }

      const started = performance.now();
      const duration = 1050;
      const animate = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${formatFa.format(Math.round(target * eased))}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      observer.unobserve(element);
    });
  }, { threshold: 0.55 });
  counters.forEach((counter) => counterObserver.observe(counter));

  const chartCards = [...document.querySelectorAll('[data-chart]')];
  const chartObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('chart-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.32 });
  chartCards.forEach((card) => chartObserver.observe(card));

  const heroSlides = [
    { src: 'assets/bridge-crm-customers-demo.svg', title: 'مدیریت مشتریان', alt: 'نمای آزمایشی مدیریت مشتریان در نرم‌افزار بریج' },
    { src: 'assets/bridge-crm-workflow-demo.svg', title: 'فرایند فروش', alt: 'نمای آزمایشی فرایند و فعالیت‌های فروش در نرم‌افزار بریج' },
    { src: 'assets/bridge-crm-reports-demo.svg', title: 'گزارش‌های مدیریتی', alt: 'نمای آزمایشی گزارش‌های مدیریتی در نرم‌افزار بریج' }
  ];
  const heroImage = document.getElementById('heroImage');
  const heroTitle = document.getElementById('heroSlideTitle');
  const heroDots = [...document.querySelectorAll('.slide-dot')];
  const heroProduct = document.querySelector('.hero-product');
  let heroIndex = 0;
  let heroTimer = 0;

  heroSlides.slice(1).forEach((slide) => {
    const preload = new Image();
    preload.src = slide.src;
  });

  function showHeroSlide(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[heroIndex];
    swapImage(heroImage, slide.src, slide.alt);
    if (heroTitle) heroTitle.textContent = slide.title;
    heroDots.forEach((dot, dotIndex) => {
      const active = dotIndex === heroIndex;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  }

  function startHeroAutoplay() {
    if (reduceMotion) return;
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 4800);
  }

  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showHeroSlide(Number(dot.dataset.slide || 0));
      startHeroAutoplay();
    });
  });
  heroProduct?.addEventListener('pointerenter', () => window.clearInterval(heroTimer));
  heroProduct?.addEventListener('pointerleave', startHeroAutoplay);
  startHeroAutoplay();

  const storySteps = [...document.querySelectorAll('.story-step')];
  const storyImage = document.getElementById('storyImage');
  const storyProgress = document.getElementById('storyProgress');
  const storyNumber = document.getElementById('storyNumber');
  const storyLabel = document.getElementById('storyLabel');

  function activateStory(step) {
    const stepNumber = Number(step.dataset.step || 1);
    storySteps.forEach((item) => item.classList.toggle('active', item === step));
    swapImage(storyImage, step.dataset.image || heroSlides[0].src, `نمای ${step.dataset.label || 'مرحله فروش'} در بریج`);
    if (storyProgress) storyProgress.style.width = `${stepNumber * 25}%`;
    if (storyNumber) storyNumber.textContent = `${formatFa.format(stepNumber)} از ۴`;
    if (storyLabel) storyLabel.textContent = step.dataset.label || '';
  }

  const storyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateStory(visible.target);
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-24% 0px -40% 0px' });
  storySteps.forEach((step) => storyObserver.observe(step));

  const moduleTabs = [...document.querySelectorAll('.module-tab')];
  const moduleImage = document.getElementById('moduleImage');
  const moduleTitle = document.getElementById('moduleTitle');
  const moduleCopy = document.getElementById('moduleCopy');

  moduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      moduleTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      swapImage(moduleImage, tab.dataset.image || heroSlides[0].src, `نمای ${tab.dataset.title || 'ماژول'} در بریج`);
      if (moduleTitle) moduleTitle.textContent = tab.dataset.title || '';
      if (moduleCopy) moduleCopy.textContent = tab.dataset.copy || '';
    });
  });

  const videoDialog = document.getElementById('videoDialog');
  const openVideo = document.getElementById('openVideo');
  const closeVideo = document.getElementById('closeVideo');
  openVideo?.addEventListener('click', () => videoDialog?.showModal());
  closeVideo?.addEventListener('click', () => videoDialog?.close());
  videoDialog?.addEventListener('click', (event) => {
    if (event.target === videoDialog) videoDialog.close();
  });

  window.__bridgeMotionReady = true;
})();
