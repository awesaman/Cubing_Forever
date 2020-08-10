import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import eventNaming from '../../utils/eventNaming.json';

const ProfileItem = ({
  profile: {
    user: { _id, username, avatar },
    bio,
    location,
    wcaid,
    events,
  },
}) => {
  return (
    <div className='profile'>
      <img src={avatar} alt='' className='large-avatar' />
      <div>
        <h2>{username}</h2>
        {location && (
          <p>
            <i>from {location}</i>
          </p>
        )}
        {bio && <p>{bio}</p>}
      </div>
      <div className='all-events'>
        {events.map(event => (
          <img
            src={require(`../../img/events/${eventNaming[event.name]}.svg`)}
            alt={event.name}
            className='event-img'
          />
        ))}
      </div>
      <div className='buttons profile-buttons'>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
        <a
          href={`https://www.worldcubeassociation.org/persons/${wcaid}`}
          target='_blank'
          rel='noopener noreferrer'
          className='btn btn-light'
        >
          View WCA Profile
        </a>
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
