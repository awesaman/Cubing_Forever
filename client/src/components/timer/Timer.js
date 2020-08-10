import React, { Fragment, useState, useEffect } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import scrambo from 'scrambo';
const Scrambo = require('scrambo');

const Timer = () => {
  const [event, setEvent] = useState('3x3');
  const [scramble, setScramble] = useState('Loading...');

  const getEvent = () => {
    let res = eventNaming[event];
    let len = -1;
    let nxn = false;
    let n = res[1];
    if (res[0] === n && n === res[2]) {
      res = res.slice(0, 3);
      if (n === '2') len = 11;
      if (n === '3') len = 20;
      if (n === '4') len = 40;
      if (n === '5') len = 60;
      if (n === '6') len = 80;
      if (n === '7') len = 100;
      nxn = true;
    }
    return [res, len, nxn];
  };

  const generateScramble = () => {
    const ev = getEvent();
    console.log(ev);
    var seeded_scramble;
    if (ev[2] === true)
      seeded_scramble = new Scrambo()
        .type(ev[0])
        .seed(new Date().getTime())
        .length(ev[1])
        .get();
    else
      seeded_scramble = new Scrambo()
        .type(ev[0])
        .seed(new Date().getTime())
        .get();
    setScramble(seeded_scramble);
  };
  const changeEvent = e => {
    setEvent(e.target.value);
    generateScramble();
    console.log(event);
  };

  useEffect(() => {
    generateScramble();
  }, [event]);

  return (
    <Fragment>
      <select name='name' value={event} onChange={changeEvent}>
        <option>* Select Event</option>
        <option value='3x3'>3x3</option>
        <option value='2x2'>2x2</option>
        <option value='4x4'>4x4</option>
        <option value='5x5'>5x5</option>
        <option value='6x6'>6x6</option>
        <option value='7x7'>7x7</option>
        <option value='3x3 One-Handed'>3x3 One-Handed</option>
        <option value='3x3 Blindfolded'>3x3 Blindfolded</option>
        <option value='3x3 Multi-Blind'>3x3 Multi-Blind</option>
        <option value='3x3 Fewest Moves'>3x3 Fewest Moves</option>
        <option value='4x4 Blindfolded'>4x4 Blindfolded</option>
        <option value='5x5 Blindfolded'>5x5 Blindfolded</option>
        <option value='Pyraminx'>Pyraminx</option>
        <option value='Megaminx'>Megaminx</option>
        <option value='Square-1'>Square-1</option>
        <option value='Skewb'>Skewb</option>
        <option value="Rubik's Clock">Rubik's Clock</option>
      </select>
      <span>
        <button onClick={() => generateScramble()}>
          Generate New Scramble
        </button>
      </span>
      <h1 className='XL'>{event}</h1>
      <p className='S'>Scramble: {scramble}</p>
    </Fragment>
  );
};

export default Timer;
