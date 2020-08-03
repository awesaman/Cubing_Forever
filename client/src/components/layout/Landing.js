import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='landing-inner'>
        <h1 className='XL'>CUBING FOREVER</h1>
        <p className='L'>
          Create an account to find friends and battle against them!
        </p>
        <div className='buttons'>
          <Link to='/register' className='btn btn-primary'>
            Sign Up
          </Link>
          <Link to='/login' className='btn btn-light'>
            Login
          </Link>
        </div>
        <br />
        <div className='extras'>
          <div>
            <Link to='/tutorials'>
              <i className='fas fa-chalkboard-teacher' />
              <p className='L text-light'>LEARN</p>
            </Link>
          </div>
          <div>
            <Link to='/timer'>
              <i className='fas fa-stopwatch' />
              <p className='L text-light'>PRACTICE</p>
            </Link>
          </div>
          <div>
            <Link to='/compete'>
              <i className='fas fa-users' />
              <p className='L text-light'>COMPETE</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
