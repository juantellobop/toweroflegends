// Torre de Leyendas — Arranque LOCAL del panel de administración.
// Este módulo y todo lo que importa viven solo en local/ (ignorado por git) y
// no se publican. main.js lo carga con import() opcional: si no existe (clon
// público / producción), el juego arranca igual sin admin.
//
// initAdminBoot recibe de main.js los helpers de navegación que necesita
// (root, renderRoute, renderMenu, getCurrentRoute) para no acoplar el código
// público a nada de admin.

import { renderAdmin } from './ui/adminScreen.js';
import { renderAdminLogin } from './ui/adminLogin.js';
import { getAdminToken, clearAdminToken } from './data/adminAuth.js';

const ADMIN_HASH = '#playeredit';

let cssInjected = false;
function injectAdminCss() {
  if (cssInjected) return;
  cssInjected = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'local/admin.css';
  document.head.appendChild(link);
}

export function initAdminBoot({ root, renderRoute, renderMenu, getCurrentRoute }) {
  injectAdminCss();

  function leaveAdmin() {
    // Limpia el hash sin disparar hashchange (replaceState no lo emite).
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    renderMenu('back');
  }

  function renderAdminScreen(navHint = 'forward') {
    renderRoute('admin', () => {
      if (getAdminToken()) {
        renderAdmin(root, {
          onBack: () => leaveAdmin(),
          onLogout: () => { clearAdminToken(); renderAdminScreen('refresh'); },
        });
      } else {
        renderAdminLogin(root, {
          onSuccess: () => renderAdminScreen('refresh'),
          onBack: () => leaveAdmin(),
        });
      }
    }, navHint);
  }

  function handleAdminHash() {
    if (window.location.hash === ADMIN_HASH) {
      if (getCurrentRoute() !== 'admin') renderAdminScreen('forward');
    } else if (getCurrentRoute() === 'admin') {
      renderMenu('back');
    }
  }

  window.addEventListener('hashchange', handleAdminHash);

  // Si ya entramos directamente con #playeredit, sustituye al menú recién
  // pintado por main.js (flash inapreciable y solo en local).
  if (window.location.hash === ADMIN_HASH) renderAdminScreen('forward');
}
