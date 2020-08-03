import { SHOW_ALERT, HIDE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SHOW_ALERT:
      return [...state, payload];
    case HIDE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
