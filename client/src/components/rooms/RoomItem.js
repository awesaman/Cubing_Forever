import React from 'react';
import { Link } from 'react-router-dom';
const eventNaming = require('../../utils/eventNaming.json');

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
          <p className='S'>
            Current Event: {info.event}
            {info.desc && <p className='smaller'>{info.desc}</p>}
          </p>
          <p className='S'>Host: {info.hostname}</p>
          <p className='S'>Number of Cubers: {info.numusers}</p>
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
