import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from './user/login';
import Checkin from './checkin/checkin';
import CheckinSummary from './user/checkin-summary';
import Management from './management/management';

import { loadState, logout } from '../actions';

class Main extends Component {

  componentDidMount() {
    this.props.loadState(this.props.logout);
  }

  render() {
    const loginCredentials = this.props.loginCredentials;
    if (loginCredentials.loggedIn) {
      if (loginCredentials.role === 'manager') {
        return <Management />
      } else if (loginCredentials.role === 'receptionist') {
        return <Checkin />
      } else if (loginCredentials.role === 'instructor') {
        return <CheckinSummary />
      } else {
        return (
          <div className="container">
            <Login className="mt-5" />
            <h4 className="mt-5 text-center">Tài khoản chưa được phân quyền</h4>
          </div>
        )
      }
    } else {
      return <Login />
    }
  }
}

function mapStateToProps({ loginCredentials }) {
  return { loginCredentials };
}

export default connect(mapStateToProps, { loadState, logout })(Main);
