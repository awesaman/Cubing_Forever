import {
  ROOM_ERROR,
  CREATE_ROOM,
  LEAVE_ROOM,
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
        isHost: false,
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
