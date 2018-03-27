import  React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logout, toggleAccountDropdown, fetchCurrentUser, showFeedbackForm } from '../../actions'

class User extends Component {

  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return (
      <div id="user-info" className="col-md-5 row">
        <span className="col text-right text-primary"> Xin chào {this.props.user.displayName} </span>
        <Dropdown isOpen={this.props.user.isOpen} toggle={() => this.props.toggleAccountDropdown()}>
          <DropdownToggle caret>
            Tài khoản
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem href="/change-password" className="text-muted">Đổi mật khẩu</DropdownItem>
            <DropdownItem onClick={this.props.logout} className="text-muted">Đăng xuất</DropdownItem>
            <DropdownItem onClick={this.props.showFeedbackForm}>Feedback</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps, { toggleAccountDropdown, logout, fetchCurrentUser, showFeedbackForm })(User);
