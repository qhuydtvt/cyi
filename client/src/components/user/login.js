import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { NotificationManager } from 'react-notifications';

import Loading from '../helpers/loading';

import { login, showLoginLoading, hideLoginLoading } from '../../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.submitted = false;
  }

  onSubmit(values) {
    if (!this.submitted) {
      const username = values.username;
      const password = values.password;

      const successCallback = () => {
        this.props.hideLoginLoading();
        NotificationManager.success('Đăng nhập thành công');
        this.submitted = !this.submitted;
      };

      const errorCallback = (message) => {
        this.props.hideLoginLoading();
        if(!message) {
          NotificationManager.error('Đăng nhập không thành công');
        } else {
          NotificationManager.error(message);
        }
        this.submitted = !this.submitted;
      };

      this.props.showLoginLoading();

      this.props.login({username, password}, successCallback, errorCallback);
      this.submitted = !this.submitted;
    }
  }

  renderLoginForm() {
    const { handleSubmit } = this.props;
    return (
      <div className="col-md-3">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name="username"
            label="Tài khoản"
            type="text"
            component = {this.renderField}
          />
          <Field
            name="password"
            label="Mật khẩu"
            type="password"
            component = {this.renderField}
          />
          <div className="mt-2">
            <button type="submit" className="btn btn-success" disabled={this.submitted}>Đăng nhập</button>
          </div>
        </form>

      </div>
    )
  }

  renderField(field) {
    const {meta: {touched, error}} = field;
    const className = (touched && error) ? "form-group has-danger" : "";
    return (
      <div className={className} >
        <label className="h5">{field.label}</label>
        <input className="form-control" type={field.type} {...field.input}/>
        <div className="form-text text-danger">
          {touched ? error : ""}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fliud row justify-content-center" id="login-page">
        {this.renderLoginForm()}
        {this.props.loginCredentials.loggingIn &&
          <div id="login-loading">
            <Loading type="bubbles"/>
          </div>
        }
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.username || !values.username.replace(/\s/g, '')) {
    errors.username = 'Chưa nhập tên người dùng';
  }

  if (!values.password || !values.password.replace(/\s/g, '')) {
    errors.password = 'Chưa nhập mật khẩu'
  }
  return errors;
}

function mapStateToProps({ loginCredentials, summary }) {
  return { loginCredentials, summary }
}

const tempComponent = connect(mapStateToProps, { login, showLoginLoading, hideLoginLoading })(Login);

export default reduxForm({
  validate,
  form: "loginForm",
  destroyOnUnmount: false,
  initialValues : {
    username: "",
    password: ""
  }
})(tempComponent);
