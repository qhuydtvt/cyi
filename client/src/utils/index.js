import _ from 'lodash';

export function deEmpty(x, defaultValue="") {
  return x ? x : defaultValue;
}

export function stripHTML(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim() ;
}

export function elipsis(text, maxLength=100) {
  if(text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
}

export function tryGet(obj, key, defaultValue) {
  if(obj[key]) return obj[key];
  return defaultValue;
}


export function checkFields(obj, ...paths) {
  if (typeof(paths) === 'string') {
    return _.get(obj, paths) && true;
  }
  else {
    return paths.reduce((currentCheck, path) => {
      return _.get(obj, path) && currentCheck;
    }, true);
  }
}

// export function elipsis(text, n) {

// }