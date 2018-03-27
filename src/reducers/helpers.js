var _ = require('lodash');

var getInstructorNewModalDefaultState = (instructor) => {
  let values = {};
  if (instructor) {
    let courseOptions = [];
    _.forEach(instructor.courses, (course) => {
      courseOptions.push({
        'value': course,
        'label': course.name,
      });
    });

    values = {
      name: instructor.name,
      code: instructor.code,
      email: instructor.email,
      image: instructor.image,
      courses: courseOptions
    }

  } else {
      values = {
        name: "",
        code: "",
        email: "",
        image: "",
        courses: []
      }
    }

  return {
    fields : {
      name: {touched: false, visited: false},
      code: {touched: false, visited: false},
      email: {touched: false, visited: false},
      image: {touched: false, visited: false},
      courses: {touched: false, visited: false}
    },
    values: values
  }
}

module.exports =  {
  getInstructorNewModalDefaultState
}
