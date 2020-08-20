import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import logo from '../../img/logo.png';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(!open);
    logout();
  };

  const publicLinks = (
    <ul>
      <li>
        <Link className='link' to='/tutorials' onClick={() => setOpen(!open)}>
          Tutorials
        </Link>
      </li>
      <li>
        <Link className='link' to='/login' onClick={() => setOpen(!open)}>
          Login
        </Link>
      </li>
    </ul>
  );

  const privateLinks = (
    <ul>
      <li>
        <Link className='link' to='/tutorials' onClick={() => setOpen(!open)}>
          Tutorials
        </Link>
      </li>
      <li>
        <Link className='link' to='/timer' onClick={() => setOpen(!open)}>
          Timer
        </Link>
      </li>
      <li>
        <Link className='link' to='/compete' onClick={() => setOpen(!open)}>
          Compete
        </Link>
      </li>
      <li>
        <Link className='link' to='/profiles' onClick={() => setOpen(!open)}>
          Cubers
        </Link>
      </li>
      <li>
        <Link className='link' to='/dashboard' onClick={() => setOpen(!open)}>
          Dashboard
        </Link>
      </li>
      <li>
        <Link className='link' to='/' onClick={onClick}>
          Logout
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      <nav className='navbar'>
        <Link className='link-logo' to='/'>
          <img className='logo' src={logo} alt='Cubing Forever' />
        </Link>
        <div className='desktop'>
          {!loading && (
            <Fragment>{isAuthenticated ? privateLinks : publicLinks}</Fragment>
          )}
        </div>
        <div className='mobile'>
          <a
            href='#'
            className='L hamburger'
            onClick={e => {
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <i className={open ? 'fas fa-times' : 'fas fa-bars'} />
          </a>
        </div>
      </nav>

      {!loading && open && (
        <div className='reveal'>
          {isAuthenticated ? privateLinks : publicLinks}
        </div>
      )}
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
