import axios from 'axios';

export const FETCH_SUMMARY = "fetch summary";
export const FETCH_INSTRUCTOR_PAYROLL = "fetch instructor payroll";
export const SEND_INSTRUCTOR_PAYROLL = 'send instructor payroll';
export const FETCH_INSTRUCTOR_SALARY = 'fetch salary';
export const ADJUST_INSTRUCTOR_SALARY = 'adjust salary';

const MANAGEMENT_API = "https://chamcong-api.herokuapp.com/api/management/";

const FETCH_SUMMARY_API = `${MANAGEMENT_API}summary`
const FETCH_INSTRUCTOR_PAYROLL_API = `${MANAGEMENT_API}payroll`
const INSTRUCTOR_SALARY_API = `${MANAGEMENT_API}payroll/adjust`
const SEND_INSTRUCTOR_PAYROLL_API = `${MANAGEMENT_API}payroll/send`;

export function fetchSummary(startDate, endDate, name, finishSearchCallback) {
  const fetchSummaryInterceptor = function(response, err) {
    return new Promise((resolve, reject) => {
      if (err || !response.data) {
        reject();
      } else {
        resolve(response);
        if (finishSearchCallback) {
          finishSearchCallback();
        }
      }
    });
  }
  var API_SENT_TO_SERVER = `${FETCH_SUMMARY_API}?startDate=${startDate}&endDate=${endDate}&name=${name}`
  return {
    type: FETCH_SUMMARY,
    payload: axios.get(API_SENT_TO_SERVER).then(fetchSummaryInterceptor)
  }
}

export function fetchInstructorPayroll(code, startDate, endDate) {
  var REQUEST_SENT_TO_SERVER = `${FETCH_INSTRUCTOR_PAYROLL_API}?code=${code}&startDate=${startDate}&endDate=${endDate}`;
  return {
    type: FETCH_INSTRUCTOR_PAYROLL,
    payload: axios.get(REQUEST_SENT_TO_SERVER)
  }
}

export function sendPayroll(code, startDate, endDate, errorCallback, successCallback) {
  var REQUEST_SENT_TO_SERVER = `${SEND_INSTRUCTOR_PAYROLL_API}?code=${code}&startDate=${startDate}&endDate=${endDate}`
  var interceptor = (response, err) => {
    return new Promise((resolve, reject) => {
      if (!response.data || !response.data.success) {
        errorCallback();
        if(response.results) {
          reject({message: response.results.message});
        } else {
          reject();
        };
      } else {
        successCallback();
        resolve(response);
      };
    });
  }
  return {
    type: SEND_INSTRUCTOR_PAYROLL,
    payload: axios.get(REQUEST_SENT_TO_SERVER).then(interceptor)
  };
}

export function adjustSalary(code, salaries, errorCallback, successCallback) {
  var interceptor = (response, err) => {
    return new Promise((resolve, reject) => {
      if (!response.data || !response.data.success) {
        errorCallback();
        reject();
      } else {
        successCallback();
        resolve(response)
      }
    })
  }
  return {
    type: ADJUST_INSTRUCTOR_SALARY,
    payload: axios.post(`${INSTRUCTOR_SALARY_API}?code=${code}`, {salaries}).then(interceptor)
  }
}

export function fetchInstructorSalary(code) {
  return {
    type: FETCH_INSTRUCTOR_SALARY,
    payload: axios.get(`${INSTRUCTOR_SALARY_API}?code=${code}`)
  }
}
