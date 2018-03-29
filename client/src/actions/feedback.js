import axios from 'axios';
import { FEEDBACK_API_URL } from './urls';

export const SEND_FEEDBACK = "Send feedback";

export function sendFeedback(departmentIds, content, progressCallback, successCallback, errorCallback) {
    const body = {
        departmentIds,
        content
    };

    const request = axios.post(FEEDBACK_API_URL, body)
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
              console.log("success");
            successCallback();
            resolve(response); // Pass response to next promise
          }
        });
      };
    
    progressCallback();

    return {
        type: SEND_FEEDBACK,
        payload: request.then(interceptor)
    };
}