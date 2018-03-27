import { SHOW_ADD_NEW_COURSE_MODAL, HIDE_ADD_NEW_COURSE_MODAL } from '../actions';

export default function(state = {isOpen: false}, action) {
  switch (action.type) {
    case SHOW_ADD_NEW_COURSE_MODAL:
      return {...state, course: action.payload, isOpen: true};
    case HIDE_ADD_NEW_COURSE_MODAL:
      return {
        isOpen: false
      };
    default:
      return state;
  }
}
