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
    presion_alta: { name: 'Presión alta', desc: '+4% de robo, −1,5% defensa.' },
    contraataque: { name: 'Contraataque letal', desc: '+3% al ataque.' },
    muralla: { name: 'Muralla defensiva', desc: '+2,5 defensa.' },
    localia: { name: 'Localía', desc: '+2,5% a todos los ratings de equipo.' },
    botines_tacos: { name: 'Botines de tacos', desc: '+2 a la defensa de la zaga.' },
    guantes_paradon: { name: 'Guantes de paradón', desc: '+2 al rating de portero.' },
    medias_suerte: { name: 'Medias de la suerte', desc: '+1,5 a ataque y mediocampo.' },
    pizarra_mister: { name: 'Pizarra del míster', desc: '+1 a los cuatro ratings del equipo.' },
    bloque_bajo: { name: 'Bloque bajo', desc: '+3% defensa, −1,5% mediocampo.' },
    laterales_profundos: { name: 'Laterales profundos', desc: '+3% ataque, −1,5% defensa.' },
    vertigo: { name: 'Vértigo', desc: '+4% ataque, −2% mediocampo.' },
    juego_posicion: { name: 'Juego de posición', desc: '+3% mediocampo, +1,5% ataque.' },
    gegenpressing: { name: 'Gegenpressing', desc: '+6% de robo, −2,5% defensa.' },
    contragolpe_ensayado: { name: 'Contragolpe ensayado', desc: '+3 a la definición en contraataques.' },
    balon_parado: { name: 'Pizarra a balón parado', desc: '+3 a la definición en córners y tiros libres.' },
    remontada: { name: 'Remontada', desc: 'Si vas perdiendo, +2% extra de empuje por gol de desventaja.' },
    cerrojo_final: { name: 'Cerrojo final', desc: '+3 a la defensa del minuto 75 en adelante.' },
    pena_maxima: { name: 'Pena máxima', desc: 'Provocas más penaltis y los conviertes mejor.' },
    falso_nueve: { name: 'Falso nueve', desc: '+3% mediocampo, −1,5% ataque.' },
    salida_lavolpiana: { name: 'Salida lavolpiana', desc: '+4% ataque, −2,5% defensa.' },
    dormir_partido: { name: 'Dormir el partido', desc: '+3% defensa, −1,5% ataque.' },
    marcaje_al_hombre: { name: 'Marcaje al hombre', desc: '+4% defensa, −2,5% mediocampo.' },
    linea_adelantada: { name: 'Línea adelantada', desc: '+3% mediocampo, −1,5% defensa.' },
    jauria: { name: 'Jauría', desc: '+3% ataque, −1,5% mediocampo.' },
    doble_pivote: { name: 'Doble pivote', desc: '+4% mediocampo, −2% ataque.' },
    ojeador_estrella: { name: 'Ojeador estrella', desc: '+1 carta a elegir en cada sobre de jugadores.' },
    director_deportivo: { name: 'Director deportivo', desc: '+1 objeto a elegir en cada sobre.' },
    banquillo_lujo: { name: 'Banquillo de lujo', desc: '+1 carta a elegir en los sobres de jugadores y de objetos.' },
    duodecimo_jugador: { name: 'Duodécimo jugador', desc: '+2 de química de equipo: la grada empuja.' },
    representante_corrupto: { name: 'Representante corrupto', desc: 'Un jugador utilizará tu equipo como trampolín. Asegúrate de que sea vendido, su representante te recompensará.' },
  },
  en: {
    botas_oro: { name: 'Golden Boots', desc: '+2.5 to forward-line attack.' },
    guantes_magicos: { name: 'Magic Gloves', desc: '+3 to goalkeeper rating.' },
    capitania: { name: 'Captaincy', desc: '+1.5 to attack, midfield, and defense.' },
    brazalete_lider: { name: 'Leader’s Armband', desc: '+2 to midfield.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% midfield, −2.5% defense.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% defense, −2.5% attack.' },
    presion_alta: { name: 'High Press', desc: '+4% steal rate, −1.5% defense.' },
    contraataque: { name: 'Lethal Counterattack', desc: '+3% to attack.' },
    muralla: { name: 'Defensive Wall', desc: '+2.5 defense.' },
    localia: { name: 'Home Advantage', desc: '+2.5% to all team ratings.' },
    botines_tacos: { name: 'Studded Boots', desc: '+2 to back-line defense.' },
    guantes_paradon: { name: 'Shot-stopper Gloves', desc: '+2 to goalkeeper rating.' },
    medias_suerte: { name: 'Lucky Socks', desc: '+1.5 to attack and midfield.' },
    pizarra_mister: { name: 'Manager’s Board', desc: '+1 to all four team ratings.' },
    bloque_bajo: { name: 'Low Block', desc: '+3% defense, −1.5% midfield.' },
    laterales_profundos: { name: 'Overlapping Fullbacks', desc: '+3% attack, −1.5% defense.' },
    vertigo: { name: 'Vertigo', desc: '+4% attack, −2% midfield.' },
    juego_posicion: { name: 'Positional Play', desc: '+3% midfield, +1.5% attack.' },
    gegenpressing: { name: 'Gegenpressing', desc: '+6% steal rate, −2.5% defense.' },
    contragolpe_ensayado: { name: 'Rehearsed Counter', desc: '+3 to finishing on counterattacks.' },
    balon_parado: { name: 'Set-piece Playbook', desc: '+3 to finishing on corners and free kicks.' },
    remontada: { name: 'Comeback', desc: 'When trailing, +2% extra push per goal down.' },
    cerrojo_final: { name: 'Final Bolt', desc: '+3 defense from minute 75 onward.' },
    pena_maxima: { name: 'Spot Kick', desc: 'You win more penalties and convert them better.' },
    falso_nueve: { name: 'False Nine', desc: '+3% midfield, −1.5% attack.' },
    salida_lavolpiana: { name: 'La Volpe Build-up', desc: '+4% attack, −2.5% defense.' },
    dormir_partido: { name: 'Tempo Control', desc: '+3% defense, −1.5% attack.' },
    marcaje_al_hombre: { name: 'Man-marking', desc: '+4% defense, −2.5% midfield.' },
    linea_adelantada: { name: 'High Line', desc: '+3% midfield, −1.5% defense.' },
    jauria: { name: 'Wolfpack', desc: '+3% attack, −1.5% midfield.' },
    doble_pivote: { name: 'Double Pivot', desc: '+4% midfield, −2% attack.' },
    ojeador_estrella: { name: 'Star Scout', desc: '+1 card to choose from in every player pack.' },
    director_deportivo: { name: 'Sporting Director', desc: '+1 item to choose from in every pack.' },
    banquillo_lujo: { name: 'Deluxe Bench', desc: '+1 card to choose from in player and item packs.' },
    duodecimo_jugador: { name: 'Twelfth Man', desc: '+2 team chemistry: the crowd pushes.' },
    representante_corrupto: { name: 'Corrupt Agent', desc: 'A player will use your team as a springboard. Make sure he gets sold — his agent will reward you.' },
  },
  fr: {
    botas_oro: { name: 'Crampons d’or', desc: '+2,5 à l’attaque de la ligne offensive.' },
    guantes_magicos: { name: 'Gants magiques', desc: '+3 à la note du gardien.' },
    capitania: { name: 'Capitanat', desc: '+1,5 en attaque, milieu et défense.' },
    brazalete_lider: { name: 'Brassard de leader', desc: '+2 au milieu.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% milieu, −2,5% défense.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% défense, −2,5% attaque.' },
    presion_alta: { name: 'Pressing haut', desc: '+4% de récupération, −1,5% défense.' },
    contraataque: { name: 'Contre-attaque létale', desc: '+3% en attaque.' },
    muralla: { name: 'Muraille défensive', desc: '+2,5 défense.' },
    localia: { name: 'Avantage du terrain', desc: '+2,5% à toutes les notes d’équipe.' },
    botines_tacos: { name: 'Crampons vissés', desc: '+2 à la défense de l’arrière-garde.' },
    guantes_paradon: { name: 'Gants d’arrêt', desc: '+2 à la note du gardien.' },
    medias_suerte: { name: 'Chaussettes porte-bonheur', desc: '+1,5 en attaque et au milieu.' },
    pizarra_mister: { name: 'Tableau du coach', desc: '+1 aux quatre notes de l’équipe.' },
    bloque_bajo: { name: 'Bloc bas', desc: '+3% défense, −1,5% milieu.' },
    laterales_profundos: { name: 'Latéraux offensifs', desc: '+3% attaque, −1,5% défense.' },
    vertigo: { name: 'Vertige', desc: '+4% attaque, −2% milieu.' },
    juego_posicion: { name: 'Jeu de position', desc: '+3% milieu, +1,5% attaque.' },
    gegenpressing: { name: 'Gegenpressing', desc: '+6% de récupération, −2,5% défense.' },
    contragolpe_ensayado: { name: 'Contre répété', desc: '+3 à la finition en contre-attaque.' },
    balon_parado: { name: 'Cahier des coups de pied arrêtés', desc: '+3 à la finition sur corners et coups francs.' },
    remontada: { name: 'Remontada', desc: 'Mené au score, +2% de poussée par but de retard.' },
    cerrojo_final: { name: 'Verrou final', desc: '+3 défense à partir de la 75e minute.' },
    pena_maxima: { name: 'Penalty', desc: 'Vous obtenez plus de penaltys et les convertissez mieux.' },
    falso_nueve: { name: 'Faux neuf', desc: '+3% milieu, −1,5% attaque.' },
    salida_lavolpiana: { name: 'Relance lavolpienne', desc: '+4% attaque, −2,5% défense.' },
    dormir_partido: { name: 'Endormir le match', desc: '+3% défense, −1,5% attaque.' },
    marcaje_al_hombre: { name: 'Marquage individuel', desc: '+4% défense, −2,5% milieu.' },
    linea_adelantada: { name: 'Ligne haute', desc: '+3% milieu, −1,5% défense.' },
    jauria: { name: 'Meute', desc: '+3% attaque, −1,5% milieu.' },
    doble_pivote: { name: 'Double pivot', desc: '+4% milieu, −2% attaque.' },
    ojeador_estrella: { name: 'Recruteur vedette', desc: '+1 carte au choix dans chaque pack de joueurs.' },
    director_deportivo: { name: 'Directeur sportif', desc: '+1 objet au choix dans chaque pack.' },
    banquillo_lujo: { name: 'Banc de luxe', desc: '+1 carte au choix dans les packs de joueurs et d’objets.' },
    duodecimo_jugador: { name: 'Douzième homme', desc: '+2 d’alchimie d’équipe : le public pousse.' },
    representante_corrupto: { name: 'Agent corrompu', desc: 'Un joueur utilisera votre équipe comme tremplin. Assurez-vous qu’il soit vendu, son agent vous récompensera.' },
  },
  pt: {
    botas_oro: { name: 'Chuteiras de ouro', desc: '+2,5 ao ataque da linha ofensiva.' },
    guantes_magicos: { name: 'Luvas mágicas', desc: '+3 ao rating de goleiro.' },
    capitania: { name: 'Capitania', desc: '+1,5 em ataque, meio-campo e defesa.' },
    brazalete_lider: { name: 'Braçadeira de líder', desc: '+2 ao meio-campo.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% meio-campo, −2,5% defesa.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% defesa, −2,5% ataque.' },
    presion_alta: { name: 'Pressão alta', desc: '+4% de roubo, −1,5% defesa.' },
    contraataque: { name: 'Contra-ataque letal', desc: '+3% ao ataque.' },
    muralla: { name: 'Muralha defensiva', desc: '+2,5 defesa.' },
    localia: { name: 'Fator casa', desc: '+2,5% a todos os ratings da equipe.' },
    botines_tacos: { name: 'Chuteiras de travas', desc: '+2 à defesa da zaga.' },
    guantes_paradon: { name: 'Luvas de defesaça', desc: '+2 ao rating de goleiro.' },
    medias_suerte: { name: 'Meias da sorte', desc: '+1,5 em ataque e meio-campo.' },
    pizarra_mister: { name: 'Prancheta do treinador', desc: '+1 aos quatro ratings da equipe.' },
    bloque_bajo: { name: 'Bloco baixo', desc: '+3% defesa, −1,5% meio-campo.' },
    laterales_profundos: { name: 'Laterais ofensivos', desc: '+3% ataque, −1,5% defesa.' },
    vertigo: { name: 'Vertigem', desc: '+4% ataque, −2% meio-campo.' },
    juego_posicion: { name: 'Jogo de posição', desc: '+3% meio-campo, +1,5% ataque.' },
    gegenpressing: { name: 'Gegenpressing', desc: '+6% de roubo, −2,5% defesa.' },
    contragolpe_ensayado: { name: 'Contra-ataque ensaiado', desc: '+3 à finalização em contra-ataques.' },
    balon_parado: { name: 'Prancheta de bola parada', desc: '+3 à finalização em escanteios e faltas.' },
    remontada: { name: 'Virada', desc: 'Perdendo, +2% extra de impulso por gol de desvantagem.' },
    cerrojo_final: { name: 'Ferrolho final', desc: '+3 de defesa do minuto 75 em diante.' },
    pena_maxima: { name: 'Pênalti', desc: 'Você ganha mais pênaltis e os converte melhor.' },
    falso_nueve: { name: 'Falso nove', desc: '+3% meio-campo, −1,5% ataque.' },
    salida_lavolpiana: { name: 'Saída lavolpiana', desc: '+4% ataque, −2,5% defesa.' },
    dormir_partido: { name: 'Cozinhar o jogo', desc: '+3% defesa, −1,5% ataque.' },
    marcaje_al_hombre: { name: 'Marcação homem a homem', desc: '+4% defesa, −2,5% meio-campo.' },
    linea_adelantada: { name: 'Linha alta', desc: '+3% meio-campo, −1,5% defesa.' },
    jauria: { name: 'Matilha', desc: '+3% ataque, −1,5% meio-campo.' },
    doble_pivote: { name: 'Duplo pivô', desc: '+4% meio-campo, −2% ataque.' },
    ojeador_estrella: { name: 'Olheiro estrela', desc: '+1 carta para escolher em cada pacote de jogadores.' },
    director_deportivo: { name: 'Diretor esportivo', desc: '+1 objeto para escolher em cada pacote.' },
    banquillo_lujo: { name: 'Banco de luxo', desc: '+1 carta nos pacotes de jogadores e de objetos.' },
    duodecimo_jugador: { name: 'Décimo segundo jogador', desc: '+2 de química de equipe: a torcida empurra.' },
    representante_corrupto: { name: 'Empresário corrupto', desc: 'Um jogador usará sua equipe como trampolim. Garanta que ele seja vendido, seu empresário vai recompensá-lo.' },
  },
  it: {
    botas_oro: { name: 'Scarpe d’oro', desc: '+2,5 all’attacco della linea offensiva.' },
    guantes_magicos: { name: 'Guanti magici', desc: '+3 al rating del portiere.' },
    capitania: { name: 'Capitanato', desc: '+1,5 ad attacco, centrocampo e difesa.' },
    brazalete_lider: { name: 'Fascia da leader', desc: '+2 al centrocampo.' },
    tiki_taka: { name: 'Tiki-taka', desc: '+4% centrocampo, −2,5% difesa.' },
    catenaccio: { name: 'Catenaccio', desc: '+4% difesa, −2,5% attacco.' },
    presion_alta: { name: 'Pressing alto', desc: '+4% recuperi, −1,5% difesa.' },
    contraataque: { name: 'Contropiede letale', desc: '+3% all’attacco.' },
    muralla: { name: 'Muraglia difensiva', desc: '+2,5 difesa.' },
    localia: { name: 'Fattore campo', desc: '+2,5% a tutti i rating di squadra.' },
    botines_tacos: { name: 'Scarpe tassellate', desc: '+2 alla difesa del reparto arretrato.' },
    guantes_paradon: { name: 'Guanti da parata', desc: '+2 al rating del portiere.' },
    medias_suerte: { name: 'Calzettoni portafortuna', desc: '+1,5 ad attacco e centrocampo.' },
    pizarra_mister: { name: 'Lavagna del mister', desc: '+1 ai quattro rating della squadra.' },
    bloque_bajo: { name: 'Blocco basso', desc: '+3% difesa, −1,5% centrocampo.' },
    laterales_profundos: { name: 'Terzini di spinta', desc: '+3% attacco, −1,5% difesa.' },
    vertigo: { name: 'Vertigine', desc: '+4% attacco, −2% centrocampo.' },
    juego_posicion: { name: 'Gioco di posizione', desc: '+3% centrocampo, +1,5% attacco.' },
    gegenpressing: { name: 'Gegenpressing', desc: '+6% recuperi, −2,5% difesa.' },
    contragolpe_ensayado: { name: 'Ripartenza provata', desc: '+3 alla finalizzazione in contropiede.' },
    balon_parado: { name: 'Schemi su palla inattiva', desc: '+3 alla finalizzazione su corner e punizioni.' },
    remontada: { name: 'Rimonta', desc: 'In svantaggio, +2% di spinta extra per gol di distacco.' },
    cerrojo_final: { name: 'Catenaccio finale', desc: '+3 di difesa dal minuto 75 in poi.' },
    pena_maxima: { name: 'Rigore', desc: 'Conquisti più rigori e li converti meglio.' },
    falso_nueve: { name: 'Falso nove', desc: '+3% centrocampo, −1,5% attacco.' },
    salida_lavolpiana: { name: 'Costruzione lavolpiana', desc: '+4% attacco, −2,5% difesa.' },
    dormir_partido: { name: 'Addormentare la partita', desc: '+3% difesa, −1,5% attacco.' },
    marcaje_al_hombre: { name: 'Marcatura a uomo', desc: '+4% difesa, −2,5% centrocampo.' },
    linea_adelantada: { name: 'Linea alta', desc: '+3% centrocampo, −1,5% difesa.' },
    jauria: { name: 'Muta di caccia', desc: '+3% attacco, −1,5% centrocampo.' },
    doble_pivote: { name: 'Doppio mediano', desc: '+4% centrocampo, −2% attacco.' },
    ojeador_estrella: { name: 'Osservatore stellare', desc: '+1 carta tra cui scegliere in ogni pacchetto giocatori.' },
    director_deportivo: { name: 'Direttore sportivo', desc: '+1 oggetto tra cui scegliere in ogni pacchetto.' },
    banquillo_lujo: { name: 'Panchina di lusso', desc: '+1 carta nei pacchetti giocatori e oggetti.' },
    duodecimo_jugador: { name: 'Dodicesimo uomo', desc: '+2 di chimica di squadra: il pubblico spinge.' },
    representante_corrupto: { name: 'Procuratore corrotto', desc: 'Un giocatore userà la tua squadra come trampolino. Assicurati che venga venduto, il suo procuratore ti ricompenserà.' },
  },
};

