// Informe headless de ajuste. Ejecuta: npm run balance:report

import { createRun, rollPlayerPack, choosePlayerCard, rollItemPack, chooseItemCard, autoFillStarting11, playMatch } from '../state/run.js';
import { playerOVR } from '../engine/ovr.js';
import { calcularRatings } from '../engine/teamRatings.js';
import { generateOpponent } from '../data/opponents.js';
import { RNG } from '../engine/rng.js';

const N = 3000;
let wins = 0;
let draws = 0;
let losses = 0;
let starterOVR = 0;
let itemUplift = 0;

const ratingSum = (ratings) => Object.values(ratings).reduce((sum, value) => sum + value, 0);

for (let seed = 1; seed <= N; seed++) {
  const state = createRun({ seed });
  starterOVR += state.squad.reduce((sum, p) => sum + playerOVR(p), 0) / state.squad.length;

  const bestPlayer = rollPlayerPack(state)
    .filter((p) => p.selectable)
    .sort((a, b) => playerOVR(b) - playerOVR(a))[0];
  choosePlayerCard(state, bestPlayer);
  autoFillStarting11(state);

  const before = calcularRatings({ starting11: state.starting11, items: [] });
  const bestItem = rollItemPack(state)
    .map((item) => ({
      item,
      uplift: ratingSum(calcularRatings({ starting11: state.starting11, items: [item] })) - ratingSum(before),
    }))
    .sort((a, b) => b.uplift - a.uplift)[0];
  itemUplift += bestItem.uplift;
  chooseItemCard(state, bestItem.item);

  const result = playMatch(state);
  if (result.golesA > result.golesB) wins++;
  else if (result.golesA === result.golesB) draws++;
  else losses++;
}

const used = [];
const firstTwentyStrengths = [];
for (let level = 1; level <= 20; level++) {
  const opponent = generateOpponent(level, new RNG(1000 + level), used);
  used.push(opponent.id);
  firstTwentyStrengths.push(opponent.strength);
}

console.log(JSON.stringify({
  simulations: N,
  level1: {
    winRate: +(wins * 100 / N).toFixed(1),
    drawRate: +(draws * 100 / N).toFixed(1),
    lossRate: +(losses * 100 / N).toFixed(1),
  },
  averageStarterOVR: +(starterOVR / N).toFixed(1),
  averageBestItemRatingUplift: +(itemUplift / N).toFixed(2),
  firstTwentyOpponentStrengths: firstTwentyStrengths,
}, null, 2));
