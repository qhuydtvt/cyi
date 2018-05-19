import axios from 'axios';
import { CLASS_API_URL } from '../constants';
import { checkFields }  from'../utils';

export function addOrEditClassInfo(classInfo) {
  const request = axios.post(CLASS_API_URL, classInfo);
  const interceptor = (response) => {
    return new Promise((resolve, reject) => {
      if(checkFields(response, 'data.success', 'data.classInfo')) {
        resolve(response.data.classInfo);
      }
      else {
        reject();
      }
    });
  };
  return request.then(interceptor);
}