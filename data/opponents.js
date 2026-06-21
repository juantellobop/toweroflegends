// Torre de Leyendas — Selecciones históricas que alcanzaron cuartos de final
// o una ronda posterior. Los onces son representativos de cada torneo; los
// OVR y ratings son valores de juego, no valoraciones históricas oficiales.
//
// Fuente de verdad editable: el panel admin local (pestaña "Rivales") reescribe
// directamente el array OPPONENTS de abajo (formación, once titular, banquillo y
// managerId). Las funciones de selección de rival se conservan tras el array.

import { CONFIG, targetStrength } from './config.js';
import { MANAGERS } from './managers.js';

// Piso de 1 y redondeo; sin techo de 99: los rivales de niveles altos siguen
// creciendo igual que el equipo del jugador (simetría de la dificultad).
const clamp = (n) => Math.max(1, Math.round(n));

// DT de cada edición rival: ahora es un campo EXPLÍCITO (managerId) en el rival,
// no un match por país+año. Así un DT puede dirigir a una selección de otra
// nacionalidad (p. ej. Gerardo Martino → Paraguay 2010) y el vínculo solo
// depende de lo elegido en el editor admin. null = sin DT asignado.
const MANAGER_BY_ID = new Map(MANAGERS.map((m) => [m.id, m]));

// Snapshot mínimo del DT que dirige a un rival (o null). Va dentro del rival y se
// persiste con el guardado sin arrastrar datos pesados (retrato en data-URL, etc.).
function managerById(id) {
  const m = id ? MANAGER_BY_ID.get(id) : null;
  if (!m) return null;
  return { id: m.id, name: m.name, nation: m.nation, year: m.year, rarity: m.rarity, style: m.style, mods: { ...m.mods } };
}

