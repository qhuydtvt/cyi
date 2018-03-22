import axios from 'axios';
import {ROOT_URL, API_URL} from './urls';

export const FETCH_INSTRUCTOR = 'fetch all instructor';

export const SHOW_ADD_NEW_INSTRUCTOR_MODAL = 'show add new instructor modal';
export const HIDE_ADD_NEW_INSTRUCTOR_MODAL = 'hide add new instructor modal';

export const ADD_NEW_INSTRUCTOR = 'add new instructor';
export const UPDATE_INSTRUCTOR = 'update instructor';
export const REMOVE_INSTRUCTOR = 'remove instructor';

const INSTRUCTOR_API = `${API_URL}/instructor`;

const ADD_NEW_INSTRUCTOR_API = INSTRUCTOR_API;
const UPDATE_INSTRUCTOR_API = `${INSTRUCTOR_API}/update`;
const REMOVE_INSTRUCTOR_API = INSTRUCTOR_API;

export function fetchAllInstructor() {
  return {
    type: FETCH_INSTRUCTOR,
    payload: axios.get(`${INSTRUCTOR_API}/all`)
  }
}

export function showAddNewInstructorModal(instructor) {
  return {
    type: SHOW_ADD_NEW_INSTRUCTOR_MODAL,
    payload: instructor
  }
}

export function hideAddNewInstructorModal() {
  return {
    type: HIDE_ADD_NEW_INSTRUCTOR_MODAL,
    payload: null
  }
}

export function addNewInstructor(instructor, successCallback, errorCallback ) {
  const request = axios.post(ADD_NEW_INSTRUCTOR_API, instructor)
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
    type: ADD_NEW_INSTRUCTOR,
    payload: request.then(interceptor)
  };
}

export function updateInstructor(instructorId, instructor, successCallback, errorCallback ) {
  const request = axios.post(`${UPDATE_INSTRUCTOR_API}/${instructorId}`, instructor)
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
    type: UPDATE_INSTRUCTOR,
    payload: request.then(interceptor)
  };
}

export function removeInstructor(instructor, deletedCallback) {
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
  var instructorId = instructor._id;
  return {
    type: REMOVE_INSTRUCTOR,
    payload: axios.delete(`${REMOVE_INSTRUCTOR_API}/${instructorId}`).then(removeInterceptor)
  };
}
