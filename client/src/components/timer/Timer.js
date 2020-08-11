import React, { Fragment, useState, useEffect } from 'react';
import eventNaming from '../../utils/eventNaming.json';
// const Scrambow = require('scrambow');
import { Scrambow } from '/Users/aman/Documents/CODE/MERN/CubingForever/client/node_modules/scrambow/dist/scrambow';

const Timer = () => {
  const [event, setEvent] = useState('3x3');
  const [scramble, setScramble] = useState('Loading...');

  const generateScramble = () => {
    let ev = eventNaming[event];
    if (ev.slice(0, 3) === '333' && ev !== '333fm') ev = '333';
    if (ev.slice(0, 3) === '444') ev = '444';
    if (ev.slice(0, 3) === '555') ev = '555';
    const seeded_scramble = new Scrambow().setType(ev).get();
    setScramble(seeded_scramble[0].scramble_string);
  };

  const changeEvent = e => {
    setEvent(e.target.value);
    generateScramble();
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
      <p>Scramble: {scramble}</p>
      <p className='S'>Solves: {scramble}</p>
    </Fragment>
  );
};

export default Timer;
