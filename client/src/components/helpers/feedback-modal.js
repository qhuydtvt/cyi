import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Select from 'react-select';

import _ from 'lodash';

import Loading from './loading';

import 'react-select/dist/react-select.css';

import { NotificationManager } from 'react-notifications';

import { Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup, Button } from 'reactstrap';

import { hideFeedbackForm, fetchDepartments, sendFeedback } from '../../actions';

class FeedbackModal extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchDepartments();
  }

  renderTextAreaField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "has-danger" : "";

    return (
      <FormGroup className={className}>
        <Label className="h5">{field.label}</Label>
        <Input
          {...field.input}
          placeholder={field.placeholder}
          className="form-control inputTochangeValue"
          type="textarea"
         />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  renderDepartmentOptions(field) {
    const {meta: {touched, error}} = field;

    var departmentOptions = [];
    _.forEach(field.allDepartments, (department) => {
      departmentOptions.push({
        'value': department,
        'label': department.displayName
      });
    });

    return (
      <FormGroup>
        <label className="h5">{field.label}</label>
        <Select
          options = {departmentOptions}
          multi
          {...field.input} onBlur = {() => field.input.onBlur(field.value)}
        />
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </FormGroup>
    );
  }

  onSubmit(values) {
    const content = values.content;

    const progressCallback = () => {
      NotificationManager.info('Đang gửi feedback');
    }
    
    const successCallback = () => {
      NotificationManager.success('Feedback của bạn đã được gửi đi');
    };

    const errorCallback = () => {
      NotificationManager.error('Lỗi kết nối !');
    };

    const departmentIds = values.departments.map((deparment, index) => {
      return deparment.value._id;
    });
    
    this.props.sendFeedback(departmentIds, content, progressCallback, successCallback, errorCallback);
  }

  renderFeedbackForm() {
    const departmentOptions = _.map(this.props.department, (department, id) => {
      return department;
    });
    
    const { handleSubmit } = this.props;

    return (
      <div>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name = "departments"
            label = "Bộ phận"
            allDepartments = { departmentOptions }
            component = {this.renderDepartmentOptions}
            >
          </Field>
          <Field
            name = "content"
            label = "Nội dung"
            placeholder = "Nội dung feedback"
            component = {this.renderTextAreaField}
            >
          </Field>
          <div className="mt-3 float-right">
            <Button type="submit" color="primary">Gửi</Button>
          </div>
        </Form>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="d-flex justify-content-center">
        <Loading/>
      </div>
    );
  }

  render() {
    return (
      <Modal
        isOpen = {this.props.feedbackModal.isOpen}
        toggle = {this.props.hideFeedbackForm}
      >
        <ModalHeader>
          Feedback
        </ModalHeader>
        <ModalBody>
          {
            this.props.department ? 
              this.renderFeedbackForm() : this.renderLoading()
          }
        </ModalBody>
      </Modal>
    );
  }
}

function validate(values) {
  var errors = {};
  return errors;
}

function mapStateToProps({ feedbackModal, department }) {
  return { feedbackModal, department };
}

export default reduxForm({validate,
  form: "feedbackForm"
})(
  connect(mapStateToProps, {hideFeedbackForm, fetchDepartments, sendFeedback}) (FeedbackModal)
);
