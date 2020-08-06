import React, { Fragment } from 'react';
import eventNaming from '../../utils/eventNaming.json';

const Events = events => {
  return (
    <Fragment>
      {events.map(event => (
        <div>
          <img
            src={require(`../../img/${eventNaming[event.name]}.svg`)}
            alt={event.name}
            className='event-img'
          />
          <h3>{event.name}</h3>
        </div>
      ))}
    </Fragment>
  );
};

export default Events;
