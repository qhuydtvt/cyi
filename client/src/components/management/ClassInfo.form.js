import React, { Component } from 'react';
import  { withFormik, Formik } from 'formik';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import _ from 'lodash';

class ClassInfoForm extends Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  validate(values) {
    const errors = {};
    if(!values.classNo) {
      errors.classNo = "Số hiệu lớp không được để trống";
    }
    if(!values.maxSession) {
      errors.maxSession = "Số buổi không được để trống";
    }
    return errors;
  }

  renderForm(formProps) {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
    } = formProps;
    const { course, classNo, maxSession } = values;
    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Lớp số</Label>
          <Input
            type="number"
            name="classNo"
            invalid={touched.classNo && errors.classNo}
            onChange={handleChange}
            onBlur={handleBlur}
           />
          <div className="text-danger">{touched.classNo? errors.classNo : ""}</div>
        </FormGroup>
        <FormGroup>
          <Label>Số buổi</Label>
          <Input
            type="number"
            name="maxSession"
            invalid={touched.maxSession && errors.maxSession}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="text-danger">{touched.maxSession? errors.maxSession : ""}</div>
        </FormGroup>
        <div className="d-flex justify-content-end">
          <Button onClick={this.props.onCancel} color="secondary">Cancel</Button>
          <Button color="success" className="ml-2">OK</Button>
        </div>
      </Form>
    );
  }

  // onSubmit(values, {setSubmitting, setErrors}) {
  // }

  render() {
    return (
      <Formik
        initialValues={this.props.initialValues}
        validate={this.validate}
        onSubmit={this.props.onSubmit}
        render={this.renderForm}
      />
    );
  }
}

export default ClassInfoForm;