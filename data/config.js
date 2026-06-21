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

  // Rasgo "Roto": jugador propenso a lesiones (ver engine/traits.js). Cada
  // jugador "Roto" tira su PROPIA lesión, independiente de la genérica del
  // partido:
  //  · FIELD_PROB: si es titular (en el campo), prob. de lesionarse durante el
  //    partido, a un minuto al azar.
  //  · WARMUP_PROB: si está en el banquillo, prob. de romperse en el
  //    calentamiento, sin haber jugado (figura entre los lesionados, minuto 0).
  // La gravedad se reparte como una lesión normal y, si deja baja, arrastra la
  // sanción al próximo partido.
  INJURY_ROTO_FIELD_PROB: 0.30,
  INJURY_ROTO_WARMUP_PROB: 0.15,

  // Inmunidad por línea: número mínimo de jugadores DISPONIBLES por posición en
  // toda la plantilla. Cuando una línea cae a su mínimo, sus jugadores quedan
  // inmunes a lesiones y expulsiones hasta que vuelva a haber más (así nunca te
  // quedas sin poder cubrir el dibujo). La partida arranca con 2 porteros.
  IMMUNITY_MIN: { GK: 1, DEF: 3, MID: 4, FWD: 2 },

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
  // Regla no escrita: la plantilla de arranque trae como mucho 2 leyendas (un
  // jugador arrastrado de la run anterior cuenta para este tope).
  STARTER_MAX_LEGENDS: 2,
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
  // Dificultad plana de arranque: los niveles 1..OPP_FLAT_LEVELS comparten la
  // fuerza objetivo del nivel 1 (OPP_BASE_STRENGTH) y, a partir de ahí, sube
  // OPP_GROWTH por nivel. 60 es el equivalente al antiguo nivel 1 (70 − 10 de
  // descuento de la rampa); ahora ataque/defensa reflejan a tus jugadores.
  OPP_BASE_STRENGTH: 60,
  OPP_GROWTH: 1.0,
  OPP_MATCH_WINDOW: 4,
  NO_REPEAT_RIVALS: true,
  // Niveles iniciales con la dificultad del nivel 1: 1..5 comparten la fuerza
  // objetivo plana; desde el 6 la dificultad sube OPP_GROWTH por nivel. En estos
  // niveles el rival elegido se debilita hasta el objetivo si el pool no tiene
  // equipos tan blandos (ver generateOpponent).
  OPP_FLAT_LEVELS: 5,

  // --- Química ---
  // Sin topes: toda la química construida (pares de línea, enlaces de
  // formación, núcleo nacional) suma entera a los ratings.
  CHEM_NATION: 2, // bonus por par de misma nación en una línea
  CHEM_ERA: 1, // bonus por par de misma época (década exacta) en una línea
  CHEM_ERA_ADJACENT: 0.5, // bonus por par de décadas contiguas (1960↔1970)
  CHEM_CORE: 1, // bonus global por escalón de núcleo nacional (ver computeTeamChem)
  CHEM_TACTIC: 1, // bonus a ataque+medio si tu plantilla encaja con el tipo del dibujo
  CHEM_MANAGER_NATION: 1, // química que aporta cada titular de la nación del DT a su línea
  // Bonus directo a TODAS las stats de cada jugador de la nacionalidad del DT
  // activo (sin tope: puede pasar de 99). Entra en los ratings de la simulación,
  // en el OVR y se pinta de otro color en la carta.
  MANAGER_NATION_STAT_BONUS: 3,
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

  // --- Item "Representante corrupto" (rareza Corrupto/Shiny) ---
  // El item se ofrece GARANTIZADO cada CORRUPTO_ITEM_EVERY niveles (14, 28…).
  // Al elegirlo entra un jugador Corrupto que, mientras esté en plantilla, puede
  // lesionar compañeros: una tirada de entrenamiento y otra de partido, cada una
  // con su probabilidad, hasta un máximo de víctimas por encuentro. Tras
  // CORRUPTO_SELL_MATCHES avances de nivel (victoria o empate) se vende y abre el
  // sobre Shiny. Los Shiny suman CORRUPTO_SHINY_BOOST a todas las stats.
  CORRUPTO_ITEM_EVERY: 14,
  CORRUPTO_INJURE_TRAIN: 0.30,
  CORRUPTO_INJURE_MATCH: 0.30,
  CORRUPTO_MAX_VICTIMS: 2,
  CORRUPTO_SELL_MATCHES: 7,
  CORRUPTO_SHINY_BOOST: 10,
  // Naciones del sobre Shiny: el mejor jugador no poseído de cada una.
  SHINY_NATIONS: ['Argentina', 'Brasil', 'España', 'Italia', 'Alemania', 'Uruguay', 'Portugal', 'Francia'],

};

