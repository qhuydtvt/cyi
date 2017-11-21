import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, FormGroup } from 'reactstrap';
import { Table } from 'reactstrap';

import _ from 'lodash';
import $ from 'jquery';

import User from '../user';

import { fetchSummary, adjustSalary, fetchInstructorPayroll } from '../../actions';

class AdjustSalary extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  backToSummary(event) {
    this.props.summary.adjustSalary = false;
    this.props.fetchSummary(this.props.summary.startDate, this.props.summary.endDate, '')
    event.preventDefault();
  }

  backToInstructorPayroll(event) {
    this.props.summary.adjustSalary = false;
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

    var $adjustSalaryStatus = $("#adjust-salary-status");
    setAttribute($adjustSalaryStatus, 'fa fa-lg fa-spinner fa-spin ml-4', 'Đang cập nhật lương...');

    const successCallback = () => {
      setAttribute($adjustSalaryStatus,
                  'fa fa-lg fa-check ml-4 text-success',
                  "Đã cập nhật xong lương cho giảng viên"
                );
    };

    const errorCallback = () => {
      setAttribute($adjustSalaryStatus,
                  'fa fa-lg fa-times-circle ml-4 text-danger',
                  "Cập nhật lỗi"
                );
    };

    // get data send to server
    var code = this.props.summary.code;
    var salaries = [];
    for (var key in values) {
      var course = key.split('||')[0];
      var role = key.split('||')[1];
      var salary = values[key] + '000';
      salaries.push({course, role, salary});
    }
    if (salaries.length === 0) {
      successCallback();
    } else {
      this.props.adjustSalary(code, salaries, errorCallback, successCallback);
    }
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
        <td><div className="salary-content">{salary.course}</div></td>
        <td><div className="salary-content">{role}</div></td>
        <td className="text-right pr-5">
          <Field
            name={`${salary.course}||${salary.role}`}
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
        <Form className="adjust-instructor-salary-form" onSubmit={handleSubmit(this.onSubmit)}>
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
            <button
              className="btn btn-primary float-left"
              onClick={event => this.backToInstructorPayroll(event)}
            >
              <i className="fa fa-arrow-left mr-3"></i>Chi tiết lương giảng viên
            </button>
            <span className="col"></span>
            <button className="btn btn-success float-right" type="submit">
               <i className="fa fa-floppy-o mr-3"></i>Lưu bảng lương
            </button>
          </div>

        </Form>
      </div>
    )
  }

  render() {
    const instructor = this.props.summary.data.instructor;
    const salaries = this.props.summary.data.instructor.salaries;
      return (
        <div className="container mt-3">
          <div className="row">
            <div className="row col-md-7 ml-1">
              <button
                className="btn btn-primary float-left mt-1"
                style={{height: 38 + 'px'}}
                onClick={event => this.backToSummary(event)}
              >
                <i className="fa fa-arrow-left mr-3"></i>Danh sách lương
              </button>
            </div>
            < User/>
          </div>
          <div>
            <div className="my-5">
              <span className="font-weight-bold">Bảng lương giảng viên: &nbsp;</span>
              <span>{instructor.name}</span>
              <span id="adjust-salary-status"></span>
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

const tempComponent = connect(mapStateToProps, { fetchSummary, adjustSalary, fetchInstructorPayroll })(AdjustSalary);

export default reduxForm({
  validate,
  form: "adjustInstructorSalaryForm",
  destroyOnUnmount: false
})(tempComponent);
