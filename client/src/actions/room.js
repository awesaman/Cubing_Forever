import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  JOIN_ROOM,
  SET_ROOM,
  RECEIVE_MESSAGE,
  GET_STATS,
  SET_SCRAMBLE,
  SET_EVENT,
  SET_HOST,
} from './types';
import v4 from 'uuid';
import store from '../store';

// Create a room
export const createRoom = id => dispatch => {
  if (id === '') id = v4();
  try {
    dispatch({
      type: CREATE_ROOM,
      payload: id,
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
  // let session = store.getState().solve.session;
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

// Add users to your list of people
// export const joinedRoom = user => dispatch => {
//   const u = { [user]: {} };
//   console.log(u);
//   try {
//     dispatch({
//       type: JOIN_ROOM,
//       payload: [...store.getState().room.users, u],
//     });
//   } catch (err) {
//     dispatch({
//       type: ROOM_ERROR,
//       payload: err,
//     });
//   }
// };

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
