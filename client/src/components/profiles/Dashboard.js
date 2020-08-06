import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Events from './Events';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <Fragment>
      <h1 className='L'>Dashboard</h1>
      <p className='M'>
        <i className='fas fa-user' /> Welcome {user && user.username}
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='info'>
            <div className='first'>
              <img
                src={user.avatar}
                alt='Please provide an avatar through Gravatar'
                className='avatar'
              />
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
                    className='underline'
                  >
                    {profile.wcaid}
                  </a>
                </p>
              )}
            </div>
          </div>

          <Events events={profile.events} />

          <div className='buttons'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle' /> Edit Profile
            </Link>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
