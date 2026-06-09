// Torre de Leyendas — Base directa de jugadores.
// Este archivo es la fuente de verdad del roster jugable. El panel admin lo
// reescribe directamente cuando se guardan estadisticas o metadatos.
// Retratos: assets/player-portraits/{id}.png.

export const PLAYERS = [
  {
    "id": "gk_yashin_1966",
    "name": "Lev Yashin",
    "nation": "URSS",
    "era": "1960",
    "position": "GK",
    "rarity": "legend",
    "ovr": 92,
    "stats": null,
    "gk": {
      "reflexes": 93,
      "handling": 90,
      "positioning": 94
    },
    "trait": "Paradón",
    "tacticalType": null
  },
  {
    "id": "gk_banks_1970",
    "name": "Gordon Banks",
    "nation": "Inglaterra",
    "era": "1970",
    "position": "GK",
    "rarity": "epic",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 86,
      "positioning": 88
    },
    "trait": "Paradón",
    "tacticalType": null
  },
  {
    "id": "gk_zoff_1982",
    "name": "Dino Zoff",
    "nation": "Italia",
    "era": "1982",
    "position": "GK",
    "rarity": "epic",
    "ovr": 89,
    "stats": null,
    "gk": {
      "reflexes": 87,
      "handling": 89,
      "positioning": 90
    },
    "trait": "Muro",
    "tacticalType": null
  },
  {
    "id": "gk_buffon_2006",
    "name": "Gianluigi Buffon",
    "nation": "Italia",
    "era": "2006",
    "position": "GK",
    "rarity": "legend",
    "ovr": 90,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 88,
      "positioning": 91
    },
    "trait": "Paradón",
    "tacticalType": null
  },
  {
    "id": "gk_kahn_2002",
    "name": "Oliver Kahn",
    "nation": "Alemania",
    "era": "2002",
    "position": "GK",
    "rarity": "legend",
    "ovr": 97,
    "stats": null,
    "gk": {
      "reflexes": 99,
      "handling": 99,
      "positioning": 92
    },
    "trait": "Muro",
    "tacticalType": null
  },
  {
    "id": "gk_casillas_2010",
    "name": "Iker Casillas",
    "nation": "España",
    "era": "2010",
    "position": "GK",
    "rarity": "legend",
    "ovr": 94,
    "stats": null,
    "gk": {
      "reflexes": 94,
      "handling": 94,
      "positioning": 93
    },
    "trait": "Paradón",
    "tacticalType": null
  },
  {
    "id": "gk_neuer_2014",
    "name": "Manuel Neuer",
    "nation": "Alemania",
    "era": "2014",
    "position": "GK",
    "rarity": "legend",
    "ovr": 90,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 88,
      "positioning": 92
    },
    "trait": "Líbero",
    "tacticalType": null
  },
  {
    "id": "gk_taffarel_1994",
    "name": "Cláudio Taffarel",
    "nation": "Brasil",
    "era": "1994",
    "position": "GK",
    "rarity": "rare",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 83,
      "handling": 80,
      "positioning": 82
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gk_schmeichel_1992",
    "name": "Peter Schmeichel",
    "nation": "Dinamarca",
    "era": "1992",
    "position": "GK",
    "rarity": "legend",
    "ovr": 91,
    "stats": null,
    "gk": {
      "reflexes": 90,
      "handling": 92,
      "positioning": 91
    },
    "trait": "Muro",
    "tacticalType": null
  },
  {
    "id": "gk_higuita_1990",
    "name": "René Higuita",
    "nation": "Colombia",
    "era": "1990",
    "position": "GK",
    "rarity": "epic",
    "ovr": 83,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 76,
      "positioning": 83
    },
    "trait": "Líbero",
    "tacticalType": null
  },
  {
    "id": "def_beckenbauer_1974",
    "name": "Franz Beckenbauer",
    "nation": "Alemania",
    "era": "1974",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 95,
      "shooting": 70,
      "passing": 90,
      "dribbling": 85,
      "defending": 99,
      "physical": 91
    },
    "gk": null,
    "trait": "Líbero",
    "tacticalType": "posesion"
  },
  {
    "id": "def_maldini_1994",
    "name": "Paolo Maldini",
    "nation": "Italia",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 82,
      "shooting": 60,
      "passing": 80,
      "dribbling": 78,
      "defending": 99,
      "physical": 98
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_baresi_1990",
    "name": "Franco Baresi",
    "nation": "Italia",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 55,
      "passing": 82,
      "dribbling": 82,
      "defending": 99,
      "physical": 95
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_cannavaro_2006",
    "name": "Fabio Cannavaro",
    "nation": "Italia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 48,
      "passing": 74,
      "dribbling": 70,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_carlos_2002",
    "name": "Roberto Carlos",
    "nation": "Brasil",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 90,
      "dribbling": 99,
      "defending": 90,
      "physical": 99
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "contra"
  },
  {
    "id": "def_cafu_2002",
    "name": "Cafú",
    "nation": "Brasil",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 99,
      "shooting": 70,
      "passing": 99,
      "dribbling": 99,
      "defending": 90,
      "physical": 99
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "contra"
  },
  {
    "id": "def_passarella_1978",
    "name": "Daniel Passarella",
    "nation": "Argentina",
    "era": "1978",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 96,
      "shooting": 82,
      "passing": 82,
      "dribbling": 77,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "def_ayala_1998",
    "name": "Roberto Ayala",
    "nation": "Argentina",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 83,
    "stats": {
      "pace": 82,
      "shooting": 50,
      "passing": 70,
      "dribbling": 66,
      "defending": 90,
      "physical": 84
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_moore_1966",
    "name": "Bobby Moore",
    "nation": "Inglaterra",
    "era": "1966",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 82,
    "stats": {
      "pace": 72,
      "shooting": 58,
      "passing": 80,
      "dribbling": 70,
      "defending": 90,
      "physical": 80
    },
    "gk": null,
    "trait": "Líbero",
    "tacticalType": "posesion"
  },
  {
    "id": "def_sergio_ramos_2010",
    "name": "Sergio Ramos",
    "nation": "España",
    "era": "2010",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 70,
      "passing": 78,
      "dribbling": 74,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "posesion"
  },
  {
    "id": "def_puyol_2010",
    "name": "Carles Puyol",
    "nation": "España",
    "era": "2010",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 52,
      "passing": 72,
      "dribbling": 64,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_thuram_1998",
    "name": "Lilian Thuram",
    "nation": "Francia",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 50,
      "passing": 72,
      "dribbling": 70,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": "presion"
  },
  {
    "id": "def_lahm_2014",
    "name": "Philipp Lahm",
    "nation": "Alemania",
    "era": "2014",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 84,
      "shooting": 58,
      "passing": 84,
      "dribbling": 80,
      "defending": 82,
      "physical": 72
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "posesion"
  },
  {
    "id": "def_nesta_2006",
    "name": "Alessandro Nesta",
    "nation": "Italia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 48,
      "passing": 74,
      "dribbling": 70,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Muro",
    "tacticalType": "presion"
  },
  {
    "id": "def_krol_1974",
    "name": "Ruud Krol",
    "nation": "Países Bajos",
    "era": "1974",
    "position": "DEF",
    "rarity": "common",
    "ovr": 79,
    "stats": {
      "pace": 78,
      "shooting": 56,
      "passing": 78,
      "dribbling": 72,
      "defending": 82,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "def_koeman_1988",
    "name": "Ronald Koeman",
    "nation": "Países Bajos",
    "era": "1988",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 68,
      "shooting": 84,
      "passing": 84,
      "dribbling": 72,
      "defending": 88,
      "physical": 78
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "posesion"
  },
  {
    "id": "def_marquez_2006",
    "name": "Rafael Márquez",
    "nation": "México",
    "era": "2006",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 81,
      "dribbling": 70,
      "defending": 89,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "mid_zidane_1998",
    "name": "Zinedine Zidane",
    "nation": "Francia",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 72,
      "physical": 99
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_platini_1984",
    "name": "Michel Platini",
    "nation": "Francia",
    "era": "1984",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 70,
      "physical": 99
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_iniesta_2010",
    "name": "Andrés Iniesta",
    "nation": "España",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 93,
      "shooting": 90,
      "passing": 99,
      "dribbling": 99,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_xavi_2010",
    "name": "Xavi Hernández",
    "nation": "España",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 86,
      "passing": 99,
      "dribbling": 92,
      "defending": 81,
      "physical": 79
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_pirlo_2006",
    "name": "Andrea Pirlo",
    "nation": "Italia",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 99,
      "dribbling": 90,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_gerrard_2006",
    "name": "Steven Gerrard",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 90,
      "dribbling": 85,
      "defending": 85,
      "physical": 90
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "presion"
  },
  {
    "id": "mid_matthaus_1990",
    "name": "Lothar Matthäus",
    "nation": "Alemania",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 95,
      "shooting": 95,
      "passing": 95,
      "dribbling": 90,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "presion"
  },
  {
    "id": "mid_socrates_1982",
    "name": "Sócrates",
    "nation": "Brasil",
    "era": "1982",
    "position": "MID",
    "rarity": "epic",
    "ovr": 92,
    "stats": {
      "pace": 95,
      "shooting": 95,
      "passing": 95,
      "dribbling": 95,
      "defending": 80,
      "physical": 90
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_zico_1982",
    "name": "Zico",
    "nation": "Brasil",
    "era": "1982",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 97,
      "shooting": 96,
      "passing": 94,
      "dribbling": 95,
      "defending": 66,
      "physical": 90
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_rivelino_1970",
    "name": "Rivelino",
    "nation": "Brasil",
    "era": "1970",
    "position": "MID",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 74,
      "shooting": 86,
      "passing": 84,
      "dribbling": 88,
      "defending": 54,
      "physical": 74
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_redondo_1998",
    "name": "Fernando Redondo",
    "nation": "Argentina",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 75,
      "passing": 95,
      "dribbling": 96,
      "defending": 80,
      "physical": 84
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_keane_2002",
    "name": "Roy Keane",
    "nation": "Irlanda",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 74,
      "shooting": 76,
      "passing": 80,
      "dribbling": 74,
      "defending": 84,
      "physical": 88
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "presion"
  },
  {
    "id": "mid_vieira_1998",
    "name": "Patrick Vieira",
    "nation": "Francia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 99,
      "shooting": 76,
      "passing": 90,
      "dribbling": 80,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "presion"
  },
  {
    "id": "mid_seedorf_1998",
    "name": "Clarence Seedorf",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 90,
      "passing": 90,
      "dribbling": 90,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "mid_rijkaard_1988",
    "name": "Frank Rijkaard",
    "nation": "Países Bajos",
    "era": "1988",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 90,
      "dribbling": 89,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": "Motor",
    "tacticalType": "presion"
  },
  {
    "id": "mid_modric_2018",
    "name": "Luka Modrić",
    "nation": "Croacia",
    "era": "2018",
    "position": "MID",
    "rarity": "epic",
    "ovr": 81,
    "stats": {
      "pace": 76,
      "shooting": 78,
      "passing": 90,
      "dribbling": 88,
      "defending": 72,
      "physical": 66
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_kroos_2014",
    "name": "Toni Kroos",
    "nation": "Alemania",
    "era": "2014",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 64,
      "shooting": 80,
      "passing": 92,
      "dribbling": 80,
      "defending": 70,
      "physical": 72
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_valderrama_1994",
    "name": "Carlos Valderrama",
    "nation": "Colombia",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 60,
      "shooting": 70,
      "passing": 92,
      "dribbling": 86,
      "defending": 56,
      "physical": 70
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "mid_hagi_1994",
    "name": "Gheorghe Hagi",
    "nation": "Rumanía",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 86,
      "passing": 88,
      "dribbling": 90,
      "defending": 50,
      "physical": 70
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_pele_1970",
    "name": "Pelé",
    "nation": "Brasil",
    "era": "1970",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 97,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 48,
      "physical": 91
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_maradona_1986",
    "name": "Diego Maradona",
    "nation": "Argentina",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 98,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 70,
      "physical": 90
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_ronaldo_2002",
    "name": "Ronaldo Nazário",
    "nation": "Brasil",
    "era": "2002",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 78,
      "dribbling": 99,
      "defending": 50,
      "physical": 85
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_ronaldinho_2006",
    "name": "Ronaldinho",
    "nation": "Brasil",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 32,
      "physical": 81
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_romario_1994",
    "name": "Romário",
    "nation": "Brasil",
    "era": "1994",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 95,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 85,
      "dribbling": 99,
      "defending": 55,
      "physical": 90
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_vanbasten_1988",
    "name": "Marco van Basten",
    "nation": "Países Bajos",
    "era": "1988",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 84,
      "shooting": 99,
      "passing": 80,
      "dribbling": 88,
      "defending": 60,
      "physical": 99
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_cruyff_1974",
    "name": "Johan Cruyff",
    "nation": "Países Bajos",
    "era": "1974",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 90,
      "passing": 90,
      "dribbling": 99,
      "defending": 50,
      "physical": 90
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_muller_1974",
    "name": "Gerd Müller",
    "nation": "Alemania",
    "era": "1974",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 78,
      "shooting": 94,
      "passing": 70,
      "dribbling": 80,
      "defending": 30,
      "physical": 80
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_klinsmann_1990",
    "name": "Jürgen Klinsmann",
    "nation": "Alemania",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 72,
      "dribbling": 80,
      "defending": 34,
      "physical": 82
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_batistuta_1998",
    "name": "Gabriel Batistuta",
    "nation": "Argentina",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 70,
      "dribbling": 80,
      "defending": 30,
      "physical": 99
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_kempes_1978",
    "name": "Mario Kempes",
    "nation": "Argentina",
    "era": "1978",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 96,
      "shooting": 96,
      "passing": 74,
      "dribbling": 84,
      "defending": 36,
      "physical": 96
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_lineker_1986",
    "name": "Gary Lineker",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 86,
      "shooting": 88,
      "passing": 70,
      "dribbling": 78,
      "defending": 28,
      "physical": 74
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_shearer_1996",
    "name": "Alan Shearer",
    "nation": "Inglaterra",
    "era": "1996",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 90,
      "passing": 72,
      "dribbling": 76,
      "defending": 34,
      "physical": 88
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_henry_2006",
    "name": "Thierry Henry",
    "nation": "Francia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 90,
      "dribbling": 99,
      "defending": 50,
      "physical": 90
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_baggio_1994",
    "name": "Roberto Baggio",
    "nation": "Italia",
    "era": "1994",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 82,
      "shooting": 99,
      "passing": 84,
      "dribbling": 97,
      "defending": 30,
      "physical": 70
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_baggio_dino_1990",
    "name": "Salvatore Schillaci",
    "nation": "Italia",
    "era": "1990",
    "position": "FWD",
    "rarity": "common",
    "ovr": 78,
    "stats": {
      "pace": 80,
      "shooting": 84,
      "passing": 66,
      "dribbling": 76,
      "defending": 30,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "fwd_suker_1998",
    "name": "Davor Šuker",
    "nation": "Croacia",
    "era": "1998",
    "position": "FWD",
    "rarity": "common",
    "ovr": 80,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 72,
      "dribbling": 80,
      "defending": 28,
      "physical": 72
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_stoichkov_1994",
    "name": "Hristo Stoichkov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 80,
      "dribbling": 90,
      "defending": 50,
      "physical": 90
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_eusebio_1966",
    "name": "Eusébio",
    "nation": "Portugal",
    "era": "1966",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 92,
      "shooting": 92,
      "passing": 78,
      "dribbling": 90,
      "defending": 30,
      "physical": 82
    },
    "gk": null,
    "trait": "Cañón",
    "tacticalType": "contra"
  },
  {
    "id": "fwd_figo_2006",
    "name": "Luís Figo",
    "nation": "Portugal",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 96,
      "dribbling": 96,
      "defending": 40,
      "physical": 90
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_garrincha_1962",
    "name": "Garrincha",
    "nation": "Brasil",
    "era": "1962",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 93,
      "passing": 87,
      "dribbling": 99,
      "defending": 28,
      "physical": 81
    },
    "gk": null,
    "trait": "Maestro",
    "tacticalType": "posesion"
  },
  {
    "id": "fwd_milla_1990",
    "name": "Roger Milla",
    "nation": "Camerún",
    "era": "1990",
    "position": "FWD",
    "rarity": "common",
    "ovr": 78,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 70,
      "dribbling": 80,
      "defending": 30,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "fwd_weah_1998",
    "name": "George Weah",
    "nation": "Liberia",
    "era": "1998",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 86,
    "stats": {
      "pace": 90,
      "shooting": 87,
      "passing": 76,
      "dribbling": 88,
      "defending": 34,
      "physical": 86
    },
    "gk": null,
    "trait": "Francotirador",
    "tacticalType": "contra"
  },
  {
    "id": "base_gk_romero",
    "name": "Franco Armani",
    "nation": "Argentina",
    "era": "Actual",
    "position": "GK",
    "rarity": "epic",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 85,
      "handling": 85,
      "positioning": 75
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "base_gk_costa",
    "name": "Tiago Costa",
    "nation": "Portugal",
    "era": "Actual",
    "position": "GK",
    "rarity": "common",
    "ovr": 61,
    "stats": null,
    "gk": {
      "reflexes": 63,
      "handling": 60,
      "positioning": 60
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "base_def_vidal",
    "name": "Esequiel Barco",
    "nation": "Argentina",
    "era": "Actual",
    "position": "FWD",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 80,
      "shooting": 70,
      "passing": 70,
      "dribbling": 81,
      "defending": 29,
      "physical": 45
    },
    "gk": null,
    "trait": null,
    "tacticalType": "presion"
  },
  {
    "id": "base_def_silva",
    "name": "Bruno Silva",
    "nation": "Brasil",
    "era": "Actual",
    "position": "DEF",
    "rarity": "common",
    "ovr": 60,
    "stats": {
      "pace": 62,
      "shooting": 40,
      "passing": 57,
      "dribbling": 54,
      "defending": 61,
      "physical": 61
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "base_def_martin",
    "name": "Lucas Martin",
    "nation": "Francia",
    "era": "Actual",
    "position": "DEF",
    "rarity": "common",
    "ovr": 59,
    "stats": {
      "pace": 58,
      "shooting": 42,
      "passing": 60,
      "dribbling": 53,
      "defending": 60,
      "physical": 59
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_def_keller",
    "name": "Jonas Keller",
    "nation": "Alemania",
    "era": "Actual",
    "position": "DEF",
    "rarity": "common",
    "ovr": 61,
    "stats": {
      "pace": 60,
      "shooting": 41,
      "passing": 61,
      "dribbling": 55,
      "defending": 62,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": "presion"
  },
  {
    "id": "base_def_rossi",
    "name": "Marco Rossi",
    "nation": "Italia",
    "era": "Actual",
    "position": "DEF",
    "rarity": "common",
    "ovr": 60,
    "stats": {
      "pace": 57,
      "shooting": 39,
      "passing": 59,
      "dribbling": 52,
      "defending": 63,
      "physical": 62
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_mid_santos",
    "name": "Diego Santos",
    "nation": "Uruguay",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 58,
    "stats": {
      "pace": 57,
      "shooting": 53,
      "passing": 60,
      "dribbling": 59,
      "defending": 56,
      "physical": 57
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_mid_garcia",
    "name": "Iván García",
    "nation": "España",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 60,
    "stats": {
      "pace": 60,
      "shooting": 57,
      "passing": 62,
      "dribbling": 61,
      "defending": 57,
      "physical": 59
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_mid_moreau",
    "name": "Fausto Vera",
    "nation": "Argentina",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 74,
      "shooting": 72,
      "passing": 76,
      "dribbling": 71,
      "defending": 72,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": "presion"
  },
  {
    "id": "base_mid_mueller",
    "name": "Felix Müller",
    "nation": "Alemania",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 61,
    "stats": {
      "pace": 61,
      "shooting": 59,
      "passing": 63,
      "dribbling": 60,
      "defending": 60,
      "physical": 61
    },
    "gk": null,
    "trait": null,
    "tacticalType": "presion"
  },
  {
    "id": "base_mid_bianchi",
    "name": "Nico Bianchi",
    "nation": "Italia",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 60,
    "stats": {
      "pace": 59,
      "shooting": 58,
      "passing": 62,
      "dribbling": 62,
      "defending": 57,
      "physical": 59
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_mid_pereira",
    "name": "Rui Pereira",
    "nation": "Portugal",
    "era": "Actual",
    "position": "MID",
    "rarity": "common",
    "ovr": 59,
    "stats": {
      "pace": 61,
      "shooting": 56,
      "passing": 60,
      "dribbling": 60,
      "defending": 56,
      "physical": 58
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "base_fwd_navarro",
    "name": "Dani Navarro",
    "nation": "España",
    "era": "Actual",
    "position": "FWD",
    "rarity": "common",
    "ovr": 59,
    "stats": {
      "pace": 62,
      "shooting": 60,
      "passing": 53,
      "dribbling": 59,
      "defending": 29,
      "physical": 57
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "base_fwd_alves",
    "name": "Caio Alves",
    "nation": "Brasil",
    "era": "Actual",
    "position": "FWD",
    "rarity": "common",
    "ovr": 61,
    "stats": {
      "pace": 64,
      "shooting": 62,
      "passing": 55,
      "dribbling": 62,
      "defending": 28,
      "physical": 58
    },
    "gk": null,
    "trait": null,
    "tacticalType": "contra"
  },
  {
    "id": "base_fwd_dubois",
    "name": "Léo Dubois",
    "nation": "Francia",
    "era": "Actual",
    "position": "FWD",
    "rarity": "common",
    "ovr": 58,
    "stats": {
      "pace": 60,
      "shooting": 59,
      "passing": 54,
      "dribbling": 58,
      "defending": 31,
      "physical": 56
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "base_fwd_conti",
    "name": "Paolo Conti",
    "nation": "Italia",
    "era": "Actual",
    "position": "FWD",
    "rarity": "common",
    "ovr": 60,
    "stats": {
      "pace": 61,
      "shooting": 62,
      "passing": 56,
      "dribbling": 60,
      "defending": 30,
      "physical": 59
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "gen_gk_emiliano-martinez",
    "name": "Emiliano Martínez",
    "nation": "Argentina",
    "era": "2022",
    "position": "GK",
    "rarity": "legend",
    "ovr": 95,
    "stats": null,
    "gk": {
      "reflexes": 96,
      "handling": 93,
      "positioning": 96
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nahuel-molina",
    "name": "Nahuel Molina",
    "nation": "Argentina",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 84,
      "shooting": 78,
      "passing": 85,
      "dribbling": 86,
      "defending": 85,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_cristian-romero",
    "name": "Cristian Romero",
    "nation": "Argentina",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 72,
      "passing": 79,
      "dribbling": 77,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nicolas-otamendi",
    "name": "Nicolás Otamendi",
    "nation": "Argentina",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 92,
      "shooting": 76,
      "passing": 78,
      "dribbling": 78,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marcos-acuna",
    "name": "Marcos Acuña",
    "nation": "Argentina",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 90,
      "shooting": 77,
      "passing": 84,
      "dribbling": 92,
      "defending": 88,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_rodrigo-de-paul",
    "name": "Rodrigo De Paul",
    "nation": "Argentina",
    "era": "2022",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 84,
      "passing": 92,
      "dribbling": 86,
      "defending": 85,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_enzo-fernandez",
    "name": "Enzo Fernández",
    "nation": "Argentina",
    "era": "2022",
    "position": "MID",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 94,
      "shooting": 94,
      "passing": 99,
      "dribbling": 96,
      "defending": 93,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_alexis-mac-allister",
    "name": "Alexis Mac Allister",
    "nation": "Argentina",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 88,
      "passing": 89,
      "dribbling": 84,
      "defending": 89,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_lionel-messi",
    "name": "Lionel Messi",
    "nation": "Argentina",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 98,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 99,
      "dribbling": 99,
      "defending": 70,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_julian-alvarez",
    "name": "Julián Álvarez",
    "nation": "Argentina",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 97,
      "shooting": 99,
      "passing": 91,
      "dribbling": 95,
      "defending": 79,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_angel-di-maria",
    "name": "Ángel Di María",
    "nation": "Argentina",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 96,
      "shooting": 96,
      "passing": 92,
      "dribbling": 96,
      "defending": 64,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_hugo-lloris",
    "name": "Hugo Lloris",
    "nation": "Francia",
    "era": "2018",
    "position": "GK",
    "rarity": "legend",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 88,
      "positioning": 87
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jules-kounde",
    "name": "Jules Koundé",
    "nation": "Francia",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_raphael-varane",
    "name": "Raphaël Varane",
    "nation": "Francia",
    "era": "2018",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 86,
      "shooting": 60,
      "passing": 80,
      "dribbling": 68,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_dayot-upamecano",
    "name": "Dayot Upamecano",
    "nation": "Francia",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 91,
      "shooting": 71,
      "passing": 79,
      "dribbling": 76,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_theo-hernandez",
    "name": "Theo Hernández",
    "nation": "Francia",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_aurelien-tchouameni",
    "name": "Aurélien Tchouaméni",
    "nation": "Francia",
    "era": "2022",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_adrien-rabiot",
    "name": "Adrien Rabiot",
    "nation": "Francia",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_antoine-griezmann",
    "name": "Antoine Griezmann",
    "nation": "Francia",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 87,
    "stats": {
      "pace": 89,
      "shooting": 91,
      "passing": 89,
      "dribbling": 87,
      "defending": 74,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ousmane-dembele",
    "name": "Ousmane Dembélé",
    "nation": "Francia",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 95,
      "shooting": 90,
      "passing": 86,
      "dribbling": 99,
      "defending": 77,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_olivier-giroud",
    "name": "Olivier Giroud",
    "nation": "Francia",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 87,
    "stats": {
      "pace": 96,
      "shooting": 99,
      "passing": 90,
      "dribbling": 60,
      "defending": 78,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_kylian-mbappe",
    "name": "Kylian Mbappé",
    "nation": "Francia",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 97,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 91,
      "dribbling": 99,
      "defending": 79,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_dominik-livakovic",
    "name": "Dominik Livaković",
    "nation": "Croacia",
    "era": "2022",
    "position": "GK",
    "rarity": "epic",
    "ovr": 86,
    "stats": null,
    "gk": {
      "reflexes": 87,
      "handling": 84,
      "positioning": 87
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_josip-juranovic",
    "name": "Josip Juranović",
    "nation": "Croacia",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_dejan-lovren",
    "name": "Dejan Lovren",
    "nation": "Croacia",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_josko-gvardiol",
    "name": "Joško Gvardiol",
    "nation": "Croacia",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_borna-sosa",
    "name": "Borna Sosa",
    "nation": "Croacia",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_marcelo-brozovic",
    "name": "Marcelo Brozović",
    "nation": "Croacia",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_mateo-kovacic",
    "name": "Mateo Kovačić",
    "nation": "Croacia",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mario-pasalic",
    "name": "Mario Pašalić",
    "nation": "Croacia",
    "era": "2022",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_andrej-kramaric",
    "name": "Andrej Kramarić",
    "nation": "Croacia",
    "era": "2022",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ivan-perisic",
    "name": "Ivan Perišić",
    "nation": "Croacia",
    "era": "2018",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 92,
      "passing": 82,
      "dribbling": 86,
      "defending": 70,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_yassine-bounou",
    "name": "Yassine Bounou",
    "nation": "Marruecos",
    "era": "2022",
    "position": "GK",
    "rarity": "rare",
    "ovr": 81,
    "stats": null,
    "gk": {
      "reflexes": 82,
      "handling": 79,
      "positioning": 82
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_achraf-hakimi",
    "name": "Achraf Hakimi",
    "nation": "Marruecos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nayef-aguerd",
    "name": "Nayef Aguerd",
    "nation": "Marruecos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 78,
      "shooting": 66,
      "passing": 76,
      "dribbling": 74,
      "defending": 86,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_romain-saiss",
    "name": "Romain Saïss",
    "nation": "Marruecos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_noussair-mazraoui",
    "name": "Noussair Mazraoui",
    "nation": "Marruecos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sofyan-amrabat",
    "name": "Sofyan Amrabat",
    "nation": "Marruecos",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 77,
      "shooting": 77,
      "passing": 83,
      "dribbling": 79,
      "defending": 76,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_azzedine-ounahi",
    "name": "Azzedine Ounahi",
    "nation": "Marruecos",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 78,
      "shooting": 78,
      "passing": 84,
      "dribbling": 80,
      "defending": 77,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_selim-amallah",
    "name": "Selim Amallah",
    "nation": "Marruecos",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hakim-ziyech",
    "name": "Hakim Ziyech",
    "nation": "Marruecos",
    "era": "2022",
    "position": "FWD",
    "rarity": "common",
    "ovr": 75,
    "stats": {
      "pace": 75,
      "shooting": 79,
      "passing": 69,
      "dribbling": 73,
      "defending": 57,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_youssef-en-nesyri",
    "name": "Youssef En-Nesyri",
    "nation": "Marruecos",
    "era": "2022",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_sofiane-boufal",
    "name": "Sofiane Boufal",
    "nation": "Marruecos",
    "era": "2022",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_andries-noppert",
    "name": "Andries Noppert",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "GK",
    "rarity": "rare",
    "ovr": 81,
    "stats": null,
    "gk": {
      "reflexes": 82,
      "handling": 79,
      "positioning": 82
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jurrien-timber",
    "name": "Jurriën Timber",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_virgil-van-dijk",
    "name": "Virgil van Dijk",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nathan-ake",
    "name": "Nathan Aké",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_denzel-dumfries",
    "name": "Denzel Dumfries",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_frenkie-de-jong",
    "name": "Frenkie de Jong",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_marten-de-roon",
    "name": "Marten de Roon",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_daley-blind",
    "name": "Daley Blind",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_cody-gakpo",
    "name": "Cody Gakpo",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_memphis-depay",
    "name": "Memphis Depay",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_steven-bergwijn",
    "name": "Steven Bergwijn",
    "nation": "Países Bajos",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_jordan-pickford",
    "name": "Jordan Pickford",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "GK",
    "rarity": "epic",
    "ovr": 85,
    "stats": null,
    "gk": {
      "reflexes": 86,
      "handling": 83,
      "positioning": 86
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_kyle-walker",
    "name": "Kyle Walker",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_john-stones",
    "name": "John Stones",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_harry-maguire",
    "name": "Harry Maguire",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_luke-shaw",
    "name": "Luke Shaw",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_declan-rice",
    "name": "Declan Rice",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 84,
      "shooting": 84,
      "passing": 90,
      "dribbling": 86,
      "defending": 83,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jordan-henderson",
    "name": "Jordan Henderson",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jude-bellingham",
    "name": "Jude Bellingham",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_bukayo-saka",
    "name": "Bukayo Saka",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 92,
      "passing": 82,
      "dribbling": 86,
      "defending": 70,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_harry-kane",
    "name": "Harry Kane",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_phil-foden",
    "name": "Phil Foden",
    "nation": "Inglaterra",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_alisson",
    "name": "Alisson",
    "nation": "Brasil",
    "era": "2022",
    "position": "GK",
    "rarity": "legend",
    "ovr": 92,
    "stats": null,
    "gk": {
      "reflexes": 93,
      "handling": 90,
      "positioning": 93
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_danilo",
    "name": "Danilo",
    "nation": "Brasil",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marquinhos",
    "name": "Marquinhos",
    "nation": "Brasil",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thiago-silva",
    "name": "Thiago Silva",
    "nation": "Brasil",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 78,
      "passing": 88,
      "dribbling": 86,
      "defending": 98,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_eder-militao",
    "name": "Éder Militão",
    "nation": "Brasil",
    "era": "2022",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_casemiro",
    "name": "Casemiro",
    "nation": "Brasil",
    "era": "2022",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_lucas-paqueta",
    "name": "Lucas Paquetá",
    "nation": "Brasil",
    "era": "2022",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_neymar",
    "name": "Neymar",
    "nation": "Brasil",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 98,
      "passing": 88,
      "dribbling": 92,
      "defending": 76,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_raphinha",
    "name": "Raphinha",
    "nation": "Brasil",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_richarlison",
    "name": "Richarlison",
    "nation": "Brasil",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 98,
      "passing": 88,
      "dribbling": 92,
      "defending": 76,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_vinicius-junior",
    "name": "Vinícius Júnior",
    "nation": "Brasil",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 95,
      "shooting": 90,
      "passing": 80,
      "dribbling": 99,
      "defending": 52,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_diogo-costa",
    "name": "Diogo Costa",
    "nation": "Portugal",
    "era": "2022",
    "position": "GK",
    "rarity": "epic",
    "ovr": 85,
    "stats": null,
    "gk": {
      "reflexes": 86,
      "handling": 83,
      "positioning": 86
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_diogo-dalot",
    "name": "Diogo Dalot",
    "nation": "Portugal",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_pepe",
    "name": "Pepe",
    "nation": "Portugal",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ruben-dias",
    "name": "Rúben Dias",
    "nation": "Portugal",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_raphael-guerreiro",
    "name": "Raphaël Guerreiro",
    "nation": "Portugal",
    "era": "2022",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_william-carvalho",
    "name": "William Carvalho",
    "nation": "Portugal",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bernardo-silva",
    "name": "Bernardo Silva",
    "nation": "Portugal",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bruno-fernandes",
    "name": "Bruno Fernandes",
    "nation": "Portugal",
    "era": "2022",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_joao-felix",
    "name": "João Félix",
    "nation": "Portugal",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_goncalo-ramos",
    "name": "Gonçalo Ramos",
    "nation": "Portugal",
    "era": "2022",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_cristiano-ronaldo",
    "name": "Cristiano Ronaldo",
    "nation": "Portugal",
    "era": "2022",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 97,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 85,
      "dribbling": 99,
      "defending": 72,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_benjamin-pavard",
    "name": "Benjamin Pavard",
    "nation": "Francia",
    "era": "2018",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 91,
      "shooting": 90,
      "passing": 80,
      "dribbling": 80,
      "defending": 90,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_samuel-umtiti",
    "name": "Samuel Umtiti",
    "nation": "Francia",
    "era": "2018",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 93,
      "shooting": 65,
      "passing": 71,
      "dribbling": 76,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_lucas-hernandez",
    "name": "Lucas Hernández",
    "nation": "Francia",
    "era": "2018",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 91,
      "shooting": 66,
      "passing": 80,
      "dribbling": 77,
      "defending": 99,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_paul-pogba",
    "name": "Paul Pogba",
    "nation": "Francia",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 89,
      "shooting": 87,
      "passing": 93,
      "dribbling": 90,
      "defending": 82,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ngolo-kante",
    "name": "N’Golo Kanté",
    "nation": "Francia",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 94,
      "shooting": 79,
      "passing": 80,
      "dribbling": 96,
      "defending": 93,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_blaise-matuidi",
    "name": "Blaise Matuidi",
    "nation": "Francia",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 85,
    "stats": {
      "pace": 91,
      "shooting": 85,
      "passing": 83,
      "dribbling": 85,
      "defending": 84,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_danijel-subasic",
    "name": "Danijel Subašić",
    "nation": "Croacia",
    "era": "2018",
    "position": "GK",
    "rarity": "epic",
    "ovr": 87,
    "stats": null,
    "gk": {
      "reflexes": 88,
      "handling": 85,
      "positioning": 88
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_sime-vrsaljko",
    "name": "Šime Vrsaljko",
    "nation": "Croacia",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_domagoj-vida",
    "name": "Domagoj Vida",
    "nation": "Croacia",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ivan-strinic",
    "name": "Ivan Strinić",
    "nation": "Croacia",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ivan-rakitic",
    "name": "Ivan Rakitić",
    "nation": "Croacia",
    "era": "2018",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ante-rebic",
    "name": "Ante Rebić",
    "nation": "Croacia",
    "era": "2018",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 90,
      "passing": 80,
      "dribbling": 84,
      "defending": 68,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mario-mandzukic",
    "name": "Mario Mandžukić",
    "nation": "Croacia",
    "era": "2018",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 87,
      "shooting": 91,
      "passing": 81,
      "dribbling": 85,
      "defending": 69,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_thibaut-courtois",
    "name": "Thibaut Courtois",
    "nation": "Bélgica",
    "era": "2018",
    "position": "GK",
    "rarity": "legend",
    "ovr": 91,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 89,
      "positioning": 92
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_toby-alderweireld",
    "name": "Toby Alderweireld",
    "nation": "Bélgica",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_vincent-kompany",
    "name": "Vincent Kompany",
    "nation": "Bélgica",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jan-vertonghen",
    "name": "Jan Vertonghen",
    "nation": "Bélgica",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thomas-meunier",
    "name": "Thomas Meunier",
    "nation": "Bélgica",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_kevin-de-bruyne",
    "name": "Kevin De Bruyne",
    "nation": "Bélgica",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_axel-witsel",
    "name": "Axel Witsel",
    "nation": "Bélgica",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_marouane-fellaini",
    "name": "Marouane Fellaini",
    "nation": "Bélgica",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_eden-hazard",
    "name": "Eden Hazard",
    "nation": "Bélgica",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_romelu-lukaku",
    "name": "Romelu Lukaku",
    "nation": "Bélgica",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_nacer-chadli",
    "name": "Nacer Chadli",
    "nation": "Bélgica",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_kieran-trippier",
    "name": "Kieran Trippier",
    "nation": "Inglaterra",
    "era": "2018",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dele-alli",
    "name": "Dele Alli",
    "nation": "Inglaterra",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 78,
      "shooting": 78,
      "passing": 84,
      "dribbling": 80,
      "defending": 77,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jesse-lingard",
    "name": "Jesse Lingard",
    "nation": "Inglaterra",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ashley-young",
    "name": "Ashley Young",
    "nation": "Inglaterra",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 77,
      "shooting": 77,
      "passing": 83,
      "dribbling": 79,
      "defending": 76,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_raheem-sterling",
    "name": "Raheem Sterling",
    "nation": "Inglaterra",
    "era": "2018",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_fernando-muslera",
    "name": "Fernando Muslera",
    "nation": "Uruguay",
    "era": "2018",
    "position": "GK",
    "rarity": "rare",
    "ovr": 81,
    "stats": null,
    "gk": {
      "reflexes": 82,
      "handling": 79,
      "positioning": 82
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_martin-caceres",
    "name": "Martín Cáceres",
    "nation": "Uruguay",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_diego-godin",
    "name": "Diego Godín",
    "nation": "Uruguay",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-maria-gimenez",
    "name": "José María Giménez",
    "nation": "Uruguay",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_diego-laxalt",
    "name": "Diego Laxalt",
    "nation": "Uruguay",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_nahitan-nandez",
    "name": "Nahitan Nández",
    "nation": "Uruguay",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_lucas-torreira",
    "name": "Lucas Torreira",
    "nation": "Uruguay",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_matias-vecino",
    "name": "Matías Vecino",
    "nation": "Uruguay",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_rodrigo-bentancur",
    "name": "Rodrigo Bentancur",
    "nation": "Uruguay",
    "era": "2018",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_luis-suarez",
    "name": "Luis Suárez",
    "nation": "Uruguay",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 80,
      "dribbling": 85,
      "defending": 70,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_edinson-cavani",
    "name": "Edinson Cavani",
    "nation": "Uruguay",
    "era": "2018",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fagner",
    "name": "Fagner",
    "nation": "Brasil",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_miranda",
    "name": "Miranda",
    "nation": "Brasil",
    "era": "2018",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 87,
      "shooting": 75,
      "passing": 85,
      "dribbling": 83,
      "defending": 95,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marcelo",
    "name": "Marcelo",
    "nation": "Brasil",
    "era": "2018",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_paulinho",
    "name": "Paulinho",
    "nation": "Brasil",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_philippe-coutinho",
    "name": "Philippe Coutinho",
    "nation": "Brasil",
    "era": "2018",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_willian",
    "name": "Willian",
    "nation": "Brasil",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_gabriel-jesus",
    "name": "Gabriel Jesus",
    "nation": "Brasil",
    "era": "2018",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_igor-akinfeev",
    "name": "Igor Akinfeev",
    "nation": "Rusia",
    "era": "2018",
    "position": "GK",
    "rarity": "common",
    "ovr": 68,
    "stats": null,
    "gk": {
      "reflexes": 69,
      "handling": 66,
      "positioning": 69
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mario-fernandes",
    "name": "Mario Fernandes",
    "nation": "Rusia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 63,
      "shooting": 51,
      "passing": 61,
      "dribbling": 59,
      "defending": 71,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ilya-kutepov",
    "name": "Ilya Kutepov",
    "nation": "Rusia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_sergei-ignashevich",
    "name": "Sergei Ignashevich",
    "nation": "Rusia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fedor-kudryashov",
    "name": "Fedor Kudryashov",
    "nation": "Rusia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 63,
      "shooting": 51,
      "passing": 61,
      "dribbling": 59,
      "defending": 71,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_roman-zobnin",
    "name": "Roman Zobnin",
    "nation": "Rusia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 64,
      "shooting": 64,
      "passing": 70,
      "dribbling": 66,
      "defending": 63,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_daler-kuzyaev",
    "name": "Daler Kuzyaev",
    "nation": "Rusia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 65,
      "shooting": 65,
      "passing": 71,
      "dribbling": 67,
      "defending": 64,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_aleksandr-golovin",
    "name": "Aleksandr Golovin",
    "nation": "Rusia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 66,
      "shooting": 66,
      "passing": 72,
      "dribbling": 68,
      "defending": 65,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_aleksandr-samedov",
    "name": "Aleksandr Samedov",
    "nation": "Rusia",
    "era": "2018",
    "position": "FWD",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 67,
      "shooting": 71,
      "passing": 61,
      "dribbling": 65,
      "defending": 49,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_artem-dzyuba",
    "name": "Artem Dzyuba",
    "nation": "Rusia",
    "era": "2018",
    "position": "FWD",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 68,
      "shooting": 72,
      "passing": 62,
      "dribbling": 66,
      "defending": 50,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_denis-cheryshev",
    "name": "Denis Cheryshev",
    "nation": "Rusia",
    "era": "2018",
    "position": "FWD",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 69,
      "shooting": 73,
      "passing": 63,
      "dribbling": 67,
      "defending": 51,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_robin-olsen",
    "name": "Robin Olsen",
    "nation": "Suecia",
    "era": "2018",
    "position": "GK",
    "rarity": "common",
    "ovr": 68,
    "stats": null,
    "gk": {
      "reflexes": 69,
      "handling": 66,
      "positioning": 69
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mikael-lustig",
    "name": "Mikael Lustig",
    "nation": "Suecia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_victor-lindelof",
    "name": "Victor Lindelöf",
    "nation": "Suecia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 66,
      "shooting": 54,
      "passing": 64,
      "dribbling": 62,
      "defending": 74,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andreas-granqvist",
    "name": "Andreas Granqvist",
    "nation": "Suecia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ludwig-augustinsson",
    "name": "Ludwig Augustinsson",
    "nation": "Suecia",
    "era": "2018",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_viktor-claesson",
    "name": "Viktor Claesson",
    "nation": "Suecia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 65,
      "shooting": 65,
      "passing": 71,
      "dribbling": 67,
      "defending": 64,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sebastian-larsson",
    "name": "Sebastian Larsson",
    "nation": "Suecia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 66,
      "shooting": 66,
      "passing": 72,
      "dribbling": 68,
      "defending": 65,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_albin-ekdal",
    "name": "Albin Ekdal",
    "nation": "Suecia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 67,
      "shooting": 67,
      "passing": 73,
      "dribbling": 69,
      "defending": 66,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_emil-forsberg",
    "name": "Emil Forsberg",
    "nation": "Suecia",
    "era": "2018",
    "position": "MID",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 65,
      "shooting": 65,
      "passing": 71,
      "dribbling": 67,
      "defending": 64,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marcus-berg",
    "name": "Marcus Berg",
    "nation": "Suecia",
    "era": "2018",
    "position": "FWD",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 66,
      "shooting": 70,
      "passing": 60,
      "dribbling": 64,
      "defending": 48,
      "physical": 62
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ola-toivonen",
    "name": "Ola Toivonen",
    "nation": "Suecia",
    "era": "2018",
    "position": "FWD",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 67,
      "shooting": 71,
      "passing": 61,
      "dribbling": 65,
      "defending": 49,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jerome-boateng",
    "name": "Jérôme Boateng",
    "nation": "Alemania",
    "era": "2014",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 93,
      "shooting": 69,
      "passing": 80,
      "dribbling": 89,
      "defending": 94,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mats-hummels",
    "name": "Mats Hummels",
    "nation": "Alemania",
    "era": "2014",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 94,
      "shooting": 82,
      "passing": 92,
      "dribbling": 90,
      "defending": 99,
      "physical": 98
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_benedikt-howedes",
    "name": "Benedikt Höwedes",
    "nation": "Alemania",
    "era": "2014",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 92,
      "shooting": 80,
      "passing": 90,
      "dribbling": 88,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bastian-schweinsteiger",
    "name": "Bastian Schweinsteiger",
    "nation": "Alemania",
    "era": "2014",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 89,
      "shooting": 86,
      "passing": 89,
      "dribbling": 88,
      "defending": 85,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sami-khedira",
    "name": "Sami Khedira",
    "nation": "Alemania",
    "era": "2014",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 86,
      "shooting": 84,
      "passing": 89,
      "dribbling": 88,
      "defending": 93,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mesut-ozil",
    "name": "Mesut Özil",
    "nation": "Alemania",
    "era": "2014",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 96,
      "shooting": 99,
      "passing": 90,
      "dribbling": 94,
      "defending": 78,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_thomas-muller",
    "name": "Thomas Müller",
    "nation": "Alemania",
    "era": "2014",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 97,
      "shooting": 99,
      "passing": 91,
      "dribbling": 95,
      "defending": 79,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_miroslav-klose",
    "name": "Miroslav Klose",
    "nation": "Alemania",
    "era": "2014",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 78,
      "dribbling": 82,
      "defending": 74,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_sergio-romero",
    "name": "Sergio Romero",
    "nation": "Argentina",
    "era": "2014",
    "position": "GK",
    "rarity": "epic",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 86,
      "positioning": 89
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_pablo-zabaleta",
    "name": "Pablo Zabaleta",
    "nation": "Argentina",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_martin-demichelis",
    "name": "Martín Demichelis",
    "nation": "Argentina",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ezequiel-garay",
    "name": "Ezequiel Garay",
    "nation": "Argentina",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 69,
      "passing": 76,
      "dribbling": 74,
      "defending": 95,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marcos-rojo",
    "name": "Marcos Rojo",
    "nation": "Argentina",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_javier-mascherano",
    "name": "Javier Mascherano",
    "nation": "Argentina",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_lucas-biglia",
    "name": "Lucas Biglia",
    "nation": "Argentina",
    "era": "2014",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_enzo-perez",
    "name": "Enzo Pérez",
    "nation": "Argentina",
    "era": "2014",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_gonzalo-higuain",
    "name": "Gonzalo Higuaín",
    "nation": "Argentina",
    "era": "2014",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ezequiel-lavezzi",
    "name": "Ezequiel Lavezzi",
    "nation": "Argentina",
    "era": "2014",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_jasper-cillessen",
    "name": "Jasper Cillessen",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "GK",
    "rarity": "epic",
    "ovr": 85,
    "stats": null,
    "gk": {
      "reflexes": 86,
      "handling": 83,
      "positioning": 86
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_daryl-janmaat",
    "name": "Daryl Janmaat",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_stefan-de-vrij",
    "name": "Stefan de Vrij",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ron-vlaar",
    "name": "Ron Vlaar",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_nigel-de-jong",
    "name": "Nigel de Jong",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_wesley-sneijder",
    "name": "Wesley Sneijder",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_georginio-wijnaldum",
    "name": "Georginio Wijnaldum",
    "nation": "Países Bajos",
    "era": "2014",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_arjen-robben",
    "name": "Arjen Robben",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_robin-van-persie",
    "name": "Robin van Persie",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_julio-cesar",
    "name": "Júlio César",
    "nation": "Brasil",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_maicon",
    "name": "Maicon",
    "nation": "Brasil",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_david-luiz",
    "name": "David Luiz",
    "nation": "Brasil",
    "era": "2014",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_fernandinho",
    "name": "Fernandinho",
    "nation": "Brasil",
    "era": "2014",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_oscar",
    "name": "Oscar",
    "nation": "Brasil",
    "era": "2014",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hulk",
    "name": "Hulk",
    "nation": "Brasil",
    "era": "2014",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 84,
      "shooting": 99,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_fred",
    "name": "Fred",
    "nation": "Brasil",
    "era": "2014",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mathieu-debuchy",
    "name": "Mathieu Debuchy",
    "nation": "Francia",
    "era": "2014",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mamadou-sakho",
    "name": "Mamadou Sakho",
    "nation": "Francia",
    "era": "2014",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_patrice-evra",
    "name": "Patrice Evra",
    "nation": "Francia",
    "era": "2014",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_yohan-cabaye",
    "name": "Yohan Cabaye",
    "nation": "Francia",
    "era": "2014",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mathieu-valbuena",
    "name": "Mathieu Valbuena",
    "nation": "Francia",
    "era": "2014",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_karim-benzema",
    "name": "Karim Benzema",
    "nation": "Francia",
    "era": "2014",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 90,
    "stats": {
      "pace": 83,
      "shooting": 90,
      "passing": 90,
      "dribbling": 95,
      "defending": 65,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_daniel-van-buyten",
    "name": "Daniel van Buyten",
    "nation": "Bélgica",
    "era": "2014",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_dries-mertens",
    "name": "Dries Mertens",
    "nation": "Bélgica",
    "era": "2014",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 79,
      "shooting": 83,
      "passing": 73,
      "dribbling": 77,
      "defending": 61,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_divock-origi",
    "name": "Divock Origi",
    "nation": "Bélgica",
    "era": "2014",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 80,
      "shooting": 84,
      "passing": 74,
      "dribbling": 78,
      "defending": 62,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_david-ospina",
    "name": "David Ospina",
    "nation": "Colombia",
    "era": "2014",
    "position": "GK",
    "rarity": "common",
    "ovr": 71,
    "stats": null,
    "gk": {
      "reflexes": 72,
      "handling": 69,
      "positioning": 72
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_juan-zuniga",
    "name": "Juan Zúñiga",
    "nation": "Colombia",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_cristian-zapata",
    "name": "Cristián Zapata",
    "nation": "Colombia",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 68,
      "shooting": 56,
      "passing": 66,
      "dribbling": 64,
      "defending": 76,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mario-yepes",
    "name": "Mario Yepes",
    "nation": "Colombia",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_pablo-armero",
    "name": "Pablo Armero",
    "nation": "Colombia",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_carlos-sanchez",
    "name": "Carlos Sánchez",
    "nation": "Colombia",
    "era": "2014",
    "position": "MID",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 71,
      "shooting": 71,
      "passing": 77,
      "dribbling": 73,
      "defending": 70,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_fredy-guarin",
    "name": "Fredy Guarín",
    "nation": "Colombia",
    "era": "2014",
    "position": "MID",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 72,
      "shooting": 72,
      "passing": 78,
      "dribbling": 74,
      "defending": 71,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_james-rodriguez",
    "name": "James Rodríguez",
    "nation": "Colombia",
    "era": "2014",
    "position": "MID",
    "rarity": "epic",
    "ovr": 80,
    "stats": {
      "pace": 82,
      "shooting": 89,
      "passing": 89,
      "dribbling": 81,
      "defending": 61,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_juan-cuadrado",
    "name": "Juan Cuadrado",
    "nation": "Colombia",
    "era": "2014",
    "position": "FWD",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 74,
      "shooting": 78,
      "passing": 68,
      "dribbling": 72,
      "defending": 56,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_teofilo-gutierrez",
    "name": "Teófilo Gutiérrez",
    "nation": "Colombia",
    "era": "2014",
    "position": "FWD",
    "rarity": "common",
    "ovr": 75,
    "stats": {
      "pace": 75,
      "shooting": 79,
      "passing": 69,
      "dribbling": 73,
      "defending": 57,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_jackson-martinez",
    "name": "Jackson Martínez",
    "nation": "Colombia",
    "era": "2014",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_keylor-navas",
    "name": "Keylor Navas",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "GK",
    "rarity": "common",
    "ovr": 73,
    "stats": null,
    "gk": {
      "reflexes": 74,
      "handling": 71,
      "positioning": 74
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_cristian-gamboa",
    "name": "Cristian Gamboa",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_giancarlo-gonzalez",
    "name": "Giancarlo González",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 68,
      "shooting": 56,
      "passing": 66,
      "dribbling": 64,
      "defending": 76,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_oscar-duarte",
    "name": "Óscar Duarte",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_junior-diaz",
    "name": "Júnior Díaz",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_celso-borges",
    "name": "Celso Borges",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "MID",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 66,
      "shooting": 66,
      "passing": 72,
      "dribbling": 68,
      "defending": 65,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_yeltsin-tejeda",
    "name": "Yeltsin Tejeda",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "MID",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 67,
      "shooting": 67,
      "passing": 73,
      "dribbling": 69,
      "defending": 66,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bryan-ruiz",
    "name": "Bryan Ruiz",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "MID",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 68,
      "shooting": 68,
      "passing": 74,
      "dribbling": 70,
      "defending": 67,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_christian-bolanos",
    "name": "Christian Bolaños",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "FWD",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 67,
      "shooting": 71,
      "passing": 61,
      "dribbling": 65,
      "defending": 49,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marco-urena",
    "name": "Marco Ureña",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "FWD",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 68,
      "shooting": 72,
      "passing": 62,
      "dribbling": 66,
      "defending": 50,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_joel-campbell",
    "name": "Joel Campbell",
    "nation": "Costa Rica",
    "era": "2014",
    "position": "FWD",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 69,
      "shooting": 73,
      "passing": 63,
      "dribbling": 67,
      "defending": 51,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gerard-pique",
    "name": "Gerard Piqué",
    "nation": "España",
    "era": "2010",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 93,
      "shooting": 81,
      "passing": 91,
      "dribbling": 89,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_joan-capdevila",
    "name": "Joan Capdevila",
    "nation": "España",
    "era": "2010",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 81,
      "shooting": 62,
      "passing": 70,
      "dribbling": 78,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sergio-busquets",
    "name": "Sergio Busquets",
    "nation": "España",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 91,
      "shooting": 70,
      "passing": 99,
      "dribbling": 95,
      "defending": 95,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "gen_mid_xabi-alonso",
    "name": "Xabi Alonso",
    "nation": "España",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 83,
      "shooting": 88,
      "passing": 99,
      "dribbling": 84,
      "defending": 94,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_david-villa",
    "name": "David Villa",
    "nation": "España",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 89,
      "dribbling": 93,
      "defending": 77,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_pedro-rodriguez",
    "name": "Pedro Rodríguez",
    "nation": "España",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 93,
      "shooting": 89,
      "passing": 87,
      "dribbling": 87,
      "defending": 66,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_maarten-stekelenburg",
    "name": "Maarten Stekelenburg",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "GK",
    "rarity": "epic",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 86,
      "positioning": 89
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gregory-van-der-wiel",
    "name": "Gregory van der Wiel",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_john-heitinga",
    "name": "John Heitinga",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_joris-mathijsen",
    "name": "Joris Mathijsen",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 87,
      "shooting": 75,
      "passing": 85,
      "dribbling": 83,
      "defending": 95,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_giovanni-van-bronckhorst",
    "name": "Giovanni van Bronckhorst",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_mark-van-bommel",
    "name": "Mark van Bommel",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_dirk-kuyt",
    "name": "Dirk Kuyt",
    "nation": "Países Bajos",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_per-mertesacker",
    "name": "Per Mertesacker",
    "nation": "Alemania",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_arne-friedrich",
    "name": "Arne Friedrich",
    "nation": "Alemania",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_lukas-podolski",
    "name": "Lukas Podolski",
    "nation": "Alemania",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_maxi-pereira",
    "name": "Maxi Pereira",
    "nation": "Uruguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_diego-lugano",
    "name": "Diego Lugano",
    "nation": "Uruguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 75,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 70,
      "dribbling": 68,
      "defending": 80,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jorge-fucile",
    "name": "Jorge Fucile",
    "nation": "Uruguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_egidio-arevalo-rios",
    "name": "Egidio Arévalo Ríos",
    "nation": "Uruguay",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 72,
      "shooting": 72,
      "passing": 78,
      "dribbling": 74,
      "defending": 71,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_diego-perez",
    "name": "Diego Pérez",
    "nation": "Uruguay",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 75,
    "stats": {
      "pace": 73,
      "shooting": 73,
      "passing": 79,
      "dribbling": 75,
      "defending": 72,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_diego-forlan",
    "name": "Diego Forlán",
    "nation": "Uruguay",
    "era": "2010",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 99,
      "passing": 71,
      "dribbling": 79,
      "defending": 63,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_alvaro-pereira",
    "name": "Álvaro Pereira",
    "nation": "Uruguay",
    "era": "2010",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 79,
      "shooting": 83,
      "passing": 73,
      "dribbling": 77,
      "defending": 61,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nicolas-burdisso",
    "name": "Nicolás Burdisso",
    "nation": "Argentina",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gabriel-heinze",
    "name": "Gabriel Heinze",
    "nation": "Argentina",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 65,
      "passing": 80,
      "dribbling": 75,
      "defending": 97,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_maxi-rodriguez",
    "name": "Maxi Rodríguez",
    "nation": "Argentina",
    "era": "2006",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_carlos-tevez",
    "name": "Carlos Tevez",
    "nation": "Argentina",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 92,
      "shooting": 92,
      "passing": 82,
      "dribbling": 96,
      "defending": 61,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_lucio",
    "name": "Lúcio",
    "nation": "Brasil",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 71,
      "passing": 78,
      "dribbling": 79,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_juan",
    "name": "Juan",
    "nation": "Brasil",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_michel-bastos",
    "name": "Michel Bastos",
    "nation": "Brasil",
    "era": "2010",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_gilberto-silva",
    "name": "Gilberto Silva",
    "nation": "Brasil",
    "era": "2002",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 94,
      "shooting": 84,
      "passing": 86,
      "dribbling": 85,
      "defending": 93,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_felipe-melo",
    "name": "Felipe Melo",
    "nation": "Brasil",
    "era": "2010",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_kaka",
    "name": "Kaká",
    "nation": "Brasil",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 94,
      "passing": 99,
      "dribbling": 99,
      "defending": 68,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_robinho",
    "name": "Robinho",
    "nation": "Brasil",
    "era": "2010",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_luis-fabiano",
    "name": "Luís Fabiano",
    "nation": "Brasil",
    "era": "2010",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_elano",
    "name": "Elano",
    "nation": "Brasil",
    "era": "2010",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_richard-kingson",
    "name": "Richard Kingson",
    "nation": "Ghana",
    "era": "2010",
    "position": "GK",
    "rarity": "common",
    "ovr": 65,
    "stats": null,
    "gk": {
      "reflexes": 66,
      "handling": 63,
      "positioning": 66
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_john-paintsil",
    "name": "John Paintsil",
    "nation": "Ghana",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 65,
    "stats": {
      "pace": 62,
      "shooting": 50,
      "passing": 60,
      "dribbling": 58,
      "defending": 70,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_john-mensah",
    "name": "John Mensah",
    "nation": "Ghana",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 63,
      "shooting": 51,
      "passing": 61,
      "dribbling": 59,
      "defending": 71,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_isaac-vorsah",
    "name": "Isaac Vorsah",
    "nation": "Ghana",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_hans-sarpei",
    "name": "Hans Sarpei",
    "nation": "Ghana",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 65,
    "stats": {
      "pace": 62,
      "shooting": 50,
      "passing": 60,
      "dribbling": 58,
      "defending": 70,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_anthony-annan",
    "name": "Anthony Annan",
    "nation": "Ghana",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 65,
      "shooting": 65,
      "passing": 71,
      "dribbling": 67,
      "defending": 64,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_kevin-prince-boateng",
    "name": "Kevin-Prince Boateng",
    "nation": "Ghana",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 66,
      "shooting": 66,
      "passing": 72,
      "dribbling": 68,
      "defending": 65,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sulley-muntari",
    "name": "Sulley Muntari",
    "nation": "Ghana",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 67,
      "shooting": 67,
      "passing": 73,
      "dribbling": 69,
      "defending": 66,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_samuel-inkoom",
    "name": "Samuel Inkoom",
    "nation": "Ghana",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 66,
      "shooting": 70,
      "passing": 60,
      "dribbling": 64,
      "defending": 48,
      "physical": 62
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_asamoah-gyan",
    "name": "Asamoah Gyan",
    "nation": "Ghana",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 67,
      "shooting": 71,
      "passing": 61,
      "dribbling": 65,
      "defending": 49,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_andre-ayew",
    "name": "André Ayew",
    "nation": "Ghana",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 68,
      "shooting": 72,
      "passing": 62,
      "dribbling": 66,
      "defending": 50,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_justo-villar",
    "name": "Justo Villar",
    "nation": "Paraguay",
    "era": "2010",
    "position": "GK",
    "rarity": "common",
    "ovr": 67,
    "stats": null,
    "gk": {
      "reflexes": 68,
      "handling": 65,
      "positioning": 68
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_dario-veron",
    "name": "Darío Verón",
    "nation": "Paraguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_paulo-da-silva",
    "name": "Paulo da Silva",
    "nation": "Paraguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_antolin-alcaraz",
    "name": "Antolín Alcaraz",
    "nation": "Paraguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 66,
      "shooting": 54,
      "passing": 64,
      "dribbling": 62,
      "defending": 74,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_claudio-morel",
    "name": "Claudio Morel",
    "nation": "Paraguay",
    "era": "2010",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_enrique-vera",
    "name": "Enrique Vera",
    "nation": "Paraguay",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 65,
    "stats": {
      "pace": 63,
      "shooting": 63,
      "passing": 69,
      "dribbling": 65,
      "defending": 62,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_cristian-riveros",
    "name": "Cristian Riveros",
    "nation": "Paraguay",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 64,
      "shooting": 64,
      "passing": 70,
      "dribbling": 66,
      "defending": 63,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jonathan-santana",
    "name": "Jonathan Santana",
    "nation": "Paraguay",
    "era": "2010",
    "position": "MID",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 65,
      "shooting": 65,
      "passing": 71,
      "dribbling": 67,
      "defending": 64,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_lucas-barrios",
    "name": "Lucas Barrios",
    "nation": "Paraguay",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 65,
    "stats": {
      "pace": 65,
      "shooting": 69,
      "passing": 59,
      "dribbling": 63,
      "defending": 47,
      "physical": 61
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_roque-santa-cruz",
    "name": "Roque Santa Cruz",
    "nation": "Paraguay",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 66,
    "stats": {
      "pace": 66,
      "shooting": 70,
      "passing": 60,
      "dribbling": 64,
      "defending": 48,
      "physical": 62
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_nelson-haedo-valdez",
    "name": "Nelson Haedo Valdez",
    "nation": "Paraguay",
    "era": "2010",
    "position": "FWD",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 67,
      "shooting": 71,
      "passing": 61,
      "dribbling": 65,
      "defending": 49,
      "physical": 63
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gianluca-zambrotta",
    "name": "Gianluca Zambrotta",
    "nation": "Italia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 70,
      "passing": 91,
      "dribbling": 85,
      "defending": 90,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marco-materazzi",
    "name": "Marco Materazzi",
    "nation": "Italia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 85,
      "shooting": 63,
      "passing": 73,
      "dribbling": 74,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fabio-grosso",
    "name": "Fabio Grosso",
    "nation": "Italia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 93,
      "shooting": 70,
      "passing": 60,
      "dribbling": 60,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_gennaro-gattuso",
    "name": "Gennaro Gattuso",
    "nation": "Italia",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 99,
      "shooting": 60,
      "passing": 80,
      "dribbling": 95,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_simone-perrotta",
    "name": "Simone Perrotta",
    "nation": "Italia",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 85,
      "shooting": 90,
      "passing": 90,
      "dribbling": 85,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mauro-camoranesi",
    "name": "Mauro Camoranesi",
    "nation": "Italia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_francesco-totti",
    "name": "Francesco Totti",
    "nation": "Italia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 98,
      "passing": 88,
      "dribbling": 92,
      "defending": 76,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_luca-toni",
    "name": "Luca Toni",
    "nation": "Italia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 79,
      "dribbling": 83,
      "defending": 77,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_fabien-barthez",
    "name": "Fabien Barthez",
    "nation": "Francia",
    "era": "1998",
    "position": "GK",
    "rarity": "legend",
    "ovr": 90,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 90,
      "positioning": 89
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_willy-sagnol",
    "name": "Willy Sagnol",
    "nation": "Francia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_william-gallas",
    "name": "William Gallas",
    "nation": "Francia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 91,
      "shooting": 79,
      "passing": 89,
      "dribbling": 87,
      "defending": 99,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_eric-abidal",
    "name": "Éric Abidal",
    "nation": "Francia",
    "era": "2006",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_claude-makelele",
    "name": "Claude Makélélé",
    "nation": "Francia",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 94,
      "shooting": 78,
      "passing": 90,
      "dribbling": 86,
      "defending": 99,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_franck-ribery",
    "name": "Franck Ribéry",
    "nation": "Francia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_florent-malouda",
    "name": "Florent Malouda",
    "nation": "Francia",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 88,
      "shooting": 89,
      "passing": 78,
      "dribbling": 93,
      "defending": 66,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_jens-lehmann",
    "name": "Jens Lehmann",
    "nation": "Alemania",
    "era": "2006",
    "position": "GK",
    "rarity": "epic",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 86,
      "positioning": 89
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_christoph-metzelder",
    "name": "Christoph Metzelder",
    "nation": "Alemania",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_torsten-frings",
    "name": "Torsten Frings",
    "nation": "Alemania",
    "era": "2002",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_michael-ballack",
    "name": "Michael Ballack",
    "nation": "Alemania",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bernd-schneider",
    "name": "Bernd Schneider",
    "nation": "Alemania",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_ricardo-pereira",
    "name": "Ricardo Pereira",
    "nation": "Portugal",
    "era": "2006",
    "position": "GK",
    "rarity": "epic",
    "ovr": 85,
    "stats": null,
    "gk": {
      "reflexes": 86,
      "handling": 83,
      "positioning": 86
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_miguel-monteiro",
    "name": "Miguel Monteiro",
    "nation": "Portugal",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ricardo-carvalho",
    "name": "Ricardo Carvalho",
    "nation": "Portugal",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fernando-meira",
    "name": "Fernando Meira",
    "nation": "Portugal",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_nuno-valente",
    "name": "Nuno Valente",
    "nation": "Portugal",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_costinha",
    "name": "Costinha",
    "nation": "Portugal",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_maniche",
    "name": "Maniche",
    "nation": "Portugal",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_deco",
    "name": "Deco",
    "nation": "Portugal",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_pauleta",
    "name": "Pauleta",
    "nation": "Portugal",
    "era": "2006",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 87,
      "shooting": 91,
      "passing": 81,
      "dribbling": 85,
      "defending": 69,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_dida",
    "name": "Dida",
    "nation": "Brasil",
    "era": "2006",
    "position": "GK",
    "rarity": "legend",
    "ovr": 93,
    "stats": null,
    "gk": {
      "reflexes": 95,
      "handling": 95,
      "positioning": 90
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_emerson",
    "name": "Emerson",
    "nation": "Brasil",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ze-roberto",
    "name": "Zé Roberto",
    "nation": "Brasil",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ronaldo",
    "name": "Ronaldo",
    "nation": "Brasil",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 97,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 93,
      "dribbling": 97,
      "defending": 81,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_adriano",
    "name": "Adriano",
    "nation": "Brasil",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 72,
      "dribbling": 78,
      "defending": 77,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_roberto-abbondanzieri",
    "name": "Roberto Abbondanzieri",
    "nation": "Argentina",
    "era": "2006",
    "position": "GK",
    "rarity": "epic",
    "ovr": 87,
    "stats": null,
    "gk": {
      "reflexes": 88,
      "handling": 85,
      "positioning": 88
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_juan-pablo-sorin",
    "name": "Juan Pablo Sorín",
    "nation": "Argentina",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_esteban-cambiasso",
    "name": "Esteban Cambiasso",
    "nation": "Argentina",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_juan-roman-riquelme",
    "name": "Juan Román Riquelme",
    "nation": "Argentina",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 99,
      "dribbling": 90,
      "defending": 65,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hernan-crespo",
    "name": "Hernán Crespo",
    "nation": "Argentina",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 94,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_javier-saviola",
    "name": "Javier Saviola",
    "nation": "Argentina",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 99,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_paul-robinson",
    "name": "Paul Robinson",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "GK",
    "rarity": "rare",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 83,
      "handling": 80,
      "positioning": 83
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gary-neville",
    "name": "Gary Neville",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_rio-ferdinand",
    "name": "Rio Ferdinand",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_john-terry",
    "name": "John Terry",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ashley-cole",
    "name": "Ashley Cole",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_david-beckham",
    "name": "David Beckham",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 99,
      "dribbling": 90,
      "defending": 85,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_frank-lampard",
    "name": "Frank Lampard",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 92,
      "passing": 92,
      "dribbling": 91,
      "defending": 88,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_joe-cole",
    "name": "Joe Cole",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_wayne-rooney",
    "name": "Wayne Rooney",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 90,
      "passing": 80,
      "dribbling": 84,
      "defending": 68,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_michael-owen",
    "name": "Michael Owen",
    "nation": "Inglaterra",
    "era": "2006",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 99,
      "shooting": 91,
      "passing": 81,
      "dribbling": 99,
      "defending": 69,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_oleksandr-shovkovskyi",
    "name": "Oleksandr Shovkovskyi",
    "nation": "Ucrania",
    "era": "2006",
    "position": "GK",
    "rarity": "common",
    "ovr": 70,
    "stats": null,
    "gk": {
      "reflexes": 71,
      "handling": 68,
      "positioning": 71
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_volodymyr-yezerskyi",
    "name": "Volodymyr Yezerskyi",
    "nation": "Ucrania",
    "era": "2006",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andriy-rusol",
    "name": "Andriy Rusol",
    "nation": "Ucrania",
    "era": "2006",
    "position": "DEF",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 68,
      "shooting": 56,
      "passing": 66,
      "dribbling": 64,
      "defending": 76,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andriy-sviderskyi",
    "name": "Andriy Sviderskyi",
    "nation": "Ucrania",
    "era": "2006",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andriy-nesmachnyi",
    "name": "Andriy Nesmachnyi",
    "nation": "Ucrania",
    "era": "2006",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_anatoliy-tymoshchuk",
    "name": "Anatoliy Tymoshchuk",
    "nation": "Ucrania",
    "era": "2006",
    "position": "MID",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 67,
      "shooting": 67,
      "passing": 73,
      "dribbling": 69,
      "defending": 66,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_oleh-shelayev",
    "name": "Oleh Shelayev",
    "nation": "Ucrania",
    "era": "2006",
    "position": "MID",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 68,
      "shooting": 68,
      "passing": 74,
      "dribbling": 70,
      "defending": 67,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_oleh-gusev",
    "name": "Oleh Gusev",
    "nation": "Ucrania",
    "era": "2006",
    "position": "MID",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 69,
      "shooting": 69,
      "passing": 75,
      "dribbling": 71,
      "defending": 68,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_andriy-voronin",
    "name": "Andriy Voronin",
    "nation": "Ucrania",
    "era": "2006",
    "position": "FWD",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 71,
      "shooting": 75,
      "passing": 65,
      "dribbling": 69,
      "defending": 53,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_andriy-shevchenko",
    "name": "Andriy Shevchenko",
    "nation": "Ucrania",
    "era": "2006",
    "position": "FWD",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 72,
      "shooting": 76,
      "passing": 66,
      "dribbling": 70,
      "defending": 54,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_artem-milevskyi",
    "name": "Artem Milevskyi",
    "nation": "Ucrania",
    "era": "2006",
    "position": "FWD",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 73,
      "shooting": 77,
      "passing": 67,
      "dribbling": 71,
      "defending": 55,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_marcos",
    "name": "Marcos",
    "nation": "Brasil",
    "era": "2002",
    "position": "GK",
    "rarity": "legend",
    "ovr": 95,
    "stats": null,
    "gk": {
      "reflexes": 96,
      "handling": 93,
      "positioning": 96
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_edmilson",
    "name": "Edmílson",
    "nation": "Brasil",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 94,
      "shooting": 82,
      "passing": 92,
      "dribbling": 90,
      "defending": 99,
      "physical": 98
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_kleberson",
    "name": "Kléberson",
    "nation": "Brasil",
    "era": "2002",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 95,
      "shooting": 86,
      "passing": 85,
      "dribbling": 86,
      "defending": 87,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_juninho-paulista",
    "name": "Juninho Paulista",
    "nation": "Brasil",
    "era": "2002",
    "position": "MID",
    "rarity": "legend",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 90,
      "dribbling": 89,
      "defending": 64,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_rivaldo",
    "name": "Rivaldo",
    "nation": "Brasil",
    "era": "2002",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 95,
      "shooting": 92,
      "passing": 96,
      "dribbling": 88,
      "defending": 69,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_carsten-ramelow",
    "name": "Carsten Ramelow",
    "nation": "Alemania",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 87,
      "shooting": 75,
      "passing": 85,
      "dribbling": 83,
      "defending": 95,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thomas-linke",
    "name": "Thomas Linke",
    "nation": "Alemania",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dietmar-hamann",
    "name": "Dietmar Hamann",
    "nation": "Alemania",
    "era": "2002",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jens-jeremies",
    "name": "Jens Jeremies",
    "nation": "Alemania",
    "era": "2002",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_oliver-neuville",
    "name": "Oliver Neuville",
    "nation": "Alemania",
    "era": "2002",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_rustu-recber",
    "name": "Rüştü Reçber",
    "nation": "Turquía",
    "era": "2002",
    "position": "GK",
    "rarity": "rare",
    "ovr": 80,
    "stats": null,
    "gk": {
      "reflexes": 81,
      "handling": 78,
      "positioning": 81
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fatih-akyel",
    "name": "Fatih Akyel",
    "nation": "Turquía",
    "era": "2002",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 74,
      "shooting": 62,
      "passing": 72,
      "dribbling": 70,
      "defending": 82,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_alpay-ozalan",
    "name": "Alpay Özalan",
    "nation": "Turquía",
    "era": "2002",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 75,
      "shooting": 63,
      "passing": 73,
      "dribbling": 71,
      "defending": 83,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_bulent-korkmaz",
    "name": "Bülent Korkmaz",
    "nation": "Turquía",
    "era": "2002",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_umit-davala",
    "name": "Ümit Davala",
    "nation": "Turquía",
    "era": "2002",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 74,
      "shooting": 62,
      "passing": 72,
      "dribbling": 70,
      "defending": 82,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_tugay-kerimoglu",
    "name": "Tugay Kerimoğlu",
    "nation": "Turquía",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 77,
      "shooting": 77,
      "passing": 83,
      "dribbling": 79,
      "defending": 76,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_y-ld-ray-basturk",
    "name": "Yıldıray Baştürk",
    "nation": "Turquía",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 78,
      "shooting": 78,
      "passing": 84,
      "dribbling": 80,
      "defending": 77,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_emre-belozoglu",
    "name": "Emre Belözoğlu",
    "nation": "Turquía",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hasan-sas",
    "name": "Hasan Şaş",
    "nation": "Turquía",
    "era": "2002",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 79,
      "shooting": 83,
      "passing": 73,
      "dribbling": 77,
      "defending": 61,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hakan-sukur",
    "name": "Hakan Şükür",
    "nation": "Turquía",
    "era": "2002",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 80,
      "shooting": 84,
      "passing": 74,
      "dribbling": 78,
      "defending": 62,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ilhan-mans-z",
    "name": "İlhan Mansız",
    "nation": "Turquía",
    "era": "2002",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_lee-woon-jae",
    "name": "Lee Woon-jae",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "GK",
    "rarity": "common",
    "ovr": 73,
    "stats": null,
    "gk": {
      "reflexes": 74,
      "handling": 71,
      "positioning": 74
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_hong-myung-bo",
    "name": "Hong Myung-bo",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_choi-jin-cheul",
    "name": "Choi Jin-cheul",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 70,
      "shooting": 58,
      "passing": 68,
      "dribbling": 66,
      "defending": 78,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_kim-tae-young",
    "name": "Kim Tae-young",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_song-chong-gug",
    "name": "Song Chong-gug",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_yoo-sang-chul",
    "name": "Yoo Sang-chul",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 72,
      "shooting": 72,
      "passing": 78,
      "dribbling": 74,
      "defending": 71,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_park-ji-sung",
    "name": "Park Ji-sung",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 75,
    "stats": {
      "pace": 73,
      "shooting": 73,
      "passing": 79,
      "dribbling": 75,
      "defending": 72,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_lee-young-pyo",
    "name": "Lee Young-pyo",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 74,
      "shooting": 74,
      "passing": 80,
      "dribbling": 76,
      "defending": 73,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ahn-jung-hwan",
    "name": "Ahn Jung-hwan",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 71,
      "shooting": 75,
      "passing": 65,
      "dribbling": 69,
      "defending": 53,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_seol-ki-hyeon",
    "name": "Seol Ki-hyeon",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 72,
      "shooting": 76,
      "passing": 66,
      "dribbling": 70,
      "defending": 54,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_cha-du-ri",
    "name": "Cha Du-ri",
    "nation": "Corea del Sur",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 73,
      "shooting": 77,
      "passing": 67,
      "dribbling": 71,
      "defending": 55,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ivan-helguera",
    "name": "Iván Helguera",
    "nation": "España",
    "era": "2002",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 80,
      "dribbling": 76,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fernando-hierro",
    "name": "Fernando Hierro",
    "nation": "España",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 99,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_juanfran-garcia",
    "name": "Juanfran García",
    "nation": "España",
    "era": "2002",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ruben-baraja",
    "name": "Rubén Baraja",
    "nation": "España",
    "era": "2002",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_juan-carlos-valeron",
    "name": "Juan Carlos Valerón",
    "nation": "España",
    "era": "2002",
    "position": "MID",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 82,
      "shooting": 82,
      "passing": 88,
      "dribbling": 84,
      "defending": 81,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_javier-de-pedro",
    "name": "Javier de Pedro",
    "nation": "España",
    "era": "2002",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_joaquin-sanchez",
    "name": "Joaquín Sánchez",
    "nation": "España",
    "era": "2002",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 83,
      "shooting": 87,
      "passing": 77,
      "dribbling": 81,
      "defending": 65,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_fernando-morientes",
    "name": "Fernando Morientes",
    "nation": "España",
    "era": "2002",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_raul-gonzalez",
    "name": "Raúl González",
    "nation": "España",
    "era": "2002",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 85,
      "shooting": 99,
      "passing": 92,
      "dribbling": 94,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_david-seaman",
    "name": "David Seaman",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "GK",
    "rarity": "rare",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 83,
      "handling": 80,
      "positioning": 83
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_danny-mills",
    "name": "Danny Mills",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_sol-campbell",
    "name": "Sol Campbell",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 99,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_nicky-butt",
    "name": "Nicky Butt",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_paul-scholes",
    "name": "Paul Scholes",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 84,
      "shooting": 99,
      "passing": 90,
      "dribbling": 86,
      "defending": 99,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_emile-heskey",
    "name": "Emile Heskey",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_trevor-sinclair",
    "name": "Trevor Sinclair",
    "nation": "Inglaterra",
    "era": "2002",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 90,
      "passing": 80,
      "dribbling": 84,
      "defending": 68,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_tony-sylva",
    "name": "Tony Sylva",
    "nation": "Senegal",
    "era": "2002",
    "position": "GK",
    "rarity": "common",
    "ovr": 68,
    "stats": null,
    "gk": {
      "reflexes": 69,
      "handling": 66,
      "positioning": 69
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ferdinand-coly",
    "name": "Ferdinand Coly",
    "nation": "Senegal",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_lamine-diatta",
    "name": "Lamine Diatta",
    "nation": "Senegal",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 66,
      "shooting": 54,
      "passing": 64,
      "dribbling": 62,
      "defending": 74,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_pape-malick-diop",
    "name": "Pape Malick Diop",
    "nation": "Senegal",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 67,
      "shooting": 55,
      "passing": 65,
      "dribbling": 63,
      "defending": 75,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_omar-daf",
    "name": "Omar Daf",
    "nation": "Senegal",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_aliou-cisse",
    "name": "Aliou Cissé",
    "nation": "Senegal",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 68,
      "shooting": 68,
      "passing": 74,
      "dribbling": 70,
      "defending": 67,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_khalilou-fadiga",
    "name": "Khalilou Fadiga",
    "nation": "Senegal",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 69,
      "shooting": 69,
      "passing": 75,
      "dribbling": 71,
      "defending": 68,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_papa-bouba-diop",
    "name": "Papa Bouba Diop",
    "nation": "Senegal",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 70,
      "shooting": 70,
      "passing": 76,
      "dribbling": 72,
      "defending": 69,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_el-hadji-diouf",
    "name": "El Hadji Diouf",
    "nation": "Senegal",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 70,
      "shooting": 74,
      "passing": 64,
      "dribbling": 68,
      "defending": 52,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_henri-camara",
    "name": "Henri Camara",
    "nation": "Senegal",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 71,
      "shooting": 75,
      "passing": 65,
      "dribbling": 69,
      "defending": 53,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_salif-diao",
    "name": "Salif Diao",
    "nation": "Senegal",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 72,
      "shooting": 76,
      "passing": 66,
      "dribbling": 70,
      "defending": 54,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_brad-friedel",
    "name": "Brad Friedel",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "GK",
    "rarity": "common",
    "ovr": 70,
    "stats": null,
    "gk": {
      "reflexes": 71,
      "handling": 68,
      "positioning": 71
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_tony-sanneh",
    "name": "Tony Sanneh",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_eddie-pope",
    "name": "Eddie Pope",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 65,
      "shooting": 53,
      "passing": 63,
      "dribbling": 61,
      "defending": 73,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gregg-berhalter",
    "name": "Gregg Berhalter",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 66,
      "shooting": 54,
      "passing": 64,
      "dribbling": 62,
      "defending": 74,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_frankie-hejduk",
    "name": "Frankie Hejduk",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "DEF",
    "rarity": "common",
    "ovr": 67,
    "stats": {
      "pace": 64,
      "shooting": 52,
      "passing": 62,
      "dribbling": 60,
      "defending": 72,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_claudio-reyna",
    "name": "Claudio Reyna",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 67,
      "shooting": 67,
      "passing": 73,
      "dribbling": 69,
      "defending": 66,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_john-obrien",
    "name": "John O’Brien",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 68,
      "shooting": 68,
      "passing": 74,
      "dribbling": 70,
      "defending": 67,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_landon-donovan",
    "name": "Landon Donovan",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "MID",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 69,
      "shooting": 69,
      "passing": 75,
      "dribbling": 71,
      "defending": 68,
      "physical": 69
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_brian-mcbride",
    "name": "Brian McBride",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 68,
    "stats": {
      "pace": 68,
      "shooting": 72,
      "passing": 62,
      "dribbling": 66,
      "defending": 50,
      "physical": 64
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_clint-mathis",
    "name": "Clint Mathis",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 69,
    "stats": {
      "pace": 69,
      "shooting": 73,
      "passing": 63,
      "dribbling": 67,
      "defending": 51,
      "physical": 65
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_damarcus-beasley",
    "name": "DaMarcus Beasley",
    "nation": "Estados Unidos",
    "era": "2002",
    "position": "FWD",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 70,
      "shooting": 74,
      "passing": 64,
      "dribbling": 68,
      "defending": 52,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marcel-desailly",
    "name": "Marcel Desailly",
    "nation": "Francia",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 83,
      "shooting": 62,
      "passing": 76,
      "dribbling": 80,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_laurent-blanc",
    "name": "Laurent Blanc",
    "nation": "Francia",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 86,
      "shooting": 72,
      "passing": 81,
      "dribbling": 80,
      "defending": 99,
      "physical": 99
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_bixente-lizarazu",
    "name": "Bixente Lizarazu",
    "nation": "Francia",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 90,
      "shooting": 80,
      "passing": 90,
      "dribbling": 80,
      "defending": 95,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_didier-deschamps",
    "name": "Didier Deschamps",
    "nation": "Francia",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 79,
      "passing": 89,
      "dribbling": 83,
      "defending": 89,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_emmanuel-petit",
    "name": "Emmanuel Petit",
    "nation": "Francia",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 77,
      "passing": 85,
      "dribbling": 80,
      "defending": 88,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_youri-djorkaeff",
    "name": "Youri Djorkaeff",
    "nation": "Francia",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 95,
      "shooting": 91,
      "passing": 85,
      "dribbling": 86,
      "defending": 70,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_stephane-guivarch",
    "name": "Stéphane Guivarc’h",
    "nation": "Francia",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 99,
      "passing": 80,
      "dribbling": 90,
      "defending": 60,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_aldair",
    "name": "Aldair",
    "nation": "Brasil",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 89,
      "shooting": 70,
      "passing": 78,
      "dribbling": 82,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_junior-baiano",
    "name": "Júnior Baiano",
    "nation": "Brasil",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 91,
      "shooting": 79,
      "passing": 89,
      "dribbling": 87,
      "defending": 99,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dunga",
    "name": "Dunga",
    "nation": "Brasil",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 93,
      "shooting": 93,
      "passing": 99,
      "dribbling": 95,
      "defending": 92,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_cesar-sampaio",
    "name": "César Sampaio",
    "nation": "Brasil",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 93,
      "shooting": 93,
      "passing": 99,
      "dribbling": 95,
      "defending": 92,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_bebeto",
    "name": "Bebeto",
    "nation": "Brasil",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 92,
      "passing": 84,
      "dribbling": 93,
      "defending": 72,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_leonardo",
    "name": "Leonardo",
    "nation": "Brasil",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 89,
      "shooting": 90,
      "passing": 80,
      "dribbling": 86,
      "defending": 70,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_drazen-ladic",
    "name": "Dražen Ladić",
    "nation": "Croacia",
    "era": "1998",
    "position": "GK",
    "rarity": "rare",
    "ovr": 83,
    "stats": null,
    "gk": {
      "reflexes": 84,
      "handling": 81,
      "positioning": 84
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_igor-stimac",
    "name": "Igor Štimac",
    "nation": "Croacia",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_slaven-bilic",
    "name": "Slaven Bilić",
    "nation": "Croacia",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_zvonimir-soldo",
    "name": "Zvonimir Soldo",
    "nation": "Croacia",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_robert-jarni",
    "name": "Robert Jarni",
    "nation": "Croacia",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_zvonimir-boban",
    "name": "Zvonimir Boban",
    "nation": "Croacia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_aljosa-asanovic",
    "name": "Aljoša Asanović",
    "nation": "Croacia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 84,
      "shooting": 84,
      "passing": 90,
      "dribbling": 86,
      "defending": 83,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_robert-prosinecki",
    "name": "Robert Prosinečki",
    "nation": "Croacia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_goran-vlaovic",
    "name": "Goran Vlaović",
    "nation": "Croacia",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 90,
      "passing": 80,
      "dribbling": 84,
      "defending": 68,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_mario-stanic",
    "name": "Mario Stanić",
    "nation": "Croacia",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 92,
      "passing": 82,
      "dribbling": 86,
      "defending": 70,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_edwin-van-der-sar",
    "name": "Edwin van der Sar",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "GK",
    "rarity": "legend",
    "ovr": 92,
    "stats": null,
    "gk": {
      "reflexes": 93,
      "handling": 90,
      "positioning": 93
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_michael-reiziger",
    "name": "Michael Reiziger",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jaap-stam",
    "name": "Jaap Stam",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_frank-de-boer",
    "name": "Frank de Boer",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 78,
      "passing": 88,
      "dribbling": 86,
      "defending": 98,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_arthur-numan",
    "name": "Arthur Numan",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_edgar-davids",
    "name": "Edgar Davids",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_phillip-cocu",
    "name": "Phillip Cocu",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 92,
      "shooting": 92,
      "passing": 98,
      "dribbling": 94,
      "defending": 91,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dennis-bergkamp",
    "name": "Dennis Bergkamp",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 93,
      "shooting": 93,
      "passing": 99,
      "dribbling": 95,
      "defending": 92,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marc-overmars",
    "name": "Marc Overmars",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 93,
      "shooting": 97,
      "passing": 87,
      "dribbling": 91,
      "defending": 75,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_patrick-kluivert",
    "name": "Patrick Kluivert",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 98,
      "passing": 88,
      "dribbling": 92,
      "defending": 76,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ronald-de-boer",
    "name": "Ronald de Boer",
    "nation": "Países Bajos",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 89,
      "dribbling": 93,
      "defending": 77,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_gianluca-pagliuca",
    "name": "Gianluca Pagliuca",
    "nation": "Italia",
    "era": "1994",
    "position": "GK",
    "rarity": "legend",
    "ovr": 91,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 89,
      "positioning": 92
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_giuseppe-bergomi",
    "name": "Giuseppe Bergomi",
    "nation": "Italia",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_alessandro-costacurta",
    "name": "Alessandro Costacurta",
    "nation": "Italia",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_demetrio-albertini",
    "name": "Demetrio Albertini",
    "nation": "Italia",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_luigi-di-biagio",
    "name": "Luigi Di Biagio",
    "nation": "Italia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_roberto-di-matteo",
    "name": "Roberto Di Matteo",
    "nation": "Italia",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_alessandro-del-piero",
    "name": "Alessandro Del Piero",
    "nation": "Italia",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 92,
      "shooting": 93,
      "passing": 87,
      "dribbling": 94,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_christian-vieri",
    "name": "Christian Vieri",
    "nation": "Italia",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_carlos-roa",
    "name": "Carlos Roa",
    "nation": "Argentina",
    "era": "1998",
    "position": "GK",
    "rarity": "epic",
    "ovr": 86,
    "stats": null,
    "gk": {
      "reflexes": 87,
      "handling": 84,
      "positioning": 87
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_javier-zanetti",
    "name": "Javier Zanetti",
    "nation": "Argentina",
    "era": "1998",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 91,
      "shooting": 71,
      "passing": 86,
      "dribbling": 86,
      "defending": 91,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_roberto-sensini",
    "name": "Roberto Sensini",
    "nation": "Argentina",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-chamot",
    "name": "José Chamot",
    "nation": "Argentina",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_diego-simeone",
    "name": "Diego Simeone",
    "nation": "Argentina",
    "era": "1998",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_juan-sebastian-veron",
    "name": "Juan Sebastián Verón",
    "nation": "Argentina",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 92,
      "shooting": 95,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ariel-ortega",
    "name": "Ariel Ortega",
    "nation": "Argentina",
    "era": "1998",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 99,
      "shooting": 87,
      "passing": 93,
      "dribbling": 99,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_claudio-lopez",
    "name": "Claudio López",
    "nation": "Argentina",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marcelo-gallardo",
    "name": "Marcelo Gallardo",
    "nation": "Argentina",
    "era": "1998",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 96,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_andreas-kopke",
    "name": "Andreas Köpke",
    "nation": "Alemania",
    "era": "1998",
    "position": "GK",
    "rarity": "rare",
    "ovr": 83,
    "stats": null,
    "gk": {
      "reflexes": 84,
      "handling": 81,
      "positioning": 84
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_stefan-reuter",
    "name": "Stefan Reuter",
    "nation": "Alemania",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jurgen-kohler",
    "name": "Jürgen Kohler",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 84,
      "passing": 87,
      "dribbling": 88,
      "defending": 90,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_christian-ziege",
    "name": "Christian Ziege",
    "nation": "Alemania",
    "era": "1998",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_thomas-ha-ler",
    "name": "Thomas Häßler",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 85,
    "stats": {
      "pace": 84,
      "shooting": 86,
      "passing": 85,
      "dribbling": 86,
      "defending": 83,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_andreas-moller",
    "name": "Andreas Möller",
    "nation": "Alemania",
    "era": "1994",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_oliver-bierhoff",
    "name": "Oliver Bierhoff",
    "nation": "Alemania",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ulf-kirsten",
    "name": "Ulf Kirsten",
    "nation": "Alemania",
    "era": "1998",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 90,
      "passing": 80,
      "dribbling": 84,
      "defending": 68,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thomas-helveg",
    "name": "Thomas Helveg",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marc-rieper",
    "name": "Marc Rieper",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 75,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 70,
      "dribbling": 68,
      "defending": 80,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thomas-h-gh",
    "name": "Thomas Høgh",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 73,
      "shooting": 61,
      "passing": 71,
      "dribbling": 69,
      "defending": 81,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jan-heintze",
    "name": "Jan Heintze",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_allan-nielsen",
    "name": "Allan Nielsen",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "MID",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 74,
      "shooting": 74,
      "passing": 80,
      "dribbling": 76,
      "defending": 73,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_morten-wieghorst",
    "name": "Morten Wieghorst",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "MID",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 75,
      "shooting": 75,
      "passing": 81,
      "dribbling": 77,
      "defending": 74,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_michael-laudrup",
    "name": "Michael Laudrup",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "MID",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 76,
      "shooting": 76,
      "passing": 82,
      "dribbling": 78,
      "defending": 75,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_brian-laudrup",
    "name": "Brian Laudrup",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ebbe-sand",
    "name": "Ebbe Sand",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_jon-dahl-tomasson",
    "name": "Jon Dahl Tomasson",
    "nation": "Dinamarca",
    "era": "1998",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 78,
      "shooting": 82,
      "passing": 72,
      "dribbling": 76,
      "defending": 60,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jorginho",
    "name": "Jorginho",
    "nation": "Brasil",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 92,
      "shooting": 80,
      "passing": 90,
      "dribbling": 88,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_marcio-santos",
    "name": "Márcio Santos",
    "nation": "Brasil",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 94,
      "shooting": 60,
      "passing": 70,
      "dribbling": 80,
      "defending": 99,
      "physical": 98
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_branco",
    "name": "Branco",
    "nation": "Brasil",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 90,
      "shooting": 80,
      "passing": 86,
      "dribbling": 79,
      "defending": 88,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_mauro-silva",
    "name": "Mauro Silva",
    "nation": "Brasil",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 94,
      "shooting": 80,
      "passing": 88,
      "dribbling": 85,
      "defending": 86,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_rai",
    "name": "Raí",
    "nation": "Brasil",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 90,
      "passing": 90,
      "dribbling": 97,
      "defending": 80,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_zinho",
    "name": "Zinho",
    "nation": "Brasil",
    "era": "1994",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 89,
      "shooting": 87,
      "passing": 87,
      "dribbling": 86,
      "defending": 81,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_roberto-mussi",
    "name": "Roberto Mussi",
    "nation": "Italia",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 90,
      "shooting": 78,
      "passing": 74,
      "dribbling": 73,
      "defending": 90,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_antonio-benarrivo",
    "name": "Antonio Benarrivo",
    "nation": "Italia",
    "era": "1994",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 90,
      "shooting": 78,
      "passing": 75,
      "dribbling": 75,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dino-baggio",
    "name": "Dino Baggio",
    "nation": "Italia",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_roberto-donadoni",
    "name": "Roberto Donadoni",
    "nation": "Italia",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 92,
      "shooting": 92,
      "passing": 98,
      "dribbling": 94,
      "defending": 91,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_daniele-massaro",
    "name": "Daniele Massaro",
    "nation": "Italia",
    "era": "1994",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 90,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_giuseppe-signori",
    "name": "Giuseppe Signori",
    "nation": "Italia",
    "era": "1994",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 95,
      "shooting": 99,
      "passing": 75,
      "dribbling": 80,
      "defending": 77,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_thomas-ravelli",
    "name": "Thomas Ravelli",
    "nation": "Suecia",
    "era": "1994",
    "position": "GK",
    "rarity": "rare",
    "ovr": 81,
    "stats": null,
    "gk": {
      "reflexes": 82,
      "handling": 79,
      "positioning": 82
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_roland-nilsson",
    "name": "Roland Nilsson",
    "nation": "Suecia",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_patrik-andersson",
    "name": "Patrik Andersson",
    "nation": "Suecia",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_joachim-bjorklund",
    "name": "Joachim Björklund",
    "nation": "Suecia",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 78,
      "shooting": 66,
      "passing": 76,
      "dribbling": 74,
      "defending": 86,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_roger-ljung",
    "name": "Roger Ljung",
    "nation": "Suecia",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_stefan-schwarz",
    "name": "Stefan Schwarz",
    "nation": "Suecia",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 78,
      "shooting": 78,
      "passing": 84,
      "dribbling": 80,
      "defending": 77,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jonas-thern",
    "name": "Jonas Thern",
    "nation": "Suecia",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_klas-ingesson",
    "name": "Klas Ingesson",
    "nation": "Suecia",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_tomas-brolin",
    "name": "Tomas Brolin",
    "nation": "Suecia",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_kennet-andersson",
    "name": "Kennet Andersson",
    "nation": "Suecia",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 83,
      "shooting": 87,
      "passing": 77,
      "dribbling": 81,
      "defending": 65,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_martin-dahlin",
    "name": "Martin Dahlin",
    "nation": "Suecia",
    "era": "1994",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_borislav-mihaylov",
    "name": "Borislav Mihaylov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "GK",
    "rarity": "rare",
    "ovr": 77,
    "stats": null,
    "gk": {
      "reflexes": 78,
      "handling": 75,
      "positioning": 78
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_emil-kremenliev",
    "name": "Emil Kremenliev",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 73,
      "shooting": 61,
      "passing": 71,
      "dribbling": 69,
      "defending": 81,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_trifon-ivanov",
    "name": "Trifon Ivanov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 74,
      "shooting": 62,
      "passing": 72,
      "dribbling": 70,
      "defending": 82,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_petar-hubchev",
    "name": "Petar Hubchev",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 75,
      "shooting": 63,
      "passing": 73,
      "dribbling": 71,
      "defending": 83,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_tsanko-tsvetanov",
    "name": "Tsanko Tsvetanov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 73,
      "shooting": 61,
      "passing": 71,
      "dribbling": 69,
      "defending": 81,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_krasimir-balakov",
    "name": "Krasimir Balakov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 77,
      "shooting": 77,
      "passing": 83,
      "dribbling": 79,
      "defending": 76,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_yordan-letchkov",
    "name": "Yordan Letchkov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 78,
      "shooting": 78,
      "passing": 84,
      "dribbling": 80,
      "defending": 77,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_zlatko-yankov",
    "name": "Zlatko Yankov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 79,
      "shooting": 79,
      "passing": 85,
      "dribbling": 81,
      "defending": 78,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_emil-kostadinov",
    "name": "Emil Kostadinov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_nasko-sirakov",
    "name": "Nasko Sirakov",
    "nation": "Bulgaria",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_bodo-illgner",
    "name": "Bodo Illgner",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "GK",
    "rarity": "epic",
    "ovr": 87,
    "stats": null,
    "gk": {
      "reflexes": 85,
      "handling": 85,
      "positioning": 90
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thomas-berthold",
    "name": "Thomas Berthold",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 96,
    "stats": {
      "pace": 93,
      "shooting": 81,
      "passing": 91,
      "dribbling": 89,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andreas-brehme",
    "name": "Andreas Brehme",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 81,
      "passing": 86,
      "dribbling": 89,
      "defending": 92,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_stefan-effenberg",
    "name": "Stefan Effenberg",
    "nation": "Alemania",
    "era": "1994",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_rudi-voller",
    "name": "Rudi Völler",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 84,
      "dribbling": 88,
      "defending": 76,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_karl-heinz-riedle",
    "name": "Karl-Heinz Riedle",
    "nation": "Alemania",
    "era": "1994",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_ed-de-goey",
    "name": "Ed de Goey",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "GK",
    "rarity": "epic",
    "ovr": 84,
    "stats": null,
    "gk": {
      "reflexes": 85,
      "handling": 82,
      "positioning": 85
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ulrich-van-gobbel",
    "name": "Ulrich van Gobbel",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_danny-blind",
    "name": "Danny Blind",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_wim-jonk",
    "name": "Wim Jonk",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_richard-witschge",
    "name": "Richard Witschge",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_bryan-roy",
    "name": "Bryan Roy",
    "nation": "Países Bajos",
    "era": "1994",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_florin-prunea",
    "name": "Florin Prunea",
    "nation": "Rumanía",
    "era": "1994",
    "position": "GK",
    "rarity": "common",
    "ovr": 73,
    "stats": null,
    "gk": {
      "reflexes": 74,
      "handling": 71,
      "positioning": 74
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_dan-petrescu",
    "name": "Dan Petrescu",
    "nation": "Rumanía",
    "era": "1994",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_daniel-prodan",
    "name": "Daniel Prodan",
    "nation": "Rumanía",
    "era": "1994",
    "position": "DEF",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 70,
      "shooting": 58,
      "passing": 68,
      "dribbling": 66,
      "defending": 78,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_miodrag-belodedici",
    "name": "Miodrag Belodedici",
    "nation": "Rumanía",
    "era": "1994",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_tibor-selymes",
    "name": "Tibor Selymes",
    "nation": "Rumanía",
    "era": "1994",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ioan-lupescu",
    "name": "Ioan Lupescu",
    "nation": "Rumanía",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 74,
      "shooting": 74,
      "passing": 80,
      "dribbling": 76,
      "defending": 73,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_gheorghe-popescu",
    "name": "Gheorghe Popescu",
    "nation": "Rumanía",
    "era": "1994",
    "position": "MID",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 75,
      "shooting": 75,
      "passing": 81,
      "dribbling": 77,
      "defending": 74,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marius-lacatus",
    "name": "Marius Lăcătuș",
    "nation": "Rumanía",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_florin-raducioiu",
    "name": "Florin Răducioiu",
    "nation": "Rumanía",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ilie-dumitrescu",
    "name": "Ilie Dumitrescu",
    "nation": "Rumanía",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 78,
      "shooting": 82,
      "passing": 72,
      "dribbling": 76,
      "defending": 60,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_andoni-zubizarreta",
    "name": "Andoni Zubizarreta",
    "nation": "España",
    "era": "1994",
    "position": "GK",
    "rarity": "rare",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 83,
      "handling": 80,
      "positioning": 83
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_albert-ferrer",
    "name": "Albert Ferrer",
    "nation": "España",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_abelardo-fernandez",
    "name": "Abelardo Fernández",
    "nation": "España",
    "era": "1994",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_sergi-barjuan",
    "name": "Sergi Barjuán",
    "nation": "España",
    "era": "1994",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_pep-guardiola",
    "name": "Pep Guardiola",
    "nation": "España",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 82,
      "passing": 99,
      "dribbling": 90,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_luis-enrique",
    "name": "Luis Enrique",
    "nation": "España",
    "era": "1994",
    "position": "MID",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 95,
      "dribbling": 85,
      "defending": 99,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": "posesion"
  },
  {
    "id": "gen_mid_jon-andoni-goikoetxea",
    "name": "Jon Andoni Goikoetxea",
    "nation": "España",
    "era": "1994",
    "position": "MID",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 84,
      "shooting": 84,
      "passing": 90,
      "dribbling": 86,
      "defending": 83,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_jose-luis-caminero",
    "name": "José Luis Caminero",
    "nation": "España",
    "era": "1994",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_julio-salinas",
    "name": "Julio Salinas",
    "nation": "España",
    "era": "1986",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_txiki-begiristain",
    "name": "Txiki Begiristain",
    "nation": "España",
    "era": "1994",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_klaus-augenthaler",
    "name": "Klaus Augenthaler",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 86,
      "shooting": 80,
      "passing": 74,
      "dribbling": 90,
      "defending": 90,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_pierre-littbarski",
    "name": "Pierre Littbarski",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 87,
      "shooting": 85,
      "passing": 89,
      "dribbling": 88,
      "defending": 76,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_thomas-bein",
    "name": "Uwe Bein",
    "nation": "Alemania Occidental",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 91,
      "shooting": 88,
      "passing": 88,
      "dribbling": 88,
      "defending": 81,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_sergio-goycochea",
    "name": "Sergio Goycochea",
    "nation": "Argentina",
    "era": "1990",
    "position": "GK",
    "rarity": "legend",
    "ovr": 91,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 89,
      "positioning": 92
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-basualdo",
    "name": "José Basualdo",
    "nation": "Argentina",
    "era": "1990",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 86,
      "shooting": 74,
      "passing": 84,
      "dribbling": 82,
      "defending": 94,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_oscar-ruggeri",
    "name": "Oscar Ruggeri",
    "nation": "Argentina",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 93,
      "shooting": 69,
      "passing": 83,
      "dribbling": 75,
      "defending": 99,
      "physical": 97
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_juan-simon",
    "name": "Juan Simón",
    "nation": "Argentina",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_julio-olarticoechea",
    "name": "Julio Olarticoechea",
    "nation": "Argentina",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 84,
      "shooting": 77,
      "passing": 84,
      "dribbling": 87,
      "defending": 91,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ricardo-giusti",
    "name": "Ricardo Giusti",
    "nation": "Argentina",
    "era": "1990",
    "position": "MID",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 93,
      "dribbling": 89,
      "defending": 86,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jorge-burruchaga",
    "name": "Jorge Burruchaga",
    "nation": "Argentina",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 89,
      "shooting": 83,
      "passing": 87,
      "dribbling": 89,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_pedro-troglio",
    "name": "Pedro Troglio",
    "nation": "Argentina",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_claudio-caniggia",
    "name": "Claudio Caniggia",
    "nation": "Argentina",
    "era": "1990",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 90,
      "shooting": 94,
      "passing": 84,
      "dribbling": 88,
      "defending": 72,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_gustavo-dezotti",
    "name": "Gustavo Dezotti",
    "nation": "Argentina",
    "era": "1990",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 91,
      "shooting": 95,
      "passing": 85,
      "dribbling": 89,
      "defending": 73,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_walter-zenga",
    "name": "Walter Zenga",
    "nation": "Italia",
    "era": "1990",
    "position": "GK",
    "rarity": "legend",
    "ovr": 93,
    "stats": null,
    "gk": {
      "reflexes": 94,
      "handling": 91,
      "positioning": 94
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_riccardo-ferri",
    "name": "Riccardo Ferri",
    "nation": "Italia",
    "era": "1990",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 86,
    "stats": {
      "pace": 91,
      "shooting": 66,
      "passing": 77,
      "dribbling": 66,
      "defending": 90,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_fernando-de-napoli",
    "name": "Fernando De Napoli",
    "nation": "Italia",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 89,
      "shooting": 89,
      "passing": 95,
      "dribbling": 91,
      "defending": 88,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_giuseppe-giannini",
    "name": "Giuseppe Giannini",
    "nation": "Italia",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 90,
      "shooting": 90,
      "passing": 96,
      "dribbling": 92,
      "defending": 89,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_gianluca-vialli",
    "name": "Gianluca Vialli",
    "nation": "Italia",
    "era": "1990",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 85,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 78,
      "dribbling": 82,
      "defending": 66,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_peter-shilton",
    "name": "Peter Shilton",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "GK",
    "rarity": "epic",
    "ovr": 86,
    "stats": null,
    "gk": {
      "reflexes": 87,
      "handling": 84,
      "positioning": 87
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_gary-stevens",
    "name": "Gary Stevens",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_des-walker",
    "name": "Des Walker",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 84,
      "shooting": 72,
      "passing": 82,
      "dribbling": 80,
      "defending": 92,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_terry-butcher",
    "name": "Terry Butcher",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 73,
      "passing": 83,
      "dribbling": 81,
      "defending": 93,
      "physical": 89
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_stuart-pearce",
    "name": "Stuart Pearce",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 83,
      "shooting": 71,
      "passing": 81,
      "dribbling": 79,
      "defending": 91,
      "physical": 87
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_david-platt",
    "name": "David Platt",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "MID",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 92,
      "dribbling": 88,
      "defending": 85,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_paul-gascoigne",
    "name": "Paul Gascoigne",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "MID",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 87,
      "shooting": 87,
      "passing": 99,
      "dribbling": 89,
      "defending": 90,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_chris-waddle",
    "name": "Chris Waddle",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "MID",
    "rarity": "epic",
    "ovr": 90,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 94,
      "dribbling": 90,
      "defending": 87,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_peter-beardsley",
    "name": "Peter Beardsley",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 88,
    "stats": {
      "pace": 88,
      "shooting": 92,
      "passing": 82,
      "dribbling": 86,
      "defending": 70,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_john-barnes",
    "name": "John Barnes",
    "nation": "Inglaterra",
    "era": "1990",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 89,
    "stats": {
      "pace": 89,
      "shooting": 93,
      "passing": 83,
      "dribbling": 87,
      "defending": 71,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_packie-bonner",
    "name": "Packie Bonner",
    "nation": "Irlanda",
    "era": "1990",
    "position": "GK",
    "rarity": "common",
    "ovr": 72,
    "stats": null,
    "gk": {
      "reflexes": 73,
      "handling": 70,
      "positioning": 73
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_chris-morris",
    "name": "Chris Morris",
    "nation": "Irlanda",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 68,
      "shooting": 56,
      "passing": 66,
      "dribbling": 64,
      "defending": 76,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_mick-mccarthy",
    "name": "Mick McCarthy",
    "nation": "Irlanda",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_kevin-moran",
    "name": "Kevin Moran",
    "nation": "Irlanda",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 70,
      "shooting": 58,
      "passing": 68,
      "dribbling": 66,
      "defending": 78,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_steve-staunton",
    "name": "Steve Staunton",
    "nation": "Irlanda",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 68,
      "shooting": 56,
      "passing": 66,
      "dribbling": 64,
      "defending": 76,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ray-houghton",
    "name": "Ray Houghton",
    "nation": "Irlanda",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 70,
      "shooting": 70,
      "passing": 76,
      "dribbling": 72,
      "defending": 69,
      "physical": 70
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_andy-townsend",
    "name": "Andy Townsend",
    "nation": "Irlanda",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 71,
      "shooting": 71,
      "passing": 77,
      "dribbling": 73,
      "defending": 70,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_paul-mcgrath",
    "name": "Paul McGrath",
    "nation": "Irlanda",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 72,
      "shooting": 72,
      "passing": 78,
      "dribbling": 74,
      "defending": 71,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_john-aldridge",
    "name": "John Aldridge",
    "nation": "Irlanda",
    "era": "1990",
    "position": "FWD",
    "rarity": "common",
    "ovr": 70,
    "stats": {
      "pace": 70,
      "shooting": 74,
      "passing": 64,
      "dribbling": 68,
      "defending": 52,
      "physical": 66
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_niall-quinn",
    "name": "Niall Quinn",
    "nation": "Irlanda",
    "era": "1990",
    "position": "FWD",
    "rarity": "common",
    "ovr": 71,
    "stats": {
      "pace": 71,
      "shooting": 75,
      "passing": 65,
      "dribbling": 69,
      "defending": 53,
      "physical": 67
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_kevin-sheedy",
    "name": "Kevin Sheedy",
    "nation": "Irlanda",
    "era": "1990",
    "position": "FWD",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 72,
      "shooting": 76,
      "passing": 66,
      "dribbling": 70,
      "defending": 54,
      "physical": 68
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_tomislav-ivkovic",
    "name": "Tomislav Ivković",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "GK",
    "rarity": "rare",
    "ovr": 79,
    "stats": null,
    "gk": {
      "reflexes": 80,
      "handling": 77,
      "positioning": 80
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_faruk-hadzibegic",
    "name": "Faruk Hadžibegić",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 75,
      "shooting": 63,
      "passing": 73,
      "dribbling": 71,
      "defending": 83,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_refik-sabanadzovic",
    "name": "Refik Šabanadžović",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_davor-jozic",
    "name": "Davor Jozić",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_vujadin-stanojkovic",
    "name": "Vujadin Stanojković",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 75,
      "shooting": 63,
      "passing": 73,
      "dribbling": 71,
      "defending": 83,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_dragan-stojkovic",
    "name": "Dragan Stojković",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_safet-susic",
    "name": "Safet Sušić",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_srecko-katanec",
    "name": "Srečko Katanec",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "MID",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 82,
      "shooting": 82,
      "passing": 88,
      "dribbling": 84,
      "defending": 81,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_darko-pancev",
    "name": "Darko Pančev",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 80,
      "shooting": 84,
      "passing": 74,
      "dribbling": 78,
      "defending": 62,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_dejan-savicevic",
    "name": "Dejan Savićević",
    "nation": "Yugoslavia",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_jan-stejskal",
    "name": "Jan Stejskal",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "GK",
    "rarity": "rare",
    "ovr": 76,
    "stats": null,
    "gk": {
      "reflexes": 77,
      "handling": 74,
      "positioning": 77
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_miroslav-kadlec",
    "name": "Miroslav Kadlec",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 75,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 70,
      "dribbling": 68,
      "defending": 80,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jan-kocian",
    "name": "Ján Kocian",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 73,
      "shooting": 61,
      "passing": 71,
      "dribbling": 69,
      "defending": 81,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_frantisek-straka",
    "name": "František Straka",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 74,
      "shooting": 62,
      "passing": 72,
      "dribbling": 70,
      "defending": 82,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_michal-bilek",
    "name": "Michal Bílek",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 75,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 70,
      "dribbling": 68,
      "defending": 80,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_ivan-hasek",
    "name": "Ivan Hašek",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "MID",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 75,
      "shooting": 75,
      "passing": 81,
      "dribbling": 77,
      "defending": 74,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_lubomir-kubik",
    "name": "Lubomír Kubík",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "MID",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 76,
      "shooting": 76,
      "passing": 82,
      "dribbling": 78,
      "defending": 75,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jozef-chovanec",
    "name": "Jozef Chovanec",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "MID",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 77,
      "shooting": 77,
      "passing": 83,
      "dribbling": 79,
      "defending": 76,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_tomas-skuhravy",
    "name": "Tomáš Skuhravý",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_ivo-knoflicek",
    "name": "Ivo Knoflíček",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 78,
      "shooting": 82,
      "passing": 72,
      "dribbling": 76,
      "defending": 60,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_lubomir-moravcik",
    "name": "Ľubomír Moravčík",
    "nation": "Checoslovaquia",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 79,
      "shooting": 83,
      "passing": 73,
      "dribbling": 77,
      "defending": 61,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_thomas-nkono",
    "name": "Thomas N’Kono",
    "nation": "Camerún",
    "era": "1990",
    "position": "GK",
    "rarity": "common",
    "ovr": 75,
    "stats": null,
    "gk": {
      "reflexes": 76,
      "handling": 73,
      "positioning": 76
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_stephen-tataw",
    "name": "Stephen Tataw",
    "nation": "Camerún",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_emmanuel-kunde",
    "name": "Emmanuel Kundé",
    "nation": "Camerún",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 70,
      "shooting": 58,
      "passing": 68,
      "dribbling": 66,
      "defending": 78,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_benjamin-massing",
    "name": "Benjamin Massing",
    "nation": "Camerún",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_bertin-ebwelle",
    "name": "Bertin Ebwelle",
    "nation": "Camerún",
    "era": "1990",
    "position": "DEF",
    "rarity": "common",
    "ovr": 72,
    "stats": {
      "pace": 69,
      "shooting": 57,
      "passing": 67,
      "dribbling": 65,
      "defending": 77,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_emile-mbouh",
    "name": "Émile Mbouh",
    "nation": "Camerún",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 73,
    "stats": {
      "pace": 71,
      "shooting": 71,
      "passing": 77,
      "dribbling": 73,
      "defending": 70,
      "physical": 71
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_cyrille-makanaky",
    "name": "Cyrille Makanaky",
    "nation": "Camerún",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 72,
      "shooting": 72,
      "passing": 78,
      "dribbling": 74,
      "defending": 71,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_louis-paul-mfede",
    "name": "Louis-Paul Mfédé",
    "nation": "Camerún",
    "era": "1990",
    "position": "MID",
    "rarity": "common",
    "ovr": 75,
    "stats": {
      "pace": 73,
      "shooting": 73,
      "passing": 79,
      "dribbling": 75,
      "defending": 72,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_francois-omam-biyik",
    "name": "François Omam-Biyik",
    "nation": "Camerún",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_andre-kana-biyik",
    "name": "André Kana-Biyik",
    "nation": "Camerún",
    "era": "1990",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_nery-pumpido",
    "name": "Nery Pumpido",
    "nation": "Argentina",
    "era": "1986",
    "position": "GK",
    "rarity": "legend",
    "ovr": 88,
    "stats": null,
    "gk": {
      "reflexes": 89,
      "handling": 88,
      "positioning": 86
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-luis-brown",
    "name": "José Luis Brown",
    "nation": "Argentina",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 92,
      "shooting": 80,
      "passing": 90,
      "dribbling": 88,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-cuciuffo",
    "name": "José Cuciuffo",
    "nation": "Argentina",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 77,
      "passing": 78,
      "dribbling": 77,
      "defending": 99,
      "physical": 98
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_sergio-batista",
    "name": "Sergio Batista",
    "nation": "Argentina",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 80,
      "passing": 99,
      "dribbling": 90,
      "defending": 90,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_hector-enrique",
    "name": "Héctor Enrique",
    "nation": "Argentina",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 89,
      "dribbling": 88,
      "defending": 85,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_jorge-valdano",
    "name": "Jorge Valdano",
    "nation": "Argentina",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 99,
      "shooting": 99,
      "passing": 85,
      "dribbling": 85,
      "defending": 74,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_pedro-pasculli",
    "name": "Pedro Pasculli",
    "nation": "Argentina",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 87,
    "stats": {
      "pace": 88,
      "shooting": 91,
      "passing": 81,
      "dribbling": 86,
      "defending": 70,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_harald-schumacher",
    "name": "Harald Schumacher",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "GK",
    "rarity": "legend",
    "ovr": 94,
    "stats": null,
    "gk": {
      "reflexes": 95,
      "handling": 92,
      "positioning": 95
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_karlheinz-forster",
    "name": "Karlheinz Förster",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 91,
      "shooting": 79,
      "passing": 89,
      "dribbling": 87,
      "defending": 99,
      "physical": 95
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_ditmar-jakobs",
    "name": "Ditmar Jakobs",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 92,
      "shooting": 80,
      "passing": 90,
      "dribbling": 88,
      "defending": 99,
      "physical": 96
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_felix-magath",
    "name": "Felix Magath",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 92,
      "shooting": 92,
      "passing": 98,
      "dribbling": 94,
      "defending": 91,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_norbert-eder",
    "name": "Norbert Eder",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 93,
      "shooting": 93,
      "passing": 99,
      "dribbling": 95,
      "defending": 92,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_karl-heinz-rummenigge",
    "name": "Karl-Heinz Rummenigge",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 94,
    "stats": {
      "pace": 94,
      "shooting": 98,
      "passing": 88,
      "dribbling": 92,
      "defending": 76,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_klaus-allofs",
    "name": "Klaus Allofs",
    "nation": "Alemania Occidental",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 96,
      "shooting": 99,
      "passing": 90,
      "dribbling": 94,
      "defending": 78,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_joel-bats",
    "name": "Joël Bats",
    "nation": "Francia",
    "era": "1986",
    "position": "GK",
    "rarity": "legend",
    "ovr": 91,
    "stats": null,
    "gk": {
      "reflexes": 92,
      "handling": 89,
      "positioning": 92
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_manuel-amoros",
    "name": "Manuel Amoros",
    "nation": "Francia",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_patrick-battiston",
    "name": "Patrick Battiston",
    "nation": "Francia",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 89,
      "shooting": 77,
      "passing": 87,
      "dribbling": 85,
      "defending": 97,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_maxime-bossis",
    "name": "Maxime Bossis",
    "nation": "Francia",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 90,
      "shooting": 78,
      "passing": 88,
      "dribbling": 86,
      "defending": 98,
      "physical": 94
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_thierry-tusseau",
    "name": "Thierry Tusseau",
    "nation": "Francia",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jean-tigana",
    "name": "Jean Tigana",
    "nation": "Francia",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 89,
    "stats": {
      "pace": 88,
      "shooting": 88,
      "passing": 90,
      "dribbling": 88,
      "defending": 90,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_luis-fernandez",
    "name": "Luis Fernández",
    "nation": "Francia",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 87,
    "stats": {
      "pace": 89,
      "shooting": 84,
      "passing": 89,
      "dribbling": 87,
      "defending": 85,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_alain-giresse",
    "name": "Alain Giresse",
    "nation": "Francia",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 88,
    "stats": {
      "pace": 86,
      "shooting": 86,
      "passing": 91,
      "dribbling": 89,
      "defending": 89,
      "physical": 79
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_dominique-rocheteau",
    "name": "Dominique Rocheteau",
    "nation": "Francia",
    "era": "1986",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 87,
      "shooting": 90,
      "passing": 80,
      "dribbling": 80,
      "defending": 60,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_yannick-stopyra",
    "name": "Yannick Stopyra",
    "nation": "Francia",
    "era": "1986",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 84,
      "shooting": 88,
      "passing": 74,
      "dribbling": 82,
      "defending": 66,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_jean-marie-pfaff",
    "name": "Jean-Marie Pfaff",
    "nation": "Bélgica",
    "era": "1986",
    "position": "GK",
    "rarity": "rare",
    "ovr": 82,
    "stats": null,
    "gk": {
      "reflexes": 83,
      "handling": 80,
      "positioning": 83
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_eric-gerets",
    "name": "Eric Gerets",
    "nation": "Bélgica",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_michel-renquin",
    "name": "Michel Renquin",
    "nation": "Bélgica",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 77,
      "shooting": 65,
      "passing": 75,
      "dribbling": 73,
      "defending": 85,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_stephane-demol",
    "name": "Stéphane Demol",
    "nation": "Bélgica",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 78,
      "shooting": 66,
      "passing": 76,
      "dribbling": 74,
      "defending": 86,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_georges-grun",
    "name": "Georges Grün",
    "nation": "Bélgica",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 79,
    "stats": {
      "pace": 76,
      "shooting": 64,
      "passing": 74,
      "dribbling": 72,
      "defending": 84,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_enzo-scifo",
    "name": "Enzo Scifo",
    "nation": "Bélgica",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 80,
      "shooting": 80,
      "passing": 86,
      "dribbling": 82,
      "defending": 79,
      "physical": 80
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_jan-ceulemans",
    "name": "Jan Ceulemans",
    "nation": "Bélgica",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_franky-vercauteren",
    "name": "Franky Vercauteren",
    "nation": "Bélgica",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 82,
      "shooting": 82,
      "passing": 88,
      "dribbling": 84,
      "defending": 81,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_nico-claesen",
    "name": "Nico Claesen",
    "nation": "Bélgica",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 80,
    "stats": {
      "pace": 80,
      "shooting": 84,
      "passing": 74,
      "dribbling": 78,
      "defending": 62,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_erwin-vandenbergh",
    "name": "Erwin Vandenbergh",
    "nation": "Bélgica",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 81,
    "stats": {
      "pace": 81,
      "shooting": 85,
      "passing": 75,
      "dribbling": 79,
      "defending": 63,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_marc-degryse",
    "name": "Marc Degryse",
    "nation": "Bélgica",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 82,
      "shooting": 86,
      "passing": 76,
      "dribbling": 80,
      "defending": 64,
      "physical": 78
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_carlos-gallo",
    "name": "Carlos Gallo",
    "nation": "Brasil",
    "era": "1986",
    "position": "GK",
    "rarity": "epic",
    "ovr": 89,
    "stats": null,
    "gk": {
      "reflexes": 90,
      "handling": 87,
      "positioning": 90
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_leandro",
    "name": "Leandro",
    "nation": "Brasil",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 87,
      "shooting": 75,
      "passing": 85,
      "dribbling": 83,
      "defending": 95,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_edinho",
    "name": "Edinho",
    "nation": "Brasil",
    "era": "1986",
    "position": "DEF",
    "rarity": "legend",
    "ovr": 91,
    "stats": {
      "pace": 88,
      "shooting": 76,
      "passing": 86,
      "dribbling": 84,
      "defending": 96,
      "physical": 92
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_alemao",
    "name": "Alemão",
    "nation": "Brasil",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 91,
      "shooting": 91,
      "passing": 97,
      "dribbling": 93,
      "defending": 90,
      "physical": 91
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_junior",
    "name": "Júnior",
    "nation": "Brasil",
    "era": "1986",
    "position": "MID",
    "rarity": "legend",
    "ovr": 95,
    "stats": {
      "pace": 93,
      "shooting": 93,
      "passing": 99,
      "dribbling": 95,
      "defending": 92,
      "physical": 93
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_careca",
    "name": "Careca",
    "nation": "Brasil",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 92,
    "stats": {
      "pace": 92,
      "shooting": 96,
      "passing": 86,
      "dribbling": 90,
      "defending": 74,
      "physical": 88
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_casagrande",
    "name": "Casagrande",
    "nation": "Brasil",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 90,
    "stats": {
      "pace": 94,
      "shooting": 93,
      "passing": 87,
      "dribbling": 87,
      "defending": 66,
      "physical": 90
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_terry-fenwick",
    "name": "Terry Fenwick",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 82,
      "shooting": 70,
      "passing": 80,
      "dribbling": 78,
      "defending": 90,
      "physical": 86
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_kenny-sansom",
    "name": "Kenny Sansom",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_glenn-hoddle",
    "name": "Glenn Hoddle",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_peter-reid",
    "name": "Peter Reid",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 86,
    "stats": {
      "pace": 84,
      "shooting": 84,
      "passing": 90,
      "dribbling": 86,
      "defending": 83,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_bryan-robson",
    "name": "Bryan Robson",
    "nation": "Inglaterra",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 87,
    "stats": {
      "pace": 85,
      "shooting": 85,
      "passing": 91,
      "dribbling": 87,
      "defending": 84,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_tomas-renones",
    "name": "Tomás Reñones",
    "nation": "España",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_andoni-goikoetxea",
    "name": "Andoni Goikoetxea",
    "nation": "España",
    "era": "1986",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 83,
    "stats": {
      "pace": 80,
      "shooting": 68,
      "passing": 78,
      "dribbling": 76,
      "defending": 88,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_antonio-maceda",
    "name": "Antonio Maceda",
    "nation": "España",
    "era": "1986",
    "position": "DEF",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 81,
      "shooting": 69,
      "passing": 79,
      "dribbling": 77,
      "defending": 89,
      "physical": 85
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_jose-antonio-camacho",
    "name": "José Antonio Camacho",
    "nation": "España",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 82,
    "stats": {
      "pace": 79,
      "shooting": 67,
      "passing": 77,
      "dribbling": 75,
      "defending": 87,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_victor-munoz",
    "name": "Víctor Muñoz",
    "nation": "España",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 83,
    "stats": {
      "pace": 81,
      "shooting": 81,
      "passing": 87,
      "dribbling": 83,
      "defending": 80,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_michel-gonzalez",
    "name": "Míchel González",
    "nation": "España",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 84,
    "stats": {
      "pace": 82,
      "shooting": 82,
      "passing": 88,
      "dribbling": 84,
      "defending": 81,
      "physical": 82
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_francisco-lopez",
    "name": "Francisco López",
    "nation": "España",
    "era": "1986",
    "position": "MID",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 83,
      "shooting": 83,
      "passing": 89,
      "dribbling": 85,
      "defending": 82,
      "physical": 83
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_emilio-butragueno",
    "name": "Emilio Butragueño",
    "nation": "España",
    "era": "1986",
    "position": "FWD",
    "rarity": "legend",
    "ovr": 93,
    "stats": {
      "pace": 94,
      "shooting": 99,
      "passing": 77,
      "dribbling": 93,
      "defending": 65,
      "physical": 84
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_eloy-olaya",
    "name": "Eloy Olaya",
    "nation": "España",
    "era": "1986",
    "position": "FWD",
    "rarity": "epic",
    "ovr": 85,
    "stats": {
      "pace": 85,
      "shooting": 89,
      "passing": 79,
      "dribbling": 83,
      "defending": 67,
      "physical": 81
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_gk_pablo-larios",
    "name": "Pablo Larios",
    "nation": "México",
    "era": "1986",
    "position": "GK",
    "rarity": "rare",
    "ovr": 76,
    "stats": null,
    "gk": {
      "reflexes": 77,
      "handling": 74,
      "positioning": 77
    },
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_carlos-munoz",
    "name": "Carlos Muñoz",
    "nation": "México",
    "era": "1986",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_fernando-quirarte",
    "name": "Fernando Quirarte",
    "nation": "México",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 75,
    "stats": {
      "pace": 72,
      "shooting": 60,
      "passing": 70,
      "dribbling": 68,
      "defending": 80,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_rafael-amador",
    "name": "Rafael Amador",
    "nation": "México",
    "era": "1986",
    "position": "DEF",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 73,
      "shooting": 61,
      "passing": 71,
      "dribbling": 69,
      "defending": 81,
      "physical": 77
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_def_raul-servin",
    "name": "Raúl Servín",
    "nation": "México",
    "era": "1986",
    "position": "DEF",
    "rarity": "common",
    "ovr": 74,
    "stats": {
      "pace": 71,
      "shooting": 59,
      "passing": 69,
      "dribbling": 67,
      "defending": 79,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_manuel-negrete",
    "name": "Manuel Negrete",
    "nation": "México",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 74,
      "shooting": 74,
      "passing": 80,
      "dribbling": 76,
      "defending": 73,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_tomas-boy",
    "name": "Tomás Boy",
    "nation": "México",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 75,
      "shooting": 75,
      "passing": 81,
      "dribbling": 77,
      "defending": 74,
      "physical": 75
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_mid_javier-aguirre",
    "name": "Javier Aguirre",
    "nation": "México",
    "era": "1986",
    "position": "MID",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 76,
      "shooting": 76,
      "passing": 82,
      "dribbling": 78,
      "defending": 75,
      "physical": 76
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_hugo-sanchez",
    "name": "Hugo Sánchez",
    "nation": "México",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 76,
    "stats": {
      "pace": 76,
      "shooting": 80,
      "passing": 70,
      "dribbling": 74,
      "defending": 58,
      "physical": 72
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_luis-flores",
    "name": "Luis Flores",
    "nation": "México",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 77,
    "stats": {
      "pace": 77,
      "shooting": 81,
      "passing": 71,
      "dribbling": 75,
      "defending": 59,
      "physical": 73
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  },
  {
    "id": "gen_fwd_carlos-hermosillo",
    "name": "Carlos Hermosillo",
    "nation": "México",
    "era": "1986",
    "position": "FWD",
    "rarity": "rare",
    "ovr": 78,
    "stats": {
      "pace": 78,
      "shooting": 82,
      "passing": 72,
      "dribbling": 76,
      "defending": 60,
      "physical": 74
    },
    "gk": null,
    "trait": null,
    "tacticalType": null
  }
];
