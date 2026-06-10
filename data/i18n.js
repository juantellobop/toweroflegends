const STORAGE_KEY = 'tdl_language';
const DEFAULT_LANGUAGE = 'es';

export const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
];

const LANGUAGE_CODES = new Set(LANGUAGES.map((language) => language.code));

const COMMON_NATIONS = {
  es: {
    Alemania: 'Alemania',
    'Alemania Occidental': 'Alemania Occidental',
    Argentina: 'Argentina',
    Brasil: 'Brasil',
    Bulgaria: 'Bulgaria',
    Bélgica: 'Bélgica',
    Camerún: 'Camerún',
    Checoslovaquia: 'Checoslovaquia',
    Colombia: 'Colombia',
    'Corea del Sur': 'Corea del Sur',
    'Costa Rica': 'Costa Rica',
    Croacia: 'Croacia',
    Dinamarca: 'Dinamarca',
    España: 'España',
    'Estados Unidos': 'Estados Unidos',
    Francia: 'Francia',
    Ghana: 'Ghana',
    Inglaterra: 'Inglaterra',
    Irlanda: 'Irlanda',
    Italia: 'Italia',
    Liberia: 'Liberia',
    Marruecos: 'Marruecos',
    México: 'México',
    Paraguay: 'Paraguay',
    'Países Bajos': 'Países Bajos',
    Portugal: 'Portugal',
    Rumanía: 'Rumanía',
    Rusia: 'Rusia',
    Senegal: 'Senegal',
    Suecia: 'Suecia',
    Turquía: 'Turquía',
    URSS: 'URSS',
    Ucrania: 'Ucrania',
    Uruguay: 'Uruguay',
    Yugoslavia: 'Yugoslavia',
  },
  en: {
    Alemania: 'Germany',
    'Alemania Occidental': 'West Germany',
    Argentina: 'Argentina',
    Brasil: 'Brazil',
    Bulgaria: 'Bulgaria',
    Bélgica: 'Belgium',
    Camerún: 'Cameroon',
    Checoslovaquia: 'Czechoslovakia',
    Colombia: 'Colombia',
    'Corea del Sur': 'South Korea',
    'Costa Rica': 'Costa Rica',
    Croacia: 'Croatia',
    Dinamarca: 'Denmark',
    España: 'Spain',
    'Estados Unidos': 'United States',
    Francia: 'France',
    Ghana: 'Ghana',
    Inglaterra: 'England',
    Irlanda: 'Ireland',
    Italia: 'Italy',
    Liberia: 'Liberia',
    Marruecos: 'Morocco',
    México: 'Mexico',
    Paraguay: 'Paraguay',
    'Países Bajos': 'Netherlands',
    Portugal: 'Portugal',
    Rumanía: 'Romania',
    Rusia: 'Russia',
    Senegal: 'Senegal',
    Suecia: 'Sweden',
    Turquía: 'Turkey',
    URSS: 'USSR',
    Ucrania: 'Ukraine',
    Uruguay: 'Uruguay',
    Yugoslavia: 'Yugoslavia',
  },
  fr: {
    Alemania: 'Allemagne',
    'Alemania Occidental': 'Allemagne de l’Ouest',
    Argentina: 'Argentine',
    Brasil: 'Brésil',
    Bulgaria: 'Bulgarie',
    Bélgica: 'Belgique',
    Camerún: 'Cameroun',
    Checoslovaquia: 'Tchécoslovaquie',
    Colombia: 'Colombie',
    'Corea del Sur': 'Corée du Sud',
    'Costa Rica': 'Costa Rica',
    Croacia: 'Croatie',
    Dinamarca: 'Danemark',
    España: 'Espagne',
    'Estados Unidos': 'États-Unis',
    Francia: 'France',
    Ghana: 'Ghana',
    Inglaterra: 'Angleterre',
    Irlanda: 'Irlande',
    Italia: 'Italie',
    Liberia: 'Liberia',
    Marruecos: 'Maroc',
    México: 'Mexique',
    Paraguay: 'Paraguay',
    'Países Bajos': 'Pays-Bas',
    Portugal: 'Portugal',
    Rumanía: 'Roumanie',
    Rusia: 'Russie',
    Senegal: 'Sénégal',
    Suecia: 'Suède',
    Turquía: 'Turquie',
    URSS: 'URSS',
    Ucrania: 'Ukraine',
    Uruguay: 'Uruguay',
    Yugoslavia: 'Yougoslavie',
  },
  pt: {
    Alemania: 'Alemanha',
    'Alemania Occidental': 'Alemanha Ocidental',
    Argentina: 'Argentina',
    Brasil: 'Brasil',
    Bulgaria: 'Bulgária',
    Bélgica: 'Bélgica',
    Camerún: 'Camarões',
    Checoslovaquia: 'Tchecoslováquia',
    Colombia: 'Colômbia',
    'Corea del Sur': 'Coreia do Sul',
    'Costa Rica': 'Costa Rica',
    Croacia: 'Croácia',
    Dinamarca: 'Dinamarca',
    España: 'Espanha',
    'Estados Unidos': 'Estados Unidos',
    Francia: 'França',
    Ghana: 'Gana',
    Inglaterra: 'Inglaterra',
    Irlanda: 'Irlanda',
    Italia: 'Itália',
    Liberia: 'Libéria',
    Marruecos: 'Marrocos',
    México: 'México',
    Paraguay: 'Paraguai',
    'Países Bajos': 'Países Baixos',
    Portugal: 'Portugal',
    Rumanía: 'Romênia',
    Rusia: 'Rússia',
    Senegal: 'Senegal',
    Suecia: 'Suécia',
    Turquía: 'Turquia',
    URSS: 'URSS',
    Ucrania: 'Ucrânia',
    Uruguay: 'Uruguai',
    Yugoslavia: 'Iugoslávia',
  },
  it: {
    Alemania: 'Germania',
    'Alemania Occidental': 'Germania Ovest',
    Argentina: 'Argentina',
    Brasil: 'Brasile',
    Bulgaria: 'Bulgaria',
    Bélgica: 'Belgio',
    Camerún: 'Camerun',
    Checoslovaquia: 'Cecoslovacchia',
    Colombia: 'Colombia',
    'Corea del Sur': 'Corea del Sud',
    'Costa Rica': 'Costa Rica',
    Croacia: 'Croazia',
    Dinamarca: 'Danimarca',
    España: 'Spagna',
    'Estados Unidos': 'Stati Uniti',
    Francia: 'Francia',
    Ghana: 'Ghana',
    Inglaterra: 'Inghilterra',
    Irlanda: 'Irlanda',
    Italia: 'Italia',
    Liberia: 'Liberia',
    Marruecos: 'Marocco',
    México: 'Messico',
    Paraguay: 'Paraguay',
    'Países Bajos': 'Paesi Bassi',
    Portugal: 'Portogallo',
    Rumanía: 'Romania',
    Rusia: 'Russia',
    Senegal: 'Senegal',
    Suecia: 'Svezia',
    Turquía: 'Turchia',
    URSS: 'URSS',
    Ucrania: 'Ucraina',
    Uruguay: 'Uruguay',
    Yugoslavia: 'Jugoslavia',
  },
};

const COMMON_ITEMS = {
  es: {
    botas_oro: { name: 'Botas de oro', desc: '+2,5 al ataque de la delantera.' },
    guantes_magicos: { name: 'Guantes mágicos', desc: '+3 al rating de portero.' },
    capitania: { name: 'Capitanía', desc: '+1,5 a ataque, mediocampo y defensa.' },
    brazalete_lider: { name: 'Brazalete de líder', desc: '+2 al mediocampo.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% mediocampo, −2,5% defensa.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% defensa, −2,5% ataque.' },
    presion_alta: { name: 'Presión alta', desc: '+6% de robo: el rival pierde más balones.' },
    contraataque: { name: 'Contraataque letal', desc: '+3% al ataque.' },
    muralla: { name: 'Muralla defensiva', desc: '+2,5 defensa.' },
    localia: { name: 'Localía', desc: '+2,5% a todos los ratings de equipo.' },
  },
  en: {
    botas_oro: { name: 'Golden Boots', desc: '+2.5 to forward-line attack.' },
    guantes_magicos: { name: 'Magic Gloves', desc: '+3 to goalkeeper rating.' },
    capitania: { name: 'Captaincy', desc: '+1.5 to attack, midfield, and defense.' },
    brazalete_lider: { name: 'Leader’s Armband', desc: '+2 to midfield.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% midfield, −2.5% defense.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% defense, −2.5% attack.' },
    presion_alta: { name: 'High Press', desc: '+6% steal rate: the opponent loses more balls.' },
    contraataque: { name: 'Lethal Counterattack', desc: '+3% to attack.' },
    muralla: { name: 'Defensive Wall', desc: '+2.5 defense.' },
    localia: { name: 'Home Advantage', desc: '+2.5% to all team ratings.' },
  },
  fr: {
    botas_oro: { name: 'Crampons d’or', desc: '+2,5 à l’attaque de la ligne offensive.' },
    guantes_magicos: { name: 'Gants magiques', desc: '+3 à la note du gardien.' },
    capitania: { name: 'Capitanat', desc: '+1,5 en attaque, milieu et défense.' },
    brazalete_lider: { name: 'Brassard de leader', desc: '+2 au milieu.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% milieu, −2,5% défense.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% défense, −2,5% attaque.' },
    presion_alta: { name: 'Pressing haut', desc: '+6% de récupération : l’adversaire perd plus de ballons.' },
    contraataque: { name: 'Contre-attaque létale', desc: '+3% en attaque.' },
    muralla: { name: 'Muraille défensive', desc: '+2,5 défense.' },
    localia: { name: 'Avantage du terrain', desc: '+2,5% à toutes les notes d’équipe.' },
  },
  pt: {
    botas_oro: { name: 'Chuteiras de ouro', desc: '+2,5 ao ataque da linha ofensiva.' },
    guantes_magicos: { name: 'Luvas mágicas', desc: '+3 ao rating de goleiro.' },
    capitania: { name: 'Capitania', desc: '+1,5 em ataque, meio-campo e defesa.' },
    brazalete_lider: { name: 'Braçadeira de líder', desc: '+2 ao meio-campo.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% meio-campo, −2,5% defesa.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% defesa, −2,5% ataque.' },
    presion_alta: { name: 'Pressão alta', desc: '+6% de roubo: o rival perde mais bolas.' },
    contraataque: { name: 'Contra-ataque letal', desc: '+3% ao ataque.' },
    muralla: { name: 'Muralha defensiva', desc: '+2,5 defesa.' },
    localia: { name: 'Fator casa', desc: '+2,5% a todos os ratings da equipe.' },
  },
  it: {
    botas_oro: { name: 'Scarpe d’oro', desc: '+2,5 all’attacco della linea offensiva.' },
    guantes_magicos: { name: 'Guanti magici', desc: '+3 al rating del portiere.' },
    capitania: { name: 'Capitanato', desc: '+1,5 ad attacco, centrocampo e difesa.' },
    brazalete_lider: { name: 'Fascia da leader', desc: '+2 al centrocampo.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% centrocampo, −2,5% difesa.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% difesa, −2,5% attacco.' },
    presion_alta: { name: 'Pressing alto', desc: '+6% recuperi: l’avversario perde più palloni.' },
    contraataque: { name: 'Contropiede letale', desc: '+3% all’attacco.' },
    muralla: { name: 'Muraglia difensiva', desc: '+2,5 difesa.' },
    localia: { name: 'Fattore campo', desc: '+2,5% a tutti i rating di squadra.' },
  },
};