export const OPPONENTS = [
  {
    "id": "ar_2022",
    "name": "Argentina",
    "year": 2022,
    "achievement": "Campeón",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 95,
    "ratings": {
      "attack": 97,
      "midfield": 96,
      "defense": 95,
      "gk": 96
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Emiliano Martínez",
        "position": "GK",
        "ovr": 95
      },
      {
        "name": "Marcos Acuña",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Cristian Romero",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Nicolás Otamendi",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Nahuel Molina",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Rodrigo De Paul",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Enzo Fernández",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Alexis Mac Allister",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Ángel Di María",
        "position": "FWD",
        "ovr": 98
      },
      {
        "name": "Julián Álvarez",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Lionel Messi",
        "position": "FWD",
        "ovr": 96
      }
    ],
    "bench": [],
    "managerId": "manager_lionel_scaloni",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_2022",
    "name": "Francia",
    "year": 2022,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 93,
    "ratings": {
      "attack": 96,
      "midfield": 93,
      "defense": 94,
      "gk": 93
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Hugo Lloris",
        "position": "GK",
        "ovr": 92
      },
      {
        "name": "Jules Koundé",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Raphaël Varane",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Dayot Upamecano",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Theo Hernández",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Aurélien Tchouaméni",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Adrien Rabiot",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Antoine Griezmann",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Ousmane Dembélé",
        "position": "FWD",
        "ovr": 95
      },
      {
        "name": "Olivier Giroud",
        "position": "FWD",
        "ovr": 96
      },
      {
        "name": "Kylian Mbappé",
        "position": "FWD",
        "ovr": 97
      }
    ],
    "bench": [],
    "managerId": "manager_didier_deschamps",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "hr_2022",
    "name": "Croacia",
    "year": 2022,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#D71920",
      "secondary": "#FFFFFF"
    },
    "color": "#D71920",
    "strength": 84,
    "ratings": {
      "attack": 82,
      "midfield": 88,
      "defense": 85,
      "gk": 87
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Dominik Livaković",
        "position": "GK",
        "ovr": 86
      },
      {
        "name": "Josip Juranović",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Dejan Lovren",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Joško Gvardiol",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Borna Sosa",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Luka Modrić",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Marcelo Brozović",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Mateo Kovačić",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Mario Pašalić",
        "position": "FWD",
        "ovr": 81
      },
      {
        "name": "Andrej Kramarić",
        "position": "FWD",
        "ovr": 82
      },
      {
        "name": "Ivan Perišić",
        "position": "FWD",
        "ovr": 83
      }
    ],
    "bench": [],
    "managerId": "manager_zlatko_dalic",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ma_2022",
    "name": "Marruecos",
    "year": 2022,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#C1272D",
      "secondary": "#006233"
    },
    "color": "#C1272D",
    "strength": 78,
    "ratings": {
      "attack": 76,
      "midfield": 80,
      "defense": 82,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Yassine Bounou",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Achraf Hakimi",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Nayef Aguerd",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Romain Saïss",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Noussair Mazraoui",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Sofyan Amrabat",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Azzedine Ounahi",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Selim Amallah",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Hakim Ziyech",
        "position": "FWD",
        "ovr": 75
      },
      {
        "name": "Youssef En-Nesyri",
        "position": "FWD",
        "ovr": 76
      },
      {
        "name": "Sofiane Boufal",
        "position": "FWD",
        "ovr": 77
      }
    ],
    "bench": [],
    "managerId": "manager_walid_regragui",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "nl_2022",
    "name": "Países Bajos",
    "year": 2022,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F36C21",
      "secondary": "#111111"
    },
    "color": "#F36C21",
    "strength": 82,
    "ratings": {
      "attack": 83,
      "midfield": 83,
      "defense": 84,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Andries Noppert",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Jurriën Timber",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Virgil van Dijk",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Nathan Aké",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Denzel Dumfries",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Frenkie de Jong",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Marten de Roon",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Daley Blind",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Cody Gakpo",
        "position": "FWD",
        "ovr": 82
      },
      {
        "name": "Memphis Depay",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Steven Bergwijn",
        "position": "FWD",
        "ovr": 84
      }
    ],
    "bench": [],
    "managerId": "manager_louis_van_gaal",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_2022",
    "name": "Inglaterra",
    "year": 2022,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 86,
    "ratings": {
      "attack": 89,
      "midfield": 87,
      "defense": 87,
      "gk": 86
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Jordan Pickford",
        "position": "GK",
        "ovr": 85
      },
      {
        "name": "Kyle Walker",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "John Stones",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Harry Maguire",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Luke Shaw",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Declan Rice",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Jordan Henderson",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Jude Bellingham",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Bukayo Saka",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "Harry Kane",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Phil Foden",
        "position": "FWD",
        "ovr": 90
      }
    ],
    "bench": [],
    "managerId": "manager_gareth_southgate",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2022",
    "name": "Brasil",
    "year": 2022,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 91,
    "ratings": {
      "attack": 94,
      "midfield": 92,
      "defense": 93,
      "gk": 93
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Alisson",
        "position": "GK",
        "ovr": 92
      },
      {
        "name": "Danilo",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Marquinhos",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Thiago Silva",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Éder Militão",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Casemiro",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Lucas Paquetá",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Neymar",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Raphinha",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Richarlison",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Vinícius Júnior",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_tite",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "pt_2022",
    "name": "Portugal",
    "year": 2022,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#DA291C",
      "secondary": "#046A38"
    },
    "color": "#DA291C",
    "strength": 87,
    "ratings": {
      "attack": 90,
      "midfield": 89,
      "defense": 87,
      "gk": 86
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Diogo Costa",
        "position": "GK",
        "ovr": 85
      },
      {
        "name": "Diogo Dalot",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Pepe",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Rúben Dias",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Raphaël Guerreiro",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "William Carvalho",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Bernardo Silva",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Bruno Fernandes",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "João Félix",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Gonçalo Ramos",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Cristiano Ronaldo",
        "position": "FWD",
        "ovr": 91
      }
    ],
    "bench": [],
    "managerId": "manager_fernando_santos",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_2018",
    "name": "Francia",
    "year": 2018,
    "achievement": "Campeón",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 94,
    "ratings": {
      "attack": 96,
      "midfield": 96,
      "defense": 96,
      "gk": 95
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Hugo Lloris",
        "position": "GK",
        "ovr": 94
      },
      {
        "name": "Benjamin Pavard",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Raphaël Varane",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Samuel Umtiti",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Lucas Hernández",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Paul Pogba",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "N’Golo Kanté",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Antoine Griezmann",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Kylian Mbappé",
        "position": "FWD",
        "ovr": 95
      },
      {
        "name": "Olivier Giroud",
        "position": "FWD",
        "ovr": 96
      },
      {
        "name": "Blaise Matuidi",
        "position": "FWD",
        "ovr": 97
      }
    ],
    "bench": [],
    "managerId": "manager_didier_deschamps",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "hr_2018",
    "name": "Croacia",
    "year": 2018,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#D71920",
      "secondary": "#FFFFFF"
    },
    "color": "#D71920",
    "strength": 87,
    "ratings": {
      "attack": 87,
      "midfield": 91,
      "defense": 88,
      "gk": 88
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Danijel Subašić",
        "position": "GK",
        "ovr": 87
      },
      {
        "name": "Šime Vrsaljko",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Dejan Lovren",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Domagoj Vida",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Ivan Strinić",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Ivan Rakitić",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Marcelo Brozović",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Luka Modrić",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Ante Rebić",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Mario Mandžukić",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Ivan Perišić",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_zlatko_dalic",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "be_2018",
    "name": "Bélgica",
    "year": 2018,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#EF3340",
      "secondary": "#FBDD40"
    },
    "color": "#EF3340",
    "strength": 89,
    "ratings": {
      "attack": 92,
      "midfield": 92,
      "defense": 89,
      "gk": 92
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Thibaut Courtois",
        "position": "GK",
        "ovr": 91
      },
      {
        "name": "Toby Alderweireld",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Vincent Kompany",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Jan Vertonghen",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Thomas Meunier",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Kevin De Bruyne",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Axel Witsel",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Marouane Fellaini",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Eden Hazard",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Romelu Lukaku",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Nacer Chadli",
        "position": "FWD",
        "ovr": 93
      }
    ],
    "bench": [],
    "managerId": "manager_roberto_martinez",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_2018",
    "name": "Inglaterra",
    "year": 2018,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 80,
    "ratings": {
      "attack": 82,
      "midfield": 80,
      "defense": 81,
      "gk": 81
    },
    "formation": "4-4-2",
    "lineup": [
      {
        "name": "Jordan Pickford",
        "position": "GK",
        "ovr": 80
      },
      {
        "name": "Kyle Walker",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "John Stones",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Harry Maguire",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Kieran Trippier",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Jordan Henderson",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Dele Alli",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Jesse Lingard",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Ashley Young",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Raheem Sterling",
        "position": "FWD",
        "ovr": 81
      },
      {
        "name": "Harry Kane",
        "position": "FWD",
        "ovr": 82
      }
    ],
    "bench": [],
    "managerId": "manager_gareth_southgate",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "uy_2018",
    "name": "Uruguay",
    "year": 2018,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#6CACE4",
      "secondary": "#000000"
    },
    "color": "#6CACE4",
    "strength": 82,
    "ratings": {
      "attack": 85,
      "midfield": 82,
      "defense": 85,
      "gk": 82
    },
    "formation": "4-4-2",
    "lineup": [
      {
        "name": "Fernando Muslera",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Martín Cáceres",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Diego Godín",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "José María Giménez",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Diego Laxalt",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Nahitan Nández",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Lucas Torreira",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Matías Vecino",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Rodrigo Bentancur",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Luis Suárez",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Edinson Cavani",
        "position": "FWD",
        "ovr": 85
      }
    ],
    "bench": [],
    "managerId": "manager_oscar_tabarez",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2018",
    "name": "Brasil",
    "year": 2018,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 90,
    "ratings": {
      "attack": 93,
      "midfield": 91,
      "defense": 91,
      "gk": 91
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Alisson",
        "position": "GK",
        "ovr": 90
      },
      {
        "name": "Fagner",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Miranda",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Thiago Silva",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Marcelo",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Casemiro",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Paulinho",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Philippe Coutinho",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Willian",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Gabriel Jesus",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Neymar",
        "position": "FWD",
        "ovr": 94
      }
    ],
    "bench": [],
    "managerId": "manager_tite",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ru_2018",
    "name": "Rusia",
    "year": 2018,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#D52B1E",
      "secondary": "#0039A6"
    },
    "color": "#D52B1E",
    "strength": 67,
    "ratings": {
      "attack": 68,
      "midfield": 67,
      "defense": 68,
      "gk": 69
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Igor Akinfeev",
        "position": "GK",
        "ovr": 68
      },
      {
        "name": "Mario Fernandes",
        "position": "DEF",
        "ovr": 67
      },
      {
        "name": "Ilya Kutepov",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Sergei Ignashevich",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Fedor Kudryashov",
        "position": "DEF",
        "ovr": 67
      },
      {
        "name": "Roman Zobnin",
        "position": "MID",
        "ovr": 66
      },
      {
        "name": "Daler Kuzyaev",
        "position": "MID",
        "ovr": 67
      },
      {
        "name": "Aleksandr Golovin",
        "position": "MID",
        "ovr": 68
      },
      {
        "name": "Aleksandr Samedov",
        "position": "FWD",
        "ovr": 67
      },
      {
        "name": "Artem Dzyuba",
        "position": "FWD",
        "ovr": 68
      },
      {
        "name": "Denis Cheryshev",
        "position": "FWD",
        "ovr": 69
      }
    ],
    "bench": [],
    "managerId": "manager_stanislav_cherchesov",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "se_2018",
    "name": "Suecia",
    "year": 2018,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFCD00",
      "secondary": "#006AA7"
    },
    "color": "#FFCD00",
    "strength": 68,
    "ratings": {
      "attack": 67,
      "midfield": 68,
      "defense": 70,
      "gk": 69
    },
    "formation": "4-4-2",
    "lineup": [
      {
        "name": "Robin Olsen",
        "position": "GK",
        "ovr": 68
      },
      {
        "name": "Mikael Lustig",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Victor Lindelöf",
        "position": "DEF",
        "ovr": 70
      },
      {
        "name": "Andreas Granqvist",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Ludwig Augustinsson",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Viktor Claesson",
        "position": "MID",
        "ovr": 67
      },
      {
        "name": "Sebastian Larsson",
        "position": "MID",
        "ovr": 68
      },
      {
        "name": "Albin Ekdal",
        "position": "MID",
        "ovr": 69
      },
      {
        "name": "Emil Forsberg",
        "position": "MID",
        "ovr": 67
      },
      {
        "name": "Marcus Berg",
        "position": "FWD",
        "ovr": 66
      },
      {
        "name": "Ola Toivonen",
        "position": "FWD",
        "ovr": 67
      }
    ],
    "bench": [],
    "managerId": "manager_janne_andersson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_2014",
    "name": "Alemania",
    "year": 2014,
    "achievement": "Campeón",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 95,
    "ratings": {
      "attack": 97,
      "midfield": 98,
      "defense": 97,
      "gk": 98
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Manuel Neuer",
        "position": "GK",
        "ovr": 97
      },
      {
        "name": "Philipp Lahm",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Jérôme Boateng",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Mats Hummels",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Benedikt Höwedes",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Bastian Schweinsteiger",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Sami Khedira",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Toni Kroos",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Mesut Özil",
        "position": "FWD",
        "ovr": 96
      },
      {
        "name": "Thomas Müller",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Miroslav Klose",
        "position": "FWD",
        "ovr": 98
      }
    ],
    "bench": [],
    "managerId": "manager_joachim_low",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_2014",
    "name": "Argentina",
    "year": 2014,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 88,
    "ratings": {
      "attack": 91,
      "midfield": 89,
      "defense": 90,
      "gk": 89
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Sergio Romero",
        "position": "GK",
        "ovr": 88
      },
      {
        "name": "Pablo Zabaleta",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Martín Demichelis",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Ezequiel Garay",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Marcos Rojo",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Javier Mascherano",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Lucas Biglia",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Enzo Pérez",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Lionel Messi",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Gonzalo Higuaín",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Ezequiel Lavezzi",
        "position": "FWD",
        "ovr": 92
      }
    ],
    "bench": [
      {
        "name": "Fernando Gago",
        "position": "MID",
        "ovr": 89
      }
    ],
    "managerId": "manager_alejandro_sabella",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "nl_2014",
    "name": "Países Bajos",
    "year": 2014,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#F36C21",
      "secondary": "#111111"
    },
    "color": "#F36C21",
    "strength": 86,
    "ratings": {
      "attack": 89,
      "midfield": 87,
      "defense": 87,
      "gk": 86
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Jasper Cillessen",
        "position": "GK",
        "ovr": 85
      },
      {
        "name": "Daryl Janmaat",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Stefan de Vrij",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Ron Vlaar",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Daley Blind",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Nigel de Jong",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Wesley Sneijder",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Georginio Wijnaldum",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Arjen Robben",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "Robin van Persie",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Memphis Depay",
        "position": "FWD",
        "ovr": 90
      }
    ],
    "bench": [],
    "managerId": "manager_louis_van_gaal",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2014",
    "name": "Brasil",
    "year": 2014,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 84,
    "ratings": {
      "attack": 85,
      "midfield": 84,
      "defense": 85,
      "gk": 84
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Júlio César",
        "position": "GK",
        "ovr": 83
      },
      {
        "name": "Maicon",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Thiago Silva",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "David Luiz",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Marcelo",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Fernandinho",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Paulinho",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Oscar",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Hulk",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Fred",
        "position": "FWD",
        "ovr": 85
      },
      {
        "name": "Neymar",
        "position": "FWD",
        "ovr": 86
      }
    ],
    "bench": [],
    "managerId": "manager_luiz_felipe_scolari",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_2014",
    "name": "Francia",
    "year": 2014,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 81,
    "ratings": {
      "attack": 83,
      "midfield": 83,
      "defense": 82,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Hugo Lloris",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Mathieu Debuchy",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Raphaël Varane",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Mamadou Sakho",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Patrice Evra",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Yohan Cabaye",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Blaise Matuidi",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Paul Pogba",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Mathieu Valbuena",
        "position": "FWD",
        "ovr": 82
      },
      {
        "name": "Karim Benzema",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Antoine Griezmann",
        "position": "FWD",
        "ovr": 84
      }
    ],
    "bench": [],
    "managerId": "manager_didier_deschamps",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "be_2014",
    "name": "Bélgica",
    "year": 2014,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#EF3340",
      "secondary": "#FBDD40"
    },
    "color": "#EF3340",
    "strength": 79,
    "ratings": {
      "attack": 80,
      "midfield": 81,
      "defense": 80,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Thibaut Courtois",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Toby Alderweireld",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Vincent Kompany",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Daniel van Buyten",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Jan Vertonghen",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Axel Witsel",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Marouane Fellaini",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Kevin De Bruyne",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Dries Mertens",
        "position": "FWD",
        "ovr": 79
      },
      {
        "name": "Divock Origi",
        "position": "FWD",
        "ovr": 80
      },
      {
        "name": "Eden Hazard",
        "position": "FWD",
        "ovr": 81
      }
    ],
    "bench": [],
    "managerId": "manager_marc_wilmots",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "co_2014",
    "name": "Colombia",
    "year": 2014,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FCD116",
      "secondary": "#003893"
    },
    "color": "#FCD116",
    "strength": 72,
    "ratings": {
      "attack": 75,
      "midfield": 74,
      "defense": 72,
      "gk": 72
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "David Ospina",
        "position": "GK",
        "ovr": 71
      },
      {
        "name": "Juan Zúñiga",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Cristián Zapata",
        "position": "DEF",
        "ovr": 72
      },
      {
        "name": "Mario Yepes",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Pablo Armero",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Carlos Sánchez",
        "position": "MID",
        "ovr": 73
      },
      {
        "name": "Fredy Guarín",
        "position": "MID",
        "ovr": 74
      },
      {
        "name": "James Rodríguez",
        "position": "MID",
        "ovr": 75
      },
      {
        "name": "Juan Cuadrado",
        "position": "FWD",
        "ovr": 74
      },
      {
        "name": "Teófilo Gutiérrez",
        "position": "FWD",
        "ovr": 75
      },
      {
        "name": "Jackson Martínez",
        "position": "FWD",
        "ovr": 76
      }
    ],
    "bench": [],
    "managerId": "manager_jose_pekerman",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "cr_2014",
    "name": "Costa Rica",
    "year": 2014,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#CE1126",
      "secondary": "#002B7F"
    },
    "color": "#CE1126",
    "strength": 69,
    "ratings": {
      "attack": 68,
      "midfield": 69,
      "defense": 72,
      "gk": 74
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Keylor Navas",
        "position": "GK",
        "ovr": 73
      },
      {
        "name": "Cristian Gamboa",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Giancarlo González",
        "position": "DEF",
        "ovr": 72
      },
      {
        "name": "Óscar Duarte",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Júnior Díaz",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Celso Borges",
        "position": "MID",
        "ovr": 68
      },
      {
        "name": "Yeltsin Tejeda",
        "position": "MID",
        "ovr": 69
      },
      {
        "name": "Bryan Ruiz",
        "position": "MID",
        "ovr": 70
      },
      {
        "name": "Christian Bolaños",
        "position": "FWD",
        "ovr": 67
      },
      {
        "name": "Marco Ureña",
        "position": "FWD",
        "ovr": 68
      },
      {
        "name": "Joel Campbell",
        "position": "FWD",
        "ovr": 69
      }
    ],
    "bench": [],
    "managerId": "manager_jorge_luis_pinto",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "es_2010",
    "name": "España",
    "year": 2010,
    "achievement": "Campeón",
    "colors": {
      "primary": "#AA151B",
      "secondary": "#F1BF00"
    },
    "color": "#AA151B",
    "strength": 94,
    "ratings": {
      "attack": 95,
      "midfield": 99,
      "defense": 97,
      "gk": 97
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Iker Casillas",
        "position": "GK",
        "ovr": 96
      },
      {
        "name": "Sergio Ramos",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Gerard Piqué",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Carles Puyol",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Joan Capdevila",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Sergio Busquets",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Xabi Alonso",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Xavi Hernández",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Andrés Iniesta",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Fernando Torres",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "David Villa",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [
      {
        "name": "Pedro Rodríguez",
        "position": "FWD",
        "ovr": 96
      },
      {
        "name": "Koke",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Jesús Navas",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "David Silva",
        "position": "MID",
        "ovr": 88
      }
    ],
    "managerId": "manager_vicente_del_bosque",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "nl_2010",
    "name": "Países Bajos",
    "year": 2010,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#F36C21",
      "secondary": "#111111"
    },
    "color": "#F36C21",
    "strength": 89,
    "ratings": {
      "attack": 92,
      "midfield": 92,
      "defense": 90,
      "gk": 89
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Maarten Stekelenburg",
        "position": "GK",
        "ovr": 88
      },
      {
        "name": "Gregory van der Wiel",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "John Heitinga",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Joris Mathijsen",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Giovanni van Bronckhorst",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Mark van Bommel",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Nigel de Jong",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Wesley Sneijder",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Arjen Robben",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Robin van Persie",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Dirk Kuyt",
        "position": "FWD",
        "ovr": 93
      }
    ],
    "bench": [],
    "managerId": "manager_bert_van_marwijk",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_2010",
    "name": "Alemania",
    "year": 2010,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 88,
    "ratings": {
      "attack": 91,
      "midfield": 90,
      "defense": 89,
      "gk": 90
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Manuel Neuer",
        "position": "GK",
        "ovr": 89
      },
      {
        "name": "Philipp Lahm",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Per Mertesacker",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Arne Friedrich",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Jérôme Boateng",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Bastian Schweinsteiger",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Sami Khedira",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Mesut Özil",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Thomas Müller",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Miroslav Klose",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Lukas Podolski",
        "position": "FWD",
        "ovr": 92
      }
    ],
    "bench": [],
    "managerId": "manager_joachim_low",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "uy_2010",
    "name": "Uruguay",
    "year": 2010,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#6CACE4",
      "secondary": "#000000"
    },
    "color": "#6CACE4",
    "strength": 74,
    "ratings": {
      "attack": 78,
      "midfield": 75,
      "defense": 76,
      "gk": 74
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Fernando Muslera",
        "position": "GK",
        "ovr": 73
      },
      {
        "name": "Maxi Pereira",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Diego Lugano",
        "position": "DEF",
        "ovr": 76
      },
      {
        "name": "Diego Godín",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "Jorge Fucile",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Egidio Arévalo Ríos",
        "position": "MID",
        "ovr": 74
      },
      {
        "name": "Diego Pérez",
        "position": "MID",
        "ovr": 75
      },
      {
        "name": "Diego Forlán",
        "position": "MID",
        "ovr": 76
      },
      {
        "name": "Luis Suárez",
        "position": "FWD",
        "ovr": 77
      },
      {
        "name": "Edinson Cavani",
        "position": "FWD",
        "ovr": 78
      },
      {
        "name": "Álvaro Pereira",
        "position": "FWD",
        "ovr": 79
      }
    ],
    "bench": [],
    "managerId": "manager_oscar_tabarez",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_2010",
    "name": "Argentina",
    "year": 2010,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 83,
    "ratings": {
      "attack": 87,
      "midfield": 84,
      "defense": 82,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Sergio Romero",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Nicolás Otamendi",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Martín Demichelis",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Nicolás Burdisso",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Gabriel Heinze",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Javier Mascherano",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Ángel Di María",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Maxi Rodríguez",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Lionel Messi",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Gonzalo Higuaín",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Carlos Tevez",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_maradona",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2010",
    "name": "Brasil",
    "year": 2010,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 87,
    "ratings": {
      "attack": 90,
      "midfield": 89,
      "defense": 89,
      "gk": 89
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Júlio César",
        "position": "GK",
        "ovr": 88
      },
      {
        "name": "Maicon",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Lúcio",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Juan",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Michel Bastos",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Gilberto Silva",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Felipe Melo",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Kaká",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Robinho",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Luís Fabiano",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Elano",
        "position": "FWD",
        "ovr": 91
      }
    ],
    "bench": [],
    "managerId": "manager_dunga",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gh_2010",
    "name": "Ghana",
    "year": 2010,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#CE1126",
      "secondary": "#FCD116"
    },
    "color": "#CE1126",
    "strength": 64,
    "ratings": {
      "attack": 67,
      "midfield": 68,
      "defense": 67,
      "gk": 66
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Richard Kingson",
        "position": "GK",
        "ovr": 65
      },
      {
        "name": "John Paintsil",
        "position": "DEF",
        "ovr": 66
      },
      {
        "name": "John Mensah",
        "position": "DEF",
        "ovr": 67
      },
      {
        "name": "Isaac Vorsah",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Hans Sarpei",
        "position": "DEF",
        "ovr": 66
      },
      {
        "name": "Anthony Annan",
        "position": "MID",
        "ovr": 67
      },
      {
        "name": "Kevin-Prince Boateng",
        "position": "MID",
        "ovr": 68
      },
      {
        "name": "Sulley Muntari",
        "position": "MID",
        "ovr": 69
      },
      {
        "name": "Samuel Inkoom",
        "position": "FWD",
        "ovr": 66
      },
      {
        "name": "Asamoah Gyan",
        "position": "FWD",
        "ovr": 67
      },
      {
        "name": "André Ayew",
        "position": "FWD",
        "ovr": 68
      }
    ],
    "bench": [],
    "managerId": "manager_milovan_rajevac",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "py_2010",
    "name": "Paraguay",
    "year": 2010,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#D52B1E",
      "secondary": "#FFFFFF"
    },
    "color": "#D52B1E",
    "strength": 66,
    "ratings": {
      "attack": 66,
      "midfield": 66,
      "defense": 69,
      "gk": 68
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Justo Villar",
        "position": "GK",
        "ovr": 67
      },
      {
        "name": "Darío Verón",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Paulo da Silva",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Antolín Alcaraz",
        "position": "DEF",
        "ovr": 70
      },
      {
        "name": "Claudio Morel",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Enrique Vera",
        "position": "MID",
        "ovr": 65
      },
      {
        "name": "Cristian Riveros",
        "position": "MID",
        "ovr": 66
      },
      {
        "name": "Jonathan Santana",
        "position": "MID",
        "ovr": 67
      },
      {
        "name": "Lucas Barrios",
        "position": "FWD",
        "ovr": 65
      },
      {
        "name": "Roque Santa Cruz",
        "position": "FWD",
        "ovr": 66
      },
      {
        "name": "Nelson Haedo Valdez",
        "position": "FWD",
        "ovr": 67
      }
    ],
    "bench": [],
    "managerId": "manager_gerardo_tata_martino",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "it_2006",
    "name": "Italia",
    "year": 2006,
    "achievement": "Campeón",
    "colors": {
      "primary": "#0066BC",
      "secondary": "#FFFFFF"
    },
    "color": "#0066BC",
    "strength": 94,
    "ratings": {
      "attack": 94,
      "midfield": 96,
      "defense": 98,
      "gk": 98
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Gianluigi Buffon",
        "position": "GK",
        "ovr": 97
      },
      {
        "name": "Gianluca Zambrotta",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Fabio Cannavaro",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Marco Materazzi",
        "position": "DEF",
        "ovr": 99
      },
      {
        "name": "Fabio Grosso",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Gennaro Gattuso",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Andrea Pirlo",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Simone Perrotta",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Mauro Camoranesi",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Francesco Totti",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Luca Toni",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_marcello_lippi",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_2006",
    "name": "Francia",
    "year": 2006,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 92,
    "ratings": {
      "attack": 94,
      "midfield": 96,
      "defense": 94,
      "gk": 92
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Fabien Barthez",
        "position": "GK",
        "ovr": 91
      },
      {
        "name": "Willy Sagnol",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Lilian Thuram",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "William Gallas",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Éric Abidal",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Patrick Vieira",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Claude Makélélé",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Zinedine Zidane",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Franck Ribéry",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Thierry Henry",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Florent Malouda",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_raymond_domenech",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_2006",
    "name": "Alemania",
    "year": 2006,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 88,
    "ratings": {
      "attack": 91,
      "midfield": 90,
      "defense": 89,
      "gk": 89
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Jens Lehmann",
        "position": "GK",
        "ovr": 88
      },
      {
        "name": "Arne Friedrich",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Per Mertesacker",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Christoph Metzelder",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Philipp Lahm",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Torsten Frings",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Michael Ballack",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Bernd Schneider",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Lukas Podolski",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Miroslav Klose",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Bastian Schweinsteiger",
        "position": "FWD",
        "ovr": 92
      }
    ],
    "bench": [],
    "managerId": "manager_jurgen_klinsmann",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "pt_2006",
    "name": "Portugal",
    "year": 2006,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#DA291C",
      "secondary": "#046A38"
    },
    "color": "#DA291C",
    "strength": 85,
    "ratings": {
      "attack": 87,
      "midfield": 88,
      "defense": 87,
      "gk": 86
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Ricardo Pereira",
        "position": "GK",
        "ovr": 85
      },
      {
        "name": "Miguel Monteiro",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Ricardo Carvalho",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Fernando Meira",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Nuno Valente",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Costinha",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Maniche",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Deco",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Luís Figo",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Pauleta",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Cristiano Ronaldo",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_luiz_felipe_scolari",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2006",
    "name": "Brasil",
    "year": 2006,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 90,
    "ratings": {
      "attack": 94,
      "midfield": 93,
      "defense": 91,
      "gk": 90
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Dida",
        "position": "GK",
        "ovr": 89
      },
      {
        "name": "Roberto Carlos",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Lúcio",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Juan",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Cafú",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Emerson",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Zé Roberto",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Kaká",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Ronaldinho",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Ronaldo",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Adriano",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_carlos_alberto_parreira",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_2006",
    "name": "Argentina",
    "year": 2006,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 88,
    "ratings": {
      "attack": 91,
      "midfield": 91,
      "defense": 89,
      "gk": 88
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Roberto Abbondanzieri",
        "position": "GK",
        "ovr": 87
      },
      {
        "name": "Nicolás Burdisso",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Roberto Ayala",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Gabriel Heinze",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Juan Pablo Sorín",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Javier Mascherano",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Esteban Cambiasso",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Juan Román Riquelme",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Maxi Rodríguez",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Hernán Crespo",
        "position": "FWD",
        "ovr": 91
      },
      {
        "name": "Javier Saviola",
        "position": "FWD",
        "ovr": 92
      }
    ],
    "bench": [
      {
        "name": "Diego Milito",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Gabriel Milito",
        "position": "DEF",
        "ovr": 93
      }
    ],
    "managerId": "manager_jose_pekerman",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_2006",
    "name": "Inglaterra",
    "year": 2006,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 84,
    "ratings": {
      "attack": 86,
      "midfield": 87,
      "defense": 86,
      "gk": 83
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Paul Robinson",
        "position": "GK",
        "ovr": 82
      },
      {
        "name": "Gary Neville",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Rio Ferdinand",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "John Terry",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Ashley Cole",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "David Beckham",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Steven Gerrard",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Frank Lampard",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Joe Cole",
        "position": "FWD",
        "ovr": 85
      },
      {
        "name": "Wayne Rooney",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Michael Owen",
        "position": "FWD",
        "ovr": 87
      }
    ],
    "bench": [],
    "managerId": "manager_sven_goran_eriksson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ua_2006",
    "name": "Ucrania",
    "year": 2006,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#0057B7",
      "secondary": "#FFD700"
    },
    "color": "#0057B7",
    "strength": 70,
    "ratings": {
      "attack": 72,
      "midfield": 70,
      "defense": 72,
      "gk": 71
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Oleksandr Shovkovskyi",
        "position": "GK",
        "ovr": 70
      },
      {
        "name": "Volodymyr Yezerskyi",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Andriy Rusol",
        "position": "DEF",
        "ovr": 72
      },
      {
        "name": "Andriy Sviderskyi",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Andriy Nesmachnyi",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Anatoliy Tymoshchuk",
        "position": "MID",
        "ovr": 69
      },
      {
        "name": "Oleh Shelayev",
        "position": "MID",
        "ovr": 70
      },
      {
        "name": "Oleh Gusev",
        "position": "MID",
        "ovr": 71
      },
      {
        "name": "Andriy Voronin",
        "position": "FWD",
        "ovr": 71
      },
      {
        "name": "Andriy Shevchenko",
        "position": "FWD",
        "ovr": 72
      },
      {
        "name": "Artem Milevskyi",
        "position": "FWD",
        "ovr": 73
      }
    ],
    "bench": [],
    "managerId": "manager_oleh_blojin",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_2002",
    "name": "Brasil",
    "year": 2002,
    "achievement": "Campeón",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 95,
    "ratings": {
      "attack": 100,
      "midfield": 97,
      "defense": 97,
      "gk": 96
    },
    "formation": "4-3-1-2",
    "lineup": [
      {
        "name": "Marcos",
        "position": "GK",
        "ovr": 95
      },
      {
        "name": "Roberto Carlos",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Lúcio",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Edmílson",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Cafú",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Gilberto Silva",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Kléberson",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Juninho Paulista",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Rivaldo",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Ronaldinho",
        "position": "FWD",
        "ovr": 99
      },
      {
        "name": "Ronaldo",
        "position": "FWD",
        "ovr": 97
      }
    ],
    "bench": [],
    "managerId": "manager_luiz_felipe_scolari",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_2002",
    "name": "Alemania",
    "year": 2002,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 88,
    "ratings": {
      "attack": 89,
      "midfield": 89,
      "defense": 91,
      "gk": 93
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Oliver Kahn",
        "position": "GK",
        "ovr": 92
      },
      {
        "name": "Torsten Frings",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Carsten Ramelow",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Thomas Linke",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Christoph Metzelder",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Dietmar Hamann",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Jens Jeremies",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Michael Ballack",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Bernd Schneider",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "Miroslav Klose",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Oliver Neuville",
        "position": "FWD",
        "ovr": 90
      }
    ],
    "bench": [],
    "managerId": "manager_rudi_voller",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "tr_2002",
    "name": "Turquía",
    "year": 2002,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#E30A17",
      "secondary": "#FFFFFF"
    },
    "color": "#E30A17",
    "strength": 78,
    "ratings": {
      "attack": 80,
      "midfield": 80,
      "defense": 79,
      "gk": 81
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Rüştü Reçber",
        "position": "GK",
        "ovr": 80
      },
      {
        "name": "Fatih Akyel",
        "position": "DEF",
        "ovr": 78
      },
      {
        "name": "Alpay Özalan",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Bülent Korkmaz",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Ümit Davala",
        "position": "DEF",
        "ovr": 78
      },
      {
        "name": "Tugay Kerimoğlu",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Yıldıray Baştürk",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Emre Belözoğlu",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Hasan Şaş",
        "position": "FWD",
        "ovr": 79
      },
      {
        "name": "Hakan Şükür",
        "position": "FWD",
        "ovr": 80
      },
      {
        "name": "İlhan Mansız",
        "position": "FWD",
        "ovr": 81
      }
    ],
    "bench": [],
    "managerId": "manager_senol_gunes",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "kr_2002",
    "name": "Corea del Sur",
    "year": 2002,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#CD2E3A",
      "secondary": "#0047A0"
    },
    "color": "#CD2E3A",
    "strength": 72,
    "ratings": {
      "attack": 72,
      "midfield": 75,
      "defense": 74,
      "gk": 74
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Lee Woon-jae",
        "position": "GK",
        "ovr": 73
      },
      {
        "name": "Hong Myung-bo",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Choi Jin-cheul",
        "position": "DEF",
        "ovr": 74
      },
      {
        "name": "Kim Tae-young",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Song Chong-gug",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Yoo Sang-chul",
        "position": "MID",
        "ovr": 74
      },
      {
        "name": "Park Ji-sung",
        "position": "MID",
        "ovr": 75
      },
      {
        "name": "Lee Young-pyo",
        "position": "MID",
        "ovr": 76
      },
      {
        "name": "Ahn Jung-hwan",
        "position": "FWD",
        "ovr": 71
      },
      {
        "name": "Seol Ki-hyeon",
        "position": "FWD",
        "ovr": 72
      },
      {
        "name": "Cha Du-ri",
        "position": "FWD",
        "ovr": 73
      }
    ],
    "bench": [],
    "managerId": "manager_guus_hiddink",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "es_2002",
    "name": "España",
    "year": 2002,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#AA151B",
      "secondary": "#F1BF00"
    },
    "color": "#AA151B",
    "strength": 82,
    "ratings": {
      "attack": 84,
      "midfield": 84,
      "defense": 84,
      "gk": 84
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Iker Casillas",
        "position": "GK",
        "ovr": 83
      },
      {
        "name": "Carles Puyol",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Iván Helguera",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Fernando Hierro",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Juanfran García",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Rubén Baraja",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Juan Carlos Valerón",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Javier de Pedro",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Joaquín Sánchez",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Fernando Morientes",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Raúl González",
        "position": "FWD",
        "ovr": 85
      }
    ],
    "bench": [],
    "managerId": "manager_jose_camacho",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_2002",
    "name": "Inglaterra",
    "year": 2002,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 83,
    "ratings": {
      "attack": 85,
      "midfield": 85,
      "defense": 86,
      "gk": 83
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "David Seaman",
        "position": "GK",
        "ovr": 82
      },
      {
        "name": "Danny Mills",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Rio Ferdinand",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Sol Campbell",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Ashley Cole",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "David Beckham",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Nicky Butt",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Paul Scholes",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Michael Owen",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Emile Heskey",
        "position": "FWD",
        "ovr": 85
      },
      {
        "name": "Trevor Sinclair",
        "position": "FWD",
        "ovr": 86
      }
    ],
    "bench": [],
    "managerId": "manager_sven_goran_eriksson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "sn_2002",
    "name": "Senegal",
    "year": 2002,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#00853F",
      "secondary": "#FDEF42"
    },
    "color": "#00853F",
    "strength": 69,
    "ratings": {
      "attack": 71,
      "midfield": 71,
      "defense": 70,
      "gk": 69
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Tony Sylva",
        "position": "GK",
        "ovr": 68
      },
      {
        "name": "Ferdinand Coly",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Lamine Diatta",
        "position": "DEF",
        "ovr": 70
      },
      {
        "name": "Pape Malick Diop",
        "position": "DEF",
        "ovr": 71
      },
      {
        "name": "Omar Daf",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Aliou Cissé",
        "position": "MID",
        "ovr": 70
      },
      {
        "name": "Khalilou Fadiga",
        "position": "MID",
        "ovr": 71
      },
      {
        "name": "Papa Bouba Diop",
        "position": "MID",
        "ovr": 72
      },
      {
        "name": "El Hadji Diouf",
        "position": "FWD",
        "ovr": 70
      },
      {
        "name": "Henri Camara",
        "position": "FWD",
        "ovr": 71
      },
      {
        "name": "Salif Diao",
        "position": "FWD",
        "ovr": 72
      }
    ],
    "bench": [],
    "managerId": "manager_bruno_metsu",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "us_2002",
    "name": "Estados Unidos",
    "year": 2002,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#3C3B6E",
      "secondary": "#B22234"
    },
    "color": "#3C3B6E",
    "strength": 68,
    "ratings": {
      "attack": 69,
      "midfield": 70,
      "defense": 69,
      "gk": 71
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Brad Friedel",
        "position": "GK",
        "ovr": 70
      },
      {
        "name": "Tony Sanneh",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Eddie Pope",
        "position": "DEF",
        "ovr": 69
      },
      {
        "name": "Gregg Berhalter",
        "position": "DEF",
        "ovr": 70
      },
      {
        "name": "Frankie Hejduk",
        "position": "DEF",
        "ovr": 68
      },
      {
        "name": "Claudio Reyna",
        "position": "MID",
        "ovr": 69
      },
      {
        "name": "John O’Brien",
        "position": "MID",
        "ovr": 70
      },
      {
        "name": "Landon Donovan",
        "position": "MID",
        "ovr": 71
      },
      {
        "name": "Brian McBride",
        "position": "FWD",
        "ovr": 68
      },
      {
        "name": "Clint Mathis",
        "position": "FWD",
        "ovr": 69
      },
      {
        "name": "DaMarcus Beasley",
        "position": "FWD",
        "ovr": 70
      }
    ],
    "bench": [],
    "managerId": "manager_bruce_arena",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_1998",
    "name": "Francia",
    "year": 1998,
    "achievement": "Campeón",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 95,
    "ratings": {
      "attack": 96,
      "midfield": 99,
      "defense": 99,
      "gk": 97
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Fabien Barthez",
        "position": "GK",
        "ovr": 96
      },
      {
        "name": "Lilian Thuram",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Marcel Desailly",
        "position": "DEF",
        "ovr": 99
      },
      {
        "name": "Laurent Blanc",
        "position": "DEF",
        "ovr": 100
      },
      {
        "name": "Bixente Lizarazu",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Didier Deschamps",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Emmanuel Petit",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Zinedine Zidane",
        "position": "MID",
        "ovr": 100
      },
      {
        "name": "Youri Djorkaeff",
        "position": "FWD",
        "ovr": 95
      },
      {
        "name": "Thierry Henry",
        "position": "FWD",
        "ovr": 96
      },
      {
        "name": "Stéphane Guivarc’h",
        "position": "FWD",
        "ovr": 97
      }
    ],
    "bench": [],
    "managerId": "manager_aime_jacquet",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_1998",
    "name": "Brasil",
    "year": 1998,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 93,
    "ratings": {
      "attack": 97,
      "midfield": 95,
      "defense": 94,
      "gk": 94
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Cláudio Taffarel",
        "position": "GK",
        "ovr": 93
      },
      {
        "name": "Cafú",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Aldair",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Júnior Baiano",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Roberto Carlos",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Dunga",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "César Sampaio",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Rivaldo",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Ronaldo",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Bebeto",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Leonardo",
        "position": "FWD",
        "ovr": 98
      }
    ],
    "bench": [],
    "managerId": "manager_mario_zagallo",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "hr_1998",
    "name": "Croacia",
    "year": 1998,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#D71920",
      "secondary": "#FFFFFF"
    },
    "color": "#D71920",
    "strength": 84,
    "ratings": {
      "attack": 87,
      "midfield": 86,
      "defense": 85,
      "gk": 84
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Dražen Ladić",
        "position": "GK",
        "ovr": 83
      },
      {
        "name": "Igor Štimac",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Slaven Bilić",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Zvonimir Soldo",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Robert Jarni",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Zvonimir Boban",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Aljoša Asanović",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Robert Prosinečki",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Goran Vlaović",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Davor Šuker",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Mario Stanić",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_miroslav_blazevic",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "nl_1998",
    "name": "Países Bajos",
    "year": 1998,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#F36C21",
      "secondary": "#111111"
    },
    "color": "#F36C21",
    "strength": 91,
    "ratings": {
      "attack": 94,
      "midfield": 94,
      "defense": 93,
      "gk": 93
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Edwin van der Sar",
        "position": "GK",
        "ovr": 92
      },
      {
        "name": "Michael Reiziger",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Jaap Stam",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Frank de Boer",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Arthur Numan",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Edgar Davids",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Phillip Cocu",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Dennis Bergkamp",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Marc Overmars",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Patrick Kluivert",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Ronald de Boer",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_guus_hiddink",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "it_1998",
    "name": "Italia",
    "year": 1998,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#0066BC",
      "secondary": "#FFFFFF"
    },
    "color": "#0066BC",
    "strength": 87,
    "ratings": {
      "attack": 90,
      "midfield": 88,
      "defense": 91,
      "gk": 89
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Gianluca Pagliuca",
        "position": "GK",
        "ovr": 88
      },
      {
        "name": "Giuseppe Bergomi",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Fabio Cannavaro",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Alessandro Costacurta",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Paolo Maldini",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Demetrio Albertini",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Luigi Di Biagio",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Roberto Di Matteo",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Alessandro Del Piero",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Christian Vieri",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Roberto Baggio",
        "position": "FWD",
        "ovr": 91
      }
    ],
    "bench": [],
    "managerId": "manager_cesare_maldini",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_1998",
    "name": "Argentina",
    "year": 1998,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 86,
    "ratings": {
      "attack": 89,
      "midfield": 88,
      "defense": 88,
      "gk": 87
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Carlos Roa",
        "position": "GK",
        "ovr": 86
      },
      {
        "name": "Javier Zanetti",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Roberto Ayala",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Roberto Sensini",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "José Chamot",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Diego Simeone",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Juan Sebastián Verón",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Ariel Ortega",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Gabriel Batistuta",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "Claudio López",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Marcelo Gallardo",
        "position": "FWD",
        "ovr": 90
      }
    ],
    "bench": [],
    "managerId": "manager_daniel_passarella",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_1998",
    "name": "Alemania",
    "year": 1998,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 83,
    "ratings": {
      "attack": 85,
      "midfield": 84,
      "defense": 85,
      "gk": 84
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Andreas Köpke",
        "position": "GK",
        "ovr": 83
      },
      {
        "name": "Stefan Reuter",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Jürgen Kohler",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Lothar Matthäus",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Christian Ziege",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Dietmar Hamann",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Thomas Häßler",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Andreas Möller",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Jürgen Klinsmann",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Oliver Bierhoff",
        "position": "FWD",
        "ovr": 85
      },
      {
        "name": "Ulf Kirsten",
        "position": "FWD",
        "ovr": 86
      }
    ],
    "bench": [],
    "managerId": "manager_berti_vogts",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "dk_1998",
    "name": "Dinamarca",
    "year": 1998,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#C60C30",
      "secondary": "#FFFFFF"
    },
    "color": "#C60C30",
    "strength": 75,
    "ratings": {
      "attack": 77,
      "midfield": 77,
      "defense": 76,
      "gk": 79
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Peter Schmeichel",
        "position": "GK",
        "ovr": 78
      },
      {
        "name": "Thomas Helveg",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Marc Rieper",
        "position": "DEF",
        "ovr": 76
      },
      {
        "name": "Thomas Høgh",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "Jan Heintze",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Allan Nielsen",
        "position": "MID",
        "ovr": 76
      },
      {
        "name": "Morten Wieghorst",
        "position": "MID",
        "ovr": 77
      },
      {
        "name": "Michael Laudrup",
        "position": "MID",
        "ovr": 78
      },
      {
        "name": "Brian Laudrup",
        "position": "FWD",
        "ovr": 76
      },
      {
        "name": "Ebbe Sand",
        "position": "FWD",
        "ovr": 77
      },
      {
        "name": "Jon Dahl Tomasson",
        "position": "FWD",
        "ovr": 78
      }
    ],
    "bench": [],
    "managerId": "manager_bo_johansson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_1994",
    "name": "Brasil",
    "year": 1994,
    "achievement": "Campeón",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 94,
    "ratings": {
      "attack": 98,
      "midfield": 96,
      "defense": 97,
      "gk": 96
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Cláudio Taffarel",
        "position": "GK",
        "ovr": 95
      },
      {
        "name": "Jorginho",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Aldair",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Márcio Santos",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Branco",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Dunga",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Mauro Silva",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Raí",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Bebeto",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Romário",
        "position": "FWD",
        "ovr": 98
      },
      {
        "name": "Zinho",
        "position": "FWD",
        "ovr": 99
      }
    ],
    "bench": [],
    "managerId": "manager_carlos_alberto_parreira",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "it_1994",
    "name": "Italia",
    "year": 1994,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#0066BC",
      "secondary": "#FFFFFF"
    },
    "color": "#0066BC",
    "strength": 91,
    "ratings": {
      "attack": 94,
      "midfield": 93,
      "defense": 95,
      "gk": 92
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Gianluca Pagliuca",
        "position": "GK",
        "ovr": 91
      },
      {
        "name": "Roberto Mussi",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Franco Baresi",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Paolo Maldini",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Antonio Benarrivo",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Demetrio Albertini",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Dino Baggio",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Roberto Donadoni",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Roberto Baggio",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Daniele Massaro",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Giuseppe Signori",
        "position": "FWD",
        "ovr": 95
      }
    ],
    "bench": [],
    "managerId": "manager_arrigo_sacchi",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "se_1994",
    "name": "Suecia",
    "year": 1994,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#FFCD00",
      "secondary": "#006AA7"
    },
    "color": "#FFCD00",
    "strength": 80,
    "ratings": {
      "attack": 83,
      "midfield": 81,
      "defense": 81,
      "gk": 82
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Thomas Ravelli",
        "position": "GK",
        "ovr": 81
      },
      {
        "name": "Roland Nilsson",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Patrik Andersson",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Joachim Björklund",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Roger Ljung",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Stefan Schwarz",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Jonas Thern",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Klas Ingesson",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Tomas Brolin",
        "position": "FWD",
        "ovr": 82
      },
      {
        "name": "Kennet Andersson",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Martin Dahlin",
        "position": "FWD",
        "ovr": 84
      }
    ],
    "bench": [],
    "managerId": "manager_tommy_svensson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "bg_1994",
    "name": "Bulgaria",
    "year": 1994,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#00966E",
      "secondary": "#D62612"
    },
    "color": "#00966E",
    "strength": 78,
    "ratings": {
      "attack": 81,
      "midfield": 80,
      "defense": 78,
      "gk": 78
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Borislav Mihaylov",
        "position": "GK",
        "ovr": 77
      },
      {
        "name": "Emil Kremenliev",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "Trifon Ivanov",
        "position": "DEF",
        "ovr": 78
      },
      {
        "name": "Petar Hubchev",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Tsanko Tsvetanov",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "Krasimir Balakov",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Yordan Letchkov",
        "position": "MID",
        "ovr": 80
      },
      {
        "name": "Zlatko Yankov",
        "position": "MID",
        "ovr": 81
      },
      {
        "name": "Hristo Stoichkov",
        "position": "FWD",
        "ovr": 80
      },
      {
        "name": "Emil Kostadinov",
        "position": "FWD",
        "ovr": 81
      },
      {
        "name": "Nasko Sirakov",
        "position": "FWD",
        "ovr": 82
      }
    ],
    "bench": [],
    "managerId": "manager_dimitar_penev",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_1994",
    "name": "Alemania",
    "year": 1994,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 87,
    "ratings": {
      "attack": 90,
      "midfield": 89,
      "defense": 89,
      "gk": 88
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Bodo Illgner",
        "position": "GK",
        "ovr": 87
      },
      {
        "name": "Thomas Berthold",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Jürgen Kohler",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Lothar Matthäus",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Andreas Brehme",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Thomas Häßler",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Stefan Effenberg",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Andreas Möller",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Jürgen Klinsmann",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Rudi Völler",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Karl-Heinz Riedle",
        "position": "FWD",
        "ovr": 91
      }
    ],
    "bench": [],
    "managerId": "manager_berti_vogts",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "nl_1994",
    "name": "Países Bajos",
    "year": 1994,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F36C21",
      "secondary": "#111111"
    },
    "color": "#F36C21",
    "strength": 85,
    "ratings": {
      "attack": 88,
      "midfield": 87,
      "defense": 87,
      "gk": 85
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Ed de Goey",
        "position": "GK",
        "ovr": 84
      },
      {
        "name": "Ulrich van Gobbel",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Ronald Koeman",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Frank de Boer",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Danny Blind",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Frank Rijkaard",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Wim Jonk",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Richard Witschge",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Dennis Bergkamp",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Marc Overmars",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "Bryan Roy",
        "position": "FWD",
        "ovr": 89
      }
    ],
    "bench": [],
    "managerId": "manager_dick_advocaat",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ro_1994",
    "name": "Rumanía",
    "year": 1994,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FCD116",
      "secondary": "#002B7F"
    },
    "color": "#FCD116",
    "strength": 74,
    "ratings": {
      "attack": 77,
      "midfield": 77,
      "defense": 74,
      "gk": 74
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Florin Prunea",
        "position": "GK",
        "ovr": 73
      },
      {
        "name": "Dan Petrescu",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Daniel Prodan",
        "position": "DEF",
        "ovr": 74
      },
      {
        "name": "Miodrag Belodedici",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Tibor Selymes",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Ioan Lupescu",
        "position": "MID",
        "ovr": 76
      },
      {
        "name": "Gheorghe Popescu",
        "position": "MID",
        "ovr": 77
      },
      {
        "name": "Gheorghe Hagi",
        "position": "MID",
        "ovr": 78
      },
      {
        "name": "Marius Lăcătuș",
        "position": "FWD",
        "ovr": 76
      },
      {
        "name": "Florin Răducioiu",
        "position": "FWD",
        "ovr": 77
      },
      {
        "name": "Ilie Dumitrescu",
        "position": "FWD",
        "ovr": 78
      }
    ],
    "bench": [],
    "managerId": "manager_anghel_iordanescu",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "es_1994",
    "name": "España",
    "year": 1994,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#AA151B",
      "secondary": "#F1BF00"
    },
    "color": "#AA151B",
    "strength": 82,
    "ratings": {
      "attack": 83,
      "midfield": 85,
      "defense": 84,
      "gk": 83
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Andoni Zubizarreta",
        "position": "GK",
        "ovr": 82
      },
      {
        "name": "Albert Ferrer",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Abelardo Fernández",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Fernando Hierro",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Sergi Barjuán",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Pep Guardiola",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Luis Enrique",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Jon Andoni Goikoetxea",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "José Luis Caminero",
        "position": "FWD",
        "ovr": 82
      },
      {
        "name": "Julio Salinas",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Txiki Begiristain",
        "position": "FWD",
        "ovr": 84
      }
    ],
    "bench": [],
    "managerId": "manager_javier_clemente",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_1990",
    "name": "Alemania Occidental",
    "year": 1990,
    "achievement": "Campeón",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 95,
    "ratings": {
      "attack": 98,
      "midfield": 99,
      "defense": 98,
      "gk": 97
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Bodo Illgner",
        "position": "GK",
        "ovr": 96
      },
      {
        "name": "Thomas Berthold",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Klaus Augenthaler",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Jürgen Kohler",
        "position": "DEF",
        "ovr": 99
      },
      {
        "name": "Andreas Brehme",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "Lothar Matthäus",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Pierre Littbarski",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Thomas Häßler",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Jürgen Klinsmann",
        "position": "FWD",
        "ovr": 97
      },
      {
        "name": "Rudi Völler",
        "position": "FWD",
        "ovr": 98
      },
      {
        "name": "Uwe Bein",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_franz_beckenbauer",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_1990",
    "name": "Argentina",
    "year": 1990,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 88,
    "ratings": {
      "attack": 90,
      "midfield": 90,
      "defense": 91,
      "gk": 92
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Sergio Goycochea",
        "position": "GK",
        "ovr": 91
      },
      {
        "name": "José Basualdo",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Oscar Ruggeri",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Juan Simón",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Julio Olarticoechea",
        "position": "DEF",
        "ovr": 90
      },
      {
        "name": "Ricardo Giusti",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Jorge Burruchaga",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Pedro Troglio",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Diego Maradona",
        "position": "FWD",
        "ovr": 89
      },
      {
        "name": "Claudio Caniggia",
        "position": "FWD",
        "ovr": 90
      },
      {
        "name": "Gustavo Dezotti",
        "position": "FWD",
        "ovr": 91
      }
    ],
    "bench": [],
    "managerId": "manager_carlos_bilardo",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "it_1990",
    "name": "Italia",
    "year": 1990,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#0066BC",
      "secondary": "#FFFFFF"
    },
    "color": "#0066BC",
    "strength": 90,
    "ratings": {
      "attack": 93,
      "midfield": 92,
      "defense": 94,
      "gk": 94
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Walter Zenga",
        "position": "GK",
        "ovr": 93
      },
      {
        "name": "Giuseppe Bergomi",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Franco Baresi",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Riccardo Ferri",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Paolo Maldini",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Fernando De Napoli",
        "position": "MID",
        "ovr": 91
      },
      {
        "name": "Giuseppe Giannini",
        "position": "MID",
        "ovr": 92
      },
      {
        "name": "Roberto Donadoni",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Roberto Baggio",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Salvatore Schillaci",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Gianluca Vialli",
        "position": "FWD",
        "ovr": 94
      }
    ],
    "bench": [],
    "managerId": "manager_azeglio_vicini",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_1990",
    "name": "Inglaterra",
    "year": 1990,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 86,
    "ratings": {
      "attack": 88,
      "midfield": 89,
      "defense": 88,
      "gk": 87
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Peter Shilton",
        "position": "GK",
        "ovr": 86
      },
      {
        "name": "Gary Stevens",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Des Walker",
        "position": "DEF",
        "ovr": 88
      },
      {
        "name": "Terry Butcher",
        "position": "DEF",
        "ovr": 89
      },
      {
        "name": "Stuart Pearce",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "David Platt",
        "position": "MID",
        "ovr": 88
      },
      {
        "name": "Paul Gascoigne",
        "position": "MID",
        "ovr": 89
      },
      {
        "name": "Chris Waddle",
        "position": "MID",
        "ovr": 90
      },
      {
        "name": "Gary Lineker",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Peter Beardsley",
        "position": "FWD",
        "ovr": 88
      },
      {
        "name": "John Barnes",
        "position": "FWD",
        "ovr": 89
      }
    ],
    "bench": [],
    "managerId": "manager_bobby_robson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ie_1990",
    "name": "Irlanda",
    "year": 1990,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#169B62",
      "secondary": "#FF883E"
    },
    "color": "#169B62",
    "strength": 71,
    "ratings": {
      "attack": 71,
      "midfield": 73,
      "defense": 73,
      "gk": 73
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Packie Bonner",
        "position": "GK",
        "ovr": 72
      },
      {
        "name": "Chris Morris",
        "position": "DEF",
        "ovr": 72
      },
      {
        "name": "Mick McCarthy",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Kevin Moran",
        "position": "DEF",
        "ovr": 74
      },
      {
        "name": "Steve Staunton",
        "position": "DEF",
        "ovr": 72
      },
      {
        "name": "Ray Houghton",
        "position": "MID",
        "ovr": 72
      },
      {
        "name": "Andy Townsend",
        "position": "MID",
        "ovr": 73
      },
      {
        "name": "Paul McGrath",
        "position": "MID",
        "ovr": 74
      },
      {
        "name": "John Aldridge",
        "position": "FWD",
        "ovr": 70
      },
      {
        "name": "Niall Quinn",
        "position": "FWD",
        "ovr": 71
      },
      {
        "name": "Kevin Sheedy",
        "position": "FWD",
        "ovr": 72
      }
    ],
    "bench": [],
    "managerId": "manager_jack_charlton",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "yu_1990",
    "name": "Yugoslavia",
    "year": 1990,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#003DA5",
      "secondary": "#D22630"
    },
    "color": "#003DA5",
    "strength": 79,
    "ratings": {
      "attack": 81,
      "midfield": 83,
      "defense": 80,
      "gk": 80
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Tomislav Ivković",
        "position": "GK",
        "ovr": 79
      },
      {
        "name": "Faruk Hadžibegić",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Refik Šabanadžović",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Davor Jozić",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Vujadin Stanojković",
        "position": "DEF",
        "ovr": 79
      },
      {
        "name": "Dragan Stojković",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Safet Sušić",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Srečko Katanec",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Darko Pančev",
        "position": "FWD",
        "ovr": 80
      },
      {
        "name": "Dejan Savićević",
        "position": "FWD",
        "ovr": 81
      },
      {
        "name": "Robert Prosinečki",
        "position": "FWD",
        "ovr": 82
      }
    ],
    "bench": [],
    "managerId": null,
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "cs_1990",
    "name": "Checoslovaquia",
    "year": 1990,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#D7141A",
      "secondary": "#11457E"
    },
    "color": "#D7141A",
    "strength": 76,
    "ratings": {
      "attack": 78,
      "midfield": 78,
      "defense": 77,
      "gk": 77
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Jan Stejskal",
        "position": "GK",
        "ovr": 76
      },
      {
        "name": "Miroslav Kadlec",
        "position": "DEF",
        "ovr": 76
      },
      {
        "name": "Ján Kocian",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "František Straka",
        "position": "DEF",
        "ovr": 78
      },
      {
        "name": "Michal Bílek",
        "position": "DEF",
        "ovr": 76
      },
      {
        "name": "Ivan Hašek",
        "position": "MID",
        "ovr": 77
      },
      {
        "name": "Lubomír Kubík",
        "position": "MID",
        "ovr": 78
      },
      {
        "name": "Jozef Chovanec",
        "position": "MID",
        "ovr": 79
      },
      {
        "name": "Tomáš Skuhravý",
        "position": "FWD",
        "ovr": 77
      },
      {
        "name": "Ivo Knoflíček",
        "position": "FWD",
        "ovr": 78
      },
      {
        "name": "Ľubomír Moravčík",
        "position": "FWD",
        "ovr": 79
      }
    ],
    "bench": [],
    "managerId": null,
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "cm_1990",
    "name": "Camerún",
    "year": 1990,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#007A5E",
      "secondary": "#CE1126"
    },
    "color": "#007A5E",
    "strength": 73,
    "ratings": {
      "attack": 76,
      "midfield": 74,
      "defense": 74,
      "gk": 76
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Thomas N’Kono",
        "position": "GK",
        "ovr": 75
      },
      {
        "name": "Stephen Tataw",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Emmanuel Kundé",
        "position": "DEF",
        "ovr": 74
      },
      {
        "name": "Benjamin Massing",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Bertin Ebwelle",
        "position": "DEF",
        "ovr": 73
      },
      {
        "name": "Émile Mbouh",
        "position": "MID",
        "ovr": 73
      },
      {
        "name": "Cyrille Makanaky",
        "position": "MID",
        "ovr": 74
      },
      {
        "name": "Louis-Paul Mfédé",
        "position": "MID",
        "ovr": 75
      },
      {
        "name": "Roger Milla",
        "position": "FWD",
        "ovr": 75
      },
      {
        "name": "François Omam-Biyik",
        "position": "FWD",
        "ovr": 76
      },
      {
        "name": "André Kana-Biyik",
        "position": "FWD",
        "ovr": 77
      }
    ],
    "bench": [],
    "managerId": "manager_valeri_nepomnyashchy",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "ar_1986",
    "name": "Argentina",
    "year": 1986,
    "achievement": "Campeón",
    "colors": {
      "primary": "#75AADB",
      "secondary": "#FFFFFF"
    },
    "color": "#75AADB",
    "strength": 95,
    "ratings": {
      "attack": 99,
      "midfield": 99,
      "defense": 97,
      "gk": 96
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Nery Pumpido",
        "position": "GK",
        "ovr": 95
      },
      {
        "name": "José Luis Brown",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Oscar Ruggeri",
        "position": "DEF",
        "ovr": 97
      },
      {
        "name": "José Cuciuffo",
        "position": "DEF",
        "ovr": 98
      },
      {
        "name": "Julio Olarticoechea",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Sergio Batista",
        "position": "MID",
        "ovr": 98
      },
      {
        "name": "Jorge Burruchaga",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Héctor Enrique",
        "position": "MID",
        "ovr": 99
      },
      {
        "name": "Diego Maradona",
        "position": "FWD",
        "ovr": 98
      },
      {
        "name": "Jorge Valdano",
        "position": "FWD",
        "ovr": 99
      },
      {
        "name": "Pedro Pasculli",
        "position": "FWD",
        "ovr": 99
      }
    ],
    "bench": [],
    "managerId": "manager_carlos_bilardo",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "de_1986",
    "name": "Alemania Occidental",
    "year": 1986,
    "achievement": "Subcampeón",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#111111"
    },
    "color": "#FFFFFF",
    "strength": 92,
    "ratings": {
      "attack": 95,
      "midfield": 94,
      "defense": 95,
      "gk": 95
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Harald Schumacher",
        "position": "GK",
        "ovr": 94
      },
      {
        "name": "Thomas Berthold",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Karlheinz Förster",
        "position": "DEF",
        "ovr": 95
      },
      {
        "name": "Ditmar Jakobs",
        "position": "DEF",
        "ovr": 96
      },
      {
        "name": "Andreas Brehme",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Lothar Matthäus",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Felix Magath",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Norbert Eder",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Karl-Heinz Rummenigge",
        "position": "FWD",
        "ovr": 94
      },
      {
        "name": "Rudi Völler",
        "position": "FWD",
        "ovr": 95
      },
      {
        "name": "Klaus Allofs",
        "position": "FWD",
        "ovr": 96
      }
    ],
    "bench": [],
    "managerId": "manager_franz_beckenbauer",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "fr_1986",
    "name": "Francia",
    "year": 1986,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#1D3E8A",
      "secondary": "#E31B23"
    },
    "color": "#1D3E8A",
    "strength": 91,
    "ratings": {
      "attack": 93,
      "midfield": 96,
      "defense": 93,
      "gk": 92
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Joël Bats",
        "position": "GK",
        "ovr": 91
      },
      {
        "name": "Manuel Amoros",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Patrick Battiston",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Maxime Bossis",
        "position": "DEF",
        "ovr": 94
      },
      {
        "name": "Thierry Tusseau",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Jean Tigana",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Luis Fernández",
        "position": "MID",
        "ovr": 96
      },
      {
        "name": "Alain Giresse",
        "position": "MID",
        "ovr": 97
      },
      {
        "name": "Michel Platini",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Dominique Rocheteau",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Yannick Stopyra",
        "position": "FWD",
        "ovr": 94
      }
    ],
    "bench": [],
    "managerId": "manager_henri_michel",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "be_1986",
    "name": "Bélgica",
    "year": 1986,
    "achievement": "Semifinal",
    "colors": {
      "primary": "#EF3340",
      "secondary": "#FBDD40"
    },
    "color": "#EF3340",
    "strength": 80,
    "ratings": {
      "attack": 81,
      "midfield": 83,
      "defense": 81,
      "gk": 83
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Jean-Marie Pfaff",
        "position": "GK",
        "ovr": 82
      },
      {
        "name": "Eric Gerets",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Michel Renquin",
        "position": "DEF",
        "ovr": 81
      },
      {
        "name": "Stéphane Demol",
        "position": "DEF",
        "ovr": 82
      },
      {
        "name": "Georges Grün",
        "position": "DEF",
        "ovr": 80
      },
      {
        "name": "Enzo Scifo",
        "position": "MID",
        "ovr": 82
      },
      {
        "name": "Jan Ceulemans",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Franky Vercauteren",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Nico Claesen",
        "position": "FWD",
        "ovr": 80
      },
      {
        "name": "Erwin Vandenbergh",
        "position": "FWD",
        "ovr": 81
      },
      {
        "name": "Marc Degryse",
        "position": "FWD",
        "ovr": 82
      }
    ],
    "bench": [],
    "managerId": "manager_guy_thys",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "br_1986",
    "name": "Brasil",
    "year": 1986,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#F7D117",
      "secondary": "#1E6FBF"
    },
    "color": "#F7D117",
    "strength": 90,
    "ratings": {
      "attack": 93,
      "midfield": 94,
      "defense": 92,
      "gk": 90
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Carlos Gallo",
        "position": "GK",
        "ovr": 89
      },
      {
        "name": "Leandro",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Edinho",
        "position": "DEF",
        "ovr": 92
      },
      {
        "name": "Júlio César",
        "position": "DEF",
        "ovr": 93
      },
      {
        "name": "Branco",
        "position": "DEF",
        "ovr": 91
      },
      {
        "name": "Alemão",
        "position": "MID",
        "ovr": 93
      },
      {
        "name": "Sócrates",
        "position": "MID",
        "ovr": 94
      },
      {
        "name": "Júnior",
        "position": "MID",
        "ovr": 95
      },
      {
        "name": "Careca",
        "position": "FWD",
        "ovr": 92
      },
      {
        "name": "Zico",
        "position": "FWD",
        "ovr": 93
      },
      {
        "name": "Casagrande",
        "position": "FWD",
        "ovr": 94
      }
    ],
    "bench": [],
    "managerId": "manager_tele_santana",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "gb_1986",
    "name": "Inglaterra",
    "year": 1986,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#CE1124"
    },
    "color": "#FFFFFF",
    "strength": 84,
    "ratings": {
      "attack": 87,
      "midfield": 86,
      "defense": 86,
      "gk": 85
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Peter Shilton",
        "position": "GK",
        "ovr": 84
      },
      {
        "name": "Gary Stevens",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Terry Fenwick",
        "position": "DEF",
        "ovr": 86
      },
      {
        "name": "Terry Butcher",
        "position": "DEF",
        "ovr": 87
      },
      {
        "name": "Kenny Sansom",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "Glenn Hoddle",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Peter Reid",
        "position": "MID",
        "ovr": 86
      },
      {
        "name": "Bryan Robson",
        "position": "MID",
        "ovr": 87
      },
      {
        "name": "Gary Lineker",
        "position": "FWD",
        "ovr": 86
      },
      {
        "name": "Peter Beardsley",
        "position": "FWD",
        "ovr": 87
      },
      {
        "name": "Chris Waddle",
        "position": "FWD",
        "ovr": 88
      }
    ],
    "bench": [],
    "managerId": "manager_bobby_robson",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "es_1986",
    "name": "España",
    "year": 1986,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#AA151B",
      "secondary": "#F1BF00"
    },
    "color": "#AA151B",
    "strength": 82,
    "ratings": {
      "attack": 84,
      "midfield": 84,
      "defense": 84,
      "gk": 83
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Andoni Zubizarreta",
        "position": "GK",
        "ovr": 82
      },
      {
        "name": "Tomás Reñones",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Andoni Goikoetxea",
        "position": "DEF",
        "ovr": 84
      },
      {
        "name": "Antonio Maceda",
        "position": "DEF",
        "ovr": 85
      },
      {
        "name": "José Antonio Camacho",
        "position": "DEF",
        "ovr": 83
      },
      {
        "name": "Víctor Muñoz",
        "position": "MID",
        "ovr": 83
      },
      {
        "name": "Míchel González",
        "position": "MID",
        "ovr": 84
      },
      {
        "name": "Francisco López",
        "position": "MID",
        "ovr": 85
      },
      {
        "name": "Emilio Butragueño",
        "position": "FWD",
        "ovr": 83
      },
      {
        "name": "Julio Salinas",
        "position": "FWD",
        "ovr": 84
      },
      {
        "name": "Eloy Olaya",
        "position": "FWD",
        "ovr": 85
      }
    ],
    "bench": [],
    "managerId": "manager_miguel_munoz",
    "stage": "quarterfinal-or-better"
  },
  {
    "id": "mx_1986",
    "name": "México",
    "year": 1986,
    "achievement": "Cuartos de final",
    "colors": {
      "primary": "#006847",
      "secondary": "#CE1126"
    },
    "color": "#006847",
    "strength": 75,
    "ratings": {
      "attack": 77,
      "midfield": 77,
      "defense": 76,
      "gk": 77
    },
    "formation": "4-3-3",
    "lineup": [
      {
        "name": "Pablo Larios",
        "position": "GK",
        "ovr": 76
      },
      {
        "name": "Carlos Muñoz",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Fernando Quirarte",
        "position": "DEF",
        "ovr": 76
      },
      {
        "name": "Rafael Amador",
        "position": "DEF",
        "ovr": 77
      },
      {
        "name": "Raúl Servín",
        "position": "DEF",
        "ovr": 75
      },
      {
        "name": "Manuel Negrete",
        "position": "MID",
        "ovr": 76
      },
      {
        "name": "Tomás Boy",
        "position": "MID",
        "ovr": 77
      },
      {
        "name": "Javier Aguirre",
        "position": "MID",
        "ovr": 78
      },
      {
        "name": "Hugo Sánchez",
        "position": "FWD",
        "ovr": 76
      },
      {
        "name": "Luis Flores",
        "position": "FWD",
        "ovr": 77
      },
      {
        "name": "Carlos Hermosillo",
        "position": "FWD",
        "ovr": 78
      }
    ],
    "bench": [],
    "managerId": "manager_bora_milutinovic",
    "stage": "quarterfinal-or-better"
  }
];

