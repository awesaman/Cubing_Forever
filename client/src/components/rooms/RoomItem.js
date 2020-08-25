import React from 'react';
import { Link } from 'react-router-dom';
import eventNaming from '../../utils/eventNaming.json';

const RoomItem = ({ room }) => {
  let info = room[Object.keys(room)[0]];
  return (
    <div className='room'>
      <div className='room-info'>
        <img
          src={require(`../../img/events/${eventNaming[info.event]}.svg`)}
          alt={info.event}
          className='event-img'
        />
        <div className='smleft'>
          <p className='M'>
            {info.event}, <span className='smaller'> {info.speedrange}</span>
          </p>
          <p className='S'>Host: {info.hostname}</p>
          <p className='S'># of Cubers: {info.numusers}</p>
        </div>
      </div>
      <div>
        <Link
          to={`/compete/${Object.keys(room)[0]}`}
          className='btn btn-primary'
        >
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default RoomItem;
