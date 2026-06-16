// Torre de Leyendas — Constantes de balance (§6.6 del documento de diseño).
// Todo el balance del juego vive aquí para poder ajustarlo en un solo sitio.

export const CONFIG = {
  // --- Motor de simulación ---
  THETA: 1.6, // dominio del rating frente a la suerte
  BASE_SEQUENCES: 24, // jugadas de ataque totales por partido
  COUNTER_CHANCE: 0.2, // prob. de contraataque tras una pérdida
  W_DUEL: 0.4, // peso del duelo individual en cada jugada (0.6 sigue siendo el equipo)

  // --- Realismo del partido ---
  RED_CARD_PENALTY: 0.1, // un expulsado resta ~10% a defensa y medio del equipo el resto del partido
  COMEBACK_PUSH: 0.05, // empuje al equipo que va por detrás (por gol de diferencia, hasta 2 goles)

  // --- Tarjetas ---
  // Cada falta de la simulación resuelve una tarjeta: roja directa (rara),
  // amarilla (frecuente) o ninguna. La segunda amarilla a un mismo jugador se
  // convierte en roja. Calibrado para ~0,125 rojas/equipo/partido (Poisson):
  // 1 roja en 11,03% de los partidos, 2 en 0,69%, 3 en 0,029%, 4 en 0,0009%.
  // Re-medir con .cache/cards-probe.mjs si se tocan estos valores o el motor.
  // Nota: las faltas de la simulación son escasas (~1/equipo/partido), así que
  // la roja sale casi siempre de una entrada directa; por eso el valor es alto
  // pese a que "la roja directa es rara" — es raro que una falta lo sea, pero
  // hay pocas faltas. Medido: mean ~0,127 rojas/equipo, 1→11,4% · 2→0,60%.
  DIRECT_RED_PROB: 0.105, // prob. de roja directa por falta
  YELLOW_PROB: 0.62, // prob. de que una falta se sancione con amarilla (si no es roja directa)
  DANGEROUS_FOUL_MULT: 1.8, // las faltas peligrosas (tiro libre) multiplican el riesgo de tarjeta

  // --- Lesiones ---
  // Un solo sorteo por partido reparte estas bandas (mutuamente excluyentes): a
  // lo sumo hay una lesión por encuentro. El lesionado se retira en el acto y un
  // suplente ocupa su puesto el resto del partido (recalcula ratings y química).
  // INJURY_BAN = partidos que se pierde DESPUÉS (simple = 0: solo sale en este).
  INJURY_PROB: { simple: 0.15, moderada: 0.075, grave: 0.015, muy_grave: 0.005 },
  INJURY_BAN: { simple: 0, moderada: 1, grave: 3, muy_grave: 6 },
  INJURY_TYPE_COUNT: 4, // tipos de lesión por grado (rango del typeIndex guardado)

  // --- Vidas / fin de run ---
  LIVES: 1, // 1 = perder termina la run; 3 = sistema de vidas

  // --- Plantilla de arranque ---
  STARTING_FORMATION: '4-3-3',
  STARTER_SQUAD_SIZE: 16, // 11 titulares + 5 suplentes (STARTER_BENCH)
  // Suplentes iniciales por posición, además del once de la formación.
  STARTER_BENCH: { GK: 1, DEF: 1, MID: 2, FWD: 1 },
  // Sorteo por banda de OVR (cualquier jugador del roster completo).
  // Pesos relativos por banda: < 70 / 70-90 / > 90.
  STARTER_BAND_WEIGHTS: { low: 80, mid: 15, high: 5 },
  PACK_BAND_WEIGHTS: { low: 60, mid: 30, high: 10 },

  // --- Objetos ---
  // Sin topes de acumulación: cada objeto suma entero. El apilamiento lo
  // modera el nerfeo de potencia (ITEM_POWER_SCALE) y el decaimiento por
  // copia repetida (DR_RATE).
  ITEM_POWER_SCALE: 0.5,
  DR_RATE: 0.5,
  DR_BY_STAT: false,
  // Sinergia ítem↔táctica: si el synergyType del ítem coincide con el tipo
  // del dibujo (posesión/presión/contra), su efecto se aplica multiplicado.
  ITEM_SYNERGY_MULT: 1.5,
  // Topes de los efectos de partido (tras nerfeo y decaimiento). Los de
  // puntos de rating actúan en duelos concretos; los de probabilidad, sobre
  // las mecánicas del partido.
  MATCH_BONUS_CAPS: {
    stealChance: 0.25, // prob. de asfixiar la salida rival (presión alta)
    counterBoost: 8, // pts de rating en la definición de contraataques
    setPieceBonus: 8, // pts de rating en córners y tiros libres
    lateDefense: 8, // pts de defensa del minuto 75 en adelante
    comebackBoost: 0.05, // empuje extra por gol de desventaja
    penaltyChance: 1.5, // peso extra de la fase penalti (sobre 1.0 base)
    penaltyConvert: 0.08, // prob. extra de convertir el penalti
  },

  // --- Cartas ---
  ALLOW_DUPLICATE_PLAYERS: false,
  PACK_GUARANTEE_SELECTABLE: true,

  // --- Rivales históricos ---
  // Recalibrado a 70 (antes 72) tras hacer fieles los ratings de equipo:
  // ahora ataque/defensa reflejan a tus jugadores en vez de toparse en 99, lo
  // que bajó ~10 pts el nivel del jugador; este ajuste mantiene la dificultad.
  OPP_BASE_STRENGTH: 70,
  OPP_GROWTH: 1.0,
  OPP_MATCH_WINDOW: 4,
  NO_REPEAT_RIVALS: true,
  // Rampa de arranque: descuento a la fuerza objetivo del rival en los
  // primeros niveles (nivel → puntos). La torre empieza contra rivales más
  // blandos y la dificultad sin capar arranca en el nivel 6. En estos niveles
  // el rival elegido se debilita hasta el objetivo si el pool no tiene
  // equipos tan blandos (ver generateOpponent).
  OPP_EARLY_EASE: { 1: 10, 2: 8, 3: 6, 4: 4, 5: 2 },

  // --- Química ---
  // Sin topes: toda la química construida (pares de línea, enlaces de
  // formación, núcleo nacional) suma entera a los ratings.
  CHEM_NATION: 2, // bonus por par de misma nación en una línea
  CHEM_ERA: 1, // bonus por par de misma época (década exacta) en una línea
  CHEM_ERA_ADJACENT: 0.5, // bonus por par de décadas contiguas (1960↔1970)
  CHEM_CORE: 1, // bonus global por escalón de núcleo nacional (ver computeTeamChem)
  CHEM_TACTIC: 1, // bonus a ataque+medio si tu plantilla encaja con el tipo del dibujo
  CHEM_MANAGER_NATION: 1, // química que aporta cada titular de la nación del DT a su línea
  // Cuánto pesa la química en los ratings que usa la simulación. Los puntos de
  // química que ve el jugador no cambian; solo su efecto sobre el desempeño.
  CHEM_IMPACT: 1.4,

  // --- Director técnico (DT / manager) ---
  // Sobre propio: en el nivel 1 (tras el de jugadores) y luego cada
  // MANAGER_PACK_EVERY niveles (7, 14, 21…). Cada sobre ofrece MANAGER_PACK_SIZE
  // opciones con sesgo por rareza (MANAGER_RARITY_BIAS). El DT aplica modificadores
  // porcentuales a ataque/medio/defensa (sin tocar el portero); si su estilo
  // coincide con el tipo del dibujo, sus modificadores positivos se amplifican
  // (MANAGER_SYNERGY_MULT) y sus costes se anulan, igual que la sinergia de objetos.
  MANAGER_PACK_EVERY: 7,
  MANAGER_PACK_SIZE: 3,
  MANAGER_SYNERGY_MULT: 1.5,

  // --- Recompensas (tamaño de sobre por resultado) ---
  PACK_GOLEADA: 5, // dif >= 5
  PACK_AMPLIA: 4, // dif 3-4
  PACK_AJUSTADA: 3, // dif 1-2
  PACK_EMPATE: 2,
  ITEM_PACK_BASE: 3, // objetos a elegir; +1 en goleada

  // --- Sobre especial de selecciones ---
  // Cada N niveles (5, 10, 15…) el sobre de jugador se reemplaza por uno
  // especial: se sortean selecciones (nación + año) presentes en el roster,
  // se elige una y de ella se lleva cualquier jugador.
  NATION_PACK_EVERY: 5,
  NATION_PACK_TEAMS: 3, // selecciones a elegir en el sobre especial
  NATION_PACK_MIN_PLAYERS: 4, // cartas nuevas mínimas para entrar al sorteo

};

