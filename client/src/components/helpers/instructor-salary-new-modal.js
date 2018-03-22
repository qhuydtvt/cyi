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
         fetchCourse,
         addNewInstructor,
         updateInstructor } from '../../actions';

class InstructorSalaryNew extends Component{

  constructor(props) {
    super(props);
    // this.props.fetchCourse();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    // const { instructor } = this.props.instructorManagement;
    // var name = values.name;
    // var code = values.code;
    // var email = values.email;
    //
    // var image = values.image.base64 ? values.image.base64 : values.image;
    // var courses = _.map(values.courses, (course) => {
    //   return course.value._id;
    // });
    //
    // this.props.hideAddNewInstructorModal();
    //
    // const successCallback = () => {
    //   var successMessage = !instructor ? 'Thêm giảng viên thành công' : 'Cập nhật thành công';
    //   NotificationManager.success(successMessage);
    // };
    //
    // const errorCallback = () => {
    //   NotificationManager.error('Lỗi kết nối !');
    // };
    //
    // if (!instructor) {
    //   this.props.addNewInstructor({name, code, email, image, courses}, successCallback, errorCallback);
    // } else {
    //   this.props.updateInstructor(instructor._id,
    //                               {name, code, email, image, courses},
    //                               successCallback,
    //                               errorCallback);
    // }
  }

  renderInstructorSalaryForm() {
    const { handleSubmit } = this.props;

    let allCourses = [];

    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={ handleSubmit(this.onSubmit) }>
          <Field
            name = "courses"
            label = "Khóa học"
            allCourses = {allCourses}
            component = {this.renderSelectCourseField}
          />
          <Field
            name = "role"
            label = "Vai trò"
            placeholder = "Vai trò"
            component = {this.renderInputField}
          />
          <Field
            name = "salary"
            label = "Lương"
            placeholder = ""
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

  renderSelectCourseField(field) {
    const {meta: {touched, error}} = field;

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



function mapStateToProps({ instructorSalary }) {
  return { instructorSalary };
}

function validate(values) {
  const errors = {};

  // if (!values.name || !values.name.replace(/\s/g, '')) {
  //   errors.name = 'Chưa nhập tên giảng viên';
  // }
  //
  // if (!values.code || !values.code.replace(/\s/g, '')) {
  //   errors.code = 'Chưa nhập mã giảng viên';
  // }
  //
  // if (!values.email || !values.email.replace(/\s/g, '')) {
  //   errors.email = 'Chưa nhập email';
  // }
  //
  // if (!values.image) {
  //   errors.image = 'Chưa chọn ảnh';
  // }
  //
  // if (_.isEmpty(values.courses)) {
  //   errors.courses = 'Chưa chọn khóa học';
  // }

  return errors;
}

const tempComponent = connect(mapStateToProps, {
  })(InstructorSalaryNew);

export default reduxForm({
  validate,
  form: "addNewInstructorSalaryForm",
  destroyOnUnmount: true,
  initialValues : {course: "", role: "", salary: 0}
})(tempComponent);