const DICTIONARIES = {
  es: {
    meta: {
      title: 'Torre de Leyendas',
      description: 'Roguelike de fútbol: arma tu selección abriendo sobres y escala una torre infinita.',
      footer: 'Torre de Leyendas · Proyecto no oficial / no afiliado · Copa de Leyendas',
    },
    language: { label: 'Idioma' },
    menu: {
      kicker: 'Escala la torre. Cada piso, un rival mas fuerte.',
      teamName: 'Nombre del equipo',
      namePlaceholder: 'Leyendas',
      nameError: 'Usa solo letras y espacios.',
      flag: 'Bandera',
      flagAria: 'Bandera del equipo',
      flagError: 'Elige una bandera para empezar.',
      chooseFlag: 'Elige bandera',
      newRun: 'Nueva run',
      disclaimer: 'Proyecto no oficial y no afiliado. Cartas con datos ficticios; sin marcas registradas.',
    },
    generic: {
      level: ({ level }) => `Nivel ${level}`,
      floor: ({ floor }) => `Piso ${floor}`,
      vs: 'vs',
      close: 'Cerrar',
      choose: 'Elegir',
      players: 'Jugadores',
      items: 'Objetos',
      player: 'jugador',
      item: 'objeto',
      loading: 'Cargando...',
      noData: 'Sin marcas todavía.',
      current: 'Actual',
      final: 'Final',
      local: 'Local',
      opponent: 'Rival',
    },
    pack: {
      playerTitle: 'Sobre de jugador',
      itemTitle: 'Sobre de objeto',
      playerHint: 'Lee posición, atributos, rareza, nación y época. Construye sinergias.',
      itemHint: 'Los objetos modifican a tu equipo. Encaja con tu plan.',
      playerOpen: 'Abrir sobre de jugadores',
      itemOpen: 'Abrir sobre de objetos',
      chooseOne: ({ count, hint }) => `Elige 1 de ${count}. ${hint}`,
      tap: 'Toca para abrir',
    },
    card: {
      owned: 'Ya en tu plantilla',
      itemStack: ({ n }) => `×${n} copias acumuladas`,
      itemStackNote: 'Cada copia extra rinde la mitad',
      rarity: { common: 'Común', rare: 'Rara', epic: 'Épica', legend: 'Leyenda' },
      position: { GK: 'POR', DEF: 'DEF', MID: 'MED', FWD: 'DEL', ENG: 'ENG' },
      line: { GK: 'Portería', DEF: 'Defensa', MID: 'Mediocampo', FWD: 'Ataque', ENG: 'Enganche' },
      stat: { pace: 'RIT', shooting: 'TIR', passing: 'PAS', dribbling: 'REG', defending: 'DEF', physical: 'FÍS', reflexes: 'REF', handling: 'BLO', positioning: 'COL' },
      trait: { Francotirador: 'Francotirador', Cañón: 'Cañón', Muro: 'Muro', Motor: 'Motor', Maestro: 'Maestro', Líbero: 'Líbero', Paradón: 'Paradón' },
      itemType: { equipamiento: 'equipamiento', tactica: 'táctica', reliquia: 'reliquia' },
    },
    build: {
      title: 'Arma tu equipo',
      nextOpponent: 'Próximo rival',
      viewLineup: 'Ver once',
      chemistry: 'Química',
      chemNation: 'Nación',
      chemEra: 'Época',
      fromItems: 'Aporte de objetos',
      tacticalBoard: 'Tablero tactico',
      boardHint: 'Arrastra jugadores al slot correcto o toca para editar.',
      formationAria: 'Formación',
      roster: 'Suplentes',
      rosterCount: ({ total, missing }) => `${total} cartas · ${missing} hueco${missing === 1 ? '' : 's'} libre${missing === 1 ? '' : 's'}`,
      noSubs: 'Sin suplentes disponibles.',
      noItems: 'Sin objetos todavía.',
      activeItems: ({ count }) => `Objetos activos (${count})`,
      play: 'Jugar partido',
      missing: ({ count }) => `Completa el once (${count} faltan)`,
      statsDialog: 'Estadísticas del jugador',
      playerDragAria: ({ name }) => `${name}, arrastrar para mover o tocar para quitar del once`,
      emptyAria: ({ label }) => `Hueco ${label}, añadir jugador`,
      viewStatsAria: ({ name }) => `Ver estadísticas de ${name}`,
      benchAria: ({ name }) => `${name}, arrastrar al campo o tocar para alinear`,
      noCandidates: ({ label }) => `No tienes suplentes compatibles para ${label}. Consíguelos en los sobres.`,
      pickerHead: ({ label }) => `${label} — elige quién entra`,
      targetPickerHead: ({ name }) => `${name} — elige dónde entra`,
      openSlot: 'Hueco libre',
    },
    scouting: {
      report: 'Informe del rival',
      formation: ({ formation }) => `Formación ${formation}`,
      strength: 'Fuerza',
      opponentEleven: 'Once principal del rival',
      note: 'Ratings de juego para la Copa de Leyendas. Once histórico representativo del torneo.',
      continue: 'Armar mi equipo',
    },
    tactics: {
      style: 'Estilo',
    },
    match: {
      plays: ({ count }) => `${count} jugadas`,
      tickerStart: ({ level }) => `Nivel ${level} · Highlights en directo.`,
      playPauseAria: 'Reproducir o pausar',
      speedAria: 'Velocidad',
      nextAria: 'Siguiente highlight',
      skipAria: 'Saltar al final',
      skipFinal: '⏩ Final',
      viewResult: 'Ver resultado',
      continue: 'Continuar',
      modesAria: 'Modo de visualización',
      modes: { full: 'Highlights', key: 'Solo clave', commentary: 'Comentario', instant: 'Instantáneo' },
      anticipation: {
        gol: ({ minute }) => `Min ${minute}' - Ataque peligroso...`,
        parada: ({ minute }) => `Min ${minute}' - Remate a puerta...`,
        shot: ({ minute }) => `Min ${minute}' - Se prepara el disparo...`,
        falta: ({ minute }) => `Min ${minute}' - Contacto en la presion...`,
        default: ({ minute }) => `Min ${minute}' - La jugada se construye...`,
      },
      finalLine: ({ home, homeGoals, awayGoals, away }) => `Final · ${home} ${homeGoals}–${awayGoals} ${away}`,
      finalAnnounce: ({ homeGoals, awayGoals }) => `Final del partido. ${homeGoals} a ${awayGoals}.`,
    },
    result: {
      tier: { goleada: '¡GOLEADA!', amplia: 'Victoria amplia', ajustada: 'Victoria ajustada', empate: 'Empate', derrota: 'Derrota' },
      lostStep: 'Escalón perdido',
      towerFall: 'Caída de la torre',
      retry: 'Reintentar escalón',
      nextLevel: 'Siguiente nivel',
      reward: 'Recompensa',
      lossCopy: ({ lives }) => `Has perdido este escalón. Te queda${lives === 1 ? '' : 'n'} ${lives} vida${lives === 1 ? '' : 's'}.`,
      rewardCopy: ({ players, items }) => `Recompensa lista: sobre de ${players} jugadores y ${items} objetos a elegir.`,
      scorers: 'Goleadores',
      saves: 'Paradas',
      gameOver: 'Fin de la run',
      floorsReached: 'pisos alcanzados',
      newRecord: '★ Nuevo récord',
      best: ({ best }) => `Mejor marca: ${best}`,
      winsRoster: ({ wins, count }) => `${wins} victoria${wins === 1 ? '' : 's'} · plantilla de ${count} jugadores`,
      route: 'Recorrido',
      finalSquad: 'Plantilla final',
      playAgain: 'Jugar de nuevo',
      pathLevel: ({ level }) => `Nv ${level}`,
    },
    leaderboard: {
      floor: ({ floor }) => `Piso ${floor}`,
      updating: 'Actualizando ranking...',
      readOnly: 'Servidor sin escritura: mostrando el ranking guardado.',
      rank: ({ rank }) => `Tu run quedó #${rank}.`,
      notTop: 'No entraste en el top 20.',
      title: 'Ranking',
      top: 'Top 20',
      empty: 'Sin marcas todavía.',
    },
    adminLogin: {
      title: 'Acceso restringido',
      kicker: 'Panel de edición de jugadores.',
      user: 'Usuario',
      password: 'Contraseña',
      submit: 'Entrar',
      back: 'Volver al juego',
      checking: 'Comprobando...',
      genericError: 'No se pudo iniciar sesión.',
      invalidCredentials: 'Usuario o contraseña incorrectos.',
      httpError: ({ status }) => `No se pudo iniciar sesión (HTTP ${status}).`,
      missingToken: 'El servidor no devolvió un token de sesión.',
    },
    admin: {
      back: 'Volver',
      badge: 'Admin',
      title: 'Panel de jugadores',
      logout: 'Cerrar sesión',
      search: 'Buscar',
      searchPlaceholder: 'Nombre, país, época...',
      position: 'Posición',
      all: 'Todas',
      count: ({ visible, total }) => `${visible} de ${total} jugadores · mejor a peor`,
      selected: 'Jugador seleccionado',
      name: 'Nombre',
      nation: 'Nación',
      era: 'Época',
      rarity: 'Rareza',
      ovr: 'OVR calculado',
      trait: 'Rasgo',
      noTrait: 'Sin rasgo',
      tacticalType: 'Tipo táctico',
      noType: 'Sin tipo',
      saveStats: 'Guardar estadísticas',
      portraitAria: 'Editor de imagen de perfil',
      portrait: 'Imagen de perfil',
      toolEffect: 'Efecto tool',
      replaceImage: 'Reemplaza la imagen actual',
      pickImage: 'Arrastra o elige una imagen',
      imageHint: 'Primer plano recomendado',
      converted: 'Convertida',
      savePortrait: 'Guardar imagen al jugador',
      noPlayers: 'No hay jugadores para editar.',
      invalidImage: 'Elige un archivo de imagen válido.',
      converting: 'Convirtiendo con el tool Python...',
      convertedReady: 'Imagen convertida con el tool Python, lista para guardar.',
      convertError: ({ message }) => `No se pudo convertir: ${message}`,
      savingImage: 'Guardando imagen en disco...',
      readFailed: 'lectura fallida',
      expired: 'Sesión caducada. Vuelve a iniciar sesión en el panel.',
      startServer: 'Arranca la app con npm run serve para usar el conversor Python exacto.',
      invalidPortrait: 'El conversor Python no devolvió un retrato válido.',
      saveNeedsServer: 'No se pudo guardar. Arranca la app con `npm run serve` para editar la base de jugadores.',
      saveHttpError: ({ status }) => `No se pudo guardar la base de jugadores (HTTP ${status}).`,
      playerNotFound: ({ id }) => `Jugador no encontrado: ${id}`,
      stat: { pace: 'Ritmo', shooting: 'Tiro', passing: 'Pase', dribbling: 'Regate', defending: 'Defensa', physical: 'Físico', reflexes: 'Reflejos', handling: 'Bloqueo', positioning: 'Colocación' },
      positionOption: { GK: 'Portero', DEF: 'Defensa', MID: 'Mediocampo', FWD: 'Delantero' },
      tactical: { posesion: 'Posesión', presion: 'Presión', contra: 'Contra' },
    },
    narrator: {
      player: 'Jugador',
      phases: { corner: 'desde el córner', free_kick: 'de tiro libre', penalty: 'de penal', counter: 'en transición', default: 'en la jugada' },
      xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} lee la jugada, la defensa se cierra y ${team} pierde el balón.`,
      construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} intenta filtrar pero la defensa de ${defender} achica.`,
      contraataque: ({ m, attacker, shooter }) => `Min ${m}' — ¡Contra de ${attacker} tras recuperar! ${shooter} encara…`,
      pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} intenta cambiar el ritmo, pero el pase demasiado largo se va afuera.`,
      faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} se escapa y ${defender} lo baja. El árbitro va al bolsillo: roja.`,
      falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} busca el desmarque y ${defender} llega tarde. Falta ${kind}.`,
      faltaPeligrosa: 'peligrosa',
      faltaPresion: 'en la presión',
      fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} filtra para ${receiver}, pero la línea defensiva tira el fuera de juego.`,
      despejeCross: ({ m, attacker, defender }) => `Min ${m}' — centro al área de ${attacker}; ${defender} gana por arriba y despeja.`,
      despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} intenta progresar, pero ${defender} recupera y manda lejos el balón.`,
      sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} mejora posiciones, pero ${defender} repliega en bloque y no deja ángulo de disparo.`,
      bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} encuentra una ventana de tiro, pero ${defender} se cruza y bloquea.${xg}`,
      tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} prueba ${phase}, pero el remate se marcha afuera.${xg}`,
      parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ¡${shooter} prueba ${phase} y ${keeper} responde con una gran parada!${xg}`,
      golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} toma carrera desde los once metros… ¡GOOOL de ${team}! (${score})${xg}`,
      golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — tiro libre de ${shooter}, supera la barrera… ¡GOOOL de ${team}! (${score})${xg}`,
      golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — centro de ${passer} y cabezazo de ${shooter}… ¡GOOOL de ${team}! (${score})${xg}`,
      gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} habilita a ${shooter} tras el desmarque… ¡GOOOL de ${team}! (${score})${xg}`,
      default: ({ m }) => `Min ${m}' — jugada.`,
    },
    scene: {
      badge: { penalty: 'PENAL', free_kick: 'TIRO LIBRE', corner: 'CÓRNER', gol: 'GOL', parada: 'ATAJADA', tiro_fuera: 'TIRO FUERA', bloqueo: 'BLOQUEO', roja: 'ROJA', falta: 'FALTA', fuera_juego: 'OFFSIDE', despeje: 'DESPEJE', perdida: 'ROBO', pase_fuera: 'PASE LARGO', default: 'JUGADA' },
      role: { protagonist: 'Protagonista', scorer: 'Goleador', shooter: 'Rematador', assistant: 'Asistente', keeper: 'Portero', defender: 'Defensor', receiver: 'Receptor' },
      title: { midfield_pass: 'Pase en mediocampo', defensive_pass: 'Salida desde atrás', defensive_recovery: 'Recuperación defensiva', shot: 'Remate', cross: 'Centro al área', free_kick: 'Tiro libre', free_kick_goal: 'Gol de tiro libre', penalty: 'Penal', penalty_goal: 'Gol de penal', shot_goal: 'Gol de remate', shot_goal_alt: 'Gol de remate', header_goal: 'Gol de cabeza', yellow_foul: 'Falta y amarilla', red_foul: 'Falta y roja', goal_kick: 'Saque de arco' },
      alt: { midfield_pass: 'Escena pixelart de un pase en el mediocampo', defensive_pass: 'Escena pixelart de pase en defensa', defensive_recovery: 'Escena pixelart de una recuperación de la defensa', shot: 'Escena pixelart de un delantero rematando', cross: 'Escena pixelart de un centro al área', free_kick: 'Escena pixelart de un tiro libre', free_kick_goal: 'Escena pixelart de un tiro libre peligroso', penalty: 'Escena pixelart de un penal', penalty_goal: 'Escena pixelart de un gol de penal', shot_goal: 'Escena pixelart de un gol de remate', shot_goal_alt: 'Escena pixelart alternativa de un gol de remate', header_goal: 'Escena pixelart de un gol de cabeza', yellow_foul: 'Escena pixelart de una falta con tarjeta amarilla', red_foul: 'Escena pixelart de una falta con tarjeta roja', goal_kick: 'Escena pixelart de un saque de arco' },
      highlight: 'Highlight',
      goalStamp: '¡GOL!',
      headline: {
        gol: ({ attacker }) => `Gol de ${attacker}`,
        parada: ({ keeper }) => `Parada de ${keeper}`,
        tiro_fuera: ({ shooter }) => `Remate fuera de ${shooter}`,
        bloqueo: ({ defender }) => `Bloqueo de ${defender}`,
        faltaRoja: 'Falta dura',
        falta: 'Falta táctica',
        fuera_juego: 'Fuera de juego',
        despeje: 'La defensa despeja',
        pase_fuera: 'Pase demasiado largo',
        perdida: 'Recuperación defensiva',
        default: ({ attacker }) => `${attacker} no encuentra remate`,
      },
    },
    achievements: { Campeón: 'Campeón', Subcampeón: 'Subcampeón', Semifinal: 'Semifinal', 'Cuartos de final': 'Cuartos de final' },
    eras: { Actual: 'Actual' },
    nations: COMMON_NATIONS.es,
    items: COMMON_ITEMS.es,
  },
  en: {
    meta: {
      title: 'Tower of Legends',
      description: 'Football roguelike: build your squad by opening packs and climb an endless tower.',
      footer: 'Torre de Leyendas · Unofficial / unaffiliated project · Legends Cup',
    },
    language: { label: 'Language' },
    menu: {
      kicker: 'Climb the tower. Every floor brings a stronger opponent.',
      teamName: 'Team name',
      namePlaceholder: 'Legends',
      nameError: 'Use letters and spaces only.',
      flag: 'Flag',
      flagAria: 'Team flag',
      flagError: 'Choose a flag to start.',
      chooseFlag: 'Choose flag',
      newRun: 'New run',
      disclaimer: 'Unofficial and unaffiliated project. Cards use fictional data; no trademarks.',
    },
    generic: {
      level: ({ level }) => `Level ${level}`,
      floor: ({ floor }) => `Floor ${floor}`,
      vs: 'vs',
      close: 'Close',
      choose: 'Choose',
      players: 'Players',
      items: 'Items',
      player: 'player',
      item: 'item',
      loading: 'Loading...',
      noData: 'No scores yet.',
      current: 'Current',
      final: 'Final',
      local: 'Home',
      opponent: 'Opponent',
    },
    pack: {
      playerTitle: 'Player pack',
      itemTitle: 'Item pack',
      playerHint: 'Read position, attributes, rarity, nation, and era. Build synergies.',
      itemHint: 'Items modify your team. Fit them into your plan.',
      playerOpen: 'Open player pack',
      itemOpen: 'Open item pack',
      chooseOne: ({ count, hint }) => `Choose 1 of ${count}. ${hint}`,
      tap: 'Tap to open',
    },
    card: {
      owned: 'Already in your squad',
      itemStack: ({ n }) => `×${n} copies stacked`,
      itemStackNote: 'Each extra copy is worth half',
      rarity: { common: 'Common', rare: 'Rare', epic: 'Epic', legend: 'Legend' },
      position: { GK: 'GK', DEF: 'DEF', MID: 'MID', FWD: 'FWD', ENG: 'AM' },
      line: { GK: 'Goal', DEF: 'Defense', MID: 'Midfield', FWD: 'Attack', ENG: 'Playmaker' },
      stat: { pace: 'PAC', shooting: 'SHO', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'PHY', reflexes: 'REF', handling: 'HAN', positioning: 'POS' },
      trait: { Francotirador: 'Sharpshooter', Cañón: 'Cannon', Muro: 'Wall', Motor: 'Engine', Maestro: 'Maestro', Líbero: 'Libero', Paradón: 'Super Save' },
      itemType: { equipamiento: 'equipment', tactica: 'tactic', reliquia: 'relic' },
    },
    build: {
      title: 'Build your team',
      nextOpponent: 'Next opponent',
      viewLineup: 'View XI',
      chemistry: 'Chemistry',
      chemNation: 'Nation',
      chemEra: 'Era',
      fromItems: 'Items contribution',
      tacticalBoard: 'Tactical board',
      boardHint: 'Drag players to the right slot or tap to edit.',
      formationAria: 'Formation',
      roster: 'Substitutes',
      rosterCount: ({ total, missing }) => `${total} cards · ${missing} open slot${missing === 1 ? '' : 's'}`,
      noSubs: 'No substitutes available.',
      noItems: 'No items yet.',
      activeItems: ({ count }) => `Active items (${count})`,
      play: 'Play match',
      missing: ({ count }) => `Complete the XI (${count} missing)`,
      statsDialog: 'Player stats',
      playerDragAria: ({ name }) => `${name}, drag to move or tap to remove from the XI`,
      emptyAria: ({ label }) => `Open ${label} slot, add player`,
      viewStatsAria: ({ name }) => `View ${name} stats`,
      benchAria: ({ name }) => `${name}, drag onto the field or tap to line up`,
      noCandidates: ({ label }) => `You have no compatible substitutes for ${label}. Find them in packs.`,
      pickerHead: ({ label }) => `${label} — choose who comes in`,
      targetPickerHead: ({ name }) => `${name} — choose a position`,
      openSlot: 'Open slot',
    },
    scouting: {
      report: 'Opponent report',
      formation: ({ formation }) => `Formation ${formation}`,
      strength: 'Strength',
      opponentEleven: 'Opponent starting XI',
      note: 'Game ratings for the Legends Cup. Representative historical XI for the tournament.',
      continue: 'Build my team',
    },
    tactics: {
      style: 'Style',
    },
    match: {
      plays: ({ count }) => `${count} plays`,
      tickerStart: ({ level }) => `Level ${level} · Live highlights.`,
      playPauseAria: 'Play or pause',
      speedAria: 'Speed',
      nextAria: 'Next highlight',
      skipAria: 'Skip to the end',
      skipFinal: '⏩ Final',
      viewResult: 'View result',
      continue: 'Continue',
      modesAria: 'Display mode',
      modes: { full: 'Highlights', key: 'Key only', commentary: 'Commentary', instant: 'Instant' },
      anticipation: {
        gol: ({ minute }) => `Min ${minute}' - Dangerous attack...`,
        parada: ({ minute }) => `Min ${minute}' - Shot on target...`,
        shot: ({ minute }) => `Min ${minute}' - The shot is coming...`,
        falta: ({ minute }) => `Min ${minute}' - Contact under pressure...`,
        default: ({ minute }) => `Min ${minute}' - The play builds...`,
      },
      finalLine: ({ home, homeGoals, awayGoals, away }) => `Final · ${home} ${homeGoals}–${awayGoals} ${away}`,
      finalAnnounce: ({ homeGoals, awayGoals }) => `Full time. ${homeGoals} to ${awayGoals}.`,
    },
    result: {
      tier: { goleada: 'ROUT!', amplia: 'Big win', ajustada: 'Narrow win', empate: 'Draw', derrota: 'Defeat' },
      lostStep: 'Step lost',
      towerFall: 'Fall from the tower',
      retry: 'Retry step',
      nextLevel: 'Next level',
      reward: 'Reward',
      lossCopy: ({ lives }) => `You lost this step. You have ${lives} ${lives === 1 ? 'life' : 'lives'} left.`,
      rewardCopy: ({ players, items }) => `Reward ready: choose from a pack of ${players} players and ${items} items.`,
      scorers: 'Scorers',
      saves: 'Saves',
      gameOver: 'Run over',
      floorsReached: 'floors reached',
      newRecord: '★ New record',
      best: ({ best }) => `Best mark: ${best}`,
      winsRoster: ({ wins, count }) => `${wins} ${wins === 1 ? 'win' : 'wins'} · squad of ${count} players`,
      route: 'Path',
      finalSquad: 'Final squad',
      playAgain: 'Play again',
      pathLevel: ({ level }) => `Lv ${level}`,
    },
    leaderboard: {
      floor: ({ floor }) => `Floor ${floor}`,
      updating: 'Updating ranking...',
      readOnly: 'Read-only server: showing saved ranking.',
      rank: ({ rank }) => `Your run finished #${rank}.`,
      notTop: 'You did not make the top 20.',
      title: 'Ranking',
      top: 'Top 20',
      empty: 'No scores yet.',
    },
    adminLogin: {
      title: 'Restricted access',
      kicker: 'Player editing panel.',
      user: 'User',
      password: 'Password',
      submit: 'Sign in',
      back: 'Back to game',
      checking: 'Checking...',
      genericError: 'Could not sign in.',
      invalidCredentials: 'Incorrect user or password.',
      httpError: ({ status }) => `Could not sign in (HTTP ${status}).`,
      missingToken: 'The server did not return a session token.',
    },
    admin: {
      back: 'Back',
      badge: 'Admin',
      title: 'Player panel',
      logout: 'Sign out',
      search: 'Search',
      searchPlaceholder: 'Name, country, era...',
      position: 'Position',
      all: 'All',
      count: ({ visible, total }) => `${visible} of ${total} players · best to worst`,
      selected: 'Selected player',
      name: 'Name',
      nation: 'Nation',
      era: 'Era',
      rarity: 'Rarity',
      ovr: 'Calculated OVR',
      trait: 'Trait',
      noTrait: 'No trait',
      tacticalType: 'Tactical type',
      noType: 'No type',
      saveStats: 'Save stats',
      portraitAria: 'Profile image editor',
      portrait: 'Profile image',
      toolEffect: 'Tool effect',
      replaceImage: 'Replaces current image',
      pickImage: 'Drag or choose an image',
      imageHint: 'Close-up recommended',
      converted: 'Converted',
      savePortrait: 'Save image to player',
      noPlayers: 'No players to edit.',
      invalidImage: 'Choose a valid image file.',
      converting: 'Converting with the Python tool...',
      convertedReady: 'Image converted with the Python tool, ready to save.',
      convertError: ({ message }) => `Could not convert: ${message}`,
      savingImage: 'Saving image to disk...',
      readFailed: 'read failed',
      expired: 'Session expired. Sign in again to the panel.',
      startServer: 'Start the app with npm run serve to use the exact Python converter.',
      invalidPortrait: 'The Python converter did not return a valid portrait.',
      saveNeedsServer: 'Could not save. Start the app with `npm run serve` to edit the player database.',
      saveHttpError: ({ status }) => `Could not save the player database (HTTP ${status}).`,
      playerNotFound: ({ id }) => `Player not found: ${id}`,
      stat: { pace: 'Pace', shooting: 'Shooting', passing: 'Passing', dribbling: 'Dribbling', defending: 'Defense', physical: 'Physical', reflexes: 'Reflexes', handling: 'Handling', positioning: 'Positioning' },
      positionOption: { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward' },
      tactical: { posesion: 'Possession', presion: 'Pressing', contra: 'Counter' },
    },
    narrator: {
      player: 'Player',
      phases: { corner: 'from the corner', free_kick: 'from the free kick', penalty: 'from the spot', counter: 'in transition', default: 'in the move' },
      xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} reads the play, the defense closes in, and ${team} loses the ball.`,
      construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tries to slip it through, but ${defender}'s defense steps up.`,
      contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Counter by ${attacker} after the recovery! ${shooter} drives forward…`,
      pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} tries to change the tempo, but the long pass goes out.`,
      faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} breaks away and ${defender} brings him down. The referee reaches into the pocket: red card.`,
      falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} looks for the run and ${defender} arrives late. ${kind} foul.`,
      faltaPeligrosa: 'Dangerous',
      faltaPresion: 'Pressing',
      fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} slips it to ${receiver}, but the defensive line catches him offside.`,
      despejeCross: ({ m, attacker, defender }) => `Min ${m}' — cross into the box from ${attacker}; ${defender} wins it in the air and clears.`,
      despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tries to progress, but ${defender} recovers and sends the ball away.`,
      sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} improves the position, but ${defender} drops as a block and leaves no shooting angle.`,
      bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} finds a shooting window, but ${defender} steps across and blocks.${xg}`,
      tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} tries ${phase}, but the shot goes wide.${xg}`,
      parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} tries ${phase} and ${keeper} answers with a great save!${xg}`,
      golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} runs up from the spot… GOOOAL for ${team}! (${score})${xg}`,
      golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — free kick by ${shooter}, over the wall… GOOOAL for ${team}! (${score})${xg}`,
      golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — cross by ${passer} and header from ${shooter}… GOOOAL for ${team}! (${score})${xg}`,
      gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} releases ${shooter} after the run… GOOOAL for ${team}! (${score})${xg}`,
      default: ({ m }) => `Min ${m}' — play.`,
    },
    scene: {
      badge: { penalty: 'PENALTY', free_kick: 'FREE KICK', corner: 'CORNER', gol: 'GOAL', parada: 'SAVE', tiro_fuera: 'WIDE SHOT', bloqueo: 'BLOCK', roja: 'RED', falta: 'FOUL', fuera_juego: 'OFFSIDE', despeje: 'CLEARANCE', perdida: 'STEAL', pase_fuera: 'LONG PASS', default: 'PLAY' },
      role: { protagonist: 'Protagonist', scorer: 'Scorer', shooter: 'Shooter', assistant: 'Assistant', keeper: 'Goalkeeper', defender: 'Defender', receiver: 'Receiver' },
      title: { midfield_pass: 'Midfield pass', defensive_pass: 'Playing out from the back', defensive_recovery: 'Defensive recovery', shot: 'Shot', cross: 'Cross into the box', free_kick: 'Free kick', free_kick_goal: 'Free-kick goal', penalty: 'Penalty', penalty_goal: 'Penalty goal', shot_goal: 'Shot goal', shot_goal_alt: 'Shot goal', header_goal: 'Header goal', yellow_foul: 'Foul and yellow', red_foul: 'Foul and red', goal_kick: 'Goal kick' },
      alt: { midfield_pass: 'Pixel-art scene of a midfield pass', defensive_pass: 'Pixel-art scene of a defensive pass', defensive_recovery: 'Pixel-art scene of a defensive recovery', shot: 'Pixel-art scene of a forward shooting', cross: 'Pixel-art scene of a cross into the box', free_kick: 'Pixel-art scene of a free kick', free_kick_goal: 'Pixel-art scene of a dangerous free kick', penalty: 'Pixel-art scene of a penalty', penalty_goal: 'Pixel-art scene of a penalty goal', shot_goal: 'Pixel-art scene of a shot goal', shot_goal_alt: 'Alternative pixel-art scene of a shot goal', header_goal: 'Pixel-art scene of a headed goal', yellow_foul: 'Pixel-art scene of a yellow-card foul', red_foul: 'Pixel-art scene of a red-card foul', goal_kick: 'Pixel-art scene of a goal kick' },
      highlight: 'Highlight',
      goalStamp: 'GOAL!',
      headline: {
        gol: ({ attacker }) => `Goal for ${attacker}`,
        parada: ({ keeper }) => `Save by ${keeper}`,
        tiro_fuera: ({ shooter }) => `Shot wide by ${shooter}`,
        bloqueo: ({ defender }) => `Block by ${defender}`,
        faltaRoja: 'Hard foul',
        falta: 'Tactical foul',
        fuera_juego: 'Offside',
        despeje: 'The defense clears',
        pase_fuera: 'Pass too long',
        perdida: 'Defensive recovery',
        default: ({ attacker }) => `${attacker} cannot find a shot`,
      },
    },
    achievements: { Campeón: 'Champion', Subcampeón: 'Runner-up', Semifinal: 'Semi-final', 'Cuartos de final': 'Quarter-finals' },
    eras: { Actual: 'Current' },
    nations: COMMON_NATIONS.en,
    items: COMMON_ITEMS.en,
  },
  fr: {
    meta: { title: 'Tour des Légendes', description: 'Roguelike de football : composez votre sélection avec des packs et grimpez une tour infinie.', footer: 'Torre de Leyendas · Projet non officiel / non affilié · Coupe des Légendes' },
    language: { label: 'Langue' },
    menu: { kicker: 'Gravissez la tour. À chaque étage, un adversaire plus fort.', teamName: 'Nom de l’équipe', namePlaceholder: 'Légendes', nameError: 'Utilisez uniquement des lettres et des espaces.', flag: 'Drapeau', flagAria: 'Drapeau de l’équipe', flagError: 'Choisissez un drapeau pour commencer.', chooseFlag: 'Choisir un drapeau', newRun: 'Nouvelle run', disclaimer: 'Projet non officiel et non affilié. Cartes avec données fictives ; aucune marque déposée.' },
    generic: { level: ({ level }) => `Niveau ${level}`, floor: ({ floor }) => `Étage ${floor}`, vs: 'vs', close: 'Fermer', choose: 'Choisir', players: 'Joueurs', items: 'Objets', player: 'joueur', item: 'objet', loading: 'Chargement...', noData: 'Aucun score pour le moment.', current: 'Actuel', final: 'Fin', local: 'Domicile', opponent: 'Adversaire' },
    pack: { playerTitle: 'Pack de joueur', itemTitle: 'Pack d’objet', playerHint: 'Lisez poste, attributs, rareté, nation et époque. Construisez des synergies.', itemHint: 'Les objets modifient votre équipe. Intégrez-les à votre plan.', playerOpen: 'Ouvrir un pack de joueurs', itemOpen: 'Ouvrir un pack d’objets', chooseOne: ({ count, hint }) => `Choisissez 1 sur ${count}. ${hint}`, tap: 'Touchez pour ouvrir' },
    card: { owned: 'Déjà dans votre effectif', rarity: { common: 'Commune', rare: 'Rare', epic: 'Épique', legend: 'Légende' }, position: { GK: 'GB', DEF: 'DEF', MID: 'MIL', FWD: 'ATT', ENG: 'MOC' }, line: { GK: 'But', DEF: 'Défense', MID: 'Milieu', FWD: 'Attaque', ENG: 'Meneur' }, stat: { pace: 'VIT', shooting: 'TIR', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'PHY', reflexes: 'REF', handling: 'PRI', positioning: 'POS' }, trait: { Francotirador: 'Tireur d’élite', Cañón: 'Canon', Muro: 'Mur', Motor: 'Moteur', Maestro: 'Maestro', Líbero: 'Libéro', Paradón: 'Arrêt réflexe' }, itemType: { equipamiento: 'équipement', tactica: 'tactique', reliquia: 'relique' } },
    build: { title: 'Composez votre équipe', nextOpponent: 'Prochain adversaire', viewLineup: 'Voir le onze', chemistry: 'Collectif', tacticalBoard: 'Tableau tactique', boardHint: 'Glissez les joueurs vers le bon slot ou touchez pour modifier.', formationAria: 'Formation', roster: 'Effectif', rosterCount: ({ total, missing }) => `${total} cartes · ${missing} place${missing === 1 ? '' : 's'} libre${missing === 1 ? '' : 's'}`, noSubs: 'Aucun remplaçant disponible.', noItems: 'Aucun objet pour l’instant.', activeItems: ({ count }) => `Objets actifs (${count})`, play: 'Jouer le match', missing: ({ count }) => `Complétez le onze (${count} manquant${count === 1 ? '' : 's'})`, statsDialog: 'Statistiques du joueur', playerDragAria: ({ name }) => `${name}, glisser pour déplacer ou toucher pour retirer du onze`, emptyAria: ({ label }) => `Place ${label} libre, ajouter un joueur`, viewStatsAria: ({ name }) => `Voir les statistiques de ${name}`, benchAria: ({ name }) => `${name}, glisser sur le terrain ou toucher pour aligner`, noCandidates: ({ label }) => `Vous n’avez aucun remplaçant compatible pour ${label}. Trouvez-en dans les packs.`, pickerHead: ({ label }) => `${label} — choisissez qui entre`, targetPickerHead: ({ name }) => `${name} — choisissez sa place`, openSlot: 'Place libre' },
    scouting: { report: 'Rapport adversaire', formation: ({ formation }) => `Formation ${formation}`, strength: 'Force', opponentEleven: 'Onze principal adverse', note: 'Notes de jeu pour la Coupe des Légendes. Onze historique représentatif du tournoi.', continue: 'Composer mon équipe' },
    match: { plays: ({ count }) => `${count} actions`, tickerStart: ({ level }) => `Niveau ${level} · Highlights en direct.`, playPauseAria: 'Lire ou mettre en pause', speedAria: 'Vitesse', nextAria: 'Highlight suivant', skipAria: 'Aller à la fin', skipFinal: '⏩ Fin', viewResult: 'Voir le résultat', continue: 'Continuer', modesAria: 'Mode d’affichage', modes: { full: 'Highlights', key: 'Temps forts', commentary: 'Commentaire', instant: 'Instantané' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Attaque dangereuse...`, parada: ({ minute }) => `Min ${minute}' - Tir cadré...`, shot: ({ minute }) => `Min ${minute}' - Le tir se prépare...`, falta: ({ minute }) => `Min ${minute}' - Contact sous pression...`, default: ({ minute }) => `Min ${minute}' - L’action se construit...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Fin · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fin du match. ${homeGoals} à ${awayGoals}.` },
    result: { tier: { goleada: 'ROUSTE !', amplia: 'Large victoire', ajustada: 'Victoire serrée', empate: 'Match nul', derrota: 'Défaite' }, lostStep: 'Échelon perdu', towerFall: 'Chute de la tour', retry: 'Retenter l’échelon', nextLevel: 'Niveau suivant', reward: 'Récompense', lossCopy: ({ lives }) => `Vous avez perdu cet échelon. Il vous reste ${lives} vie${lives === 1 ? '' : 's'}.`, rewardCopy: ({ players, items }) => `Récompense prête : pack de ${players} joueurs et ${items} objets à choisir.`, scorers: 'Buteurs', saves: 'Arrêts', gameOver: 'Fin de run', floorsReached: 'étages atteints', newRecord: '★ Nouveau record', best: ({ best }) => `Meilleure marque : ${best}`, winsRoster: ({ wins, count }) => `${wins} victoire${wins === 1 ? '' : 's'} · effectif de ${count} joueurs`, route: 'Parcours', finalSquad: 'Effectif final', playAgain: 'Rejouer', pathLevel: ({ level }) => `Nv ${level}` },
    leaderboard: { floor: ({ floor }) => `Étage ${floor}`, updating: 'Mise à jour du classement...', readOnly: 'Serveur sans écriture : affichage du classement sauvegardé.', rank: ({ rank }) => `Votre run termine #${rank}.`, notTop: 'Vous n’êtes pas dans le top 20.', title: 'Classement', top: 'Top 20', empty: 'Aucun score pour le moment.' },
    adminLogin: { title: 'Accès restreint', kicker: 'Panneau d’édition des joueurs.', user: 'Utilisateur', password: 'Mot de passe', submit: 'Entrer', back: 'Retour au jeu', checking: 'Vérification...', genericError: 'Impossible de se connecter.', invalidCredentials: 'Utilisateur ou mot de passe incorrect.', httpError: ({ status }) => `Impossible de se connecter (HTTP ${status}).`, missingToken: 'Le serveur n’a pas renvoyé de jeton de session.' },
    admin: { back: 'Retour', badge: 'Admin', title: 'Panneau des joueurs', logout: 'Déconnexion', search: 'Rechercher', searchPlaceholder: 'Nom, pays, époque...', position: 'Poste', all: 'Toutes', count: ({ visible, total }) => `${visible} sur ${total} joueurs · du meilleur au moins bon`, selected: 'Joueur sélectionné', name: 'Nom', nation: 'Nation', era: 'Époque', rarity: 'Rareté', ovr: 'OVR calculé', trait: 'Trait', noTrait: 'Sans trait', tacticalType: 'Type tactique', noType: 'Sans type', saveStats: 'Enregistrer les stats', portraitAria: 'Éditeur d’image de profil', portrait: 'Image de profil', toolEffect: 'Effet tool', replaceImage: 'Remplace l’image actuelle', pickImage: 'Glissez ou choisissez une image', imageHint: 'Gros plan recommandé', converted: 'Convertie', savePortrait: 'Enregistrer l’image du joueur', noPlayers: 'Aucun joueur à éditer.', invalidImage: 'Choisissez un fichier image valide.', converting: 'Conversion avec l’outil Python...', convertedReady: 'Image convertie avec l’outil Python, prête à enregistrer.', convertError: ({ message }) => `Conversion impossible : ${message}`, savingImage: 'Enregistrement de l’image sur le disque...', readFailed: 'échec de lecture', expired: 'Session expirée. Reconnectez-vous au panneau.', startServer: 'Lancez l’app avec npm run serve pour utiliser le convertisseur Python exact.', invalidPortrait: 'Le convertisseur Python n’a pas renvoyé de portrait valide.', saveNeedsServer: 'Impossible d’enregistrer. Lancez l’app avec `npm run serve` pour modifier la base de joueurs.', saveHttpError: ({ status }) => `Impossible d’enregistrer la base de joueurs (HTTP ${status}).`, playerNotFound: ({ id }) => `Joueur introuvable : ${id}`, stat: { pace: 'Vitesse', shooting: 'Tir', passing: 'Passe', dribbling: 'Dribble', defending: 'Défense', physical: 'Physique', reflexes: 'Réflexes', handling: 'Prise', positioning: 'Placement' }, positionOption: { GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }, tactical: { posesion: 'Possession', presion: 'Pressing', contra: 'Contre' } },
    narrator: {
      player: 'Joueur', phases: { corner: 'sur corner', free_kick: 'sur coup franc', penalty: 'sur penalty', counter: 'en transition', default: 'dans l’action' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} lit l’action, la défense se referme et ${team} perd le ballon.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tente de filtrer, mais la défense de ${defender} avance.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contre de ${attacker} après récupération ! ${shooter} part balle au pied…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} tente de changer le rythme, mais la passe longue sort.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} s’échappe et ${defender} le fauche. L’arbitre sort la carte : rouge.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} cherche l’appel et ${defender} arrive en retard. Faute ${kind}.`, faltaPeligrosa: 'dangereuse', faltaPresion: 'au pressing', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} lance ${receiver}, mais la ligne défensive le prend hors-jeu.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — centre dans la surface de ${attacker} ; ${defender} gagne dans les airs et dégage.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tente d’avancer, mais ${defender} récupère et éloigne le ballon.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} gagne du terrain, mais ${defender} recule en bloc et ferme l’angle de tir.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} trouve une fenêtre de tir, mais ${defender} se jette et contre.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} tente ${phase}, mais la frappe passe à côté.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} tente ${phase} et ${keeper} répond par un grand arrêt !${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} s’élance du point de penalty… BUUUT pour ${team} ! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — coup franc de ${shooter}, au-dessus du mur… BUUUT pour ${team} ! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — centre de ${passer} et tête de ${shooter}… BUUUT pour ${team} ! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} lance ${shooter} après l’appel… BUUUT pour ${team} ! (${score})${xg}`, default: ({ m }) => `Min ${m}' — action.`,
    },
    scene: {
      badge: { penalty: 'PENALTY', free_kick: 'COUP FRANC', corner: 'CORNER', gol: 'BUT', parada: 'ARRÊT', tiro_fuera: 'TIR À CÔTÉ', bloqueo: 'CONTRE', roja: 'ROUGE', falta: 'FAUTE', fuera_juego: 'HORS-JEU', despeje: 'DÉGAGEMENT', perdida: 'RÉCUPÉRATION', pase_fuera: 'PASSE LONGUE', default: 'ACTION' }, role: { protagonist: 'Protagoniste', scorer: 'Buteur', shooter: 'Tireur', assistant: 'Passeur', keeper: 'Gardien', defender: 'Défenseur', receiver: 'Receveur' }, title: { midfield_pass: 'Passe au milieu', defensive_pass: 'Relance depuis l’arrière', defensive_recovery: 'Récupération défensive', shot: 'Frappe', cross: 'Centre dans la surface', free_kick: 'Coup franc', free_kick_goal: 'But sur coup franc', penalty: 'Penalty', penalty_goal: 'But sur penalty', shot_goal: 'But sur frappe', shot_goal_alt: 'But sur frappe', header_goal: 'But de la tête', yellow_foul: 'Faute et jaune', red_foul: 'Faute et rouge', goal_kick: 'Six mètres' }, alt: { midfield_pass: 'Scène pixelart d’une passe au milieu', defensive_pass: 'Scène pixelart d’une passe défensive', defensive_recovery: 'Scène pixelart d’une récupération défensive', shot: 'Scène pixelart d’un attaquant qui frappe', cross: 'Scène pixelart d’un centre dans la surface', free_kick: 'Scène pixelart d’un coup franc', free_kick_goal: 'Scène pixelart d’un coup franc dangereux', penalty: 'Scène pixelart d’un penalty', penalty_goal: 'Scène pixelart d’un but sur penalty', shot_goal: 'Scène pixelart d’un but sur frappe', shot_goal_alt: 'Scène pixelart alternative d’un but sur frappe', header_goal: 'Scène pixelart d’un but de la tête', yellow_foul: 'Scène pixelart d’une faute avec carton jaune', red_foul: 'Scène pixelart d’une faute avec carton rouge', goal_kick: 'Scène pixelart d’un six mètres' }, highlight: 'Highlight', goalStamp: 'BUT !', headline: { gol: ({ attacker }) => `But de ${attacker}`, parada: ({ keeper }) => `Arrêt de ${keeper}`, tiro_fuera: ({ shooter }) => `Frappe à côté de ${shooter}`, bloqueo: ({ defender }) => `Contre de ${defender}`, faltaRoja: 'Faute dure', falta: 'Faute tactique', fuera_juego: 'Hors-jeu', despeje: 'La défense dégage', pase_fuera: 'Passe trop longue', perdida: 'Récupération défensive', default: ({ attacker }) => `${attacker} ne trouve pas de tir` },
    },
    achievements: { Campeón: 'Champion', Subcampeón: 'Vice-champion', Semifinal: 'Demi-finale', 'Cuartos de final': 'Quarts de finale' },
    eras: { Actual: 'Actuel' },
    nations: COMMON_NATIONS.fr,
    items: COMMON_ITEMS.fr,
  },
  pt: {
    meta: { title: 'Torre das Lendas', description: 'Roguelike de futebol: monte sua seleção abrindo pacotes e suba uma torre infinita.', footer: 'Torre de Leyendas · Projeto não oficial / não afiliado · Copa das Lendas' },
    language: { label: 'Idioma' },
    menu: { kicker: 'Suba a torre. A cada andar, um rival mais forte.', teamName: 'Nome da equipe', namePlaceholder: 'Lendas', nameError: 'Use apenas letras e espaços.', flag: 'Bandeira', flagAria: 'Bandeira da equipe', flagError: 'Escolha uma bandeira para começar.', chooseFlag: 'Escolha bandeira', newRun: 'Nova run', disclaimer: 'Projeto não oficial e não afiliado. Cartas com dados fictícios; sem marcas registradas.' },
    generic: { level: ({ level }) => `Nível ${level}`, floor: ({ floor }) => `Andar ${floor}`, vs: 'vs', close: 'Fechar', choose: 'Escolher', players: 'Jogadores', items: 'Objetos', player: 'jogador', item: 'objeto', loading: 'Carregando...', noData: 'Sem marcas ainda.', current: 'Atual', final: 'Final', local: 'Mandante', opponent: 'Rival' },
    pack: { playerTitle: 'Pacote de jogador', itemTitle: 'Pacote de objeto', playerHint: 'Leia posição, atributos, raridade, nação e era. Construa sinergias.', itemHint: 'Os objetos modificam sua equipe. Encaixe-os no seu plano.', playerOpen: 'Abrir pacote de jogadores', itemOpen: 'Abrir pacote de objetos', chooseOne: ({ count, hint }) => `Escolha 1 de ${count}. ${hint}`, tap: 'Toque para abrir' },
    card: { owned: 'Já está no seu elenco', rarity: { common: 'Comum', rare: 'Rara', epic: 'Épica', legend: 'Lenda' }, position: { GK: 'GOL', DEF: 'DEF', MID: 'MEI', FWD: 'ATA', ENG: 'MEI' }, line: { GK: 'Gol', DEF: 'Defesa', MID: 'Meio-campo', FWD: 'Ataque', ENG: 'Meia' }, stat: { pace: 'RIT', shooting: 'FIN', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'FIS', reflexes: 'REF', handling: 'BLO', positioning: 'POS' }, trait: { Francotirador: 'Franco-atirador', Cañón: 'Canhão', Muro: 'Muralha', Motor: 'Motor', Maestro: 'Maestro', Líbero: 'Líbero', Paradón: 'Defesaça' }, itemType: { equipamiento: 'equipamento', tactica: 'tática', reliquia: 'relíquia' } },
    build: { title: 'Monte sua equipe', nextOpponent: 'Próximo rival', viewLineup: 'Ver onze', chemistry: 'Química', tacticalBoard: 'Quadro tático', boardHint: 'Arraste jogadores para o slot correto ou toque para editar.', formationAria: 'Formação', roster: 'Elenco', rosterCount: ({ total, missing }) => `${total} cartas · ${missing} vaga${missing === 1 ? '' : 's'} livre${missing === 1 ? '' : 's'}`, noSubs: 'Sem reservas disponíveis.', noItems: 'Sem objetos ainda.', activeItems: ({ count }) => `Objetos ativos (${count})`, play: 'Jogar partida', missing: ({ count }) => `Complete o onze (${count} faltando)`, statsDialog: 'Estatísticas do jogador', playerDragAria: ({ name }) => `${name}, arraste para mover ou toque para tirar do onze`, emptyAria: ({ label }) => `Vaga ${label} livre, adicionar jogador`, viewStatsAria: ({ name }) => `Ver estatísticas de ${name}`, benchAria: ({ name }) => `${name}, arraste para o campo ou toque para escalar`, noCandidates: ({ label }) => `Você não tem reservas compatíveis para ${label}. Encontre-as nos pacotes.`, pickerHead: ({ label }) => `${label} — escolha quem entra`, targetPickerHead: ({ name }) => `${name} — escolha a posição`, openSlot: 'Vaga livre' },
    scouting: { report: 'Relatório do rival', formation: ({ formation }) => `Formação ${formation}`, strength: 'Força', opponentEleven: 'Onze principal do rival', note: 'Ratings de jogo para a Copa das Lendas. Onze histórico representativo do torneio.', continue: 'Montar minha equipe' },
    match: { plays: ({ count }) => `${count} jogadas`, tickerStart: ({ level }) => `Nível ${level} · Highlights ao vivo.`, playPauseAria: 'Reproduzir ou pausar', speedAria: 'Velocidade', nextAria: 'Próximo highlight', skipAria: 'Pular para o final', skipFinal: '⏩ Final', viewResult: 'Ver resultado', continue: 'Continuar', modesAria: 'Modo de visualização', modes: { full: 'Highlights', key: 'Só chave', commentary: 'Comentário', instant: 'Instantâneo' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Ataque perigoso...`, parada: ({ minute }) => `Min ${minute}' - Finalização no gol...`, shot: ({ minute }) => `Min ${minute}' - O chute vem aí...`, falta: ({ minute }) => `Min ${minute}' - Contato sob pressão...`, default: ({ minute }) => `Min ${minute}' - A jogada se constrói...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Final · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fim de jogo. ${homeGoals} a ${awayGoals}.` },
    result: { tier: { goleada: 'GOLEADA!', amplia: 'Vitória ampla', ajustada: 'Vitória apertada', empate: 'Empate', derrota: 'Derrota' }, lostStep: 'Degrau perdido', towerFall: 'Queda da torre', retry: 'Tentar o degrau de novo', nextLevel: 'Próximo nível', reward: 'Recompensa', lossCopy: ({ lives }) => `Você perdeu este degrau. Restam ${lives} vida${lives === 1 ? '' : 's'}.`, rewardCopy: ({ players, items }) => `Recompensa pronta: pacote de ${players} jogadores e ${items} objetos para escolher.`, scorers: 'Artilheiros', saves: 'Defesas', gameOver: 'Fim da run', floorsReached: 'andares alcançados', newRecord: '★ Novo recorde', best: ({ best }) => `Melhor marca: ${best}`, winsRoster: ({ wins, count }) => `${wins} vitória${wins === 1 ? '' : 's'} · elenco de ${count} jogadores`, route: 'Percurso', finalSquad: 'Elenco final', playAgain: 'Jogar de novo', pathLevel: ({ level }) => `Nv ${level}` },
    leaderboard: { floor: ({ floor }) => `Andar ${floor}`, updating: 'Atualizando ranking...', readOnly: 'Servidor sem escrita: mostrando o ranking salvo.', rank: ({ rank }) => `Sua run ficou em #${rank}.`, notTop: 'Você não entrou no top 20.', title: 'Ranking', top: 'Top 20', empty: 'Sem marcas ainda.' },
    adminLogin: { title: 'Acesso restrito', kicker: 'Painel de edição de jogadores.', user: 'Usuário', password: 'Senha', submit: 'Entrar', back: 'Voltar ao jogo', checking: 'Verificando...', genericError: 'Não foi possível iniciar sessão.', invalidCredentials: 'Usuário ou senha incorretos.', httpError: ({ status }) => `Não foi possível iniciar sessão (HTTP ${status}).`, missingToken: 'O servidor não devolveu um token de sessão.' },
    admin: { back: 'Voltar', badge: 'Admin', title: 'Painel de jogadores', logout: 'Sair', search: 'Buscar', searchPlaceholder: 'Nome, país, era...', position: 'Posição', all: 'Todas', count: ({ visible, total }) => `${visible} de ${total} jogadores · melhor para pior`, selected: 'Jogador selecionado', name: 'Nome', nation: 'Nação', era: 'Era', rarity: 'Raridade', ovr: 'OVR calculado', trait: 'Traço', noTrait: 'Sem traço', tacticalType: 'Tipo tático', noType: 'Sem tipo', saveStats: 'Salvar estatísticas', portraitAria: 'Editor de imagem de perfil', portrait: 'Imagem de perfil', toolEffect: 'Efeito tool', replaceImage: 'Substitui a imagem atual', pickImage: 'Arraste ou escolha uma imagem', imageHint: 'Primeiro plano recomendado', converted: 'Convertida', savePortrait: 'Salvar imagem no jogador', noPlayers: 'Não há jogadores para editar.', invalidImage: 'Escolha um arquivo de imagem válido.', converting: 'Convertendo com o tool Python...', convertedReady: 'Imagem convertida com o tool Python, pronta para salvar.', convertError: ({ message }) => `Não foi possível converter: ${message}`, savingImage: 'Salvando imagem no disco...', readFailed: 'falha na leitura', expired: 'Sessão expirada. Entre novamente no painel.', startServer: 'Inicie a app com npm run serve para usar o conversor Python exato.', invalidPortrait: 'O conversor Python não devolveu um retrato válido.', saveNeedsServer: 'Não foi possível salvar. Inicie a app com `npm run serve` para editar a base de jogadores.', saveHttpError: ({ status }) => `Não foi possível salvar a base de jogadores (HTTP ${status}).`, playerNotFound: ({ id }) => `Jogador não encontrado: ${id}`, stat: { pace: 'Ritmo', shooting: 'Finalização', passing: 'Passe', dribbling: 'Drible', defending: 'Defesa', physical: 'Físico', reflexes: 'Reflexos', handling: 'Bloqueio', positioning: 'Posicionamento' }, positionOption: { GK: 'Goleiro', DEF: 'Defensor', MID: 'Meio-campista', FWD: 'Atacante' }, tactical: { posesion: 'Posse', presion: 'Pressão', contra: 'Contra' } },
    narrator: {
      player: 'Jogador', phases: { corner: 'no escanteio', free_kick: 'na cobrança de falta', penalty: 'no pênalti', counter: 'em transição', default: 'na jogada' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} lê a jogada, a defesa fecha e ${team} perde a bola.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tenta enfiar a bola, mas a defesa de ${defender} adianta as linhas.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contra de ${attacker} após recuperar! ${shooter} parte para cima…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} tenta mudar o ritmo, mas o passe longo sai pela lateral.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} escapa e ${defender} derruba. O árbitro vai ao bolso: vermelho.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} busca a infiltração e ${defender} chega atrasado. Falta ${kind}.`, faltaPeligrosa: 'perigosa', faltaPresion: 'na pressão', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} enfia para ${receiver}, mas a linha defensiva deixa em impedimento.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — cruzamento na área de ${attacker}; ${defender} ganha pelo alto e afasta.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tenta avançar, mas ${defender} recupera e manda a bola para longe.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} melhora a posição, mas ${defender} recompõe em bloco e não dá ângulo de chute.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} encontra uma janela de chute, mas ${defender} cruza e bloqueia.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} tenta ${phase}, mas o chute vai para fora.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} tenta ${phase} e ${keeper} responde com uma grande defesa!${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} toma distância na marca do pênalti… GOOOL de ${team}! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — falta cobrada por ${shooter}, passa pela barreira… GOOOL de ${team}! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — cruzamento de ${passer} e cabeçada de ${shooter}… GOOOL de ${team}! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} acha ${shooter} após a movimentação… GOOOL de ${team}! (${score})${xg}`, default: ({ m }) => `Min ${m}' — jogada.`,
    },
    scene: {
      badge: { penalty: 'PÊNALTI', free_kick: 'FALTA', corner: 'ESCANTEIO', gol: 'GOL', parada: 'DEFESA', tiro_fuera: 'CHUTE FORA', bloqueo: 'BLOQUEIO', roja: 'VERMELHO', falta: 'FALTA', fuera_juego: 'IMPEDIMENTO', despeje: 'AFASTADA', perdida: 'ROUBO', pase_fuera: 'PASSE LONGO', default: 'JOGADA' }, role: { protagonist: 'Protagonista', scorer: 'Autor do gol', shooter: 'Finalizador', assistant: 'Assistente', keeper: 'Goleiro', defender: 'Defensor', receiver: 'Recebedor' }, title: { midfield_pass: 'Passe no meio-campo', defensive_pass: 'Saída desde trás', defensive_recovery: 'Recuperação defensiva', shot: 'Finalização', cross: 'Cruzamento na área', free_kick: 'Cobrança de falta', free_kick_goal: 'Gol de falta', penalty: 'Pênalti', penalty_goal: 'Gol de pênalti', shot_goal: 'Gol de finalização', shot_goal_alt: 'Gol de finalização', header_goal: 'Gol de cabeça', yellow_foul: 'Falta e amarelo', red_foul: 'Falta e vermelho', goal_kick: 'Tiro de meta' }, alt: { midfield_pass: 'Cena pixelart de um passe no meio-campo', defensive_pass: 'Cena pixelart de passe na defesa', defensive_recovery: 'Cena pixelart de uma recuperação defensiva', shot: 'Cena pixelart de um atacante finalizando', cross: 'Cena pixelart de um cruzamento na área', free_kick: 'Cena pixelart de uma cobrança de falta', free_kick_goal: 'Cena pixelart de uma falta perigosa', penalty: 'Cena pixelart de um pênalti', penalty_goal: 'Cena pixelart de um gol de pênalti', shot_goal: 'Cena pixelart de um gol de finalização', shot_goal_alt: 'Cena pixelart alternativa de um gol de finalização', header_goal: 'Cena pixelart de um gol de cabeça', yellow_foul: 'Cena pixelart de uma falta com cartão amarelo', red_foul: 'Cena pixelart de uma falta com cartão vermelho', goal_kick: 'Cena pixelart de um tiro de meta' }, highlight: 'Highlight', goalStamp: 'GOL!', headline: { gol: ({ attacker }) => `Gol de ${attacker}`, parada: ({ keeper }) => `Defesa de ${keeper}`, tiro_fuera: ({ shooter }) => `Chute para fora de ${shooter}`, bloqueo: ({ defender }) => `Bloqueio de ${defender}`, faltaRoja: 'Falta dura', falta: 'Falta tática', fuera_juego: 'Impedimento', despeje: 'A defesa afasta', pase_fuera: 'Passe longo demais', perdida: 'Recuperação defensiva', default: ({ attacker }) => `${attacker} não encontra finalização` },
    },
    achievements: { Campeón: 'Campeão', Subcampeón: 'Vice-campeão', Semifinal: 'Semifinal', 'Cuartos de final': 'Quartas de final' },
    eras: { Actual: 'Atual' },
    nations: COMMON_NATIONS.pt,
    items: COMMON_ITEMS.pt,
  },
  it: {
    meta: { title: 'Torre delle Leggende', description: 'Roguelike calcistico: costruisci la tua selezione aprendo pacchetti e scala una torre infinita.', footer: 'Torre de Leyendas · Progetto non ufficiale / non affiliato · Coppa delle Leggende' },
    language: { label: 'Lingua' },
    menu: { kicker: 'Scala la torre. Ogni piano porta un avversario più forte.', teamName: 'Nome squadra', namePlaceholder: 'Leggende', nameError: 'Usa solo lettere e spazi.', flag: 'Bandiera', flagAria: 'Bandiera della squadra', flagError: 'Scegli una bandiera per iniziare.', chooseFlag: 'Scegli bandiera', newRun: 'Nuova run', disclaimer: 'Progetto non ufficiale e non affiliato. Carte con dati fittizi; nessun marchio registrato.' },
    generic: { level: ({ level }) => `Livello ${level}`, floor: ({ floor }) => `Piano ${floor}`, vs: 'vs', close: 'Chiudi', choose: 'Scegli', players: 'Giocatori', items: 'Oggetti', player: 'giocatore', item: 'oggetto', loading: 'Caricamento...', noData: 'Nessun punteggio ancora.', current: 'Attuale', final: 'Fine', local: 'Casa', opponent: 'Rivale' },
    pack: { playerTitle: 'Pacchetto giocatore', itemTitle: 'Pacchetto oggetto', playerHint: 'Leggi ruolo, attributi, rarità, nazione ed epoca. Costruisci sinergie.', itemHint: 'Gli oggetti modificano la squadra. Inseriscili nel tuo piano.', playerOpen: 'Apri pacchetto giocatori', itemOpen: 'Apri pacchetto oggetti', chooseOne: ({ count, hint }) => `Scegli 1 di ${count}. ${hint}`, tap: 'Tocca per aprire' },
    card: { owned: 'Già nella tua rosa', rarity: { common: 'Comune', rare: 'Rara', epic: 'Epica', legend: 'Leggenda' }, position: { GK: 'POR', DEF: 'DIF', MID: 'CEN', FWD: 'ATT', ENG: 'TRQ' }, line: { GK: 'Porta', DEF: 'Difesa', MID: 'Centrocampo', FWD: 'Attacco', ENG: 'Trequarti' }, stat: { pace: 'VEL', shooting: 'TIR', passing: 'PAS', dribbling: 'DRI', defending: 'DIF', physical: 'FIS', reflexes: 'RIF', handling: 'PRE', positioning: 'POS' }, trait: { Francotirador: 'Cecchino', Cañón: 'Cannone', Muro: 'Muro', Motor: 'Motore', Maestro: 'Maestro', Líbero: 'Libero', Paradón: 'Paratona' }, itemType: { equipamiento: 'equipaggiamento', tactica: 'tattica', reliquia: 'reliquia' } },
    build: { title: 'Costruisci la squadra', nextOpponent: 'Prossimo rivale', viewLineup: 'Vedi undici', chemistry: 'Intesa', tacticalBoard: 'Lavagna tattica', boardHint: 'Trascina i giocatori nello slot corretto o tocca per modificare.', formationAria: 'Formazione', roster: 'Rosa', rosterCount: ({ total, missing }) => `${total} carte · ${missing} slot liber${missing === 1 ? 'o' : 'i'}`, noSubs: 'Nessuna riserva disponibile.', noItems: 'Nessun oggetto per ora.', activeItems: ({ count }) => `Oggetti attivi (${count})`, play: 'Gioca partita', missing: ({ count }) => `Completa l’undici (${count} mancanti)`, statsDialog: 'Statistiche giocatore', playerDragAria: ({ name }) => `${name}, trascina per spostare o tocca per togliere dall’undici`, emptyAria: ({ label }) => `Slot ${label} libero, aggiungi giocatore`, viewStatsAria: ({ name }) => `Vedi statistiche di ${name}`, benchAria: ({ name }) => `${name}, trascina in campo o tocca per schierare`, noCandidates: ({ label }) => `Non hai riserve compatibili per ${label}. Trovale nei pacchetti.`, pickerHead: ({ label }) => `${label} — scegli chi entra`, targetPickerHead: ({ name }) => `${name} — scegli la posizione`, openSlot: 'Slot libero' },
    scouting: { report: 'Report rivale', formation: ({ formation }) => `Formazione ${formation}`, strength: 'Forza', opponentEleven: 'Undici principale del rivale', note: 'Rating di gioco per la Coppa delle Leggende. Undici storico rappresentativo del torneo.', continue: 'Costruisci la mia squadra' },
    match: { plays: ({ count }) => `${count} azioni`, tickerStart: ({ level }) => `Livello ${level} · Highlights in diretta.`, playPauseAria: 'Riproduci o pausa', speedAria: 'Velocità', nextAria: 'Highlight successivo', skipAria: 'Vai alla fine', skipFinal: '⏩ Fine', viewResult: 'Vedi risultato', continue: 'Continua', modesAria: 'Modalità di visualizzazione', modes: { full: 'Highlights', key: 'Solo chiave', commentary: 'Commento', instant: 'Istantaneo' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Attacco pericoloso...`, parada: ({ minute }) => `Min ${minute}' - Tiro in porta...`, shot: ({ minute }) => `Min ${minute}' - Sta arrivando il tiro...`, falta: ({ minute }) => `Min ${minute}' - Contatto in pressione...`, default: ({ minute }) => `Min ${minute}' - L’azione si costruisce...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Fine · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fine partita. ${homeGoals} a ${awayGoals}.` },
    result: { tier: { goleada: 'GOLEADA!', amplia: 'Vittoria larga', ajustada: 'Vittoria stretta', empate: 'Pareggio', derrota: 'Sconfitta' }, lostStep: 'Gradino perso', towerFall: 'Caduta dalla torre', retry: 'Riprova gradino', nextLevel: 'Livello successivo', reward: 'Ricompensa', lossCopy: ({ lives }) => `Hai perso questo gradino. Ti restano ${lives} vit${lives === 1 ? 'a' : 'e'}.`, rewardCopy: ({ players, items }) => `Ricompensa pronta: pacchetto da ${players} giocatori e ${items} oggetti da scegliere.`, scorers: 'Marcatori', saves: 'Parate', gameOver: 'Fine run', floorsReached: 'piani raggiunti', newRecord: '★ Nuovo record', best: ({ best }) => `Miglior risultato: ${best}`, winsRoster: ({ wins, count }) => `${wins} vittori${wins === 1 ? 'a' : 'e'} · rosa di ${count} giocatori`, route: 'Percorso', finalSquad: 'Rosa finale', playAgain: 'Gioca di nuovo', pathLevel: ({ level }) => `Lv ${level}` },
    leaderboard: { floor: ({ floor }) => `Piano ${floor}`, updating: 'Aggiornamento classifica...', readOnly: 'Server senza scrittura: mostro la classifica salvata.', rank: ({ rank }) => `La tua run è arrivata #${rank}.`, notTop: 'Non sei entrato nella top 20.', title: 'Classifica', top: 'Top 20', empty: 'Nessun punteggio ancora.' },
    adminLogin: { title: 'Accesso riservato', kicker: 'Pannello di modifica giocatori.', user: 'Utente', password: 'Password', submit: 'Entra', back: 'Torna al gioco', checking: 'Controllo...', genericError: 'Accesso non riuscito.', invalidCredentials: 'Utente o password errati.', httpError: ({ status }) => `Accesso non riuscito (HTTP ${status}).`, missingToken: 'Il server non ha restituito un token di sessione.' },
    admin: { back: 'Indietro', badge: 'Admin', title: 'Pannello giocatori', logout: 'Esci', search: 'Cerca', searchPlaceholder: 'Nome, paese, epoca...', position: 'Ruolo', all: 'Tutte', count: ({ visible, total }) => `${visible} di ${total} giocatori · dal migliore al peggiore`, selected: 'Giocatore selezionato', name: 'Nome', nation: 'Nazione', era: 'Epoca', rarity: 'Rarità', ovr: 'OVR calcolato', trait: 'Tratto', noTrait: 'Nessun tratto', tacticalType: 'Tipo tattico', noType: 'Nessun tipo', saveStats: 'Salva statistiche', portraitAria: 'Editor immagine profilo', portrait: 'Immagine profilo', toolEffect: 'Effetto tool', replaceImage: 'Sostituisce l’immagine attuale', pickImage: 'Trascina o scegli un’immagine', imageHint: 'Primo piano consigliato', converted: 'Convertita', savePortrait: 'Salva immagine sul giocatore', noPlayers: 'Nessun giocatore da modificare.', invalidImage: 'Scegli un file immagine valido.', converting: 'Conversione con il tool Python...', convertedReady: 'Immagine convertita con il tool Python, pronta da salvare.', convertError: ({ message }) => `Conversione non riuscita: ${message}`, savingImage: 'Salvataggio immagine su disco...', readFailed: 'lettura non riuscita', expired: 'Sessione scaduta. Accedi di nuovo al pannello.', startServer: 'Avvia l’app con npm run serve per usare il convertitore Python esatto.', invalidPortrait: 'Il convertitore Python non ha restituito un ritratto valido.', saveNeedsServer: 'Salvataggio non riuscito. Avvia l’app con `npm run serve` per modificare il database giocatori.', saveHttpError: ({ status }) => `Salvataggio database giocatori non riuscito (HTTP ${status}).`, playerNotFound: ({ id }) => `Giocatore non trovato: ${id}`, stat: { pace: 'Velocità', shooting: 'Tiro', passing: 'Passaggio', dribbling: 'Dribbling', defending: 'Difesa', physical: 'Fisico', reflexes: 'Riflessi', handling: 'Presa', positioning: 'Posizionamento' }, positionOption: { GK: 'Portiere', DEF: 'Difensore', MID: 'Centrocampista', FWD: 'Attaccante' }, tactical: { posesion: 'Possesso', presion: 'Pressing', contra: 'Contropiede' } },
    narrator: {
      player: 'Giocatore', phases: { corner: 'da calcio d’angolo', free_kick: 'su punizione', penalty: 'dal dischetto', counter: 'in transizione', default: 'nell’azione' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} legge l’azione, la difesa si chiude e ${team} perde palla.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} prova a filtrare, ma la difesa di ${defender} accorcia.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contropiede di ${attacker} dopo il recupero! ${shooter} punta la porta…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} prova a cambiare ritmo, ma il passaggio lungo esce.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} scappa e ${defender} lo stende. L’arbitro va al taschino: rosso.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} cerca lo smarcamento e ${defender} arriva tardi. Fallo ${kind}.`, faltaPeligrosa: 'pericoloso', faltaPresion: 'in pressione', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} filtra per ${receiver}, ma la linea difensiva lo mette in fuorigioco.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — cross in area di ${attacker}; ${defender} vince di testa e libera.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} prova ad avanzare, ma ${defender} recupera e allontana il pallone.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} guadagna campo, ma ${defender} ripiega in blocco e chiude l’angolo di tiro.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} trova una finestra di tiro, ma ${defender} si oppone e mura.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} prova ${phase}, ma il tiro finisce fuori.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} prova ${phase} e ${keeper} risponde con una grande parata!${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} prende la rincorsa dal dischetto… GOOOL di ${team}! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — punizione di ${shooter}, supera la barriera… GOOOL di ${team}! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — cross di ${passer} e colpo di testa di ${shooter}… GOOOL di ${team}! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} libera ${shooter} dopo il movimento… GOOOL di ${team}! (${score})${xg}`, default: ({ m }) => `Min ${m}' — azione.`,
    },
    scene: {
      badge: { penalty: 'RIGORE', free_kick: 'PUNIZIONE', corner: 'CORNER', gol: 'GOL', parada: 'PARATA', tiro_fuera: 'TIRO FUORI', bloqueo: 'MURO', roja: 'ROSSO', falta: 'FALLO', fuera_juego: 'FUORIGIOCO', despeje: 'RINVIO', perdida: 'RECUPERO', pase_fuera: 'PASSAGGIO LUNGO', default: 'AZIONE' }, role: { protagonist: 'Protagonista', scorer: 'Marcatore', shooter: 'Tiratore', assistant: 'Assistente', keeper: 'Portiere', defender: 'Difensore', receiver: 'Ricevente' }, title: { midfield_pass: 'Passaggio a centrocampo', defensive_pass: 'Uscita dal basso', defensive_recovery: 'Recupero difensivo', shot: 'Tiro', cross: 'Cross in area', free_kick: 'Punizione', free_kick_goal: 'Gol su punizione', penalty: 'Rigore', penalty_goal: 'Gol su rigore', shot_goal: 'Gol su tiro', shot_goal_alt: 'Gol su tiro', header_goal: 'Gol di testa', yellow_foul: 'Fallo e giallo', red_foul: 'Fallo e rosso', goal_kick: 'Rimessa dal fondo' }, alt: { midfield_pass: 'Scena pixelart di un passaggio a centrocampo', defensive_pass: 'Scena pixelart di un passaggio in difesa', defensive_recovery: 'Scena pixelart di un recupero difensivo', shot: 'Scena pixelart di un attaccante al tiro', cross: 'Scena pixelart di un cross in area', free_kick: 'Scena pixelart di una punizione', free_kick_goal: 'Scena pixelart di una punizione pericolosa', penalty: 'Scena pixelart di un rigore', penalty_goal: 'Scena pixelart di un gol su rigore', shot_goal: 'Scena pixelart di un gol su tiro', shot_goal_alt: 'Scena pixelart alternativa di un gol su tiro', header_goal: 'Scena pixelart di un gol di testa', yellow_foul: 'Scena pixelart di un fallo con cartellino giallo', red_foul: 'Scena pixelart di un fallo con cartellino rosso', goal_kick: 'Scena pixelart di una rimessa dal fondo' }, highlight: 'Highlight', goalStamp: 'GOL!', headline: { gol: ({ attacker }) => `Gol di ${attacker}`, parada: ({ keeper }) => `Parata di ${keeper}`, tiro_fuera: ({ shooter }) => `Tiro fuori di ${shooter}`, bloqueo: ({ defender }) => `Muro di ${defender}`, faltaRoja: 'Fallo duro', falta: 'Fallo tattico', fuera_juego: 'Fuorigioco', despeje: 'La difesa libera', pase_fuera: 'Passaggio troppo lungo', perdida: 'Recupero difensivo', default: ({ attacker }) => `${attacker} non trova il tiro` },
    },
    achievements: { Campeón: 'Campione', Subcampeón: 'Vicecampione', Semifinal: 'Semifinale', 'Cuartos de final': 'Quarti di finale' },
    eras: { Actual: 'Attuale' },
    nations: COMMON_NATIONS.it,
    items: COMMON_ITEMS.it,
  },
};

