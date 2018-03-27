import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

import Main from './components/main';
import ChangePassword from './components/user/change-password';
import ConfirmDialog from './components/helpers/confirm-dialog';

import reducers from './reducers';

import './style/login.css';
import './style/style.css';
import './style/instructor-form.css';
import './style/instructor-management.css';
import './style/summary.css';
import './style/course.css';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div className="wrapper">
        <NotificationContainer/>
        <ConfirmDialog />
        <Switch>
          <Route path="/change-password" component={ChangePassword}/>
          <Route path="/" component={Main}/>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
