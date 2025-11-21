
document.addEventListener('DOMContentLoaded', () => {
  // === existing code: set active nav/tab based on .body data-page ===
  try {
    let active = document.querySelector('.body').dataset.page;
    const activeElem = document.querySelector("#" + active);
    if (activeElem) activeElem.classList.add('active');
  } catch (e) {
    // ignore if .body or data-page missing
    console.warn('active tab init skipped:', e);
  }
  
  
  // === Dark mode init & event binding ===
  const KEY = 'network_dark_mode';
  const html = document.documentElement;   // <html>
  const body = document.body;              // <body>
  const toggle = document.getElementById('dark-toggle');
  const icon = document.getElementById('dark-toggle-icon');

  function updateToggleIcon() {
    if (!icon || !toggle) return;
    if (body.classList.contains('dark-mode')) {
      icon.textContent = '☀️';
      toggle.setAttribute('aria-pressed', 'true');
      toggle.title = 'Switch to light mode';
    } else {
      icon.textContent = '🌙';
      toggle.setAttribute('aria-pressed', 'false');
      toggle.title = 'Switch to dark mode';
    }
  }

  function setDarkMode(on, persist = true) {
    // We add the class to <body> so CSS selectors like body.dark-mode work.
    if (on) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');

    updateToggleIcon();
    if (persist) localStorage.setItem(KEY, on ? 'on' : 'off');
  }

  function toggleDarkMode() {
    setDarkMode(!body.classList.contains('dark-mode'));
  }

  // Initialize dark mode: stored > OS preference > default false
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'on') setDarkMode(true, false);
    else if (stored === 'off') setDarkMode(false, false);
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark, false);
    }

    if (toggle) {
      toggle.addEventListener('click', toggleDarkMode);
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDarkMode();
        }
      });
    } else {
      // Element not found: warn so you can confirm HTML placement
      console.warn('Dark toggle element (#dark-toggle) not found in DOM.');
    }

    // Auto-update on system theme change only if user hasn't persisted a choice
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', e => {
        const storedChoice = localStorage.getItem(KEY);
        if (!storedChoice) setDarkMode(e.matches, false);
      });
    }
  } catch (err) {
    console.error('Dark mode init error:', err);
  }
});