import {
  GET_SOLVES,
  CLEAR_SOLVES,
  SOLVE_ERROR,
  ADD_SOLVE,
  DELETE_SOLVE,
} from '../actions/types';

const initialState = {
  solves: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SOLVES:
    case ADD_SOLVE:
      return {
        ...state,
        solves: payload,
        loading: false,
      };
    case DELETE_SOLVE:
    case CLEAR_SOLVES:
      return {
        ...state,
        solves: payload,
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