// Números en letras para las crónicas de prensa (hasta seis; más allá, cifra).
// ptF: femenino portugués ("duas assistências").
const NUM_WORDS = {
  es: { 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis' },
  en: { 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' },
  fr: { 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six' },
  pt: { 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis' },
  ptF: { 2: 'duas', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis' },
  it: { 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei' },
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
      continueRun: 'Continuar partida',
      continueFloor: ({ level }) => `Nivel ${level}`,
      newRunConfirm: 'Tienes una partida en curso. Empezar una nueva la borrará. ¿Seguro?',
      runBusyTitle: 'Partida abierta en otra pestaña',
      runBusyBody: 'Esta partida ya está abierta en otra pestaña o ventana. Ciérrala y pulsa Reintentar para continuar aquí.',
      runBusyRetry: 'Reintentar',
      backToMenu: 'Volver al menú',
      wiki: 'Wiki',
      disclaimer: 'Proyecto no oficial y no afiliado. Cartas con datos ficticios; sin marcas registradas.',
      liveNow: ({ n }) => `${n} jugando ahora`,
      totalRuns: ({ n }) => `${n} partidas jugadas`,
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
      nationTitle: 'Sobre de selecciones',
      nationHint: 'Sobre especial: elige una selección histórica y llévate al jugador que quieras.',
      nationOpen: 'Abrir sobre de selecciones',
      nationBadge: 'Selección',
      nationNew: ({ n }) => `${n} jugadores nuevos`,
      nationTopOvr: ({ ovr }) => `OVR máx. ${ovr}`,
      nationPickHint: 'Elige al jugador que quieras de esta selección para tu plantilla.',
      managerTitle: 'Sobre de director técnico',
      managerHint: 'El DT mejora a tu equipo y la química de sus connacionales. Elige uno: reemplaza al anterior.',
      managerOpen: 'Abrir sobre de DT',
      managerDiscard: 'Descartar entrenadores',
      playerDiscard: 'Descartar jugadores',
      itemDiscard: 'Descartar objetos',
      review: 'Revisar mi equipo',
      reviewTitle: ({ count }) => `Tu plantilla (${count} cartas)`,
      reviewManager: 'Ver mi DT',
      reviewManagerTitle: 'Tu director técnico',
      reviewItems: 'Ver mis objetos',
      reviewItemsTitle: ({ count }) => `Tus objetos (${count})`,
      corruptoTitle: 'Sobre del representante',
      corruptoHint: 'Un jugador usará tu equipo como trampolín. Ábrelo y entrará en tu once.',
      corruptoOpen: 'Abrir sobre',
      shinyTitle: 'Sobre del representante',
      shinyHint: 'Tu recompensa: elige una joya con +10 a todas sus estadísticas.',
      shinyOpen: 'Abrir sobre Shiny',
      shinySale: ({ name }) => `El jugador ${name} ha sido vendido con éxito a un club importante de medio oriente. Su representante quiere recompensarte, abre este sobre.`,
    },
    card: {
      owned: 'Ya en tu plantilla',
      manager: { badge: 'DT' },
      itemStack: ({ n }) => `×${n} copias acumuladas`,
      itemStackNote: 'Cada copia extra rinde la mitad',
      rarity: { common: 'Común', rare: 'Rara', epic: 'Épica', legend: 'Leyenda', corrupto: 'Corrupto', shiny: 'Shiny' },
      position: { GK: 'POR', DEF: 'DEF', MID: 'MED', FWD: 'DEL', ENG: 'ENG' },
      line: { GK: 'Portería', DEF: 'Defensa', MID: 'Mediocampo', FWD: 'Ataque', ENG: 'Enganche' },
      stat: { pace: 'RIT', shooting: 'TIR', passing: 'PAS', dribbling: 'REG', defending: 'DEF', physical: 'FÍS', reflexes: 'REF', handling: 'BLO', positioning: 'COL' },
      trait: { Francotirador: 'Francotirador', Cañón: 'Cañón', Muro: 'Muro', Motor: 'Motor', Maestro: 'Maestro', Líbero: 'Líbero', Paradón: 'Paradón', Killer: 'Killer', Velocista: 'Velocista', Especialista: 'Especialista', Penalero: 'Penalero', Capitán: 'Capitán', Garra: 'Garra', Mariscal: 'Mariscal', Roto: 'Roto' },
      synergy: ({ type }) => `Sinergia: ${type}`,
      itemType: { equipamiento: 'equipamiento', tactica: 'táctica', reliquia: 'reliquia' },
    },
    build: {
      title: 'Arma tu equipo',
      nextOpponent: 'Próximo rival',
      viewLineup: 'Ver once',
      manager: 'Director técnico',
      noManager: 'Sin DT todavía',
      chemistry: 'Química',
      chemNation: 'Nación',
      chemEra: 'Época',
      chemBoost: 'Duodécimo jugador',
      fromItems: 'Aporte de objetos',
      tacticalBoard: 'Tablero tactico',
      formationAria: 'Formación',
      roster: 'Suplentes',
      benchAll: 'Posición',
      benchFilterAria: 'Filtrar suplentes por línea',
      benchCountryAll: 'País',
      benchCountryAria: 'Filtrar suplentes por país',
      rosterCount: ({ total, missing }) => `${total} cartas · ${missing} hueco${missing === 1 ? '' : 's'} libre${missing === 1 ? '' : 's'}`,
      noSubs: 'Sin suplentes disponibles.',
      noItems: 'Sin objetos todavía.',
      activeItems: ({ count }) => `Objetos activos (${count})`,
      play: 'Jugar partido',
      missing: ({ count }) => `Completa el once (${count} faltan)`,
      statsDialog: 'Estadísticas del jugador',
      playerDragAria: ({ name }) => `${name}, arrastrar para mover o tocar para quitar del once`,
      playerSealedAria: ({ name }) => `${name}, fijo en el once: no se puede mover ni quitar`,
      emptyAria: ({ label }) => `Hueco ${label}, añadir jugador`,
      viewStatsAria: ({ name }) => `Ver estadísticas de ${name}`,
      viewItemAria: ({ name }) => `Ver objeto ${name}`,
      benchAria: ({ name }) => `${name}, arrastrar al campo o tocar para alinear`,
      suspended: 'Expulsado: no disponible este partido',
      benchSuspendedAria: ({ name }) => `${name}, expulsado el partido anterior: no puede alinearse`,
      injured: 'Lesionado: en recuperación',
      benchInjuredAria: ({ name }) => `${name}, lesionado: en recuperación, no puede alinearse`,
      noCandidates: ({ label }) => `No tienes suplentes compatibles para ${label}. Consíguelos en los sobres.`,
      pickerHead: ({ label }) => `${label} — elige quién entra`,
      targetPickerHead: ({ name }) => `${name} — elige dónde entra`,
      openSlot: 'Hueco libre',
    },
    scouting: {
      report: 'Informe del rival',
      manager: 'DT',
      formation: ({ formation }) => `Formación ${formation}`,
      strength: 'Fuerza',
      opponentEleven: 'Once principal del rival',
      note: 'Ratings de juego para la Copa de Leyendas. Once histórico representativo del torneo.',
      continue: 'Armar mi equipo',
    },
    squadIntro: {
      kicker: 'Tu equipo está listo',
      cards: ({ count }) => `${count} cartas`,
      eleven: 'Once titular',
      bench: 'Suplentes',
      note: 'Esta es tu plantilla de arranque. Toca cualquier carta para ver sus atributos; antes de cada partido podrás retocar el once.',
      continue: 'Abrir mi primer sobre',
    },
    ratings: { attack: 'ATA', midfield: 'MED', defense: 'DEF', gk: 'POR', physical: 'FÍS' },
    tactics: {
      style: 'Estilo',
      styleFromManager: 'Lo marca tu director técnico',
      custom: 'Personalizada',
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
      reds: 'Expulsados',
      manager: 'Director técnico',
      injuries: 'Lesionados',
      warmup: 'calent.',
      injuryMatchesTitle: ({ n }) => n > 0 ? `Se pierde ${n} partido${n === 1 ? '' : 's'}` : 'No se pierde ningún partido',
      saves: 'Paradas',
      lastMatch: 'Último partido',
      lastTactic: 'Tu táctica',
      subs: 'Cambios',
      gameOver: 'Fin de la run',
      floorsReached: 'pisos alcanzados',
      newRecord: '★ Nuevo récord',
      best: ({ best }) => `Mejor marca: ${best}`,
      winsRoster: ({ wins, count }) => `${wins} victoria${wins === 1 ? '' : 's'} · plantilla de ${count} jugadores`,
      route: 'Recorrido',
      finalSquad: 'Plantilla final',
      playAgain: 'Jugar de nuevo',
      endRun: 'Terminar partida',
      replay: 'Volver a jugar',
      pathLevel: ({ level }) => `Nv ${level}`,
    },
    carryover: {
      title: 'Elige un jugador para tu próxima run',
      hint: 'Se incorporará a un equipo nuevo y aleatorio.',
      back: 'Volver',
    },
    leaderboard: {
      floor: ({ floor }) => `Piso ${floor}`,
      updating: 'Actualizando ranking...',
      readOnly: 'Servidor sin escritura: mostrando el ranking guardado.',
      rank: ({ rank }) => `Tu run quedó #${rank}.`,
      notTop: 'No entraste en el top 20.',
      title: 'Ranking histórico',
      top: 'Top 20',
      titleWeekly: 'Ranking semanal',
      topWeekly: 'Top 20 semanal',
      empty: 'Sin marcas todavía.',
      lineup: 'Último once',
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
      tabPlayers: 'Jugadores',
      tabManagers: 'Directores técnicos',
      tabOpponents: 'Rivales',
      tabItems: 'Objetos',
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
      managerYear: 'Año (época)',
      rarity: 'Rareza',
      ovr: 'OVR calculado',
      trait: 'Rasgo',
      noTrait: 'Sin rasgo',
      tacticalType: 'Tipo táctico',
      noType: 'Sin tipo',
      saveStats: 'Guardar estadísticas',
      deletePlayer: 'Eliminar jugador',
      deleteConfirm: ({ name }) => `¿Eliminar a ${name || 'este jugador'}? No se puede deshacer.`,
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
      faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} se escapa y ${defender} lo baja. El árbitro va al bolsillo: ¡roja directa!`,
      faltaSegundaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${defender} vuelve a derribar a ${receiver}. Segunda amarilla… ¡y roja!`,
      faltaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} busca el desmarque y ${defender} llega tarde. Falta y amarilla para ${defender}.`,
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
      badge: { penalty: 'PENAL', free_kick: 'TIRO LIBRE', corner: 'CÓRNER', gol: 'GOL', parada: 'ATAJADA', tiro_fuera: 'TIRO FUERA', bloqueo: 'BLOQUEO', roja: 'ROJA', amarilla: 'AMARILLA', falta: 'FALTA', fuera_juego: 'OFFSIDE', despeje: 'DESPEJE', perdida: 'ROBO', pase_fuera: 'PASE LARGO', default: 'JUGADA' },
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
    injury: {
      severity: { simple: 'leve', moderada: '1 partido', grave: '3 partidos', muy_grave: '6 partidos' },
      types: {
        simple: ['molestia muscular', 'contusión', 'sobrecarga leve', 'desgarro mínimo'],
        moderada: ['distensión muscular', 'torcedura de rodilla', 'contractura', 'sobrecarga muscular'],
        grave: ['rotura fibrilar', 'lesión de grado 2', 'luxación de hombro', 'microrrotura muscular'],
        muy_grave: ['rotura del ligamento cruzado', 'fractura de peroné', 'rotura del tendón de Aquiles', 'luxación grave de rodilla'],
      },
    },
    press: {
      masthead: 'La Gaceta de la Torre',
      edition: ({ level }) => `Edición especial · Piso ${level}`,
      caption: ({ name }) => `${name}, el jugador destacado del encuentro`,
      photoAlt: ({ name }) => `Retrato pixelart de ${name}`,
      headline: {
        winBig: [
          ({ team, figure }) => `Exhibición de ${team} con un ${figure} de leyenda`,
          ({ team, figure }) => `${team} arrasa con un recital firmado por ${figure}`,
          ({ team, figure }) => `${team} pasa por encima de su rival con un ${figure} estelar`,
          ({ team, figure }) => `${team} firma una goleada de época con ${figure} como estandarte`,
        ],
        win: [
          ({ team, figure }) => `${figure} guía a ${team} a una victoria de carácter`,
          ({ team, figure }) => `${team} conquista la noche de la mano de ${figure}`,
          ({ team, figure }) => `${figure} pone la rúbrica al triunfo de ${team}`,
          ({ team, figure }) => `${team} se impone con autoridad y ${figure} de bandera`,
        ],
        draw: [
          ({ team, opp }) => `${team} y ${opp} firman un empate con sabor a batalla`,
          ({ team, opp }) => `Reparto de puntos entre ${team} y ${opp} tras un pulso sin tregua`,
          ({ team, opp }) => `${team} y ${opp} se reparten el botín en un duelo de ida y vuelta`,
          ({ team, opp }) => `Ni ${team} ni ${opp} ceden: tablas que saben a poco para ambos`,
        ],
        loss: [
          ({ team, opp }) => `${opp} frena en seco la escalada de ${team}`,
          ({ team, opp }) => `${team} cae ante un ${opp} más práctico y pierde fuelle`,
          ({ team, opp }) => `${opp} aprovecha sus opciones y deja a ${team} sin premio`,
          ({ team, opp }) => `${team} tropieza y ${opp} le corta las alas en plena ascensión`,
        ],
      },
      lead: {
        win: [
          ({ team, opp, score, figure, feat }) => `La selección de ${team} se impuso por ${score} a la selección de ${opp} en un intenso encuentro que dejó grandes emociones de principio a fin. El protagonista absoluto de la noche fue ${figure}, quien firmó una actuación memorable al ${feat}, siendo determinante en cada uno de los momentos clave del partido.`,
          ({ team, opp, score, figure, feat }) => `${team} resolvió por ${score} ante ${opp} un partido vibrante que mantuvo en vilo a la grada hasta el pitido final. El nombre propio de la jornada fue ${figure}, capaz de ${feat} y de inclinar la balanza en los instantes decisivos, dejando la imagen de un equipo sólido y con hambre de seguir subiendo.`,
          ({ team, opp, score, figure, feat }) => `Noche redonda para ${team}, que superó por ${score} a ${opp} con autoridad y dejó claro que va en serio en esta Torre. El faro fue ${figure}, brillante al ${feat} y dueño del partido cada vez que tocó el balón en zona decisiva, para regocijo de una afición entregada.`,
          ({ team, opp, score, figure, feat }) => `Triunfo con galones de ${team}, que doblegó por ${score} a ${opp} en una noche de pulso alto y entrega de principio a fin. El que marcó el rumbo fue ${figure}, decisivo al ${feat} y dueño de los instantes que de verdad pesaron en el desenlace.`,
        ],
        draw: [
          ({ team, opp, score, figure, feat }) => `${team} y ${opp} firmaron un ${score} en un encuentro intenso en el que ninguno de los dos bajó los brazos. Si alguien sostuvo el pulso fue ${figure}, que se echó el equipo a la espalda al ${feat} y mantuvo viva la ilusión de los suyos hasta el pitazo final.`,
          ({ team, opp, score, figure, feat }) => `El ${score} final entre ${team} y ${opp} reflejó un duelo de ida y vuelta en el que ambos buscaron la victoria sin llegar a encontrarla. Por encima del resto asomó ${figure}, que tiró del carro al ${feat} y sostuvo la fe de los suyos cuando el partido reclamaba a gritos un líder.`,
          ({ team, opp, score, figure, feat }) => `Ni ${team} ni ${opp} se sacaron ventaja en un ${score} trabajado, de esos que se deciden por centímetros y acaban sin vencedor. El que más se acercó a romper el muro fue ${figure}, que tiró de galones al ${feat} y dejó destellos de su clase en los tramos más calientes.`,
          ({ team, opp, score, figure, feat }) => `Un ${score} sin ganador resumió el toma y daca entre ${team} y ${opp}, que se midieron de tú a tú sin reservarse nada. El más constante fue ${figure}, que sostuvo a los suyos al ${feat} cuando el duelo reclamaba un líder al que agarrarse.`,
        ],
        loss: [
          ({ team, opp, score, figure, feat }) => `La selección de ${opp} se impuso por ${score} a la selección de ${team} en un duelo áspero que se decidió por detalles. La gran figura del encuentro fue ${figure}, quien marcó diferencias al ${feat} y dejó sin respuestas al conjunto rival.`,
          ({ team, opp, score, figure, feat }) => `${opp} se llevó el duelo por ${score} ante un ${team} que lo intentó, pero chocó una y otra vez con la realidad del marcador. El gran nombre del encuentro fue ${figure}, que marcó diferencias al ${feat} y resultó decisivo para doblegar la resistencia de ${team}.`,
          ({ team, opp, score, figure, feat }) => `${opp} firmó un triunfo por ${score} sobre ${team} en un choque que controló en los momentos importantes. Su gran referente fue ${figure}, que marcó diferencias al ${feat} y se convirtió en una pesadilla para la zaga de ${team} durante toda la noche.`,
          ({ team, opp, score, figure, feat }) => `La selección de ${opp} doblegó por ${score} a la de ${team} en una pugna trabada que se rompió por los pequeños detalles. El gran protagonista fue ${figure}, que marcó diferencias al ${feat} y dejó a ${team} encadenado a la pizarra rival.`,
        ],
      },
      body: {
        opener: [
          ({ att, def, minute, scorer, how, score }) => `Desde el inicio, ${att} mostró una actitud ofensiva y una presión alta que complicó la salida de ${def}. La insistencia tuvo premio a los ${minute} minutos, cuando ${scorer} ${how} para poner el ${score} en el marcador. El gol dio confianza a los suyos, que comenzaron a controlar la posesión y a generar peligro constante por las bandas.`,
          ({ att, def, minute, scorer, how, score }) => `${att} salió decidido a marcar territorio y sometió a ${def} con una presión que ahogó su primera salida de balón. El esfuerzo encontró recompensa a los ${minute} minutos: ${scorer} ${how} para firmar el ${score}. Con la ventaja en el luminoso, los suyos se asentaron sobre el campo y empezaron a manejar los tiempos del partido a su antojo.`,
          ({ att, def, minute, scorer, how, score }) => `El guion lo escribió ${att} desde el primer minuto, volcado sobre el campo de ${def} y asfixiante en la presión arriba. El premio a la audacia llegó a los ${minute} minutos: ${scorer} ${how} para subir el ${score} al marcador. A partir de ahí, los suyos jugaron con la tranquilidad del que pega primero y golpea fuerte.`,
          ({ att, def, minute, scorer, how, score }) => `No tardó ${att} en marcar el guion: presión arriba y bandas profundas para encerrar a ${def} en su propio campo. La recompensa cayó a los ${minute} minutos, cuando ${scorer} ${how} y estrenó el ${score}. Con el primer golpe en el bolsillo, los suyos respiraron y empezaron a jugar al ritmo que más les convenía.`,
        ],
        scoreless: [
          ({ team, opp, keeper }) => `El primer tiempo fue un pulso táctico en el que ${team} y ${opp} se midieron sin conceder espacios. Las defensas ganaron la partida a los ataques y, cuando hizo falta, apareció ${keeper} para apagar los incendios dentro del área. Se llegó al descanso sin goles y con la sensación de que el partido se decidiría por un detalle.`,
          ({ team, opp, keeper }) => `La primera mitad se jugó como una partida de ajedrez: ${team} y ${opp} se anularon mutuamente y apenas dejaron resquicios entre líneas. Cada vez que el peligro asomó, fue ${keeper} quien puso orden bajo los palos. El descanso llegó con el cero en el marcador y la sospecha de que cualquier chispa rompería la igualdad.`,
          ({ team, opp, keeper }) => `El primer acto fue de máxima tensión y pocos espacios: ${team} y ${opp} se estudiaron sin querer arriesgar de más y fiaron su suerte a la solidez defensiva. ${keeper} tuvo que emplearse a fondo en los contados avisos que llegaron. El intermedio se alcanzó con el casillero a cero y todo por decidir.`,
          ({ team, opp, keeper }) => `La primera mitad fue de freno de mano: ${team} y ${opp} antepusieron no perder a arriesgar, y el balón circuló más por el medio que por las áreas. Cuando alguien se atrevió, ahí estaba ${keeper} para poner calma. Se llegó al descanso con el cero intacto y la sensación de un partido a cara o cruz.`,
        ],
        quiet: [
          ({ team, opp, keeper }) => `En la segunda mitad el marcador ya no se movió: ${team} y ${opp} intercambiaron aproximaciones sin claridad en los metros finales y cada intento murió en las manos de ${keeper} o en las botas de una defensa bien plantada. El duelo se cerró sin más sobresaltos, decidido por lo sembrado antes del descanso.`,
          ({ team, opp, keeper }) => `Tras el descanso el electrónico se quedó congelado: ${team} y ${opp} se asomaron al área contraria sin puntería en el último pase, y cuanto llegó a portería lo neutralizó ${keeper} o una defensa atenta a cada centro. El choque se fue apagando sin más alarmas, sentenciado por lo ocurrido antes del intermedio.`,
          ({ team, opp, keeper }) => `La reanudación no cambió el guion: ${team} y ${opp} se asomaron al área rival con más voluntad que acierto, y lo poco que inquietó se topó con ${keeper} o con una defensa muy ordenada. El marcador aguantó intacto hasta el final, fiel a lo visto en los primeros cuarenta y cinco minutos.`,
          ({ team, opp, keeper }) => `En la segunda parte el marcador echó el cerrojo: ${team} y ${opp} lo intentaron a ratos, pero sin profundidad ni último pase, y lo poco que llegó lo resolvió ${keeper} o una defensa concentrada. El duelo se fue apagando poco a poco, fiel al libreto de la primera mitad.`,
        ],
        red: [
          ({ player, team, minute }) => `El partido se complicó con la expulsión de ${player} a los ${minute} minutos, que dejó a ${team} en inferioridad y condicionó por completo el tramo final.`,
          ({ player, team, minute }) => `Todo se torció con la roja directa a ${player} en el minuto ${minute}: ${team} se quedó con uno menos y tuvo que reescribir su plan para el tramo decisivo.`,
          ({ player, team, minute }) => `El choque dio un vuelco con la tarjeta roja a ${player} en el minuto ${minute}: ${team} se vio obligado a jugar en inferioridad y a replegarse para proteger el resultado.`,
          ({ player, team, minute }) => `El encuentro se torció con la roja a ${player} en el minuto ${minute}: ${team} se quedó con uno menos y tuvo que apretar los dientes para sostener el resultado hasta el final.`,
        ],
        injury: {
          simple: [
            ({ player, team, minute, type }) => `${player} pidió el cambio a los ${minute}' por ${type} y dejó su sitio sobre la marcha, aunque el susto no fue a mayores.`,
            ({ player, team, minute, type }) => `${player} tuvo que ser retirado en el minuto ${minute} por ${type}: ${team} movió el banquillo, pero la cosa no pasó de un percance leve.`,
            ({ player, team, minute, type }) => `${team} perdió a ${player} en el minuto ${minute} por ${type}; nada serio, pero suficiente para dejar el campo en el acto.`,
            ({ player, team, minute, type }) => `${player} levantó la mano al ${minute}' por ${type} y pidió el relevo sin forzar; un aviso menor que ${team} prefirió no arriesgar.`,
          ],
          moderada: [
            ({ player, team, minute, type }) => `${player} cayó lesionado a los ${minute}' por ${type} y tuvo que ser sustituido: ${team} pierde una pieza importante para el próximo compromiso.`,
            ({ player, team, minute, type }) => `${player} se marchó en el minuto ${minute} aquejado de ${type}, y en ${team} saltaron las alarmas de cara a las próximas semanas.`,
            ({ player, team, minute, type }) => `Mala noticia para ${team}: ${player} se marchó al ${minute}' aquejado de ${type} que lo dejará fuera del siguiente encuentro.`,
            ({ player, team, minute, type }) => `${player} dejó el campo al ${minute}' tocado de ${type}, y en ${team} ya hacen cuentas de cara al próximo compromiso.`,
          ],
          grave: [
            ({ player, team, minute, type }) => `Imagen preocupante a los ${minute}': ${player} se desplomó por ${type} y abandonó el campo visiblemente dolorido, un golpe duro para los planes de ${team}.`,
            ({ player, team, minute, type }) => `${player} tuvo que ser retirado de urgencia en el minuto ${minute} por ${type}; ${team} encara las próximas jornadas sin una de sus referencias.`,
            ({ player, team, minute, type }) => `${team} encajó un revés serio cuando ${player} dejó el césped al ${minute}' aquejado de ${type}, con varias semanas de baja por delante.`,
            ({ player, team, minute, type }) => `Gesto de dolor en el minuto ${minute}: ${player} no pudo seguir por ${type} y se marchó cabizbajo, un contratiempo serio para ${team} de cara a las próximas semanas.`,
          ],
          muy_grave: [
            ({ player, team, minute, type }) => `Drama en el minuto ${minute}: ${player} fue retirado entre aplausos por ${type} de extrema gravedad que lo tendrá de baja una larga temporada y ensombrece la noche de ${team}.`,
            ({ player, team, minute, type }) => `El partido quedó marcado cuando ${player} sufrió ${type} a los ${minute}': una lesión gravísima que deja a ${team} sin su jugador durante meses.`,
            ({ player, team, minute, type }) => `${team} se llevó la peor de las noticias al ${minute}': ${player} sufrió ${type} de máxima gravedad y su regreso se antoja muy lejano.`,
            ({ player, team, minute, type }) => `Estampa amarga al ${minute}': ${player} se retiró entre la preocupación general por ${type} de extrema gravedad, una baja de larga duración que golpea de lleno a ${team}.`,
          ],
        },
        injurySub: [
          ({ inName }) => `En su lugar saltó al césped ${inName}.`,
          ({ inName }) => `${inName} ocupó su puesto desde el banquillo.`,
          ({ inName }) => `El banquillo respondió de inmediato con la entrada de ${inName}.`,
          ({ inName }) => `${inName} entró al campo para tomar el relevo sobre la marcha.`,
        ],
        injuryWarmup: [
          ({ player, team, type }) => `${player} se rompió en el calentamiento por ${type} y se quedó sin jugar: ${team} pierde un efectivo antes incluso del pitido inicial.`,
          ({ player, team, type }) => `Contratiempo para ${team} antes de empezar: ${player} se resintió de ${type} en el calentamiento y cayó de la convocatoria sin pisar el campo.`,
          ({ player, team, type }) => `${team} perdió a ${player} en la previa: una molestia de ${type} durante el calentamiento lo dejó fuera del partido sin haber jugado.`,
          ({ player, team, type }) => `Mala suerte para ${player}, lesionado de ${type} mientras calentaba en la banda; ${team} se quedó con un suplente menos antes de empezar.`,
        ],
        subSwap: [
          ({ inName, outName, cause, minute }) => `Para tapar el hueco que dejó ${cause}, ${inName} entró desde el banquillo al ${minute}' y ${outName} dejó su puesto para rearmar la zaga.`,
          ({ inName, outName, cause, minute }) => `Obligado por la baja de ${cause}, el banquillo movió ficha al ${minute}': entró ${inName} y ${outName} cedió su sitio para recomponer la defensa.`,
          ({ inName, outName, cause, minute }) => `La baja de ${cause} obligó a recomponer la pizarra: al ${minute}' entró ${inName} y ${outName} dejó el campo para reforzar una zaga que se había quedado coja.`,
          ({ inName, outName, cause, minute }) => `Tras caer ${cause}, el técnico rehízo la pizarra al ${minute}': entró ${inName} y ${outName} dejó su sitio para apuntalar una defensa de emergencia.`,
        ],
        subIn: [
          ({ inName, cause, minute }) => `Tras la expulsión de ${cause}, ${inName} saltó del banquillo al ${minute}' para reforzar la línea defensiva.`,
          ({ inName, cause, minute }) => `Sin ${cause} sobre el campo, ${inName} recibió la llamada al ${minute}' para apuntalar la retaguardia.`,
          ({ inName, cause, minute }) => `Tras quedarse sin ${cause}, ${inName} entró al campo al ${minute}' con la misión de tapar el agujero en la línea defensiva.`,
          ({ inName, cause, minute }) => `Con ${cause} ya en el vestuario, ${inName} saltó al césped al ${minute}' para cerrar el hueco en la retaguardia.`,
        ],
        forfeit: [
          ({ team }) => `Con cuatro expulsados, ${team} se quedó sin equipo sobre el campo y el colegiado dio el partido por perdido.`,
          ({ team }) => `Con cuatro jugadores camino del vestuario, ${team} se quedó sin gente para continuar y el árbitro decretó el final anticipado.`,
          ({ team }) => `La cuarta expulsión dejó a ${team} sin efectivos suficientes para seguir en pie, y el árbitro no tuvo más remedio que dar por concluido el encuentro.`,
          ({ team }) => `Sin gente suficiente tras la cuarta expulsión, ${team} no pudo continuar y el colegiado decretó el final anticipado del encuentro.`,
        ],
        penaltyMiss: [
          ({ shooter, keeper, minute }) => `Hubo drama desde los once metros a los ${minute} minutos: ${shooter} tuvo el gol en sus botas, pero ${keeper} y la fortuna le negaron la celebración.`,
          ({ shooter, keeper, minute }) => `El minuto ${minute} dejó el momento más cruel desde el punto de penalti: ${shooter} apuntó al gol, pero ${keeper} adivinó la intención y le robó la fiesta.`,
          ({ shooter, keeper, minute }) => `Llegó el momento de la pena máxima en el minuto ${minute} y con él, la decepción: ${shooter} buscó el gol desde los once metros, pero ${keeper} se hizo gigante y desbarató la ocasión.`,
          ({ shooter, keeper, minute }) => `El penalti del minuto ${minute} prometía celebración y acabó en frustración: ${shooter} encaró los once metros, pero ${keeper} le adivinó la intención y firmó la parada de la noche.`,
        ],
        nearMissSave: [
          ({ shooter, keeper, minute }) => `No todo fue acierto en los metros finales: la ocasión más clara que se marchó la tuvo ${shooter} a los ${minute} minutos, pero ${keeper} le ganó el mano a mano con una intervención de mucho mérito.`,
          ({ shooter, keeper, minute }) => `La jugada más clara que quedó sin premio llevó la firma de ${shooter} en el minuto ${minute}, pero ${keeper} salió a tiempo y resolvió el mano a mano con una parada de enorme valor.`,
          ({ shooter, keeper, minute }) => `La ocasión más peligrosa que no acabó en gol la tuvo ${shooter} en el minuto ${minute}, aunque ${keeper} reaccionó con una mano providencial para evitar el tanto.`,
          ({ shooter, keeper, minute }) => `El susto más serio llevó la firma de ${shooter} en el minuto ${minute}, pero ${keeper} apareció con un reflejo felino para mantener su portería a cero.`,
        ],
        nearMissWide: [
          ({ shooter, minute }) => `No todo fue acierto en los metros finales: la ocasión más clara que se marchó la tuvo ${shooter} a los ${minute} minutos, con un remate que se fue rozando el palo entre lamentos de la grada.`,
          ({ shooter, minute }) => `La ocasión más nítida que se perdió en el camino la protagonizó ${shooter} en el minuto ${minute}, con un disparo que lamió el palo y heló por un instante a toda la grada.`,
          ({ shooter, minute }) => `El aviso más serio que quedó sin recompensa lo firmó ${shooter} en el minuto ${minute}, con un disparo que se marchó rozando el poste ante el suspiro de las gradas.`,
          ({ shooter, minute }) => `La mejor oportunidad sin premio la tuvo ${shooter} en el minuto ${minute}, con un latigazo que escupió el larguero y dejó la celebración a medias en las gradas.`,
        ],
        bestSave: [
          ({ keeper, shooter, minute }) => `La parada de la noche llegó a los ${minute} minutos, cuando ${keeper} le negó el gol cantado a ${shooter} y mantuvo con vida a los suyos en el momento de máxima presión.`,
          ({ keeper, shooter, minute }) => `La intervención más recordada llegó en el minuto ${minute}: ${keeper} voló para negarle el gol hecho a ${shooter} y sostuvo a su equipo en plena tormenta.`,
          ({ keeper, shooter, minute }) => `El momento estelar bajo palos llegó en el minuto ${minute}: ${keeper} se estiró para sacar un remate cantado de ${shooter} y mantener a los suyos a flote en plena presión rival.`,
          ({ keeper, shooter, minute }) => `La gran estirada de la noche llegó en el minuto ${minute}: ${keeper} le sacó de forma milagrosa un disparo a quemarropa a ${shooter} y mantuvo intacta la esperanza de los suyos.`,
        ],
      },
      goal: {
        extend: [
          ({ scorer, minute, how, score }) => `La ventaja creció a los ${minute} minutos, cuando ${scorer} ${how} y dejó el ${score} en el luminoso.`,
          ({ scorer, minute, how, score }) => `El colchón se amplió en el minuto ${minute}: ${scorer} ${how} y estampó el ${score} en el marcador.`,
          ({ scorer, minute, how, score }) => `La renta siguió engordando en el minuto ${minute}: ${scorer} ${how} y subió el ${score} al electrónico.`,
          ({ scorer, minute, how, score }) => `El golpe definitivo a la moral rival llegó al ${minute}': ${scorer} ${how} y estiró el ${score} en el luminoso.`,
        ],
        lead: [
          ({ team, scorer, minute, how, score }) => `A los ${minute} minutos, ${scorer} ${how} y puso a ${team} por delante en el marcador (${score}).`,
          ({ team, scorer, minute, how, score }) => `En el minuto ${minute}, ${scorer} ${how} y adelantó a ${team} en el luminoso (${score}).`,
          ({ team, scorer, minute, how, score }) => `Apareció ${scorer} en el minuto ${minute}: ${how} y puso a ${team} al frente del marcador (${score}).`,
          ({ team, scorer, minute, how, score }) => `${scorer} rompió el equilibrio en el minuto ${minute}: ${how} y colocó a ${team} por delante (${score}).`,
        ],
        equalizer: [
          ({ team, scorer, minute, how }) => `${team} reaccionó y encontró el empate a los ${minute} minutos: ${scorer} ${how} y devolvió la igualdad al encuentro.`,
          ({ team, scorer, minute, how }) => `${team} no se rindió y niveló la balanza en el minuto ${minute}: ${scorer} ${how} y restableció las tablas.`,
          ({ team, scorer, minute, how }) => `${team} igualó la contienda en el minuto ${minute} cuando ${scorer} ${how} y volvió a poner las tablas en el marcador.`,
          ({ team, scorer, minute, how }) => `${team} sacó la cabeza del agua en el minuto ${minute}: ${scorer} ${how} y devolvió la igualdad al marcador.`,
        ],
        comeback: [
          ({ team, scorer, minute, how }) => `${team} logró descontar a los ${minute} minutos gracias a ${scorer}, que ${how} y devolvió la incertidumbre al encuentro.`,
          ({ team, scorer, minute, how }) => `${team} recortó distancias en el minuto ${minute} con la firma de ${scorer}, que ${how} y reabrió el partido.`,
          ({ team, scorer, minute, how }) => `${team} acortó la distancia en el minuto ${minute} de la mano de ${scorer}, que ${how} y metió de nuevo a su equipo en el partido.`,
          ({ team, scorer, minute, how }) => `${team} se agarró al partido en el minuto ${minute} con ${scorer}, que ${how} y volvió a meter a los suyos en la pelea.`,
        ],
        sealer: [
          ({ scorer, minute, how, score }) => `Y cuando el partido parecía abierto, volvió a aparecer la jerarquía: a los ${minute} minutos ${scorer} ${how} y sentenció el ${score} definitivo.`,
          ({ scorer, minute, how, score }) => `Cuando aún cabían dudas, la calidad marcó la diferencia: en el minuto ${minute} ${scorer} ${how} y cerró el ${score} definitivo.`,
          ({ scorer, minute, how, score }) => `Con el desenlace en el aire, emergió la pegada decisiva: ${scorer} ${how} en el minuto ${minute} y firmó el ${score} definitivo.`,
          ({ scorer, minute, how, score }) => `Y cuando el rival soñaba con la épica, llegó la puntilla: ${scorer} ${how} en el minuto ${minute} y dejó el ${score} definitivo.`,
        ],
      },
      how: {
        penalty: [
          'no perdonó desde los once metros',
          'transformó la pena máxima con una sangre fría de veterano',
          'engañó al portero desde los once metros con un lanzamiento ajustado',
          'mandó al guardameta al lado contrario y batió la pena máxima sin despeinarse',
        ],
        freeKick: [
          'dibujó un tiro libre imposible para el portero',
          'clavó una falta directa a la escuadra',
          'sorprendió al guardameta con una falta directa que se coló por la escuadra',
          'colgó una falta directa imposible que se coló pegada al palo',
        ],
        header: [
          'ganó por arriba y conectó un cabezazo inapelable',
          'se elevó por encima de todos para cabecear a la red',
          'apareció en el segundo palo para rematar de cabeza a la red',
          'mandó al fondo de la red un testarazo imposible de detener',
        ],
        headerAssist: [
          ({ assister }) => `remató de cabeza un centro medido de ${assister}`,
          ({ assister }) => `cabeceó a placer un centro perfecto de ${assister}`,
          ({ assister }) => `conectó de cabeza un envío al área servido por ${assister}`,
          ({ assister }) => `remató de cabeza, libre de marca, un centro medido de ${assister}`,
        ],
        counter: [
          'culminó una contra vertiginosa con una definición de killer',
          'remató al contragolpe con un temple letal',
          'sentenció una contra de manual con una definición de killer',
          'corrió el contragolpe a toda velocidad y lo cerró con una definición quirúrgica',
        ],
        shotAssist: [
          ({ assister }) => `recibió un pase filtrado de ${assister} y batió al portero con un disparo cruzado`,
          ({ assister }) => `cazó una asistencia al hueco de ${assister} y fusiló al meta por bajo`,
          ({ assister }) => `culminó una pared con ${assister} y batió al meta con un disparo raso`,
          ({ assister }) => `recogió un pase al espacio de ${assister} y batió al meta con un disparo colocado`,
        ],
        shot: [
          'apareció en el área tras una jugada colectiva y definió con precisión',
          'aprovechó un rebote dentro del área y fusiló al guardameta',
          'se sacó un zurriagazo desde la frontal que se coló pegado al palo',
          'enganchó un disparo desde media distancia que se coló junto a la cepa del palo',
        ],
      },
      feat: {
        goals: [
          ({ goals }) => `convertir ${goals}`,
          ({ goals }) => `firmar ${goals}`,
          ({ goals }) => `anotar ${goals}`,
          ({ goals }) => `apuntarse ${goals}`,
        ],
        goalsAssists: [
          ({ goals, assists }) => `convertir ${goals} y aportar ${assists}`,
          ({ goals, assists }) => `firmar ${goals} y servir ${assists}`,
          ({ goals, assists }) => `anotar ${goals} y regalar ${assists}`,
          ({ goals, assists }) => `apuntarse ${goals} y poner ${assists}`,
        ],
        assists: [
          ({ assists }) => `repartir ${assists}`,
          ({ assists }) => `distribuir ${assists}`,
          ({ assists }) => `regalar ${assists}`,
          ({ assists }) => `servir ${assists}`,
        ],
        saves: [
          ({ saves }) => `sostener a los suyos con ${saves}`,
          ({ saves }) => `salvar a los suyos con ${saves}`,
          ({ saves }) => `mantener a flote a los suyos con ${saves}`,
          ({ saves }) => `blindar su portería con ${saves}`,
        ],
        wall: [
          'imponer su ley en cada duelo y no perder un balón dividido',
          'ganar cada duelo y blindar su área con autoridad',
          'mandar en cada balón dividido y levantar un muro infranqueable',
          'ser un muro infranqueable y dominar cada duelo en su parcela',
        ],
        // Menciones al director técnico (DT), añadidas al cierre según el partido.
        // Las claves "...Rival" citan a ambos banquillos y solo se eligen cuando
        // hay DT rival; el resto nombra solo al DT propio.
        manager: {
          comeback: [
            ({ manager, team }) => `Capítulo aparte para ${manager}, cuya mano desde el banquillo enderezó el rumbo de ${team} y firmó una remontada de mérito.`,
            ({ manager }) => `La lectura de ${manager} desde la banda dio la vuelta al partido: ajustes finos y un equipo que nunca dejó de creer.`,
            ({ manager, team }) => `Y en el capítulo táctico, ${manager} acertó con los retoques justos para enderezar a ${team} desde la pizarra.`,
          ],
          loss: [
            ({ manager, team }) => `Pese al esfuerzo, a ${manager} se le acabaron las cartas en el banquillo y ${team} no logró torcer la noche.`,
            ({ manager, team, level }) => `${manager} buscó respuestas desde la banda, pero la derrota dejó a ${team} sin margen en el piso ${level}.`,
            ({ manager, team }) => `Ni los cambios de ${manager} encontraron la tecla, y ${team} se marchó de vacío pese a remar hasta el final.`,
          ],
          lossRival: [
            ({ manager, opp, team }) => `El duelo de banquillos cayó del lado de ${opp}, que leyó mejor el partido que ${manager} y dejó a ${team} sin respuestas.`,
            ({ manager, opp, team }) => `${opp} ganó también la partida desde la banda: sus ajustes superaron a los de ${manager} y condenaron a ${team}.`,
          ],
          debut: [
            ({ manager, player }) => `${manager} se atrevió con una novedad y dio entrada a ${player}, que vivió su estreno en el once.`,
            ({ manager, player }) => `Apuesta del banquillo: ${manager} hizo debutar a ${player} en una decisión que dio que hablar.`,
            ({ manager, player }) => `${manager} tiró de banquillo para regalar el debut a ${player}, una apuesta que no pasó desapercibida.`,
          ],
          drawRival: [
            ({ manager, opp }) => `El reparto premió por igual a dos banquillos sabios: ${manager} y ${opp} se neutralizaron desde la banda en un ajedrez sin vencedor.`,
            ({ manager, opp }) => `Tablas también en el pulso de los técnicos: ${manager} y ${opp} movieron sus fichas sin que ninguno lograra imponer su plan.`,
          ],
          winRival: [
            ({ manager, opp, team }) => `El pulso de banquillos sonrió a ${manager}, que tomó la delantera a ${opp} con un plan que ${team} ejecutó al pie de la letra.`,
            ({ manager, opp }) => `${manager} ganó también la partida táctica a ${opp}: sus decisiones desde la banda marcaron el rumbo del encuentro.`,
          ],
          subs: [
            ({ manager }) => `Los cambios de ${manager} refrescaron al equipo y movieron los hilos del encuentro desde la banda.`,
            ({ manager }) => `${manager} agitó el partido desde el banquillo con un par de retoques que cambiaron la dinámica.`,
            ({ manager, team }) => `Desde la banda, ${manager} fue dosificando esfuerzos con cambios medidos que mantuvieron vivo a ${team}.`,
          ],
        },
      },
      units: {
        goals: ({ n }) => (n === 1 ? 'un gol' : `${NUM_WORDS.es[n] || n} goles`),
        assists: ({ n }) => (n === 1 ? 'una asistencia' : `${NUM_WORDS.es[n] || n} asistencias`),
        saves: ({ n }) => (n === 1 ? 'una parada de mérito' : `${NUM_WORDS.es[n] || n} paradas de mérito`),
        and: ' y ',
        wall: 'una autoridad incontestable atrás',
      },
      closing: {
        win: [
          ({ team, figure, featSummary }) => `El pitazo final confirmó una sólida victoria de ${team}, que encontró en ${figure} a su líder futbolístico y emocional. Con ${featSummary}, el hombre del partido se ganó el reconocimiento de aficionados y analistas, y su equipo ya prepara el asalto al siguiente piso de la Torre de Leyendas.`,
          ({ team, figure, featSummary }) => `El pitido final selló un triunfo merecido de ${team}, que halló en ${figure} el faro al que aferrarse en los momentos calientes. Con ${featSummary} a sus espaldas, la figura se metió a la afición en el bolsillo mientras el equipo afila ya las herramientas para asaltar el próximo piso de la Torre de Leyendas.`,
          ({ team, figure, featSummary }) => `El triunfo de ${team} quedó sellado en el pitido final, con ${figure} convertido en el gran estandarte de una noche para enmarcar. Con ${featSummary}, se ganó el aplauso unánime de la grada, mientras el equipo pone ya la mirada en el siguiente piso de la Torre de Leyendas.`,
          ({ team, figure, featSummary }) => `El pitido final desató la fiesta de ${team}, que se apoyó en ${figure} para sacar adelante una noche exigente. Con ${featSummary}, la figura firmó una actuación de matrícula y dejó al equipo con la moral por las nubes camino del próximo piso de la Torre de Leyendas.`,
        ],
        draw: [
          ({ team, opp, figure, featSummary }) => `El empate dejó un sabor agridulce en ambos vestuarios, pero nadie discutió el nombre propio de la noche: con ${featSummary}, ${figure} sostuvo a los suyos en los minutos calientes de un duelo que ${team} y ${opp} pelearon hasta el último suspiro.`,
          ({ team, opp, figure, featSummary }) => `El reparto de puntos dejó sensaciones encontradas en los dos banquillos, aunque hubo consenso sobre la figura de la jornada: con ${featSummary}, ${figure} mantuvo a flote a su equipo en un pulso que ${team} y ${opp} disputaron hasta el último aliento.`,
          ({ team, opp, figure, featSummary }) => `El reparto de puntos dejó a ${team} y ${opp} con la sensación de no haber rematado la faena, aunque la figura no admitió discusión: con ${featSummary}, ${figure} sacó la cara por los suyos en un duelo igualado hasta el pitido final.`,
          ({ team, opp, figure, featSummary }) => `El empate supo a poco en los dos bandos, aunque la figura no tuvo discusión: con ${featSummary}, ${figure} sostuvo a los suyos en un duelo que ${team} y ${opp} igualaron hasta el último minuto.`,
        ],
        loss: [
          ({ team, figure, featSummary, level }) => `El pitazo final certificó la caída de ${team}, que no encontró respuestas ante un rival más certero. Con ${featSummary}, ${figure} se erigió en el verdugo de la noche y dejó la escalada de ${team} detenida en el piso ${level} de la Torre de Leyendas.`,
          ({ team, figure, featSummary, level }) => `El pitido final ratificó la derrota de ${team}, incapaz de descifrar a un rival más eficaz de cara a puerta. Con ${featSummary}, ${figure} ejerció de verdugo y dejó la escalada de ${team} frenada en el piso ${level} de la Torre de Leyendas.`,
          ({ team, figure, featSummary, level }) => `La derrota de ${team} quedó certificada al sonar el silbato, sin antídoto para un rival más resolutivo. Con ${featSummary}, ${figure} ejerció de gran protagonista y dejó la andadura de ${team} frenada en el piso ${level} de la Torre de Leyendas.`,
          ({ team, figure, featSummary, level }) => `El silbato final confirmó el tropiezo de ${team}, superado por un rival más certero en las áreas. Con ${featSummary}, ${figure} fue el gran nombre de la noche y dejó la escalada de ${team} congelada en el piso ${level} de la Torre de Leyendas.`,
        ],
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
      continueRun: 'Continue run',
      continueFloor: ({ level }) => `Level ${level}`,
      newRunConfirm: 'You have a run in progress. Starting a new one will erase it. Continue?',
      runBusyTitle: 'Run open in another tab',
      runBusyBody: 'This run is already open in another tab or window. Close it and tap Retry to continue here.',
      runBusyRetry: 'Retry',
      backToMenu: 'Back to menu',
      wiki: 'Wiki',
      liveNow: ({ n }) => `${n} playing now`,
      totalRuns: ({ n }) => `${n} games played`,
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
      nationTitle: 'National team pack',
      nationHint: 'Special pack: pick a historic national team and take any player you want.',
      nationOpen: 'Open national team pack',
      nationBadge: 'National team',
      nationNew: ({ n }) => `${n} new players`,
      nationTopOvr: ({ ovr }) => `Top OVR ${ovr}`,
      nationPickHint: 'Pick any player from this national team for your squad.',
      playerDiscard: 'Discard players',
      itemDiscard: 'Discard items',
      review: 'Review my team',
      reviewTitle: ({ count }) => `Your squad (${count} cards)`,
      reviewManager: 'View my coach',
      reviewManagerTitle: 'Your coach',
      reviewItems: 'View my items',
      reviewItemsTitle: ({ count }) => `Your items (${count})`,
      corruptoTitle: 'The agent’s pack',
      corruptoHint: 'A player will use your team as a springboard. Open it and he joins your XI.',
      corruptoOpen: 'Open pack',
      shinyTitle: 'The agent’s pack',
      shinyHint: 'Your reward: pick a gem with +10 to every stat.',
      shinyOpen: 'Open Shiny pack',
      shinySale: ({ name }) => `${name} has been sold successfully to a major Middle Eastern club. His agent wants to reward you — open this pack.`,
    },
    card: {
      owned: 'Already in your squad',
      itemStack: ({ n }) => `×${n} copies stacked`,
      itemStackNote: 'Each extra copy is worth half',
      rarity: { common: 'Common', rare: 'Rare', epic: 'Epic', legend: 'Legend', corrupto: 'Corrupt', shiny: 'Shiny' },
      position: { GK: 'GK', DEF: 'DEF', MID: 'MID', FWD: 'FWD', ENG: 'AM' },
      line: { GK: 'Goal', DEF: 'Defense', MID: 'Midfield', FWD: 'Attack', ENG: 'Playmaker' },
      stat: { pace: 'PAC', shooting: 'SHO', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'PHY', reflexes: 'REF', handling: 'HAN', positioning: 'POS' },
      trait: { Francotirador: 'Sharpshooter', Cañón: 'Cannon', Muro: 'Wall', Motor: 'Engine', Maestro: 'Maestro', Líbero: 'Libero', Paradón: 'Super Save', Killer: 'Killer', Velocista: 'Speedster', Especialista: 'Specialist', Penalero: 'Penalty Taker', Capitán: 'Captain', Garra: 'Grit', Mariscal: 'Marshal', Roto: 'Brittle' },
      synergy: ({ type }) => `Synergy: ${type}`,
      itemType: { equipamiento: 'equipment', tactica: 'tactic', reliquia: 'relic' },
    },
    build: {
      title: 'Build your team',
      nextOpponent: 'Next opponent',
      viewLineup: 'View XI',
      chemistry: 'Chemistry',
      chemNation: 'Nation',
      chemEra: 'Era',
      chemBoost: 'Twelfth man',
      fromItems: 'Items contribution',
      tacticalBoard: 'Tactical board',
      formationAria: 'Formation',
      roster: 'Substitutes',
      benchAll: 'Position',
      benchFilterAria: 'Filter substitutes by line',
      benchCountryAll: 'Country',
      benchCountryAria: 'Filter substitutes by country',
      rosterCount: ({ total, missing }) => `${total} cards · ${missing} open slot${missing === 1 ? '' : 's'}`,
      noSubs: 'No substitutes available.',
      noItems: 'No items yet.',
      activeItems: ({ count }) => `Active items (${count})`,
      play: 'Play match',
      missing: ({ count }) => `Complete the XI (${count} missing)`,
      statsDialog: 'Player stats',
      playerDragAria: ({ name }) => `${name}, drag to move or tap to remove from the XI`,
      playerSealedAria: ({ name }) => `${name}, locked in the XI: cannot be moved or removed`,
      emptyAria: ({ label }) => `Open ${label} slot, add player`,
      viewStatsAria: ({ name }) => `View ${name} stats`,
      benchAria: ({ name }) => `${name}, drag onto the field or tap to line up`,
      suspended: 'Sent off: unavailable this match',
      benchSuspendedAria: ({ name }) => `${name}, sent off last match: cannot be lined up`,
      injured: 'Injured: recovering',
      benchInjuredAria: ({ name }) => `${name}, injured: recovering, cannot be lined up`,
      noCandidates: ({ label }) => `You have no compatible substitutes for ${label}. Find them in packs.`,
      pickerHead: ({ label }) => `${label} — choose who comes in`,
      targetPickerHead: ({ name }) => `${name} — choose a position`,
      openSlot: 'Open slot',
    },
    scouting: {
      report: 'Opponent report',
      manager: 'Manager',
      formation: ({ formation }) => `Formation ${formation}`,
      strength: 'Strength',
      opponentEleven: 'Opponent starting XI',
      note: 'Game ratings for the Legends Cup. Representative historical XI for the tournament.',
      continue: 'Build my team',
    },
    squadIntro: {
      kicker: 'Your team is ready',
      cards: ({ count }) => `${count} cards`,
      eleven: 'Starting XI',
      bench: 'Substitutes',
      note: 'This is your starting squad. Tap any card to see its attributes; you can tweak the XI before every match.',
      continue: 'Open my first pack',
    },
    ratings: { attack: 'ATT', midfield: 'MID', defense: 'DEF', gk: 'GK', physical: 'PHY' },
    tactics: {
      style: 'Style',
      styleFromManager: 'Set by your manager',
      custom: 'Custom',
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
      reds: 'Sent off',
      injuries: 'Injured',
      warmup: 'warm-up',
      injuryMatchesTitle: ({ n }) => n > 0 ? `Out for ${n} match${n === 1 ? '' : 'es'}` : 'No matches missed',
      saves: 'Saves',
      lastMatch: 'Last match',
      lastTactic: 'Your tactic',
      subs: 'Changes',
      gameOver: 'Run over',
      floorsReached: 'floors reached',
      newRecord: '★ New record',
      best: ({ best }) => `Best mark: ${best}`,
      winsRoster: ({ wins, count }) => `${wins} ${wins === 1 ? 'win' : 'wins'} · squad of ${count} players`,
      route: 'Path',
      finalSquad: 'Final squad',
      playAgain: 'Play again',
      endRun: 'End run',
      replay: 'Play again with a carry-over',
      pathLevel: ({ level }) => `Lv ${level}`,
    },
    carryover: {
      title: 'Pick a player for your next run',
      hint: 'They will join a fresh, random squad.',
      back: 'Back',
    },
    leaderboard: {
      floor: ({ floor }) => `Floor ${floor}`,
      updating: 'Updating ranking...',
      readOnly: 'Read-only server: showing saved ranking.',
      rank: ({ rank }) => `Your run finished #${rank}.`,
      notTop: 'You did not make the top 20.',
      title: 'All-time ranking',
      top: 'Top 20',
      titleWeekly: 'Weekly ranking',
      topWeekly: 'Weekly top 20',
      empty: 'No scores yet.',
      lineup: 'Last lineup',
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
      deletePlayer: 'Delete player',
      deleteConfirm: ({ name }) => `Delete ${name || 'this player'}? This cannot be undone.`,
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
      faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} breaks away and ${defender} brings him down. The referee reaches into the pocket: straight red!`,
      faltaSegundaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${defender} chops down ${receiver} again. Second yellow… and off he goes!`,
      faltaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} looks for the run and ${defender} arrives late. Foul and a yellow for ${defender}.`,
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
      badge: { penalty: 'PENALTY', free_kick: 'FREE KICK', corner: 'CORNER', gol: 'GOAL', parada: 'SAVE', tiro_fuera: 'WIDE SHOT', bloqueo: 'BLOCK', roja: 'RED', amarilla: 'YELLOW', falta: 'FOUL', fuera_juego: 'OFFSIDE', despeje: 'CLEARANCE', perdida: 'STEAL', pase_fuera: 'LONG PASS', default: 'PLAY' },
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
    injury: {
      severity: { simple: 'minor', moderada: '1 match', grave: '3 matches', muy_grave: '6 matches' },
      types: {
        simple: ['cramp', 'knock', 'ankle blow', 'mild overload'],
        moderada: ['ankle sprain', 'muscle strain', 'twisted knee', 'muscle tightness'],
        grave: ['torn muscle fibre', 'grade 2 sprain', 'dislocated shoulder', 'partial muscle tear'],
        muy_grave: ['cruciate ligament rupture', 'broken fibula', 'ruptured Achilles tendon', 'severe knee dislocation'],
      },
    },
    press: {
      masthead: 'The Tower Gazette',
      edition: ({ level }) => `Special edition · Floor ${level}`,
      caption: ({ name }) => `${name}, the standout player of the match`,
      photoAlt: ({ name }) => `Pixel-art portrait of ${name}`,
      headline: {
        winBig: [
          ({ team, figure }) => `${team} put on a show behind a legendary ${figure}`,
          ({ team, figure }) => `${team} run riot with ${figure} stealing the show`,
        ],
        win: [
          ({ team, figure }) => `${figure} leads ${team} to a gutsy win`,
          ({ team, figure }) => `${team} own the night with ${figure} at the wheel`,
        ],
        draw: [
          ({ team, opp }) => `${team} and ${opp} battle to a hard-earned draw`,
          ({ team, opp }) => `${team} and ${opp} share the spoils after a relentless tug-of-war`,
        ],
        loss: [
          ({ team, opp }) => `${opp} bring ${team}'s climb to a halt`,
          ({ team, opp }) => `${team} stumble as ${opp} clip their wings mid-ascent`,
        ],
      },
      lead: {
        win: [
          ({ team, opp, score, figure, feat }) => `${team} beat ${opp} ${score} in an intense match that delivered big emotions from start to finish. The undisputed protagonist of the night was ${figure}, who signed a memorable performance by ${feat}, proving decisive in every key moment of the game.`,
          ({ team, opp, score, figure, feat }) => `${team} saw off ${opp} ${score} in a high-tempo battle fought tooth and nail from first minute to last. The man who set the tone was ${figure}, decisive by ${feat} and master of the moments that truly mattered.`,
        ],
        draw: [
          ({ team, opp, score, figure, feat }) => `${team} and ${opp} played out a ${score} draw in an intense contest in which neither side ever backed down. If anyone held the line it was ${figure}, who carried the team by ${feat} and kept the dream alive until the final whistle.`,
          ({ team, opp, score, figure, feat }) => `A ${score} with no winner summed up the give-and-take between ${team} and ${opp}, who went toe to toe without holding anything back. The most constant presence was ${figure}, who carried the team by ${feat} when the duel cried out for a leader.`,
        ],
        loss: [
          ({ team, opp, score, figure, feat }) => `${opp} beat ${team} ${score} in a rugged duel decided by the finest of margins. The clear man of the match was ${figure}, who made the difference by ${feat} and left the opposition without answers.`,
          ({ team, opp, score, figure, feat }) => `${opp} got the better of ${team} ${score} in a tight, scrappy contest broken open by the small details. The standout was ${figure}, who made the difference by ${feat} and left ${team} chained to the opposition's game plan.`,
        ],
      },
      body: {
        opener: [
          ({ att, def, minute, scorer, how, score }) => `From the opening minutes, ${att} showed an attacking mindset and a high press that troubled ${def}'s build-up. The insistence paid off in minute ${minute}, when ${scorer} ${how} to make it ${score}. The goal brought confidence, and they began to control possession and create constant danger down the flanks.`,
          ({ att, def, minute, scorer, how, score }) => `${att} wasted no time setting the tone: a high press and overlapping runs that pinned ${def} back in their own half. The reward came in minute ${minute}, when ${scorer} ${how} to open the scoring at ${score}. With the first blow landed, they settled and began dictating the tempo to their liking.`,
        ],
        scoreless: [
          ({ team, opp, keeper }) => `The first half was a tactical arm-wrestle in which ${team} and ${opp} sized each other up without conceding space. The defenses got the better of the attacks and, when needed, ${keeper} stepped up to put out the fires in the box. It was goalless at the break, with the feeling that a single detail would decide the match.`,
          ({ team, opp, keeper }) => `The first half was played with the handbrake on: ${team} and ${opp} prized not losing over taking risks, and the ball travelled through midfield more than the boxes. Whenever someone dared, ${keeper} was there to calm things down. It was goalless at the break, with the sense of a coin-flip match.`,
        ],
        quiet: [
          ({ team, opp, keeper }) => `The scoreboard did not move again in the second half: ${team} and ${opp} traded approaches without clarity in the final third, and every attempt died in ${keeper}'s gloves or at the boots of a well-drilled defense. The duel closed without further scares, settled by what was sown before the break.`,
          ({ team, opp, keeper }) => `The second half slammed the door shut: ${team} and ${opp} tried in spells but lacked depth and a final ball, and the little that arrived was dealt with by ${keeper} or a switched-on defense. The duel slowly fizzled out, faithful to the first-half script.`,
        ],
        red: [
          ({ player, team, minute }) => `The match took a turn with ${player}'s sending-off in minute ${minute}, leaving ${team} a man down and completely conditioning the final stretch.`,
          ({ player, team, minute }) => `The game turned on ${player}'s red card in minute ${minute}: ${team} were down to ten and had to grit their teeth to protect the result to the end.`,
        ],
        injury: {
          simple: [
            ({ player, team, minute, type }) => `${player} came off in minute ${minute} with a ${type}, giving up his place on the spot, though the scare came to nothing.`,
            ({ player, team, minute, type }) => `A ${type} forced ${player} off in minute ${minute}: ${team} reshuffled the bench, but it was only a minor knock.`,
            ({ player, team, minute, type }) => `${team} lost ${player} in minute ${minute} to a ${type}; nothing serious, but enough to leave the pitch right away.`,
            ({ player, team, minute, type }) => `${player} raised a hand in minute ${minute} with a ${type} and asked to come off without forcing it; a minor warning ${team} chose not to risk.`,
          ],
          moderada: [
            ({ player, team, minute, type }) => `${player} went down in minute ${minute} with a ${type} and had to be replaced: ${team} lose a key piece for the next fixture.`,
            ({ player, team, minute, type }) => `${player}'s ${type} in minute ${minute} set off alarms at ${team}, who pulled him off in clear discomfort for the weeks ahead.`,
            ({ player, team, minute, type }) => `Bad news for ${team}: ${player} left in minute ${minute} with a ${type} that will rule him out of the next match.`,
            ({ player, team, minute, type }) => `${player} left the field in minute ${minute} nursing a ${type}, and ${team} are already doing the maths for the next fixture.`,
          ],
          grave: [
            ({ player, team, minute, type }) => `A worrying sight in minute ${minute}: ${player} collapsed with a ${type} and left the pitch visibly in pain, a heavy blow to ${team}'s plans.`,
            ({ player, team, minute, type }) => `${player}'s ${type} in minute ${minute} forced an urgent withdrawal; ${team} face the coming weeks without one of their mainstays.`,
            ({ player, team, minute, type }) => `${team} suffered a serious setback when ${player} had to leave the field in minute ${minute} with a ${type} pointing to several weeks out.`,
            ({ player, team, minute, type }) => `A grimace of pain in minute ${minute}: ${player} could not carry on with a ${type} and trudged off, a serious setback for ${team} in the weeks ahead.`,
          ],
          muy_grave: [
            ({ player, team, minute, type }) => `Drama in minute ${minute}: ${player} was carried off to applause after a ${type} of extreme severity that will sideline him for a long spell and cast a shadow over ${team}'s night.`,
            ({ player, team, minute, type }) => `The match was marked by ${player}'s ${type} in minute ${minute}: a very serious injury that leaves ${team} without their man for months.`,
            ({ player, team, minute, type }) => `${team} got the worst possible news in minute ${minute}: ${player} suffered a ${type} of the highest severity and his return looks a long way off.`,
            ({ player, team, minute, type }) => `A bitter sight in minute ${minute}: ${player} withdrew amid widespread concern with a ${type} of extreme severity, a long-term absence that hits ${team} hard.`,
          ],
        },
        injurySub: [
          ({ inName }) => `${inName} took his place from the bench.`,
          ({ inName }) => `In his stead, ${inName} came on.`,
          ({ inName }) => `The bench responded at once with ${inName}.`,
          ({ inName }) => `${inName} came on to take over on the spot.`,
        ],
        injuryWarmup: [
          ({ player, team, type }) => `${player} broke down in the warm-up with ${type} and never made it onto the pitch: ${team} lost a man before kick-off.`,
          ({ player, team, type }) => `Bad news for ${team} before a ball was kicked: ${player} pulled up with ${type} during the warm-up and was withdrawn without playing.`,
          ({ player, team, type }) => `${team} lost ${player} in the warm-up, where ${type} ruled him out of the match before it even began.`,
          ({ player, team, type }) => `Hard luck for ${player}, sidelined by ${type} while warming up; ${team} were a substitute short before the whistle.`,
        ],
        subSwap: [
          ({ inName, outName, cause, minute }) => `To cover the gap left by ${cause}, ${inName} came off the bench on ${minute}' and ${outName} gave up his spot to patch up the back line.`,
          ({ inName, outName, cause, minute }) => `With ${cause} down, the coach reshaped the board on ${minute}': ${inName} came on and ${outName} gave up his place to prop up an emergency defence.`,
        ],
        subIn: [
          ({ inName, cause, minute }) => `After ${cause}'s dismissal, ${inName} came on from the bench on ${minute}' to shore up the defence.`,
          ({ inName, cause, minute }) => `With ${cause} already off, ${inName} stepped onto the pitch on ${minute}' to plug the gap at the back.`,
        ],
        forfeit: [
          ({ team }) => `With four players sent off, ${team} could no longer field a side and the referee awarded the match as lost.`,
          ({ team }) => `Short of players after the fourth dismissal, ${team} could not carry on and the referee called an early end to the match.`,
        ],
        penaltyMiss: [
          ({ shooter, keeper, minute }) => `There was drama from the spot in minute ${minute}: ${shooter} had the goal at his mercy, but ${keeper} and fortune denied him the celebration.`,
          ({ shooter, keeper, minute }) => `The minute ${minute} penalty promised a celebration and ended in frustration: ${shooter} stepped up, but ${keeper} read his mind and produced the save of the night.`,
        ],
        nearMissSave: [
          ({ shooter, keeper, minute }) => `Not everything came off in the final third: the clearest chance that got away fell to ${shooter} in minute ${minute}, but ${keeper} won the one-on-one with a save of real merit.`,
          ({ shooter, keeper, minute }) => `The biggest scare bore ${shooter}'s name in minute ${minute}, but ${keeper} flew across with a cat-like reflex to keep a clean sheet.`,
        ],
        nearMissWide: [
          ({ shooter, minute }) => `Not everything came off in the final third: the clearest chance that got away fell to ${shooter} in minute ${minute}, whose effort flew inches wide to groans from the stands.`,
          ({ shooter, minute }) => `The best chance without a reward fell to ${shooter} in minute ${minute}, with a fierce strike that rattled the crossbar and cut the celebration short in the stands.`,
        ],
        bestSave: [
          ({ keeper, shooter, minute }) => `The save of the night arrived in minute ${minute}, when ${keeper} denied ${shooter} a certain goal and kept his side alive at the moment of maximum pressure.`,
          ({ keeper, shooter, minute }) => `The great stop of the night came in minute ${minute}: ${keeper} somehow clawed out a point-blank effort from ${shooter} and kept his side's hopes intact.`,
        ],
      },
      goal: {
        extend: [
          ({ scorer, minute, how, score }) => `The lead grew in minute ${minute}, when ${scorer} ${how} and put ${score} on the scoreboard.`,
          ({ scorer, minute, how, score }) => `The decisive blow to the rival's morale came on ${minute}': ${scorer} ${how} and stretched the lead to ${score}.`,
        ],
        lead: [
          ({ team, scorer, minute, how, score }) => `In minute ${minute}, ${scorer} ${how} and put ${team} in front (${score}).`,
          ({ team, scorer, minute, how, score }) => `${scorer} broke the deadlock in minute ${minute}: ${how} and put ${team} ahead (${score}).`,
        ],
        equalizer: [
          ({ team, scorer, minute, how }) => `${team} reacted and found the equalizer in minute ${minute}: ${scorer} ${how} and restored parity.`,
          ({ team, scorer, minute, how }) => `${team} came up for air in minute ${minute}: ${scorer} ${how} and restored parity on the scoreboard.`,
        ],
        comeback: [
          ({ team, scorer, minute, how }) => `${team} pulled one back in minute ${minute} through ${scorer}, who ${how} and brought the uncertainty back to the match.`,
          ({ team, scorer, minute, how }) => `${team} clung to the game in minute ${minute} through ${scorer}, who ${how} and dragged his side back into the fight.`,
        ],
        sealer: [
          ({ scorer, minute, how, score }) => `And just when the match seemed wide open, class told again: in minute ${minute} ${scorer} ${how} and sealed the definitive ${score}.`,
          ({ scorer, minute, how, score }) => `And just as the rival dreamed of a comeback, the dagger arrived: ${scorer} ${how} in minute ${minute} and set the final ${score}.`,
        ],
      },
      how: {
        penalty: [
          'made no mistake from the penalty spot',
          'sent the keeper the wrong way and slotted the spot-kick with ease',
        ],
        freeKick: [
          'curled in a free kick the goalkeeper could only watch',
          'whipped in an unstoppable free kick that crept inside the post',
        ],
        header: [
          'rose highest and powered home an emphatic header',
          'buried an unstoppable header into the back of the net',
        ],
        headerAssist: [
          ({ assister }) => `headed in a measured cross from ${assister}`,
          ({ assister }) => `rose unmarked to head home a pinpoint cross from ${assister}`,
        ],
        counter: [
          'finished off a lightning counter with a killer touch',
          'raced the break at full tilt and finished it with surgical precision',
        ],
        shotAssist: [
          ({ assister }) => `latched onto a through ball from ${assister} and beat the keeper with a low drive`,
          ({ assister }) => `picked up a ball into space from ${assister} and beat the keeper with a placed finish`,
        ],
        shot: [
          'appeared in the box at the end of a team move and finished with precision',
          'pounced on a rebound inside the area and buried it',
        ],
      },
      feat: {
        goals: [
          ({ goals }) => `scoring ${goals}`,
          ({ goals }) => `netting ${goals}`,
        ],
        goalsAssists: [
          ({ goals, assists }) => `scoring ${goals} and providing ${assists}`,
          ({ goals, assists }) => `netting ${goals} and setting up ${assists}`,
        ],
        assists: [
          ({ assists }) => `providing ${assists}`,
          ({ assists }) => `setting up ${assists}`,
        ],
        saves: [
          ({ saves }) => `holding the team together with ${saves}`,
          ({ saves }) => `keeping his side afloat with ${saves}`,
        ],
        wall: [
          'winning every duel and refusing to lose a single loose ball',
          'standing as an impassable wall and bossing every duel in his area',
        ],
        manager: {
          comeback: [
            ({ manager, team }) => `A special mention for ${manager}, whose touch from the bench turned ${team} around and sealed a comeback of real merit.`,
            ({ manager }) => `${manager}'s reading from the touchline flipped the match: fine adjustments and a side that never stopped believing.`,
            ({ manager, team }) => `And on the tactical front, ${manager} nailed the right tweaks to set ${team} straight from the dugout.`,
          ],
          loss: [
            ({ manager, team }) => `Despite the effort, ${manager} ran out of cards on the bench and ${team} could not turn the night around.`,
            ({ manager, team, level }) => `${manager} searched for answers from the touchline, but the defeat left ${team} with no margin on floor ${level}.`,
            ({ manager, team }) => `Not even ${manager}'s changes found the key, and ${team} went home empty-handed despite battling to the end.`,
          ],
          lossRival: [
            ({ manager, opp, team }) => `The battle of the benches went ${opp}'s way, reading the game better than ${manager} and leaving ${team} without answers.`,
            ({ manager, opp, team }) => `${opp} won the touchline duel too: their adjustments outdid ${manager}'s and condemned ${team}.`,
          ],
          debut: [
            ({ manager, player }) => `${manager} dared to freshen things up and handed ${player} a debut in the starting eleven.`,
            ({ manager, player }) => `A gamble from the bench: ${manager} gave ${player} his debut in a decision that got people talking.`,
            ({ manager, player }) => `${manager} reached into the bench to hand ${player} a debut, a bet that did not go unnoticed.`,
          ],
          drawRival: [
            ({ manager, opp }) => `The draw rewarded two shrewd benches alike: ${manager} and ${opp} cancelled each other out from the touchline in a chess match with no winner.`,
            ({ manager, opp }) => `Stalemate in the coaching duel too: ${manager} and ${opp} moved their pieces without either imposing his plan.`,
          ],
          winRival: [
            ({ manager, opp, team }) => `The bench duel smiled on ${manager}, who got the jump on ${opp} with a plan ${team} carried out to the letter.`,
            ({ manager, opp }) => `${manager} won the tactical battle against ${opp} as well: his calls from the touchline shaped the night.`,
          ],
          subs: [
            ({ manager }) => `${manager}'s changes freshened up the side and pulled the strings from the touchline.`,
            ({ manager }) => `${manager} stirred the game from the bench with a couple of tweaks that shifted the momentum.`,
            ({ manager, team }) => `From the touchline, ${manager} managed the legs with measured changes that kept ${team} alive.`,
          ],
        },
      },
      units: {
        goals: ({ n }) => (n === 1 ? 'one goal' : `${NUM_WORDS.en[n] || n} goals`),
        assists: ({ n }) => (n === 1 ? 'an assist' : `${NUM_WORDS.en[n] || n} assists`),
        saves: ({ n }) => (n === 1 ? 'one outstanding save' : `${NUM_WORDS.en[n] || n} outstanding saves`),
        and: ' and ',
        wall: 'an unquestionable authority at the back',
      },
      closing: {
        win: [
          ({ team, figure, featSummary }) => `The final whistle confirmed a solid win for ${team}, who found in ${figure} their footballing and emotional leader. With ${featSummary}, the man of the match earned the recognition of fans and pundits alike, and his team is already preparing the assault on the next floor of the Tower of Legends.`,
          ({ team, figure, featSummary }) => `The final whistle sparked celebrations for ${team}, who leaned on ${figure} to see out a demanding night. With ${featSummary}, the standout delivered a top-class display and left the side brimming with confidence on the way to the next floor of the Tower of Legends.`,
        ],
        draw: [
          ({ team, opp, figure, featSummary }) => `The draw left a bittersweet taste in both dressing rooms, but nobody argued about the name of the night: with ${featSummary}, ${figure} held the team together in the hottest minutes of a duel that ${team} and ${opp} fought to the very last breath.`,
          ({ team, opp, figure, featSummary }) => `The draw felt like too little for both sides, yet the name of the night was beyond debate: with ${featSummary}, ${figure} held the team together in a duel ${team} and ${opp} levelled out to the very last minute.`,
        ],
        loss: [
          ({ team, figure, featSummary, level }) => `The final whistle certified the fall of ${team}, who found no answers against a more clinical rival. With ${featSummary}, ${figure} emerged as the executioner of the night and left ${team}'s climb halted on floor ${level} of the Tower of Legends.`,
          ({ team, figure, featSummary, level }) => `The final whistle confirmed ${team}'s slip, edged by a sharper rival in both boxes. With ${featSummary}, ${figure} was the night's big name and left ${team}'s climb frozen on floor ${level} of the Tower of Legends.`,
        ],
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
    menu: { kicker: 'Gravissez la tour. À chaque étage, un adversaire plus fort.', teamName: 'Nom de l’équipe', namePlaceholder: 'Légendes', nameError: 'Utilisez uniquement des lettres et des espaces.', flag: 'Drapeau', flagAria: 'Drapeau de l’équipe', flagError: 'Choisissez un drapeau pour commencer.', chooseFlag: 'Choisir un drapeau', newRun: 'Nouvelle run', continueRun: 'Continuer la partie', continueFloor: ({ level }) => `Niveau ${level}`, newRunConfirm: 'Une partie est en cours. En démarrer une nouvelle l’effacera. Continuer ?', runBusyTitle: 'Partie ouverte dans un autre onglet', runBusyBody: 'Cette partie est déjà ouverte dans un autre onglet ou fenêtre. Fermez-le et appuyez sur Réessayer pour continuer ici.', runBusyRetry: 'Réessayer', backToMenu: 'Retour au menu', wiki: 'Wiki', disclaimer: 'Projet non officiel et non affilié. Cartes avec données fictives ; aucune marque déposée.', liveNow: ({ n }) => `${n} en train de jouer`, totalRuns: ({ n }) => `${n} parties jouées` },
    generic: { level: ({ level }) => `Niveau ${level}`, floor: ({ floor }) => `Étage ${floor}`, vs: 'vs', close: 'Fermer', choose: 'Choisir', players: 'Joueurs', items: 'Objets', player: 'joueur', item: 'objet', loading: 'Chargement...', noData: 'Aucun score pour le moment.', current: 'Actuel', final: 'Fin', local: 'Domicile', opponent: 'Adversaire' },
    pack: { playerTitle: 'Pack de joueur', itemTitle: 'Pack d’objet', playerHint: 'Lisez poste, attributs, rareté, nation et époque. Construisez des synergies.', itemHint: 'Les objets modifient votre équipe. Intégrez-les à votre plan.', playerOpen: 'Ouvrir un pack de joueurs', itemOpen: 'Ouvrir un pack d’objets', chooseOne: ({ count, hint }) => `Choisissez 1 sur ${count}. ${hint}`, tap: 'Touchez pour ouvrir', nationTitle: 'Pack de sélections', nationHint: 'Pack spécial : choisissez une sélection historique et prenez le joueur que vous voulez.', nationOpen: 'Ouvrir un pack de sélections', nationBadge: 'Sélection', nationNew: ({ n }) => `${n} nouveaux joueurs`, nationTopOvr: ({ ovr }) => `OVR max ${ovr}`, nationPickHint: 'Choisissez n’importe quel joueur de cette sélection pour votre effectif.', review: 'Voir mon équipe', reviewTitle: ({ count }) => `Votre effectif (${count} cartes)`, corruptoTitle: 'Le pack de l’agent', corruptoHint: 'Un joueur utilisera votre équipe comme tremplin. Ouvrez-le et il intègre votre onze.', corruptoOpen: 'Ouvrir le pack', shinyTitle: 'Le pack de l’agent', shinyHint: 'Votre récompense : choisissez une pépite avec +10 à toutes ses stats.', shinyOpen: 'Ouvrir le pack Shiny', shinySale: ({ name }) => `${name} a été vendu avec succès à un grand club du Moyen-Orient. Son agent veut vous récompenser, ouvrez ce pack.` },
    card: { owned: 'Déjà dans votre effectif', rarity: { common: 'Commune', rare: 'Rare', epic: 'Épique', legend: 'Légende', corrupto: 'Corrompu', shiny: 'Shiny' }, position: { GK: 'GB', DEF: 'DEF', MID: 'MIL', FWD: 'ATT', ENG: 'MOC' }, line: { GK: 'But', DEF: 'Défense', MID: 'Milieu', FWD: 'Attaque', ENG: 'Meneur' }, stat: { pace: 'VIT', shooting: 'TIR', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'PHY', reflexes: 'REF', handling: 'PRI', positioning: 'POS' }, trait: { Francotirador: 'Tireur d’élite', Cañón: 'Canon', Muro: 'Mur', Motor: 'Moteur', Maestro: 'Maestro', Líbero: 'Libéro', Paradón: 'Arrêt réflexe', Killer: 'Tueur', Velocista: 'Sprinteur', Especialista: 'Spécialiste', Penalero: 'Tireur de penalty', Capitán: 'Capitaine', Garra: 'Hargne', Mariscal: 'Maréchal', Roto: 'Fragile' }, synergy: ({ type }) => `Synergie : ${type}`, itemType: { equipamiento: 'équipement', tactica: 'tactique', reliquia: 'relique' } },
    build: { title: 'Composez votre équipe', nextOpponent: 'Prochain adversaire', viewLineup: 'Voir le onze', chemistry: 'Collectif', tacticalBoard: 'Tableau tactique', formationAria: 'Formation', roster: 'Effectif', benchAll: 'Poste', benchFilterAria: 'Filtrer les remplaçants par ligne', rosterCount: ({ total, missing }) => `${total} cartes · ${missing} place${missing === 1 ? '' : 's'} libre${missing === 1 ? '' : 's'}`, noSubs: 'Aucun remplaçant disponible.', noItems: 'Aucun objet pour l’instant.', activeItems: ({ count }) => `Objets actifs (${count})`, play: 'Jouer le match', missing: ({ count }) => `Complétez le onze (${count} manquant${count === 1 ? '' : 's'})`, statsDialog: 'Statistiques du joueur', playerDragAria: ({ name }) => `${name}, glisser pour déplacer ou toucher pour retirer du onze`, playerSealedAria: ({ name }) => `${name}, verrouillé dans le onze : impossible à déplacer ou retirer`, emptyAria: ({ label }) => `Place ${label} libre, ajouter un joueur`, viewStatsAria: ({ name }) => `Voir les statistiques de ${name}`, benchAria: ({ name }) => `${name}, glisser sur le terrain ou toucher pour aligner`, noCandidates: ({ label }) => `Vous n’avez aucun remplaçant compatible pour ${label}. Trouvez-en dans les packs.`, pickerHead: ({ label }) => `${label} — choisissez qui entre`, targetPickerHead: ({ name }) => `${name} — choisissez sa place`, suspended: 'Expulsé : indisponible ce match', benchSuspendedAria: ({ name }) => `${name}, expulsé au match précédent : ne peut pas être aligné`, injured: 'Blessé : en récupération', benchInjuredAria: ({ name }) => `${name}, blessé : en récupération, ne peut pas être aligné`, openSlot: 'Place libre' },
    scouting: { report: 'Rapport adversaire', manager: 'Entraîneur', formation: ({ formation }) => `Formation ${formation}`, strength: 'Force', opponentEleven: 'Onze principal adverse', note: 'Notes de jeu pour la Coupe des Légendes. Onze historique représentatif du tournoi.', continue: 'Composer mon équipe' },
    squadIntro: { kicker: 'Votre équipe est prête', cards: ({ count }) => `${count} cartes`, eleven: 'Onze de départ', bench: 'Remplaçants', note: 'Voici votre effectif de départ. Touchez une carte pour voir ses attributs ; vous pourrez ajuster le onze avant chaque match.', continue: 'Ouvrir mon premier pack' },
    ratings: { attack: 'ATT', midfield: 'MIL', defense: 'DÉF', gk: 'GAR', physical: 'PHY' },
    match: { plays: ({ count }) => `${count} actions`, tickerStart: ({ level }) => `Niveau ${level} · Highlights en direct.`, playPauseAria: 'Lire ou mettre en pause', speedAria: 'Vitesse', nextAria: 'Highlight suivant', skipAria: 'Aller à la fin', skipFinal: '⏩ Fin', viewResult: 'Voir le résultat', continue: 'Continuer', modesAria: 'Mode d’affichage', modes: { full: 'Highlights', key: 'Temps forts', commentary: 'Commentaire', instant: 'Instantané' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Attaque dangereuse...`, parada: ({ minute }) => `Min ${minute}' - Tir cadré...`, shot: ({ minute }) => `Min ${minute}' - Le tir se prépare...`, falta: ({ minute }) => `Min ${minute}' - Contact sous pression...`, default: ({ minute }) => `Min ${minute}' - L’action se construit...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Fin · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fin du match. ${homeGoals} à ${awayGoals}.` },
    result: { tier: { goleada: 'ROUSTE !', amplia: 'Large victoire', ajustada: 'Victoire serrée', empate: 'Match nul', derrota: 'Défaite' }, lostStep: 'Échelon perdu', towerFall: 'Chute de la tour', retry: 'Retenter l’échelon', nextLevel: 'Niveau suivant', reward: 'Récompense', lossCopy: ({ lives }) => `Vous avez perdu cet échelon. Il vous reste ${lives} vie${lives === 1 ? '' : 's'}.`, rewardCopy: ({ players, items }) => `Récompense prête : pack de ${players} joueurs et ${items} objets à choisir.`, scorers: 'Buteurs', reds: 'Expulsés', injuries: 'Blessés', warmup: 'échauff.', injuryMatchesTitle: ({ n }) => n > 0 ? `Absent ${n} match${n === 1 ? '' : 's'}` : 'Aucun match manqué', saves: 'Arrêts', lastMatch: 'Dernier match', lastTactic: 'Votre tactique', subs: 'Changements', gameOver: 'Fin de run', floorsReached: 'étages atteints', newRecord: '★ Nouveau record', best: ({ best }) => `Meilleure marque : ${best}`, winsRoster: ({ wins, count }) => `${wins} victoire${wins === 1 ? '' : 's'} · effectif de ${count} joueurs`, route: 'Parcours', finalSquad: 'Effectif final', playAgain: 'Rejouer', endRun: 'Terminer la partie', replay: 'Rejouer', pathLevel: ({ level }) => `Nv ${level}` },
    carryover: { title: 'Choisis un joueur pour ta prochaine partie', hint: 'Il rejoindra une nouvelle équipe aléatoire.', back: 'Retour' },
    leaderboard: { floor: ({ floor }) => `Étage ${floor}`, updating: 'Mise à jour du classement...', readOnly: 'Serveur sans écriture : affichage du classement sauvegardé.', rank: ({ rank }) => `Votre run termine #${rank}.`, notTop: 'Vous n’êtes pas dans le top 20.', title: 'Classement historique', top: 'Top 20', titleWeekly: 'Classement hebdo', topWeekly: 'Top 20 hebdo', empty: 'Aucun score pour le moment.', lineup: 'Dernier onze' },
    adminLogin: { title: 'Accès restreint', kicker: 'Panneau d’édition des joueurs.', user: 'Utilisateur', password: 'Mot de passe', submit: 'Entrer', back: 'Retour au jeu', checking: 'Vérification...', genericError: 'Impossible de se connecter.', invalidCredentials: 'Utilisateur ou mot de passe incorrect.', httpError: ({ status }) => `Impossible de se connecter (HTTP ${status}).`, missingToken: 'Le serveur n’a pas renvoyé de jeton de session.' },
    admin: { back: 'Retour', badge: 'Admin', title: 'Panneau des joueurs', logout: 'Déconnexion', search: 'Rechercher', searchPlaceholder: 'Nom, pays, époque...', position: 'Poste', all: 'Toutes', count: ({ visible, total }) => `${visible} sur ${total} joueurs · du meilleur au moins bon`, selected: 'Joueur sélectionné', name: 'Nom', nation: 'Nation', era: 'Époque', rarity: 'Rareté', ovr: 'OVR calculé', trait: 'Trait', noTrait: 'Sans trait', tacticalType: 'Type tactique', noType: 'Sans type', saveStats: 'Enregistrer les stats', portraitAria: 'Éditeur d’image de profil', portrait: 'Image de profil', toolEffect: 'Effet tool', replaceImage: 'Remplace l’image actuelle', pickImage: 'Glissez ou choisissez une image', imageHint: 'Gros plan recommandé', converted: 'Convertie', savePortrait: 'Enregistrer l’image du joueur', noPlayers: 'Aucun joueur à éditer.', invalidImage: 'Choisissez un fichier image valide.', converting: 'Conversion avec l’outil Python...', convertedReady: 'Image convertie avec l’outil Python, prête à enregistrer.', convertError: ({ message }) => `Conversion impossible : ${message}`, savingImage: 'Enregistrement de l’image sur le disque...', readFailed: 'échec de lecture', expired: 'Session expirée. Reconnectez-vous au panneau.', startServer: 'Lancez l’app avec npm run serve pour utiliser le convertisseur Python exact.', invalidPortrait: 'Le convertisseur Python n’a pas renvoyé de portrait valide.', saveNeedsServer: 'Impossible d’enregistrer. Lancez l’app avec `npm run serve` pour modifier la base de joueurs.', saveHttpError: ({ status }) => `Impossible d’enregistrer la base de joueurs (HTTP ${status}).`, playerNotFound: ({ id }) => `Joueur introuvable : ${id}`, stat: { pace: 'Vitesse', shooting: 'Tir', passing: 'Passe', dribbling: 'Dribble', defending: 'Défense', physical: 'Physique', reflexes: 'Réflexes', handling: 'Prise', positioning: 'Placement' }, positionOption: { GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }, tactical: { posesion: 'Possession', presion: 'Pressing', contra: 'Contre' } },
    narrator: {
      player: 'Joueur', phases: { corner: 'sur corner', free_kick: 'sur coup franc', penalty: 'sur penalty', counter: 'en transition', default: 'dans l’action' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} lit l’action, la défense se referme et ${team} perd le ballon.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tente de filtrer, mais la défense de ${defender} avance.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contre de ${attacker} après récupération ! ${shooter} part balle au pied…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} tente de changer le rythme, mais la passe longue sort.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} s’échappe et ${defender} le fauche. L’arbitre sort la carte : rouge directe !`, faltaSegundaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${defender} fauche encore ${receiver}. Deuxième jaune… et rouge !`, faltaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} cherche l’appel et ${defender} arrive en retard. Faute et carton jaune pour ${defender}.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} cherche l’appel et ${defender} arrive en retard. Faute ${kind}.`, faltaPeligrosa: 'dangereuse', faltaPresion: 'au pressing', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} lance ${receiver}, mais la ligne défensive le prend hors-jeu.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — centre dans la surface de ${attacker} ; ${defender} gagne dans les airs et dégage.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tente d’avancer, mais ${defender} récupère et éloigne le ballon.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} gagne du terrain, mais ${defender} recule en bloc et ferme l’angle de tir.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} trouve une fenêtre de tir, mais ${defender} se jette et contre.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} tente ${phase}, mais la frappe passe à côté.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} tente ${phase} et ${keeper} répond par un grand arrêt !${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} s’élance du point de penalty… BUUUT pour ${team} ! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — coup franc de ${shooter}, au-dessus du mur… BUUUT pour ${team} ! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — centre de ${passer} et tête de ${shooter}… BUUUT pour ${team} ! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} lance ${shooter} après l’appel… BUUUT pour ${team} ! (${score})${xg}`, default: ({ m }) => `Min ${m}' — action.`,
    },
    scene: {
      badge: { penalty: 'PENALTY', free_kick: 'COUP FRANC', corner: 'CORNER', gol: 'BUT', parada: 'ARRÊT', tiro_fuera: 'TIR À CÔTÉ', bloqueo: 'CONTRE', roja: 'ROUGE', amarilla: 'JAUNE', falta: 'FAUTE', fuera_juego: 'HORS-JEU', despeje: 'DÉGAGEMENT', perdida: 'RÉCUPÉRATION', pase_fuera: 'PASSE LONGUE', default: 'ACTION' }, role: { protagonist: 'Protagoniste', scorer: 'Buteur', shooter: 'Tireur', assistant: 'Passeur', keeper: 'Gardien', defender: 'Défenseur', receiver: 'Receveur' }, title: { midfield_pass: 'Passe au milieu', defensive_pass: 'Relance depuis l’arrière', defensive_recovery: 'Récupération défensive', shot: 'Frappe', cross: 'Centre dans la surface', free_kick: 'Coup franc', free_kick_goal: 'But sur coup franc', penalty: 'Penalty', penalty_goal: 'But sur penalty', shot_goal: 'But sur frappe', shot_goal_alt: 'But sur frappe', header_goal: 'But de la tête', yellow_foul: 'Faute et jaune', red_foul: 'Faute et rouge', goal_kick: 'Six mètres' }, alt: { midfield_pass: 'Scène pixelart d’une passe au milieu', defensive_pass: 'Scène pixelart d’une passe défensive', defensive_recovery: 'Scène pixelart d’une récupération défensive', shot: 'Scène pixelart d’un attaquant qui frappe', cross: 'Scène pixelart d’un centre dans la surface', free_kick: 'Scène pixelart d’un coup franc', free_kick_goal: 'Scène pixelart d’un coup franc dangereux', penalty: 'Scène pixelart d’un penalty', penalty_goal: 'Scène pixelart d’un but sur penalty', shot_goal: 'Scène pixelart d’un but sur frappe', shot_goal_alt: 'Scène pixelart alternative d’un but sur frappe', header_goal: 'Scène pixelart d’un but de la tête', yellow_foul: 'Scène pixelart d’une faute avec carton jaune', red_foul: 'Scène pixelart d’une faute avec carton rouge', goal_kick: 'Scène pixelart d’un six mètres' }, highlight: 'Highlight', goalStamp: 'BUT !', headline: { gol: ({ attacker }) => `But de ${attacker}`, parada: ({ keeper }) => `Arrêt de ${keeper}`, tiro_fuera: ({ shooter }) => `Frappe à côté de ${shooter}`, bloqueo: ({ defender }) => `Contre de ${defender}`, faltaRoja: 'Faute dure', falta: 'Faute tactique', fuera_juego: 'Hors-jeu', despeje: 'La défense dégage', pase_fuera: 'Passe trop longue', perdida: 'Récupération défensive', default: ({ attacker }) => `${attacker} ne trouve pas de tir` },
    },
    injury: {
      severity: { simple: 'léger', moderada: '1 match', grave: '3 matchs', muy_grave: '6 matchs' },
      types: {
        simple: ['crampe', 'contusion', 'douleur à la cheville', 'légère surcharge'],
        moderada: ['entorse de la cheville', 'élongation musculaire', 'torsion du genou', 'contracture'],
        grave: ['déchirure musculaire', 'entorse de grade 2', 'luxation de l’épaule', 'micro-déchirure musculaire'],
        muy_grave: ['rupture des ligaments croisés', 'fracture du péroné', 'rupture du tendon d’Achille', 'grave luxation du genou'],
      },
    },
    press: {
      masthead: 'La Gazette de la Tour',
      edition: ({ level }) => `Édition spéciale · Étage ${level}`,
      caption: ({ name }) => `${name}, l’homme du match`,
      photoAlt: ({ name }) => `Portrait pixelart de ${name}`,
      headline: {
        winBig: [
          ({ team, figure }) => `Récital de ${team} porté par un ${figure} de légende`,
          ({ team, figure }) => `Festival de ${team}, avec ${figure} en chef d’orchestre`,
        ],
        win: [
          ({ team, figure }) => `${figure} guide ${team} vers une victoire de caractère`,
          ({ team, figure }) => `${team} s’offre la nuit grâce à ${figure}`,
        ],
        draw: [
          ({ team, opp }) => `${team} et ${opp} se quittent sur un nul âprement disputé`,
          ({ team, opp }) => `${team} et ${opp} se partagent les points au bout d’un bras de fer sans répit`,
        ],
        loss: [
          ({ team, opp }) => `${opp} stoppe net l’ascension de ${team}`,
          ({ team, opp }) => `${team} trébuche et ${opp} lui coupe les ailes en pleine ascension`,
        ],
      },
      lead: {
        win: [
          ({ team, opp, score, figure, feat }) => `La sélection de ${team} s’est imposée ${score} face à ${opp} au terme d’un match intense qui a offert de grandes émotions du début à la fin. Le protagoniste absolu de la soirée fut ${figure}, auteur d’une prestation mémorable en ${feat}, décisif dans chacun des moments clés de la rencontre.`,
          ({ team, opp, score, figure, feat }) => `${team} a écarté ${opp} ${score} au bout d’un bras de fer disputé à cent à l’heure, du premier au dernier instant. Celui qui a donné le ton fut ${figure}, décisif en ${feat} et maître des moments qui ont vraiment pesé.`,
        ],
        draw: [
          ({ team, opp, score, figure, feat }) => `${team} et ${opp} se sont quittés sur un ${score} au terme d’une rencontre intense où aucun des deux n’a baissé les bras. Si quelqu’un a tenu la baraque, c’est bien ${figure}, qui a porté l’équipe en ${feat} et entretenu l’espoir des siens jusqu’au coup de sifflet final.`,
          ({ team, opp, score, figure, feat }) => `Un ${score} sans vainqueur a résumé le chassé-croisé entre ${team} et ${opp}, qui se sont rendu coup pour coup sans rien lâcher. Le plus constant fut ${figure}, qui a porté les siens en ${feat} quand le duel réclamait un leader.`,
        ],
        loss: [
          ({ team, opp, score, figure, feat }) => `La sélection de ${opp} s’est imposée ${score} face à ${team} dans un duel rugueux qui s’est joué sur des détails. Le grand homme du match fut ${figure}, qui a fait la différence en ${feat} et laissé son adversaire sans réponse.`,
          ({ team, opp, score, figure, feat }) => `${opp} a eu raison de ${team} ${score} dans une partie serrée et hachée, débloquée par les petits détails. Le grand bonhomme fut ${figure}, qui a fait la différence en ${feat} et laissé ${team} prisonnier du plan adverse.`,
        ],
      },
      body: {
        opener: [
          ({ att, def, minute, scorer, how, score }) => `Dès l’entame, ${att} a affiché un état d’esprit offensif et un pressing haut qui a gêné la relance de ${def}. L’insistance a payé à la ${minute}e minute, lorsque ${scorer} ${how} pour porter le score à ${score}. Ce but a donné confiance aux siens, qui ont commencé à contrôler la possession et à créer un danger constant sur les ailes.`,
          ({ att, def, minute, scorer, how, score }) => `${att} n’a pas tardé à donner le ton : pressing haut et appels dans le dos pour enfermer ${def} dans son camp. La récompense est tombée à la ${minute}e minute, quand ${scorer} ${how} pour ouvrir le score (${score}). Le premier coup porté, les siens ont posé le pied sur le ballon et dicté le tempo à leur convenance.`,
        ],
        scoreless: [
          ({ team, opp, keeper }) => `La première période fut un bras de fer tactique au cours duquel ${team} et ${opp} se sont jaugés sans concéder d’espaces. Les défenses ont pris le dessus sur les attaques et, quand il l’a fallu, ${keeper} a éteint les incendies dans la surface. On a atteint la pause sans but, avec le sentiment qu’un détail déciderait du match.`,
          ({ team, opp, keeper }) => `La première période s’est jouée frein à main tiré : ${team} et ${opp} ont préféré ne pas perdre plutôt que de prendre des risques, et le ballon a circulé davantage au milieu que dans les surfaces. Dès que quelqu’un osait, ${keeper} était là pour calmer le jeu. On a atteint la pause sur un score nul, avec la sensation d’un match à pile ou face.`,
        ],
        quiet: [
          ({ team, opp, keeper }) => `Le tableau d’affichage n’a plus bougé en seconde période : ${team} et ${opp} ont échangé des offensives sans lucidité dans les derniers mètres, et chaque tentative est morte dans les gants de ${keeper} ou sur les pieds d’une défense bien en place. Le duel s’est refermé sans frayeur, scellé par ce qui s’était semé avant la pause.`,
          ({ team, opp, keeper }) => `La seconde période a claqué la porte : ${team} et ${opp} ont tenté par à-coups mais sans profondeur ni dernière passe, et le peu qui est arrivé a échoué sur ${keeper} ou sur une défense concentrée. Le duel s’est éteint petit à petit, fidèle au scénario de la première mi-temps.`,
        ],
        red: [
          ({ player, team, minute }) => `Le match s’est compliqué avec l’expulsion de ${player} à la ${minute}e minute, laissant ${team} en infériorité et conditionnant totalement la fin de rencontre.`,
          ({ player, team, minute }) => `La rencontre a basculé sur le carton rouge de ${player} à la ${minute}e minute : ${team}, réduit à dix, a dû serrer les dents pour protéger le résultat jusqu’au bout.`,
        ],
        injury: {
          simple: [
            ({ player, team, minute, type }) => `${player} a demandé le changement à la ${minute}e à cause d’une ${type} et a cédé sa place sur-le-champ, mais la frayeur est restée sans suite.`,
            ({ player, team, minute, type }) => `Une ${type} a contraint ${player} à sortir à la ${minute}e : ${team} a puisé dans le banc, mais ce ne fut qu’un pépin léger.`,
            ({ player, team, minute, type }) => `${team} a perdu ${player} à la ${minute}e sur une ${type} ; rien de grave, mais assez pour quitter le terrain aussitôt.`,
            ({ player, team, minute, type }) => `${player} a levé la main à la ${minute}e à cause d’une ${type} et a demandé le changement sans forcer ; une alerte mineure que ${team} n’a pas voulu prendre à la légère.`,
          ],
          moderada: [
            ({ player, team, minute, type }) => `${player} est tombé à la ${minute}e avec une ${type} et a dû être remplacé : ${team} perd un élément important pour le prochain rendez-vous.`,
            ({ player, team, minute, type }) => `La ${type} de ${player} à la ${minute}e a déclenché l’alarme à ${team}, qui l’a sorti visiblement gêné pour les semaines à venir.`,
            ({ player, team, minute, type }) => `Mauvaise nouvelle pour ${team} : ${player} est sorti à la ${minute}e avec une ${type} qui le privera du prochain match.`,
            ({ player, team, minute, type }) => `${player} a quitté la pelouse à la ${minute}e, touché par une ${type}, et à ${team} on fait déjà les comptes pour le prochain rendez-vous.`,
          ],
          grave: [
            ({ player, team, minute, type }) => `Image inquiétante à la ${minute}e : ${player} s’est effondré sur une ${type} et a quitté le terrain visiblement souffrant, coup dur pour les plans de ${team}.`,
            ({ player, team, minute, type }) => `La ${type} de ${player} à la ${minute}e a imposé une sortie en urgence ; ${team} aborde les prochaines journées sans l’une de ses références.`,
            ({ player, team, minute, type }) => `${team} a encaissé un sérieux revers lorsque ${player} a dû quitter la pelouse à la ${minute}e sur une ${type} annonçant plusieurs semaines d’absence.`,
            ({ player, team, minute, type }) => `Grimace de douleur à la ${minute}e : ${player} n’a pu continuer sur une ${type} et a regagné le banc tête basse, un contretemps sérieux pour ${team} dans les semaines à venir.`,
          ],
          muy_grave: [
            ({ player, team, minute, type }) => `Drame à la ${minute}e : ${player} est sorti sous les applaudissements après une ${type} d’une extrême gravité qui l’éloignera longtemps et assombrit la soirée de ${team}.`,
            ({ player, team, minute, type }) => `Le match a été marqué par la ${type} de ${player} à la ${minute}e : une blessure très grave qui prive ${team} de son joueur pour des mois.`,
            ({ player, team, minute, type }) => `${team} a reçu la pire des nouvelles à la ${minute}e : ${player} a subi une ${type} de la plus haute gravité et son retour s’annonce très lointain.`,
            ({ player, team, minute, type }) => `Image amère à la ${minute}e : ${player} est sorti dans l’inquiétude générale sur une ${type} d’une extrême gravité, une absence de longue durée qui frappe ${team} de plein fouet.`,
          ],
        },
        injurySub: [
          ({ inName }) => `${inName} a pris sa place depuis le banc.`,
          ({ inName }) => `À sa place est entré ${inName}.`,
          ({ inName }) => `Le banc a répondu aussitôt avec ${inName}.`,
          ({ inName }) => `${inName} est entré pour prendre le relais sur-le-champ.`,
        ],
        injuryWarmup: [
          ({ player, team, type }) => `${player} s’est blessé à l’échauffement (${type}) et n’est jamais entré sur le terrain : ${team} perd un élément avant même le coup d’envoi.`,
          ({ player, team, type }) => `Coup dur pour ${team} avant le match : ${player} s’est ressenti de ${type} à l’échauffement et a déclaré forfait sans jouer.`,
          ({ player, team, type }) => `${team} a perdu ${player} à l’échauffement, où ${type} l’a écarté de la rencontre avant le début.`,
          ({ player, team, type }) => `Malchance pour ${player}, touché par ${type} en s’échauffant ; ${team} s’est retrouvé avec un remplaçant en moins.`,
        ],
        subSwap: [
          ({ inName, outName, cause, minute }) => `Pour combler le vide laissé par ${cause}, ${inName} est entré en jeu à la ${minute}e et ${outName} a cédé sa place pour reconstruire la défense.`,
          ({ inName, outName, cause, minute }) => `Privé de ${cause}, le coach a refait son tableau à la ${minute}e : ${inName} est entré et ${outName} a laissé sa place pour étayer une défense de fortune.`,
        ],
        subIn: [
          ({ inName, cause, minute }) => `Après l’expulsion de ${cause}, ${inName} est entré du banc à la ${minute}e pour renforcer la défense.`,
          ({ inName, cause, minute }) => `${cause} déjà sorti, ${inName} a foulé la pelouse à la ${minute}e pour boucher le trou derrière.`,
        ],
        forfeit: [
          ({ team }) => `Avec quatre expulsés, ${team} n’avait plus assez de joueurs et l’arbitre a déclaré le match perdu.`,
          ({ team }) => `À court de joueurs après la quatrième expulsion, ${team} n’a pu continuer et l’arbitre a sifflé la fin anticipée du match.`,
        ],
        penaltyMiss: [
          ({ shooter, keeper, minute }) => `Il y eut du drame depuis le point de penalty à la ${minute}e minute : ${shooter} tenait le but au bout du pied, mais ${keeper} et la chance lui ont refusé la célébration.`,
          ({ shooter, keeper, minute }) => `Le penalty de la ${minute}e promettait une fête et a viré à la frustration : ${shooter} s’est présenté, mais ${keeper} a lu ses intentions et signé l’arrêt de la soirée.`,
        ],
        nearMissSave: [
          ({ shooter, keeper, minute }) => `Tout n’a pas souri dans les derniers mètres : la plus belle occasion envolée fut pour ${shooter} à la ${minute}e minute, mais ${keeper} a remporté le face-à-face d’une intervention de grande valeur.`,
          ({ shooter, keeper, minute }) => `La plus grosse frayeur portait la signature de ${shooter} à la ${minute}e minute, mais ${keeper} s’est détendu tel un félin pour préserver sa cage inviolée.`,
        ],
        nearMissWide: [
          ({ shooter, minute }) => `Tout n’a pas souri dans les derniers mètres : la plus belle occasion envolée fut pour ${shooter} à la ${minute}e minute, dont la frappe a frôlé le poteau sous les soupirs des tribunes.`,
          ({ shooter, minute }) => `La meilleure occasion sans récompense fut pour ${shooter} à la ${minute}e minute, d’une frappe sèche qui a heurté la barre et coupé court à la fête dans les tribunes.`,
        ],
        bestSave: [
          ({ keeper, shooter, minute }) => `L’arrêt de la soirée est survenu à la ${minute}e minute, lorsque ${keeper} a refusé un but tout fait à ${shooter} et maintenu les siens en vie au moment de pression maximale.`,
          ({ keeper, shooter, minute }) => `Le grand arrêt de la soirée est venu à la ${minute}e minute : ${keeper} a sorti d’une main miraculeuse une frappe à bout portant de ${shooter} et gardé intacts les espoirs des siens.`,
        ],
      },
      goal: {
        extend: [
          ({ scorer, minute, how, score }) => `L’avance a grandi à la ${minute}e minute, lorsque ${scorer} ${how} et porta la marque à ${score}.`,
          ({ scorer, minute, how, score }) => `Le coup décisif au moral adverse est tombé à la ${minute}e : ${scorer} ${how} et creusa l’écart (${score}).`,
        ],
        lead: [
          ({ team, scorer, minute, how, score }) => `À la ${minute}e minute, ${scorer} ${how} et plaça ${team} devant au tableau d’affichage (${score}).`,
          ({ team, scorer, minute, how, score }) => `${scorer} a fait sauter le verrou à la ${minute}e minute : ${how} et plaça ${team} aux commandes (${score}).`,
        ],
        equalizer: [
          ({ team, scorer, minute, how }) => `${team} a réagi et trouvé l’égalisation à la ${minute}e minute : ${scorer} ${how} et remit les deux équipes à hauteur.`,
          ({ team, scorer, minute, how }) => `${team} a refait surface à la ${minute}e minute : ${scorer} ${how} et rétablit l’égalité au tableau d’affichage.`,
        ],
        comeback: [
          ({ team, scorer, minute, how }) => `${team} a réduit l’écart à la ${minute}e minute grâce à ${scorer}, qui ${how} et fit renaître l’incertitude.`,
          ({ team, scorer, minute, how }) => `${team} s’est accroché au match à la ${minute}e minute par ${scorer}, qui ${how} et remit les siens dans la course.`,
        ],
        sealer: [
          ({ scorer, minute, how, score }) => `Et alors que le match semblait ouvert, la hiérarchie a reparlé : à la ${minute}e minute, ${scorer} ${how} et scella le ${score} définitif.`,
          ({ scorer, minute, how, score }) => `Et au moment où l’adversaire rêvait d’un retour, l’estocade est tombée : ${scorer} ${how} à la ${minute}e minute et fixa le ${score} définitif.`,
        ],
      },
      how: {
        penalty: [
          'n’a pas tremblé depuis le point de penalty',
          'a envoyé le gardien du mauvais côté et converti le penalty sans trembler',
        ],
        freeKick: [
          'a déposé un coup franc hors de portée du gardien',
          'a enroulé un coup franc imparable qui s’est glissé contre le poteau',
        ],
        header: [
          'a pris le dessus dans les airs et placé une tête imparable',
          'a expédié au fond une tête imparable',
        ],
        headerAssist: [
          ({ assister }) => `a repris de la tête un centre millimétré de ${assister}`,
          ({ assister }) => `a surgi seul pour reprendre de la tête un centre millimétré de ${assister}`,
        ],
        counter: [
          'a conclu une contre-attaque éclair avec un sang-froid de tueur',
          'a mené le contre à toute allure et l’a conclu d’une finition chirurgicale',
        ],
        shotAssist: [
          ({ assister }) => `a profité d’une passe en profondeur de ${assister} pour battre le gardien d’une frappe croisée`,
          ({ assister }) => `a récupéré un ballon dans l’espace de ${assister} et battu le gardien d’une frappe placée`,
        ],
        shot: [
          'a surgi dans la surface au bout d’une action collective et conclu avec précision',
          'a sauté sur un ballon qui traînait dans la surface et fusillé le gardien',
        ],
      },
      feat: {
        goals: [
          ({ goals }) => `inscrivant ${goals}`,
          ({ goals }) => `plantant ${goals}`,
        ],
        goalsAssists: [
          ({ goals, assists }) => `inscrivant ${goals} et délivrant ${assists}`,
          ({ goals, assists }) => `plantant ${goals} et offrant ${assists}`,
        ],
        assists: [
          ({ assists }) => `délivrant ${assists}`,
          ({ assists }) => `offrant ${assists}`,
        ],
        saves: [
          ({ saves }) => `maintenant les siens à flot avec ${saves}`,
          ({ saves }) => `gardant les siens en vie avec ${saves}`,
        ],
        wall: [
          'gagnant chaque duel sans perdre le moindre ballon disputé',
          'se dressant en mur infranchissable et régnant sur chaque duel dans sa zone',
        ],
        manager: {
          comeback: [
            ({ manager, team }) => `Mention spéciale pour ${manager}, dont la patte depuis le banc a redressé ${team} et signé une remontée de grande valeur.`,
            ({ manager }) => `La lecture de ${manager} depuis la touche a fait basculer le match : ajustements fins et une équipe qui n’a jamais cessé d’y croire.`,
            ({ manager, team }) => `Et sur le plan tactique, ${manager} a trouvé les retouches justes pour remettre ${team} dans le sens de la marche depuis le banc.`,
          ],
          loss: [
            ({ manager, team }) => `Malgré les efforts, ${manager} a épuisé ses cartouches sur le banc et ${team} n’a pu renverser la soirée.`,
            ({ manager, team, level }) => `${manager} a cherché des réponses depuis la touche, mais la défaite a laissé ${team} sans marge à l’étage ${level}.`,
            ({ manager, team }) => `Même les changements de ${manager} n’ont pas trouvé la clé, et ${team} est reparti bredouille malgré une bataille jusqu’au bout.`,
          ],
          lossRival: [
            ({ manager, opp, team }) => `Le duel des bancs a tourné à l’avantage de ${opp}, qui a mieux lu le match que ${manager} et laissé ${team} sans réponse.`,
            ({ manager, opp, team }) => `${opp} a aussi gagné la bataille depuis la touche : ses ajustements ont surpassé ceux de ${manager} et condamné ${team}.`,
          ],
          debut: [
            ({ manager, player }) => `${manager} a osé une nouveauté et lancé ${player}, qui a vécu ses débuts dans le onze.`,
            ({ manager, player }) => `Pari du banc : ${manager} a fait débuter ${player} dans une décision qui a fait parler.`,
            ({ manager, player }) => `${manager} est allé piocher sur le banc pour offrir ses débuts à ${player}, un pari qui n’est pas passé inaperçu.`,
          ],
          drawRival: [
            ({ manager, opp }) => `Le nul a récompensé deux bancs avisés à parts égales : ${manager} et ${opp} se sont neutralisés depuis la touche dans une partie d’échecs sans vainqueur.`,
            ({ manager, opp }) => `Match nul aussi dans le duel des techniciens : ${manager} et ${opp} ont déplacé leurs pièces sans qu’aucun n’impose son plan.`,
          ],
          winRival: [
            ({ manager, opp, team }) => `Le bras de fer des bancs a souri à ${manager}, qui a pris de vitesse ${opp} avec un plan que ${team} a exécuté à la lettre.`,
            ({ manager, opp }) => `${manager} a aussi gagné la bataille tactique face à ${opp} : ses choix depuis la touche ont dessiné la soirée.`,
          ],
          subs: [
            ({ manager }) => `Les changements de ${manager} ont rafraîchi l’équipe et tiré les ficelles depuis la touche.`,
            ({ manager }) => `${manager} a agité le match depuis le banc avec deux retouches qui ont changé la dynamique.`,
            ({ manager, team }) => `Depuis la touche, ${manager} a géré les organismes avec des changements mesurés qui ont maintenu ${team} en vie.`,
          ],
        },
      },
      units: {
        goals: ({ n }) => (n === 1 ? 'un but' : `${NUM_WORDS.fr[n] || n} buts`),
        assists: ({ n }) => (n === 1 ? 'une passe décisive' : `${NUM_WORDS.fr[n] || n} passes décisives`),
        saves: ({ n }) => (n === 1 ? 'un arrêt de grande classe' : `${NUM_WORDS.fr[n] || n} arrêts de grande classe`),
        and: ' et ',
        wall: 'une autorité incontestable derrière',
      },
      closing: {
        win: [
          ({ team, figure, featSummary }) => `Le coup de sifflet final a confirmé une victoire solide de ${team}, qui a trouvé en ${figure} son leader footballistique et émotionnel. Avec ${featSummary}, l’homme du match a gagné la reconnaissance des supporters et des analystes, et son équipe prépare déjà l’assaut de l’étage suivant de la Tour des Légendes.`,
          ({ team, figure, featSummary }) => `Le coup de sifflet final a déclenché la fête de ${team}, qui s’est appuyé sur ${figure} pour boucler une soirée exigeante. Avec ${featSummary}, l’homme fort a livré une copie de grande classe et laissé l’équipe gonflée à bloc en route vers l’étage suivant de la Tour des Légendes.`,
        ],
        draw: [
          ({ team, opp, figure, featSummary }) => `Le nul a laissé un goût doux-amer dans les deux vestiaires, mais personne n’a discuté le nom de la soirée : avec ${featSummary}, ${figure} a porté les siens dans les minutes chaudes d’un duel que ${team} et ${opp} ont disputé jusqu’au dernier souffle.`,
          ({ team, opp, figure, featSummary }) => `Le partage a laissé un sentiment d’inachevé des deux côtés, mais le nom de la soirée n’a pas souffert la discussion : avec ${featSummary}, ${figure} a tenu les siens dans un duel que ${team} et ${opp} ont égalisé jusqu’à la dernière minute.`,
        ],
        loss: [
          ({ team, figure, featSummary, level }) => `Le coup de sifflet final a certifié la chute de ${team}, resté sans réponse face à un rival plus tranchant. Avec ${featSummary}, ${figure} s’est érigé en bourreau de la soirée et a stoppé l’ascension de ${team} à l’étage ${level} de la Tour des Légendes.`,
          ({ team, figure, featSummary, level }) => `Le coup de sifflet final a confirmé le faux pas de ${team}, devancé par un rival plus tranchant dans les deux surfaces. Avec ${featSummary}, ${figure} a été le grand nom de la soirée et a figé l’ascension de ${team} à l’étage ${level} de la Tour des Légendes.`,
        ],
      },
    },
    achievements: { Campeón: 'Champion', Subcampeón: 'Vice-champion', Semifinal: 'Demi-finale', 'Cuartos de final': 'Quarts de finale' },
    eras: { Actual: 'Actuel' },
    nations: COMMON_NATIONS.fr,
    items: COMMON_ITEMS.fr,
  },
  pt: {
    meta: { title: 'Torre das Lendas', description: 'Roguelike de futebol: monte sua seleção abrindo pacotes e suba uma torre infinita.', footer: 'Torre de Leyendas · Projeto não oficial / não afiliado · Copa das Lendas' },
    language: { label: 'Idioma' },
    menu: { kicker: 'Suba a torre. A cada andar, um rival mais forte.', teamName: 'Nome da equipe', namePlaceholder: 'Lendas', nameError: 'Use apenas letras e espaços.', flag: 'Bandeira', flagAria: 'Bandeira da equipe', flagError: 'Escolha uma bandeira para começar.', chooseFlag: 'Escolha bandeira', newRun: 'Nova run', continueRun: 'Continuar partida', continueFloor: ({ level }) => `Nível ${level}`, newRunConfirm: 'Você tem uma partida em andamento. Começar uma nova vai apagá-la. Continuar?', runBusyTitle: 'Partida aberta em outra aba', runBusyBody: 'Esta partida já está aberta em outra aba ou janela. Feche-a e toque em Tentar de novo para continuar aqui.', runBusyRetry: 'Tentar de novo', backToMenu: 'Voltar ao menu', wiki: 'Wiki', disclaimer: 'Projeto não oficial e não afiliado. Cartas com dados fictícios; sem marcas registradas.', liveNow: ({ n }) => `${n} jogando agora`, totalRuns: ({ n }) => `${n} partidas jogadas` },
    generic: { level: ({ level }) => `Nível ${level}`, floor: ({ floor }) => `Andar ${floor}`, vs: 'vs', close: 'Fechar', choose: 'Escolher', players: 'Jogadores', items: 'Objetos', player: 'jogador', item: 'objeto', loading: 'Carregando...', noData: 'Sem marcas ainda.', current: 'Atual', final: 'Final', local: 'Mandante', opponent: 'Rival' },
    pack: { playerTitle: 'Pacote de jogador', itemTitle: 'Pacote de objeto', playerHint: 'Leia posição, atributos, raridade, nação e era. Construa sinergias.', itemHint: 'Os objetos modificam sua equipe. Encaixe-os no seu plano.', playerOpen: 'Abrir pacote de jogadores', itemOpen: 'Abrir pacote de objetos', chooseOne: ({ count, hint }) => `Escolha 1 de ${count}. ${hint}`, tap: 'Toque para abrir', nationTitle: 'Pacote de seleções', nationHint: 'Pacote especial: escolha uma seleção histórica e leve o jogador que quiser.', nationOpen: 'Abrir pacote de seleções', nationBadge: 'Seleção', nationNew: ({ n }) => `${n} jogadores novos`, nationTopOvr: ({ ovr }) => `OVR máx. ${ovr}`, nationPickHint: 'Escolha qualquer jogador desta seleção para o seu elenco.', review: 'Revisar minha equipe', reviewTitle: ({ count }) => `Seu elenco (${count} cartas)`, corruptoTitle: 'Pacote do empresário', corruptoHint: 'Um jogador usará sua equipe como trampolim. Abra e ele entra no seu onze.', corruptoOpen: 'Abrir pacote', shinyTitle: 'Pacote do empresário', shinyHint: 'Sua recompensa: escolha uma joia com +10 em todas as estatísticas.', shinyOpen: 'Abrir pacote Shiny', shinySale: ({ name }) => `O jogador ${name} foi vendido com sucesso a um grande clube do Oriente Médio. Seu empresário quer recompensá-lo, abra este pacote.` },
    card: { owned: 'Já está no seu elenco', rarity: { common: 'Comum', rare: 'Rara', epic: 'Épica', legend: 'Lenda', corrupto: 'Corrupto', shiny: 'Shiny' }, position: { GK: 'GOL', DEF: 'DEF', MID: 'MEI', FWD: 'ATA', ENG: 'MEI' }, line: { GK: 'Gol', DEF: 'Defesa', MID: 'Meio-campo', FWD: 'Ataque', ENG: 'Meia' }, stat: { pace: 'RIT', shooting: 'FIN', passing: 'PAS', dribbling: 'DRI', defending: 'DEF', physical: 'FIS', reflexes: 'REF', handling: 'BLO', positioning: 'POS' }, trait: { Francotirador: 'Franco-atirador', Cañón: 'Canhão', Muro: 'Muralha', Motor: 'Motor', Maestro: 'Maestro', Líbero: 'Líbero', Paradón: 'Defesaça', Killer: 'Matador', Velocista: 'Velocista', Especialista: 'Especialista', Penalero: 'Cobrador de pênalti', Capitán: 'Capitão', Garra: 'Garra', Mariscal: 'Xerife', Roto: 'Frágil' }, synergy: ({ type }) => `Sinergia: ${type}`, itemType: { equipamiento: 'equipamento', tactica: 'tática', reliquia: 'relíquia' } },
    build: { title: 'Monte sua equipe', nextOpponent: 'Próximo rival', viewLineup: 'Ver onze', chemistry: 'Química', tacticalBoard: 'Quadro tático', formationAria: 'Formação', roster: 'Elenco', benchAll: 'Posição', benchFilterAria: 'Filtrar reservas por linha', rosterCount: ({ total, missing }) => `${total} cartas · ${missing} vaga${missing === 1 ? '' : 's'} livre${missing === 1 ? '' : 's'}`, noSubs: 'Sem reservas disponíveis.', noItems: 'Sem objetos ainda.', activeItems: ({ count }) => `Objetos ativos (${count})`, play: 'Jogar partida', missing: ({ count }) => `Complete o onze (${count} faltando)`, statsDialog: 'Estatísticas do jogador', playerDragAria: ({ name }) => `${name}, arraste para mover ou toque para tirar do onze`, playerSealedAria: ({ name }) => `${name}, fixo no onze: não pode ser movido nem removido`, emptyAria: ({ label }) => `Vaga ${label} livre, adicionar jogador`, viewStatsAria: ({ name }) => `Ver estatísticas de ${name}`, benchAria: ({ name }) => `${name}, arraste para o campo ou toque para escalar`, noCandidates: ({ label }) => `Você não tem reservas compatíveis para ${label}. Encontre-as nos pacotes.`, pickerHead: ({ label }) => `${label} — escolha quem entra`, targetPickerHead: ({ name }) => `${name} — escolha a posição`, suspended: 'Expulso: indisponível nesta partida', benchSuspendedAria: ({ name }) => `${name}, expulso na partida anterior: não pode ser escalado`, injured: 'Lesionado: em recuperação', benchInjuredAria: ({ name }) => `${name}, lesionado: em recuperação, não pode ser escalado`, openSlot: 'Vaga livre' },
    scouting: { report: 'Relatório do rival', manager: 'Treinador', formation: ({ formation }) => `Formação ${formation}`, strength: 'Força', opponentEleven: 'Onze principal do rival', note: 'Ratings de jogo para a Copa das Lendas. Onze histórico representativo do torneio.', continue: 'Montar minha equipe' },
    squadIntro: { kicker: 'Sua equipe está pronta', cards: ({ count }) => `${count} cartas`, eleven: 'Onze titular', bench: 'Reservas', note: 'Este é o seu elenco inicial. Toque em qualquer carta para ver os atributos; antes de cada partida você pode ajustar o onze.', continue: 'Abrir meu primeiro pacote' },
    ratings: { attack: 'ATA', midfield: 'MEI', defense: 'DEF', gk: 'GOL', physical: 'FÍS' },
    match: { plays: ({ count }) => `${count} jogadas`, tickerStart: ({ level }) => `Nível ${level} · Highlights ao vivo.`, playPauseAria: 'Reproduzir ou pausar', speedAria: 'Velocidade', nextAria: 'Próximo highlight', skipAria: 'Pular para o final', skipFinal: '⏩ Final', viewResult: 'Ver resultado', continue: 'Continuar', modesAria: 'Modo de visualização', modes: { full: 'Highlights', key: 'Só chave', commentary: 'Comentário', instant: 'Instantâneo' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Ataque perigoso...`, parada: ({ minute }) => `Min ${minute}' - Finalização no gol...`, shot: ({ minute }) => `Min ${minute}' - O chute vem aí...`, falta: ({ minute }) => `Min ${minute}' - Contato sob pressão...`, default: ({ minute }) => `Min ${minute}' - A jogada se constrói...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Final · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fim de jogo. ${homeGoals} a ${awayGoals}.` },
    result: { tier: { goleada: 'GOLEADA!', amplia: 'Vitória ampla', ajustada: 'Vitória apertada', empate: 'Empate', derrota: 'Derrota' }, lostStep: 'Degrau perdido', towerFall: 'Queda da torre', retry: 'Tentar o degrau de novo', nextLevel: 'Próximo nível', reward: 'Recompensa', lossCopy: ({ lives }) => `Você perdeu este degrau. Restam ${lives} vida${lives === 1 ? '' : 's'}.`, rewardCopy: ({ players, items }) => `Recompensa pronta: pacote de ${players} jogadores e ${items} objetos para escolher.`, scorers: 'Artilheiros', reds: 'Expulsos', injuries: 'Lesionados', warmup: 'aquec.', injuryMatchesTitle: ({ n }) => n > 0 ? `Fora por ${n} partida${n === 1 ? '' : 's'}` : 'Não perde nenhuma partida', saves: 'Defesas', lastMatch: 'Última partida', lastTactic: 'Sua tática', subs: 'Mudanças', gameOver: 'Fim da run', floorsReached: 'andares alcançados', newRecord: '★ Novo recorde', best: ({ best }) => `Melhor marca: ${best}`, winsRoster: ({ wins, count }) => `${wins} vitória${wins === 1 ? '' : 's'} · elenco de ${count} jogadores`, route: 'Percurso', finalSquad: 'Elenco final', playAgain: 'Jogar de novo', endRun: 'Encerrar partida', replay: 'Jogar de novo', pathLevel: ({ level }) => `Nv ${level}` },
    carryover: { title: 'Escolha um jogador para sua próxima run', hint: 'Ele entrará em um time novo e aleatório.', back: 'Voltar' },
    leaderboard: { floor: ({ floor }) => `Andar ${floor}`, updating: 'Atualizando ranking...', readOnly: 'Servidor sem escrita: mostrando o ranking salvo.', rank: ({ rank }) => `Sua run ficou em #${rank}.`, notTop: 'Você não entrou no top 20.', title: 'Ranking histórico', top: 'Top 20', titleWeekly: 'Ranking semanal', topWeekly: 'Top 20 semanal', empty: 'Sem marcas ainda.', lineup: 'Último onze' },
    adminLogin: { title: 'Acesso restrito', kicker: 'Painel de edição de jogadores.', user: 'Usuário', password: 'Senha', submit: 'Entrar', back: 'Voltar ao jogo', checking: 'Verificando...', genericError: 'Não foi possível iniciar sessão.', invalidCredentials: 'Usuário ou senha incorretos.', httpError: ({ status }) => `Não foi possível iniciar sessão (HTTP ${status}).`, missingToken: 'O servidor não devolveu um token de sessão.' },
    admin: { back: 'Voltar', badge: 'Admin', title: 'Painel de jogadores', logout: 'Sair', search: 'Buscar', searchPlaceholder: 'Nome, país, era...', position: 'Posição', all: 'Todas', count: ({ visible, total }) => `${visible} de ${total} jogadores · melhor para pior`, selected: 'Jogador selecionado', name: 'Nome', nation: 'Nação', era: 'Era', rarity: 'Raridade', ovr: 'OVR calculado', trait: 'Traço', noTrait: 'Sem traço', tacticalType: 'Tipo tático', noType: 'Sem tipo', saveStats: 'Salvar estatísticas', portraitAria: 'Editor de imagem de perfil', portrait: 'Imagem de perfil', toolEffect: 'Efeito tool', replaceImage: 'Substitui a imagem atual', pickImage: 'Arraste ou escolha uma imagem', imageHint: 'Primeiro plano recomendado', converted: 'Convertida', savePortrait: 'Salvar imagem no jogador', noPlayers: 'Não há jogadores para editar.', invalidImage: 'Escolha um arquivo de imagem válido.', converting: 'Convertendo com o tool Python...', convertedReady: 'Imagem convertida com o tool Python, pronta para salvar.', convertError: ({ message }) => `Não foi possível converter: ${message}`, savingImage: 'Salvando imagem no disco...', readFailed: 'falha na leitura', expired: 'Sessão expirada. Entre novamente no painel.', startServer: 'Inicie a app com npm run serve para usar o conversor Python exato.', invalidPortrait: 'O conversor Python não devolveu um retrato válido.', saveNeedsServer: 'Não foi possível salvar. Inicie a app com `npm run serve` para editar a base de jogadores.', saveHttpError: ({ status }) => `Não foi possível salvar a base de jogadores (HTTP ${status}).`, playerNotFound: ({ id }) => `Jogador não encontrado: ${id}`, stat: { pace: 'Ritmo', shooting: 'Finalização', passing: 'Passe', dribbling: 'Drible', defending: 'Defesa', physical: 'Físico', reflexes: 'Reflexos', handling: 'Bloqueio', positioning: 'Posicionamento' }, positionOption: { GK: 'Goleiro', DEF: 'Defensor', MID: 'Meio-campista', FWD: 'Atacante' }, tactical: { posesion: 'Posse', presion: 'Pressão', contra: 'Contra' } },
    narrator: {
      player: 'Jogador', phases: { corner: 'no escanteio', free_kick: 'na cobrança de falta', penalty: 'no pênalti', counter: 'em transição', default: 'na jogada' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} lê a jogada, a defesa fecha e ${team} perde a bola.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tenta enfiar a bola, mas a defesa de ${defender} adianta as linhas.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contra de ${attacker} após recuperar! ${shooter} parte para cima…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} tenta mudar o ritmo, mas o passe longo sai pela lateral.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} escapa e ${defender} derruba. O árbitro vai ao bolso: vermelho direto!`, faltaSegundaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${defender} derruba ${receiver} de novo. Segundo amarelo… e vermelho!`, faltaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} busca a infiltração e ${defender} chega atrasado. Falta e amarelo para ${defender}.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} busca a infiltração e ${defender} chega atrasado. Falta ${kind}.`, faltaPeligrosa: 'perigosa', faltaPresion: 'na pressão', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} enfia para ${receiver}, mas a linha defensiva deixa em impedimento.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — cruzamento na área de ${attacker}; ${defender} ganha pelo alto e afasta.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} tenta avançar, mas ${defender} recupera e manda a bola para longe.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} melhora a posição, mas ${defender} recompõe em bloco e não dá ângulo de chute.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} encontra uma janela de chute, mas ${defender} cruza e bloqueia.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} tenta ${phase}, mas o chute vai para fora.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} tenta ${phase} e ${keeper} responde com uma grande defesa!${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} toma distância na marca do pênalti… GOOOL de ${team}! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — falta cobrada por ${shooter}, passa pela barreira… GOOOL de ${team}! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — cruzamento de ${passer} e cabeçada de ${shooter}… GOOOL de ${team}! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} acha ${shooter} após a movimentação… GOOOL de ${team}! (${score})${xg}`, default: ({ m }) => `Min ${m}' — jogada.`,
    },
    scene: {
      badge: { penalty: 'PÊNALTI', free_kick: 'FALTA', corner: 'ESCANTEIO', gol: 'GOL', parada: 'DEFESA', tiro_fuera: 'CHUTE FORA', bloqueo: 'BLOQUEIO', roja: 'VERMELHO', amarilla: 'AMARELO', falta: 'FALTA', fuera_juego: 'IMPEDIMENTO', despeje: 'AFASTADA', perdida: 'ROUBO', pase_fuera: 'PASSE LONGO', default: 'JOGADA' }, role: { protagonist: 'Protagonista', scorer: 'Autor do gol', shooter: 'Finalizador', assistant: 'Assistente', keeper: 'Goleiro', defender: 'Defensor', receiver: 'Recebedor' }, title: { midfield_pass: 'Passe no meio-campo', defensive_pass: 'Saída desde trás', defensive_recovery: 'Recuperação defensiva', shot: 'Finalização', cross: 'Cruzamento na área', free_kick: 'Cobrança de falta', free_kick_goal: 'Gol de falta', penalty: 'Pênalti', penalty_goal: 'Gol de pênalti', shot_goal: 'Gol de finalização', shot_goal_alt: 'Gol de finalização', header_goal: 'Gol de cabeça', yellow_foul: 'Falta e amarelo', red_foul: 'Falta e vermelho', goal_kick: 'Tiro de meta' }, alt: { midfield_pass: 'Cena pixelart de um passe no meio-campo', defensive_pass: 'Cena pixelart de passe na defesa', defensive_recovery: 'Cena pixelart de uma recuperação defensiva', shot: 'Cena pixelart de um atacante finalizando', cross: 'Cena pixelart de um cruzamento na área', free_kick: 'Cena pixelart de uma cobrança de falta', free_kick_goal: 'Cena pixelart de uma falta perigosa', penalty: 'Cena pixelart de um pênalti', penalty_goal: 'Cena pixelart de um gol de pênalti', shot_goal: 'Cena pixelart de um gol de finalização', shot_goal_alt: 'Cena pixelart alternativa de um gol de finalização', header_goal: 'Cena pixelart de um gol de cabeça', yellow_foul: 'Cena pixelart de uma falta com cartão amarelo', red_foul: 'Cena pixelart de uma falta com cartão vermelho', goal_kick: 'Cena pixelart de um tiro de meta' }, highlight: 'Highlight', goalStamp: 'GOL!', headline: { gol: ({ attacker }) => `Gol de ${attacker}`, parada: ({ keeper }) => `Defesa de ${keeper}`, tiro_fuera: ({ shooter }) => `Chute para fora de ${shooter}`, bloqueo: ({ defender }) => `Bloqueio de ${defender}`, faltaRoja: 'Falta dura', falta: 'Falta tática', fuera_juego: 'Impedimento', despeje: 'A defesa afasta', pase_fuera: 'Passe longo demais', perdida: 'Recuperação defensiva', default: ({ attacker }) => `${attacker} não encontra finalização` },
    },
    injury: {
      severity: { simple: 'leve', moderada: '1 partida', grave: '3 partidas', muy_grave: '6 partidas' },
      types: {
        simple: ['cãibra', 'contusão', 'pancada no tornozelo', 'sobrecarga leve'],
        moderada: ['entorse de tornozelo', 'distensão muscular', 'torção no joelho', 'contratura'],
        grave: ['ruptura de fibras', 'entorse de grau 2', 'luxação no ombro', 'microrruptura muscular'],
        muy_grave: ['ruptura do ligamento cruzado', 'fratura da fíbula', 'ruptura do tendão de Aquiles', 'luxação grave no joelho'],
      },
    },
    press: {
      masthead: 'A Gazeta da Torre',
      edition: ({ level }) => `Edição especial · Andar ${level}`,
      caption: ({ name }) => `${name}, o jogador destaque da partida`,
      photoAlt: ({ name }) => `Retrato pixelart de ${name}`,
      headline: {
        winBig: [
          ({ team, figure }) => `Show de ${team} com um ${figure} de lenda`,
          ({ team, figure }) => `${team} atropela com ${figure} roubando a cena`,
        ],
        win: [
          ({ team, figure }) => `${figure} conduz ${team} a uma vitória de personalidade`,
          ({ team, figure }) => `${team} é dono da noite pelas mãos de ${figure}`,
        ],
        draw: [
          ({ team, opp }) => `${team} e ${opp} assinam um empate com gosto de batalha`,
          ({ team, opp }) => `${team} e ${opp} dividem os pontos após um cabo de guerra sem trégua`,
        ],
        loss: [
          ({ team, opp }) => `${opp} freia a escalada de ${team}`,
          ({ team, opp }) => `${team} tropeça e ${opp} corta suas asas em plena subida`,
        ],
      },
      lead: {
        win: [
          ({ team, opp, score, figure, feat }) => `A seleção de ${team} venceu a seleção de ${opp} por ${score} em uma partida intensa que entregou grandes emoções do começo ao fim. O protagonista absoluto da noite foi ${figure}, que assinou uma atuação memorável ao ${feat}, sendo decisivo em cada um dos momentos-chave do jogo.`,
          ({ team, opp, score, figure, feat }) => `${team} superou ${opp} por ${score} em um embate de ritmo alto, brigado de igual para igual do primeiro ao último minuto. Quem ditou o tom foi ${figure}, decisivo ao ${feat} e dono dos instantes que de fato pesaram no desfecho.`,
        ],
        draw: [
          ({ team, opp, score, figure, feat }) => `${team} e ${opp} ficaram no ${score} em um duelo intenso no qual nenhum dos dois baixou a guarda. Se alguém sustentou o embate foi ${figure}, que carregou a equipe ao ${feat} e manteve viva a esperança dos seus até o apito final.`,
          ({ team, opp, score, figure, feat }) => `Um ${score} sem vencedor resumiu o toma lá dá cá entre ${team} e ${opp}, que se enfrentaram de igual para igual sem se guardar. O mais constante foi ${figure}, que carregou os seus ao ${feat} quando o duelo pedia um líder.`,
        ],
        loss: [
          ({ team, opp, score, figure, feat }) => `A seleção de ${opp} venceu a seleção de ${team} por ${score} em um duelo áspero decidido nos detalhes. A grande figura da partida foi ${figure}, que fez a diferença ao ${feat} e deixou o adversário sem respostas.`,
          ({ team, opp, score, figure, feat }) => `${opp} levou a melhor sobre ${team} por ${score} em um jogo truncado e disputado, aberto pelos pequenos detalhes. O grande destaque foi ${figure}, que fez a diferença ao ${feat} e deixou ${team} preso ao plano adversário.`,
        ],
      },
      body: {
        opener: [
          ({ att, def, minute, scorer, how, score }) => `Desde o início, ${att} mostrou postura ofensiva e uma pressão alta que complicou a saída de bola de ${def}. A insistência foi premiada aos ${minute} minutos, quando ${scorer} ${how} para colocar o ${score} no placar. O gol trouxe confiança, e a equipe passou a controlar a posse e a gerar perigo constante pelos lados do campo.`,
          ({ att, def, minute, scorer, how, score }) => `${att} não demorou a ditar o roteiro: pressão alta e infiltrações pelos lados para prender ${def} no próprio campo. A recompensa veio aos ${minute} minutos, quando ${scorer} ${how} para abrir o placar (${score}). Com o primeiro golpe dado, os seus respiraram e passaram a ditar o ritmo a seu gosto.`,
        ],
        scoreless: [
          ({ team, opp, keeper }) => `O primeiro tempo foi um duelo tático em que ${team} e ${opp} se estudaram sem conceder espaços. As defesas levaram a melhor sobre os ataques e, quando foi preciso, ${keeper} apareceu para apagar os incêndios dentro da área. Foi-se ao intervalo sem gols e com a sensação de que um detalhe decidiria a partida.`,
          ({ team, opp, keeper }) => `O primeiro tempo foi jogado com o freio de mão puxado: ${team} e ${opp} preferiram não perder a arriscar, e a bola correu mais pelo meio do que pelas áreas. Sempre que alguém ousava, lá estava ${keeper} para acalmar o jogo. Foi-se ao intervalo no zero a zero, com cara de partida decidida no cara ou coroa.`,
        ],
        quiet: [
          ({ team, opp, keeper }) => `O placar não se moveu mais no segundo tempo: ${team} e ${opp} trocaram chegadas sem clareza nos metros finais, e cada tentativa morreu nas luvas de ${keeper} ou nos pés de uma defesa bem postada. O duelo se fechou sem mais sustos, decidido pelo que se plantou antes do intervalo.`,
          ({ team, opp, keeper }) => `O segundo tempo bateu a porta: ${team} e ${opp} tentaram aos arrancos, mas sem profundidade nem último passe, e o pouco que chegou parou em ${keeper} ou numa defesa concentrada. O duelo foi se apagando aos poucos, fiel ao roteiro do primeiro tempo.`,
        ],
        red: [
          ({ player, team, minute }) => `A partida se complicou com a expulsão de ${player} aos ${minute} minutos, que deixou ${team} em inferioridade e condicionou por completo a reta final.`,
          ({ player, team, minute }) => `O jogo virou com o cartão vermelho de ${player} aos ${minute} minutos: ${team} ficou com um a menos e teve de cerrar os dentes para proteger o resultado até o fim.`,
        ],
        injury: {
          simple: [
            ({ player, team, minute, type }) => `${player} pediu a substituição aos ${minute}' por uma ${type} e deixou seu lugar na hora, embora o susto não tenha passado disso.`,
            ({ player, team, minute, type }) => `Uma ${type} obrigou a tirar ${player} no minuto ${minute}: ${team} mexeu no banco, mas não passou de um percalço leve.`,
            ({ player, team, minute, type }) => `${team} perdeu ${player} no minuto ${minute} por uma ${type}; nada sério, mas o suficiente para deixar o campo de imediato.`,
            ({ player, team, minute, type }) => `${player} levantou a mão aos ${minute}' por causa de uma ${type} e pediu para sair sem forçar; um aviso menor que ${team} preferiu não arriscar.`,
          ],
          moderada: [
            ({ player, team, minute, type }) => `${player} caiu lesionado aos ${minute}' com uma ${type} e teve de ser substituído: ${team} perde uma peça importante para o próximo compromisso.`,
            ({ player, team, minute, type }) => `A ${type} de ${player} no minuto ${minute} acendeu o alerta no ${team}, que o retirou com dores evidentes para as próximas semanas.`,
            ({ player, team, minute, type }) => `Má notícia para ${team}: ${player} saiu aos ${minute}' com uma ${type} que o deixará fora do próximo jogo.`,
            ({ player, team, minute, type }) => `${player} deixou o campo aos ${minute}' sentindo uma ${type}, e no ${team} já se fazem as contas para o próximo compromisso.`,
          ],
          grave: [
            ({ player, team, minute, type }) => `Imagem preocupante aos ${minute}': ${player} desabou com uma ${type} e deixou o campo visivelmente dolorido, um duro golpe nos planos do ${team}.`,
            ({ player, team, minute, type }) => `A ${type} de ${player} no minuto ${minute} forçou uma saída de urgência; ${team} encara as próximas rodadas sem uma de suas referências.`,
            ({ player, team, minute, type }) => `${team} sofreu um sério revés quando ${player} teve de deixar o gramado aos ${minute}' com uma ${type} que aponta para várias semanas de baixa.`,
            ({ player, team, minute, type }) => `Careta de dor no minuto ${minute}: ${player} não teve como seguir por uma ${type} e saiu cabisbaixo, um contratempo sério para ${team} nas próximas semanas.`,
          ],
          muy_grave: [
            ({ player, team, minute, type }) => `Drama no minuto ${minute}: ${player} foi retirado sob aplausos após uma ${type} de extrema gravidade que o afastará por longa temporada e ofusca a noite do ${team}.`,
            ({ player, team, minute, type }) => `A partida ficou marcada pela ${type} de ${player} aos ${minute}': uma lesão gravíssima que deixa ${team} sem seu jogador por meses.`,
            ({ player, team, minute, type }) => `${team} recebeu a pior das notícias aos ${minute}': ${player} sofreu uma ${type} de máxima gravidade e seu retorno parece muito distante.`,
            ({ player, team, minute, type }) => `Imagem amarga aos ${minute}': ${player} saiu em meio à preocupação geral por uma ${type} de extrema gravidade, uma baixa de longa duração que atinge ${team} em cheio.`,
          ],
        },
        injurySub: [
          ({ inName }) => `Em seu lugar entrou ${inName}.`,
          ({ inName }) => `${inName} assumiu sua posição vindo do banco.`,
          ({ inName }) => `O banco respondeu na hora com ${inName}.`,
          ({ inName }) => `${inName} entrou para assumir o posto na hora.`,
        ],
        injuryWarmup: [
          ({ player, team, type }) => `${player} se machucou no aquecimento por ${type} e nem chegou a entrar em campo: ${team} perde uma peça antes mesmo do apito inicial.`,
          ({ player, team, type }) => `Contratempo para ${team} antes de começar: ${player} sentiu ${type} no aquecimento e ficou de fora da partida sem jogar.`,
          ({ player, team, type }) => `${team} perdeu ${player} na preliminar: ${type} durante o aquecimento o tirou do jogo antes do início.`,
          ({ player, team, type }) => `Azar de ${player}, lesionado por ${type} ao aquecer; ${team} ficou com um reserva a menos antes do apito.`,
        ],
        subSwap: [
          ({ inName, outName, cause, minute }) => `Para tapar o buraco deixado por ${cause}, ${inName} entrou do banco aos ${minute}' e ${outName} cedeu seu lugar para refazer a defesa.`,
          ({ inName, outName, cause, minute }) => `Sem ${cause}, o treinador refez o quadro aos ${minute}': entrou ${inName} e ${outName} cedeu o lugar para escorar uma defesa de emergência.`,
        ],
        subIn: [
          ({ inName, cause, minute }) => `Após a expulsão de ${cause}, ${inName} entrou do banco aos ${minute}' para reforçar a defesa.`,
          ({ inName, cause, minute }) => `Com ${cause} já fora, ${inName} entrou em campo aos ${minute}' para fechar o buraco atrás.`,
        ],
        forfeit: [
          ({ team }) => `Com quatro expulsos, ${team} ficou sem equipe em campo e o árbitro deu a partida como perdida.`,
          ({ team }) => `Sem jogadores suficientes após a quarta expulsão, ${team} não pôde continuar e o árbitro decretou o fim antecipado da partida.`,
        ],
        penaltyMiss: [
          ({ shooter, keeper, minute }) => `Houve drama na marca da cal aos ${minute} minutos: ${shooter} teve o gol nos pés, mas ${keeper} e a sorte lhe negaram a comemoração.`,
          ({ shooter, keeper, minute }) => `O pênalti dos ${minute} minutos prometia festa e terminou em frustração: ${shooter} foi para a cobrança, mas ${keeper} adivinhou a intenção e assinou a defesa da noite.`,
        ],
        nearMissSave: [
          ({ shooter, keeper, minute }) => `Nem tudo deu certo nos metros finais: a chance mais clara desperdiçada foi de ${shooter} aos ${minute} minutos, mas ${keeper} venceu o mano a mano com uma intervenção de muito mérito.`,
          ({ shooter, keeper, minute }) => `O susto mais sério levou a assinatura de ${shooter} aos ${minute} minutos, mas ${keeper} voou como um felino para manter o gol sem ser vazado.`,
        ],
        nearMissWide: [
          ({ shooter, minute }) => `Nem tudo deu certo nos metros finais: a chance mais clara desperdiçada foi de ${shooter} aos ${minute} minutos, com uma finalização que passou raspando a trave sob lamentos da torcida.`,
          ({ shooter, minute }) => `A melhor oportunidade sem prêmio foi de ${shooter} aos ${minute} minutos, com um petardo que carimbou o travessão e cortou a festa pela metade nas arquibancadas.`,
        ],
        bestSave: [
          ({ keeper, shooter, minute }) => `A defesa da noite chegou aos ${minute} minutos, quando ${keeper} negou um gol feito a ${shooter} e manteve os seus vivos no momento de máxima pressão.`,
          ({ keeper, shooter, minute }) => `A grande defesa da noite veio aos ${minute} minutos: ${keeper} tirou de forma milagrosa um chute à queima-roupa de ${shooter} e manteve intactas as esperanças dos seus.`,
        ],
      },
      goal: {
        extend: [
          ({ scorer, minute, how, score }) => `A vantagem cresceu aos ${minute} minutos, quando ${scorer} ${how} e deixou o ${score} no placar.`,
          ({ scorer, minute, how, score }) => `O golpe decisivo no moral adversário veio aos ${minute}': ${scorer} ${how} e ampliou para ${score}.`,
        ],
        lead: [
          ({ team, scorer, minute, how, score }) => `Aos ${minute} minutos, ${scorer} ${how} e colocou ${team} à frente no marcador (${score}).`,
          ({ team, scorer, minute, how, score }) => `${scorer} abriu o ferrolho aos ${minute} minutos: ${how} e colocou ${team} na frente (${score}).`,
        ],
        equalizer: [
          ({ team, scorer, minute, how }) => `${team} reagiu e encontrou o empate aos ${minute} minutos: ${scorer} ${how} e devolveu a igualdade ao jogo.`,
          ({ team, scorer, minute, how }) => `${team} veio à tona aos ${minute} minutos: ${scorer} ${how} e devolveu a igualdade ao placar.`,
        ],
        comeback: [
          ({ team, scorer, minute, how }) => `${team} descontou aos ${minute} minutos graças a ${scorer}, que ${how} e devolveu a incerteza à partida.`,
          ({ team, scorer, minute, how }) => `${team} se agarrou ao jogo aos ${minute} minutos com ${scorer}, que ${how} e recolocou os seus na briga.`,
        ],
        sealer: [
          ({ scorer, minute, how, score }) => `E quando o jogo parecia aberto, a hierarquia falou de novo: aos ${minute} minutos, ${scorer} ${how} e sentenciou o ${score} definitivo.`,
          ({ scorer, minute, how, score }) => `E quando o adversário sonhava com a virada, veio a estocada: ${scorer} ${how} aos ${minute} minutos e fixou o ${score} definitivo.`,
        ],
      },
      how: {
        penalty: [
          'não perdoou da marca da cal',
          'mandou o goleiro para o lado errado e converteu o pênalti sem tremer',
        ],
        freeKick: [
          'desenhou uma falta indefensável para o goleiro',
          'cobrou uma falta imparável que entrou rente à trave',
        ],
        header: [
          'subiu mais alto e testou firme, sem chances de defesa',
          'mandou para o fundo do gol uma cabeçada imparável',
        ],
        headerAssist: [
          ({ assister }) => `cabeceou um cruzamento na medida de ${assister}`,
          ({ assister }) => `subiu livre de marcação para cabecear um cruzamento na medida de ${assister}`,
        ],
        counter: [
          'concluiu um contra-ataque fulminante com frieza de matador',
          'conduziu o contra-ataque em alta velocidade e o fechou com uma finalização cirúrgica',
        ],
        shotAssist: [
          ({ assister }) => `recebeu um passe enfiado de ${assister} e bateu o goleiro com um chute cruzado`,
          ({ assister }) => `recolheu uma bola no espaço de ${assister} e bateu o goleiro com um chute colocado`,
        ],
        shot: [
          'apareceu na área após uma jogada coletiva e finalizou com precisão',
          'aproveitou um rebote dentro da área e fuzilou o goleiro',
        ],
      },
      feat: {
        goals: [
          ({ goals }) => `marcar ${goals}`,
          ({ goals }) => `balançar as redes com ${goals}`,
        ],
        goalsAssists: [
          ({ goals, assists }) => `marcar ${goals} e dar ${assists}`,
          ({ goals, assists }) => `balançar as redes com ${goals} e servir ${assists}`,
        ],
        assists: [
          ({ assists }) => `distribuir ${assists}`,
          ({ assists }) => `servir ${assists}`,
        ],
        saves: [
          ({ saves }) => `segurar os seus com ${saves}`,
          ({ saves }) => `manter os seus de pé com ${saves}`,
        ],
        wall: [
          'impor sua lei em cada duelo sem perder uma bola dividida',
          'erguer-se como uma muralha intransponível e mandar em cada duelo na sua área',
        ],
        manager: {
          comeback: [
            ({ manager, team }) => `Capítulo à parte para ${manager}, cuja mão a partir do banco endireitou o rumo de ${team} e assinou uma virada de mérito.`,
            ({ manager }) => `A leitura de ${manager} à beira do campo virou a partida: ajustes finos e uma equipe que nunca deixou de acreditar.`,
            ({ manager, team }) => `E no capítulo tático, ${manager} acertou nos retoques certos para endireitar ${team} a partir da prancheta.`,
          ],
          loss: [
            ({ manager, team }) => `Apesar do esforço, ${manager} ficou sem cartas no banco e ${team} não conseguiu virar a noite.`,
            ({ manager, team, level }) => `${manager} buscou respostas à beira do campo, mas a derrota deixou ${team} sem margem no andar ${level}.`,
            ({ manager, team }) => `Nem as mudanças de ${manager} acharam a tecla, e ${team} saiu de mãos vazias mesmo remando até o fim.`,
          ],
          lossRival: [
            ({ manager, opp, team }) => `O duelo de bancos pendeu para ${opp}, que leu o jogo melhor que ${manager} e deixou ${team} sem respostas.`,
            ({ manager, opp, team }) => `${opp} venceu também a partida à beira do campo: seus ajustes superaram os de ${manager} e condenaram ${team}.`,
          ],
          debut: [
            ({ manager, player }) => `${manager} se arriscou com uma novidade e lançou ${player}, que viveu sua estreia no time titular.`,
            ({ manager, player }) => `Aposta do banco: ${manager} fez ${player} estrear em uma decisão que deu o que falar.`,
            ({ manager, player }) => `${manager} foi buscar no banco para dar a estreia a ${player}, uma aposta que não passou despercebida.`,
          ],
          drawRival: [
            ({ manager, opp }) => `O empate premiou por igual dois bancos sábios: ${manager} e ${opp} se neutralizaram à beira do campo num xadrez sem vencedor.`,
            ({ manager, opp }) => `Empate também no duelo dos treinadores: ${manager} e ${opp} moveram suas peças sem que nenhum impusesse seu plano.`,
          ],
          winRival: [
            ({ manager, opp, team }) => `O duelo de bancos sorriu para ${manager}, que se adiantou a ${opp} com um plano que ${team} executou à risca.`,
            ({ manager, opp }) => `${manager} venceu também a batalha tática contra ${opp}: suas decisões à beira do campo desenharam a noite.`,
          ],
          subs: [
            ({ manager }) => `As mudanças de ${manager} refrescaram a equipe e moveram os fios da partida a partir do banco.`,
            ({ manager }) => `${manager} agitou o jogo a partir do banco com um par de retoques que mudaram a dinâmica.`,
            ({ manager, team }) => `À beira do campo, ${manager} foi dosando esforços com mudanças medidas que mantiveram ${team} vivo.`,
          ],
        },
      },
      units: {
        goals: ({ n }) => (n === 1 ? 'um gol' : `${NUM_WORDS.pt[n] || n} gols`),
        assists: ({ n }) => (n === 1 ? 'uma assistência' : `${NUM_WORDS.ptF[n] || n} assistências`),
        saves: ({ n }) => (n === 1 ? 'uma defesa de mérito' : `${NUM_WORDS.ptF[n] || n} defesas de mérito`),
        and: ' e ',
        wall: 'uma autoridade incontestável atrás',
      },
      closing: {
        win: [
          ({ team, figure, featSummary }) => `O apito final confirmou uma vitória sólida de ${team}, que encontrou em ${figure} seu líder futebolístico e emocional. Com ${featSummary}, o homem da partida ganhou o reconhecimento de torcedores e analistas, e sua equipe já prepara o assalto ao próximo andar da Torre das Lendas.`,
          ({ team, figure, featSummary }) => `O apito final soltou a festa de ${team}, que se apoiou em ${figure} para fechar uma noite exigente. Com ${featSummary}, o destaque entregou uma atuação de gala e deixou a equipe com a moral nas alturas rumo ao próximo andar da Torre das Lendas.`,
        ],
        draw: [
          ({ team, opp, figure, featSummary }) => `O empate deixou um gosto agridoce nos dois vestiários, mas ninguém discutiu o nome da noite: com ${featSummary}, ${figure} sustentou os seus nos minutos quentes de um duelo que ${team} e ${opp} brigaram até o último suspiro.`,
          ({ team, opp, figure, featSummary }) => `A divisão de pontos deixou sensação de tarefa incompleta nos dois lados, mas a figura não teve discussão: com ${featSummary}, ${figure} segurou os seus num duelo que ${team} e ${opp} igualaram até o último minuto.`,
        ],
        loss: [
          ({ team, figure, featSummary, level }) => `O apito final certificou a queda de ${team}, que não encontrou respostas diante de um rival mais certeiro. Com ${featSummary}, ${figure} se firmou como o carrasco da noite e deixou a escalada de ${team} parada no andar ${level} da Torre das Lendas.`,
          ({ team, figure, featSummary, level }) => `O apito final confirmou o tropeço de ${team}, superado por um rival mais certeiro nas duas áreas. Com ${featSummary}, ${figure} foi o grande nome da noite e deixou a escalada de ${team} congelada no andar ${level} da Torre das Lendas.`,
        ],
      },
    },
    achievements: { Campeón: 'Campeão', Subcampeón: 'Vice-campeão', Semifinal: 'Semifinal', 'Cuartos de final': 'Quartas de final' },
    eras: { Actual: 'Atual' },
    nations: COMMON_NATIONS.pt,
    items: COMMON_ITEMS.pt,
  },
  it: {
    meta: { title: 'Torre delle Leggende', description: 'Roguelike calcistico: costruisci la tua selezione aprendo pacchetti e scala una torre infinita.', footer: 'Torre de Leyendas · Progetto non ufficiale / non affiliato · Coppa delle Leggende' },
    language: { label: 'Lingua' },
    menu: { kicker: 'Scala la torre. Ogni piano porta un avversario più forte.', teamName: 'Nome squadra', namePlaceholder: 'Leggende', nameError: 'Usa solo lettere e spazi.', flag: 'Bandiera', flagAria: 'Bandiera della squadra', flagError: 'Scegli una bandiera per iniziare.', chooseFlag: 'Scegli bandiera', newRun: 'Nuova run', continueRun: 'Continua partita', continueFloor: ({ level }) => `Livello ${level}`, newRunConfirm: 'Hai una partita in corso. Iniziarne una nuova la cancellerà. Continuare?', runBusyTitle: 'Partita aperta in un’altra scheda', runBusyBody: 'Questa partita è già aperta in un’altra scheda o finestra. Chiudila e premi Riprova per continuare qui.', runBusyRetry: 'Riprova', backToMenu: 'Torna al menu', wiki: 'Wiki', disclaimer: 'Progetto non ufficiale e non affiliato. Carte con dati fittizi; nessun marchio registrato.', liveNow: ({ n }) => `${n} stanno giocando`, totalRuns: ({ n }) => `${n} partite giocate` },
    generic: { level: ({ level }) => `Livello ${level}`, floor: ({ floor }) => `Piano ${floor}`, vs: 'vs', close: 'Chiudi', choose: 'Scegli', players: 'Giocatori', items: 'Oggetti', player: 'giocatore', item: 'oggetto', loading: 'Caricamento...', noData: 'Nessun punteggio ancora.', current: 'Attuale', final: 'Fine', local: 'Casa', opponent: 'Rivale' },
    pack: { playerTitle: 'Pacchetto giocatore', itemTitle: 'Pacchetto oggetto', playerHint: 'Leggi ruolo, attributi, rarità, nazione ed epoca. Costruisci sinergie.', itemHint: 'Gli oggetti modificano la squadra. Inseriscili nel tuo piano.', playerOpen: 'Apri pacchetto giocatori', itemOpen: 'Apri pacchetto oggetti', chooseOne: ({ count, hint }) => `Scegli 1 di ${count}. ${hint}`, tap: 'Tocca per aprire', nationTitle: 'Pacchetto nazionali', nationHint: 'Pacchetto speciale: scegli una nazionale storica e prendi il giocatore che vuoi.', nationOpen: 'Apri pacchetto nazionali', nationBadge: 'Nazionale', nationNew: ({ n }) => `${n} nuovi giocatori`, nationTopOvr: ({ ovr }) => `OVR max ${ovr}`, nationPickHint: 'Scegli qualsiasi giocatore di questa nazionale per la tua rosa.', review: 'Rivedi la mia squadra', reviewTitle: ({ count }) => `La tua rosa (${count} carte)`, corruptoTitle: 'Il pacchetto del procuratore', corruptoHint: 'Un giocatore userà la tua squadra come trampolino. Aprilo ed entra nel tuo undici.', corruptoOpen: 'Apri pacchetto', shinyTitle: 'Il pacchetto del procuratore', shinyHint: 'La tua ricompensa: scegli un gioiello con +10 a tutte le statistiche.', shinyOpen: 'Apri pacchetto Shiny', shinySale: ({ name }) => `${name} è stato venduto con successo a un grande club del Medio Oriente. Il suo procuratore vuole ricompensarti, apri questo pacchetto.` },
    card: { owned: 'Già nella tua rosa', rarity: { common: 'Comune', rare: 'Rara', epic: 'Epica', legend: 'Leggenda', corrupto: 'Corrotto', shiny: 'Shiny' }, position: { GK: 'POR', DEF: 'DIF', MID: 'CEN', FWD: 'ATT', ENG: 'TRQ' }, line: { GK: 'Porta', DEF: 'Difesa', MID: 'Centrocampo', FWD: 'Attacco', ENG: 'Trequarti' }, stat: { pace: 'VEL', shooting: 'TIR', passing: 'PAS', dribbling: 'DRI', defending: 'DIF', physical: 'FIS', reflexes: 'RIF', handling: 'PRE', positioning: 'POS' }, trait: { Francotirador: 'Cecchino', Cañón: 'Cannone', Muro: 'Muro', Motor: 'Motore', Maestro: 'Maestro', Líbero: 'Libero', Paradón: 'Paratona', Killer: 'Killer', Velocista: 'Velocista', Especialista: 'Specialista', Penalero: 'Rigorista', Capitán: 'Capitano', Garra: 'Grinta', Mariscal: 'Maresciallo', Roto: 'Fragile' }, synergy: ({ type }) => `Sinergia: ${type}`, itemType: { equipamiento: 'equipaggiamento', tactica: 'tattica', reliquia: 'reliquia' } },
    build: { title: 'Costruisci la squadra', nextOpponent: 'Prossimo rivale', viewLineup: 'Vedi undici', chemistry: 'Intesa', tacticalBoard: 'Lavagna tattica', formationAria: 'Formazione', roster: 'Rosa', benchAll: 'Posizione', benchFilterAria: 'Filtra le riserve per reparto', rosterCount: ({ total, missing }) => `${total} carte · ${missing} slot liber${missing === 1 ? 'o' : 'i'}`, noSubs: 'Nessuna riserva disponibile.', noItems: 'Nessun oggetto per ora.', activeItems: ({ count }) => `Oggetti attivi (${count})`, play: 'Gioca partita', missing: ({ count }) => `Completa l’undici (${count} mancanti)`, statsDialog: 'Statistiche giocatore', playerDragAria: ({ name }) => `${name}, trascina per spostare o tocca per togliere dall’undici`, playerSealedAria: ({ name }) => `${name}, bloccato nell’undici: non può essere spostato né rimosso`, emptyAria: ({ label }) => `Slot ${label} libero, aggiungi giocatore`, viewStatsAria: ({ name }) => `Vedi statistiche di ${name}`, benchAria: ({ name }) => `${name}, trascina in campo o tocca per schierare`, noCandidates: ({ label }) => `Non hai riserve compatibili per ${label}. Trovale nei pacchetti.`, pickerHead: ({ label }) => `${label} — scegli chi entra`, targetPickerHead: ({ name }) => `${name} — scegli la posizione`, suspended: 'Espulso: non disponibile in questa partita', benchSuspendedAria: ({ name }) => `${name}, espulso nella partita precedente: non può essere schierato`, injured: 'Infortunato: in recupero', benchInjuredAria: ({ name }) => `${name}, infortunato: in recupero, non può essere schierato`, openSlot: 'Slot libero' },
    scouting: { report: 'Report rivale', manager: 'Allenatore', formation: ({ formation }) => `Formazione ${formation}`, strength: 'Forza', opponentEleven: 'Undici principale del rivale', note: 'Rating di gioco per la Coppa delle Leggende. Undici storico rappresentativo del torneo.', continue: 'Costruisci la mia squadra' },
    squadIntro: { kicker: 'La tua squadra è pronta', cards: ({ count }) => `${count} carte`, eleven: 'Undici titolare', bench: 'Riserve', note: 'Questa è la tua rosa iniziale. Tocca una carta per vedere gli attributi; prima di ogni partita potrai ritoccare l’undici.', continue: 'Apri il mio primo pacchetto' },
    ratings: { attack: 'ATT', midfield: 'CEN', defense: 'DIF', gk: 'POR', physical: 'FIS' },
    match: { plays: ({ count }) => `${count} azioni`, tickerStart: ({ level }) => `Livello ${level} · Highlights in diretta.`, playPauseAria: 'Riproduci o pausa', speedAria: 'Velocità', nextAria: 'Highlight successivo', skipAria: 'Vai alla fine', skipFinal: '⏩ Fine', viewResult: 'Vedi risultato', continue: 'Continua', modesAria: 'Modalità di visualizzazione', modes: { full: 'Highlights', key: 'Solo chiave', commentary: 'Commento', instant: 'Istantaneo' }, anticipation: { gol: ({ minute }) => `Min ${minute}' - Attacco pericoloso...`, parada: ({ minute }) => `Min ${minute}' - Tiro in porta...`, shot: ({ minute }) => `Min ${minute}' - Sta arrivando il tiro...`, falta: ({ minute }) => `Min ${minute}' - Contatto in pressione...`, default: ({ minute }) => `Min ${minute}' - L’azione si costruisce...` }, finalLine: ({ home, homeGoals, awayGoals, away }) => `Fine · ${home} ${homeGoals}–${awayGoals} ${away}`, finalAnnounce: ({ homeGoals, awayGoals }) => `Fine partita. ${homeGoals} a ${awayGoals}.` },
    result: { tier: { goleada: 'GOLEADA!', amplia: 'Vittoria larga', ajustada: 'Vittoria stretta', empate: 'Pareggio', derrota: 'Sconfitta' }, lostStep: 'Gradino perso', towerFall: 'Caduta dalla torre', retry: 'Riprova gradino', nextLevel: 'Livello successivo', reward: 'Ricompensa', lossCopy: ({ lives }) => `Hai perso questo gradino. Ti restano ${lives} vit${lives === 1 ? 'a' : 'e'}.`, rewardCopy: ({ players, items }) => `Ricompensa pronta: pacchetto da ${players} giocatori e ${items} oggetti da scegliere.`, scorers: 'Marcatori', reds: 'Espulsi', injuries: 'Infortunati', warmup: 'riscald.', injuryMatchesTitle: ({ n }) => n > 0 ? `Fuori per ${n} partit${n === 1 ? 'a' : 'e'}` : 'Nessuna partita saltata', saves: 'Parate', lastMatch: 'Ultima partita', lastTactic: 'La tua tattica', subs: 'Cambi', gameOver: 'Fine run', floorsReached: 'piani raggiunti', newRecord: '★ Nuovo record', best: ({ best }) => `Miglior risultato: ${best}`, winsRoster: ({ wins, count }) => `${wins} vittori${wins === 1 ? 'a' : 'e'} · rosa di ${count} giocatori`, route: 'Percorso', finalSquad: 'Rosa finale', playAgain: 'Gioca di nuovo', endRun: 'Termina la partita', replay: 'Gioca di nuovo', pathLevel: ({ level }) => `Lv ${level}` },
    carryover: { title: 'Scegli un giocatore per la prossima run', hint: 'Entrerà in una squadra nuova e casuale.', back: 'Indietro' },
    leaderboard: { floor: ({ floor }) => `Piano ${floor}`, updating: 'Aggiornamento classifica...', readOnly: 'Server senza scrittura: mostro la classifica salvata.', rank: ({ rank }) => `La tua run è arrivata #${rank}.`, notTop: 'Non sei entrato nella top 20.', title: 'Classifica storica', top: 'Top 20', titleWeekly: 'Classifica settimanale', topWeekly: 'Top 20 settimanale', empty: 'Nessun punteggio ancora.', lineup: 'Ultimo undici' },
    adminLogin: { title: 'Accesso riservato', kicker: 'Pannello di modifica giocatori.', user: 'Utente', password: 'Password', submit: 'Entra', back: 'Torna al gioco', checking: 'Controllo...', genericError: 'Accesso non riuscito.', invalidCredentials: 'Utente o password errati.', httpError: ({ status }) => `Accesso non riuscito (HTTP ${status}).`, missingToken: 'Il server non ha restituito un token di sessione.' },
    admin: { back: 'Indietro', badge: 'Admin', title: 'Pannello giocatori', logout: 'Esci', search: 'Cerca', searchPlaceholder: 'Nome, paese, epoca...', position: 'Ruolo', all: 'Tutte', count: ({ visible, total }) => `${visible} di ${total} giocatori · dal migliore al peggiore`, selected: 'Giocatore selezionato', name: 'Nome', nation: 'Nazione', era: 'Epoca', rarity: 'Rarità', ovr: 'OVR calcolato', trait: 'Tratto', noTrait: 'Nessun tratto', tacticalType: 'Tipo tattico', noType: 'Nessun tipo', saveStats: 'Salva statistiche', portraitAria: 'Editor immagine profilo', portrait: 'Immagine profilo', toolEffect: 'Effetto tool', replaceImage: 'Sostituisce l’immagine attuale', pickImage: 'Trascina o scegli un’immagine', imageHint: 'Primo piano consigliato', converted: 'Convertita', savePortrait: 'Salva immagine sul giocatore', noPlayers: 'Nessun giocatore da modificare.', invalidImage: 'Scegli un file immagine valido.', converting: 'Conversione con il tool Python...', convertedReady: 'Immagine convertita con il tool Python, pronta da salvare.', convertError: ({ message }) => `Conversione non riuscita: ${message}`, savingImage: 'Salvataggio immagine su disco...', readFailed: 'lettura non riuscita', expired: 'Sessione scaduta. Accedi di nuovo al pannello.', startServer: 'Avvia l’app con npm run serve per usare il convertitore Python esatto.', invalidPortrait: 'Il convertitore Python non ha restituito un ritratto valido.', saveNeedsServer: 'Salvataggio non riuscito. Avvia l’app con `npm run serve` per modificare il database giocatori.', saveHttpError: ({ status }) => `Salvataggio database giocatori non riuscito (HTTP ${status}).`, playerNotFound: ({ id }) => `Giocatore non trovato: ${id}`, stat: { pace: 'Velocità', shooting: 'Tiro', passing: 'Passaggio', dribbling: 'Dribbling', defending: 'Difesa', physical: 'Fisico', reflexes: 'Riflessi', handling: 'Presa', positioning: 'Posizionamento' }, positionOption: { GK: 'Portiere', DEF: 'Difensore', MID: 'Centrocampista', FWD: 'Attaccante' }, tactical: { posesion: 'Possesso', presion: 'Pressing', contra: 'Contropiede' } },
    narrator: {
      player: 'Giocatore', phases: { corner: 'da calcio d’angolo', free_kick: 'su punizione', penalty: 'dal dischetto', counter: 'in transizione', default: 'nell’azione' }, xg: ({ xg }) => ` xG ${xg}.`,
      perdida: ({ m, defender, team }) => `Min ${m}' — ${defender} legge l’azione, la difesa si chiude e ${team} perde palla.`, construccion_fallida: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} prova a filtrare, ma la difesa di ${defender} accorcia.`, contraataque: ({ m, attacker, shooter }) => `Min ${m}' — Contropiede di ${attacker} dopo il recupero! ${shooter} punta la porta…`, pase_fuera: ({ m, passer }) => `Min ${m}' — ${passer} prova a cambiare ritmo, ma il passaggio lungo esce.`, faltaRoja: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} scappa e ${defender} lo stende. L’arbitro va al taschino: rosso diretto!`, faltaSegundaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${defender} stende di nuovo ${receiver}. Secondo giallo… ed espulso!`, faltaAmarilla: ({ m, receiver, defender }) => `Min ${m}' — ${receiver} cerca lo smarcamento e ${defender} arriva tardi. Fallo e giallo per ${defender}.`, falta: ({ m, receiver, defender, kind }) => `Min ${m}' — ${receiver} cerca lo smarcamento e ${defender} arriva tardi. Fallo ${kind}.`, faltaPeligrosa: 'pericoloso', faltaPresion: 'in pressione', fuera_juego: ({ m, passer, receiver }) => `Min ${m}' — ${passer} filtra per ${receiver}, ma la linea difensiva lo mette in fuorigioco.`, despejeCross: ({ m, attacker, defender }) => `Min ${m}' — cross in area di ${attacker}; ${defender} vince di testa e libera.`, despeje: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} prova ad avanzare, ma ${defender} recupera e allontana il pallone.`, sin_remate: ({ m, attacker, defender }) => `Min ${m}' — ${attacker} guadagna campo, ma ${defender} ripiega in blocco e chiude l’angolo di tiro.`, bloqueo: ({ m, shooter, defender, xg }) => `Min ${m}' — ${shooter} trova una finestra di tiro, ma ${defender} si oppone e mura.${xg}`, tiro_fuera: ({ m, shooter, phase, xg }) => `Min ${m}' — ${shooter} prova ${phase}, ma il tiro finisce fuori.${xg}`, parada: ({ m, shooter, phase, keeper, xg }) => `Min ${m}' — ${shooter} prova ${phase} e ${keeper} risponde con una grande parata!${xg}`, golPenal: ({ m, shooter, team, score, xg }) => `Min ${m}' — ${shooter} prende la rincorsa dal dischetto… GOOOL di ${team}! (${score})${xg}`, golTiroLibre: ({ m, shooter, team, score, xg }) => `Min ${m}' — punizione di ${shooter}, supera la barriera… GOOOL di ${team}! (${score})${xg}`, golCabeza: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — cross di ${passer} e colpo di testa di ${shooter}… GOOOL di ${team}! (${score})${xg}`, gol: ({ m, passer, shooter, team, score, xg }) => `Min ${m}' — ${passer} libera ${shooter} dopo il movimento… GOOOL di ${team}! (${score})${xg}`, default: ({ m }) => `Min ${m}' — azione.`,
    },
    scene: {
      badge: { penalty: 'RIGORE', free_kick: 'PUNIZIONE', corner: 'CORNER', gol: 'GOL', parada: 'PARATA', tiro_fuera: 'TIRO FUORI', bloqueo: 'MURO', roja: 'ROSSO', amarilla: 'GIALLO', falta: 'FALLO', fuera_juego: 'FUORIGIOCO', despeje: 'RINVIO', perdida: 'RECUPERO', pase_fuera: 'PASSAGGIO LUNGO', default: 'AZIONE' }, role: { protagonist: 'Protagonista', scorer: 'Marcatore', shooter: 'Tiratore', assistant: 'Assistente', keeper: 'Portiere', defender: 'Difensore', receiver: 'Ricevente' }, title: { midfield_pass: 'Passaggio a centrocampo', defensive_pass: 'Uscita dal basso', defensive_recovery: 'Recupero difensivo', shot: 'Tiro', cross: 'Cross in area', free_kick: 'Punizione', free_kick_goal: 'Gol su punizione', penalty: 'Rigore', penalty_goal: 'Gol su rigore', shot_goal: 'Gol su tiro', shot_goal_alt: 'Gol su tiro', header_goal: 'Gol di testa', yellow_foul: 'Fallo e giallo', red_foul: 'Fallo e rosso', goal_kick: 'Rimessa dal fondo' }, alt: { midfield_pass: 'Scena pixelart di un passaggio a centrocampo', defensive_pass: 'Scena pixelart di un passaggio in difesa', defensive_recovery: 'Scena pixelart di un recupero difensivo', shot: 'Scena pixelart di un attaccante al tiro', cross: 'Scena pixelart di un cross in area', free_kick: 'Scena pixelart di una punizione', free_kick_goal: 'Scena pixelart di una punizione pericolosa', penalty: 'Scena pixelart di un rigore', penalty_goal: 'Scena pixelart di un gol su rigore', shot_goal: 'Scena pixelart di un gol su tiro', shot_goal_alt: 'Scena pixelart alternativa di un gol su tiro', header_goal: 'Scena pixelart di un gol di testa', yellow_foul: 'Scena pixelart di un fallo con cartellino giallo', red_foul: 'Scena pixelart di un fallo con cartellino rosso', goal_kick: 'Scena pixelart di una rimessa dal fondo' }, highlight: 'Highlight', goalStamp: 'GOL!', headline: { gol: ({ attacker }) => `Gol di ${attacker}`, parada: ({ keeper }) => `Parata di ${keeper}`, tiro_fuera: ({ shooter }) => `Tiro fuori di ${shooter}`, bloqueo: ({ defender }) => `Muro di ${defender}`, faltaRoja: 'Fallo duro', falta: 'Fallo tattico', fuera_juego: 'Fuorigioco', despeje: 'La difesa libera', pase_fuera: 'Passaggio troppo lungo', perdida: 'Recupero difensivo', default: ({ attacker }) => `${attacker} non trova il tiro` },
    },
    injury: {
      severity: { simple: 'lieve', moderada: '1 partita', grave: '3 partite', muy_grave: '6 partite' },
      types: {
        simple: ['contusione', 'botta alla caviglia', 'lieve distorsione', 'tensione muscolare'],
        moderada: ['distorsione alla caviglia', 'lesione muscolare', 'torsione al ginocchio', 'contrattura'],
        grave: ['lesione alle fibre', 'distorsione di grado 2', 'lussazione alla spalla', 'micro-lesione muscolare'],
        muy_grave: ['rottura del legamento crociato', 'frattura del perone', 'rottura del tendine d’Achille', 'grave lussazione al ginocchio'],
      },
    },
    press: {
      masthead: 'La Gazzetta della Torre',
      edition: ({ level }) => `Edizione speciale · Piano ${level}`,
      caption: ({ name }) => `${name}, il migliore in campo`,
      photoAlt: ({ name }) => `Ritratto pixelart di ${name}`,
      headline: {
        winBig: [
          ({ team, figure }) => `Spettacolo di ${team} con un ${figure} leggendario`,
          ({ team, figure }) => `${team} dilaga con ${figure} sugli scudi`,
        ],
        win: [
          ({ team, figure }) => `${figure} guida ${team} a una vittoria di carattere`,
          ({ team, figure }) => `${team} si prende la notte nel segno di ${figure}`,
        ],
        draw: [
          ({ team, opp }) => `${team} e ${opp} firmano un pareggio dal sapore di battaglia`,
          ({ team, opp }) => `${team} e ${opp} si dividono la posta dopo un braccio di ferro senza tregua`,
        ],
        loss: [
          ({ team, opp }) => `${opp} ferma la scalata di ${team}`,
          ({ team, opp }) => `${team} inciampa e ${opp} gli taglia le ali in piena ascesa`,
        ],
      },
      lead: {
        win: [
          ({ team, opp, score, figure, feat }) => `La selezione di ${team} si è imposta ${score} sulla selezione di ${opp} in una partita intensa che ha regalato grandi emozioni dall’inizio alla fine. Il protagonista assoluto della serata è stato ${figure}, autore di una prestazione memorabile nel ${feat}, decisivo in ognuno dei momenti chiave della gara.`,
          ({ team, opp, score, figure, feat }) => `${team} ha avuto la meglio su ${opp} per ${score} al termine di un confronto ad alti ritmi, lottato a viso aperto dal primo all’ultimo minuto. A dettare il tono è stato ${figure}, decisivo nel ${feat} e padrone degli istanti che hanno davvero pesato.`,
        ],
        draw: [
          ({ team, opp, score, figure, feat }) => `${team} e ${opp} hanno firmato un ${score} in una sfida intensa in cui nessuna delle due ha mollato. Se qualcuno ha tenuto in piedi la squadra è stato ${figure}, capace di ${feat} e di tenere viva la speranza dei suoi fino al fischio finale.`,
          ({ team, opp, score, figure, feat }) => `Un ${score} senza vincitori ha riassunto il botta e risposta tra ${team} e ${opp}, che si sono affrontate a viso aperto senza risparmiarsi. Il più costante è stato ${figure}, che ha trascinato i suoi nel ${feat} quando la sfida chiedeva un leader.`,
        ],
        loss: [
          ({ team, opp, score, figure, feat }) => `La selezione di ${opp} si è imposta ${score} sulla selezione di ${team} in un duello ruvido deciso dai dettagli. Il grande protagonista della gara è stato ${figure}, che ha fatto la differenza nel ${feat} e ha lasciato l’avversario senza risposte.`,
          ({ team, opp, score, figure, feat }) => `${opp} ha avuto la meglio su ${team} per ${score} in una gara spigolosa e combattuta, sbloccata dai piccoli dettagli. Il grande protagonista è stato ${figure}, che ha fatto la differenza nel ${feat} e ha lasciato ${team} prigioniero del piano avversario.`,
        ],
      },
      body: {
        opener: [
          ({ att, def, minute, scorer, how, score }) => `Fin dall’avvio, ${att} ha mostrato un atteggiamento offensivo e un pressing alto che ha complicato l’uscita di ${def}. L’insistenza ha pagato al minuto ${minute}, quando ${scorer} ${how} portando il punteggio sul ${score}. Il gol ha dato fiducia ai suoi, che hanno iniziato a controllare il possesso e a creare pericoli costanti sulle fasce.`,
          ({ att, def, minute, scorer, how, score }) => `${att} non ha perso tempo a dettare il copione: pressing alto e inserimenti sulle fasce per chiudere ${def} nella propria metà campo. La ricompensa è arrivata al minuto ${minute}, quando ${scorer} ${how} sbloccando il punteggio (${score}). Messo a segno il primo colpo, i suoi hanno preso fiato e dettato i tempi a piacimento.`,
        ],
        scoreless: [
          ({ team, opp, keeper }) => `Il primo tempo è stato un braccio di ferro tattico in cui ${team} e ${opp} si sono studiate senza concedere spazi. Le difese hanno avuto la meglio sugli attacchi e, quando è servito, ${keeper} ha spento gli incendi in area. Si è arrivati all’intervallo senza reti, con la sensazione che la partita si sarebbe decisa su un dettaglio.`,
          ({ team, opp, keeper }) => `Il primo tempo si è giocato col freno a mano tirato: ${team} e ${opp} hanno anteposto il non perdere al rischiare, e il pallone è girato più a centrocampo che nelle aree. Ogni volta che qualcuno osava, c’era ${keeper} a rimettere ordine. Si è andati al riposo sullo zero a zero, con l’aria di una sfida da testa o croce.`,
        ],
        quiet: [
          ({ team, opp, keeper }) => `Nella ripresa il punteggio non si è più mosso: ${team} e ${opp} si sono scambiate offensive senza lucidità negli ultimi metri, e ogni tentativo è morto tra i guanti di ${keeper} o sui piedi di una difesa ben messa. Il duello si è chiuso senza altri brividi, deciso da quanto seminato prima dell’intervallo.`,
          ({ team, opp, keeper }) => `La ripresa ha sbattuto la porta: ${team} e ${opp} ci hanno provato a tratti ma senza profondità né ultimo passaggio, e il poco che è arrivato si è infranto su ${keeper} o su una difesa concentrata. Il duello si è spento poco a poco, fedele al copione del primo tempo.`,
        ],
        red: [
          ({ player, team, minute }) => `La partita si è complicata con l’espulsione di ${player} al minuto ${minute}, che ha lasciato ${team} in inferiorità condizionando del tutto il finale.`,
          ({ player, team, minute }) => `La gara è cambiata col cartellino rosso a ${player} al minuto ${minute}: ${team}, rimasto in dieci, ha dovuto stringere i denti per difendere il risultato fino alla fine.`,
        ],
        injury: {
          simple: [
            ({ player, team, minute, type }) => `${player} ha chiesto il cambio al ${minute}' per una ${type} e ha lasciato il posto all’istante, ma lo spavento non è andato oltre.`,
            ({ player, team, minute, type }) => `Una ${type} ha costretto ${player} a uscire al minuto ${minute}: ${team} ha pescato dalla panchina, ma è stato solo un contrattempo lieve.`,
            ({ player, team, minute, type }) => `${team} ha perso ${player} al minuto ${minute} per una ${type}; nulla di serio, ma abbastanza per lasciare il campo subito.`,
            ({ player, team, minute, type }) => `${player} ha alzato la mano al ${minute}' per una ${type} e ha chiesto il cambio senza forzare; un allarme minore che ${team} non ha voluto rischiare.`,
          ],
          moderada: [
            ({ player, team, minute, type }) => `${player} è caduto infortunato al ${minute}' con una ${type} ed è stato sostituito: ${team} perde una pedina importante per il prossimo impegno.`,
            ({ player, team, minute, type }) => `La ${type} di ${player} al minuto ${minute} ha fatto scattare l’allarme nel ${team}, che lo ha tolto con evidente dolore in vista delle prossime settimane.`,
            ({ player, team, minute, type }) => `Brutta notizia per ${team}: ${player} è uscito al ${minute}' con una ${type} che lo terrà fuori dalla prossima partita.`,
            ({ player, team, minute, type }) => `${player} ha lasciato il campo al ${minute}' per una ${type}, e in casa ${team} si fanno già i conti in vista del prossimo impegno.`,
          ],
          grave: [
            ({ player, team, minute, type }) => `Immagine preoccupante al ${minute}': ${player} è crollato per una ${type} e ha lasciato il campo visibilmente sofferente, un duro colpo per i piani del ${team}.`,
            ({ player, team, minute, type }) => `La ${type} di ${player} al minuto ${minute} ha imposto un’uscita d’urgenza; ${team} affronta le prossime giornate senza uno dei suoi punti di riferimento.`,
            ({ player, team, minute, type }) => `${team} ha subito un brutto colpo quando ${player} ha dovuto lasciare il campo al ${minute}' con una ${type} che fa pensare a diverse settimane di stop.`,
            ({ player, team, minute, type }) => `Smorfia di dolore al minuto ${minute}: ${player} non ha potuto proseguire per una ${type} ed è uscito a testa bassa, un contrattempo serio per ${team} nelle prossime settimane.`,
          ],
          muy_grave: [
            ({ player, team, minute, type }) => `Dramma al minuto ${minute}: ${player} è stato portato fuori tra gli applausi dopo una ${type} di estrema gravità che lo terrà fuori a lungo e offusca la serata del ${team}.`,
            ({ player, team, minute, type }) => `La partita è stata segnata dalla ${type} di ${player} al ${minute}': un infortunio gravissimo che priva ${team} del suo giocatore per mesi.`,
            ({ player, team, minute, type }) => `${team} ha ricevuto la peggiore delle notizie al ${minute}': ${player} ha subito una ${type} di massima gravità e il suo ritorno appare molto lontano.`,
            ({ player, team, minute, type }) => `Immagine amara al ${minute}': ${player} è uscito tra la preoccupazione generale per una ${type} di estrema gravità, un’assenza di lunga durata che colpisce ${team} in pieno.`,
          ],
        },
        injurySub: [
          ({ inName }) => `Al suo posto è entrato ${inName}.`,
          ({ inName }) => `${inName} ha preso il suo posto dalla panchina.`,
          ({ inName }) => `La panchina ha risposto subito con ${inName}.`,
          ({ inName }) => `${inName} è entrato per rilevarlo all’istante.`,
        ],
        injuryWarmup: [
          ({ player, team, type }) => `${player} si è fatto male nel riscaldamento per ${type} e non è mai sceso in campo: ${team} perde un effettivo prima ancora del fischio d’inizio.`,
          ({ player, team, type }) => `Contrattempo per ${team} prima di cominciare: ${player} ha accusato ${type} nel riscaldamento ed è uscito dalla gara senza giocare.`,
          ({ player, team, type }) => `${team} ha perso ${player} nel pre-partita: ${type} durante il riscaldamento lo ha tagliato fuori prima dell’inizio.`,
          ({ player, team, type }) => `Sfortuna per ${player}, fermato da ${type} mentre si scaldava; ${team} è rimasto con una riserva in meno prima del fischio.`,
        ],
        subSwap: [
          ({ inName, outName, cause, minute }) => `Per coprire il vuoto lasciato da ${cause}, ${inName} è entrato dalla panchina al ${minute}' e ${outName} ha ceduto il posto per ricomporre la difesa.`,
          ({ inName, outName, cause, minute }) => `Senza ${cause}, l’allenatore ha rifatto la lavagna al ${minute}': dentro ${inName} e ${outName} ha lasciato il posto per puntellare una difesa d’emergenza.`,
        ],
        subIn: [
          ({ inName, cause, minute }) => `Dopo l’espulsione di ${cause}, ${inName} è entrato dalla panchina al ${minute}' per rinforzare la difesa.`,
          ({ inName, cause, minute }) => `Con ${cause} già fuori, ${inName} è sceso in campo al ${minute}' per tappare il buco dietro.`,
        ],
        forfeit: [
          ({ team }) => `Con quattro espulsi, ${team} è rimasta senza giocatori in campo e l’arbitro ha dato la partita per persa.`,
          ({ team }) => `A corto di uomini dopo la quarta espulsione, ${team} non ha potuto proseguire e l’arbitro ha decretato la fine anticipata della gara.`,
        ],
        penaltyMiss: [
          ({ shooter, keeper, minute }) => `C’è stato il dramma dal dischetto al minuto ${minute}: ${shooter} aveva il gol sui piedi, ma ${keeper} e la sorte gli hanno negato la festa.`,
          ({ shooter, keeper, minute }) => `Il rigore del minuto ${minute} prometteva festa ed è finito in frustrazione: ${shooter} si è presentato, ma ${keeper} gli ha letto le intenzioni firmando la parata della serata.`,
        ],
        nearMissSave: [
          ({ shooter, keeper, minute }) => `Non tutto è riuscito negli ultimi metri: l’occasione più nitida sprecata è capitata a ${shooter} al minuto ${minute}, ma ${keeper} ha vinto il faccia a faccia con un intervento di grande valore.`,
          ({ shooter, keeper, minute }) => `Lo spavento più serio portava la firma di ${shooter} al minuto ${minute}, ma ${keeper} si è disteso come un felino per tenere la porta inviolata.`,
        ],
        nearMissWide: [
          ({ shooter, minute }) => `Non tutto è riuscito negli ultimi metri: l’occasione più nitida sprecata è capitata a ${shooter} al minuto ${minute}, con una conclusione uscita di un soffio tra i sospiri degli spalti.`,
          ({ shooter, minute }) => `La migliore occasione senza premio è capitata a ${shooter} al minuto ${minute}, con una staffilata che ha baciato la traversa e spento la festa sugli spalti.`,
        ],
        bestSave: [
          ({ keeper, shooter, minute }) => `La parata della serata è arrivata al minuto ${minute}, quando ${keeper} ha negato un gol fatto a ${shooter} tenendo in vita i suoi nel momento di massima pressione.`,
          ({ keeper, shooter, minute }) => `Il grande intervento della serata è arrivato al minuto ${minute}: ${keeper} ha tolto in modo miracoloso una conclusione a botta sicura di ${shooter} tenendo intatte le speranze dei suoi.`,
        ],
      },
      goal: {
        extend: [
          ({ scorer, minute, how, score }) => `Il vantaggio è cresciuto al minuto ${minute}, quando ${scorer} ${how} fissando il punteggio sul ${score}.`,
          ({ scorer, minute, how, score }) => `Il colpo decisivo al morale avversario è arrivato al ${minute}': ${scorer} ${how} allargando il margine (${score}).`,
        ],
        lead: [
          ({ team, scorer, minute, how, score }) => `Al minuto ${minute}, ${scorer} ${how} portando ${team} avanti nel punteggio (${score}).`,
          ({ team, scorer, minute, how, score }) => `${scorer} ha rotto l’equilibrio al minuto ${minute}: ${how} portando ${team} in vantaggio (${score}).`,
        ],
        equalizer: [
          ({ team, scorer, minute, how }) => `${team} ha reagito e trovato il pareggio al minuto ${minute}: ${scorer} ${how} riportando la gara in equilibrio.`,
          ({ team, scorer, minute, how }) => `${team} è tornato a galla al minuto ${minute}: ${scorer} ${how} ristabilendo la parità nel punteggio.`,
        ],
        comeback: [
          ({ team, scorer, minute, how }) => `${team} ha accorciato le distanze al minuto ${minute} grazie a ${scorer}, che ${how} restituendo incertezza alla sfida.`,
          ({ team, scorer, minute, how }) => `${team} si è aggrappato alla gara al minuto ${minute} con ${scorer}, che ${how} rimettendo i suoi in corsa.`,
        ],
        sealer: [
          ({ scorer, minute, how, score }) => `E quando la partita sembrava aperta, la gerarchia ha parlato di nuovo: al minuto ${minute} ${scorer} ${how} e ha firmato il ${score} definitivo.`,
          ({ scorer, minute, how, score }) => `E quando l’avversario sognava la rimonta, è arrivata la stoccata: ${scorer} ${how} al minuto ${minute} e ha fissato il ${score} definitivo.`,
        ],
      },
      how: {
        penalty: [
          'non ha perdonato dal dischetto',
          'ha spiazzato il portiere e trasformato il rigore senza tremare',
        ],
        freeKick: [
          'ha disegnato una punizione imprendibile per il portiere',
          'ha calciato una punizione imparabile insaccatasi sul palo',
        ],
        header: [
          'ha vinto il duello aereo e incornato in modo imparabile',
          'ha spedito in rete un colpo di testa imparabile',
        ],
        headerAssist: [
          ({ assister }) => `ha colpito di testa su un cross millimetrico di ${assister}`,
          ({ assister }) => `si è alzato indisturbato per incornare un cross millimetrico di ${assister}`,
        ],
        counter: [
          'ha concluso un contropiede fulminante con freddezza da killer',
          'ha guidato il contropiede a tutta velocità chiudendolo con una finalizzazione chirurgica',
        ],
        shotAssist: [
          ({ assister }) => `ha raccolto un filtrante di ${assister} e battuto il portiere con un diagonale`,
          ({ assister }) => `ha raccolto un pallone nello spazio di ${assister} e battuto il portiere con un tiro piazzato`,
        ],
        shot: [
          'è apparso in area al termine di un’azione corale e ha concluso con precisione',
          'ha approfittato di una respinta in area e ha fulminato il portiere',
        ],
      },
      feat: {
        goals: [
          ({ goals }) => `segnare ${goals}`,
          ({ goals }) => `firmare ${goals}`,
        ],
        goalsAssists: [
          ({ goals, assists }) => `segnare ${goals} e servire ${assists}`,
          ({ goals, assists }) => `firmare ${goals} e confezionare ${assists}`,
        ],
        assists: [
          ({ assists }) => `servire ${assists}`,
          ({ assists }) => `confezionare ${assists}`,
        ],
        saves: [
          ({ saves }) => `tenere a galla i suoi con ${saves}`,
          ({ saves }) => `tenere in piedi i suoi con ${saves}`,
        ],
        wall: [
          'vincere ogni duello senza perdere un pallone conteso',
          'ergersi a muro invalicabile e dominare ogni duello nella sua zona',
        ],
        manager: {
          comeback: [
            ({ manager, team }) => `Capitolo a parte per ${manager}, la cui mano dalla panchina ha raddrizzato ${team} e firmato una rimonta di valore.`,
            ({ manager }) => `La lettura di ${manager} dalla panchina ha ribaltato la gara: aggiustamenti fini e una squadra che non ha mai smesso di crederci.`,
            ({ manager, team }) => `E sul piano tattico, ${manager} ha azzeccato i ritocchi giusti per rimettere ${team} sui binari dalla lavagna.`,
          ],
          loss: [
            ({ manager, team }) => `Nonostante gli sforzi, a ${manager} sono finite le carte in panchina e ${team} non è riuscito a raddrizzare la serata.`,
            ({ manager, team, level }) => `${manager} ha cercato risposte dalla panchina, ma la sconfitta ha lasciato ${team} senza margine al piano ${level}.`,
            ({ manager, team }) => `Nemmeno i cambi di ${manager} hanno trovato la chiave, e ${team} è uscito a mani vuote pur lottando fino alla fine.`,
          ],
          lossRival: [
            ({ manager, opp, team }) => `Il duello delle panchine ha sorriso a ${opp}, che ha letto la gara meglio di ${manager} e lasciato ${team} senza risposte.`,
            ({ manager, opp, team }) => `${opp} ha vinto anche la sfida dalla panchina: i suoi aggiustamenti hanno battuto quelli di ${manager} e condannato ${team}.`,
          ],
          debut: [
            ({ manager, player }) => `${manager} ha osato una novità e lanciato ${player}, che ha vissuto l’esordio nell’undici titolare.`,
            ({ manager, player }) => `Scommessa dalla panchina: ${manager} ha fatto esordire ${player} in una scelta che ha fatto discutere.`,
            ({ manager, player }) => `${manager} ha pescato dalla panchina per regalare l’esordio a ${player}, una scommessa che non è passata inosservata.`,
          ],
          drawRival: [
            ({ manager, opp }) => `Il pari ha premiato in egual misura due panchine sagaci: ${manager} e ${opp} si sono neutralizzati dalla panchina in una partita a scacchi senza vincitori.`,
            ({ manager, opp }) => `Pareggio anche nel duello dei tecnici: ${manager} e ${opp} hanno mosso le loro pedine senza che nessuno imponesse il proprio piano.`,
          ],
          winRival: [
            ({ manager, opp, team }) => `Il duello delle panchine ha sorriso a ${manager}, che ha anticipato ${opp} con un piano che ${team} ha eseguito alla lettera.`,
            ({ manager, opp }) => `${manager} ha vinto anche la battaglia tattica contro ${opp}: le sue scelte dalla panchina hanno disegnato la serata.`,
          ],
          subs: [
            ({ manager }) => `I cambi di ${manager} hanno rinfrescato la squadra e mosso i fili della gara dalla panchina.`,
            ({ manager }) => `${manager} ha scosso la partita dalla panchina con un paio di ritocchi che hanno cambiato l’inerzia.`,
            ({ manager, team }) => `Dalla panchina, ${manager} ha dosato le energie con cambi misurati che hanno tenuto vivo ${team}.`,
          ],
        },
      },
      units: {
        goals: ({ n }) => (n === 1 ? 'un gol' : `${NUM_WORDS.it[n] || n} gol`),
        assists: ({ n }) => (n === 1 ? 'un assist' : `${NUM_WORDS.it[n] || n} assist`),
        saves: ({ n }) => (n === 1 ? 'una parata di pregio' : `${NUM_WORDS.it[n] || n} parate di pregio`),
        and: ' e ',
        wall: 'un’autorità indiscutibile dietro',
      },
      closing: {
        win: [
          ({ team, figure, featSummary }) => `Il fischio finale ha confermato una vittoria solida di ${team}, che ha trovato in ${figure} il proprio leader tecnico ed emotivo. Con ${featSummary}, il migliore in campo si è guadagnato il riconoscimento di tifosi e analisti, e la sua squadra prepara già l’assalto al piano successivo della Torre delle Leggende.`,
          ({ team, figure, featSummary }) => `Il fischio finale ha fatto esplodere la festa di ${team}, che si è appoggiato a ${figure} per chiudere una serata impegnativa. Con ${featSummary}, il protagonista ha sfornato una prova di gran classe e lasciato la squadra col morale alle stelle verso il piano successivo della Torre delle Leggende.`,
        ],
        draw: [
          ({ team, opp, figure, featSummary }) => `Il pareggio ha lasciato l’amaro in bocca a entrambi gli spogliatoi, ma nessuno ha discusso il nome della serata: con ${featSummary}, ${figure} ha sorretto i suoi nei minuti caldi di un duello che ${team} e ${opp} hanno combattuto fino all’ultimo respiro.`,
          ({ team, opp, figure, featSummary }) => `La divisione della posta ha lasciato la sensazione di un lavoro incompiuto da entrambe le parti, ma la figura non ha ammesso discussioni: con ${featSummary}, ${figure} ha retto i suoi in un duello che ${team} e ${opp} hanno pareggiato fino all’ultimo minuto.`,
        ],
        loss: [
          ({ team, figure, featSummary, level }) => `Il fischio finale ha certificato la caduta di ${team}, rimasta senza risposte davanti a un rivale più cinico. Con ${featSummary}, ${figure} si è eretto a giustiziere della serata e ha fermato la scalata di ${team} al piano ${level} della Torre delle Leggende.`,
          ({ team, figure, featSummary, level }) => `Il fischio finale ha confermato il passo falso di ${team}, superato da un rivale più cinico in entrambe le aree. Con ${featSummary}, ${figure} è stato il grande nome della serata e ha congelato la scalata di ${team} al piano ${level} della Torre delle Leggende.`,
        ],
      },
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

