const average = (solves, range, mean = false) => {
  let sum = 0,
    i = solves.length - range;
  let best = solves[i].time,
    worst = solves[i].time;
  for (i = solves.length - range; i < solves.length; i += 1) {
    sum += solves[i].time;
    best = Math.min(solves[i].time, best);
    worst = Math.max(solves[i].time, worst);
  }
  if (!mean) sum -= worst + best;
  let divisor = mean ? range : range - 2;
  return sum / divisor;
};

module.exports = average;
