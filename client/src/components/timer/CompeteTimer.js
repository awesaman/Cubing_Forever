import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Scrambow } from '../../../node_modules/scrambow/dist/scrambow';
import useSpace from '../../utils/useKey';
import moment from 'moment';
import Stats from './Stats';
import {
  getSession,
  newSession,
  clearSession,
  addSolve,
  addPenalty,
  updateStats,
} from '../../actions/solve';
import { getCurrentProfile } from '../../actions/profile';
import {
  leaveRoom,
  getStats,
  setHost,
  setStats,
  setRoomEvent,
  setRoomScramble,
  setRoomDesc,
  createRoom,
} from '../../actions/room';
import Chat from './Chat';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formatTime from '../../utils/formatTime';
import { socket } from '../../utils/socket';
const eventNaming = require('../../utils/eventNaming.json');

const CompeteTimer = ({
  getSession,
  newSession,
  clearSession,
  addSolve,
  addPenalty,
  updateStats,
  getCurrentProfile,
  leaveRoom,
  createRoom,
  setHost,
  setRoomEvent,
  setRoomScramble,
  setRoomDesc,
  setStats,
  getStats,
  room,
  auth: { user },
  profile: { profile },
  solve: { session, loading },
}) => {
  // state
  const [event, setEvent] = useState('3x3');
  const [scramble, setScramble] = useState(
    'Host has not generated any scrambles yet'
  );
  const [inspection, toggleInspection] = useState(false);
  const [time, setTime] = useState({ cs: 0, s: 0, m: 0, h: 0 });
  const [repeater, setRepeater] = useState();
  const [penalty, setPenalty] = useState('');
  const [status, setStatus] = useState('waiting');
  const [green, setGreen] = useState(false);
  const [bmo3, setbmo3] = useState(false);
  const [cmo3, setcmo3] = useState(false);
  const [bavg5, setbavg5] = useState(true);
  const [cavg5, setcavg5] = useState(true);
  const [bavg12, setbavg12] = useState(false);
  const [cavg12, setcavg12] = useState(false);
  const [best, setbest] = useState(true);
  const [worst, setworst] = useState(true);

  // variables for time
  var newcs = time.cs,
    news = time.s,
    newm = time.m,
    newh = time.h;

  // timer functions
  const run = () => {
    newcs++;
    if (newcs === 100) {
      news++;
      newcs = 0;
    }
    if (news === 60) {
      newm++;
      news = 0;
    }
    if (newm === 60) {
      newh++;
      newm = 0;
    }
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
    await addSolve(event, { time: t, scramble: room.scramble });
    await updateStats(event);
  };

  const generateScramble = () => {
    let ev = eventNaming[event];
    if (ev.slice(0, 3) === '333' && ev !== '333fm') ev = '333';
    if (ev.slice(0, 3) === '444') ev = '444';
    if (ev.slice(0, 3) === '555') ev = '555';
    const seeded_scramble = new Scrambow().setType(ev).get();
    const final_scramble = seeded_scramble[0].scramble_string;
    socket.emit('new scramble', room.roomID, final_scramble);
    setRoomScramble(final_scramble);
    setScramble(final_scramble);
    setStatus('ready');
  };

  // handle pressing the spacebar
  const handleUp = () => {
    if (status === 'ready') inspection ? inspect() : start();
    if (status === 'inspecting' || status === '+2' || status === 'DNF') start();
    if (status === 'stopped') setStatus('waiting');
    setGreen(false);
  };

  const handleDown = () => {
    if (status === 'started') stop();
    else if (status !== 'waiting') setGreen(true);
  };

  // handling all options available to the user
  const changeEvent = async e => {
    await setEvent(e.target.value);
  };

  const plus2 = async () => {
    await addPenalty(event, session.solves[session.numsolves - 1]._id, '+2');
    await updateStats(event);
  };

  const dnf = async () => {
    await addPenalty(event, session.solves[session.numsolves - 1]._id, 'DNF');
    await updateStats(event);
  };

  const clearSolves = async () => {
    await clearSession(event);
  };

  const getNewSession = async () => {
    await newSession(event);
    await getSession(event);
  };

  const leavingRoom = async () => {
    if (room.isHost) {
      socket.emit('host left', room.roomID);
    }
    socket.emit('leave room', room.roomID, {
      special: true,
      text: 'LEFT THE ROOM',
      username: user.username,
      avatar: user.avatar,
      timestamp: moment().format('hh:mm a'),
    });
    await leaveRoom();
  };

  const hostRoom = () => {
    socket.emit('new host', room.roomID, user.username);
    createRoom(room.roomID, room.desc);
    socket.emit('new event', room.roomID, event);
    setRoomEvent(event);
  };

  // functions to run when state changes
  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (loading && room.isHost) {
      socket.emit(
        'initialize room',
        room.roomID,
        user.username,
        room.event,
        room.desc,
        room.locked
      );
    }
    getNewSession(event);
    setTime({ cs: 0, s: 0, m: 0, h: 0 });
  }, [event, loading]);

  useEffect(() => {
    if (room.isHost) {
      socket.emit('new event', room.roomID, event);
      setRoomEvent(event);
      setRoomScramble('Host has not generated any scrambles yet');
      setScramble('Host has not generated any scrambles yet');
      setStatus('waiting');
    }
    getNewSession();
  }, [event]);

  useEffect(() => {
    if (!profile) return;
    let hasEvent = false;
    for (const ev of profile.events) {
      if (ev.name == event) hasEvent = true;
    }
    if (!hasEvent) setEvent(profile.events[0].name);
  }, [profile]);

  useEffect(() => {
    if (penalty !== '')
      addPenalty(event, session.solves[session.solves.length - 1]._id, penalty);
    setPenalty('');
    getStats(user.username, session);
    setScramble(scramble);
    socket.emit('solved', room.roomID, user.username, session);
  }, [session.solves]);

  useEffect(() => {
    if (status === '+2') setPenalty('+2');
    if (status === 'DNF') setPenalty('DNF');
  }, [status]);

  useEffect(() => {
    if (room.isHost) {
      socket.on('user connected', socketID => {
        socket.emit(
          'send room info',
          event,
          scramble,
          room.stats,
          room.desc,
          room.locked,
          socketID
        );
      });
    }
  }, [room.stats]);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    getStats(user.username, session);

    socket.emit('join room', room.roomID, socket.id, {
      special: true,
      text: 'JOINED THE ROOM',
      username: user.username,
      avatar: user.avatar,
      timestamp: moment().format('hh:mm a'),
    });

    socket.on('stats', (username, session) => {
      getStats(username, session);
    });

    socket.on('get scramble', scramble => {
      setRoomScramble(scramble);
      setScramble(scramble);
      if (scramble !== 'Host has not generated any scrambles yet')
        setStatus('ready');
    });

    socket.on('get event', event => {
      setRoomEvent(event);
    });

    socket.on('get room info', (event, scramble, stats, desc) => {
      setRoomEvent(event);
      setRoomScramble(scramble);
      setRoomDesc(desc);
      setScramble(scramble);
      setStats(stats);
      if (scramble !== 'Host has not generated any scrambles yet')
        setStatus('ready');
    });

    socket.on('host open', () => {
      setHost(false);
    });

    socket.on('host closed', () => {
      setHost(true);
    });

    return function cleanup() {
      leavingRoom();
    };
  }, []);

  useSpace('keyup', handleUp);
  useSpace('keydown', handleDown);

  return (
    <Fragment>
      <div className='timer'>
        {room.isHost ? (
          <div className='timer-top'>
            <div>
              <img
                src={require(`../../img/events/${eventNaming[event]}.svg`)}
                alt={event}
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
            <span>YOU ARE THE HOST</span>
          </div>
        ) : (
          <div className='timer-top'>
            {room && room.event !== '' && (
              <Fragment>
                <div>
                  <img
                    src={require(`../../img/events/${
                      eventNaming[room.event]
                    }.svg`)}
                    alt={room.event}
                    className='small-image mright'
                  />
                </div>
                <p className='M inline mright smleft'>{room.event}</p>{' '}
                {profile &&
                  profile.events &&
                  profile !== null &&
                  !profile.events.map(ev => ev.name).includes(room.event) && (
                    <Fragment>
                      {window.alert(
                        'This event is not in your profile. Please add it to your profile and return to the room.'
                      )}
                      <Redirect to='/edit-profile' />
                    </Fragment>
                  )}
              </Fragment>
            )}
            <span>HOST CHOOSES EVENT</span>
          </div>
        )}
        <div className='sidebar'>
          <div className='mbottom'>
            <h1 className='M'>Options</h1>
            {room.isHost && (
              <button
                className='btn btn-success btn-small'
                onClick={() => generateScramble()}
              >
                Next Scramble
              </button>
            )}
            {!room.hostPresent && !room.isHost && (
              <button className='btn btn-success btn-small' onClick={hostRoom}>
                Host Room
              </button>
            )}
            {session.solves && session.solves.length !== 0 && (
              <button className='btn btn-light btn-small' onClick={clearSolves}>
                Clear Session
              </button>
            )}
            <button
              className='btn btn-light btn-small'
              onClick={() => toggleInspection(!inspection)}
            >
              Turn {inspection ? 'off' : 'on'} Inspection
            </button>
            <Link
              to='/compete'
              className='btn btn-danger btn-small'
              onClick={leavingRoom}
            >
              Leave Room
            </Link>
            {session.solves &&
              session.numsolves > 0 &&
              session.solves[session.numsolves - 1].penalty !== 'DNF' && (
                <Fragment>
                  {session.solves[session.numsolves - 1].penalty !== '+2' && (
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
            <div className='checkboxes'>
              <div className='bubble-group'>
                <div>
                  <div
                    className='bubble'
                    style={cmo3 ? { backgroundColor: '#bbb' } : {}}
                    onClick={() => setcmo3(!cmo3)}
                  />
                  Mean 3
                </div>
                <div>
                  <div
                    className='bubble'
                    style={bmo3 ? { backgroundColor: '#bbb' } : {}}
                    onClick={() => setbmo3(!bmo3)}
                  />
                  Best Mean 3
                </div>
              </div>
              <div className='bubble-group'>
                <div>
                  <div
                    className='bubble'
                    style={cavg5 ? { backgroundColor: '#bbb' } : {}}
                    onClick={() => setcavg5(!cavg5)}
                  />{' '}
                  Avg 5
                </div>
                <div>
                  <div
                    className='bubble'
                    style={bavg5 ? { backgroundColor: '#bbb' } : {}}
                    onClick={() => setbavg5(!bavg5)}
                  />{' '}
                  Best Avg 5
                </div>
              </div>
            </div>
            <div className='bubble-group'>
              <div>
                <div
                  className='bubble'
                  style={cavg12 ? { backgroundColor: '#bbb' } : {}}
                  onClick={() => setcavg12(!cavg12)}
                />{' '}
                Avg 12
              </div>
              <div>
                <div
                  className='bubble'
                  style={bavg12 ? { backgroundColor: '#bbb' } : {}}
                  onClick={() => setbavg12(!bavg12)}
                />{' '}
                Best Avg 12
              </div>
            </div>
            <div className='bubble-group'>
              <div>
                <div
                  className='bubble'
                  style={best ? { backgroundColor: '#bbb' } : {}}
                  onClick={() => setbest(!best)}
                />{' '}
                Best Single
              </div>
              <div>
                <div
                  className='bubble'
                  style={worst ? { backgroundColor: '#bbb' } : {}}
                  onClick={() => setworst(!worst)}
                />{' '}
                Worst
              </div>
            </div>
          </div>
        </div>
        <div>
          {(status === 'stopped' ||
            status === 'started' ||
            status === 'waiting' ||
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
          <p>Scramble: {room && room.scramble}</p>
          {room && room.isHost === false && status === 'waiting' && (
            <p className='S'>Waiting for the next scramble...</p>
          )}
        </div>
        <div className='solves stats-table'>
          <p className='S inline'>Solves </p>
          <br />
          <Stats
            bmo3={bmo3}
            cmo3={cmo3}
            bavg5={bavg5}
            cavg5={cavg5}
            bavg12={bavg12}
            cavg12={cavg12}
            best={best}
            worst={worst}
          />
        </div>
      </div>
      <Chat />
    </Fragment>
  );
};

CompeteTimer.propTypes = {
  getSession: PropTypes.func.isRequired,
  newSession: PropTypes.func.isRequired,
  clearSession: PropTypes.func.isRequired,
  addSolve: PropTypes.func.isRequired,
  addPenalty: PropTypes.func.isRequired,
  updateStats: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  setHost: PropTypes.func.isRequired,
  setRoomEvent: PropTypes.func.isRequired,
  setRoomScramble: PropTypes.func.isRequired,
  setRoomDesc: PropTypes.func.isRequired,
  setStats: PropTypes.func.isRequired,
  getStats: PropTypes.func.isRequired,
  solve: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  solve: state.solve,
  profile: state.profile,
  room: state.room,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getSession,
  newSession,
  clearSession,
  addSolve,
  addPenalty,
  updateStats,
  getCurrentProfile,
  leaveRoom,
  createRoom,
  setHost,
  setRoomEvent,
  setRoomScramble,
  setRoomDesc,
  setStats,
  getStats,
})(CompeteTimer);
