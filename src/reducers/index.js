import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import InstructorReducer from './reducer-instructor-list';
import InstructorRecordNewReducer from './reducer-instructor-record-new';
import CourseNewReducer from './reducer-course';
import InstructorManagementReducer from './reducer-instructor';
import InstructorSalaryReducer from './reducer-instructor-salary';
import ConfirmDialogReducer from './reducer-confirm-dialog';
import LoginReducer from './reducer-credentials';
import UserReducer from './reducer-user';
import SearchBarReducer from './reducer-searchbar';
import SummaryReducer from './reducer-summary';
import DepartmentReducer from './reducer-department';
import FeedbackModalReducer from './reducer-feedback-modal';

import { HIDE_INSTRUCTOR_MODAL,
         HIDE_ADD_NEW_COURSE_MODAL,
         SHOW_ADD_NEW_COURSE_MODAL,
         SHOW_ADD_NEW_INSTRUCTOR_MODAL,
         HIDE_ADD_NEW_INSTRUCTOR_MODAL,
         SHOW_ADD_INSTRUCTOR_SALARY_MODAL } from '../actions';

import { getInstructorNewModalDefaultState } from './helpers';

const rootReducer = combineReducers({
  form: formReducer.plugin(
    {
    loginForm: (state, action) => {return state},
    changePasswordForm: (state, action) => {return state},
    updateInstructorSalaryForm: (state, action) => {return state},
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
        case SHOW_ADD_NEW_COURSE_MODAL:
          if (action.payload) {
            var course = action.payload;
            return {...state,
              values: {
                courseName: course.name,
                description: course.description
              }
            }
          } else {
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
          }
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
    },
    addNewInstructorForm: (state, action) => {

      switch (action.type) {
        case SHOW_ADD_NEW_INSTRUCTOR_MODAL:
          if (action.payload) {
            var instructor = action.payload;
            return {...state,
              values: getInstructorNewModalDefaultState(instructor).values
            }
          } else {
            return {...state,
              anyTouched: false,
              fields : getInstructorNewModalDefaultState(undefined).fields,
              values: getInstructorNewModalDefaultState(undefined).values
            };
          }
        case HIDE_ADD_NEW_INSTRUCTOR_MODAL:
          return {...state,
            anyTouched: false,
            fields : getInstructorNewModalDefaultState(undefined).fields,
            values: getInstructorNewModalDefaultState(undefined).values
          };
       default: return state;
      }
    },
    addNewInstructorSalaryForm: (state, action) => {
      switch (action.type) {
        case SHOW_ADD_INSTRUCTOR_SALARY_MODAL:
          return {...state,
            anyTouched: false,
            fields :{
              course: {
                touched: false,
                visited: false
              },
              role: {
                touched: false,
                visited: false
              },
              salary: {
                touched: false,
                visited: false
              }
            },
            values: {
              course: "",
              role: "",
              salary: 0
            }
          };

        default: return state;
      }
    }
  }),
  instructorList: InstructorReducer,
  instructorRecordNew: InstructorRecordNewReducer,
  courseNew: CourseNewReducer,
  instructorManagement: InstructorManagementReducer,
  instructorSalary: InstructorSalaryReducer,
  confirmDialog: ConfirmDialogReducer,
  loginCredentials: LoginReducer,
  user : UserReducer,
  searchBar: SearchBarReducer,
  summary: SummaryReducer,
  department: DepartmentReducer,
  feedbackModal: FeedbackModalReducer
});

export default rootReducer;
