import { SHOW_CONFIRM_DIALOG, HIDE_CONFIRM_DIALOG } from '../actions';

export default function (state = {isOpen: false}, action) {
  switch (action.type) {
    case SHOW_CONFIRM_DIALOG:
      return {
        isOpen: true,
        title: action.payload.title,
        body: action.payload.body,
        onYesClick: action.payload.onYesClick,
        onNoClick: action.payload.onNoClick
      };
    case HIDE_CONFIRM_DIALOG:
      return {
        isOpen: false
      };
    default:
      return state;
  }
}
