import React, { Component } from 'react';
import { Input, Form, FormGroup, Label, Button } from 'reactstrap';
import  { withFormik, Formik } from 'formik';
import _ from 'lodash';

class CourseGeneralForm extends Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  validate(values) {
    const errors = {};
    if(!values.name) {
      errors.name = "Tên khóa không được để trống"
    }
    if(!values.description) {
      errors.description = "Mô tả khóa không được để trống";
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

    const { name, description } = values;
    const updateAllowed = (touched.name || touched.description) && _.isEmpty(errors);

    return (
      <Form onSubmit={handleSubmit} className={this.props.className}>
        
        <FormGroup className="">
          <Label>Tên</Label>
          <Input
            type="text"
            name="name"
            value={name}
            invalid={touched.name && errors.name} 
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="text-danger mt-1">{touched.name ? errors.name : " "}</div>
        </FormGroup>

        <FormGroup className="">
          <Label>Mô tả</Label>
          <Input
            type="textarea"
            name="description"
            value={description}
            invalid={touched.description && errors.description}
            onChange={handleChange}
            onBlur={handleBlur} 
          />
          <div className="text-danger mt-1">{touched.description ? errors.description : " "}</div>
        </FormGroup>
        <FormGroup className="d-flex justify-content-end">
          <Button color="success" disabled={!updateAllowed}>Cập nhật</Button>
        </FormGroup>
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

export default CourseGeneralForm;