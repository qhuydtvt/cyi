import axios from 'axios';

export const SHOW_CONFIRM_DIALOG = "show confirm dialog";
export const HIDE_CONFIRM_DIALOG = "hide confirm dialog";

export const SHOW_LOGIN_LOADING = "show login loading";
export const HIDE_LOGIN_LOADING = "hide login loading";

export const SHOW_FEEDBACK_FORM = "Show feedback form";
export const HIDE_FEEDBACK_FORM = "Hide feedback form";

export const SHOW_SEARCH_LOADING = "show searching instructor loading";
export const HIDE_SEARCH_LOADING = "hide searching instructor loading"

export const LOAD_STATE = "load token";

export const TOGGLE_ACCOUNT_DROPDOWN = "Toggle acount dropdown";

export function toggleAccountDropdown() {
  return {
    type: TOGGLE_ACCOUNT_DROPDOWN,
    payload: null
  };
}

export function loadState(tokenExpiredCallback) {
  const tokenSaved = localStorage.getItem("x-access-token");
  const displayNameSaved = localStorage.getItem("displayName");
  const usernameSaved = localStorage.getItem("username");
  const roleSaved = localStorage.getItem("role");
  const instructorIdSaved = localStorage.getItem("instructorId");

  axios.defaults.headers.common["x-access-token"] = tokenSaved;
  axios.interceptors.response.use(
    (res) => {
      if (!res.data.success) {
        if (res.data.err && res.data.err.name === "TokenExpiredError") {
          tokenExpiredCallback();
        }
      }
      return res;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return {
    type: LOAD_STATE,
    payload: {displayNameSaved, usernameSaved, tokenSaved, roleSaved, instructorIdSaved}
  };
}

export function showLoginLoading() {
  return {
    type: SHOW_LOGIN_LOADING,
    payload: null
  };
}

export function hideLoginLoading() {
  return {
    type: HIDE_LOGIN_LOADING,
    payload: null
  };
}

export function showSearchLoading() {
  return {
    type: SHOW_SEARCH_LOADING,
    payload: null
  };
}

export function hideSearchLoading() {
  return {
    type: HIDE_SEARCH_LOADING,
    payload: null
  };
}

export function showConfirmDialog(title, body, onYesClick, onNoClick) {
  return {
    type: SHOW_CONFIRM_DIALOG,
    payload: {title, body, onYesClick, onNoClick}
  }
}

export function hideConfirmDialog() {
  return {
    type: HIDE_CONFIRM_DIALOG,
    payload: null
  }
}

export function showFeedbackForm() {
  return {
    type: SHOW_FEEDBACK_FORM
  }
}

export function hideFeedbackForm() {
  return {
    type: HIDE_FEEDBACK_FORM
  }
}
