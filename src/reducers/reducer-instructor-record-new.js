import { SHOW_INSTRUCTOR_MODAL, HIDE_INSTRUCTOR_MODAL, FETCH_COURSE } from '../actions';

export default function(state = {isOpen: false, instructor: null, allCourses: []}, action) {
  switch (action.type) {
    case SHOW_INSTRUCTOR_MODAL:
      return {...state,
        isOpen: true,
        instructor: action.payload
      };
    case HIDE_INSTRUCTOR_MODAL:
      return {...state,
        isOpen: false,
        instructor: null
      };
    case FETCH_COURSE:
      return {...state, allCourses: action.payload.data.courses};
    default:
      return state;
  }
}
