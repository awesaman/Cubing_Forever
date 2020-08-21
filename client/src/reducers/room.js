import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
  JOIN_ROOM,
  SET_ROOM,
  GET_STATS,
  RECEIVE_MESSAGE,
} from '../actions/types';

const initialState = {
  roomID: '',
  isHost: false,
  users: [],
  chats: [],
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
        users: [],
        isHost: false,
      };
    case SET_ROOM:
      return {
        ...state,
        roomID: payload,
      };
    case JOIN_ROOM:
      return {
        ...state,
        users: payload,
      };
    case GET_STATS:
      return {
        ...state,
        users: payload,
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
