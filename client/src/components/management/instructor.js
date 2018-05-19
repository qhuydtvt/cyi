import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import SearchBar from '../common/SearchBar';

import _ from 'lodash';

import { fetchAllInstructor,
         fetchSummary,
         showAddNewInstructorModal,
         showConfirmDialog, hideConfirmDialog,
         removeInstructor,
         fetchCourses,
         manageCourse } from '../../actions';


import './instructor.css';

import User from '../helpers/user';
import InstructorNewModal from '../helpers/instructor-new-modal';

class Course extends Component {

  constructor(props) {
    super(props);
    this.showConfirmDialog = this.showConfirmDialog.bind(this);
    this.deleted = false;
  }

  showConfirmDialog(instructor) {
    const deletedCallback = () => {
      this.deleted = false;
    };

    if (!this.deleted) {
      const onYesClick = () => {
        this.deleted = true;
        this.props.hideConfirmDialog();
        this.props.removeInstructor(instructor, deletedCallback);
      };

      const onNoClick = () => {
        this.props.hideConfirmDialog();
      };
      this.props.showConfirmDialog("Xóa giảng viên",
                                   `Bạn có chắc muốn xóa thông tin giảng viên ${instructor.lastName} ${instructor.firstName} ?`,
                                   onYesClick, onNoClick);
    }
  }

  renderSingleInstructor(instructor, index) {
    return (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td>{instructor.lastName}</td>
        <td>{instructor.firstName}</td>
        <td>{instructor.code}</td>
        <td>{instructor.email}</td>
        <td><a href={instructor.image} target='_blank'>Xem</a></td>
        <td className="instructor-course">
          {
            _.map(instructor.courses, (course, index) => {
              return (
                <span className="course-tag" key={index}>{course.name}</span>
              );
            })
          }
        </td>
        <td>
          <i
            className='course-action text-success fas fa-pencil-alt fa-lg mx-3'
            title='Sửa thông tin'
            onClick = {event => this.props.showAddNewInstructorModal(instructor)}
          >
          </i>
          <i
            className='course-action text-danger fa fa-trash fa-lg mx-3'
            title='Xóa giảng viên'
            onClick={(event) => this.showConfirmDialog(instructor)}
            >
          </i>
        </td>
      </tr>
    )
  }

  renderInstructors(instructors) {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Code</th>
            <th>Email</th>
            <th>Ảnh</th>
            <th>Khóa học</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(instructors, (instructor, index) => {
              return this.renderSingleInstructor(instructor, index)
            })
          }
        </tbody>
      </Table>
    );
  }

  render() {
    const { summary } = this.props;

    var userRole = localStorage.getItem("role");

    const isManager = (userRole === 'manager');

    return (
      <div className="container my-3">
        <InstructorNewModal />
        <div className="row px-3">
          <button
            className="btn btn-secondary float-left btn__height--primary mt-1"
            onClick={event => this.props.fetchSummary(summary.startDate, summary.endDate, '')}
          >
            <i className="fa fa-file-text-o mr-3"></i>Lương tất cả giảng viên
          </button>
          {  
            <button disabled={!isManager} className='btn mx-3 btn__height--primary mt-1' onClick={event => this.props.fetchAllInstructor()}>
              <i className='fa fa-users mr-3'></i>Quản lý giảng viên
            </button>
          }
          {
            <button disabled={!isManager} className='btn btn-secondary btn__height--primary mt-1' onClick={event => this.props.manageCourse()}>
              <i className='fa fa-book mr-3'></i>Quản lý khóa học
            </button>
          }
          <User className="col-p" />
        </div>
        <hr/>
        {
          isManager ?
          (
            <div>
              <div className="my-4 container pl-0">
              <span className='h4 my-5'>Danh sách giảng viên</span>
              <button className='btn btn-success float-right' onClick={event => this.props.showAddNewInstructorModal()}>
                <i className='fa fa-user-plus mr-3'></i>Thêm mới giảng viên
              </button>
              </div>
              <SearchBar
                className="my-4 searchbar"
                placeholder="Nhập tên giảng viên"
                onChange={(value) => this.props.fetchAllInstructor(value)} />
              {this.renderInstructors(this.props.instructorManagement.instructorData)}
              <div className="my-3 container">
                <button className='btn btn-success float-right mt-3 mb-5' onClick={event => this.props.showAddNewInstructorModal()}>
                  <i className='fa fa-user-plus mr-3'></i>Thêm mới giảng viên
                </button>
              </div>
            </div>
          )
          :
          (
            <h3 className="text-danger">Chức năng chỉ dành cho quản lý!</h3>
          )
        }
      </div>
    );
  }
}

function mapStateToProps({ instructorManagement, summary }) {
  return { instructorManagement, summary };
}

export default connect(mapStateToProps, { fetchAllInstructor,
                                          fetchSummary,
                                          showAddNewInstructorModal,
                                          showConfirmDialog, hideConfirmDialog,
                                          removeInstructor, fetchCourses, manageCourse })(Course);
