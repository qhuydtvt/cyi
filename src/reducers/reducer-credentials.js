import _ from 'lodash';

import { LOGIN, LOAD_STATE, LOG_OUT, CHANGE_PASSWORD, SHOW_LOGIN_LOADING, HIDE_LOGIN_LOADING } from '../actions';

export default function(state = {loggedIn: false, loggingIn: false}, action) {
  switch (action.type) {
    case LOGIN:
      const newState = _.cloneDeep(state);
      if (action.payload && action.payload.data) {
        if (action.payload.data.success) {
          newState.loggingIn = false;
          if (action.payload.data.success === 1) {
            newState.loggedIn = true;
            newState.token = action.payload.data.token;
            newState.username = action.payload.data.user.username;
            newState.role = action.payload.data.user.role;
            newState.instructorId = action.payload.data.user.instructor;
          }
        }
      }
      return newState;
    case SHOW_LOGIN_LOADING:
      return {...state, loggingIn: true };
    case HIDE_LOGIN_LOADING:
      return {...state, loggingIn: false};
    case CHANGE_PASSWORD:
      return {...state};
    case LOAD_STATE:
      const tokenSaved = action.payload.tokenSaved;
      const displayNameSaved = action.payload.displayNameSaved;
      const usernameSaved = action.payload.usernameSaved;
      const roleSaved = action.payload.roleSaved;
      const instructorIdSaved = action.payload.instructorIdSaved;

      if (tokenSaved) {
        return {...state,
          token: tokenSaved,
          username: usernameSaved,
          displayName: displayNameSaved,
          role: roleSaved,
          instructorId: instructorIdSaved,
          loggedIn: true};
      } else {
        return {...state, token: null,  user: null, loggedIn: false};
      }
    case LOG_OUT:
      return {...state, token: null, user: null, loggedIn: false, loggingIn: false}
    default:
      return state;
  }
}