// Fuerza objetivo del rival histórico en un nivel dado. La dificultad es plana
// (la del nivel 1) hasta OPP_FLAT_LEVELS inclusive y sube OPP_GROWTH por nivel
// a partir de ahí (nivel 6 → +1, nivel 7 → +2…).
export function targetStrength(level) {
  const over = Math.max(0, level - CONFIG.OPP_FLAT_LEVELS);
  return CONFIG.OPP_BASE_STRENGTH + over * CONFIG.OPP_GROWTH;
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

// === Grid táctico fijo (1-5-5-5-5) ===
// El tablero es un grid fijo: portero + 4 filas de campo (DEF, MED, ENG, DEL),
// cada una con 5 columnas. Las columnas 1,2,3 son "central" y 0,4 "lateral". Las
// filas MED y ENG comparten la línea MID del motor (ENG con rol propio, alimenta
// medio+ataque); DEL es la línea FWD. Capacidad por línea del motor: MID alberga
// MED (slot 0-4) + ENG (slot 5-9).
export const GRID_COLS = 5;
export const LINE_CAPACITY = { GK: 1, DEF: 5, MID: 2 * GRID_COLS, FWD: 5 };
// Filas del grid de abajo arriba (POR pegado a su área, DEL arriba).
export const GRID_ROWS = ['POR', 'DEF', 'MED', 'ENG', 'DEL'];

// Columnas ocupadas y centradas para N jugadores en una fila de 5 (1→centro,
// 2→[1,3], 3→[1,2,3], 4→[0,1,3,4], 5→todas). Lo usan las plantillas y el reparto
// del once rival (sin grid) para colocar simétricamente a sus jugadores.
export function centeredCols(n) {
  switch (n) {
    case 0: return [];
    case 1: return [2];
    case 2: return [1, 3];
    case 3: return [1, 2, 3];
    case 4: return [0, 1, 3, 4];
    default: return [0, 1, 2, 3, 4];
  }
}

// Plantillas: para cada formación clásica, qué columnas ocupa cada fila del grid.
// Rellenan el once de arranque; luego se mueve libremente. Conteos coherentes con
// FORMATIONS (la línea MID del motor = MED + ENG).
export const FORMATION_TEMPLATES = {
  '4-3-3':   { DEF: [0, 1, 3, 4],    MED: [1, 2, 3],       ENG: [],           DEL: [0, 2, 4] },
  '4-4-2':   { DEF: [0, 1, 3, 4],    MED: [0, 1, 3, 4],    ENG: [],           DEL: [1, 3] },
  '4-2-3-1': { DEF: [0, 1, 3, 4],    MED: [1, 3],          ENG: [0, 2, 4],    DEL: [2] },
  '3-5-2':   { DEF: [1, 2, 3],       MED: [0, 1, 2, 3, 4], ENG: [],           DEL: [1, 3] },
  '5-3-2':   { DEF: [0, 1, 2, 3, 4], MED: [1, 2, 3],       ENG: [],           DEL: [1, 3] },
  '4-3-1-2': { DEF: [0, 1, 3, 4],    MED: [1, 2, 3],       ENG: [2],          DEL: [1, 3] },
  '3-4-3':   { DEF: [1, 2, 3],       MED: [0, 1, 3, 4],    ENG: [],           DEL: [0, 2, 4] },
  '4-2-4':   { DEF: [0, 1, 3, 4],    MED: [1, 3],          ENG: [],           DEL: [0, 1, 3, 4] },
  '3-2-4-1': { DEF: [1, 2, 3],       MED: [1, 3],          ENG: [0, 1, 3, 4], DEL: [2] },
};

// Celdas de una plantilla como huecos del motor { line, slotIndex } (ENG→MID+5).
export function templateSlots(formation) {
  const tmpl = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];
  const cells = [{ line: 'GK', slotIndex: 0 }];
  for (const col of tmpl.DEF) cells.push({ line: 'DEF', slotIndex: col });
  for (const col of tmpl.MED) cells.push({ line: 'MID', slotIndex: col });
  for (const col of tmpl.ENG) cells.push({ line: 'MID', slotIndex: col + GRID_COLS });
  for (const col of tmpl.DEL) cells.push({ line: 'FWD', slotIndex: col });
  return cells;
}

// Etiqueta de la formación cuando el grid no coincide con NINGUNA plantilla (se ha
// deformado moviendo jugadores) o está incompleto. Valor interno (se guarda en el
// estado y en el snapshot del ranking); la UI lo localiza para mostrarlo.
export const CUSTOM_FORMATION = 'Personalizada';

