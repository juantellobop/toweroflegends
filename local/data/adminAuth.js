// Torre de Leyendas — Sesión del panel de administración.
// El token se obtiene del servidor (/api/admin/login) y se adjunta a las
// peticiones de escritura del admin. Se guarda en sessionStorage para que
// caduque al cerrar la pestaña.

import { t } from '../../data/i18n.js';

export const ADMIN_LOGIN_ENDPOINT = '/api/admin/login';
const TOKEN_KEY = 'tdl_admin_token';

export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || null;
  } catch (_) {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch (_) {
    /* almacenamiento no disponible: la sesión solo durará en memoria del flujo actual */
  }
}

export function clearAdminToken() {
  setAdminToken(null);
}

export function adminAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(user, password) {
  const response = await fetch(ADMIN_LOGIN_ENDPOINT, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, password }),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }
  if (!response.ok) {
    throw new Error(response.status === 401
      ? t('adminLogin.invalidCredentials')
      : t('adminLogin.httpError', { status: response.status }));
  }
  if (!payload?.token) {
    throw new Error(t('adminLogin.missingToken'));
  }
  setAdminToken(payload.token);
  return payload;
}
