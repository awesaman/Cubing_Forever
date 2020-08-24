import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  SET_ROOM,
  GET_STATS,
  RECEIVE_MESSAGE,
  SET_EVENT,
  SET_SCRAMBLE,
  SET_HOST,
  SET_STATS,
} from '../actions/types';

const initialState = {
  roomID: '',
  isHost: false,
  stats: [],
  chats: [],
  scramble: '',
  event: '',
  hostPresent: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ROOM:
      return {
        ...state,
        roomID: payload,
        isHost: true,
        hostPresent: true,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        roomID: '',
        chats: [],
        stats: [],
        isHost: false,
        hostPresent: payload,
      };
    case SET_HOST:
      return {
        ...state,
        hostPresent: payload,
      };
    case SET_ROOM:
      return {
        ...state,
        roomID: payload,
      };
    case SET_STATS:
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
    case SET_EVENT:
      return {
        ...state,
        event: payload,
      };
    case SET_SCRAMBLE:
      return {
        ...state,
        scramble: payload,
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
