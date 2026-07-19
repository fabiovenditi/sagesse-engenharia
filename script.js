const button = document.querySelector('.menu-button');
const nav = document.querySelector('nav');
button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
});
document.querySelector('#year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('[data-reveal]');
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => observer.observe(item));