function deepClone(opponent, level, boost = 0) {
  return {
    ...opponent,
    level,
    strength: clamp(opponent.strength + boost),
    ratings: Object.fromEntries(Object.entries(opponent.ratings).map(([k, v]) => [k, clamp(v + boost)])),
    colors: { ...opponent.colors },
    lineup: opponent.lineup.map((p) => ({ ...p, ovr: clamp(p.ovr + boost) })),
    bench: (opponent.bench || []).map((p) => ({ ...p })),
    // DT de esta edición resuelto desde su managerId (o null). Lookup determinista
    // (no consume RNG), así que no altera la reproducibilidad del sorteo.
    manager: managerById(opponent.managerId),
  };
}

const OPPONENT_BY_ID = new Map(OPPONENTS.map((o) => [o.id, o]));
const MAX_STRENGTH = Math.max(...OPPONENTS.map((o) => o.strength));
const ELITE_ROTATION_FLOOR = MAX_STRENGTH - CONFIG.OPP_MATCH_WINDOW;

function lastKnownOpponent(usedIds = []) {
  for (let i = usedIds.length - 1; i >= 0; i--) {
    const opponent = OPPONENT_BY_ID.get(usedIds[i]);
    if (opponent) return opponent;
  }
  return null;
}

function weightedByTarget(candidates, target, rng) {
  const nearestDistance = Math.min(...candidates.map((o) => Math.abs(o.strength - target)));
  const weights = candidates.map((opponent) => {
    const relativeDistance = Math.abs(opponent.strength - target) - nearestDistance;
    const closeness = Math.max(1, CONFIG.OPP_MATCH_WINDOW + 1 - relativeDistance);
    return { value: opponent, weight: closeness * closeness };
  });
  return rng.weighted(weights);
}

