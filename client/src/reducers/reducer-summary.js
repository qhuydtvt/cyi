import { MANAGE_COURSE,
        FETCH_SUMMARY,
        FETCH_INSTRUCTOR_PAYROLL,
        FETCH_INSTRUCTOR_SALARY,
        UPDATE_INSTRUCTOR_SALARY,
        REMOVE_INSTRUCTOR_RECORD,
        SEND_INSTRUCTOR_PAYROLL,
        ADD_INSTRUCTOR_RECORD,
        FETCH_COURSE,
        ADD_NEW_COURSE,
        UPDATE_COURSE,
        REMOVE_COURSE,
        FETCH_INSTRUCTOR,
        ADD_NEW_INSTRUCTOR_SALARY
      } from '../actions';

import _ from 'lodash';

var defaultState = {
  startDate: null,
  endDate: null,
  name: '',
  fetchInstructorSalary: false,
  manageCourse: false,
  manageInstructor: false
}

export default function(state=defaultState, action) {
  var newState = null;
  switch (action.type) {
    case FETCH_SUMMARY:
      return {...state,
              fetchInstructorPayroll: false,
              fetchInstructorSalary: false,
              manageCourse: false,
              manageInstructor: false,
              data: action.payload.data
             }
    case FETCH_INSTRUCTOR_PAYROLL:
      return {...state,
              fetchInstructorPayroll: true,
              manageCourse: false,
              data: action.payload.data,
              code: action.payload.data.instructor.code }
    case SEND_INSTRUCTOR_PAYROLL:
      return {...state, results: action.payload}
    case FETCH_INSTRUCTOR_SALARY:
      return {...state, fetchInstructorSalary: true, data: action.payload.data}
    case UPDATE_INSTRUCTOR_SALARY:
      return {...state, results: action.payload.data}
    case ADD_INSTRUCTOR_RECORD:
      newState = _.cloneDeep(state);
      if (action.payload) {
        if (action.payload.data) {
          // check if reducer is summary
          if (newState.startDate && newState.endDate) {
            // add new-record to payroll-details table
            var newRecord = action.payload.data.results;
            var salary = action.payload.data.salary;

            newState.data.instructor.payrollDetails = _.concat(newState.data.instructor.payrollDetails,
                newRecord);

            // update payroll-details table
            var isContain = false; // to check if new record is in/not-in summary-payroll table
            newState.data.payroll.forEach((payrollSummary) => {
             if (payrollSummary.className === newRecord.className &&
              payrollSummary.role === newRecord.role) {
               // increase totalClass by 1
               payrollSummary.totalClass += 1;
               payrollSummary.totalSalary += payrollSummary.salary;
               isContain = !isContain;
               return;
               }
            });
            if (!isContain) {
              var newPayrollSummary = {
                className : newRecord.className,
                course : newRecord.course,
                role : newRecord.role,
                salary : salary,
                totalClass : 1,
                totalSalary : salary,
              };
              newState.data.payroll.push(newPayrollSummary);
            }
            // update total-month-salary
            newState.data.instructor.totalMonthSalary += salary;
            ///////////////////////////
          }
        }
      }
      return newState;
    case REMOVE_INSTRUCTOR_RECORD:
      if (action.payload.data) {
        if (action.payload.data.foundRecord) {
          newState = _.cloneDeep(state);
          // check if reducer is summary
          if (newState.startDate && newState.endDate) {
            const recordToRemove = action.payload.data.foundRecord;

            // update payroll-details table
            newState.data.payroll.forEach((payrollSummary) => {
              if (payrollSummary.className === recordToRemove.className &&
                payrollSummary.role === recordToRemove.role) {
                // decrease totalClass by 1
                if (payrollSummary.totalClass > 1) {
                  payrollSummary.totalClass -= 1;
                  payrollSummary.totalSalary -= payrollSummary.salary;
                } else {
                  // if totalClass == 1 => remove it from payroll
                  _.pull(newState.data.payroll, payrollSummary);
                }
                // update total-month-salary
                newState.data.instructor.totalMonthSalary -= payrollSummary.salary;
              }
            })
            // remove recordToRemove from payroll-details table
            _.remove(newState.data.instructor.payrollDetails, (record) => {
              return record._id === recordToRemove._id;
            });
          }
          return newState;
        }
      }
      break;
    case FETCH_COURSE:
      let manageCourse = state.manageInstructor || state.fetchInstructorPayroll ? false : true;
      
      return {...state, manageCourse: manageCourse, courseData: action.payload.data};
    case ADD_NEW_COURSE:
      newState = _.cloneDeep(state);
      if (action.payload) {
        if (action.payload.data) {
          if (newState) {
            const newCourse = action.payload.data.savedCourse;
            newState.courseData.courses.push(newCourse);
          }
        }
      }
      return newState;
    case UPDATE_COURSE:
      newState = _.cloneDeep(state);
      if (action.payload) {
        if (action.payload.data) {
          if (newState) {
            var courseUpdated = action.payload.data.courseUpdated;
            newState.courseData.courses.forEach((course, index) => {
              if (course._id === courseUpdated._id) {
                course.name = courseUpdated.name;
                course.description = courseUpdated.description;
              }
            });
          }
        }
      }
      return newState;
    case REMOVE_COURSE:
      if (action.payload.data) {
        if (action.payload.data.foundCourse) {
          newState = _.cloneDeep(state);
          if (newState) {
            const courseToRemove = action.payload.data.foundCourse;
            var newCourses = [];
            newState.courseData.courses.forEach((course, index) => {
              if (course._id !== courseToRemove._id) {
                newCourses.push(course);
              }
            });
            newState.courseData.courses = newCourses;
          }
          return newState;
        }
      }
      break;
    case FETCH_INSTRUCTOR:
      return {...state, 
              manageInstructor: true, 
              manageCourse: false,
              fetchInstructorPayroll: false,
              fetchInstructorSalary: false,
              instructorData: action.payload.data};
    case MANAGE_COURSE:
        return {...state,
          manageInstructor: false,
          fetchInstructorPayroll: false,
          fetchInstructorSalary: false,
          manageCourse: true,
          courseData: action.payload.data
        }
    case ADD_NEW_INSTRUCTOR_SALARY:
      newState = _.cloneDeep(state);
      var savedSalary = action.payload.data.savedSalary;
      
      var instructor = newState.data.instructor;
      instructor.salaries.push(savedSalary);
      newState.data.instructor = instructor;

      return newState;
    default:
      return state;
  }
}
