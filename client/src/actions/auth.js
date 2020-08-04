import api from '../utils/api';
import { showAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

// load user
export const loadUser = () => async dispatch => {
  try {
    if (localStorage.token)
      api.defaults.headers.common['x-auth-token'] = localStorage.token;
    const res = await api.get('/auth');

    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_FAIL,
    });
  }
};

// register user
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/user', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(showAlert(error.msg, 'danger')));
      console.log('reached');
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// login user
export const login = (email, password) => async dispatch => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // if it was a success, we must store the token
    localStorage.setItem('token', res.data.token);
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data);
    if (errors) {
      errors.forEach(error => dispatch(showAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// logout user
export const logout = () => ({ type: LOGOUT });
