// Torre de Leyendas — Selecciones históricas que alcanzaron cuartos de final
// o una ronda posterior. Los onces son representativos de cada torneo; los
// OVR y ratings son valores de juego, no valoraciones históricas oficiales.

import { CONFIG, targetStrength } from './config.js';
import { MANAGERS } from './managers.js';

// Piso de 1 y redondeo; sin techo de 99: los rivales de niveles altos siguen
// creciendo igual que el equipo del jugador (simetría de la dificultad).
const clamp = (n) => Math.max(1, Math.round(n));

// DT enlazados a una edición rival: si un DT comparte nación y año con una
// selección (p. ej. Argentina 1986 → Bilardo), dirige a ese rival y sus mods
// entran en los ratings del rival (engine/teamRatings.calcularRatings).
const normNation = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .trim().toLowerCase();

const MANAGER_BY_TEAM = new Map();
for (const m of MANAGERS) {
  if (m.year == null || m.year === '') continue;
  MANAGER_BY_TEAM.set(`${normNation(m.nation)}|${Number(m.year)}`, m);
}

// Snapshot mínimo del DT que dirige a un rival (o null si la edición no tiene
// DT asignado). Va dentro del rival y se persiste con el guardado sin arrastrar
// datos pesados (retrato en data-URL, etc.).
function managerForOpponent(opponent) {
  const m = MANAGER_BY_TEAM.get(`${normNation(opponent.name)}|${Number(opponent.year)}`);
  if (!m) return null;
  return { id: m.id, name: m.name, nation: m.nation, year: m.year, rarity: m.rarity, style: m.style, mods: { ...m.mods } };
}

function names(text, position, ovr) {
  return text.split('|').map((name, i) => ({
    name,
    position,
    ovr: clamp(ovr + ((i % 3) - 1)),
  }));
}

function historicalTeam({
  id, name, year, achievement, colors, strength,
  attack = 0, midfield = 0, defense = 0, gk = 0,
  keepers, defenders, midfielders, forwards,
}) {
  const ratings = {
    attack: clamp(strength + attack),
    midfield: clamp(strength + midfield),
    defense: clamp(strength + defense),
    gk: clamp(strength + gk),
  };
  const lineup = [
    ...names(keepers, 'GK', ratings.gk),
    ...names(defenders, 'DEF', ratings.defense),
    ...names(midfielders, 'MID', ratings.midfield),
    ...names(forwards, 'FWD', ratings.attack),
  ];
  const counts = ['DEF', 'MID', 'FWD'].map((p) => lineup.filter((x) => x.position === p).length);
  return {
    id, name, year, achievement, colors, color: colors.primary, strength, ratings, lineup,
    formation: counts.join('-'),
    stage: 'quarterfinal-or-better',
  };
}

