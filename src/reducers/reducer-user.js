import { TOGGLE_ACCOUNT_DROPDOWN, FETCH_CURRENT_USER, FETCH_USER_CHECKIN_SUMMARY } from '../actions';

export default function (state = {isOpen : false, startDate: null, endDate: null}, action) {
  switch (action.type) {
    case TOGGLE_ACCOUNT_DROPDOWN:
      return {...state, isOpen: !state.isOpen};
    case FETCH_CURRENT_USER:
      if (action.payload.data) {
        const user = action.payload.data;
        return { ...state, displayName: user.displayName, username: user.username};
      } else {
        return {...state}
      }
    case FETCH_USER_CHECKIN_SUMMARY:
      return {...state, summary: action.payload.data.summary};
    default:
      return state;
  }
}
