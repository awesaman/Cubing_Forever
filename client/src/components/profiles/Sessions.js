import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSession } from '../../actions/solve';
import { getCurrentProfile } from '../../actions/profile';
import formatTime from '../../utils/formatTime';
const eventNaming = require('../../utils/eventNaming.json');

const Sessions = ({
  getCurrentProfile,
  getSession,
  profile: { profile },
  solve: { session, loading },
}) => {
  const [event, setEvent] = useState('3x3');
  const [displaySolve, setDisplaySolve] = useState(-1);

  const changeEvent = e => {
    setEvent(e.target.value);
    setDisplaySolve(-1);
  };

  //   useEffect(() => {
  //     getCurrentProfile();
  //   }, [getCurrentProfile]);

  useEffect(() => {
    if (!profile) return;
    let hasEvent = false;
    for (const ev of profile.events) {
      if (ev.name === event) hasEvent = true;
    }
    if (!hasEvent) setEvent(profile.events[0].name);
    // getSession(event);
  }, [profile]);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    getSession(event);
  }, [event, loading]);

  useEffect(() => {
    if (session.solves && session.solves.length > 0)
      setDisplaySolve(session.solves.length - 1);
    else setDisplaySolve(-1);
  }, [session.solves]);

  return (
    <Fragment>
      <h1 className='L'>Session Statistics</h1>
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
            profile.events &&
            profile.events.map(ev => (
              <option key={ev._id} value={ev.name}>
                {ev.name}
              </option>
            ))}
        </select>
      </div>
      <div className='session-stats'>
        <div>
          <h1 className='M'>Stats</h1>
          {session.solves && session.solves.length >= 1 && (
            <Fragment>
              <p>Number of Solves: {session.numsolves}</p>
              <p>Session Mean: {formatTime(session.mean)}</p>
              <p>Best Solve: {formatTime(session.best)}</p>
              <p>Worst Solve: {formatTime(session.worst)}</p>
            </Fragment>
          )}
          <br />
          {session.solves &&
            session.solves.length >= 3 && ( //&& showMo3
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
        </div>
        <div>
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
                    {session.solves.indexOf(sol) === session.bavg5loc + 4 &&
                      ')'}
                    {session.solves.indexOf(sol) === session.bavg12loc + 11 &&
                      ']'}
                    {session.solves.indexOf(sol) === session.bavg50loc + 49 &&
                      '}'}
                    {session.solves.indexOf(sol) === session.bavg100loc + 99 &&
                      '>'}
                    {session.solves.indexOf(sol) !==
                      session.solves.length - 1 && ', '}
                  </span>
                ))
              ) : (
                <p>There are currently no solves in this session. </p>
              )}
            </div>
            <div>
              {session.solves &&
                session.solves.length > 0 &&
                displaySolve >= 0 && (
                  <Fragment>
                    <p className='S'>Solve Info</p>
                    <div>
                      <p>
                        Time: {formatTime(session.solves[displaySolve].time)}
                      </p>
                      {session.solves[displaySolve].penalty && (
                        <p>Penalty: {session.solves[displaySolve].penalty}</p>
                      )}
                      <p>
                        Solve: {displaySolve + 1}/{session.numsolves}
                      </p>
                      <p>Scramble: {session.solves[displaySolve].scramble}</p>
                    </div>
                  </Fragment>
                )}
            </div>
          </div>
        </div>
      </div>

      <Link to='/dashboard' className='btn btn-light'>
        Back to Dashboard
      </Link>
    </Fragment>
  );
};

Sessions.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getSession: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  solve: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  solve: state.solve,
});

export default connect(mapStateToProps, { getCurrentProfile, getSession })(
  Sessions
);
