import axios from 'axios';

export const LOGIN = "login to checkin";
export const CHANGE_PASSWORD = "change users password";
export const LOG_OUT = "log out";
export const FETCH_CURRENT_USER = "FETCH_CURRENT_USER";
export const FETCH_USER_CHECKIN_SUMMARY = "fetch user checkin summary";

const ROOT_API = "https://chamcong-api.herokuapp.com/api/";

const LOGIN_API = `${ROOT_API}login`;
const CHANGE_PASSWORD_API = `${ROOT_API}change-password`;
const USER_API = `${ROOT_API}user`;
const FETCH_USER_CHECKIN_SUMMRY_API = `${ROOT_API}user/checkin-summary`

function saveLoggedInState(user, token) {
  axios.defaults.headers.common["x-access-token"] = token;
  localStorage.setItem("x-access-token", token);
  localStorage.setItem("displayName", user.displayName);
  localStorage.setItem("username", user.username);
  localStorage.setItem("role", user.role);
  localStorage.setItem("instructorId", user.instructor);
}

export function login({username, password}, successCallback, errorCallback) {
  var interceptor = function(response, err) {
    return new Promise((resolve, reject) => {
      if(!response.data || !response.data.success) {
          if(response.data) {
            reject({message: response.data.message});
          } else {
            reject();
          }
      } else {
        const token = response.data.token.token;
        const user = response.data.user;

        saveLoggedInState(user, token);
        successCallback();
        resolve(response);
      }
    });
  };

  const handleError = (err) => {
    if (err.message === "Network Error") {
      errorCallback("Lỗi kết nối");
    } else {
      errorCallback(err.message);
    }
  };

  return {
    type: LOGIN,
    payload: axios.post(LOGIN_API, {username, password}).then(interceptor).catch(handleError)
  }
}

export function logout() {
  axios.defaults.headers.common["x-access-token"] = null;
  localStorage.setItem("x-access-token", "");
  return {
    type: LOG_OUT,
    payload: null
  }
}

export function changePassword({currentPassword, newPassword}, successCallback, errorCallback) {
  var interceptor = function(response, err) {
    return new Promise((resolve, reject) => {
      if (!response.data || !response.data.success) {
        errorCallback();
        reject();
      } else {
        successCallback();
        resolve(response);
      }
    });
  }
  return {
    type: CHANGE_PASSWORD,
    payload: axios.post(CHANGE_PASSWORD_API, {currentPassword, newPassword}).then(interceptor)
  }
}

export function fetchCurrentUser() {
  return {
    type: FETCH_CURRENT_USER,
    payload: axios.get(USER_API)
  };
}

export function fetchUserCheckinSummary(instructorId, startDate, endDate,
  errorCallback, successCallback) {
     var interceptor = (response, err) => {
       return new Promise((resolve, reject) => {
         if (!response.data || !response.data.success) {
           if (errorCallback) {
             errorCallback();
           }
           reject();
         } else {
           if (successCallback) {
             successCallback();
           }
           resolve(response);
         }
       })
     }

     return {
       type: FETCH_USER_CHECKIN_SUMMARY,
       payload: axios.get(`${FETCH_USER_CHECKIN_SUMMRY_API}?instructorId=${instructorId}&startDate=${startDate}&endDate=${endDate}`).then(interceptor)
     }
}
