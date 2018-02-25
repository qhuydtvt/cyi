import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';

import { fetchUserCheckinSummary } from './../../actions';

import User from '../helpers/user';

import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';

class CheckinSummary extends Component {

  componentDidMount() {
    var startDate = moment().startOf('month').format('YYYY-MM-DD') + 'T00:00:00.000Z';
    var endDate = moment().endOf('month').format('YYYY-MM-DD') + 'T23:59:59.000Z';
    var instructorId = this.props.loginCredentials.instructorId;

    this.props.fetchUserCheckinSummary(instructorId, startDate, endDate);

    this.setDateInProps(startDate, endDate);
  }

  moneyFormat(number) {
    if (!number) {
      return 0;
    }
    var money = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return money;
  }

  setDateInProps(startDate, endDate) {
    this.props.user.startDate = startDate;
    this.props.user.endDate = endDate;
  }

  handleSelectDate(startDate, endDate) {

    const setAttribute = ($element, className, title) => {
      $element.attr("class", "");
      $element.toggleClass(className);
      $element.attr("title", title);
    }

    var $checkinSummaryStatus = $("#checkin-summary-status");
    setAttribute($checkinSummaryStatus, 'fa fa-spinner fa-spin ml-4', 'Đang tải...');

    const successCallback = () => {
      setAttribute($checkinSummaryStatus,
                  'fa fa-check ml-4 text-success',
                  "Thành công"
                );
    };

    const errorCallback = () => {
      setAttribute($checkinSummaryStatus,
                  'fa fa-times-circle ml-4 text-danger',
                  "Lỗi kết nối"
                );
    };

    this.setDateInProps(startDate + 'T00:00:00.000Z', endDate + 'T23:59:59.000Z');

    this.props.fetchUserCheckinSummary(this.props.loginCredentials.instructorId,
                                        this.props.user.startDate,
                                        this.props.user.endDate,
                                        errorCallback,
                                        successCallback);
  }

  renderTime(time) {

    var startDate = time.startDate.slice(0, 10);
    var endDate = time.endDate.slice(0, 10);

    // NOTE: (2017-09-30T23:59:59.000Z).slice(0, 10) => 2017-09-30
    // if u dont slice, the fucking Flatpickr will render 2017-10-01 !

    return (
      <div className="d-flex display-content-center time-area">
        <span className="h6">Chi tiết chấm công từ ngày: </span>
        <Flatpickr options={{defaultDate: startDate}}
              className="form-control summary-time ml-2 mr-3"
              onChange={(_, startDate) => {this.handleSelectDate(startDate, endDate)}}/>
        <span className="h6"> đến hết ngày: </span>
        <Flatpickr options={{defaultDate: endDate}}
              className="form-control summary-time ml-2"
              onChange={(_, endDate) => {this.handleSelectDate(startDate, endDate)}}/>
        <span id="checkin-summary-status"></span>
      </div>
    )
  }

  renderRole(role) {
    switch (role) {
      case 'instructor':
        role = 'Giảng viên'
        break;
      case 'coach':
        role = 'Trợ giảng'
        break;
      default:
        role = 'Undefined role'
    }
    return role;
  }

  renderSummaryRow(record, index) {
    var salary = this.moneyFormat(record.salary);
    var role = this.renderRole(record.role);
    var recordDate = moment(record.recordDate).format('DD/MM/YYYY');
    return (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td>{record.className}</td>
        <td>{role}</td>
        <td>{recordDate}</td>
        <td>{salary} VND</td>
      </tr>
    )
  }

  renderSummaryTable(records) {
    return (
      <Table striped>
        <thead>
          <tr>
            <th className="mx-2">#</th>
            <th>Lớp</th>
            <th>Vai trò</th>
            <th>Ngày</th>
            <th>Lương</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(records, (record, index) => {
              return this.renderSummaryRow(record, index)
            })
          }
        </tbody>
      </Table>
    );
  }

  renderTotalSalary(totalSalary) {
    var totalSalaryFormated = this.moneyFormat(totalSalary);
    return (
      <div className="text-right mb-5">
        <span className="font-weight-bold">Tổng lương: &nbsp;</span>
        <span>{totalSalaryFormated} VND</span>
      </div>
    )
  }

  render() {
    const time = {
      startDate: this.props.user.startDate,
      endDate: this.props.user.endDate
    }
    const {summary} = this.props.user;
    if (!summary) {
      return (
        <div className="container mt-3">
          <div className="row">
            <div className="row col-md-7 ml-1"></div>
            <User />
          </div>
          <h4>Đang tải thông tin.....</h4>
        </div>
      )
    } else if (!summary.length) {
      return (
        <div className="container mt-3">
          <div className="row">
            <div className="row col-md-7 ml-1"></div>
            <User />
          </div>
          {this.renderTime(time)}
          <h4>Không tìm thấy thông tin</h4>
        </div>
      )
    } else {
      return (
        <div className="container mt-3">
          <div className="row">
            <div className="row col-md-7 ml-1"></div>
            <User />
          </div>
          {this.renderTime(time)}
          {this.renderSummaryTable(summary[0].records)}
          {this.renderTotalSalary(summary[0].totalSalary)}
        </div>
      )
    }

  }
}

function mapStateToProps({ user, loginCredentials }) {
  return { user, loginCredentials };
}

export default connect(mapStateToProps, {fetchUserCheckinSummary})(CheckinSummary);
