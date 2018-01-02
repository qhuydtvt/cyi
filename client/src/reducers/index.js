import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import InstructorReducer from './reducer_instructor_list';
import InstructorRecordNewReducer from './reducer_instructor_record_new';
import CourseNewReducer from './reducer_course';
import ConfirmDialogReducer from './reducer_confirm_dialog';
import LoginReducer from './reducer_credentials';
import UserReducer from './reducer_user';
import SearchBarReducer from './reducer_searchbar';
import SummaryReducer from './reducer_summary';

import { HIDE_INSTRUCTOR_MODAL, HIDE_ADD_NEW_COURSE_MODAL } from '../actions';

const rootReducer = combineReducers({
  form: formReducer.plugin(
    {
    loginForm: (state, action) => {return state},
    changePasswordForm: (state, action) => {return state},
    adjustInstructorSalaryForm: (state, action) => {return state},
    addInstructorRecordForm: (state, action) => {
      switch (action.type) {
        case HIDE_INSTRUCTOR_MODAL:
          return {...state,
            anyTouched: false,
            fields :{
              course: {
                touched: false,
                visited: false
              },
              className: {
                touched: false,
                visited: false
              },
              recordDate: {
                touched: false,
                visited: false
              },
              role: {
                touched: false,
                visited: false
              }
            },
            values: {
              course: {value: "", label: "Chọn khóa học..."},
              className: "",
              recordDate: new Date().toISOString(),
              role: {value: "instructor", label: "Giảng viên"}
            }
          };
        default: return state;
      }
    },
    addNewCourseForm: (state, action) => {
      switch (action.type) {
        case HIDE_ADD_NEW_COURSE_MODAL:
          return {...state,
            anyTouched: false,
            fields :{
              courseName: {
                touched: false,
                visited: false
              },
              description: {
                touched: false,
                visited: false
              }
            },
            values: {
              courseName: "",
              description: ""
            }
          };
        default: return state;
      }
    }
  }),
  instructorList: InstructorReducer,
  instructorRecordNew: InstructorRecordNewReducer,
  courseNew: CourseNewReducer,
  confirmDialog: ConfirmDialogReducer,
  loginCredentials: LoginReducer,
  user : UserReducer,
  searchBar: SearchBarReducer,
  summary: SummaryReducer
});

export default rootReducer;
