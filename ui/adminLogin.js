// Torre de Leyendas — Acceso al panel de administración.
// Pide usuario y contraseña; al validarlos contra el servidor invoca onSuccess.

import { adminLogin } from '../data/adminAuth.js';
import { esc } from './dom.js';
import { t } from '../data/i18n.js';

export function renderAdminLogin(root, handlers = {}) {
  root.innerHTML = `
    <section class="screen menu-screen admin-login-screen">
      <div class="menu-shell">
        <div class="logo pixel-logo">
          <h1>${t('adminLogin.title')}</h1>
          <p class="logo-kicker">${t('adminLogin.kicker')}</p>
        </div>
        <form id="adminLoginForm" class="team-identity arcade-panel admin-login-form" autocomplete="off">
          <label class="ti-name-field">${t('adminLogin.user')}
            <input id="adminLoginUser" type="text" name="user" autocomplete="username" spellcheck="false" required />
          </label>
          <label class="ti-name-field">${t('adminLogin.password')}
            <input id="adminLoginPassword" type="password" name="password" autocomplete="current-password" required />
          </label>
          <p class="ti-error" id="adminLoginError" role="alert" hidden></p>
          <div class="menu-actions">
            <button id="adminLoginSubmit" class="primary big" type="submit">${t('adminLogin.submit')}</button>
            <button id="adminLoginBack" class="ghost big" type="button">${t('adminLogin.back')}</button>
          </div>
        </form>
      </div>
    </section>`;

  const form = root.querySelector('#adminLoginForm');
  const userInput = root.querySelector('#adminLoginUser');
  const passInput = root.querySelector('#adminLoginPassword');
  const submit = root.querySelector('#adminLoginSubmit');
  const error = root.querySelector('#adminLoginError');

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  userInput.focus();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = t('adminLogin.checking');
    try {
      await adminLogin(userInput.value, passInput.value);
      handlers.onSuccess?.();
    } catch (err) {
      showError(esc(err.message || t('adminLogin.genericError')));
      passInput.value = '';
      passInput.focus();
      submit.disabled = false;
      submit.textContent = t('adminLogin.submit');
    }
  });

  root.querySelector('#adminLoginBack').addEventListener('click', () => handlers.onBack?.());
}