function similarStrengthCandidates(pool, target) {
  const inWindow = pool.filter((o) => Math.abs(o.strength - target) <= CONFIG.OPP_MATCH_WINDOW);
  if (inWindow.length) return inWindow;

  const nearestDistance = Math.min(...pool.map((o) => Math.abs(o.strength - target)));
  const rotationMargin = Math.max(1, Math.min(2, CONFIG.OPP_MATCH_WINDOW));
  return pool.filter((o) => Math.abs(o.strength - target) <= nearestDistance + rotationMargin);
}

function eliteRotationPool(lastOpponent) {
  const elite = OPPONENTS.filter((o) => o.strength >= ELITE_ROTATION_FLOOR);
  const withoutImmediateRepeat = elite.filter((o) => o.id !== lastOpponent?.id);
  return withoutImmediateRepeat.length ? withoutImmediateRepeat : elite;
}

// Selecciona un rival de fuerza similar al objetivo, ponderado por cercanía
// para que haya rotación sin romper la curva ascendente de la torre.
export function generateOpponent(level, rng, usedIds = []) {
  const used = new Set(usedIds);
  const lastOpponent = lastKnownOpponent(usedIds);
  const target = targetStrength(level);
  let available = CONFIG.NO_REPEAT_RIVALS ? OPPONENTS.filter((o) => !used.has(o.id)) : OPPONENTS;
  if (!CONFIG.NO_REPEAT_RIVALS && lastOpponent && available.length > 1) {
    available = available.filter((o) => o.id !== lastOpponent.id);
  }

  const ascendingFloor = lastOpponent ? lastOpponent.strength : target - CONFIG.OPP_MATCH_WINDOW;
  let progressionPool = available.filter((o) => o.strength >= ascendingFloor);
  if (!progressionPool.length) {
    progressionPool = target >= MAX_STRENGTH ? eliteRotationPool(lastOpponent) : available;
  }
  if (!progressionPool.length) progressionPool = eliteRotationPool(lastOpponent);

  const candidates = similarStrengthCandidates(progressionPool, target);
  const picked = weightedByTarget(candidates, target, rng);
  let boost = target > MAX_STRENGTH ? Math.max(0, Math.round(target - picked.strength)) : 0;
  // Niveles planos de arranque (1..OPP_FLAT_LEVELS): si el pool no tiene rivales
  // tan blandos como el objetivo, el elegido se debilita hasta él. Así la
  // dificultad temprana sigue la curva aunque el catálogo tenga un piso (~64).
  if (level <= CONFIG.OPP_FLAT_LEVELS && picked.strength > target) {
    boost = Math.round(target - picked.strength);
  }
  return deepClone(picked, level, boost);
}
