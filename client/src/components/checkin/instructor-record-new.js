import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import 'react-select/dist/react-select.css';
import { Creatable } from 'react-select';
import Select from 'react-select';

import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';

import _ from 'lodash';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import { hideAddIntructorModal, addInstructorRecord, fetchCourse } from '../../actions';

class InstructorRecordNew extends Component{
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.props.fetchCourse();
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

    // NOTE for rightnow!!! : update saving record's course by id not by name anymore
    var course = values.course.value._id;
    var className = values.className;

    // reset class-name n course send to server
    className = this.updateClassName(values.course.value.name, className);
    // course = this.updateCourse(course);


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

  renderAddRecordForm(instructor) {
    const { handleSubmit } = this.props;
    let courseOptions = !_.isEmpty(instructor.courses) ? instructor.courses : this.props.instructorRecordNew.allCourses;

    // check if courseOptions contain course-ids or course-objects
    // if contain course-ids => query in this.props.instructorRecordNew.allCourses to get all course-objects

    let updatedCourseOptions = [];

    _.forEach(courseOptions, (course) => {
      if (typeof(course) === "string") {
        _.forEach(this.props.instructorRecordNew.allCourses, (courseObject) => {
          if (courseObject._id === course) {
            updatedCourseOptions.push({
              'value': courseObject,
              'label': courseObject.name
            });
          }
        });
      } else {
        updatedCourseOptions.push({
          'value': course,
          'label': course.name
        });
      }
    });

    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name="course"
            label="Khóa học"
            courseOptions={updatedCourseOptions}
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
                  {this.renderAddRecordForm(instructor)}
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

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {field.courseOptions}
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

function mapStateToProps({ instructorRecordNew }) {
  return { instructorRecordNew };
}

function validate(values) {
  const errors = {};
  if (!values.course || !values.course.value) {
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
  { hideAddIntructorModal, addInstructorRecord, fetchCourse })(InstructorRecordNew);

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
