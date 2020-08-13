import { GET_SOLVES, SOLVE_SUCCESS, SOLVE_FAIL } from '../actions/types';

const initialState = {
  solves: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SOLVES:
      return {
        ...state,
        solves: payload,
        loading: false,
      };
    case SOLVE_SUCCESS:
      return {
        ...state,
        solves: payload,
        loading: false,
      };
    case SOLVE_FAIL:
      return {
        ...state,
        ...payload,
        loading: false,
      };
    default:
      return state;
  }
}
