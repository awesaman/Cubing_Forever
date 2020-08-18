import {
  GET_SOLVES,
  CLEAR_SOLVES,
  SOLVE_ERROR,
  ADD_SOLVE,
  DELETE_SOLVE,
} from '../actions/types';

const initialState = {
  session: {},
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SOLVES:
    case ADD_SOLVE:
      return {
        ...state,
        session: payload,
        loading: false,
      };
    case DELETE_SOLVE:
    case CLEAR_SOLVES:
      return {
        ...state,
        session: payload,
        loading: true,
      };
    case SOLVE_ERROR:
      return {
        ...state,
        ...payload,
        loading: false,
      };
    default:
      return state;
  }
}
