import { SHOW_FEEDBACK_FORM, HIDE_FEEDBACK_FORM, ENABLE_FEEDBACK_SUBMIT, DISABLE_FEEDBACK_SUBMIT } from '../actions/helpers';

export default function(state = {isOpen: false, submitEnabled: true}, action) {
  switch (action.type) {
    case SHOW_FEEDBACK_FORM:
      return {
        ...state,
        isOpen: true
      };
    case HIDE_FEEDBACK_FORM:
      return {
        ...state,
        isOpen: false
      };
    case ENABLE_FEEDBACK_SUBMIT:
      return {
        ...state,
        submitEnabled: true
      };
    case DISABLE_FEEDBACK_SUBMIT:
      return {
        ...state,
        submitEnabled: false
      };
    default:
      return state;
  }
}
