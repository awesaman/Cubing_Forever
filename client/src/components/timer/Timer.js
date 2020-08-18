import React, { Fragment, useState, useEffect, useRef } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import { Scrambow } from '/Users/aman/Documents/CODE/MERN/CubingForever/client/node_modules/scrambow/dist/scrambow';
import useSpace from '../../utils/useKey';
import {
  getSession,
  newSession,
  clearSession,
  addSolve,
  deleteSolve,
} from '../../actions/solve';
import { getCurrentProfile } from '../../actions/profile';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Timer = ({
  getSession,
  newSession,
  clearSession,
  addSolve,
  deleteSolve,
  getCurrentProfile,
  profile: { profile },
  solve: { session, loading },
}) => {
  // state
  const [event, setEvent] = useState('3x3');
  const [displaySolve, setDisplaySolve] = useState(-1);
  const [scramble, setScramble] = useState('Loading...');
  const [showMo3, toggleShowMo3] = useState(false);
  const [inspection, toggleInspection] = useState(false);
  const [time, setTime] = useState({ cs: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState('ready');

  // variables for time
  var newcs = time.cs,
    news = time.s,
    newm = time.m,
    newh = time.h;

  // timer functions
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
  };

  const generateScramble = async () => {
    let ev = eventNaming[event];
    if (ev.slice(0, 3) === '333' && ev !== '333fm') ev = '333';
    if (ev.slice(0, 3) === '444') ev = '444';
    if (ev.slice(0, 3) === '555') ev = '555';
    const seeded_scramble = new Scrambow().setType(ev).get();
    await setScramble(seeded_scramble[0].scramble_string);
  };

  // handle pressing the spacebar
  const handleUp = () => {
    if (status === 'ready') start();
    if (status === 'stopped') setStatus('ready');
  };

  const handleDown = () => {
    if (status === 'started') stop();
  };

  // general helpful functions
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

  // handling all options available to the user
  const changeEvent = async e => {
    await setEvent(e.target.value);
    setDisplaySolve(-1);
  };

  const removeSolve = () => {
    deleteSolve(event, session.solves[displaySolve]._id);
    setDisplaySolve(displaySolve - 1);
  };

  const clearSolves = async () => {
    await setDisplaySolve(-1);
    await clearSession(event);
  };

  const getNewSession = async () => {
    await newSession(event);
    await getSession(event);
  };

  // functions to run when state changes
  useEffect(() => {
    if (!profile) getCurrentProfile();
    getSession(event);
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
  }, [event, loading]);

  useEffect(() => {
    if (session.solves && session.solves.length > 0)
      setDisplaySolve(session.solves.length - 1);
    else setDisplaySolve(-1);
    generateScramble();
  }, [session.solves]);

  useSpace('keyup', handleUp);
  useSpace('keydown', handleDown);

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
            {profile &&
              profile.events.map(ev => (
                <option value={ev.name}>{ev.name}</option>
              ))}
          </select>
        </div>
        <div className='sidebar'>
          <div className='mbottom'>
            <h1 className='M'>Options</h1>
            {session.solves && session.solves.length !== 0 && (
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
            <button
              className='btn btn-light btn-small'
              onClick={() => toggleShowMo3(!showMo3)}
            >
              {showMo3 ? 'Hide' : 'Show'} Mean of 3
            </button>
          </div>

          <div>
            <h1 className='M'>Stats</h1>
            {session.solves && session.solves.length >= 3 && showMo3 && (
              <Fragment>
                <p>Current Mean 3: {formatTime(session.cmo3)}</p>
                <p>Best Mean 3: {formatTime(session.bmo3)}</p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 5 && (
              <Fragment>
                <p>Current Avg 5: {formatTime(session.cavg5)}</p>
                <p>Best Avg 5:{formatTime(session.bavg5)}</p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 12 && (
              <Fragment>
                <p>Current Avg 12: {formatTime(session.cavg12)}</p>
                <p>Best Avg 12: {formatTime(session.bavg12)}</p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 50 && (
              <Fragment>
                <p>Current Avg 50: {formatTime(session.cavg50)}</p>
                <p>Best Avg 50: {formatTime(session.bavg50)}</p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 100 && (
              <Fragment>
                <p>Current Avg 100: {formatTime(session.cavg100)}</p>
                <p>Best Avg 100: {formatTime(session.bavg100)}</p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 1 && (
              <Fragment>
                <p>Number of Solves: {session.numsolves}</p>
                <p>Session Mean: {formatTime(session.mean)}</p>
              </Fragment>
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
            {time.s}
            <span className='centiseconds'>
              .{time.cs < 10 && '0'}
              {time.cs}
            </span>
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
            {session.solves && session.solves.length > 0 ? (
              session.solves.map(sol => (
                <span
                  className='pointer-cursor'
                  onClick={() => setDisplaySolve(session.solves.indexOf(sol))}
                >
                  {formatTime(sol.time)}
                  {session.solves.indexOf(sol) !==
                    session.solves.length - 1 && <span>, </span>}
                </span>
              ))
            ) : (
              <p>There are currently no solves in this session. </p>
            )}
          </div>
          <div>
            {session.solves && session.solves.length > 0 && displaySolve >= 0 && (
              <Fragment>
                <p className='S'>Solve Info</p>
                <div className='scrollable'>
                  <p>Time: {formatTime(session.solves[displaySolve].time)}</p>
                  <p>Scramble: {session.solves[displaySolve].scramble}</p>
                  <button
                    className='btn btn-danger btn-small'
                    onClick={removeSolve}
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
  deleteSolve: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  solve: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  solve: state.solve,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getSession,
  newSession,
  clearSession,
  addSolve,
  deleteSolve,
  getCurrentProfile,
})(Timer);
