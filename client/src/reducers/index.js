import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import solve from './solve';
import room from './room';

export default combineReducers({
  alert,
  auth,
  profile,
  solve,
  room,
});
