import {
  FETCH_INSTRUCTORS,
  SEARCH_INSTRUCTORS,
  SHOW_INSTRUCTOR_RECORD,
  HIDE_INSTRUCTOR_RECORD,
  ADD_INSTRUCTOR_RECORD,
  REMOVE_INSTRUCTOR_RECORD
} from '../actions';

import _ from 'lodash';

export default function (state = null, action) {
  var newState = null;
  switch (action.type) {
    case FETCH_INSTRUCTORS:
    case SEARCH_INSTRUCTORS:
      if (action.payload.data) {
        if (action.payload.data.results) {
          const instructorList = action.payload.data.results.map((instructor) => {
            const todayRecords = instructor.todayRecords;
            return {...instructor, todayRecords: _.mapKeys(todayRecords, "_id")};
          });
          const newState =  _.mapKeys(instructorList, "_id");
          return newState;
        }
      }
      return null;
    case SHOW_INSTRUCTOR_RECORD:
      const instructorToShow = action.payload;
      const showInstructorState = _.cloneDeep(state);
      showInstructorState[instructorToShow._id] = {...instructorToShow, recordOpen: true};
      return showInstructorState;
    case HIDE_INSTRUCTOR_RECORD:
      const instructorToHide = action.payload;
      const hideInstructorState = _.cloneDeep(state);
      hideInstructorState[instructorToHide._id] = {...instructorToHide, recordOpen: false};
      return hideInstructorState;
    case ADD_INSTRUCTOR_RECORD:
      newState = _.cloneDeep(state);
      if (action.payload) {
        if (action.payload.data) {
          if (newState) {
            const newRecord = action.payload.data.results;
            const newRecordId = newRecord._id;
            const instructorId = newRecord.instructor;
            newState[instructorId].todayRecords[newRecordId] = newRecord;
          }
        }
      }
      return newState;
    case REMOVE_INSTRUCTOR_RECORD:
      if (action.payload.data) {
        if (action.payload.data.foundRecord) {
          newState = _.cloneDeep(state);
          if (newState && !newState.fetchInstructorPayroll) {
            const recordToRemove = action.payload.data.foundRecord;
            const instructorId = recordToRemove.instructor;
            const instructorRecordId = recordToRemove._id;
            newState[instructorId].todayRecords = _.omit(newState[instructorId].todayRecords, instructorRecordId);
          }
          return newState;
        }
      }
      break;

    default:
      return state;
  }
  return state;
}
