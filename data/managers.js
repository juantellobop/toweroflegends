// Torre de Leyendas — Catálogo de directores técnicos (DT / manager).
// Esta es la fuente de verdad de los DT jugables. El panel admin local lo
// reescribe directamente al crear/editar/eliminar.
// Retratos: assets/player-portraits/{id}.webp (id = manager_<nombre>_<apellido>).
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
      "midfield": 3,
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
      "attack": 2,
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
      "midfield": 2,
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
      "defense": 1
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
      "attack": 2,
      "midfield": 6,
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
      "attack": 3,
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
      "midfield": 1,
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
      "midfield": 5,
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
      "attack": 1,
      "midfield": 2,
      "defense": 4
    }
  },
  {
    "id": "manager_director_tecnico",
    "name": "Sam Allardyce",
    "nation": "Inglaterra",
    "year": 2025,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 1,
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
    "nation": "Inglaterra",
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
      "midfield": 3,
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
      "midfield": 1,
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
      "attack": 1,
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
    "nation": "URSS",
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
      "midfield": 3,
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
    "nation": "Suecia",
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
    "nation": "Argentina",
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
    "nation": "Yugoslavia",
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
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 1,
      "midfield": 6,
      "defense": 1
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
      "midfield": 2,
      "defense": 2
    }
  },
  {
    "id": "manager_luis_aragones",
    "name": "Luis Aragonés",
    "nation": "España",
    "year": 2006,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 1,
      "midfield": 6,
      "defense": 0
    }
  },
  {
    "id": "manager_diego_simeone",
    "name": "Diego Simeone",
    "nation": "Argentina",
    "year": 2023,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 1,
      "defense": 5
    }
  },
  {
    "id": "manager_jose_mourinho",
    "name": "José Mourinho",
    "nation": "Portugal",
    "year": 2013,
    "rarity": "legend",
    "style": "contra",
    "mods": {
      "attack": 3,
      "midfield": 1,
      "defense": 4
    }
  },
  {
    "id": "manager_jose_bordalas",
    "name": "José Bordalás",
    "nation": "España",
    "year": 2025,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 4
    }
  },
  {
    "id": "manager_javier_clemente",
    "name": "Javier Clemente",
    "nation": "España",
    "year": 1998,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_arsene_wenger",
    "name": "Arsène Wenger",
    "nation": "Francia",
    "year": 2009,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 4,
      "defense": 0
    }
  },
  {
    "id": "manager_carlos_bianchi",
    "name": "Carlos Bianchi",
    "nation": "Argentina",
    "year": 2003,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 3,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_caruso_lombardi",
    "name": "Caruso Lombardi",
    "nation": "Argentina",
    "year": 2009,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 1,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_tele_santana",
    "name": "Telê Santana",
    "nation": "Brasil",
    "year": 1986,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 5,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_carlo_ancelotti",
    "name": "Carlo Ancelotti",
    "nation": "Italia",
    "year": 2001,
    "rarity": "legend",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 2,
      "defense": 2
    }
  },
  {
    "id": "manager_massimiliano_allegri",
    "name": "Massimiliano Allegri",
    "nation": "Italia",
    "year": 2016,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 0,
      "defense": 4
    }
  },
  {
    "id": "manager_rinus_michels",
    "name": "Rinus Michels",
    "nation": "Países Bajos",
    "year": 1974,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 3,
      "defense": 1
    }
  },
  {
    "id": "manager_louis_van_gaal",
    "name": "Louis van Gaal",
    "nation": "Países Bajos",
    "year": 2022,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 1,
      "defense": 3
    }
  },
  {
    "id": "manager_ernesto_valverde",
    "name": "Ernesto Valverde",
    "nation": "España",
    "year": 2020,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_zlatko_dalic",
    "name": "Zlatko Dalić",
    "nation": "Yugoslavia",
    "year": 2018,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_tite",
    "name": "Tite",
    "nation": "Brasil",
    "year": 2022,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_fernando_santos",
    "name": "Fernando Santos",
    "nation": "Portugal",
    "year": 2022,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_roberto_martinez",
    "name": "Roberto Martínez",
    "nation": "España",
    "year": 2018,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 0,
      "defense": 5
    }
  },
  {
    "id": "manager_oscar_tabarez",
    "name": "Óscar Tabárez",
    "nation": "Uruguay",
    "year": 2018,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_alejandro_sabella",
    "name": "Alejandro Sabella",
    "nation": "Argentina",
    "year": 2014,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 1,
      "midfield": 2,
      "defense": 3
    }
  },
  {
    "id": "manager_marc_wilmots",
    "name": "Marc Wilmots",
    "nation": "Bélgica",
    "year": 2014,
    "rarity": "rare",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 0
    }
  },
  {
    "id": "manager_jose_pekerman",
    "name": "José Pekerman",
    "nation": "Argentina",
    "year": 2006,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 4,
      "midfield": 1,
      "defense": 0
    }
  },
  {
    "id": "manager_jorge_luis_pinto",
    "name": "Jorge Luis Pinto",
    "nation": "Colombia",
    "year": 2014,
    "rarity": "rare",
    "style": "posesion",
    "mods": {
      "attack": 1,
      "midfield": 2,
      "defense": 0
    }
  },
  {
    "id": "manager_bert_van_marwijk",
    "name": "Bert van Marwijk",
    "nation": "Países Bajos",
    "year": 2010,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 1,
      "defense": 4
    }
  },
  {
    "id": "manager_maradona",
    "name": "Maradona",
    "nation": "Argentina",
    "year": 2010,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 3,
      "defense": 0
    }
  },
  {
    "id": "manager_dunga",
    "name": "Dunga",
    "nation": "Brasil",
    "year": 2010,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 0
    }
  },
  {
    "id": "manager_milovan_rajevac",
    "name": "Milovan Rajevac",
    "nation": "Yugoslavia",
    "year": 2010,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_raymond_domenech",
    "name": "Raymond Domenech",
    "nation": "Francia",
    "year": 2006,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 3,
      "defense": 2
    }
  },
  {
    "id": "manager_jurgen_klinsmann",
    "name": "Jürgen Klinsmann",
    "nation": "Alemania",
    "year": 2006,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 4,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_oleh_blojin",
    "name": "Oleh Blojín",
    "nation": "URSS",
    "year": 2006,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_rudi_voller",
    "name": "Rudi Völler",
    "nation": "Alemania",
    "year": 2002,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_senol_gunes",
    "name": "Şenol Güneş",
    "nation": "Turquía",
    "year": 2002,
    "rarity": "rare",
    "style": "posesion",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 0
    }
  },
  {
    "id": "manager_guus_hiddink",
    "name": "Guus Hiddink",
    "nation": "Países Bajos",
    "year": 2002,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_jose_camacho",
    "name": "José Antonio Camacho",
    "nation": "España",
    "year": 2002,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_mario_zagallo",
    "name": "Mario Zagallo",
    "nation": "Brasil",
    "year": 1998,
    "rarity": "legend",
    "style": "posesion",
    "mods": {
      "attack": 4,
      "midfield": 2,
      "defense": 1
    }
  },
  {
    "id": "manager_miroslav_blazevic",
    "name": "Miroslav Blažević",
    "nation": "Yugoslavia",
    "year": 1998,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_cesare_maldini",
    "name": "Cesare Maldini",
    "nation": "Italia",
    "year": 1998,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 2,
      "defense": 3
    }
  },
  {
    "id": "manager_daniel_passarella",
    "name": "Daniel Passarella",
    "nation": "Argentina",
    "year": 1998,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_berti_vogts",
    "name": "Berti Vogts",
    "nation": "Alemania",
    "year": 1998,
    "rarity": "rare",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 0,
      "defense": 2
    }
  },
  {
    "id": "manager_bo_johansson",
    "name": "Bo Johansson",
    "nation": "Suecia",
    "year": 1998,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_arrigo_sacchi",
    "name": "Arrigo Sacchi",
    "nation": "Italia",
    "year": 1994,
    "rarity": "legend",
    "style": "presion",
    "mods": {
      "attack": 3,
      "midfield": 1,
      "defense": 3
    }
  },
  {
    "id": "manager_dick_advocaat",
    "name": "Dick Advocaat",
    "nation": "Países Bajos",
    "year": 1994,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_azeglio_vicini",
    "name": "Azeglio Vicini",
    "nation": "Italia",
    "year": 1990,
    "rarity": "epic",
    "style": "contra",
    "mods": {
      "attack": 0,
      "midfield": 2,
      "defense": 3
    }
  },
  {
    "id": "manager_bobby_robson",
    "name": "Bobby Robson",
    "nation": "Inglaterra",
    "year": 1990,
    "rarity": "rare",
    "style": "contra",
    "mods": {
      "attack": 1,
      "midfield": 0,
      "defense": 3
    }
  },
  {
    "id": "manager_henri_michel",
    "name": "Henri Michel",
    "nation": "Francia",
    "year": 1986,
    "rarity": "epic",
    "style": "presion",
    "mods": {
      "attack": 2,
      "midfield": 1,
      "defense": 2
    }
  },
  {
    "id": "manager_miguel_munoz",
    "name": "Miguel Muñoz",
    "nation": "España",
    "year": 1986,
    "rarity": "epic",
    "style": "posesion",
    "mods": {
      "attack": 2,
      "midfield": 2,
      "defense": 1
    }
  }
];
