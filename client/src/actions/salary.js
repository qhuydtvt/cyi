import axios from 'axios';

export const SHOW_ADD_INSTRUCTOR_SALARY_MODAL = "show add instructor-salary modal";

// const MANAGEMENT_API = "https://chamcong-api.herokuapp.com/api/management/";

// const FETCH_SUMMARY_API = `${MANAGEMENT_API}summary`;

export function showAddInstructorSalaryModal() {
  return {
    type: SHOW_ADD_INSTRUCTOR_SALARY_MODAL,
    payload: "showing st"
  }
}
