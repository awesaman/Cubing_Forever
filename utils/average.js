const average = (solves, range, mean = false) => {
  let sum = 0;
  let i = solves.length - range;
  let seenDNF = false;
  let best = solves[i].time,
    worst = solves[i].time;
  for (i = solves.length - range; i < solves.length; i++) {
    sum += solves[i].time;
    best = Math.min(solves[i].time, best);
    if (!seenDNF) worst = Math.max(solves[i].time, worst);
    if (solves[i].penalty === 'DNF') {
      if (seenDNF && !mean) {
        return 'DNF';
      } else {
        worst = solves[i].time;
        seenDNF = true;
      }
    }
  }
  if (!mean) sum -= worst + best;
  let divisor = mean ? range : range - 2;
  return sum / divisor;
};

module.exports = average;
