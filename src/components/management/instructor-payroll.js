import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';

import { sendPayroll,
         fetchInstructorSalary,
         showAddInstructorModal,
         showConfirmDialog,
         hideConfirmDialog,
         removeInstructorRecord
       } from '../../actions';

import InstructorRecordNew from '../checkin/instructor-record-new';

class InstructorPayroll extends Component {

  constructor(props) {
    super(props);
    this.showConfirmDialog = this.showConfirmDialog.bind(this);
    this.handleInstructorClick = this.handleInstructorClick.bind(this);
    this.deleted = false;
  }

  showConfirmDialog(record) {
    const deletedCallback = () => {
      this.deleted = false;
    };

    if (!this.deleted) {
      const onYesClick = () => {
        this.deleted = true;
        this.props.hideConfirmDialog();
        this.props.removeInstructorRecord(record, deletedCallback);
      };

      const onNoClick = () => {
        this.props.hideConfirmDialog();
      };
      this.props.showConfirmDialog("Xóa lượt chấm công", "Bạn có chắc muốn xóa?", onYesClick, onNoClick);
    }
  }

  moneyFormat(number) {
    if (!number) {
      return 0;
    }
    var money = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return money;
  }

  handleInstructorClick(instructor) {
    this.props.showAddInstructorModal(instructor);
  }

  handleSendPayroll(instructor) {

    const setAttribute = ($element, className, title) => {
      $element.attr("class", "");
      $element.toggleClass(className);
      $element.attr("title", title);
    }

    var $payrollStatus = $("#payroll-status");
    setAttribute($payrollStatus, 'fa fa-lg fa-spinner fa-spin ml-4', 'Đang gửi bảng lương...');

    const successCallback = () => {
      setAttribute($payrollStatus,
                  'fa fa-lg fa-envelope ml-4 text-success',
                  "Đã gửi bảng lương cho giảng viên"
                );
    };

    const errorCallback = () => {
      setAttribute($payrollStatus,
                  'fa fa-lg fa-times-circle ml-4 text-danger',
                  "Gửi lỗi"
                );
    };

    this.props.sendPayroll(instructor.code,
                          this.props.summary.startDate,
                          this.props.summary.endDate,
                          errorCallback,
                          successCallback
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

  renderPayrollRow(payrollDetail, index) {

    var salary = this.moneyFormat(payrollDetail.salary);
    var totalSalary = this.moneyFormat(payrollDetail.totalSalary);
    var role = this.renderRole(payrollDetail.role);

    return (
      <tr key={index}>
        <th scope="row">{payrollDetail.className}</th>
        <td className="pl-5">{payrollDetail.totalClass}</td>
        <td>{role}</td>
        <td className="text-right">{salary} VND</td>
        <td className="text-right">{totalSalary} VND</td>
      </tr>
    )
  }

  renderInstructorPayroll(data) {
    var totalMonthSalary = this.moneyFormat(data.instructor.totalMonthSalary);
    return (
      <div>
        <div className="instructor-infos">
          <span className="font-weight-bold">Giảng viên: &nbsp;</span>
          <span>{data.instructor.name}</span>
          {this.renderPaidStatus(data.instructor.paidTime)}
          <button className="btn btn-success float-right"
            onClick={event => this.props.fetchInstructorSalary(this.props.summary.code)}
          >
            <i className="fa fa-pencil mr-3"></i>Điều chỉnh lương
          </button>
        </div>
        <div>
          <span className="font-weight-bold">Email: &nbsp;</span>
          <span>{data.instructor.email}</span>
        </div>
        <Table striped className="my-5">
          <thead>
            <tr>
              <th>Lớp</th>
              <th className="payroll-total-class">Số buổi</th>
              <th>Vai trò</th>
              <th className="text-right">Mức lương</th>
              <th className="text-right">Tổng lương giảng dạy</th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(data.payroll, (payrollDetail, index) => {
                return this.renderPayrollRow(payrollDetail, index)
              })
            }
          </tbody>
        </Table>
        <div className="text-right mb-5">
          <span className="font-weight-bold">Tổng lương trong tháng: &nbsp;</span>
          <span>{totalMonthSalary} VND</span>
          <div className="my-5">

            <span className="col"></span>
            <button className="btn btn-success float-right"
               onClick={event => this.handleSendPayroll(data.instructor)}
            >
               <i className="fa fa-paper-plane mr-3"></i>Gửi bảng lương
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderRecordTime(time) {
    var hour = moment(time).hour();
    var min = moment(time).minute();

    var end = 'AM';

    if (hour >= 12) {
      hour = hour - 12;
      end = 'PM';
    }

    var hourString = hour.toString();
    var minString = min.toString();

    if (min < 10) {
      minString = `0${min.toString()}`
    }

    return `${hourString}:${minString} ${end}`;
  }

  renderPayrollDetailRow(detail, index) {

    var role = this.renderRole(detail.role);
    var day = moment(detail.recordDate).format('DD/MM/YYYY');
    var time = this.renderRecordTime(detail.addedDate);

    return (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td>{detail.className}</td>
        <td>{role}</td>
        <td>{day}</td>
        <td>{time}</td>
        <td>
        <button
          className="delete-record fa fa-trash"
          title="Xóa lượt chấm công này"
          onClick={(event) => this.showConfirmDialog(detail)}
          disabled={this.deleted}
          >
        </button>
        </td>
      </tr>
    )
  }

  renderPayrollDetail(payrollDetails) {
    return (
      <div className="mb-5">
        <span className="font-weight-bold">Chi tiết chấm công trong tháng</span>
        <Table striped className="my-5">
          <thead>
            <tr>
              <th>#</th>
              <th>Lớp</th>
              <th>Vai trò</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(payrollDetails, (detail, index) => {
                return this.renderPayrollDetailRow(detail, index)
              })
            }
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    const { summary } = this.props;
    return (
      <div>
        <InstructorRecordNew />
        {this.renderInstructorPayroll(summary.data)}
        {this.renderPayrollDetail(summary.data.instructor.payrollDetails)}
        <button
          className="btn btn-success float-right mb-5"
          onClick={(event) => this.handleInstructorClick(summary.data.instructor)}
        >
          <i className="fa fa-plus mr-3"></i>Chấm công mới
        </button>
      </div>
    );
  }

}

function mapStateToProps({ summary }) {
  return { summary };
}

export default connect(mapStateToProps,
                        { sendPayroll,
                          fetchInstructorSalary,
                          showAddInstructorModal,
                          showConfirmDialog,
                          hideConfirmDialog,
                          removeInstructorRecord
                        })(InstructorPayroll);
