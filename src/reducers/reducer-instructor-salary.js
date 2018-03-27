import { SHOW_ADD_INSTRUCTOR_SALARY_MODAL
        } from '../actions';

import _ from 'lodash';

export default function(state = {}, action) {
  var newState = null;
  switch (action.type) {
    case SHOW_ADD_INSTRUCTOR_SALARY_MODAL:
      console.log(action.payload);
      return {...state, isOpen: true};
    default:
      return state;
  }
}
