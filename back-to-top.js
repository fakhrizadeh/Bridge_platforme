(function () {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > 420);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();