// Detecta qué plantilla coincide EXACTAMENTE con los huecos ocupados del grid
// (mismo conjunto de celdas line:slotIndex), o CUSTOM_FORMATION si no hay match.
export function detectFormation(starting11) {
  const occupied = new Set();
  for (const line of LINES) {
    (starting11[line] || []).forEach((p, i) => { if (p) occupied.add(`${line}:${i}`); });
  }
  for (const name of Object.keys(FORMATION_TEMPLATES)) {
    const cells = templateSlots(name);
    if (cells.length !== occupied.size) continue;
    if (cells.every((c) => occupied.has(`${c.line}:${c.slotIndex}`))) return name;
  }
  return CUSTOM_FORMATION;
}

// Los modificadores de formación (±2-6% a ataque/medio/defensa) se ELIMINARON:
// con colocación libre en el grid, el trade-off táctico emerge de dónde colocas a
// tus jugadores (5 defensas = más defensa de forma natural), sin multiplicadores.

// Tipo/identidad de juego que proyecta cada dibujo. Hoy NO gobierna el estilo del
// equipo del jugador (eso lo elige el usuario, ver state.style): se usa solo como
// (a) estilo por defecto sugerido al aplicar una plantilla y (b) estilo de los
// rivales históricos (que no tienen selector). Alimenta las sinergias de química,
// objetos y DT a través de team.style.
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
// Rarezas ESPECIALES fuera de banda: NO entran en RARITIES (ese array de 4
// indexa los vectores de sesgo RARITY_BIAS/managerRarityBias y rollRarity, así
// que ampliarlo rompería los sorteos). Solo afectan al render de carta, a la
// exclusión de los sobres normales, al editor admin y a la mecánica especial.
//  · corrupto: jugador parásito que entrega el item "Representante corrupto"
//    (lo crea el usuario desde el editor; sellado en el once, sin química,
//    inmune a lesiones/rojas y capaz de lesionar compañeros).
//  · shiny: jugador modificado (+10 a todas las stats) del sobre de recompensa.
export const SPECIAL_RARITIES = ['corrupto', 'shiny'];
// Lista completa para validación del editor admin y referencias de estilo.
export const PLAYER_RARITIES = [...RARITIES, ...SPECIAL_RARITIES];
export const isCorrupto = (p) => p?.rarity === 'corrupto';
export const isShiny = (p) => p?.rarity === 'shiny';
export const isSpecialRarity = (p) => isCorrupto(p) || isShiny(p);
// Estilos de juego de un DT (coinciden con los valores de FORMATION_TYPE).
export const MANAGER_STYLES = ['posesion', 'presion', 'contra'];

// Fila del grid (POR/DEF/MED/ENG/DEL) que corresponde a un hueco del motor.
function gridRowFor(line, slotIndex) {
  if (line === 'GK') return 'POR';
  if (line === 'DEF') return 'DEF';
  if (line === 'FWD') return 'DEL';
  return slotIndex >= GRID_COLS ? 'ENG' : 'MED'; // MID: 0-4 = MED, 5-9 = ENG
}
// Columna (0-4) del hueco dentro de su fila del grid (el portero va centrado).
function slotColFor(line, slotIndex) {
  if (line === 'GK') return 2;
  if (line === 'MID') return slotIndex % GRID_COLS;
  return slotIndex;
}
// Qué posiciones admite cada hueco del grid (colocación restringida por posición
// natural):
//  · POR → solo portero.
//  · DEF → solo defensa (y un defensa también puede subir a los 2 MED laterales).
//  · MED central (col 1,2,3) → solo medio; MED lateral (col 0,4) → medio o defensa.
//  · ENG → medio o delantero (rol creativo).
//  · DEL → solo delantero (el medio ya NO puede subir al ataque).
// Resumen por posición del jugador: MID → MED + ENG; FWD → DEL + ENG; DEF → 5 DEF
// + 2 MED laterales; GK → POR.
function gridAccepts(gridRow, col) {
  switch (gridRow) {
    case 'POR': return ['GK'];
    case 'DEF': return ['DEF'];
    case 'MED': return (col === 0 || col === 4) ? ['MID', 'DEF'] : ['MID'];
    case 'ENG': return ['MID', 'FWD'];
    case 'DEL': return ['FWD'];
    default: return [];
  }
}

