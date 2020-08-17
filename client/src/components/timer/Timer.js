import React, { Fragment, useState, useEffect, useRef } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import { Scrambow } from '/Users/aman/Documents/CODE/MERN/CubingForever/client/node_modules/scrambow/dist/scrambow';
import useKey from '../../utils/useKey';
import {
  getSession,
  newSession,
  clearSession,
  addSolve,
} from '../../actions/solve';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Timer = ({
  getSession,
  newSession,
  clearSession,
  addSolve,
  solve: { solves, loading },
}) => {
  const [event, setEvent] = useState('3x3');
  const [displaySolve, setDisplaySolve] = useState(solves.length - 1);
  const [scramble, setScramble] = useState('Loading...');
  const [inspection, toggleInspection] = useState(false);
  const [time, setTime] = useState({ cs: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState('stopped');
  let bavg5 = Number.MAX_SAFE_INTEGER,
    cavg5 = Number.MAX_SAFE_INTEGER,
    bavg12 = Number.MAX_SAFE_INTEGER,
    cavg12 = Number.MAX_SAFE_INTEGER,
    bavg50 = Number.MAX_SAFE_INTEGER,
    cavg50 = Number.MAX_SAFE_INTEGER,
    bavg100 = Number.MAX_SAFE_INTEGER,
    cavg100 = Number.MAX_SAFE_INTEGER;

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
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
    clearInterval(interv);
    newcs = news = newm = newh = 0;
  };

  const start = () => {
    reset();
    setStatus('started');
    run();
    setInterv(setInterval(run, 10));
  };

  const stop = () => {
    clearInterval(interv);
    setStatus('stopped');
    let t = 3600 * time.h + 60 * time.m + time.s + 0.01 * time.cs;
    t = Math.round(t * 100) / 100;
    addSolve(event, { time: t, scramble });
    generateScramble();
  };

  const generateScramble = () => {
    let ev = eventNaming[event];
    if (ev.slice(0, 3) === '333' && ev !== '333fm') ev = '333';
    if (ev.slice(0, 3) === '444') ev = '444';
    if (ev.slice(0, 3) === '555') ev = '555';
    const seeded_scramble = new Scrambow().setType(ev).get();
    setScramble(seeded_scramble[0].scramble_string);
  };

  const changeEvent = async e => {
    await setEvent(e.target.value);
    generateScramble();
    await setDisplaySolve(-1);
  };

  const handleSpace = () => {
    if (status === 'stopped') start();
    if (status === 'started') stop();
  };

  const formatTime = num => {
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
    } else result = result.concat('0.');
    result = result.concat(cs);
    return result;
  };

  const average = (range, mean = false) => {
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

  const clearSolves = async () => {
    await setDisplaySolve(-1);
    await clearSession(event);
    await console.log(solves.length);
  };

  const getNewSession = async () => {
    await newSession(event);
    await getSession(event);
  };

  useEffect(() => {
    generateScramble();
    if (solves.length > 0) setDisplaySolve(solves.length - 1);
    else setDisplaySolve(-1);
    console.log(displaySolve);
    getSession(event);
    if (solves.length >= 5) cavg5 = average(5);
    if (solves.length >= 12) cavg12 = average(12);
    if (solves.length >= 50) cavg50 = average(50);
    if (solves.length >= 100) cavg100 = average(100);
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
  }, [event, loading]);

  useEffect(() => {
    if (solves.length > 0) setDisplaySolve(solves.length - 1);
    else setDisplaySolve(-1);
  }, [solves]);

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
            {solves.length !== 0 && (
              <Fragment>
                <button
                  className='btn btn-light btn-small'
                  onClick={getNewSession}
                >
                  New Session
                </button>
                <button
                  className='btn btn-light btn-small'
                  onClick={clearSolves}
                >
                  Clear Session
                </button>
              </Fragment>
            )}
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
          </div>
          <div>
            <h1 className='M'>Stats</h1>
            {solves.length >= 5 && (cavg5 = average(5)) && (
              <p>Current Avg 5: {formatTime(cavg5)}</p>
            )}
            {solves.length >= 5 && (
              <p>Best Avg 5: {formatTime((bavg5 = Math.min(bavg5, cavg5)))}</p>
            )}
            {solves.length >= 12 && (cavg12 = average(12)) && (
              <p>Current Avg 12: {formatTime(cavg12)}</p>
            )}
            {solves.length >= 12 && (
              <p>
                Best Avg 12: {formatTime((bavg12 = Math.min(bavg12, cavg12)))}
              </p>
            )}
            {solves.length >= 50 && (cavg50 = average(50)) && (
              <p>Current Avg 50: {formatTime(cavg50)}</p>
            )}
            {solves.length >= 50 && (
              <p>
                Best Avg 50: {formatTime((bavg50 = Math.min(bavg50, cavg50)))}
              </p>
            )}
            {solves.length >= 100 && (cavg100 = average(100)) && (
              <p>Current Avg 100: {formatTime(cavg100)}</p>
            )}
            {solves.length >= 100 && (
              <p>
                Best Avg 100:{' '}
                {formatTime((bavg100 = Math.min(bavg100, cavg100)))}
              </p>
            )}
          </div>
        </div>
        <div>
          <h1 className='XL'>
            {time.h > 0 && (
              <span>
                {time.h}:{time.m < 10 && '0'}
              </span>
            )}
            {time.m > 0 && (
              <span>
                {time.m}:{time.s < 10 && '0'}
              </span>
            )}
            {time.s}.{time.cs < 10 && '0'}
            {time.cs}
          </h1>
          <p>Scramble: {scramble}</p>
        </div>
        <div className='solves'>
          <p className='S inline'>Solves </p>
          <small className='inline'>
            (click on a solve to reveal info about it)
          </small>
          <br />
          <div className='scrollable'>
            {solves.length > 0 ? (
              solves.map(sol => (
                <span
                  className='pointer-cursor'
                  onClick={() => setDisplaySolve(solves.indexOf(sol))}
                >
                  {sol.time}
                  {solves.indexOf(sol) !== solves.length - 1 && <span>, </span>}
                </span>
              ))
            ) : (
              <p>There are currently no solves in this session. </p>
            )}
          </div>
          <div>
            {solves.length > 0 && displaySolve >= 0 && (
              <Fragment>
                <p className='S'>Solve Info</p>
                <div className='scrollable'>
                  <p>Time: {solves[displaySolve].time}</p>
                  <p>Scramble: {solves[displaySolve].scramble}</p>
                  <button
                    className='btn btn-danger btn-small'
                    onClick={getSession}
                  >
                    Delete
                  </button>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Timer.propTypes = {
  getSession: PropTypes.func.isRequired,
  newSession: PropTypes.func.isRequired,
  clearSession: PropTypes.func.isRequired,
  addSolve: PropTypes.func.isRequired,
  solve: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  solve: state.solve,
});

export default connect(mapStateToProps, {
  getSession,
  newSession,
  clearSession,
  addSolve,
})(Timer);
