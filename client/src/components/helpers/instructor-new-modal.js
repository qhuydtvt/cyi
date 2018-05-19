import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Select from 'react-select';

import _ from 'lodash';

import 'react-select/dist/react-select.css';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import FileBase64 from 'react-file-base64';

import { hideAddNewInstructorModal,
         fetchCourses,
         addNewInstructor,
         updateInstructor,
         fetchTeam } from '../../actions';

class InstructorNew extends Component{

  constructor(props) {
    super(props);
    this.props.fetchCourses();
    this.props.fetchTeam();
    this.onSubmit = this.onSubmit.bind(this);
    this.validateInstructorCode = this.validateInstructorCode.bind(this);
  }

  onSubmit(values) {
    const { instructor } = this.props.instructorManagement;
    var firstName = values.firstName;
    var lastName = values.lastName;
    
    var teamId = values.team.value ? values.team.value._id : '';
    var email = values.email;

    var image = values.image ? values.image.base64 : values.image;
    var courses = _.map(values.courses, (course) => {
      return course.value._id;
    });

    this.props.hideAddNewInstructorModal();

    const successCallback = () => {
      var successMessage = !instructor ? 'Thêm giảng viên thành công' : 'Cập nhật thành công';
      NotificationManager.success(successMessage);
    };

    const errorCallback = () => {
      NotificationManager.error('Lỗi kết nối !');
    };

    if (!instructor) {
      this.props.addNewInstructor({firstName, lastName, teamId, email, image, courses}, successCallback, errorCallback);
    } else {
      this.props.updateInstructor(instructor._id,
                                  {firstName, lastName, email, image, courses},
                                  successCallback,
                                  errorCallback);
    }
  }

  validateInstructorCode(value) {
    let codeIsValid = true;
    let updatingInstructor = this.props.instructorManagement.instructor;

    _.forEach(this.props.instructorManagement.instructorData, (instructor) => {
      if (!updatingInstructor && instructor.code === value) {
        codeIsValid = false;
      }
    });
    return codeIsValid ? "" : "Trùng mã giảng viên";
  }

  renderInstructorForm(instructor) {
    const { handleSubmit } = this.props;
    const allCourses = this.props.instructorManagement.allCourses;

    let updatingInstructor = this.props.instructorManagement.instructor;

    let selectedCourses = [];
    if (updatingInstructor) {
      _.forEach(updatingInstructor.courses, (course) => {
        selectedCourses.push({
          'value': course,
          'label': course.name
        });
      });
    }

    var teams = this.props.instructorManagement.teamData;
    
    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={ handleSubmit(this.onSubmit) }>
          {!updatingInstructor ? <Field
            name = "team"
            label = "Bộ phận giảng dạy"
            teams = {teams}
            component = {this.renderSelectTeamField}
          /> : <div></div>}
          <Field
            name="lastName"
            label="Họ"
            placeholder="Họ"
            component = { this.renderInputField } 
          />
          <Field
            name = "firstName"
            label = "Tên"
            placeholder = "Tên"
            component = { this.renderInputField }
          />
          <Field
            name = "email"
            label = "Email"
            placeholder = "Email"
            component = {this.renderInputField}
          />
          <Field
            name = "image"
            label = "Ảnh"
            component = {this.renderUploadFileField}
          />
          <Field
            name = "courses"
            label = "Khóa học"
            allCourses = {allCourses}
            selectedCourses = {selectedCourses}
            component = {this.renderSelectCourseField}
          />

          <div className="mt-3">
            <button type="submit" className="btn btn-primary float-right">
              { !instructor ? 'Thêm mới' : 'Cập nhật' }
            </button>
          </div>
        </Form>
      </div>
    );
  }


  render() {
    const instructorManagement = this.props.instructorManagement;
    return (
      <Modal
          isOpen={instructorManagement.isOpen}
          toggle={this.props.hideAddNewInstructorModal}
        >
        <ModalHeader>
          { !instructorManagement.instructor ? 'Thêm mới giảng viên' : `Giảng viên (${instructorManagement.instructor.code})` }
        </ModalHeader>
        <ModalBody>
            {this.renderInstructorForm(instructorManagement.instructor)}
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
          type="text"
         />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderUploadFileField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "has-danger" : "";
    return (
      <FormGroup className={className}>
        <Label className="h5 mr-3">{field.label}</Label>
        <FileBase64
          onDone={(files) => field.input.onChange(files)}
          className="form-control ml-5"
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderSelectTeamField(field) {
    const {meta: {touched, error}} = field;

    var teamOptions = [];
    _.forEach(field.teams, (team) => {
      teamOptions.push({
        'value': team,
        'label': team.name
      });
    });

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {teamOptions}
          disabled = {field.disabled}
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderSelectCourseField(field) {
    const {meta: {touched, error}} = field;

    // TODO: set the init value of Select tag on updating instructor

    var courseOptions = [];
    _.forEach(field.allCourses, (course) => {
      courseOptions.push({
        'value': course,
        'label': course.name
      });
    });

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {courseOptions}
          multi
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }
}



function mapStateToProps({ instructorManagement }) {
  return { instructorManagement };
}

function validate(values) {
  const errors = {};

  if (!values.name || !values.name.replace(/\s/g, '')) {
    errors.name = 'Chưa nhập tên giảng viên';
  }

  if (!values.email || !values.email.replace(/\s/g, '')) {
    errors.email = 'Chưa nhập email';
  }

  if (!values.image) {
    // check if user is creating or updating instructor
    // create: team.value = someValue
    // update: team.value = null 
    if (values.team.value) {
      errors.image = 'Chưa chọn ảnh';
    }
  }

  if (_.isEmpty(values.team)) {
    errors.team = 'Chưa chọn bộ phận';
  }

  if (_.isEmpty(values.courses)) {
    errors.courses = 'Chưa chọn khóa học';
  }

  return errors;
}

const tempComponent = connect(mapStateToProps, {
    hideAddNewInstructorModal,
    fetchCourses,
    addNewInstructor,
    updateInstructor,
    fetchTeam
  })(InstructorNew);

export default reduxForm({
  validate,
  form: "addNewInstructorForm",
  destroyOnUnmount: true,
  initialValues : {firstName: "", lastName: "", team: "", email: "", image: "", courses: []}
})(tempComponent);
