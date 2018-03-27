import { SHOW_FEEDBACK_FORM, HIDE_FEEDBACK_FORM } from '../actions/helpers';

export default function(state = {isOpen: false}, action) {
  switch (action.type) {
    case SHOW_FEEDBACK_FORM:
      return {
        isOpen: true
      };
    case HIDE_FEEDBACK_FORM:
      return {
        isOpen: false
      };
    default:
      return state;
  }
}
