import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../profiles/Dashboard';
import Timer from '../timer/Timer';
import Tutorials from '../tutorials/Tutorials';
import Profiles from '../profiles/Profiles';
import PrivateRoute from './PrivateRoute';
import ProfileForm from '../profiles/ProfileForm';
import DisplayProfile from '../profiles/DisplayProfile';
import CompeteTimer from '../timer/CompeteTimer';
import Rooms from '../rooms/Rooms';
import Sessions from '../profiles/Sessions';

const Routes = () => {
  return (
    <Fragment>
      <Alert />
      <section className='container'>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/tutorials' component={Tutorials} />
          <PrivateRoute exact path='/timer' component={Timer} />
          <PrivateRoute exact path='/compete' component={Rooms} />
          <PrivateRoute
            exact
            path='/compete/:roomid'
            component={CompeteTimer}
          />
          <PrivateRoute exact path='/profile/:id' component={DisplayProfile} />
          <PrivateRoute exact path='/profiles' component={Profiles} />
          <PrivateRoute exact path='/sessions' component={Sessions} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/create-profile' component={ProfileForm} />
          <PrivateRoute exact path='/edit-profile' component={ProfileForm} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </Fragment>
  );
};

export default Routes;
