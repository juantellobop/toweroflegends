// Torre de Leyendas — Catálogo de objetos (esquema de efectos §4.2).
// effects[].target: 'player' | 'line' | 'team' | 'match'
// effects[].op: 'add' (suma plana) | 'mult' (multiplicador)
// Para 'team'/'match', stat puede ser attack/midfield/defense/gk o stealChance.

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

  // ===== Tácticas =====
  {
    id: 'tiki_taka', name: 'Tiki-taka', type: 'tactica', rarity: 'epic',
    desc: '+4% mediocampo, −2,5% defensa.',
    effects: [
      { target: 'team', stat: 'midfield', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'defense', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'catenaccio', name: 'Catenaccio', type: 'tactica', rarity: 'epic',
    desc: '+4% defensa, −2,5% ataque.',
    effects: [
      { target: 'team', stat: 'defense', op: 'mult', value: 1.08 },
      { target: 'team', stat: 'attack', op: 'mult', value: 0.95 },
    ],
  },
  {
    id: 'presion_alta', name: 'Presión alta', type: 'tactica', rarity: 'rare',
    desc: '+6% de robo: el rival pierde más balones.',
    effects: [{ target: 'match', stat: 'stealChance', op: 'add', value: 0.12 }],
  },
  {
    id: 'contraataque', name: 'Contraataque letal', type: 'tactica', rarity: 'rare',
    desc: '+3% al ataque.',
    effects: [{ target: 'team', stat: 'attack', op: 'mult', value: 1.06 }],
  },
  {
    id: 'muralla', name: 'Muralla defensiva', type: 'tactica', rarity: 'common',
    desc: '+2,5 defensa.',
    effects: [{ target: 'team', stat: 'defense', op: 'add', value: 5 }],
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
];
