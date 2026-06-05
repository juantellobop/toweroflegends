import { sceneForEvent } from './scenes.js';
import { playerInitials, portraitPathForName } from '../data/playerAssets.js';
import { localizeTeamName, sceneAlt, sceneTitle, t } from '../data/i18n.js';

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function roleFor(ev, name) {
  if (!name) return t('scene.role.protagonist');
  if (name === ev.shooter) return ev.type === 'gol' ? t('scene.role.scorer') : t('scene.role.shooter');
  if (name === ev.assister || name === ev.actors?.passer) return t('scene.role.assistant');
  if (name === ev.keeper) return t('scene.role.keeper');
  if (name === ev.defenderName || name === ev.actors?.defender) return t('scene.role.defender');
  if (name === ev.actors?.receiver) return t('scene.role.receiver');
  return t('scene.role.protagonist');
}

function actorsFor(ev) {
  const ordered = [];
  const push = (name) => {
    if (name && !ordered.includes(name)) ordered.push(name);
  };

  if (ev.type === 'gol' || ev.type === 'parada' || ev.type === 'tiro_fuera' || ev.type === 'bloqueo') {
    push(ev.shooter || ev.actors?.shooter);
    push(ev.assister || ev.actors?.passer);
    if (ev.type === 'parada') push(ev.keeper || ev.actors?.keeper);
    if (ev.type === 'bloqueo') push(ev.defenderName || ev.actors?.defender);
  } else if (ev.type === 'falta') {
    push(ev.actors?.receiver || ev.shooter);
    push(ev.defenderName || ev.actors?.defender);
  } else if (ev.type === 'perdida' || ev.type === 'despeje') {
    push(ev.defenderName || ev.actors?.defender);
    push(ev.actors?.carrier || ev.assister);
  } else {
    push(ev.assister || ev.actors?.passer);
    push(ev.actors?.receiver || ev.shooter);
  }

  return ordered.slice(0, 3).map((name) => ({ name, role: roleFor(ev, name) }));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

// Etiqueta y tono de color del evento, para el distintivo (pill) de la escena.
function badgeFor(ev) {
  if (ev.phase === 'penalty') return { label: t('scene.badge.penalty'), tone: ev.type === 'gol' ? 'goal' : 'shot' };
  if (ev.phase === 'free_kick') return { label: t('scene.badge.free_kick'), tone: ev.type === 'gol' ? 'goal' : 'shot' };
  if (ev.phase === 'corner') return { label: t('scene.badge.corner'), tone: ev.type === 'gol' ? 'goal' : 'attack' };
  switch (ev.type) {
    case 'gol': return { label: t('scene.badge.gol'), tone: 'goal' };
    case 'parada': return { label: t('scene.badge.parada'), tone: 'save' };
    case 'tiro_fuera': return { label: t('scene.badge.tiro_fuera'), tone: 'shot' };
    case 'bloqueo': return { label: t('scene.badge.bloqueo'), tone: 'defense' };
    case 'falta': return ev.pattern === 'red_foul'
      ? { label: t('scene.badge.roja'), tone: 'red' }
      : { label: t('scene.badge.falta'), tone: 'yellow' };
    case 'fuera_juego': return { label: t('scene.badge.fuera_juego'), tone: 'defense' };
    case 'despeje': return { label: t('scene.badge.despeje'), tone: 'defense' };
    case 'perdida': return { label: t('scene.badge.perdida'), tone: 'defense' };
    case 'pase_fuera': return { label: t('scene.badge.pase_fuera'), tone: 'neutral' };
    default: return { label: t('scene.badge.default'), tone: 'neutral' };
  }
}

export class ScenePitch {
  constructor({ homeColor = '#D4AF37', awayColor = '#2F7BFF', reduceMotion = false } = {}) {
    this.homeColor = homeColor;
    this.awayColor = awayColor;
    this.reduceMotion = reduceMotion;
    this.element = document.createElement('div');
    this.element.className = 'scene-pitch';
    this.element.style.setProperty('--home-color', homeColor);
    this.element.style.setProperty('--away-color', awayColor);
    this.element.innerHTML = `
      <img class="scene-image is-active" alt="" decoding="async" />
      <img class="scene-image" alt="" decoding="async" />
      <div class="scene-grain" aria-hidden="true"></div>
      <div class="scene-scrim" aria-hidden="true"></div>
      <div class="scene-top">
        <span class="scene-minute tabular">0'</span>
        <span class="scene-badge"><span class="scene-badge-dot"></span><span class="scene-badge-txt">${t('scene.highlight')}</span></span>
        <span class="scene-chip">${t('scene.highlight')}</span>
      </div>
      <div class="scene-caption">
        <p class="scene-kicker"></p>
        <h2 class="scene-title"></h2>
      </div>
      <div class="scene-actors"></div>
      <div class="scene-stamp" aria-hidden="true"><span></span></div>`;
    // Dos capas de imagen para el crossfade entre escenas. `this.img` apunta a
    // la capa activa (compatibilidad con el código existente).
    this.imgs = Array.from(this.element.querySelectorAll('.scene-image'));
    this.active = 0;
    this.imgs.forEach((im) => {
      im.onerror = () => {
        const fb = sceneForEvent({ type: 'sin_remate', pattern: 'midfield_pass' });
        if (im.src.endsWith(fb.src)) return;
        im.src = fb.src;
        im.alt = fb.alt;
      };
    });
    this.minute = this.element.querySelector('.scene-minute');
    this.badge = this.element.querySelector('.scene-badge');
    this.badgeTxt = this.element.querySelector('.scene-badge-txt');
    this.chip = this.element.querySelector('.scene-chip');
    this.kicker = this.element.querySelector('.scene-kicker');
    this.title = this.element.querySelector('.scene-title');
    this.actors = this.element.querySelector('.scene-actors');
    this.stamp = this.element.querySelector('.scene-stamp span');
    this.reset();
  }

  // Capa de imagen actualmente visible (compatibilidad).
  get img() { return this.imgs[this.active]; }

  // Cambia la imagen de fondo con un crossfade suave entre las dos capas.
  setImage(src, alt = '') {
    const cur = this.imgs[this.active];
    if (cur.getAttribute('src') && cur.src.endsWith(src)) { cur.alt = alt; return; }
    const next = this.imgs[1 - this.active];
    next.src = src;
    next.alt = alt;
    next.classList.add('is-active');
    cur.classList.remove('is-active');
    this.active = 1 - this.active;
  }

  // Estado entre jugadas: solo una imagen en movimiento, sin texto ni overlays.
  reset() {
    const idle = sceneForEvent({ type: 'sin_remate', pattern: 'midfield_pass' });
    this.setImage(idle.src, '');
    this.minute.textContent = '';
    this.badgeTxt.textContent = '';
    this.chip.textContent = '';
    this.kicker.textContent = '';
    this.title.textContent = '';
    this.actors.innerHTML = '';
    this.element.dataset.sceneKey = idle.key;
    this.element.removeAttribute('data-tone');
    this.element.classList.remove('scene-pop', 'scene-goal');
    this.element.classList.add('scene-idle');
  }

  renderEvent(ev, { side = 'home' } = {}) {
    const scene = sceneForEvent(ev);
    const badge = badgeFor(ev);
    // Entra la nueva imagen con crossfade antes de relanzar el "pop".
    this.setImage(scene.src, sceneAlt(scene.key));
    this.element.dataset.sceneKey = scene.key;
    this.element.dataset.side = side;
    this.element.dataset.tone = badge.tone;
    this.element.classList.remove('scene-idle', 'scene-pop', 'scene-goal');
    // Fuerza reinicio de la animación CSS sin depender de layout complejo.
    void this.element.offsetWidth;
    this.element.classList.add('scene-pop');
    if (ev.type === 'gol') this.element.classList.add('scene-goal');

    this.minute.textContent = `${ev.minute ?? 0}'`;
    this.badgeTxt.textContent = badge.label;
    this.chip.textContent = side === 'home'
      ? localizeTeamName(ev.attackerTeam || t('generic.local'))
      : localizeTeamName(ev.attackerTeam || t('generic.opponent'));
    this.kicker.textContent = sceneTitle(scene.key);
    this.title.textContent = headlineFor(ev);
    this.stamp.textContent = ev.type === 'gol' ? t('scene.goalStamp') : '';
    this.actors.innerHTML = actorsFor(ev).map(actorHTML).join('');
  }

  async animateEvent(ev, opts = {}) {
    this.renderEvent(ev, opts);
    if (this.reduceMotion) return;
    await wait(opts.duration || 1500);
  }

  // Fallback para eventos antiguos si el director llama al renderer viejo.
  async animate(phase, opts = {}) {
    const type = phase === 'goal' ? 'gol' : phase === 'save' ? 'parada' : 'sin_remate';
    await this.animateEvent({ type, minute: 0, pattern: type === 'gol' ? 'shot_goal' : undefined }, opts);
  }
}

function headlineFor(ev) {
  const attacker = localizeTeamName(ev.attackerTeam || t('generic.opponent'));
  if (ev.type === 'gol') return t('scene.headline.gol', { attacker });
  if (ev.type === 'parada') return t('scene.headline.parada', { keeper: ev.keeper || ev.actors?.keeper || t('scene.role.keeper') });
  if (ev.type === 'tiro_fuera') return t('scene.headline.tiro_fuera', { shooter: ev.shooter || ev.actors?.shooter || attacker });
  if (ev.type === 'bloqueo') return t('scene.headline.bloqueo', { defender: ev.defenderName || ev.actors?.defender || t('scene.role.defender') });
  if (ev.type === 'falta') return ev.pattern === 'red_foul' ? t('scene.headline.faltaRoja') : t('scene.headline.falta');
  if (ev.type === 'fuera_juego') return t('scene.headline.fuera_juego');
  if (ev.type === 'despeje') return t('scene.headline.despeje');
  if (ev.type === 'pase_fuera') return t('scene.headline.pase_fuera');
  if (ev.type === 'perdida') return t('scene.headline.perdida');
  return t('scene.headline.default', { attacker });
}

function actorHTML({ name, role }) {
  const src = portraitPathForName(name);
  return `
    <div class="scene-actor">
      <span class="scene-portrait">
        <img src="${esc(src)}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(name))}</span>
      </span>
      <span class="scene-actor-copy">
        <b>${esc(name)}</b>
        <small>${esc(role)}</small>
      </span>
    </div>`;
}
