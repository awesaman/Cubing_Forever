import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../../img/logo.png';

const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link className='link-logo' to='/'>
        <img className='logo' src={logo} alt='Cubing Forever' />
      </Link>
      <ul>
        <li>
          <Link className='link' to='/timer'>
            Timer
          </Link>
        </li>
        <li>
          <Link className='link' to='/trainer'>
            Trainer
          </Link>
        </li>
        <li>
          <Link className='link' to='/tutorials'>
            Tutorials
          </Link>
        </li>
        <li>
          <Link className='link' to='/login'>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
