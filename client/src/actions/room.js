import { ROOM_ERROR, CREATE_ROOM } from './types';
import v4 from 'uuid';

// Get current users profile
export const createRoom = () => dispatch => {
  dispatch({
    type: CREATE_ROOM,
    payload: v4(),
  });
};
// // Get current users profile
// export const createRoom = () => dispatch => {
//   try {
//     dispatch({
//       type: CREATE_ROOM,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: ROOM_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status },
//     });
//   }
// };
