import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import eventNaming from '../../utils/eventNaming.json';

const initialState = {
  bio: '',
  location: '',
  wcaid: '',
  events: [],
  twitter: '',
  facebook: '',
  youtube: '',
  instagram: '',
  name: '',
  single: '',
  avg5: '',
  avg12: '',
};

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState(initialState);

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const {
    bio,
    location,
    wcaid,
    events,
    twitter,
    facebook,
    youtube,
    instagram,
    name,
    single,
    avg5,
    avg12,
  } = formData;

  const close = () => {
    setEditEvent(null);
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
    close();
  };

  const openNew = () => {
    setEditEvent('new');
    setFormData({
      ...formData,
      name: '',
      single: '',
      avg5: '',
      avg12: '',
    });
  };

  const addEvent = () => {
    console.log('reach');
    if (name === null) return;
    const ev = {
      name: name,
      single: single,
      avg5: avg5,
      avg12: avg12,
    };
    events.push(ev);
    setEditEvent(null);
  };

  const modifyEvent = (n, create = false) => {
    setEditEvent(n);
    for (let i in events) {
      if (events[i].name === n) {
        if (create)
          setFormData({
            ...formData,
            name: events[i].name,
            single: events[i].single,
            avg5: events[i].avg5,
            avg12: events[i].avg12,
          });
        else {
          let newEvents = events;
          newEvents[i].name = name;
          newEvents[i].single = single;
          newEvents[i].avg5 = avg5;
          newEvents[i].avg12 = avg12;
          setFormData({
            ...formData,
            events: newEvents,
          });
          close();
        }
        break;
      }
    }
  };

  const removeEvent = n => {
    setFormData({
      ...formData,
      events: events.filter(ev => ev.name !== n),
    });
  };

  const eventForm = (
    <Fragment>
      <div className='form-group'>
        {editEvent === 'new' && (
          <select name='name' value={name} onChange={onChange}>
            <option>* Select Event</option>
            <option value='3x3'>3x3</option>
            <option value='2x2'>2x2</option>
            <option value='4x4'>4x4</option>
            <option value='5x5'>5x5</option>
            <option value='6x6'>6x6</option>
            <option value='7x7'>7x7</option>
            <option value='3x3 One-Handed'>3x3 One-Handed</option>
            <option value='3x3 Blindfolded'>3x3 Blindfolded</option>
            <option value='3x3 Multi-Blind'>3x3 Multi-Blind</option>
            <option value='3x3 Fewest Moves'>3x3 Fewest Moves</option>
            <option value='4x4 Blindfolded'>4x4 Blindfolded</option>
            <option value='5x5 Blindfolded'>5x5 Blindfolded</option>
            <option value='Pyraminx'>Pyraminx</option>
            <option value='Megaminx'>Megaminx</option>
            <option value='Square-1'>Square-1</option>
            <option value='Skewb'>Skewb</option>
            <option value="Rubik's Clock">Rubik's Clock</option>
          </select>
        )}
      </div>
      <div className='form-group'>
        <input
          type='text'
          placeholder='Best Single'
          name='single'
          value={single}
          onChange={onChange}
        />
      </div>
      <div className='form-group'>
        <input
          type='text'
          placeholder='Best Average of 5'
          name='avg5'
          value={avg5}
          onChange={onChange}
        />
      </div>
      <div className='form-group'>
        <input
          type='text'
          placeholder='Best Average of 12'
          name='avg12'
          value={avg12}
          onChange={onChange}
        />
      </div>

      {editEvent !== 'new' && (
        <div className='buttons'>
          <button
            onClick={() => modifyEvent(name)}
            type='button'
            className='btn btn-success'
          >
            Done
          </button>
          <button
            onClick={() => removeEvent(name)}
            type='button'
            className='btn btn-danger'
          >
            Remove Event
          </button>
          <button onClick={close} type='button' className='btn btn-light'>
            Close
          </button>
        </div>
      )}
    </Fragment>
  );

  return (
    <Fragment>
      <h1 className='L text-primary'>Edit Your Profile</h1>
      <p className='M'>
        <i className='fas fa-user' /> Add some changes to your profile
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={onChange}
          />
          <small className='form-text'>
            Feel free to include any general information about yourself. Keep it
            short!
          </small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={onChange}
          />
          <small className='form-text'>
            Only provide your location if you feel comfortable with it and want
            to find cubers near you.
          </small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='WCA ID'
            name='wcaid'
            value={wcaid}
            onChange={onChange}
          />
          <small className='form-text'>
            Type your WCA ID, and a link to your WCA Profile will be showcased
            on your profile.
          </small>
        </div>

        <p className='M'>Events</p>
        {formData.events &&
          formData.events.map(event => (
            <Fragment>
              <div className='event-display'>
                <div className='event-main'>
                  <img
                    src={require(`../../img/events/${
                      eventNaming[event.name]
                    }.svg`)}
                    alt={event.name}
                    className='event-img'
                  />
                  <p className='S'>{event.name}</p>
                </div>
                <div>
                  {event.single && <p className='S'>Single - {event.single}</p>}
                  {event.avg5 && <p className='S'>Avg 5 - {event.avg5}</p>}
                  {event.avg12 && <p className='S'>Avg 12 - {event.avg12}</p>}
                </div>

                <div className='buttons edit'>
                  <button
                    onClick={() => modifyEvent(event.name, true)}
                    type='button'
                    className='btn btn-light'
                  >
                    Edit Event
                  </button>
                </div>
              </div>
              {editEvent === event.name && eventForm}
            </Fragment>
          ))}
        {editEvent === 'new' && eventForm}
        {editEvent === 'new' ? (
          <div className='buttons'>
            <button
              onClick={addEvent}
              type='button'
              className='btn btn-success'
            >
              Event Info Complete
            </button>
            <button onClick={close} type='button' className='btn btn-light'>
              Close
            </button>
          </div>
        ) : (
          <div className='buttons'>
            <button onClick={openNew} type='button' className='btn btn-primary'>
              Add Event
            </button>
            <span> *Events are required</span>
          </div>
        )}

        <div className='buttons'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Add Social Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x' />
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={onChange}
              />
            </div>
          </Fragment>
        )}
        <div className='buttons'>
          <input type='submit' className='btn btn-success' value='Save' />
          <Link className='btn btn-light' to='/dashboard'>
            Go Back
          </Link>
        </div>
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
