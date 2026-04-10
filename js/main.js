// ── Language switching ────────────────────
function switchLang(dir, e) {
  if (e) e.preventDefault();
  const currentPath = window.location.pathname;
  // Remove current lang prefix
  let cleanPath = currentPath;
  const prefixes = ['/en', '/zh-TW'];
  for (const p of prefixes) {
    if (cleanPath.startsWith(p + '/') || cleanPath === p) {
      cleanPath = cleanPath.slice(p.length) || '/';
      break;
    }
  }
  // Add new prefix
  const newPath = dir ? '/' + dir + cleanPath : cleanPath;
  window.location.href = newPath;
}

// ── Close dropdowns on outside click ─────
document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-switcher')) {
    document.querySelectorAll('.lang-dropdown.open').forEach(d => d.classList.remove('open'));
  }
  if (!e.target.closest('.menu-toggle') && !e.target.closest('.nav-links')) {
    document.querySelectorAll('.nav-links.open').forEach(n => n.classList.remove('open'));
  }
});

// ── Auto-detect language on first visit ──
(function() {
  if (typeof localStorage === 'undefined') return;
  const visited = localStorage.getItem('sbti_visited');
  if (visited) return;
  localStorage.setItem('sbti_visited', '1');

  const path = window.location.pathname;
  // Only redirect from root (zh-CN default)
  if (path !== '/' && path !== '/index.html') return;

  const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (lang.startsWith('en')) {
    window.location.href = '/en/';
  } else if (lang === 'zh-tw' || lang === 'zh-hant' || lang.startsWith('zh-hant')) {
    window.location.href = '/zh-TW/';
  }
})();
