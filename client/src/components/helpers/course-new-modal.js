import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import 'react-select/dist/react-select.css';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup } from 'reactstrap';

import { hideAddNewCourseModal, addNewCourse, updateCourse } from '../../actions';

class CourseNew extends Component{

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { course } = this.props.courseNew;

    var courseName = values.courseName;
    var description = values.description;

    this.props.hideAddNewCourseModal();

    const successCallback = () => {
      var successMessage = !course ? 'Thêm khóa học thành công' : 'Cập nhật thành công';
      NotificationManager.success(successMessage);
    };

    const errorCallback = () => {
      NotificationManager.error('Lỗi kết nối !');
    };

    if (!course) {
      this.props.addNewCourse({
        name: courseName,
        description
      },
        successCallback,
        errorCallback
      );
    } else {
      this.props.updateCourse({
        courseId: course._id,
        name: courseName,
        description
      },
        successCallback,
        errorCallback
      );
    }
  }

  renderCourseForm(course) {
    const { handleSubmit } = this.props;
    // console.log(course);
    // TODO: change the value of input tag to course-name and description

    return (
      <div>
        <Form className="submit-instructor-form" onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name = "courseName"
            label = "Khóa học"
            placeholder = { !course ? "Khóa học" : course.name}
            component = {this.renderInputField}
          />
          <Field
            name = "description"
            label = "Mô tả"
            placeholder = { !course ? "Mô tả" : course.description}
            component = {this.renderInputField}
          />

          <div className="mt-3">
            <button type="submit" className="btn btn-primary float-right">
              { !course ? 'Thêm mới' : 'Cập nhật' }
            </button>
          </div>
        </Form>
      </div>
    );
  }


  render() {
    const courseNew = this.props.courseNew;
    return (
      <Modal
          isOpen={courseNew.isOpen}
          toggle={this.props.hideAddNewCourseModal}
        >
        <ModalHeader>{ !courseNew.course ? 'Thêm mới khóa học' : 'Cập nhật khóa học' }</ModalHeader>
          <ModalBody>
              {this.renderCourseForm(courseNew.course)}
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
        <Input
          {...field.input}
          className="form-control inputTochangeValue"
          type="text"
         />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }
}

function mapStateToProps({ courseNew }) {
  return { courseNew };
}

function validate(values) {
  const errors = {};

  if (!values.courseName || !values.courseName.replace(/\s/g, '')) {
    errors.courseName = 'Chưa nhập tên khóa học';
  }

  if (!values.description || !values.description.replace(/\s/g, '')) {
    errors.description = 'Chưa nhập mô tả';
  }

  return errors;
}

const tempComponent = connect(mapStateToProps,
  { hideAddNewCourseModal, addNewCourse, updateCourse })(CourseNew);

export default reduxForm({
  validate,
  form: "addNewCourseForm",
  destroyOnUnmount: false,
  initialValues : {
    courseName: "",
    description: ""
  }
})(tempComponent);
