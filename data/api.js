// Torre de Leyendas — Cliente JSON mínimo para la API propia (/api/*).
// Devuelve null ante cualquier fallo (sin fetch, servidor caído, HTTP no-OK):
// los llamadores tratan null como "función no disponible" y el juego sigue
// funcionando en hosting estático sin servidor Node.

function absoluteUrl(path) {
  if (typeof window !== 'undefined' && window.location?.href) {
    return new URL(path, window.location.href).href;
  }
  return path;
}

export async function requestJson(path, options = {}) {
  const fetcher = typeof window !== 'undefined' && typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : typeof fetch === 'function'
      ? fetch
      : null;
  if (!fetcher) return null;

  try {
    const response = await fetcher(absoluteUrl(path), {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (_) {
    return null;
  }
}
