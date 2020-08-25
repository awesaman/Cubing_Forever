import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createRoom } from '../../actions/room';
import { socket } from '../../utils/socket';
import RoomItem from './RoomItem';

const Rooms = ({ createRoom, room }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit('request rooms');
    socket.on('send the rooms', send_rooms => {
      setRooms(send_rooms);
      console.log(send_rooms);
    });
  }, []);

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
        <p>Private Rooms can only be joined via link</p>

        <button onClick={() => createRoom('')} className='btn btn-success'>
          Create New Room
        </button>

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
              There are currently no rooms. Feel free to create one yourself!
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
