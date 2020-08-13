import api from '../utils/api';

import { GET_SOLVES, SOLVE_SUCCESS, SOLVE_FAIL } from './types';

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
      type: SOLVE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
