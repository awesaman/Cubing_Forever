import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  RECEIVE_MESSAGE,
  GET_STATS,
  SET_STATS,
  SET_ROOM,
  SET_SCRAMBLE,
  SET_DESC,
  SET_EVENT,
  SET_HOST,
} from './types';
import v4 from 'uuid';
import store from '../store';

// Create a room
export const createRoom = (id, desc, locked) => dispatch => {
  if (id === '') id = v4();
  try {
    dispatch({
      type: CREATE_ROOM,
      payload: { id, desc, locked },
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
  let hostPresent = true;
  if (store.getState().room.isHost) hostPresent = false;
  try {
    dispatch({
      type: LEAVE_ROOM,
      payload: hostPresent,
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

// Gets solving statistics about other users in the room
export const getStats = (username, session) => dispatch => {
  try {
    dispatch({
      type: GET_STATS,
      payload: { ...store.getState().room.stats, [username]: session },
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Gets solving statistics about other users in the room
export const setStats = stats => dispatch => {
  try {
    dispatch({
      type: SET_STATS,
      payload: stats,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Set Room ID
export const setRoom = id => dispatch => {
  try {
    dispatch({
      type: SET_ROOM,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Set Room Event
export const setRoomEvent = event => dispatch => {
  try {
    dispatch({
      type: SET_EVENT,
      payload: event,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Set Room Scramble
export const setRoomScramble = scramble => dispatch => {
  try {
    dispatch({
      type: SET_SCRAMBLE,
      payload: scramble,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Set Room Desc
export const setRoomDesc = desc => dispatch => {
  try {
    dispatch({
      type: SET_DESC,
      payload: desc,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};

// Set Room Host
export const setHost = hostPresent => dispatch => {
  try {
    dispatch({
      type: SET_HOST,
      payload: hostPresent,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: err,
    });
  }
};
