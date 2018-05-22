import axios from 'axios';
import { COURSE_API_URL } from '../constants';
import { checkFields } from '../utils';

export function fetchCourse(courseId) {
  const request = axios.get(`${COURSE_API_URL}/${courseId}`);
  const interceptor = (response) => {
    return new Promise((resolve, reject) => {
      if (checkFields(response, 'data.course')) {
        resolve(response.data.course);
      }
      else {
        reject();
      }
    });
  }
  return request.then(interceptor);
}