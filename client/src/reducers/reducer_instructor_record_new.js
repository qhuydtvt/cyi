import { SHOW_INSTRUCTOR_MODAL, HIDE_INSTRUCTOR_MODAL } from '../actions';

export default function(state = {isOpen: false, instructor: null}, action) {
  switch (action.type) {
    case SHOW_INSTRUCTOR_MODAL:
      return {
        isOpen: true,
        instructor: action.payload
      };
    case HIDE_INSTRUCTOR_MODAL:
      return {
        isOpen: false,
        instructor: null
      };
    default:
      return state;
  }
}
