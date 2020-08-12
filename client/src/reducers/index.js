import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import solve from './solve';

export default combineReducers({
  alert,
  auth,
  profile,
  solve,
});
