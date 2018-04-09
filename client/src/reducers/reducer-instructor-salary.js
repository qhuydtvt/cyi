import { SHOW_ADD_INSTRUCTOR_SALARY_MODAL, HIDE_ADD_INSTRUCTOR_SALARY_MODAL
        } from '../actions';

export default function(state = {}, action) {
  switch (action.type) {
    case SHOW_ADD_INSTRUCTOR_SALARY_MODAL:
      return {...state, allCourses: action.payload.allCourses, instructor: action.payload.instructor, isOpen: true};
    case HIDE_ADD_INSTRUCTOR_SALARY_MODAL:
      return {...state, isOpen: false}
    default:
      return state;
  }
}
