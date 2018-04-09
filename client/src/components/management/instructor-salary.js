import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, FormGroup } from 'reactstrap';
import { Table } from 'reactstrap';

import _ from 'lodash';
import $ from 'jquery';

import User from '../helpers/user';
import InstructorSalaryNewModal from '../helpers/instructor-salary-new-modal';

import { fetchSummary, 
        updateSalary, 
        fetchInstructorPayroll, 
        showAddInstructorSalaryModal,
        fetchAllInstructor,
        manageCourse } from '../../actions';

class InstructorSalary extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  backToSummary(event) {
    this.props.summary.fetchInstructorSalary = false;
    this.props.fetchSummary(this.props.summary.startDate, this.props.summary.endDate, '')
    event.preventDefault();
  }

  backToInstructorPayroll(event) {
    this.props.summary.fetchInstructorSalary = false;
    this.props.fetchInstructorPayroll(
      this.props.summary.code,
      this.props.summary.startDate,
      this.props.summary.endDate
    );
    event.preventDefault();
  }

  onSubmit(values) {
    // set up notification
    const setAttribute = ($element, className, title) => {
      $element.attr("class", "");
      $element.toggleClass(className);
      $element.attr("title", title);
    }

    var $updateSalaryStatus = $("#update-salary-status");
    setAttribute($updateSalaryStatus, 'fa fa-lg fa-spinner fa-spin ml-4', 'Đang cập nhật lương...');

    const successCallback = () => {
      setAttribute($updateSalaryStatus,
                  'fa fa-lg fa-check ml-4 text-success',
                  "Đã cập nhật xong lương cho giảng viên"
                );
    };

    const errorCallback = () => {
      setAttribute($updateSalaryStatus,
                  'fa fa-lg fa-times-circle ml-4 text-danger',
                  "Cập nhật lỗi"
                );
    };

    // get data send to server
    var code = this.props.summary.code;
    var salaries = [];
    for (var key in values) {
      var course = key.split('||')[0].trim();
      var role = key.split('||')[1].trim();
      var salary = values[key] + '000';
      salaries.push({course, role, salary});
    }
    if (salaries.length === 0) {
      successCallback();
    } else {
      this.props.updateSalary(code, salaries, errorCallback, successCallback);
    }
  }

  renderCourseName(courseId) {
    let courseName = 'Unknown'
    let allCourses = this.props.summary.data.allCourses;
    _.forEach(allCourses, (course) => {
      if (course._id === courseId) {
        courseName = course.name;
      }
    });
    return courseName;
  }

  renderSalaryRow(salary, index) {
    var role = '';
    if (salary.role === 'instructor') {
      role = 'Giảng viên';
    } else if (salary.role === 'coach') {
      role = 'Trợ giảng';
    }
    return (
      <tr key={index}>
        <th scope="row"><div className="salary-content">{index + 1}</div></th>
        <td><div className="salary-content">{this.renderCourseName(salary.course)}</div></td>
        <td><div className="salary-content">{role}</div></td>
        <td className="text-right pr-5">
          <Field
            name={`${salary.course} || ${salary.role}`}
            salary={salary.salary / 1000}
            component = {this.renderInputField}
          />
        </td>
      </tr>
    )
  }

  renderInputField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "has-danger instructor-salary" : "instructor-salary";
    return (
      <FormGroup className={className}>
        <Input className="form-control" type="text" {...field.input} placeholder={field.salary}/>.000 VND
        <div className="form-text text-danger salary-noti">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderInstructorSalary(salaries) {
    const { handleSubmit } = this.props;

    return (
      <div>
        <Form className="update-instructor-salary-form" onSubmit={handleSubmit(this.onSubmit)}>
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Khóa học</th>
                <th>Vai trò</th>
                <th className="text-right pr-5">Mức lương</th>
              </tr>
            </thead>
            <tbody>
              {
                _.map(salaries, (salary, index) => {
                  return this.renderSalaryRow(salary, index)
                })
              }
            </tbody>
          </Table>

          <div className="my-5">
            <button className="btn btn-success float-right" type="submit">
               <i className="fa fa-floppy-o mr-3"></i>Lưu bảng lương
            </button>
            <span className="col"></span>
            <span className="btn btn-link float-right" onClick={event => this.props.showAddInstructorSalaryModal(this.props.summary.data)}>
              Thêm lương mới
            </span>
          </div>
        </Form>
        
      </div>
    )
  }

  render() {
    const summary = this.props.summary;
    const instructor = summary.data.instructor;
    const salaries = instructor ? instructor.salaries : [];

      return (
        <div className="container mt-3">
        <InstructorSalaryNewModal />

          <div className="row px-3">
            <button
              className="btn btn-secondary float-left btn__height--primary mt-1"
              onClick={event => this.props.fetchSummary(summary.startDate, summary.endDate, '')}
            >
              <i className="fa fa-file-text-o mr-3"></i>Lương tất cả giảng viên
            </button>
            <button className='btn btn-secondary mx-3 btn__height--primary mt-1' onClick={event => this.props.fetchAllInstructor()}>
              <i className='fa fa-users mr-3'></i>Quản lý giảng viên
            </button>
            <button className='btn btn-secondary btn__height--primary mt-1' onClick={event => this.props.manageCourse()}>
              <i className='fa fa-book mr-3'></i>Quản lý khóa học
            </button>
            <User />
          </div>

          <div className='d-flex my-3'>
            <button 
              className="btn btn-secondary float-left btn__height--primary"
              onClick={event => this.backToInstructorPayroll(event)}
            >
              <i className="fa fa-user mr-3"></i>Lương GV <i>{instructor.name}</i>
            </button>
          </div>
          <hr/>

          <div>
            <div className="my-5">
              <span className="font-weight-bold">Lương chi tiết giảng viên: &nbsp;</span>
              <span>{instructor.name}</span>
              <span id="update-salary-status"></span>
            </div>

            {this.renderInstructorSalary(salaries)}
          </div>
        </div>
      )
  }
}


function mapStateToProps({ summary }) {
  return { summary };
}

function validate(values) {
  const errors = {};
  for (var key in values) {
    if (/[^0-9]/.test(values[key])) {
      errors[key] = 'Chỉ nhập số';
    }
  }
  return errors;
}

const tempComponent = connect(mapStateToProps, { fetchSummary, 
                                                 updateSalary, 
                                                 fetchInstructorPayroll, 
                                                 showAddInstructorSalaryModal, 
                                                 fetchAllInstructor,
                                                 manageCourse })(InstructorSalary);

export default reduxForm({
  validate,
  form: "updateInstructorSalaryForm",
  destroyOnUnmount: false
})(tempComponent);
