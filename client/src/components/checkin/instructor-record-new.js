import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import 'react-select/dist/react-select.css';
import { Creatable } from 'react-select';
import Select from 'react-select';

import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';

import _ from 'lodash';
import moment from 'moment';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import { hideAddIntructorModal, addInstructorRecord, fetchCourses } from '../../actions';

class InstructorRecordNew extends Component{
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.props.fetchCourses();
  }

  updateCourse(course){
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

  getClassName(course, classNo){
    var preName = ' ';

    if (course.indexOf('CFA') >= 0) {
      preName = '.';
    }
    else if (course.indexOf('C4K F') >= 0) {
      preName = '';
    }

    if (Number(classNo) < 10) {
      classNo = classNo.replace(/0/g, '');
    }

    return course + preName + classNo;
  }

  getAddedDate() {
    // this is stupid
    const addZezoToNumber = (numb) => {
      if (numb < 10) return '0' + numb;
      return numb;
    }

    let addedDate = moment();
    let year, month, day, hour, min, second;
    year = addedDate.year();

    month = addZezoToNumber(parseInt(addedDate.month() + 1, 10));
    day = addZezoToNumber(parseInt(addedDate.date(), 10));
    hour = addZezoToNumber(parseInt(addedDate.hour(), 10));
    min = addZezoToNumber(parseInt(addedDate.minute(), 10));
    second = addZezoToNumber(parseInt(addedDate.second(), 10));
    
    addedDate = `${year}-${month}-${day}T${hour}:${min}:${second}.001Z`;

    return addedDate
  }

  onSubmit(values) {
    const instructor = this.props.instructorRecordNew.instructor;
    const instructorId = instructor._id;

    var course = values.course.value._id;

    var classNo = values.classNo;

    var forcedSave = values.forcedSave;

    // reset class-name n course send to server
    var className = this.getClassName(values.course.value.name, classNo);

    const role = values.role.value;
    var recordDate = values.recordDate;
    
    var addedDate = this.getAddedDate();

    // don't khnow wtf happened with react-flatpickr, but when changing month it's return recordDate in an array ??
    if (_.isArray(recordDate)) {
      recordDate = recordDate[0];
    }

    // if recordDate does not contain hour => moment set hour by server's time => -1 day 
    if (!moment(recordDate).hour() && !moment(recordDate).minute() && !moment(recordDate).second()) {
      recordDate = moment(recordDate).format('YYYY-MM-DD');
      recordDate += 'T00:00:00.001Z';
    }

    this.props.hideAddIntructorModal();
    const infoCallback = () => {
      NotificationManager.info(`Đang chấm công cho: ${instructor.lastName} ${instructor.firstName} ...`);
    };

    const successCallback = () => {
      NotificationManager.success(`Đã chấm công cho: ${instructor.lastName} ${instructor.firstName}`);
    };

    const errorCallback = (message) => {
      NotificationManager.error(`Không chấm được cho: ${instructor.lastName} ${instructor.firstName}. ${message}`);
    };

    this.props.addInstructorRecord({
      instructorId,
      course,
      className,
      classNo,
      role,
      recordDate,
      addedDate,
      forcedSave
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
            name="classNo"
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
          <Field
            name="forcedSave"
            label="Chấp nhận quá số buổi"
            component = {this.renderCheckBoxField}
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
        <ModalHeader>{instructor.lastName} {instructor.firstName}</ModalHeader>
          <ModalBody>
              {this.renderAddRecordForm(instructor)}
          </ModalBody>
      </Modal>
    );
  }

  renderCheckBoxField(field) {
    return (
      <FormGroup check className="my-4">
        <Label check className="h5">
          <Input type="checkbox" {...field.input} /> {' '}
          {field.label}
        </Label>
      </FormGroup>
    );
  }

  renderInputField(field) {
    const {meta: {touched, error}} = field;
    const classNo = (touched && error) ? "has-danger" : "";
    return (
      <FormGroup className={classNo} >
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

  if (!values.classNo || !values.classNo.replace(/\s/g, '')) {
    errors.classNo = 'Chưa nhập lớp học';
  }
  else if (/[^0-9]/.test(values.classNo)) {
    errors.classNo = 'Chỉ nhập số';
  }

  if (!values.role || !values.role.value || !values.role.value.replace(/\s/g, '')) {
    errors.role = 'Chưa chọn vai trò';
  }
  return errors;
}

const tempComponent = connect(mapStateToProps, { hideAddIntructorModal, addInstructorRecord, fetchCourses })(InstructorRecordNew);

export default reduxForm({
  validate,
  form: "addInstructorRecordForm",
  destroyOnUnmount: false,
  initialValues : {
    course: {value: "", label: "Chọn khóa học..."},
    classNo: "",
    forcedSave: false,
    recordDate: new Date().toISOString(),
    role: {value: "instructor", label: "Giảng Viên"}
  }
})(tempComponent);
