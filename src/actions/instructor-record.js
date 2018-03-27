import axios from 'axios';
import {ROOT_URL, API_URL} from './urls';

export const FETCH_INSTRUCTORS = "fetch instructors";
export const SEARCH_INSTRUCTORS = "search instructors";

export const SHOW_INSTRUCTOR_MODAL = "show instructor modal";
export const HIDE_INSTRUCTOR_MODAL = "hide instructor modal";

export const ADD_INSTRUCTOR_RECORD = "successfully add instructor-record";
export const REMOVE_INSTRUCTOR_RECORD = "remove instructor record";

export const SHOW_INSTRUCTOR_RECORD = "show instructor record";
export const HIDE_INSTRUCTOR_RECORD = "hide instructor record";



///////////////////////////////////////////////////////////////////////
const INSTRUCTOR_API = `${API_URL}/instructor`;

const INSTRUCTOR_SEARCH_API = `${INSTRUCTOR_API}?name=`;
const INSTRUCTOR_RECORD_API = `${INSTRUCTOR_API}/record`;
const INSTRUCTOR_REMOVE_API = `${INSTRUCTOR_API}/record/`;
////////////////////////////////////////////////////////////////////////

export function fetchInstructor() {
  return {
    type: FETCH_INSTRUCTORS,
    payload: axios.get(INSTRUCTOR_API)
  };
}

export function searchInstructor(keyword, finishSearchCallback) {
  const searchInterceptor = function(response, err) {
    return new Promise((resolve, reject) => {
      if (err) {
        reject();
      } else {
        finishSearchCallback();
        resolve(response);
      }
    });
  }

  return {
    type: SEARCH_INSTRUCTORS,
    payload: axios.get(`${INSTRUCTOR_SEARCH_API}${keyword}`).then(searchInterceptor)
  };
}

export function showAddInstructorModal(instructor) {
  return {
    type: SHOW_INSTRUCTOR_MODAL,
    payload: instructor
  };
}

export function hideAddIntructorModal() {
  return {
    type: HIDE_INSTRUCTOR_MODAL,
    payload: null
  };
}

export function showInstructorRecord(instructor)  {
  return {
    type: SHOW_INSTRUCTOR_RECORD,
    payload: instructor
  }
}

export function hideInstructorRecord(instructor) {
  return {
    type: HIDE_INSTRUCTOR_RECORD,
    payload: instructor
  };
}

export function addInstructorRecord(record, infoCallback, successCallback, errorCallback ) {
  infoCallback();
  const request = axios.post(INSTRUCTOR_RECORD_API, record)
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
    type: ADD_INSTRUCTOR_RECORD,
    payload: request.then(interceptor)
  };
}

export function removeInstructorRecord(record, deletedCallback) {
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
  var recordId = record._id;
  return {
    type: REMOVE_INSTRUCTOR_RECORD,
    payload: axios.delete(`${INSTRUCTOR_REMOVE_API}${recordId}`).then(removeInterceptor)
  };
}
