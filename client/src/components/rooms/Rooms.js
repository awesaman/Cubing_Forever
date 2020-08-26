import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createRoom } from '../../actions/room';
import { socket } from '../../utils/socket';
import RoomItem from './RoomItem';

const Rooms = ({ createRoom, room }) => {
  const [rooms, setRooms] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [desc, setDesc] = useState('');
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    socket.emit('request rooms');
    socket.on('send the rooms', send_rooms => {
      setRooms(send_rooms);
      console.log(send_rooms);
    });
  }, []);

  const onChange = e => {
    setDesc(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    createRoom('', desc, locked);
  };

  if (room.roomID !== '') return <Redirect to={`/compete/${room.roomID}`} />;
  else
    return (
      <Fragment>
        <h1 className='L'>Compete</h1>
        <p className='S'>
          <span className='smaller'>
            <i className='fas fa-users fa-xs' />
          </span>{' '}
          Join a room to compete with other cubers!
        </p>
        <p>
          <i className='fas fa-lock fa-xs' /> Locked Rooms can only be joined
          via link for security reasons
        </p>
        <button onClick={() => setToggle(!toggle)} className='btn btn-light'>
          {toggle ? 'Hide' : 'Add'} New Room
        </button>
        {toggle && (
          <form className='form' onSubmit={onSubmit}>
            <div className='message-box'>
              <input
                type='text'
                placeholder='Description'
                name='desc'
                value={desc}
                onChange={onChange}
                className='input-button'
              />
              <div onClick={() => setLocked(!locked)}>
                {locked ? (
                  <i className='fas fa-lock fa-2x smleft' />
                ) : (
                  <i className='fas fa-lock-open fa-2x smleft green' />
                )}
              </div>
              <input
                type='submit'
                value='Create New Room'
                className='btn btn-success create-button'
              />
            </div>
            <small>
              It is common to include the approximate speed of the solvers in
              the room for the solving events (e.g. sub-20 on 3x3)
            </small>
          </form>
        )}

        <div className='rooms'>
          {rooms.length > 0 ? (
            rooms.map(room => (
              <div>
                {console.log(room)}
                <RoomItem key={Object.keys(room)[0]} room={room} />
              </div>
            ))
          ) : (
            <p>
              There are currently no public rooms. Feel free to create one
              yourself!
            </p>
          )}
        </div>
      </Fragment>
    );
};

Rooms.propTypes = {
  createRoom: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    room: state.room,
  };
};

export default connect(mapStateToProps, { createRoom })(Rooms);
