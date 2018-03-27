import _ from 'lodash';
import { FETCH_INSTRUCTOR,
         SHOW_ADD_NEW_INSTRUCTOR_MODAL,
         HIDE_ADD_NEW_INSTRUCTOR_MODAL,
         FETCH_COURSE,
         ADD_NEW_INSTRUCTOR,
         UPDATE_INSTRUCTOR,
         REMOVE_INSTRUCTOR
          } from '../actions';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_INSTRUCTOR:
      return {...state, instructorData: action.payload.data.instructors};
    case SHOW_ADD_NEW_INSTRUCTOR_MODAL:
      return {...state, instructor: action.payload, isOpen: true};
    case HIDE_ADD_NEW_INSTRUCTOR_MODAL:
      return {...state, isOpen: false }
    case FETCH_COURSE:
      return {...state, allCourses: action.payload.data.courses}
    case ADD_NEW_INSTRUCTOR:
      var addInstructorState = _.cloneDeep(state);
      if (action.payload) {
        if (action.payload.data) {
          if (addInstructorState) {
            let allCourses = addInstructorState.allCourses;
            let newInstructor = action.payload.data.savedInstructor;

            // get all newInstructor courses info
            let newInstructorCourses = [];
            _.forEach(newInstructor.courses, (instructorCourseId) => {
              _.forEach(allCourses, (course) => {
                if (instructorCourseId === course._id) {
                  newInstructorCourses.push(course);
                };
              });
            });

            newInstructor.courses = newInstructorCourses;
            addInstructorState.instructorData.push(newInstructor);
          }
        }
      }
      return addInstructorState;
    case UPDATE_INSTRUCTOR:
      var updateInstructorState = _.cloneDeep(state);

      if (action.payload.data) {
        if (action.payload.data.success) {
          if (updateInstructorState) {
            let instructors = updateInstructorState.instructorData;
            var updatedInstructor = action.payload.data.instructor;
            let allCourses = updateInstructorState.allCourses;

            for (var i = 0; i < instructors.length; i++) {
              if (instructors[i]._id === updatedInstructor._id) {
                // get all newInstructor courses info
                let updatedInstructorCourses = [];
                _.forEach(updatedInstructor.courses, (courseId) => {
                  _.forEach(allCourses, (course) => {
                    if (courseId === course._id) {
                      updatedInstructorCourses.push(course);
                    };
                  });
                });
                updatedInstructor.courses = updatedInstructorCourses;
                //////////

                instructors[i] = updatedInstructor;
              }
            }
            updateInstructorState.instructorData = instructors;
          }
        }
      }
      return updateInstructorState;
    case REMOVE_INSTRUCTOR:
      var removeInstructorState = _.cloneDeep(state);

      if (action.payload.data) {
        if (action.payload.data.success) {
          if (removeInstructorState) {
            let instructors = removeInstructorState.instructorData;
            var removedInstructor = action.payload.data.instructorRemoved;
            _.remove(instructors, (instructor) => {
              return instructor._id === removedInstructor._id;
            });

            removeInstructorState.instructorData = instructors;
          }
        }
      }

      return removeInstructorState;
    default:
      return state;
  }
}
