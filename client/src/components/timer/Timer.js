import React, { Fragment, useState, useEffect, useRef } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import { Scrambow } from '/Users/aman/Documents/CODE/MERN/CubingForever/client/node_modules/scrambow/dist/scrambow';
import useKey from '../../utils/useKey';
import { getSession } from '../../actions/solve';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Timer = ({ getSession, solve: { solves } }) => {
  const [event, setEvent] = useState('3x3');
  const [displaySolve, setDisplaySolve] = useState(solves.length - 1);
  const [scramble, setScramble] = useState('Loading...');
  const [inspection, toggleInspection] = useState(false);
  const [P2, toggleP2] = useState(false);
  const [DNF, toggleDNF] = useState(false);
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
    generateScramble();
    setDisplaySolve(solves.length - 1);
  };

  const generateScramble = () => {
    let ev = eventNaming[event];
    if (ev.slice(0, 3) === '333' && ev !== '333fm') ev = '333';
    if (ev.slice(0, 3) === '444') ev = '444';
    if (ev.slice(0, 3) === '555') ev = '555';
    const seeded_scramble = new Scrambow().setType(ev).get();
    setScramble(seeded_scramble[0].scramble_string);
  };

  const getNewSession = event => {
    // change to Create New Session
    getSession(event);
  };

  const changeEvent = e => {
    setEvent(e.target.value);
    generateScramble();
  };

  const handleSpace = () => {
    if (status === 'stopped') start();
    if (status === 'started') stop();
  };

  useEffect(() => {
    generateScramble();
    getSession(event);
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
            {solves.length === 0 && (
              <button
                className='btn btn-light btn-small'
                onClick={() => getNewSession(event)}
              >
                Continue Previous Session
              </button>
            )}
            <button
              className='btn btn-light btn-small'
              onClick={() => generateScramble()}
            >
              Clear Session
            </button>
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
          {solves.map(sol => (
            <span
              className='pointer-cursor'
              onClick={() => setDisplaySolve(solves.indexOf(sol))}
            >
              {sol.time},{' '}
            </span>
          ))}
        </div>
        <div>
          {solves.length > 0 && displaySolve >= 0 && (
            <Fragment>
              <p className='S'>Solve Info</p>
              <p>Time: {solves[displaySolve].time}</p>
              <p>Scramble: {solves[displaySolve].scramble}</p>
              <button className='btn btn-danger btn-small' onClick={getSession}>
                Delete
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

Timer.propTypes = {
  getSession: PropTypes.func.isRequired,
  solve: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  solve: state.solve,
});

export default connect(mapStateToProps, { getSession })(Timer);