let currentLanguage = DEFAULT_LANGUAGE;

function getByPath(source, path) {
  return path.split('.').reduce((node, part) => (node == null ? undefined : node[part]), source);
}

function interpolate(template, vars = {}) {
  if (typeof template === 'function') return template(vars);
  return String(template).replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

function normalizeLanguage(language) {
  const code = String(language || '').toLowerCase().split('-')[0];
  return LANGUAGE_CODES.has(code) ? code : null;
}

function storageLanguage() {
  try {
    return normalizeLanguage(globalThis.localStorage?.getItem(STORAGE_KEY));
  } catch (_) {
    return null;
  }
}

function browserLanguage() {
  const nav = globalThis.navigator;
  const languages = Array.isArray(nav?.languages) && nav.languages.length
    ? nav.languages
    : [nav?.language || nav?.userLanguage].filter(Boolean);
  for (const language of languages) {
    const normalized = normalizeLanguage(language);
    if (normalized) return normalized;
  }
  return DEFAULT_LANGUAGE;
}

function applyDocumentLanguage() {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = currentLanguage;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  const footer = document.querySelector('.app-footer');
  if (footer) footer.textContent = t('meta.footer');
}

export function initLanguage() {
  currentLanguage = storageLanguage() || browserLanguage();
  applyDocumentLanguage();
  return currentLanguage;
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  const normalized = normalizeLanguage(language) || DEFAULT_LANGUAGE;
  currentLanguage = normalized;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, normalized);
  } catch (_) {
    /* localStorage can be unavailable in restricted contexts. */
  }
  applyDocumentLanguage();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new window.CustomEvent('tdl:languagechange', { detail: { language: normalized } }));
  }
  return normalized;
}

