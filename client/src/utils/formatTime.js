const formatTime = (num, penalty = null) => {
  if (typeof num !== 'number') return num;
  num = Math.round(100 * num) / 100;
  let h = Math.floor(num / 3600);
  let m = Math.floor((num - h * 60) / 60);
  let s = Math.floor(num - 3600 * h - m * 60);
  let cs = num - 3600 * h - m * 60 - s;
  cs = Math.floor(100 * cs);
  let result = ``;
  if (h > 0) {
    result = result.concat(h, ':');
    if (m < 10) result = result.concat('0');
  }
  if (m > 0) {
    result = result.concat(m, ':');
    if (s < 10) result = result.concat('0');
  }
  if (s > 0) {
    result = result.concat(s, '.');
    if (cs < 10) result = result.concat('0');
  } else {
    result = result.concat('0.');
    if (cs < 10) result = result.concat('0');
  }
  result = result.concat(cs);
  if (penalty === '+2') result = result.concat('+');
  if (penalty === 'DNF') result = result.concat(' DNF');
  return result;
};

export default formatTime;
