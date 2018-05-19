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
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      team: {'value': null, 'label': instructor.code},
      email: instructor.email,
      image: instructor.image,
      courses: courseOptions
    }

  } else {
      values = {
        firstName: "",
        lastName: "",
        team: "",
        email: "",
        image: "",
        courses: []
      }
    }

  return {
    fields : {
      firstName: {touched: false, visited: false},
      lastName: {touched: false, visited: false},
      team: {touched: false, visited: false},
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
