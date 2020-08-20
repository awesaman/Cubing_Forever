import React, { Fragment } from 'react';

const Rooms = () => {
  return (
    <Fragment>
      <h1 className='L'>Compete</h1>
      <p className='S'>
        <i className='fas fa-users' /> Join a room to compete with other cubers!
      </p>

      {/* <div className='rooms'>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <ProfileItem key={room._id} room={room} />
              ))
            ) : (
              <h4>No rooms found...</h4>
            )}
          </div> */}
    </Fragment>
  );
};

export default Rooms;
