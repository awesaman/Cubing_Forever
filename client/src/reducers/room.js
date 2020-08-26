import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  SET_ROOM,
  GET_STATS,
  RECEIVE_MESSAGE,
  SET_EVENT,
  SET_SCRAMBLE,
  SET_DESC,
  SET_HOST,
  SET_STATS,
} from '../actions/types';

const initialState = {
  roomID: '',
  isHost: false,
  hostPresent: true,
  locked: false,
  stats: [],
  chats: [],
  desc: '',
  scramble: '',
  event: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ROOM:
      return {
        ...state,
        roomID: payload.id,
        desc: payload.desc,
        locked: payload.locked,
        isHost: true,
        hostPresent: true,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        roomID: '',
        chats: [],
        stats: [],
        event: '',
        scramble: '',
        isHost: false,
        hostPresent: payload,
      };
    case SET_HOST:
      return {
        ...state,
        isHost: payload,
        hostPresent: payload,
      };
    case SET_DESC:
      return {
        ...state,
        desc: payload,
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
