import { SOLVE_SUCCESS, SOLVE_FAIL } from '../actions/types';

const initialState = {
  solves: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SOLVE_SUCCESS:
      return {
        ...state,
        loading: false,
        solves: payload,
      };
    case SOLVE_FAIL:
      return {
        ...state,
        ...payload,
        loading: false,
      };
  }
}