export function t(key, vars = {}) {
  const value = getByPath(DICTIONARIES[currentLanguage], key);
  const fallback = getByPath(DICTIONARIES[DEFAULT_LANGUAGE], key);
  return interpolate(value ?? fallback ?? key, vars);
}

function lookup(section, value) {
  const original = String(value ?? '');
  if (!original) return original;
  return DICTIONARIES[currentLanguage]?.[section]?.[original]
    ?? DICTIONARIES[DEFAULT_LANGUAGE]?.[section]?.[original]
    ?? original;
}

export function localizeNation(value) {
  return lookup('nations', value);
}

export function localizeTeamName(value) {
  return localizeNation(value);
}

export function localizeAchievement(value) {
  return lookup('achievements', value);
}

export function localizeEra(value) {
  return lookup('eras', value);
}

export function localizeTrait(value) {
  return DICTIONARIES[currentLanguage]?.card?.trait?.[value]
    ?? DICTIONARIES[DEFAULT_LANGUAGE]?.card?.trait?.[value]
    ?? String(value ?? '');
}

export function localizeItem(item, field) {
  const id = item?.id;
  if (field === 'type') {
    return DICTIONARIES[currentLanguage]?.card?.itemType?.[item?.type]
      ?? DICTIONARIES[DEFAULT_LANGUAGE]?.card?.itemType?.[item?.type]
      ?? String(item?.type ?? '');
  }
  return DICTIONARIES[currentLanguage]?.items?.[id]?.[field]
    ?? DICTIONARIES[DEFAULT_LANGUAGE]?.items?.[id]?.[field]
    ?? String(item?.[field] ?? '');
}

export function localizeOpponentName(opponent) {
  if (!opponent) return '';
  return `${localizeNation(opponent.name)} ${opponent.year}`;
}

export function sceneTitle(key) {
  return t(`scene.title.${key}`);
}

export function sceneAlt(key) {
  return t(`scene.alt.${key}`);
}
