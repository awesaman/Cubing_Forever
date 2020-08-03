import { SHOW_ALERT, HIDE_ALERT } from './types';
import v4 from 'uuid';

export const showAlert = (msg, alertType, timeout = 5000) => dispatch => {
  const id = v4(); // each alert needs an ID
  dispatch({
    type: SHOW_ALERT,
    payload: { msg, alertType, id },
  });

  // show message for 5 seconds, then hide
  setTimeout(() => dispatch({ type: HIDE_ALERT, payload: id }), timeout);
};
