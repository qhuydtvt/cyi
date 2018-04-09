import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import _ from 'lodash';
import moment from 'moment';

import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';

import { fetchSummary,
        fetchInstructorPayroll,
        sendPayroll,
        fetchInstructorSalary,
        fetchCourse,
        fetchAllInstructor,
        manageCourse
      } from '../../actions';

import SearchBar from '../helpers/search-bar';
import User from '../helpers/user';
import InstructorSalary from './instructor-salary';
import InstructorPayroll from './instructor-payroll';
import ManageCourse from './course';
import ManageInstructor from './instructor';

class Management extends Component {

  componentDidMount() {
    var startDate = moment().startOf('month').format('YYYY-MM-DD') + 'T00:00:00.000Z';
    var endDate = moment().endOf('month').format('YYYY-MM-DD') + 'T23:59:59.000Z';
    var name = '';

    this.props.fetchSummary(startDate, endDate, name);

    this.setDateInProps(startDate, endDate);
  }

  setDateInProps(startDate, endDate) {
    this.props.summary.startDate = startDate;
    this.props.summary.endDate = endDate;
  }

  moneyFormat(number) {
    if (!number) {
      return 0;
    }
    var money = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return money;
  }

  handleSelectDate(startDate, endDate) {

    this.setDateInProps(startDate + 'T00:00:00.000Z', endDate + 'T23:59:59.000Z');

    if (!this.props.summary.fetchInstructorPayroll) {
      this.props.fetchSummary(this.props.summary.startDate,
                              this.props.summary.endDate,
                              this.props.summary.name
                            );
    } else {
      this.props.fetchInstructorPayroll(this.props.summary.code,
                                        this.props.summary.startDate,
                                        this.props.summary.endDate)
    }
  }

  fetchInstructorSummary(code) {
    var startDate = this.props.summary.startDate;
    var endDate = this.props.summary.endDate;

    this.props.fetchInstructorPayroll(code, startDate, endDate);
  }

  renderTime(time) {

    var startDate = time.startDate.slice(0, 10);
    var endDate = time.endDate.slice(0, 10);

    // NOTE: (2017-09-30T23:59:59.000Z).slice(0, 10) => 2017-09-30
    // if u dont slice, the fucking Flatpickr will render 2017-10-01 !

    return (
      <div className="d-flex display-content-center mt-5 pl-2 time-area">
        <span className="h6">Bảng lương từ ngày: </span>
        <Flatpickr options={{defaultDate: startDate}}
              className="form-control summary-time ml-2 mr-3"
              onChange={(_, startDate) => {this.handleSelectDate(startDate, endDate)}}/>
        <span className="h6"> đến hết ngày: </span>
        <Flatpickr options={{defaultDate: endDate}}
              className="form-control summary-time ml-2"
              onChange={(_, endDate) => {this.handleSelectDate(startDate, endDate)}}/>
      </div>
    )
  }

  renderPaidStatus(paidTime) {
    var summaryStartDate = moment(this.props.summary.startDate).toDate().valueOf();
    var summaryEndDate = moment(this.props.summary.endDate).toDate().valueOf();

    var paidStartDate = moment(paidTime.startDate).toDate().valueOf();
    var paidEndDate = moment(paidTime.endDate).toDate().valueOf();

    // check if summary-time is in paid-time duration
    if (summaryStartDate >= paidStartDate && summaryEndDate <= paidEndDate ) {
      if (!this.props.summary.fetchInstructorPayroll) {
        return (
          <span className="text-success ml-4"
           title="Đã gửi bảng lương cho giảng viên">Đã gửi</span>
        )
      } else {
        return (
          <span id="payroll-status" className="fa fa-lg fa-envelope text-success ml-4"
           title="Đã gửi bảng lương cho giảng viên"></span>
        )
      }
    } else {
      return (<span id="payroll-status"></span>)
    }
  }

  renderSummaryRow(payrollDetail, index) {
    var totalSalary = this.moneyFormat(payrollDetail.totalSalary);
    return (
      <tr key={index}
          className="instructor-summary"
          title="Xem chi tiết"
          onClick={event => this.fetchInstructorSummary(payrollDetail.code)}
      >
        <th scope="row">{payrollDetail.name}</th>
        <td className="pl-5">{payrollDetail.totalClass}</td>
        <td className="text-right pr-5">{totalSalary} VND</td>
        <td></td>
        <td></td>
        <td>
          {this.renderPaidStatus(payrollDetail.paidTime)}
        </td>
      </tr>
    )
  }

  renderSummaryTable(payroll) {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>Giảng viên</th>
            <th>Tổng số buổi</th>
            <th className="text-right pr-5">Tổng lương</th>
            <th></th>
            <th></th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(payroll, (payrollDetail, index) => {
              return this.renderSummaryRow(payrollDetail, index)
            })
          }
        </tbody>
      </Table>
    );
  }

  renderSummaryData(summary) {
    if (!summary.fetchInstructorPayroll) {
      return (
        this.renderSummaryTable(summary.data.payroll)
      );
    } else {
      return (
        <InstructorPayroll />
      );
    }
  }

  render() {
    const { summary } = this.props;
    
    // TODO + NOTE: findout and fix bug: code run in block else if (summary.data) without data

    if(summary.fetchInstructorSalary) {
      return (
        <InstructorSalary />
      )
    }
    else if(summary.manageCourse) {
      return (
        <ManageCourse />
      )
    }
    else if(summary.manageInstructor) {
      return (
        <ManageInstructor />
      )
    }
    else if(summary.data && summary.startDate && summary.endDate) {
      if (!summary.data.success) {
        return (
          <div>Loading....</div>
        )
      } else {
        var summaryButtonClass = summary.fetchInstructorPayroll ? "btn btn-secondary" : "btn";
        summaryButtonClass += " float-left btn__height--primary mt-1";
        return (
          <div className="container mt-3">
            <div className="row px-3">
              <button
                className={summaryButtonClass}
                onClick={event => this.props.fetchSummary(summary.startDate, summary.endDate, '')}
              >
                <i className="fa fa-file-text-o mr-3"></i>Lương tất cả giảng viên
              </button>
              
              <button className='btn btn-secondary mx-3 btn__height--primary mt-1' onClick={event => this.props.fetchAllInstructor()}>
                <i className='fa fa-users mr-3'></i>Quản lý giảng viên
              </button>
              <button className='btn btn-secondary btn__height--primary mt-1' onClick={event => this.props.manageCourse()}>
                <i className='fa fa-book mr-3'></i>Quản lý khóa học
              </button>
              <User />
            </div>
            <hr/>

            {this.renderTime(summary.data.summaryTime)}
            <div className='my-4'>
              { !this.props.summary.fetchInstructorPayroll ? <SearchBar /> : <div></div> }
            </div>

            {summary.data.payroll.length ? this.renderSummaryData(summary) : <h4>Không tìm thấy thông tin</h4>}
          </div>
        )
      }
    }
    else {
      return (
        <div className="container mt-3">
          <div className="row">
            <SearchBar />
            <User />
          </div>
          <h5 className="mt-4 ml-1">Đang tải thống kê lương . . . . </h5>
        </div>
      )
    }
  }
}

function mapStateToProps({ summary }) {
  return { summary };
}

export default connect(mapStateToProps,
                        {
                          fetchSummary,
                          fetchInstructorPayroll,
                          sendPayroll,
                          fetchInstructorSalary,
                          fetchCourse,
                          fetchAllInstructor,
                          manageCourse
                        }
                     )(Management);
