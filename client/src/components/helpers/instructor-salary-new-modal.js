import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Select from 'react-select';

import _ from 'lodash';

import 'react-select/dist/react-select.css';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import { hideAddInstructorSalaryModal, addNewInstructorSalary } from '../../actions';

class InstructorSalaryNew extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    var newSalary = {
      instructor: this.props.instructorSalary.instructor.code,
      course: values.course.value._id,
      role: values.role.value,
      salary: Number(values.salary)
    }

    this.props.addNewInstructorSalary(newSalary);
    this.props.hideAddInstructorSalaryModal();
  }

  renderInstructorSalaryForm() {
    const { handleSubmit } = this.props;

    var allCourses = this.props.instructorSalary.allCourses;
    var instructorCoures = this.props.instructorSalary.instructor ? this.props.instructorSalary.instructor.courses : [];

    var courseOptions = [];
    _.forEach(instructorCoures, (courseId) => {
      _.forEach(allCourses, (course) => {
        if (course._id === courseId) {
          courseOptions.push({
            'value': course,
            'label': course.name
          });
        }
      });
    });

    var roleOptions = [
      {value: "instructor", label: "Giảng Viên"},
      {value: "coach", label: "Trợ giảng"}
    ];

    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={ handleSubmit(this.onSubmit) }>
          <Field
            name = "course"
            label = "Khóa học"
            options = {courseOptions}
            component = {this.renderSelectField}
          />
          <Field
            name = "role"
            label = "Vai trò"
            options = {roleOptions}
            component = {this.renderSelectField}
          />
          <Field
            name = "salary"
            label = "Lương"
            placeholder = "..."
            component = {this.renderInputField}
          />
          <div className="mt-3">
            <button type="submit" className="btn btn-primary float-right">Thêm</button>
          </div>
        </Form>
      </div>
    );
  }


  render() {
    const { instructorSalary } = this.props;
    return (
      <Modal
          isOpen={instructorSalary.isOpen}
          toggle={this.props.hideAddInstructorSalaryModal}
        >
        <ModalHeader>Thêm lương</ModalHeader>
        <ModalBody>
            {this.renderInstructorSalaryForm()}
        </ModalBody>
      </Modal>
    );
  }

  renderInputField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "has-danger" : "";

    return (
      <FormGroup className={className}>
        <Label className="h5">{field.label}</Label>
        <Input
          {...field.input}
          placeholder={field.placeholder}
          className="form-control inputTochangeValue"
          type={field.type}
         />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderSelectField(field) {
    const {meta: {touched, error}} = field;

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {field.options}
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }
}



function mapStateToProps({ instructorSalary, summary }) {
  return { instructorSalary, summary };
}

function validate(values) {
  const errors = {};

  if (!values.salary || !values.salary.replace(/\s/g, '')) {
    errors.salary = 'Chưa nhập lương';
  }
  else if (/[^0-9]/.test(values.salary)) {
    errors.salary = 'Chỉ nhập số';
  }
  
  if (_.isEmpty(values.course)) {
    errors.course = 'Chưa chọn khóa học';
  }

  if (!values.role || !values.role.value || !values.role.value.replace(/\s/g, '')) {
    errors.role = 'Chưa chọn vai trò';
  }

  return errors;
}

const tempComponent = connect(mapStateToProps, { hideAddInstructorSalaryModal, addNewInstructorSalary })(InstructorSalaryNew);

export default reduxForm({
  validate,
  form: "addNewInstructorSalaryForm",
  destroyOnUnmount: true,
  initialValues : {course: "", role: ""}
})(tempComponent);