// Fuerza objetivo del rival histórico en un nivel dado. Los primeros niveles
// llevan un descuento (OPP_EARLY_EASE) para que el arranque sea amable.
export function targetStrength(level) {
  const ease = CONFIG.OPP_EARLY_EASE[level] || 0;
  return CONFIG.OPP_BASE_STRENGTH + (level - 1) * CONFIG.OPP_GROWTH - ease;
}

// Alias conservado para consumidores anteriores del motor.
export const targetOVR = targetStrength;

// Sesgo de rareza del sobre de DT según cuántos sobres se han abierto (índice
// 1-based: 1 = primer sobre del nivel 1, 2 = nivel 7, 3 = nivel 14…). El PRIMER
// sobre nunca da leyenda; a partir del segundo, las rarezas altas (épica y, sobre
// todo, leyenda) crecen con cada sobre. Pesos relativos [common, rare, epic, legend].
export function managerRarityBias(packIndex) {
  const n = Math.max(1, Math.floor(packIndex) || 1);
  const common = Math.max(10, 60 - n * 8);
  const rare = 35;
  const epic = 10 + n * 4;
  const legend = n <= 1 ? 0 : (n - 1) * 5;
  return [common, rare, epic, legend];
}

// Sesgo de rareza en los sobres según el resultado del partido.
// Pesos relativos [common, rare, epic, legend].
export const RARITY_BIAS = {
  goleada: [10, 30, 38, 22],
  amplia: [20, 38, 30, 12],
  ajustada: [38, 38, 18, 6],
  empate: [62, 28, 8, 2],
  inicial: [55, 32, 10, 3], // plantilla de arranque y sobres neutros
};

