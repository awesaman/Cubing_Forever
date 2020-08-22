import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  SET_ROOM,
  GET_STATS,
  RECEIVE_MESSAGE,
} from '../actions/types';

const initialState = {
  roomID: '',
  isHost: false,
  stats: [],
  chats: [],
  scramble: '',
  event: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ROOM:
      return {
        ...state,
        roomID: payload,
        isHost: true,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        roomID: payload,
        chats: [],
        stats: [],
        isHost: false,
      };
    case SET_ROOM:
      return {
        ...state,
        roomID: payload,
      };
    case GET_STATS:
      return {
        ...state,
        stats: payload,
      };
    case RECEIVE_MESSAGE:
      return {
        ...state,
        chats: payload,
      };
    case ROOM_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}
