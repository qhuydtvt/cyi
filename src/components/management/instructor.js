import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import _ from 'lodash';

import { fetchAllInstructor,
         fetchSummary,
         showAddNewInstructorModal,
         showConfirmDialog, hideConfirmDialog,
         removeInstructor } from '../../actions';

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
                                   `Bạn có chắc muốn xóa thông tin giảng viên ${instructor.name} ?`,
                                   onYesClick, onNoClick);
    }
  }

  renderSingleInstructor(instructor, index) {
    return (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td>{instructor.name}</td>
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
            className='course-action text-success fa fa-pencil fa-lg mx-3'
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
            <th>Họ tên</th>
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
    return (
      <div className="container my-3">
        <InstructorNewModal />
        <div className="row container">
          <div className="row col-md-7 ml-1">
            <button
              className="btn btn-primary float-left mt-1"
              style={{height: 38 + 'px'}}
              onClick={event => this.props.fetchSummary(summary.startDate, summary.endDate, '')}
            >
              <i className="fa fa-arrow-left mr-3"></i>Danh sách lương
            </button>
          </div>
          <User />
        </div>
        <div className="my-5 container">
          <span className='h4 my-5'>Danh sách giảng viên</span>
          <button className='btn btn-success float-right'
                  onClick={event => this.props.showAddNewInstructorModal()}>
              <i className='fa fa-plus mr-3'></i>Thêm mới giảng viên
          </button>
        </div>
        {this.renderInstructors(this.props.instructorManagement.instructorData)}
        <div className="my-3 container">
          <button className='btn btn-success float-right mt-3 mb-5'
                  onClick={event => this.props.showAddNewInstructorModal()}>
              <i className='fa fa-plus mr-3'></i>Thêm mới giảng viên
          </button>
        </div>
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
                                          removeInstructor })(Course);
