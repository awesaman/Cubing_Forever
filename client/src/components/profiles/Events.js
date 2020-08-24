import React, { Fragment } from 'react';
import eventNaming from '../../utils/eventNaming.json';
import PropTypes from 'prop-types';

const Events = ({ events }) => {
  return (
    <Fragment>
      {events.map(event => (
        <div key={event._id} className='event-display'>
          <div className='event-main'>
            <img
              src={require(`../../img/events/${eventNaming[event.name]}.svg`)}
              alt={event.name}
              className='event-img'
            />
            <p className='S'>{event.name}</p>
          </div>
          <div>
            {event.single && <p className='S'>Single - {event.single}</p>}
            {event.mo3 && <p className='S'>Mean 3 - {event.mo3}</p>}
            {event.avg5 && <p className='S'>Avg 5 - {event.avg5}</p>}
            {event.avg12 && <p className='S'>Avg 12 - {event.avg12}</p>}
          </div>
        </div>
      ))}
    </Fragment>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired,
};

export default Events;
