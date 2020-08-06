import React from 'react';
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

const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/tutorials' component={Tutorials} />
        <Route exact path='/timer' component={Timer} />
        <PrivateRoute exact path='/profiles' component={Profiles} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