export const OPPONENTS = [
  // 2022
  historicalTeam({ id: 'ar_2022', name: 'Argentina', year: 2022, achievement: 'Campeón', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 95, attack: 2, midfield: 1, defense: 0, gk: 1, keepers: 'Emiliano Martínez', defenders: 'Nahuel Molina|Cristian Romero|Nicolás Otamendi|Marcos Acuña', midfielders: 'Rodrigo De Paul|Enzo Fernández|Alexis Mac Allister', forwards: 'Lionel Messi|Julián Álvarez|Ángel Di María' }),
  historicalTeam({ id: 'fr_2022', name: 'Francia', year: 2022, achievement: 'Subcampeón', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 93, attack: 3, midfield: 0, defense: 1, gk: 0, keepers: 'Hugo Lloris', defenders: 'Jules Koundé|Raphaël Varane|Dayot Upamecano|Theo Hernández', midfielders: 'Aurélien Tchouaméni|Adrien Rabiot|Antoine Griezmann', forwards: 'Ousmane Dembélé|Olivier Giroud|Kylian Mbappé' }),
  historicalTeam({ id: 'hr_2022', name: 'Croacia', year: 2022, achievement: 'Semifinal', colors: { primary: '#D71920', secondary: '#FFFFFF' }, strength: 84, attack: -2, midfield: 4, defense: 1, gk: 3, keepers: 'Dominik Livaković', defenders: 'Josip Juranović|Dejan Lovren|Joško Gvardiol|Borna Sosa', midfielders: 'Luka Modrić|Marcelo Brozović|Mateo Kovačić', forwards: 'Mario Pašalić|Andrej Kramarić|Ivan Perišić' }),
  historicalTeam({ id: 'ma_2022', name: 'Marruecos', year: 2022, achievement: 'Semifinal', colors: { primary: '#C1272D', secondary: '#006233' }, strength: 78, attack: -2, midfield: 2, defense: 4, gk: 4, keepers: 'Yassine Bounou', defenders: 'Achraf Hakimi|Nayef Aguerd|Romain Saïss|Noussair Mazraoui', midfielders: 'Sofyan Amrabat|Azzedine Ounahi|Selim Amallah', forwards: 'Hakim Ziyech|Youssef En-Nesyri|Sofiane Boufal' }),
  historicalTeam({ id: 'nl_2022', name: 'Países Bajos', year: 2022, achievement: 'Cuartos de final', colors: { primary: '#F36C21', secondary: '#111111' }, strength: 82, attack: 1, midfield: 1, defense: 2, gk: 0, keepers: 'Andries Noppert', defenders: 'Jurriën Timber|Virgil van Dijk|Nathan Aké|Denzel Dumfries', midfielders: 'Frenkie de Jong|Marten de Roon|Daley Blind', forwards: 'Cody Gakpo|Memphis Depay|Steven Bergwijn' }),
  historicalTeam({ id: 'gb_2022', name: 'Inglaterra', year: 2022, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 86, attack: 3, midfield: 1, defense: 1, gk: 0, keepers: 'Jordan Pickford', defenders: 'Kyle Walker|John Stones|Harry Maguire|Luke Shaw', midfielders: 'Declan Rice|Jordan Henderson|Jude Bellingham', forwards: 'Bukayo Saka|Harry Kane|Phil Foden' }),
  historicalTeam({ id: 'br_2022', name: 'Brasil', year: 2022, achievement: 'Cuartos de final', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 91, attack: 3, midfield: 1, defense: 2, gk: 2, keepers: 'Alisson', defenders: 'Danilo|Marquinhos|Thiago Silva|Éder Militão', midfielders: 'Casemiro|Lucas Paquetá|Neymar', forwards: 'Raphinha|Richarlison|Vinícius Júnior' }),
  historicalTeam({ id: 'pt_2022', name: 'Portugal', year: 2022, achievement: 'Cuartos de final', colors: { primary: '#DA291C', secondary: '#046A38' }, strength: 87, attack: 3, midfield: 2, defense: 0, gk: -1, keepers: 'Diogo Costa', defenders: 'Diogo Dalot|Pepe|Rúben Dias|Raphaël Guerreiro', midfielders: 'William Carvalho|Bernardo Silva|Bruno Fernandes', forwards: 'João Félix|Gonçalo Ramos|Cristiano Ronaldo' }),

  // 2018
  historicalTeam({ id: 'fr_2018', name: 'Francia', year: 2018, achievement: 'Campeón', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 94, attack: 2, midfield: 2, defense: 2, gk: 1, keepers: 'Hugo Lloris', defenders: 'Benjamin Pavard|Raphaël Varane|Samuel Umtiti|Lucas Hernández', midfielders: 'Paul Pogba|N’Golo Kanté|Antoine Griezmann', forwards: 'Kylian Mbappé|Olivier Giroud|Blaise Matuidi' }),
  historicalTeam({ id: 'hr_2018', name: 'Croacia', year: 2018, achievement: 'Subcampeón', colors: { primary: '#D71920', secondary: '#FFFFFF' }, strength: 87, attack: 0, midfield: 4, defense: 1, gk: 1, keepers: 'Danijel Subašić', defenders: 'Šime Vrsaljko|Dejan Lovren|Domagoj Vida|Ivan Strinić', midfielders: 'Ivan Rakitić|Marcelo Brozović|Luka Modrić', forwards: 'Ante Rebić|Mario Mandžukić|Ivan Perišić' }),
  historicalTeam({ id: 'be_2018', name: 'Bélgica', year: 2018, achievement: 'Semifinal', colors: { primary: '#EF3340', secondary: '#FBDD40' }, strength: 89, attack: 3, midfield: 3, defense: 0, gk: 3, keepers: 'Thibaut Courtois', defenders: 'Toby Alderweireld|Vincent Kompany|Jan Vertonghen|Thomas Meunier', midfielders: 'Kevin De Bruyne|Axel Witsel|Marouane Fellaini', forwards: 'Eden Hazard|Romelu Lukaku|Nacer Chadli' }),
  historicalTeam({ id: 'gb_2018', name: 'Inglaterra', year: 2018, achievement: 'Semifinal', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 80, attack: 2, midfield: 0, defense: 1, gk: 1, keepers: 'Jordan Pickford', defenders: 'Kyle Walker|John Stones|Harry Maguire|Kieran Trippier', midfielders: 'Jordan Henderson|Dele Alli|Jesse Lingard|Ashley Young', forwards: 'Raheem Sterling|Harry Kane' }),
  historicalTeam({ id: 'uy_2018', name: 'Uruguay', year: 2018, achievement: 'Cuartos de final', colors: { primary: '#6CACE4', secondary: '#000000' }, strength: 82, attack: 3, midfield: 0, defense: 3, gk: 0, keepers: 'Fernando Muslera', defenders: 'Martín Cáceres|Diego Godín|José María Giménez|Diego Laxalt', midfielders: 'Nahitan Nández|Lucas Torreira|Matías Vecino|Rodrigo Bentancur', forwards: 'Luis Suárez|Edinson Cavani' }),
  historicalTeam({ id: 'br_2018', name: 'Brasil', year: 2018, achievement: 'Cuartos de final', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 90, attack: 3, midfield: 1, defense: 1, gk: 1, keepers: 'Alisson', defenders: 'Fagner|Miranda|Thiago Silva|Marcelo', midfielders: 'Casemiro|Paulinho|Philippe Coutinho', forwards: 'Willian|Gabriel Jesus|Neymar' }),
  historicalTeam({ id: 'ru_2018', name: 'Rusia', year: 2018, achievement: 'Cuartos de final', colors: { primary: '#D52B1E', secondary: '#0039A6' }, strength: 67, attack: 1, midfield: 0, defense: 1, gk: 2, keepers: 'Igor Akinfeev', defenders: 'Mario Fernandes|Ilya Kutepov|Sergei Ignashevich|Fedor Kudryashov', midfielders: 'Roman Zobnin|Daler Kuzyaev|Aleksandr Golovin', forwards: 'Aleksandr Samedov|Artem Dzyuba|Denis Cheryshev' }),
  historicalTeam({ id: 'se_2018', name: 'Suecia', year: 2018, achievement: 'Cuartos de final', colors: { primary: '#FFCD00', secondary: '#006AA7' }, strength: 68, attack: -1, midfield: 0, defense: 2, gk: 1, keepers: 'Robin Olsen', defenders: 'Mikael Lustig|Victor Lindelöf|Andreas Granqvist|Ludwig Augustinsson', midfielders: 'Viktor Claesson|Sebastian Larsson|Albin Ekdal|Emil Forsberg', forwards: 'Marcus Berg|Ola Toivonen' }),

  // 2014
  historicalTeam({ id: 'de_2014', name: 'Alemania', year: 2014, achievement: 'Campeón', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 95, attack: 2, midfield: 3, defense: 2, gk: 3, keepers: 'Manuel Neuer', defenders: 'Philipp Lahm|Jérôme Boateng|Mats Hummels|Benedikt Höwedes', midfielders: 'Bastian Schweinsteiger|Sami Khedira|Toni Kroos', forwards: 'Mesut Özil|Thomas Müller|Miroslav Klose' }),
  historicalTeam({ id: 'ar_2014', name: 'Argentina', year: 2014, achievement: 'Subcampeón', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 88, attack: 3, midfield: 1, defense: 2, gk: 1, keepers: 'Sergio Romero', defenders: 'Pablo Zabaleta|Martín Demichelis|Ezequiel Garay|Marcos Rojo', midfielders: 'Javier Mascherano|Lucas Biglia|Enzo Pérez', forwards: 'Lionel Messi|Gonzalo Higuaín|Ezequiel Lavezzi' }),
  historicalTeam({ id: 'nl_2014', name: 'Países Bajos', year: 2014, achievement: 'Semifinal', colors: { primary: '#F36C21', secondary: '#111111' }, strength: 86, attack: 3, midfield: 1, defense: 1, gk: 0, keepers: 'Jasper Cillessen', defenders: 'Daryl Janmaat|Stefan de Vrij|Ron Vlaar|Daley Blind', midfielders: 'Nigel de Jong|Wesley Sneijder|Georginio Wijnaldum', forwards: 'Arjen Robben|Robin van Persie|Memphis Depay' }),
  historicalTeam({ id: 'br_2014', name: 'Brasil', year: 2014, achievement: 'Semifinal', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 84, attack: 1, midfield: 0, defense: 1, gk: 0, keepers: 'Júlio César', defenders: 'Maicon|Thiago Silva|David Luiz|Marcelo', midfielders: 'Fernandinho|Paulinho|Oscar', forwards: 'Hulk|Fred|Neymar' }),
  historicalTeam({ id: 'fr_2014', name: 'Francia', year: 2014, achievement: 'Cuartos de final', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 81, attack: 2, midfield: 2, defense: 1, gk: 1, keepers: 'Hugo Lloris', defenders: 'Mathieu Debuchy|Raphaël Varane|Mamadou Sakho|Patrice Evra', midfielders: 'Yohan Cabaye|Blaise Matuidi|Paul Pogba', forwards: 'Mathieu Valbuena|Karim Benzema|Antoine Griezmann' }),
  historicalTeam({ id: 'be_2014', name: 'Bélgica', year: 2014, achievement: 'Cuartos de final', colors: { primary: '#EF3340', secondary: '#FBDD40' }, strength: 79, attack: 1, midfield: 2, defense: 1, gk: 3, keepers: 'Thibaut Courtois', defenders: 'Toby Alderweireld|Vincent Kompany|Daniel van Buyten|Jan Vertonghen', midfielders: 'Axel Witsel|Marouane Fellaini|Kevin De Bruyne', forwards: 'Dries Mertens|Divock Origi|Eden Hazard' }),
  historicalTeam({ id: 'co_2014', name: 'Colombia', year: 2014, achievement: 'Cuartos de final', colors: { primary: '#FCD116', secondary: '#003893' }, strength: 72, attack: 3, midfield: 2, defense: 0, gk: 0, keepers: 'David Ospina', defenders: 'Juan Zúñiga|Cristián Zapata|Mario Yepes|Pablo Armero', midfielders: 'Carlos Sánchez|Fredy Guarín|James Rodríguez', forwards: 'Juan Cuadrado|Teófilo Gutiérrez|Jackson Martínez' }),
  historicalTeam({ id: 'cr_2014', name: 'Costa Rica', year: 2014, achievement: 'Cuartos de final', colors: { primary: '#CE1126', secondary: '#002B7F' }, strength: 69, attack: -1, midfield: 0, defense: 3, gk: 5, keepers: 'Keylor Navas', defenders: 'Cristian Gamboa|Giancarlo González|Óscar Duarte|Júnior Díaz', midfielders: 'Celso Borges|Yeltsin Tejeda|Bryan Ruiz', forwards: 'Christian Bolaños|Marco Ureña|Joel Campbell' }),

  // 2010
  historicalTeam({ id: 'es_2010', name: 'España', year: 2010, achievement: 'Campeón', colors: { primary: '#AA151B', secondary: '#F1BF00' }, strength: 94, attack: 1, midfield: 5, defense: 3, gk: 3, keepers: 'Iker Casillas', defenders: 'Sergio Ramos|Gerard Piqué|Carles Puyol|Joan Capdevila', midfielders: 'Sergio Busquets|Xabi Alonso|Xavi Hernández', forwards: 'Andrés Iniesta|David Villa|Pedro Rodríguez' }),
  historicalTeam({ id: 'nl_2010', name: 'Países Bajos', year: 2010, achievement: 'Subcampeón', colors: { primary: '#F36C21', secondary: '#111111' }, strength: 89, attack: 3, midfield: 3, defense: 1, gk: 0, keepers: 'Maarten Stekelenburg', defenders: 'Gregory van der Wiel|John Heitinga|Joris Mathijsen|Giovanni van Bronckhorst', midfielders: 'Mark van Bommel|Nigel de Jong|Wesley Sneijder', forwards: 'Arjen Robben|Robin van Persie|Dirk Kuyt' }),
  historicalTeam({ id: 'de_2010', name: 'Alemania', year: 2010, achievement: 'Semifinal', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 88, attack: 3, midfield: 2, defense: 1, gk: 2, keepers: 'Manuel Neuer', defenders: 'Philipp Lahm|Per Mertesacker|Arne Friedrich|Jérôme Boateng', midfielders: 'Bastian Schweinsteiger|Sami Khedira|Mesut Özil', forwards: 'Thomas Müller|Miroslav Klose|Lukas Podolski' }),
  historicalTeam({ id: 'uy_2010', name: 'Uruguay', year: 2010, achievement: 'Semifinal', colors: { primary: '#6CACE4', secondary: '#000000' }, strength: 74, attack: 4, midfield: 1, defense: 2, gk: 0, keepers: 'Fernando Muslera', defenders: 'Maxi Pereira|Diego Lugano|Diego Godín|Jorge Fucile', midfielders: 'Egidio Arévalo Ríos|Diego Pérez|Diego Forlán', forwards: 'Luis Suárez|Edinson Cavani|Álvaro Pereira' }),
  historicalTeam({ id: 'ar_2010', name: 'Argentina', year: 2010, achievement: 'Cuartos de final', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 83, attack: 4, midfield: 1, defense: -1, gk: -1, keepers: 'Sergio Romero', defenders: 'Nicolás Otamendi|Martín Demichelis|Nicolás Burdisso|Gabriel Heinze', midfielders: 'Javier Mascherano|Ángel Di María|Maxi Rodríguez', forwards: 'Lionel Messi|Gonzalo Higuaín|Carlos Tevez' }),
  historicalTeam({ id: 'br_2010', name: 'Brasil', year: 2010, achievement: 'Cuartos de final', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 87, attack: 3, midfield: 2, defense: 2, gk: 2, keepers: 'Júlio César', defenders: 'Maicon|Lúcio|Juan|Michel Bastos', midfielders: 'Gilberto Silva|Felipe Melo|Kaká', forwards: 'Robinho|Luís Fabiano|Elano' }),
  historicalTeam({ id: 'gh_2010', name: 'Ghana', year: 2010, achievement: 'Cuartos de final', colors: { primary: '#CE1126', secondary: '#FCD116' }, strength: 64, attack: 3, midfield: 4, defense: 3, gk: 2, keepers: 'Richard Kingson', defenders: 'John Paintsil|John Mensah|Isaac Vorsah|Hans Sarpei', midfielders: 'Anthony Annan|Kevin-Prince Boateng|Sulley Muntari', forwards: 'Samuel Inkoom|Asamoah Gyan|André Ayew' }),
  historicalTeam({ id: 'py_2010', name: 'Paraguay', year: 2010, achievement: 'Cuartos de final', colors: { primary: '#D52B1E', secondary: '#FFFFFF' }, strength: 66, attack: 0, midfield: 0, defense: 3, gk: 2, keepers: 'Justo Villar', defenders: 'Darío Verón|Paulo da Silva|Antolín Alcaraz|Claudio Morel', midfielders: 'Enrique Vera|Cristian Riveros|Jonathan Santana', forwards: 'Lucas Barrios|Roque Santa Cruz|Nelson Haedo Valdez' }),

  // 2006
  historicalTeam({ id: 'it_2006', name: 'Italia', year: 2006, achievement: 'Campeón', colors: { primary: '#0066BC', secondary: '#FFFFFF' }, strength: 94, attack: 0, midfield: 2, defense: 4, gk: 4, keepers: 'Gianluigi Buffon', defenders: 'Gianluca Zambrotta|Fabio Cannavaro|Marco Materazzi|Fabio Grosso', midfielders: 'Gennaro Gattuso|Andrea Pirlo|Simone Perrotta', forwards: 'Mauro Camoranesi|Francesco Totti|Luca Toni' }),
  historicalTeam({ id: 'fr_2006', name: 'Francia', year: 2006, achievement: 'Subcampeón', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 92, attack: 2, midfield: 4, defense: 2, gk: 0, keepers: 'Fabien Barthez', defenders: 'Willy Sagnol|Lilian Thuram|William Gallas|Éric Abidal', midfielders: 'Patrick Vieira|Claude Makélélé|Zinedine Zidane', forwards: 'Franck Ribéry|Thierry Henry|Florent Malouda' }),
  historicalTeam({ id: 'de_2006', name: 'Alemania', year: 2006, achievement: 'Semifinal', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 88, attack: 3, midfield: 2, defense: 1, gk: 1, keepers: 'Jens Lehmann', defenders: 'Arne Friedrich|Per Mertesacker|Christoph Metzelder|Philipp Lahm', midfielders: 'Torsten Frings|Michael Ballack|Bernd Schneider', forwards: 'Lukas Podolski|Miroslav Klose|Bastian Schweinsteiger' }),
  historicalTeam({ id: 'pt_2006', name: 'Portugal', year: 2006, achievement: 'Semifinal', colors: { primary: '#DA291C', secondary: '#046A38' }, strength: 85, attack: 2, midfield: 3, defense: 2, gk: 1, keepers: 'Ricardo Pereira', defenders: 'Miguel Monteiro|Ricardo Carvalho|Fernando Meira|Nuno Valente', midfielders: 'Costinha|Maniche|Deco', forwards: 'Luís Figo|Pauleta|Cristiano Ronaldo' }),
  historicalTeam({ id: 'br_2006', name: 'Brasil', year: 2006, achievement: 'Cuartos de final', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 90, attack: 4, midfield: 3, defense: 1, gk: 0, keepers: 'Dida', defenders: 'Cafú|Lúcio|Juan|Roberto Carlos', midfielders: 'Emerson|Zé Roberto|Kaká', forwards: 'Ronaldinho|Ronaldo|Adriano' }),
  historicalTeam({ id: 'ar_2006', name: 'Argentina', year: 2006, achievement: 'Cuartos de final', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 88, attack: 3, midfield: 3, defense: 1, gk: 0, keepers: 'Roberto Abbondanzieri', defenders: 'Nicolás Burdisso|Roberto Ayala|Gabriel Heinze|Juan Pablo Sorín', midfielders: 'Javier Mascherano|Esteban Cambiasso|Juan Román Riquelme', forwards: 'Maxi Rodríguez|Hernán Crespo|Javier Saviola' }),
  historicalTeam({ id: 'gb_2006', name: 'Inglaterra', year: 2006, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 84, attack: 2, midfield: 3, defense: 2, gk: -1, keepers: 'Paul Robinson', defenders: 'Gary Neville|Rio Ferdinand|John Terry|Ashley Cole', midfielders: 'David Beckham|Steven Gerrard|Frank Lampard', forwards: 'Joe Cole|Wayne Rooney|Michael Owen' }),
  historicalTeam({ id: 'ua_2006', name: 'Ucrania', year: 2006, achievement: 'Cuartos de final', colors: { primary: '#0057B7', secondary: '#FFD700' }, strength: 70, attack: 2, midfield: 0, defense: 2, gk: 1, keepers: 'Oleksandr Shovkovskyi', defenders: 'Volodymyr Yezerskyi|Andriy Rusol|Andriy Sviderskyi|Andriy Nesmachnyi', midfielders: 'Anatoliy Tymoshchuk|Oleh Shelayev|Oleh Gusev', forwards: 'Andriy Voronin|Andriy Shevchenko|Artem Milevskyi' }),

  // 2002
  historicalTeam({ id: 'br_2002', name: 'Brasil', year: 2002, achievement: 'Campeón', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 95, attack: 5, midfield: 2, defense: 2, gk: 1, keepers: 'Marcos', defenders: 'Cafú|Lúcio|Edmílson|Roberto Carlos', midfielders: 'Gilberto Silva|Kléberson|Juninho Paulista', forwards: 'Ronaldinho|Rivaldo|Ronaldo' }),
  historicalTeam({ id: 'de_2002', name: 'Alemania', year: 2002, achievement: 'Subcampeón', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 88, attack: 1, midfield: 1, defense: 3, gk: 5, keepers: 'Oliver Kahn', defenders: 'Torsten Frings|Carsten Ramelow|Thomas Linke|Christoph Metzelder', midfielders: 'Dietmar Hamann|Jens Jeremies|Michael Ballack', forwards: 'Bernd Schneider|Miroslav Klose|Oliver Neuville' }),
  historicalTeam({ id: 'tr_2002', name: 'Turquía', year: 2002, achievement: 'Semifinal', colors: { primary: '#E30A17', secondary: '#FFFFFF' }, strength: 78, attack: 2, midfield: 2, defense: 1, gk: 3, keepers: 'Rüştü Reçber', defenders: 'Fatih Akyel|Alpay Özalan|Bülent Korkmaz|Ümit Davala', midfielders: 'Tugay Kerimoğlu|Yıldıray Baştürk|Emre Belözoğlu', forwards: 'Hasan Şaş|Hakan Şükür|İlhan Mansız' }),
  historicalTeam({ id: 'kr_2002', name: 'Corea del Sur', year: 2002, achievement: 'Semifinal', colors: { primary: '#CD2E3A', secondary: '#0047A0' }, strength: 72, attack: 0, midfield: 3, defense: 2, gk: 2, keepers: 'Lee Woon-jae', defenders: 'Hong Myung-bo|Choi Jin-cheul|Kim Tae-young|Song Chong-gug', midfielders: 'Yoo Sang-chul|Park Ji-sung|Lee Young-pyo', forwards: 'Ahn Jung-hwan|Seol Ki-hyeon|Cha Du-ri' }),
  historicalTeam({ id: 'es_2002', name: 'España', year: 2002, achievement: 'Cuartos de final', colors: { primary: '#AA151B', secondary: '#F1BF00' }, strength: 82, attack: 2, midfield: 2, defense: 2, gk: 2, keepers: 'Iker Casillas', defenders: 'Carles Puyol|Iván Helguera|Fernando Hierro|Juanfran García', midfielders: 'Rubén Baraja|Juan Carlos Valerón|Javier de Pedro', forwards: 'Joaquín Sánchez|Fernando Morientes|Raúl González' }),
  historicalTeam({ id: 'gb_2002', name: 'Inglaterra', year: 2002, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 83, attack: 2, midfield: 2, defense: 3, gk: 0, keepers: 'David Seaman', defenders: 'Danny Mills|Rio Ferdinand|Sol Campbell|Ashley Cole', midfielders: 'David Beckham|Nicky Butt|Paul Scholes', forwards: 'Michael Owen|Emile Heskey|Trevor Sinclair' }),
  historicalTeam({ id: 'sn_2002', name: 'Senegal', year: 2002, achievement: 'Cuartos de final', colors: { primary: '#00853F', secondary: '#FDEF42' }, strength: 69, attack: 2, midfield: 2, defense: 1, gk: 0, keepers: 'Tony Sylva', defenders: 'Ferdinand Coly|Lamine Diatta|Pape Malick Diop|Omar Daf', midfielders: 'Aliou Cissé|Khalilou Fadiga|Papa Bouba Diop', forwards: 'El Hadji Diouf|Henri Camara|Salif Diao' }),
  historicalTeam({ id: 'us_2002', name: 'Estados Unidos', year: 2002, achievement: 'Cuartos de final', colors: { primary: '#3C3B6E', secondary: '#B22234' }, strength: 68, attack: 1, midfield: 2, defense: 1, gk: 3, keepers: 'Brad Friedel', defenders: 'Tony Sanneh|Eddie Pope|Gregg Berhalter|Frankie Hejduk', midfielders: 'Claudio Reyna|John O’Brien|Landon Donovan', forwards: 'Brian McBride|Clint Mathis|DaMarcus Beasley' }),

  // 1998
  historicalTeam({ id: 'fr_1998', name: 'Francia', year: 1998, achievement: 'Campeón', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 95, attack: 1, midfield: 4, defense: 4, gk: 2, keepers: 'Fabien Barthez', defenders: 'Lilian Thuram|Marcel Desailly|Laurent Blanc|Bixente Lizarazu', midfielders: 'Didier Deschamps|Emmanuel Petit|Zinedine Zidane', forwards: 'Youri Djorkaeff|Thierry Henry|Stéphane Guivarc’h' }),
  historicalTeam({ id: 'br_1998', name: 'Brasil', year: 1998, achievement: 'Subcampeón', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 93, attack: 4, midfield: 2, defense: 1, gk: 1, keepers: 'Cláudio Taffarel', defenders: 'Cafú|Aldair|Júnior Baiano|Roberto Carlos', midfielders: 'Dunga|César Sampaio|Rivaldo', forwards: 'Ronaldo|Bebeto|Leonardo' }),
  historicalTeam({ id: 'hr_1998', name: 'Croacia', year: 1998, achievement: 'Semifinal', colors: { primary: '#D71920', secondary: '#FFFFFF' }, strength: 84, attack: 3, midfield: 2, defense: 1, gk: 0, keepers: 'Dražen Ladić', defenders: 'Igor Štimac|Slaven Bilić|Zvonimir Soldo|Robert Jarni', midfielders: 'Zvonimir Boban|Aljoša Asanović|Robert Prosinečki', forwards: 'Goran Vlaović|Davor Šuker|Mario Stanić' }),
  historicalTeam({ id: 'nl_1998', name: 'Países Bajos', year: 1998, achievement: 'Semifinal', colors: { primary: '#F36C21', secondary: '#111111' }, strength: 91, attack: 3, midfield: 3, defense: 2, gk: 2, keepers: 'Edwin van der Sar', defenders: 'Michael Reiziger|Jaap Stam|Frank de Boer|Arthur Numan', midfielders: 'Edgar Davids|Phillip Cocu|Dennis Bergkamp', forwards: 'Marc Overmars|Patrick Kluivert|Ronald de Boer' }),
  historicalTeam({ id: 'it_1998', name: 'Italia', year: 1998, achievement: 'Cuartos de final', colors: { primary: '#0066BC', secondary: '#FFFFFF' }, strength: 87, attack: 3, midfield: 1, defense: 4, gk: 2, keepers: 'Gianluca Pagliuca', defenders: 'Giuseppe Bergomi|Fabio Cannavaro|Alessandro Costacurta|Paolo Maldini', midfielders: 'Demetrio Albertini|Luigi Di Biagio|Roberto Di Matteo', forwards: 'Alessandro Del Piero|Christian Vieri|Roberto Baggio' }),
  historicalTeam({ id: 'ar_1998', name: 'Argentina', year: 1998, achievement: 'Cuartos de final', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 86, attack: 3, midfield: 2, defense: 2, gk: 1, keepers: 'Carlos Roa', defenders: 'Javier Zanetti|Roberto Ayala|Roberto Sensini|José Chamot', midfielders: 'Diego Simeone|Juan Sebastián Verón|Ariel Ortega', forwards: 'Gabriel Batistuta|Claudio López|Marcelo Gallardo' }),
  historicalTeam({ id: 'de_1998', name: 'Alemania', year: 1998, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 83, attack: 2, midfield: 1, defense: 2, gk: 1, keepers: 'Andreas Köpke', defenders: 'Stefan Reuter|Jürgen Kohler|Lothar Matthäus|Christian Ziege', midfielders: 'Dietmar Hamann|Thomas Häßler|Andreas Möller', forwards: 'Jürgen Klinsmann|Oliver Bierhoff|Ulf Kirsten' }),
  historicalTeam({ id: 'dk_1998', name: 'Dinamarca', year: 1998, achievement: 'Cuartos de final', colors: { primary: '#C60C30', secondary: '#FFFFFF' }, strength: 75, attack: 2, midfield: 2, defense: 1, gk: 4, keepers: 'Peter Schmeichel', defenders: 'Thomas Helveg|Marc Rieper|Thomas Høgh|Jan Heintze', midfielders: 'Allan Nielsen|Morten Wieghorst|Michael Laudrup', forwards: 'Brian Laudrup|Ebbe Sand|Jon Dahl Tomasson' }),

  // 1994
  historicalTeam({ id: 'br_1994', name: 'Brasil', year: 1994, achievement: 'Campeón', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 94, attack: 4, midfield: 2, defense: 3, gk: 2, keepers: 'Cláudio Taffarel', defenders: 'Jorginho|Aldair|Márcio Santos|Branco', midfielders: 'Dunga|Mauro Silva|Raí', forwards: 'Bebeto|Romário|Zinho' }),
  historicalTeam({ id: 'it_1994', name: 'Italia', year: 1994, achievement: 'Subcampeón', colors: { primary: '#0066BC', secondary: '#FFFFFF' }, strength: 91, attack: 3, midfield: 2, defense: 4, gk: 1, keepers: 'Gianluca Pagliuca', defenders: 'Roberto Mussi|Franco Baresi|Paolo Maldini|Antonio Benarrivo', midfielders: 'Demetrio Albertini|Dino Baggio|Roberto Donadoni', forwards: 'Roberto Baggio|Daniele Massaro|Giuseppe Signori' }),
  historicalTeam({ id: 'se_1994', name: 'Suecia', year: 1994, achievement: 'Semifinal', colors: { primary: '#FFCD00', secondary: '#006AA7' }, strength: 80, attack: 3, midfield: 1, defense: 1, gk: 2, keepers: 'Thomas Ravelli', defenders: 'Roland Nilsson|Patrik Andersson|Joachim Björklund|Roger Ljung', midfielders: 'Stefan Schwarz|Jonas Thern|Klas Ingesson', forwards: 'Tomas Brolin|Kennet Andersson|Martin Dahlin' }),
  historicalTeam({ id: 'bg_1994', name: 'Bulgaria', year: 1994, achievement: 'Semifinal', colors: { primary: '#00966E', secondary: '#D62612' }, strength: 78, attack: 3, midfield: 2, defense: 0, gk: 0, keepers: 'Borislav Mihaylov', defenders: 'Emil Kremenliev|Trifon Ivanov|Petar Hubchev|Tsanko Tsvetanov', midfielders: 'Krasimir Balakov|Yordan Letchkov|Zlatko Yankov', forwards: 'Hristo Stoichkov|Emil Kostadinov|Nasko Sirakov' }),
  historicalTeam({ id: 'de_1994', name: 'Alemania', year: 1994, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 87, attack: 3, midfield: 2, defense: 2, gk: 1, keepers: 'Bodo Illgner', defenders: 'Thomas Berthold|Jürgen Kohler|Lothar Matthäus|Andreas Brehme', midfielders: 'Thomas Häßler|Stefan Effenberg|Andreas Möller', forwards: 'Jürgen Klinsmann|Rudi Völler|Karl-Heinz Riedle' }),
  historicalTeam({ id: 'nl_1994', name: 'Países Bajos', year: 1994, achievement: 'Cuartos de final', colors: { primary: '#F36C21', secondary: '#111111' }, strength: 85, attack: 3, midfield: 2, defense: 2, gk: 0, keepers: 'Ed de Goey', defenders: 'Ulrich van Gobbel|Ronald Koeman|Frank de Boer|Danny Blind', midfielders: 'Frank Rijkaard|Wim Jonk|Richard Witschge', forwards: 'Dennis Bergkamp|Marc Overmars|Bryan Roy' }),
  historicalTeam({ id: 'ro_1994', name: 'Rumanía', year: 1994, achievement: 'Cuartos de final', colors: { primary: '#FCD116', secondary: '#002B7F' }, strength: 74, attack: 3, midfield: 3, defense: 0, gk: 0, keepers: 'Florin Prunea', defenders: 'Dan Petrescu|Daniel Prodan|Miodrag Belodedici|Tibor Selymes', midfielders: 'Ioan Lupescu|Gheorghe Popescu|Gheorghe Hagi', forwards: 'Marius Lăcătuș|Florin Răducioiu|Ilie Dumitrescu' }),
  historicalTeam({ id: 'es_1994', name: 'España', year: 1994, achievement: 'Cuartos de final', colors: { primary: '#AA151B', secondary: '#F1BF00' }, strength: 82, attack: 1, midfield: 3, defense: 2, gk: 1, keepers: 'Andoni Zubizarreta', defenders: 'Albert Ferrer|Abelardo Fernández|Fernando Hierro|Sergi Barjuán', midfielders: 'Pep Guardiola|Luis Enrique|Jon Andoni Goikoetxea', forwards: 'José Luis Caminero|Julio Salinas|Txiki Begiristain' }),

  // 1990
  historicalTeam({ id: 'de_1990', name: 'Alemania Occidental', year: 1990, achievement: 'Campeón', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 95, attack: 3, midfield: 4, defense: 3, gk: 2, keepers: 'Bodo Illgner', defenders: 'Thomas Berthold|Klaus Augenthaler|Jürgen Kohler|Andreas Brehme', midfielders: 'Lothar Matthäus|Pierre Littbarski|Thomas Häßler', forwards: 'Jürgen Klinsmann|Rudi Völler|Thomas Bein' }),
  historicalTeam({ id: 'ar_1990', name: 'Argentina', year: 1990, achievement: 'Subcampeón', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 88, attack: 2, midfield: 2, defense: 3, gk: 4, keepers: 'Sergio Goycochea', defenders: 'José Basualdo|Oscar Ruggeri|Juan Simón|Julio Olarticoechea', midfielders: 'Ricardo Giusti|Jorge Burruchaga|Pedro Troglio', forwards: 'Diego Maradona|Claudio Caniggia|Gustavo Dezotti' }),
  historicalTeam({ id: 'it_1990', name: 'Italia', year: 1990, achievement: 'Semifinal', colors: { primary: '#0066BC', secondary: '#FFFFFF' }, strength: 90, attack: 3, midfield: 2, defense: 4, gk: 4, keepers: 'Walter Zenga', defenders: 'Giuseppe Bergomi|Franco Baresi|Riccardo Ferri|Paolo Maldini', midfielders: 'Fernando De Napoli|Giuseppe Giannini|Roberto Donadoni', forwards: 'Roberto Baggio|Salvatore Schillaci|Gianluca Vialli' }),
  historicalTeam({ id: 'gb_1990', name: 'Inglaterra', year: 1990, achievement: 'Semifinal', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 86, attack: 2, midfield: 3, defense: 2, gk: 1, keepers: 'Peter Shilton', defenders: 'Gary Stevens|Des Walker|Terry Butcher|Stuart Pearce', midfielders: 'David Platt|Paul Gascoigne|Chris Waddle', forwards: 'Gary Lineker|Peter Beardsley|John Barnes' }),
  historicalTeam({ id: 'ie_1990', name: 'Irlanda', year: 1990, achievement: 'Cuartos de final', colors: { primary: '#169B62', secondary: '#FF883E' }, strength: 71, attack: 0, midfield: 2, defense: 2, gk: 2, keepers: 'Packie Bonner', defenders: 'Chris Morris|Mick McCarthy|Kevin Moran|Steve Staunton', midfielders: 'Ray Houghton|Andy Townsend|Paul McGrath', forwards: 'John Aldridge|Niall Quinn|Kevin Sheedy' }),
  historicalTeam({ id: 'yu_1990', name: 'Yugoslavia', year: 1990, achievement: 'Cuartos de final', colors: { primary: '#003DA5', secondary: '#D22630' }, strength: 79, attack: 2, midfield: 4, defense: 1, gk: 1, keepers: 'Tomislav Ivković', defenders: 'Faruk Hadžibegić|Refik Šabanadžović|Davor Jozić|Vujadin Stanojković', midfielders: 'Dragan Stojković|Safet Sušić|Srečko Katanec', forwards: 'Darko Pančev|Dejan Savićević|Robert Prosinečki' }),
  historicalTeam({ id: 'cs_1990', name: 'Checoslovaquia', year: 1990, achievement: 'Cuartos de final', colors: { primary: '#D7141A', secondary: '#11457E' }, strength: 76, attack: 2, midfield: 2, defense: 1, gk: 1, keepers: 'Jan Stejskal', defenders: 'Miroslav Kadlec|Ján Kocian|František Straka|Michal Bílek', midfielders: 'Ivan Hašek|Lubomír Kubík|Jozef Chovanec', forwards: 'Tomáš Skuhravý|Ivo Knoflíček|Ľubomír Moravčík' }),
  historicalTeam({ id: 'cm_1990', name: 'Camerún', year: 1990, achievement: 'Cuartos de final', colors: { primary: '#007A5E', secondary: '#CE1126' }, strength: 73, attack: 3, midfield: 1, defense: 1, gk: 3, keepers: 'Thomas N’Kono', defenders: 'Stephen Tataw|Emmanuel Kundé|Benjamin Massing|Bertin Ebwelle', midfielders: 'Émile Mbouh|Cyrille Makanaky|Louis-Paul Mfédé', forwards: 'Roger Milla|François Omam-Biyik|André Kana-Biyik' }),

  // 1986
  historicalTeam({ id: 'ar_1986', name: 'Argentina', year: 1986, achievement: 'Campeón', colors: { primary: '#75AADB', secondary: '#FFFFFF' }, strength: 95, attack: 4, midfield: 4, defense: 2, gk: 1, keepers: 'Nery Pumpido', defenders: 'José Luis Brown|Oscar Ruggeri|José Cuciuffo|Julio Olarticoechea', midfielders: 'Sergio Batista|Jorge Burruchaga|Héctor Enrique', forwards: 'Diego Maradona|Jorge Valdano|Pedro Pasculli' }),
  historicalTeam({ id: 'de_1986', name: 'Alemania Occidental', year: 1986, achievement: 'Subcampeón', colors: { primary: '#FFFFFF', secondary: '#111111' }, strength: 92, attack: 3, midfield: 2, defense: 3, gk: 3, keepers: 'Harald Schumacher', defenders: 'Thomas Berthold|Karlheinz Förster|Ditmar Jakobs|Andreas Brehme', midfielders: 'Lothar Matthäus|Felix Magath|Norbert Eder', forwards: 'Karl-Heinz Rummenigge|Rudi Völler|Klaus Allofs' }),
  historicalTeam({ id: 'fr_1986', name: 'Francia', year: 1986, achievement: 'Semifinal', colors: { primary: '#1D3E8A', secondary: '#E31B23' }, strength: 91, attack: 2, midfield: 5, defense: 2, gk: 1, keepers: 'Joël Bats', defenders: 'Manuel Amoros|Patrick Battiston|Maxime Bossis|Thierry Tusseau', midfielders: 'Jean Tigana|Luis Fernández|Alain Giresse', forwards: 'Michel Platini|Dominique Rocheteau|Yannick Stopyra' }),
  historicalTeam({ id: 'be_1986', name: 'Bélgica', year: 1986, achievement: 'Semifinal', colors: { primary: '#EF3340', secondary: '#FBDD40' }, strength: 80, attack: 1, midfield: 3, defense: 1, gk: 3, keepers: 'Jean-Marie Pfaff', defenders: 'Eric Gerets|Michel Renquin|Stéphane Demol|Georges Grün', midfielders: 'Enzo Scifo|Jan Ceulemans|Franky Vercauteren', forwards: 'Nico Claesen|Erwin Vandenbergh|Marc Degryse' }),
  historicalTeam({ id: 'br_1986', name: 'Brasil', year: 1986, achievement: 'Cuartos de final', colors: { primary: '#F7D117', secondary: '#1E6FBF' }, strength: 90, attack: 3, midfield: 4, defense: 2, gk: 0, keepers: 'Carlos Gallo', defenders: 'Leandro|Edinho|Júlio César|Branco', midfielders: 'Alemão|Sócrates|Júnior', forwards: 'Careca|Zico|Casagrande' }),
  historicalTeam({ id: 'gb_1986', name: 'Inglaterra', year: 1986, achievement: 'Cuartos de final', colors: { primary: '#FFFFFF', secondary: '#CE1124' }, strength: 84, attack: 3, midfield: 2, defense: 2, gk: 1, keepers: 'Peter Shilton', defenders: 'Gary Stevens|Terry Fenwick|Terry Butcher|Kenny Sansom', midfielders: 'Glenn Hoddle|Peter Reid|Bryan Robson', forwards: 'Gary Lineker|Peter Beardsley|Chris Waddle' }),
  historicalTeam({ id: 'es_1986', name: 'España', year: 1986, achievement: 'Cuartos de final', colors: { primary: '#AA151B', secondary: '#F1BF00' }, strength: 82, attack: 2, midfield: 2, defense: 2, gk: 1, keepers: 'Andoni Zubizarreta', defenders: 'Tomás Reñones|Andoni Goikoetxea|Antonio Maceda|José Antonio Camacho', midfielders: 'Víctor Muñoz|Míchel González|Francisco López', forwards: 'Emilio Butragueño|Julio Salinas|Eloy Olaya' }),
  historicalTeam({ id: 'mx_1986', name: 'México', year: 1986, achievement: 'Cuartos de final', colors: { primary: '#006847', secondary: '#CE1126' }, strength: 75, attack: 2, midfield: 2, defense: 1, gk: 2, keepers: 'Pablo Larios', defenders: 'Carlos Muñoz|Fernando Quirarte|Rafael Amador|Raúl Servín', midfielders: 'Manuel Negrete|Tomás Boy|Javier Aguirre', forwards: 'Hugo Sánchez|Luis Flores|Carlos Hermosillo' }),
];

function deepClone(opponent, level, boost = 0) {
  return {
    ...opponent,
    level,
    strength: clamp(opponent.strength + boost),
    ratings: Object.fromEntries(Object.entries(opponent.ratings).map(([k, v]) => [k, clamp(v + boost)])),
    colors: { ...opponent.colors },
    lineup: opponent.lineup.map((p) => ({ ...p, ovr: clamp(p.ovr + boost) })),
    // DT de esta edición (Argentina 1986 → Bilardo), o null. Lookup determinista
    // (no consume RNG), así que no altera la reproducibilidad del sorteo.
    manager: managerForOpponent(opponent),
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
  // Rampa de arranque: en los niveles con descuento (1-5), si el pool no tiene
  // rivales tan blandos como el objetivo, el elegido se debilita hasta él. Así
  // la dificultad temprana sigue la curva aunque el catálogo tenga un piso.
  if ((CONFIG.OPP_EARLY_EASE[level] || 0) > 0 && picked.strength > target) {
    boost = Math.round(target - picked.strength);
  }
  return deepClone(picked, level, boost);
}
