import React, { Fragment, useState, useEffect } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import { Scrambow } from '../../../node_modules/scrambow/dist/scrambow';
import useSpace from '../../utils/useKey';
import {
  getSession,
  newSession,
  clearSession,
  addSolve,
  addPenalty,
  deleteSolve,
  updateStats,
} from '../../actions/solve';
import { getCurrentProfile } from '../../actions/profile';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

console.log(eventNaming);

const Timer = ({
  getSession,
  newSession,
  clearSession,
  addSolve,
  addPenalty,
  deleteSolve,
  updateStats,
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
  const [repeater, setRepeater] = useState();
  const [penalty, setPenalty] = useState('');
  const [status, setStatus] = useState('ready');
  const [green, setGreen] = useState(false);

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

  const runInspection = () => {
    news--;
    if (news < -1) {
      setStatus('DNF');
      setPenalty('DNF');
    }
    if (news === 0 || news === -1) {
      setStatus('+2');
      setPenalty('+2');
    }
    return setTime({ ...time, s: news });
  };

  const reset = () => {
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
    clearInterval(repeater);
    // setPenalty('');
    newcs = news = newm = newh = 0;
  };

  const inspect = () => {
    reset();
    setTime({ ...time, s: 15 });
    news = 15;
    setStatus('inspecting');
    setRepeater(setInterval(runInspection, 1000));
  };

  const start = () => {
    reset();
    setStatus('started');
    run();
    setRepeater(setInterval(run, 10));
  };

  const stop = async () => {
    clearInterval(repeater);
    setStatus('stopped');
    let t = 3600 * time.h + 60 * time.m + time.s + 0.01 * time.cs;
    t = Math.floor(t * 100) / 100;
    await addSolve(event, { time: t, scramble });
    await updateStats(event);
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
    if (status === 'ready') inspection ? inspect() : start();
    if (status === 'inspecting' || status === '+2' || status === 'DNF') start();
    if (status === 'stopped') setStatus('ready');
    setGreen(false);
  };

  const handleDown = () => {
    if (status === 'started') stop();
    else setGreen(true);
  };

  // general helpful functions
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

  // handling all options available to the user
  const changeEvent = async e => {
    await setEvent(e.target.value);
    setDisplaySolve(-1);
  };

  const removeSolve = async () => {
    await setDisplaySolve(displaySolve - 1);
    await deleteSolve(event, session.solves[displaySolve]._id);
    await updateStats(event);
  };

  const plus2 = async () => {
    await addPenalty(event, session.solves[displaySolve]._id, '+2');
    await updateStats(event);
  };

  const dnf = async () => {
    await addPenalty(event, session.solves[displaySolve]._id, 'DNF');
    await updateStats(event);
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
    if (penalty !== '')
      addPenalty(event, session.solves[session.solves.length - 1]._id, penalty);
    setPenalty('');
  }, [session.solves]);

  useEffect(() => {
    if (status === '+2') setPenalty('+2');
    if (status === 'DNF') setPenalty('DNF');
    if (status === 'ready') generateScramble();
  }, [status]);

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
                <option key={ev._id} value={ev.name}>
                  {ev.name}
                </option>
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
                <p>
                  Current Mean 3:{' '}
                  <span className='S'>{formatTime(session.cmo3)}</span>
                </p>
                <p>
                  Best Mean 3:{' '}
                  <span className='S'>{formatTime(session.bmo3)}</span>
                </p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 5 && (
              <Fragment>
                <p>
                  Current Avg 5:{' '}
                  <span className='S'>{formatTime(session.cavg5)}</span>
                </p>
                <p>
                  {'('}Best Avg 5{'): '}
                  <span className='S'>{formatTime(session.bavg5)}</span>
                </p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 12 && (
              <Fragment>
                <p>
                  Current Avg 12:{' '}
                  <span className='S'>{formatTime(session.cavg12)}</span>
                </p>
                <p>
                  {'['}Best Avg 12{']: '}
                  <span className='S'>{formatTime(session.bavg12)}</span>
                </p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 50 && (
              <Fragment>
                <p>
                  Current Avg 50:{' '}
                  <span className='S'>{formatTime(session.cavg50)}</span>
                </p>
                <p>
                  {'{'}Best Avg 50{'}: '}
                  <span className='S'>{formatTime(session.bavg50)}</span>
                </p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 100 && (
              <Fragment>
                <p>
                  Current Avg 100:{' '}
                  <span className='S'>{formatTime(session.cavg100)}</span>
                </p>
                <p>
                  {'<'}Best Avg 100{'>: '}
                  <span className='S'>{formatTime(session.bavg100)}</span>
                </p>
                <br />
              </Fragment>
            )}
            {session.solves && session.solves.length >= 1 && (
              <Fragment>
                <p>Number of Solves: {session.numsolves}</p>
                <p>Session Mean: {formatTime(session.mean)}</p>
                <p>Best Solve: {formatTime(session.best)}</p>
                <p>Worst Solve: {formatTime(session.worst)}</p>
              </Fragment>
            )}
          </div>
        </div>
        <div>
          {(status === 'stopped' ||
            status === 'started' ||
            status === 'ready') && (
            <h1 className={green ? 'XL green' : 'XL'}>
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
          )}
          {status === 'inspecting' && (
            <h1 className={green ? 'XL green' : 'XL'}>{time.s}</h1>
          )}
          {status === '+2' && <h1 className='XL red'>+2</h1>}
          {status === 'DNF' && <h1 className='XL red'>DNF</h1>}
          <p>Scramble: {scramble}</p>
        </div>
        <div className='solves'>
          <p className='S inline'>Solves </p>
          <small className='inline'>
            (click on a solve to reveal info about it)
          </small>
          <br />
          <div className='mbottom'>
            {session.solves && session.solves.length > 0 ? (
              session.solves.map(sol => (
                <span
                  key={sol._id}
                  className='pointer-cursor'
                  onClick={() => setDisplaySolve(session.solves.indexOf(sol))}
                >
                  {session.solves.indexOf(sol) === session.bavg100loc && '<'}
                  {session.solves.indexOf(sol) === session.bavg50loc && '{'}
                  {session.solves.indexOf(sol) === session.bavg12loc && '['}
                  {session.solves.indexOf(sol) === session.bavg5loc && '('}
                  {sol.penalty
                    ? formatTime(sol.time, sol.penalty)
                    : formatTime(sol.time)}
                  {session.solves.indexOf(sol) === session.bavg5loc + 4 && ')'}
                  {session.solves.indexOf(sol) === session.bavg12loc + 11 &&
                    ']'}
                  {session.solves.indexOf(sol) === session.bavg50loc + 49 &&
                    '}'}
                  {session.solves.indexOf(sol) === session.bavg100loc + 99 &&
                    '>'}
                  {session.solves.indexOf(sol) !== session.solves.length - 1 &&
                    ', '}
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
                <div>
                  <p>Time: {formatTime(session.solves[displaySolve].time)}</p>
                  {session.solves[displaySolve].penalty && (
                    <p>Penalty: {session.solves[displaySolve].penalty}</p>
                  )}
                  <p>
                    Solve: {displaySolve + 1}/{session.numsolves}
                  </p>
                  <p>Scramble: {session.solves[displaySolve].scramble}</p>
                  <div className='buttons'>
                    <button
                      className='btn btn-danger btn-small btn-auto'
                      onClick={removeSolve}
                    >
                      Delete
                    </button>
                    {session.solves[displaySolve].penalty !== 'DNF' && (
                      <Fragment>
                        {session.solves[displaySolve].penalty !== '+2' && (
                          <button
                            className='btn btn-light btn-small btn-auto'
                            onClick={plus2}
                          >
                            +2
                          </button>
                        )}
                        <button
                          className='btn btn-light btn-small btn-auto'
                          onClick={dnf}
                        >
                          DNF
                        </button>
                      </Fragment>
                    )}
                  </div>
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
  addPenalty: PropTypes.func.isRequired,
  deleteSolve: PropTypes.func.isRequired,
  updateStats: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  solve: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
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
  addPenalty,
  deleteSolve,
  updateStats,
  getCurrentProfile,
})(Timer);
