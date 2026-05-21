/* =============================================================
   main.js — lógica de tema (light/dark) + animações on-scroll.
   Tudo em Vanilla JS, sem dependências.
   ============================================================= */

(() => {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const iconEl = toggleBtn?.querySelector('.theme-toggle__icon');

  /* ---------- TEMA ----------
     Estratégia:
     1. Lê preferência salva no localStorage.
     2. Se não houver, usa a preferência do sistema (prefers-color-scheme).
     3. O atributo data-theme="light" no <html> ativa as variáveis claras
        definidas em variables.css. Escuro é o padrão (sem atributo).
  */
  const getInitialTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      if (iconEl) iconEl.textContent = '☀️';
      toggleBtn?.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      if (iconEl) iconEl.textContent = '🌙';
      toggleBtn?.setAttribute('aria-pressed', 'false');
    }
  };

  // Aplica imediatamente para evitar "flash" de tema errado
  applyTheme(getInitialTheme());

  toggleBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------- REVEAL ON SCROLL ----------
     IntersectionObserver é nativamente performático. Adicionamos a
     classe .is-visible quando o elemento entra na viewport. */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target); // anima só uma vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: navegadores antigos exibem tudo direto
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Ano dinâmico no footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
