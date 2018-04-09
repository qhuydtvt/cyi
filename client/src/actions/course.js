import axios from 'axios';
import { API_URL } from './urls';

export const FETCH_COURSE = 'fetch all course';

export const SHOW_ADD_NEW_COURSE_MODAL = 'show add new course modal';
export const HIDE_ADD_NEW_COURSE_MODAL = 'hide add new course modal';

export const ADD_NEW_COURSE = 'add new course';
export const UPDATE_COURSE = 'update course';
export const REMOVE_COURSE = 'remove course';

const COURSE_API = `${API_URL}/course`;

const ADD_NEW_COURSE_API = `${COURSE_API}/create`;
const UPDATE_COURSE_API = `${COURSE_API}/update`;
const REMOVE_COURSE_API = `${COURSE_API}/delete`;

export function fetchCourse() {
  return {
    type: FETCH_COURSE,
    payload: axios.get(COURSE_API)
  }
}

export function showAddNewCourseModal(course) {
  return {
    type: SHOW_ADD_NEW_COURSE_MODAL,
    payload: course
  }
}

export function hideAddNewCourseModal() {
  return {
    type: HIDE_ADD_NEW_COURSE_MODAL,
    payload: null
  }
}

export function addNewCourse(course, successCallback, errorCallback ) {
  const request = axios.post(ADD_NEW_COURSE_API, course)
    .catch((err) => {
      errorCallback();
    });

  const interceptor = function(response, error) {
    return new Promise((resolve, reject) => {
      if (!response.data || !response.data.success) {
        errorCallback();
        reject();
      }
      else {
        successCallback();
        resolve(response); // Pass response to next promise
      }
    });
  };

  return {
    type: ADD_NEW_COURSE,
    payload: request.then(interceptor)
  };
}

export function updateCourse(course, successCallback, errorCallback ) {
  const request = axios.post(UPDATE_COURSE_API, course)
    .catch((err) => {
      errorCallback();
    });

  const interceptor = function(response, error) {
    return new Promise((resolve, reject) => {
      if (!response.data || !response.data.success) {
        errorCallback();
        reject();
      }
      else {
        successCallback();
        resolve(response); // Pass response to next promise
      }
    });
  };

  return {
    type: UPDATE_COURSE,
    payload: request.then(interceptor)
  };
}

export function removeCourse(course, deletedCallback) {
  const removeInterceptor = function(response, err) {
    return new Promise((resolve, reject) => {
      if (err || !response.data) {
        reject();
      } else {
        deletedCallback();
        resolve(response)
      }
    });
  };
  var courseId = course._id;
  return {
    type: REMOVE_COURSE,
    payload: axios.delete(`${REMOVE_COURSE_API}/${courseId}`).then(removeInterceptor)
  };
}
