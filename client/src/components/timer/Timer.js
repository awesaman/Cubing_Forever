import React, { Fragment, useState, useEffect, useRef } from 'react';
import eventNaming from '../../utils/eventNaming.json';
// const Scrambow = require('scrambow');
import { Scrambow } from '/Users/aman/Documents/CODE/MERN/CubingForever/client/node_modules/scrambow/dist/scrambow';

const useKey = (key, cb) => {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    const handle = e => {
      if (e.code === key) {
        callbackRef.current(e);
      }
    };
    document.addEventListener('keypress', handle);
    return () => document.removeEventListener('keypress', handle);
  }, []);
};

const Timer = () => {
  const [event, setEvent] = useState('3x3');
  const [scramble, setScramble] = useState('Loading...');
  const [inspection, toggleInspection] = useState(false);
  const [P2, toggleP2] = useState(false);
  const [DNF, toggleDNF] = useState(false);
  const [solves, setSolves] = useState([]);
  const [time, setTime] = useState({ cs: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState('stopped');

  var newcs = time.cs,
    news = time.s,
    newm = time.m,
    newh = time.h;

  const run = () => {
    if (newm === 60) {
      newh++;
      newm = 0;
    }
    if (news === 60) {
      newm++;
      news = 0;
    }
    if (newcs === 100) {
      news++;
      newcs = 0;
    }
    newcs++;
    return setTime({ cs: newcs, s: news, m: newm, h: newh });
  };

  const reset = () => {
    clearInterval(interv);
    setStatus('stopped');
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
  };

  const start = () => {
    reset();
    run();
    setStatus('started');
    setInterv(setInterval(run, 10));
  };

  const stop = () => {
    clearInterval(interv);
    setStatus('stopped');
  };

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

  const handleSpace = () => {
    console.log(time.h, time.m, time.s, time.cs);
    console.log(status);
    if (status === 'stopped') start();
    if (status === 'started') stop();
  };

  useEffect(() => {
    generateScramble();
  }, [event]);

  useKey('Space', handleSpace);

  return (
    <Fragment>
      <div className='timer'>
        <div className='timer-top'>
          <div>
            <img
              src={require(`../../img/events/${eventNaming[event]}.svg`)}
              alt={event.name}
              className='small-image'
            />
          </div>
          <select
            className='event-picker'
            name='name'
            value={event}
            onChange={changeEvent}
          >
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
        </div>
        <div className='sidebar'>
          <div className='mbottom'>
            <h1 className='M'>Options</h1>
            <button
              className='btn btn-light btn-small'
              onClick={() => generateScramble()}
            >
              New Scramble
            </button>
            <button
              className='btn btn-light btn-small'
              onClick={() => toggleInspection(!inspection)}
            >
              Turn {inspection ? 'off' : 'on'} Inspection
            </button>
            <button
              className='btn btn-light btn-small'
              onClick={() => toggleP2(!P2)}
            >
              +2
            </button>
            <button
              className='btn btn-light btn-small'
              onClick={() => toggleDNF(!DNF)}
            >
              DNF
            </button>
          </div>
          <div>
            <h1 className='M'>Stats</h1>
            {solves.length >= 5 && <p className='S'>Current Avg 5: </p>}
            {solves.length >= 5 && <p className='S'>Best Avg 5: </p>}
            {solves.length >= 12 && <p className='S'>Current Avg 12: </p>}
            {solves.length >= 12 && <p className='S'>Best Avg 12: </p>}
            {solves.length >= 50 && <p className='S'>Current Avg 50: </p>}
            {solves.length >= 50 && <p className='S'>Best Avg 50: </p>}
            {solves.length >= 100 && <p className='S'>Current Avg 100: </p>}
            {solves.length >= 100 && <p className='S'>Best Avg 100: </p>}
          </div>
        </div>
        <div>
          <h1 className='XL'>
            {time.h > 0 && <span>{time.h}:</span>}
            {time.m > 0 && <span>{time.m}:</span>}
            {time.s}.{time.cs >= 10 ? time.cs : '0' + time.cs}
          </h1>
          <p>Scramble: {scramble}</p>
        </div>
        <div className='solves'>
          <p className='S'>Solves: highlight highest and lowest</p>
        </div>
        <div>
          {solves.length > 0 && (
            <p className='S'>Click on a solve to reveal info about it </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Timer;