// Como t(), pero si la clave resuelve a un array de variantes (varias plantillas
// para un mismo bloque, p. ej. las frases de la crónica de prensa) elige una con
// el rng dado. Determinista: mismo rng → misma variante. Sin rng usa la primera.
export function tVariant(key, vars = {}, rng = null) {
  let value = getByPath(DICTIONARIES[currentLanguage], key);
  if (value == null) value = getByPath(DICTIONARIES[DEFAULT_LANGUAGE], key);
  if (Array.isArray(value)) value = rng ? rng.pick(value) : value[0];
  return interpolate(value ?? key, vars);
}

// Como tVariant(), pero elige la variante por ÍNDICE en vez de por rng. Sirve
// para resolver datos guardados (p. ej. el tipo de lesión, cuyo typeIndex se fija
// al simular) de forma que coincidan crónica y pantalla de resultado. El índice
// se acota al tamaño del array. Con fallback al idioma por defecto.
export function tIndexed(key, index = 0, vars = {}) {
  let value = getByPath(DICTIONARIES[currentLanguage], key);
  if (value == null) value = getByPath(DICTIONARIES[DEFAULT_LANGUAGE], key);
  if (Array.isArray(value)) value = value[((index % value.length) + value.length) % value.length];
  return interpolate(value ?? key, vars);
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
