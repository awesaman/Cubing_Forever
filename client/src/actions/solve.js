import api from '../utils/api';

import {
  GET_SOLVES,
  CLEAR_SOLVES,
  SOLVE_ERROR,
  ADD_SOLVE,
  ADD_SESSION,
  DELETE_SOLVE,
} from './types';

// Get last session
export const getSession = event => async dispatch => {
  try {
    let ev = event.split(' ').join('%20');
    const res = await api.get(`/profile/solve/${ev}`);

    dispatch({
      type: GET_SOLVES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOLVE_ERROR,
      payload: { error: err },
    });
  }
};

// Add a solve
export const addSolve = (event, sol) => async dispatch => {
  try {
    let ev = event.split(' ').join('%20');
    const res = await api.put(`/profile/solve/${ev}`, sol);

    dispatch({
      type: ADD_SOLVE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOLVE_ERROR,
      payload: { error: err },
    });
  }
};

// Create a new session
export const newSession = event => async dispatch => {
  try {
    let ev = event.split(' ').join('%20');
    const res = await api.put(`/profile/session/${ev}`);

    dispatch({
      type: ADD_SESSION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOLVE_ERROR,
      payload: { error: err },
    });
  }
};

// Clear current session
export const clearSession = event => async dispatch => {
  try {
    let ev = event.split(' ').join('%20');
    const res = await api.delete(`/profile/solve/${ev}`);

    dispatch({
      type: CLEAR_SOLVES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOLVE_ERROR,
      payload: { error: err },
    });
  }
};

// Delete a solve
export const deleteSolve = (event, id) => async dispatch => {
  try {
    let ev = event.split(' ').join('%20');
    const res = await api.delete(`/profile/solve/${ev}/${id}`);

    dispatch({
      type: DELETE_SOLVE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SOLVE_ERROR,
      payload: { error: err },
    });
  }
};
