import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../layout/Loading';
import { getProfileById } from '../../actions/profile';
import Events from './Events';

const DisplayProfile = ({
  getProfileById,
  profile: { profile },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {profile === null ? (
        <Loading />
      ) : (
        <Fragment>
          <div className='buttons'>
            <Link to='/profiles' className='btn btn-light'>
              Back To Profiles
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === profile.user._id && (
                <Link to='/edit-profile' className='btn btn-primary'>
                  Edit Your Profile
                </Link>
              )}
          </div>
          <p className='M mtop'>
            <i className='fas fa-user' />{' '}
            {profile.user && profile.user.username}
          </p>
          <div className='info'>
            <div className='first'>
              {profile.user && (
                <img
                  src={profile.user.avatar}
                  alt='Please provide an avatar through Gravatar'
                  className='avatar'
                />
              )}
            </div>
            <div className='second'>
              {profile.bio && (
                <p className='S'>
                  <strong>Bio: </strong>
                  {profile.bio}
                </p>
              )}
              {profile.location && (
                <p className='S'>
                  <strong>Location: </strong>
                  {profile.location}
                </p>
              )}
              {profile.wcaid && (
                <p className='S'>
                  <strong>WCA Profile:</strong>{' '}
                  <a
                    href={`https://www.worldcubeassociation.org/persons/${profile.wcaid}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline'
                  >
                    {profile.wcaid}
                  </a>
                </p>
              )}
            </div>
          </div>

          {profile.events && <Events events={profile.events} />}
        </Fragment>
      )}
    </Fragment>
  );
};

DisplayProfile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(DisplayProfile);