// Definición de formaciones disponibles: jugadores por línea.
// En 4-2-3-1 el "5" de mediocampo son 2 pivotes (MID) + 3 de la línea de creación
// (extremos + mediapunta, rol ENG) por detrás del único delantero.
export const FORMATIONS = {
  '4-3-3': { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  '4-4-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '4-2-3-1': { GK: 1, DEF: 4, MID: 5, FWD: 1 },
  '3-5-2': { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  '5-3-2': { GK: 1, DEF: 5, MID: 3, FWD: 2 },
  '4-3-1-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '3-4-3': { GK: 1, DEF: 3, MID: 4, FWD: 3 },
  '4-2-4': { GK: 1, DEF: 4, MID: 2, FWD: 4 },
  // 3-2-4-1: 3 centrales, y un mediocampo de 6 = 2 mediocentros (MID, corte) +
  // la línea de 4 (ENG): 2 extremos por fuera y 2 enganches por dentro, tras el 9.
  '3-2-4-1': { GK: 1, DEF: 3, MID: 6, FWD: 1 },
};

// Identidad de cada formación: multiplicadores modestos (±2-6%) a los ratings de
// equipo, con su contrapartida. Da trade-off táctico real (5-3-2 defensivo, 3-4-3
// volcado) y hace que apilar una línea cueste/premie, no solo promedie.
export const FORMATION_MODIFIERS = {
  '4-4-2': { attack: 1.0, midfield: 1.0, defense: 1.0 }, // equilibrio puro
  '4-3-3': { attack: 1.04, midfield: 1.0, defense: 0.98 }, // ofensivo
  '3-4-3': { attack: 1.06, midfield: 1.01, defense: 0.94 }, // todo al ataque
  '4-2-3-1': { attack: 1.02, midfield: 1.04, defense: 0.99 }, // posesión con pivotes
  '3-5-2': { attack: 0.99, midfield: 1.05, defense: 0.98 }, // control de medio
  '5-3-2': { attack: 0.95, midfield: 0.99, defense: 1.06 }, // defensivo
  '4-3-1-2': { attack: 1.02, midfield: 1.04, defense: 0.97 }, // creativo (enganche)
  '4-2-4': { attack: 1.08, midfield: 0.93, defense: 0.98 }, // ataque total, medio puenteado
  '3-2-4-1': { attack: 1.04, midfield: 1.05, defense: 0.94 }, // presión: medio poblado, zaga de 3
};

// Tipo/identidad de juego que proyecta cada dibujo. Se usa para la cohesión de
// química (jugadores que encajan con el estilo) y como etiqueta informativa en la
// UI. NO crea ventajas/desventajas respecto al rival: cada táctica vale por sus
// propios trade-offs (FORMATION_MODIFIERS).
export const FORMATION_TYPE = {
  '3-5-2': 'posesion', '4-3-1-2': 'posesion', '4-2-3-1': 'posesion',
  '4-3-3': 'presion', '3-4-3': 'presion', '3-2-4-1': 'presion',
  '5-3-2': 'contra', '4-4-2': 'contra', '4-2-4': 'contra',
};

// Devuelve el tipo táctico de un dibujo, o null si no tiene identidad conocida.
export function formationType(formation) {
  return FORMATION_TYPE[formation] || null;
}

export const LINES = ['GK', 'DEF', 'MID', 'FWD'];
export const RARITIES = ['common', 'rare', 'epic', 'legend'];
// Estilos de juego de un DT (coinciden con los valores de FORMATION_TYPE).
export const MANAGER_STYLES = ['posesion', 'presion', 'contra'];

// Perfil táctico de cada hueco (por formación → línea → slotIndex). No cambia
// qué posiciones acepta el hueco (eso es FORMATION_SLOT_RULES), solo cómo
// puntúa el jugador que lo ocupa:
//  DEF: 'central' (corte/físico) | 'lateral' (recorrido: pace/pase, proyección)
//  MID: 'pivote' (corte+físico, salida) | 'mixto' (box-to-box) |
//       'interior' (pase/regate, llegada) | 'banda' (regate/pace)
//  ENG: 'mediapunta' (pase/remate) | 'extremo' (regate/pace)
//  FWD: 'nueve' (remate, referencia del tridente) | 'extremo' (regate/pace) |
//       'delantero' (punta genérico en duplas o solo)
// El orden sigue los slots de izquierda a derecha tal como los pinta la UI.
export const SLOT_PROFILES = {
  '4-3-3': {
    DEF: ['lateral', 'central', 'central', 'lateral'],
    MID: ['interior', 'pivote', 'interior'],
    FWD: ['extremo', 'nueve', 'extremo'],
  },
  '4-4-2': {
    DEF: ['lateral', 'central', 'central', 'lateral'],
    MID: ['banda', 'mixto', 'mixto', 'banda'],
    FWD: ['delantero', 'delantero'],
  },
  '4-2-3-1': {
    DEF: ['lateral', 'central', 'central', 'lateral'],
    MID: ['pivote', 'pivote', 'extremo', 'mediapunta', 'extremo'],
    FWD: ['delantero'],
  },
  '3-5-2': {
    DEF: ['central', 'central', 'central'],
    MID: ['banda', 'interior', 'pivote', 'interior', 'banda'],
    FWD: ['delantero', 'delantero'],
  },
  '5-3-2': {
    DEF: ['lateral', 'central', 'central', 'central', 'lateral'],
    MID: ['mixto', 'pivote', 'mixto'],
    FWD: ['delantero', 'delantero'],
  },
  '4-3-1-2': {
    DEF: ['lateral', 'central', 'central', 'lateral'],
    MID: ['mixto', 'pivote', 'mixto', 'mediapunta'],
    FWD: ['delantero', 'delantero'],
  },
  '3-4-3': {
    DEF: ['central', 'central', 'central'],
    MID: ['banda', 'mixto', 'mixto', 'banda'],
    FWD: ['extremo', 'nueve', 'extremo'],
  },
  '4-2-4': {
    DEF: ['lateral', 'central', 'central', 'lateral'],
    MID: ['pivote', 'pivote'],
    FWD: ['extremo', 'delantero', 'delantero', 'extremo'],
  },
  '3-2-4-1': {
    DEF: ['central', 'central', 'central'],
    // 0-1 = mediocentros de corte; 2-5 = línea de 4 (extremo · enganche ·
    // enganche · extremo) por delante, todos puntúan como ENG.
    MID: ['pivote', 'pivote', 'extremo', 'mediapunta', 'mediapunta', 'extremo'],
    FWD: ['delantero'],
  },
};

// Perfil por defecto cuando la formación no define uno para el hueco.
const DEFAULT_PROFILE = { GK: 'gk', DEF: 'central', MID: 'mixto', FWD: 'delantero' };

export function slotProfile(formation, line, slotIndex, role = line) {
  const fromMap = SLOT_PROFILES[formation]?.[line]?.[slotIndex];
  if (fromMap) return fromMap;
  if (role === 'ENG') return 'mediapunta';
  return DEFAULT_PROFILE[line] || 'mixto';
}

// Reglas de slot por formación. `accepts` define qué posiciones admite el hueco;
// `role` cómo puntúa ese hueco (ENG = híbrido medio/ataque).
// Los EXTREMOS (huecos anchos de la línea de ataque) admiten delanteros o medios.
export const FORMATION_SLOT_RULES = {
  '4-3-3': {
    FWD: {
      0: { accepts: ['FWD', 'MID'], role: 'FWD' }, // extremo izquierdo
      2: { accepts: ['FWD', 'MID'], role: 'FWD' }, // extremo derecho
    },
  },
  '3-4-3': {
    FWD: {
      0: { accepts: ['FWD', 'MID'], role: 'FWD' },
      2: { accepts: ['FWD', 'MID'], role: 'FWD' },
    },
  },
  '4-2-3-1': {
    MID: {
      // 0-1 = pivotes (MID puro); 2-4 = línea de creación (extremos + mediapunta).
      2: { accepts: ['MID', 'FWD'], role: 'ENG' },
      3: { accepts: ['MID', 'FWD'], role: 'ENG' },
      4: { accepts: ['MID', 'FWD'], role: 'ENG' },
    },
  },
  '4-3-1-2': {
    MID: {
      3: { accepts: ['MID', 'FWD'], role: 'ENG' },
    },
  },
  '4-2-4': {
    FWD: {
      0: { accepts: ['FWD', 'MID'], role: 'FWD' }, // punta izquierda
      3: { accepts: ['FWD', 'MID'], role: 'FWD' }, // punta derecha
    },
  },
  '3-2-4-1': {
    MID: {
      // 0-1 = mediocentros (MID puro). 2-5 = línea ofensiva de 4 (extremos y
      // enganches): admiten medios o delanteros y puntúan como enganche.
      2: { accepts: ['MID', 'FWD'], role: 'ENG' },
      3: { accepts: ['MID', 'FWD'], role: 'ENG' },
      4: { accepts: ['MID', 'FWD'], role: 'ENG' },
      5: { accepts: ['MID', 'FWD'], role: 'ENG' },
    },
  },
};

// Web de química "estilo FIFA": el grafo de cercanía de cada formación. Cada
// arista une dos huecos [línea, slotIndex] (los slotIndex van de izquierda a
// derecha tal como pinta la UI) y declara que esos dos jugadores hacen química
// entre sí — y SOLO entre sí: no hay clique de línea, solo estas vecindades.
// Cada arista reparte su pairChem mitad a la línea de cada extremo, así un
// enlace dentro de una línea vale lo mismo que uno entre líneas.
//
// Regla de autoría (cercanía): misma línea → huecos contiguos; portero → los
// centrales más interiores; entre líneas contiguas → cada jugador con su columna
// y el vecino diagonal inmediato hacia el centro (laterales/carrileros con el
// central y el hombre de banda de delante; extremos con el interior de su lado;
// el 9 y los enganches con los medios cercanos). Nunca se salta una línea entera
// ni se enlazan bandas opuestas.
export const CHEM_LINKS = {
  '4-4-2': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 0], ['MID', 0]], [['DEF', 0], ['MID', 1]], [['DEF', 1], ['MID', 1]],
    [['DEF', 2], ['MID', 2]], [['DEF', 3], ['MID', 2]], [['DEF', 3], ['MID', 3]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]], [['MID', 2], ['MID', 3]],
    [['MID', 0], ['FWD', 0]], [['MID', 1], ['FWD', 0]],
    [['MID', 2], ['FWD', 1]], [['MID', 3], ['FWD', 1]],
    [['FWD', 0], ['FWD', 1]],
  ],
  '4-3-3': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]], [['DEF', 1], ['MID', 1]],
    [['DEF', 2], ['MID', 1]], [['DEF', 2], ['MID', 2]], [['DEF', 3], ['MID', 2]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]],
    [['MID', 0], ['FWD', 0]], [['MID', 0], ['FWD', 1]],
    [['MID', 2], ['FWD', 1]], [['MID', 2], ['FWD', 2]],
    [['FWD', 0], ['FWD', 1]], [['FWD', 1], ['FWD', 2]],
  ],
  '4-2-3-1': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]],
    [['DEF', 2], ['MID', 1]], [['DEF', 3], ['MID', 1]],
    [['MID', 0], ['MID', 1]],
    // pivotes (0,1) → línea de creación (2=extremo izq, 3=mediapunta, 4=extremo der)
    [['MID', 0], ['MID', 2]], [['MID', 0], ['MID', 3]],
    [['MID', 1], ['MID', 3]], [['MID', 1], ['MID', 4]],
    [['MID', 2], ['MID', 3]], [['MID', 3], ['MID', 4]],
    [['MID', 2], ['FWD', 0]], [['MID', 3], ['FWD', 0]], [['MID', 4], ['FWD', 0]],
  ],
  '3-5-2': [
    [['GK', 0], ['DEF', 0]], [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]],
    // MID: 0=carrilero izq, 1=interior, 2=pivote, 3=interior, 4=carrilero der
    [['DEF', 0], ['MID', 0]], [['DEF', 0], ['MID', 1]], [['DEF', 1], ['MID', 1]],
    [['DEF', 1], ['MID', 2]], [['DEF', 1], ['MID', 3]], [['DEF', 2], ['MID', 3]],
    [['DEF', 2], ['MID', 4]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]], [['MID', 2], ['MID', 3]],
    [['MID', 3], ['MID', 4]],
    [['MID', 0], ['FWD', 0]], [['MID', 1], ['FWD', 0]],
    [['MID', 2], ['FWD', 0]], [['MID', 2], ['FWD', 1]],
    [['MID', 3], ['FWD', 1]], [['MID', 4], ['FWD', 1]],
    [['FWD', 0], ['FWD', 1]],
  ],
  '5-3-2': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]], [['GK', 0], ['DEF', 3]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 3], ['DEF', 4]],
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]], [['DEF', 2], ['MID', 1]],
    [['DEF', 3], ['MID', 2]], [['DEF', 4], ['MID', 2]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]],
    [['MID', 0], ['FWD', 0]], [['MID', 1], ['FWD', 0]],
    [['MID', 1], ['FWD', 1]], [['MID', 2], ['FWD', 1]],
    [['FWD', 0], ['FWD', 1]],
  ],
  '4-3-1-2': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]], [['DEF', 1], ['MID', 1]],
    [['DEF', 2], ['MID', 1]], [['DEF', 2], ['MID', 2]], [['DEF', 3], ['MID', 2]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]],
    // 3 = enganche (mediapunta) por delante del triángulo
    [['MID', 0], ['MID', 3]], [['MID', 1], ['MID', 3]], [['MID', 2], ['MID', 3]],
    [['MID', 0], ['FWD', 0]], [['MID', 2], ['FWD', 1]],
    [['MID', 3], ['FWD', 0]], [['MID', 3], ['FWD', 1]],
    [['FWD', 0], ['FWD', 1]],
  ],
  '3-4-3': [
    [['GK', 0], ['DEF', 0]], [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]],
    // MID: 0=banda izq, 1=mixto, 2=mixto, 3=banda der
    [['DEF', 0], ['MID', 0]], [['DEF', 0], ['MID', 1]], [['DEF', 1], ['MID', 1]],
    [['DEF', 1], ['MID', 2]], [['DEF', 2], ['MID', 2]], [['DEF', 2], ['MID', 3]],
    [['MID', 0], ['MID', 1]], [['MID', 1], ['MID', 2]], [['MID', 2], ['MID', 3]],
    [['MID', 0], ['FWD', 0]], [['MID', 1], ['FWD', 0]], [['MID', 1], ['FWD', 1]],
    [['MID', 2], ['FWD', 1]], [['MID', 2], ['FWD', 2]], [['MID', 3], ['FWD', 2]],
    [['FWD', 0], ['FWD', 1]], [['FWD', 1], ['FWD', 2]],
  ],
  '4-2-4': [
    [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]], [['DEF', 2], ['DEF', 3]],
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]],
    [['DEF', 2], ['MID', 1]], [['DEF', 3], ['MID', 1]],
    [['MID', 0], ['MID', 1]],
    // FWD: 0=extremo izq, 1=punta, 2=punta, 3=extremo der
    [['MID', 0], ['FWD', 0]], [['MID', 0], ['FWD', 1]],
    [['MID', 1], ['FWD', 2]], [['MID', 1], ['FWD', 3]],
    [['FWD', 0], ['FWD', 1]], [['FWD', 1], ['FWD', 2]], [['FWD', 2], ['FWD', 3]],
  ],
  '3-2-4-1': [
    [['GK', 0], ['DEF', 0]], [['GK', 0], ['DEF', 1]], [['GK', 0], ['DEF', 2]],
    [['DEF', 0], ['DEF', 1]], [['DEF', 1], ['DEF', 2]],
    // MID: 0,1 = mediocentros; 2=extremo izq, 3,4=enganches, 5=extremo der
    [['DEF', 0], ['MID', 0]], [['DEF', 1], ['MID', 0]],
    [['DEF', 1], ['MID', 1]], [['DEF', 2], ['MID', 1]],
    [['MID', 0], ['MID', 1]],
    [['MID', 0], ['MID', 2]], [['MID', 0], ['MID', 3]],
    [['MID', 1], ['MID', 4]], [['MID', 1], ['MID', 5]],
    [['MID', 2], ['MID', 3]], [['MID', 3], ['MID', 4]], [['MID', 4], ['MID', 5]],
    [['MID', 3], ['FWD', 0]], [['MID', 4], ['FWD', 0]],
  ],
};

// Aristas del web de química de una formación: lista de pares [[línea, slot], [línea, slot]].
export function chemLinks(formation) {
  return CHEM_LINKS[formation] || [];
}

export function formationLineSlots(formation, line) {
  const shape = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const count = shape[line] || 0;
  const rules = FORMATION_SLOT_RULES[formation]?.[line] || {};
  return Array.from({ length: count }, (_, slotIndex) => {
    const rule = rules[slotIndex] || {};
    const role = rule.role || line;
    return {
      line,
      slotIndex,
      accepts: rule.accepts || [line],
      role,
      profile: slotProfile(formation, line, slotIndex, role),
    };
  });
}

export function slotAcceptsPosition(formation, line, slotIndex, position) {
  const slot = formationLineSlots(formation, line)[slotIndex];
  return Boolean(slot && slot.accepts.includes(position));
}
