import { ROOM_ERROR, CREATE_ROOM, LEAVE_ROOM, RECEIVE_MESSAGE } from './types';
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

// Adds a message to state
export const receiveMessage = msg => dispatch => {
  try {
    dispatch({
      type: RECEIVE_MESSAGE,
      payload: [...store.getState().room.chats, msg],
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};
