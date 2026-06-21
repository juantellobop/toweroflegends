// Torre de Leyendas — Catálogo de objetos (esquema de efectos §4.2).
// effects[].target: 'player' | 'line' | 'team' | 'match' | 'chem' | 'meta'
// effects[].op: 'add' (suma plana) | 'mult' (multiplicador)
// Para 'team', stat es attack/midfield/defense/gk. Para 'match', cualquier
// stat de MATCH_BONUS_CAPS (stealChance, counterBoost, setPieceBonus,
// lateDefense, comebackBoost, penaltyChance, penaltyConvert). 'chem' suma
// química de equipo y 'meta' da cartas extra en los sobres.
// synergyType ('posesion'|'presion'|'contra'): si coincide con el tipo del
// dibujo en uso, el efecto positivo del ítem se aplica ×ITEM_SYNERGY_MULT y
// sus efectos negativos se anulan (la táctica absorbe el coste).
// Las descripciones muestran el valor YA nerfeado (value × ITEM_POWER_SCALE).

export const ITEMS = [
  // ===== Equipamiento =====
  {
    id: 'botas_oro', name: 'Botas de oro', type: 'equipamiento', rarity: 'rare',
    desc: '+2,5 al ataque de la delantera.',
    effects: [
      { target: 'line', line: 'FWD', stat: 'attack', op: 'add', value: 5 },
    ],
  },
  {
    id: 'guantes_magicos', name: 'Guantes mágicos', type: 'equipamiento', rarity: 'rare',
    desc: '+3 al rating de portero.',
    effects: [{ target: 'team', stat: 'gk', op: 'add', value: 6 }],
  },
  {
    id: 'capitania', name: 'Capitanía', type: 'equipamiento', rarity: 'epic',
    desc: '+1,5 a ataque, mediocampo y defensa.',
    effects: [
      { target: 'team', stat: 'attack', op: 'add', value: 3 },
      { target: 'team', stat: 'midfield', op: 'add', value: 3 },
      { target: 'team', stat: 'defense', op: 'add', value: 3 },
    ],
  },
  {
    id: 'brazalete_lider', name: 'Brazalete de líder', type: 'equipamiento', rarity: 'common',
    desc: '+2 al mediocampo.',
    effects: [{ target: 'team', stat: 'midfield', op: 'add', value: 4 }],
  },
  {
    id: 'botines_tacos', name: 'Botines de tacos', type: 'equipamiento', rarity: 'common',
    desc: '+2 a la defensa de la zaga.',
    effects: [{ target: 'line', line: 'DEF', stat: 'defense', op: 'add', value: 4 }],
  },
  {
    id: 'guantes_paradon', name: 'Guantes de paradón', type: 'equipamiento', rarity: 'common',
    desc: '+2 al rating de portero.',
    effects: [{ target: 'team', stat: 'gk', op: 'add', value: 4 }],
  },
  {
    id: 'medias_suerte', name: 'Medias de la suerte', type: 'equipamiento', rarity: 'rare',
    desc: '+1,5 a ataque y mediocampo.',
    effects: [
      { target: 'team', stat: 'attack', op: 'add', value: 3 },
      { target: 'team', stat: 'midfield', op: 'add', value: 3 },
    ],
  },
  {
    id: 'pizarra_mister', name: 'Pizarra del míster', type: 'equipamiento', rarity: 'epic',
    desc: '+1 a los cuatro ratings del equipo.',
    effects: [
      { target: 'team', stat: 'attack', op: 'add', value: 2 },
      { target: 'team', stat: 'midfield', op: 'add', value: 2 },
      { target: 'team', stat: 'defense', op: 'add', value: 2 },
      { target: 'team', stat: 'gk', op: 'add', value: 2 },
    ],
  },

  // ===== Tácticas =====
  {
    id: 'tiki_taka', name: 'Tiki-taka', type: 'tactica', rarity: 'epic', synergyType: 'posesion',
    desc: '+4% mediocampo, −2,5% defensa.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'catenaccio', name: 'Catenaccio', type: 'tactica', rarity: 'epic', synergyType: 'contra',
    desc: '+4% defensa, −2,5% ataque.',
    effects: [
      { target: 'team', stat: 'defense', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'attack', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'presion_alta', name: 'Presión alta', type: 'tactica', rarity: 'rare', synergyType: 'presion',
    desc: '+4% de robo, −1,5% defensa.',
    effects: [
      { target: 'match', stat: 'stealChance', op: 'add', value: 0.08 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'contraataque', name: 'Contraataque letal', type: 'tactica', rarity: 'rare', synergyType: 'contra',
    desc: '+3% al ataque.',
    effects: [{ target: 'team', stat: 'attack', op: 'mult', value: 1.06 }],
  },
  {
    id: 'muralla', name: 'Muralla defensiva', type: 'tactica', rarity: 'common',
    desc: '+2,5 defensa.',
    effects: [{ target: 'team', stat: 'defense', op: 'add', value: 5 }],
  },
  {
    id: 'bloque_bajo', name: 'Bloque bajo', type: 'tactica', rarity: 'common', synergyType: 'contra',
    desc: '+3% defensa, −1,5% mediocampo.',
    effects: [
      { target: 'team', stat: 'defense', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'midfield', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'laterales_profundos', name: 'Laterales profundos', type: 'tactica', rarity: 'rare', synergyType: 'presion',
    desc: '+3% ataque, −1,5% defensa.',
    effects: [
      { target: 'team', stat: 'attack', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'vertigo', name: 'Vértigo', type: 'tactica', rarity: 'rare', synergyType: 'contra',
    desc: '+4% ataque, −2% mediocampo.',
    effects: [
      { target: 'team', stat: 'attack', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'midfield', op: 'mult', value: 0.96 },
    ],
  },
  {
    id: 'juego_posicion', name: 'Juego de posición', type: 'tactica', rarity: 'epic', synergyType: 'posesion',
    desc: '+3% mediocampo, +1,5% ataque.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'attack', op: 'mult', value: 1.03 },
    ],
  },
  {
    id: 'gegenpressing', name: 'Gegenpressing', type: 'tactica', rarity: 'epic', synergyType: 'presion',
    desc: '+6% de robo, −2,5% defensa.',
    effects: [
      { target: 'match', stat: 'stealChance', op: 'add', value: 0.12 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'contragolpe_ensayado', name: 'Contragolpe ensayado', type: 'tactica', rarity: 'rare', synergyType: 'contra',
    desc: '+3 a la definición en contraataques.',
    effects: [{ target: 'match', stat: 'counterBoost', op: 'add', value: 6 }],
  },
  {
    id: 'balon_parado', name: 'Pizarra a balón parado', type: 'tactica', rarity: 'rare',
    desc: '+3 a la definición en córners y tiros libres.',
    effects: [{ target: 'match', stat: 'setPieceBonus', op: 'add', value: 6 }],
  },
  {
    id: 'remontada', name: 'Remontada', type: 'tactica', rarity: 'epic',
    desc: 'Si vas perdiendo, +2% extra de empuje por gol de desventaja.',
    effects: [{ target: 'match', stat: 'comebackBoost', op: 'add', value: 0.04 }],
  },
  {
    id: 'cerrojo_final', name: 'Cerrojo final', type: 'tactica', rarity: 'common',
    desc: '+3 a la defensa del minuto 75 en adelante.',
    effects: [{ target: 'match', stat: 'lateDefense', op: 'add', value: 6 }],
  },
  {
    id: 'pena_maxima', name: 'Pena máxima', type: 'tactica', rarity: 'common',
    desc: 'Provocas más penaltis y los conviertes mejor.',
    effects: [
      { target: 'match', stat: 'penaltyChance', op: 'add', value: 0.8 },
      { target: 'match', stat: 'penaltyConvert', op: 'add', value: 0.06 },
    ],
  },

  // Cartas de trade-off (+stat / −stat) hasta completar 4 por sinergia: con el
  // dibujo a juego el negativo se anula y el positivo se amplifica.
  {
    id: 'falso_nueve', name: 'Falso nueve', type: 'tactica', rarity: 'rare', synergyType: 'posesion',
    desc: '+3% mediocampo, −1,5% ataque.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'attack', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'salida_lavolpiana', name: 'Salida lavolpiana', type: 'tactica', rarity: 'epic', synergyType: 'posesion',
    desc: '+4% ataque, −2,5% defensa.',
    effects: [
      { target: 'team', stat: 'attack', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'dormir_partido', name: 'Dormir el partido', type: 'tactica', rarity: 'common', synergyType: 'posesion',
    desc: '+3% defensa, −1,5% ataque.',
    effects: [
      { target: 'team', stat: 'defense', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'attack', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'marcaje_al_hombre', name: 'Marcaje al hombre', type: 'tactica', rarity: 'epic', synergyType: 'presion',
    desc: '+4% defensa, −2,5% mediocampo.',
    effects: [
      { target: 'team', stat: 'defense', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'midfield', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'linea_adelantada', name: 'Línea adelantada', type: 'tactica', rarity: 'rare', synergyType: 'presion',
    desc: '+3% mediocampo, −1,5% defensa.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'jauria', name: 'Jauría', type: 'tactica', rarity: 'common', synergyType: 'presion',
    desc: '+3% ataque, −1,5% mediocampo.',
    effects: [
      { target: 'team', stat: 'attack', op: 'mult', value: 1.06 },
      { target: 'team', stat: 'midfield', op: 'mult', value: 0.97 },
    ],
  },
  {
    id: 'doble_pivote', name: 'Doble pivote', type: 'tactica', rarity: 'rare', synergyType: 'contra',
    desc: '+4% mediocampo, −2% ataque.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'attack', op: 'mult', value: 0.96 },
    ],
  },

  // ===== Reliquias (pasivas de la run) =====
  {
    id: 'localia', name: 'Localía', type: 'reliquia', rarity: 'legend',
    desc: '+2,5% a todos los ratings de equipo.',
    effects: [
      { target: 'team', stat: 'attack', op: 'mult', value: 1.05 },
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.05 },
      { target: 'team', stat: 'defense', op: 'mult', value: 1.05 },
      { target: 'team', stat: 'gk', op: 'mult', value: 1.05 },
    ],
  },
  {
    id: 'ojeador_estrella', name: 'Ojeador estrella', type: 'reliquia', rarity: 'epic',
    desc: '+1 carta a elegir en cada sobre de jugadores.',
    effects: [{ target: 'meta', stat: 'extraPlayerCard', op: 'add', value: 1 }],
  },
  {
    id: 'director_deportivo', name: 'Director deportivo', type: 'reliquia', rarity: 'rare',
    desc: '+1 objeto a elegir en cada sobre.',
    effects: [{ target: 'meta', stat: 'extraItemCard', op: 'add', value: 1 }],
  },
  {
    id: 'banquillo_lujo', name: 'Banquillo de lujo', type: 'reliquia', rarity: 'legend',
    desc: '+1 carta a elegir en los sobres de jugadores, objetos y directores técnicos.',
    effects: [
      { target: 'meta', stat: 'extraPlayerCard', op: 'add', value: 1 },
      { target: 'meta', stat: 'extraItemCard', op: 'add', value: 1 },
      { target: 'meta', stat: 'extraManagerCard', op: 'add', value: 1 },
    ],
  },
  {
    id: 'carrusel_banquillos', name: 'Carrusel de banquillos', type: 'reliquia', rarity: 'epic',
    desc: '+1 director técnico a elegir en cada sobre de entrenadores.',
    effects: [{ target: 'meta', stat: 'extraManagerCard', op: 'add', value: 1 }],
  },
  {
    id: 'duodecimo_jugador', name: 'Duodécimo jugador', type: 'reliquia', rarity: 'legend',
    desc: '+2 de química de equipo: la grada empuja.',
    effects: [{ target: 'chem', stat: 'teamAll', op: 'add', value: 2 }],
  },

  // ===== Especial: disparador de flujo (no es una reliquia pasiva) =====
  // `special: 'corrupto'` marca que, al elegirlo, NO se añade al inventario sino
  // que abre el sobre Corrupto (ver state/run.js y main.js). `effects: []` → no
  // toca ratings. Se ofrece garantizado cada CORRUPTO_ITEM_EVERY niveles y queda
  // FUERA del pool aleatorio de objetos (filtrado por `special` en rollItemPack).
  {
    id: 'representante_corrupto', name: 'Representante corrupto', type: 'reliquia',
    rarity: 'legend', special: 'corrupto',
    desc: 'Un jugador utilizará tu equipo como trampolín. Asegúrate de que sea vendido, su representante te recompensará.',
    effects: [],
  },
];
