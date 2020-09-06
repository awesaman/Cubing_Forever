import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import logo from '../../img/logo.png';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const onLogout = () => {
    setOpen(false);
    logout();
  };

  const onClick = curr => {
    setOpen(false);
    setCurrent(curr);
  };

  const publicLinks = (
    <ul>
      <li>
        <Link
          className={current === 'tutorials' ? 'link white' : 'link'}
          to='/tutorials'
          onClick={() => onClick('tutorials')}
        >
          Tutorials
        </Link>
      </li>
      <li>
        <Link
          className={current === 'login' ? 'link white' : 'link'}
          to='/login'
          onClick={() => onClick('login')}
        >
          Login
        </Link>
      </li>
    </ul>
  );

  const privateLinks = (
    <ul>
      <li>
        <Link
          className={current === 'tutorials' ? 'link white' : 'link'}
          to='/tutorials'
          onClick={() => onClick('tutorials')}
        >
          Tutorials
        </Link>
      </li>
      <li>
        <Link
          className={current === 'timer' ? 'link white' : 'link'}
          to='/timer'
          onClick={() => onClick('timer')}
        >
          Timer
        </Link>
      </li>
      <li>
        <Link
          className={current === 'compete' ? 'link white' : 'link'}
          to='/compete'
          onClick={() => onClick('compete')}
        >
          Compete
        </Link>
      </li>
      <li>
        <Link
          className={current === 'profiles' ? 'link white' : 'link'}
          to='/profiles'
          onClick={() => onClick('profiles')}
        >
          Cubers
        </Link>
      </li>
      <li>
        <Link
          className={current === 'dashboard' ? 'link white' : 'link'}
          to='/dashboard'
          onClick={() => onClick('dashboard')}
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link className='link' to='/' onClick={onLogout}>
          Logout
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      <nav className='navbar'>
        <Link className='link-logo' to='/' onClick={() => onClick(null)}>
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
