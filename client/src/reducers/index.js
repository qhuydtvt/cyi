import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import InstructorReducer from './reducer_instructor_list';
import InstructorRecordNewReducer from './reducer_instructor_record_new';
import ConfirmDialogReducer from './reducer_confirm_dialog';
import LoginReducer from './reducer_credentials';
import UserReducer from './reducer_user';
import SearchBarReducer from './reducer_searchbar';
import SummaryReducer from './reducer_summary';

import { HIDE_INSTRUCTOR_MODAL } from '../actions';

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
    }
  }),
  instructorList: InstructorReducer,
  instructorRecordNew: InstructorRecordNewReducer,
  confirmDialog: ConfirmDialogReducer,
  loginCredentials: LoginReducer,
  user : UserReducer,
  searchBar: SearchBarReducer,
  summary: SummaryReducer
});

export default rootReducer;
