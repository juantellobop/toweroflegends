// Torre de Leyendas — Catálogo de directores técnicos (DT / manager).
// Esta es la fuente de verdad de los DT jugables. El panel admin local lo
// reescribe directamente al crear/editar/eliminar.
// Retratos: assets/player-portraits/{id}.jpg (id = manager_<nombre>_<apellido>).
//
// "year" es el año (época) del DT. Si su nation + year coinciden con una
// selección rival (p. ej. Argentina 1986 → Bilardo), ese DT dirige al rival y
// sus mods entran en los ratings del rival (ver data/opponents.js). null = sin enlace.

export const MANAGERS = [
  {
    "id": "manager_marcelo_gallardo",
    "name": "Marcelo Gallardo",
    "nation": "Argentina",
    "year": 2017,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 3,
      "defense": 0
    }
  },
  {
    "id": "manager_sir_alex_ferguson",
    "name": "Sir Alex Ferguson",
    "nation": "Inglaterra",
    "year": 2003,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 2
    }
  },
  {
    "id": "manager_carlos_bilardo",
    "name": "Carlos Bilardo",
    "nation": "Argentina",
    "year": 1986,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 1,
      "defense": 4
    }
  },
  {
    "id": "manager_cesar_luis_menotti",
    "name": "César Luis Menotti",
    "nation": "Argentina",
    "year": 1978,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 4,
      "midfield": 1,
      "defense": 1
    }
  },
  {
    "id": "manager_lionel_scaloni",
    "name": "Lionel Scaloni",
    "nation": "Argentina",
    "year": 2022,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 3,
      "defense": 0
    }
  },
  {
    "id": "manager_jorge_sampaoli",
    "name": "Jorge Sampaoli",
    "nation": "Argentina",
    "year": 2018,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_guardiola",
    "name": "Guardiola",
    "nation": "España",
    "year": 2009,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 0,
      "midfield": 7,
      "defense": 0
    }
  },
  {
    "id": "manager_luis_enrique",
    "name": "Luis Enrique",
    "nation": "España",
    "year": 2022,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 4,
      "defense": 0
    }
  },
  {
    "id": "manager_didier_deschamps",
    "name": "Didier Deschamps",
    "nation": "Francia",
    "year": 2018,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_joachim_low",
    "name": "Joachim Löw",
    "nation": "Alemania",
    "year": 2014,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_vicente_del_bosque",
    "name": "Vicente del Bosque",
    "nation": "España",
    "year": 2010,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 1,
      "midfield": 4,
      "defense": 1
    }
  },
  {
    "id": "manager_marcello_lippi",
    "name": "Marcello Lippi",
    "nation": "Italia",
    "year": 2006,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 2,
      "defense": 4
    }
  },
  {
    "id": "manager_director_tecnico",
    "name": "Milovan Rajevac",
    "nation": "Ghana",
    "year": 2010,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_stanislav_cherchesov",
    "name": "Stanislav Cherchesov",
    "nation": "Rusia",
    "year": 2018,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_janne_andersson",
    "name": "Janne Andersson",
    "nation": "Suecia",
    "year": 2018,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_jack_charlton",
    "name": "Jack Charlton",
    "nation": "Irlanda",
    "year": 1990,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_luiz_felipe_scolari",
    "name": "Luiz Felipe Scolari",
    "nation": "Brasil",
    "year": 2002,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 4,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_aime_jacquet",
    "name": "Aimé Jacquet",
    "nation": "Francia",
    "year": 1998,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 0,
      "midfield": 2,
      "defense": 3
    }
  },
  {
    "id": "manager_carlos_alberto_parreira",
    "name": "Carlos Alberto Parreira",
    "nation": "Brasil",
    "year": 1994,
    "rarity": "legend",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_franz_beckenbauer",
    "name": "Franz Beckenbauer",
    "nation": "Alemania",
    "year": 1990,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 2,
      "defense": 4
    }
  },
  {
    "id": "manager_enzo_bearzot",
    "name": "Enzo Bearzot",
    "nation": "Italia",
    "year": 1982,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 1,
      "defense": 4
    }
  },
  {
    "id": "manager_valeri_nepomnyashchy",
    "name": "Valeri Nepomnyashchy",
    "nation": "Camerún",
    "year": 1990,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_jurgen_klopp",
    "name": "Jürgen Klopp",
    "nation": "Alemania",
    "year": 2015,
    "rarity": "legend",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 2,
      "defense": 2
    }
  },
  {
    "id": "manager_dimitar_penev",
    "name": "Dimitar Penev",
    "nation": "Bulgaria",
    "year": 1994,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_gareth_southgate",
    "name": "Gareth Southgate",
    "nation": "Inglaterra",
    "year": 2018,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_guy_thys",
    "name": "Guy Thys",
    "nation": "Bélgica",
    "year": 1986,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 1,
      "defense": 3
    }
  },
  {
    "id": "manager_tommy_svensson",
    "name": "Tommy Svensson",
    "nation": "Suecia",
    "year": 1994,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 0
    }
  },
  {
    "id": "manager_sven_goran_eriksson",
    "name": "Sven-Göran Eriksson",
    "nation": "Inglaterra",
    "year": 2002,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_gerardo_tata_martino",
    "name": "Gerardo \"Tata\" Martino",
    "nation": "Paraguay",
    "year": 2010,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 3,
      "defense": 0
    }
  },
  {
    "id": "manager_bruce_arena",
    "name": "Bruce Arena",
    "nation": "Estados Unidos",
    "year": 2002,
    "rarity": "common",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_anghel_iordanescu",
    "name": "Anghel Iordănescu",
    "nation": "Rumanía",
    "year": 1994,
    "rarity": "rare",
    "style": "posesion",
    "mods": {
      "attack": 1,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_bora_milutinovic",
    "name": "Bora Milutinović",
    "nation": "México",
    "year": 1986,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_walid_regragui",
    "name": "Walid Regragui",
    "nation": "Marruecos",
    "year": 2022,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_bruno_metsu",
    "name": "Bruno Metsu",
    "nation": "Senegal",
    "year": 2002,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 0
    }
  },
  {
    "id": "manager_luis_de_la_fuente",
    "name": "Luis de la Fuente",
    "nation": "España",
    "year": 2026,
    "rarity": "rare",
    "style": "posesion",
    "mods": {
      "attack": -3,
      "midfield": 4,
      "defense": 0
    }
  },
  {
    "id": "manager_marcelo_bielsa",
    "name": "Marcelo Bielsa",
    "nation": "Argentina",
    "year": 2002,
    "rarity": "legend",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 1,
      "defense": 2
    }
  }
];
