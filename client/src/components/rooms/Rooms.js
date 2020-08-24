import React, { Fragment, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createRoom } from '../../actions/room';
import { socket } from '../../utils/socket';

const Rooms = ({ createRoom, room }) => {
  if (room.roomID !== '') return <Redirect to={`/compete/${room.roomID}`} />;
  else
    return (
      <Fragment>
        <h1 className='L'>Compete</h1>
        <p className='S'>
          <i className='fas fa-users' /> Join a room to compete with other
          cubers!
        </p>

        <button onClick={() => createRoom('')} className='btn btn-success'>
          Create New Room
        </button>

        {/* <div className='rooms'>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <ProfileItem key={room._id} room={room} />
              ))
            ) : (
              <h4>There are currently no rooms. Feel free to create one yourself! </h4>
            )}
          </div> */}
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