// Perfil de puntuación de un hueco, uniforme en todo el grid: fila × columna
// (central col 1-3 / lateral col 0,4). Reemplaza a los perfiles por formación.
//  def_central: defensa+pase   · def_lateral: defensa/pase/regate/físico
//  med_central: defensa/pase/regate/físico · med_lateral: regate/pase/físico/defensa
//  eng_central: pase/remate/regate · eng_lateral: pase/regate/ritmo/remate
//  del_central: remate/físico   · del_lateral: regate/ritmo/remate/pase
export function slotProfile(formation, line, slotIndex) {
  const gridRow = gridRowFor(line, slotIndex);
  if (gridRow === 'POR') return 'gk';
  const col = slotColFor(line, slotIndex);
  const zone = (col === 0 || col === 4) ? 'lateral' : 'central';
  const prefix = { DEF: 'def', MED: 'med', ENG: 'eng', DEL: 'del' }[gridRow];
  return `${prefix}_${zone}`;
}

// Huecos del grid para una línea del motor (formation se ignora: grid fijo de
// 1-5-5-5-5). Cada hueco lleva su fila/columna del grid, qué acepta, su rol de
// puntuación (ENG = fila de enganches dentro de MID) y su perfil central/lateral.
export function formationLineSlots(formation, line) {
  const cap = LINE_CAPACITY[line] || 0;
  return Array.from({ length: cap }, (_, slotIndex) => {
    const gridRow = gridRowFor(line, slotIndex);
    const col = slotColFor(line, slotIndex);
    return {
      line,
      slotIndex,
      gridRow,
      col,
      accepts: gridAccepts(gridRow, col),
      role: gridRow === 'ENG' ? 'ENG' : line,
      profile: slotProfile(formation, line, slotIndex),
    };
  });
}

// === Química de cercanía: web geométrico ===
// El grafo de cercanía se calcula desde los huecos OCUPADOS del grid (ya no hay
// tabla por formación). Reglas: misma fila → vecinos ocupados contiguos por
// columna; entre filas ocupadas contiguas → el/los más cercanos por columna (sin
// enlazar bandas opuestas, |Δcol| < 3); el portero con los DEF ocupados más
// centrales; las filas vacías se ignoran (no se salta contenido). Devuelve aristas
// [[line, slotIndex], [line, slotIndex]] en huecos del motor, listas para
// computeChemistry y para dibujar el web del campo. Una sola fuente para cálculo
// y dibujo: así los números y las líneas pintadas siempre coinciden.
export function geometricLinks(starting11) {
  const rows = { POR: [], DEF: [], MED: [], ENG: [], DEL: [] };
  const occupant = (line, slotIndex) => {
    const arr = starting11 && starting11[line];
    return arr && arr[slotIndex] ? arr[slotIndex] : null;
  };
  if (occupant('GK', 0)) rows.POR.push({ col: 2, line: 'GK', slotIndex: 0 });
  for (let c = 0; c < GRID_COLS; c++) {
    if (occupant('DEF', c)) rows.DEF.push({ col: c, line: 'DEF', slotIndex: c });
    if (occupant('MID', c)) rows.MED.push({ col: c, line: 'MID', slotIndex: c });
    if (occupant('MID', c + GRID_COLS)) rows.ENG.push({ col: c, line: 'MID', slotIndex: c + GRID_COLS });
    if (occupant('FWD', c)) rows.DEL.push({ col: c, line: 'FWD', slotIndex: c });
  }
  const order = ['POR', 'DEF', 'MED', 'ENG', 'DEL'];
  const links = [];
  const seen = new Set();
  const ref = (slot) => [slot.line, slot.slotIndex];
  const addLink = (a, b) => {
    const ka = `${a.line}:${a.slotIndex}`;
    const kb = `${b.line}:${b.slotIndex}`;
    if (ka === kb) return;
    const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push([ref(a), ref(b)]);
  };
  // Horizontal: vecinos ocupados contiguos dentro de cada fila.
  for (const name of order) {
    const slots = rows[name].slice().sort((a, b) => a.col - b.col);
    for (let i = 1; i < slots.length; i++) addLink(slots[i - 1], slots[i]);
  }
  // Vertical/diagonal: entre filas ocupadas contiguas (las vacías se ignoran).
  // Enlace simétrico al más cercano por columna en ambas direcciones.
  const occupiedRows = order.filter((name) => rows[name].length);
  const connect = (from, to) => {
    let best = Infinity;
    for (const b of to) best = Math.min(best, Math.abs(from.col - b.col));
    if (best >= 3) return; // no enlazar bandas opuestas
    for (const b of to) if (Math.abs(from.col - b.col) === best) addLink(from, b);
  };
  for (let r = 1; r < occupiedRows.length; r++) {
    const lower = rows[occupiedRows[r - 1]];
    const upper = rows[occupiedRows[r]];
    for (const a of lower) connect(a, upper);
    for (const b of upper) connect(b, lower);
  }
  return links;
}

export function slotAcceptsPosition(formation, line, slotIndex, position) {
  const slot = formationLineSlots(formation, line)[slotIndex];
  return Boolean(slot && slot.accepts.includes(position));
}
