import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import 'react-select/dist/react-select.css';
import { Creatable } from 'react-select';
import Select from 'react-select';

import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import { hideAddIntructorModal, addInstructorRecord } from '../actions';

class InstructorRecordNew extends Component{
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  updateCourse = (course) => {
    if (course.indexOf('IELTS L&R') >= 0) {
      course = 'IELTS L&R';
    }
    else if (course.indexOf('IELTS S') >= 0) {
      course = 'IELTS S';
    }
    else if (course.indexOf('IELTS') >= 0
    && course.indexOf('IELTS S') < 0
    && course.indexOf('IELTS L&R') < 0) {
      course = 'IELTS';
    }
    else if (course.indexOf('C4K Advance') >= 0) {
      course = 'C4K'
    }
    return course;
  }

  updateClassName = (course, className) => {
    var preName = ' ';

    if (course.indexOf('CFA') >= 0) {
      preName = '.';
    }
    else if (course.indexOf('C4K F') >= 0) {
      preName = '';
    }

    if (Number(className) < 10) {
      className = className.replace(/0/g, '');
    }

    return course + preName + className;
  }

  onSubmit(values) {
    const instructor = this.props.instructorRecordNew.instructor;
    const instructorId = instructor._id;
    var course = values.course.value;

    var className = values.className;
    // reset class-name n course send to server
    className = this.updateClassName(course, className);
    course = this.updateCourse(course);

    const role = values.role.value;
    const recordDate = values.recordDate;

    this.props.hideAddIntructorModal();
    const infoCallback = () => {
      NotificationManager.info(`Đang chấm công cho: ${instructor.name} ...`);
    };

    const successCallback = () => {
      NotificationManager.success(`Đã chấm công cho: ${instructor.name}`);
    };

    const errorCallback = () => {
      NotificationManager.error(`Không chấm được cho: ${instructor.name}`);
    };

    this.props.addInstructorRecord({
      instructorId,
      course,
      className,
      role,
      recordDate
    },
      infoCallback,
      successCallback,
      errorCallback
    );
  }

  renderAddRecordForm() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name="course"
            label="Khóa học"
            component = {this.renderSelectCourseField}
          />
          <Field
            name="className"
            label="Lớp"
            component = {this.renderInputField}
          />
          <Field
            name="role"
            label="Vai Trò"
            component = {this.renderSelectRoleField}
          />
          <Field
            name="recordDate"
            label="Ngày"
            component = {this.renderDateField}
          />
          <div className="mt-2">
            <button type="submit" className="btn btn-primary">Hoàn tất</button>
          </div>
        </Form>
      </div>
    );
  }


  render() {
    const instructorRecordNew = this.props.instructorRecordNew;
    const instructor = instructorRecordNew.instructor;

    if (!instructor) {
      return <div></div>;
    }

    return (
          <Modal
              isOpen={instructorRecordNew.isOpen}
              toggle={this.props.hideAddIntructorModal}
            >
            <ModalHeader>{instructor.name}</ModalHeader>
              <ModalBody>
                  {this.renderAddRecordForm()}
              </ModalBody>
          </Modal>
    );
  }

  renderInputField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "has-danger" : "";
    return (
      <FormGroup className={className} >
        <Label className="h5">{field.label}</Label>
        <Input className="form-control" type="text" {...field.input}/>
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderSelectRoleField(field) {
    const {meta: {touched, error}} = field;
    const roleOptions = [
      {value: "instructor", label: "Giảng Viên"},
      {value: "coach", label: "Trợ giảng"}
    ];

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Creatable
          options = {roleOptions}
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    )
  }

  renderSelectCourseField(field) {
    const {meta: {touched, error}} = field;

    const courseOptions = [
      {value: "Android", label: "Android"},
      {value: "C4E", label: "C4E"},
      {value: "C4K", label: "C4K"},
      {value: "C4K Advance", label: "C4K Advance"},
      {value: "C4K F", label: "C4K F"},
      {value: "CFA 1", label: "CFA 1"},
      {value: "CFA 2", label: "CFA 2"},
      {value: "CI", label: "CI"},
      {value: "Foundation", label: "Foundation"},
      {value: "Game", label: "Game"},
      {value: "GMAT", label: "GMAT"},
      {value: "GRE", label: "GRE"},
      {value: "IELTS Intensive", label: "IELTS Intensive"},
      {value: "IELTS Advance", label: "IELTS Advance"},
      {value: "IELTS L&R Advance", label: "IELTS L&R Advance"},
      {value: "IELTS S Advance", label: "IELTS S Advance"},
      {value: "IELTS Pre-Inter", label: "IELTS Pre-Inter"},
      {value: "IELTS L&R Pre-Inter", label: "IELTS L&R Pre-Inter"},
      {value: "IELTS S Pre-Inter", label: "IELTS S Pre-Inter"},
      {value: "IELTS Inter", label: "IELTS Inter"},
      {value: "IELTS L&R Inter", label: "IELTS L&R Inter"},
      {value: "IELTS S Inter", label: "IELTS S Inter"},
      {value: "iOS", label: "iOS"},
      {value: "Pronunciation", label: "Pronunciation"},
      {value: "Web", label: "Web"},
      {value: "RN", label: "React Native"},
    ];

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {courseOptions}
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    )
  }

  renderDateField(field) {
    return (
      <FormGroup className="calendar">
        <label className="h5">{field.label}</label>
        <Flatpickr {...field.input} className="form-control"/>
        <i className="fa fa-calendar"></i>
      </FormGroup>
    );
  }
}

function mapStateToProps({instructorRecordNew}) {
  return {instructorRecordNew};
}

function validate(values) {
  const errors = {};
  if (!values.course || !values.course.value || !values.course.value.replace(/\s/g, '')) {
    errors.course = 'Chưa chọn khóa học';
  }
  // TODO check className length
  if (!values.className || !values.className.replace(/\s/g, '')) {
    errors.className = 'Chưa nhập lớp học';
  }
  else if (/[^0-9]/.test(values.className)) {
    errors.className = 'Chỉ nhập số';
  }

  if (!values.role || !values.role.value || !values.role.value.replace(/\s/g, '')) {
    errors.role = 'Chưa chọn vai trò';
  }
  return errors;
}

const tempComponent = connect(mapStateToProps,
  { hideAddIntructorModal, addInstructorRecord })(InstructorRecordNew);

export default reduxForm({
  validate,
  form: "addInstructorRecordForm",
  destroyOnUnmount: false,
  initialValues : {
    course: {value: "", label: "Chọn khóa học..."},
    className: "",
    recordDate: new Date().toISOString(),
    role: {value: "instructor", label: "Giảng Viên"}
  }
})(tempComponent);
