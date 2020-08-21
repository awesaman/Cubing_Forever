import { ROOM_ERROR, CREATE_ROOM, LEAVE_ROOM } from './types';
import v4 from 'uuid';
import store from '../store';

// Create a room
export const createRoom = () => dispatch => {
  try {
    dispatch({
      type: CREATE_ROOM,
      payload: v4(),
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Leave a room
export const leaveRoom = () => dispatch => {
  try {
    dispatch({
      type: LEAVE_ROOM,
      payload: '',
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};
