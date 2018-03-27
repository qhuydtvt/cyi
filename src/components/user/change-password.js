import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { NotificationManager } from 'react-notifications';

import { loadState, changePassword } from '../../actions';

class ChangePassword extends Component {
  componentDidMount() {
    this.props.loadState();
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.changed = false;
  }

  onSubmit(values) {
    if (!this.changed) {
      this.changed = !this.changed;
      const currentPassword = values.currentPassword;
      const newPassword = values.newPassword;

      const successCallback = () => {
        NotificationManager.success('Đổi mật khẩu thành công');
        this.props.history.push("/");
        this.changed = !this.changed;
      };

      const errorCallback = () => {
        NotificationManager.error('Sai mật khẩu cũ (Hoặc lỗi kết nối)');
        this.changed = !this.changed;
      };

      this.props.changePassword({currentPassword, newPassword}, successCallback, errorCallback);
    }
  }

  renderChangePasswordForm() {
    const { handleSubmit } = this.props;
    return (
      <div className="col-md-3">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name="currentPassword"
            label="Mật khẩu cũ"
            type="password"
            component = {this.renderField}
          />
          <Field
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            component = {this.renderField}
          />
          <Field
            name="newPasswordToCheck"
            label="Nhập lại mật khẩu mới"
            type="password"
            component = {this.renderField}
          />
          <div className="mt-2">
            <button type="submit" className="btn btn-success" disabled={this.changed}>Đổi mật khẩu</button>
            <a href="/" className="btn btn-link ml-4">Quay lại</a>
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
    const loginCredentials = this.props.loginCredentials;

    if (loginCredentials.loggedIn) {
      return (
        <div className="container-fliud row justify-content-center" id="login-page">
          {this.renderChangePasswordForm()}
        </div>
      )
    } else {
      return (
        <div className="container mt-4 text-center h2">Yêu cầu đăng nhập</div>
      )
    }
  }
}

function validate(values) {
  const errors = {};
  if (!values.currentPassword || !values.currentPassword.replace(/\s/g, '')) {
    errors.currentPassword = 'Chưa nhập mật khẩu cũ';
  } if (!values.newPassword || !values.newPassword.replace(/\s/g, '')) {
    errors.newPassword = 'Chưa nhập mật khẩu mới';
  } if (!values.newPasswordToCheck || !values.newPasswordToCheck.replace(/\s/g, '')) {
    errors.newPasswordToCheck = 'Chưa xác nhận mật khẩu mới';
  } else if (values.newPasswordToCheck && values.newPasswordToCheck !== values.newPassword) {
    errors.newPasswordToCheck = 'Mật khẩu mới chưa trùng khớp';
  }
  return errors;
}

function mapStateToProps({ loginCredentials }) {
  return { loginCredentials }
}

const tempComponent = connect(mapStateToProps, { loadState, changePassword })(ChangePassword);

export default reduxForm({
  validate,
  form: "changePasswordForm",
  destroyOnUnmount: false,
  initialValues : {
    currentPassword: "",
    newPassword: "",
    newPasswordToCheck: ""
  }
})(tempComponent);
