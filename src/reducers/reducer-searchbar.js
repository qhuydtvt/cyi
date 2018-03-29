import {
  SHOW_SEARCH_LOADING,
  HIDE_SEARCH_LOADING
} from '../actions';

export default function(state = {searching : false}, action) {
  switch (action.type) {
    case SHOW_SEARCH_LOADING:
      return {...state, searching: true};
    case HIDE_SEARCH_LOADING:
      return {...state, searching: false};
    default:
      return state;
  }
}
