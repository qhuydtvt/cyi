import { MANAGEMENT_API_URL } from './urls';
import axios from 'axios';

export const SHOW_ADD_INSTRUCTOR_SALARY_MODAL = "show add instructor-salary modal";
export const HIDE_ADD_INSTRUCTOR_SALARY_MODAL = "hide add instructor-salary modal";

export const ADD_NEW_INSTRUCTOR_SALARY = 'add new instructor salary';

export function showAddInstructorSalaryModal(data) {
  return {
    type: SHOW_ADD_INSTRUCTOR_SALARY_MODAL,
    payload: {allCourses: data.allCourses, instructor: data.instructor}
  }
}

export function hideAddInstructorSalaryModal() {
  return {
    type: HIDE_ADD_INSTRUCTOR_SALARY_MODAL,
    payload: null
  }
}

export function addNewInstructorSalary(salary) {
  return {
    type: ADD_NEW_INSTRUCTOR_SALARY,
    payload: axios.post(`${MANAGEMENT_API_URL}/salary`, salary) 
  }
}