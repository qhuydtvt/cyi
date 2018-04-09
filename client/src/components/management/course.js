import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import _ from 'lodash';

import { fetchAllInstructor,
        fetchCourse,
        fetchSummary,
        showAddNewCourseModal,
        showConfirmDialog,
        hideConfirmDialog,
        removeCourse,
        manageCourse
      } from '../../actions';

import User from '../helpers/user';
import CourseNewModal from '../helpers/course-new-modal';

class Course extends Component {

  constructor(props) {
    super(props);
    this.showConfirmDialog = this.showConfirmDialog.bind(this);
    this.deleted = false;
  }

  showConfirmDialog(course) {
    const deletedCallback = () => {
      this.deleted = false;
    };

    if (!this.deleted) {
      const onYesClick = () => {
        this.deleted = true;
        this.props.hideConfirmDialog();
        this.props.removeCourse(course, deletedCallback);
      };

      const onNoClick = () => {
        this.props.hideConfirmDialog();
      };
      this.props.showConfirmDialog("Xóa khóa học", "Bạn có chắc muốn xóa?", onYesClick, onNoClick);
    }
  }

  renderSingleCourse(course, index) {
    return (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td>{course.name}</td>
        <td>{course.description}</td>
        <td>
          <i
            className='course-action text-success fa fa-pencil fa-lg mx-3'
            title='Sửa thông tin'
            onClick = {event => this.props.showAddNewCourseModal(course)}
          >
          </i>
          <i
            className='course-action text-danger fa fa-trash fa-lg mx-3'
            title='Xóa khóa học'
            onClick={(event) => this.showConfirmDialog(course)}
            >
          </i>
        </td>
      </tr>
    )
  }

  renderCourses(courses) {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên khóa học</th>
            <th>Mô tả</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(courses, (course, index) => {
              return this.renderSingleCourse(course, index)
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
        <CourseNewModal />
        <div className="row px-3">
          <button
            className="btn btn-secondary float-left btn__height--primary mt-1"
            onClick={event => this.props.fetchSummary(summary.startDate, summary.endDate, '')}
          >
            <i className="fa fa-file-text-o mr-3"></i>Lương tất cả giảng viên
          </button>
          <button className='btn btn-secondary mx-3 btn__height--primary mt-1' onClick={event => this.props.fetchAllInstructor()}>
            <i className='fa fa-users mr-3'></i>Quản lý giảng viên
          </button>
          <button className='btn btn__height--primary mt-1' onClick={event => this.props.manageCourse()}>
            <i className='fa fa-book mr-3'></i>Quản lý khóa học
          </button>
          <User />
        </div>
        <hr/>
        
        <div className="my-5">
          <span className='h4 my-5'>Danh sách khóa học</span>
          <button className='btn btn-success float-right'
                  onClick={event => this.props.showAddNewCourseModal()}>
              <i className='fa fa-plus mr-3'></i>Thêm mới khóa học
          </button>
        </div>
        {this.renderCourses(summary.courseData.courses)}
        <div className="my-3">
          <button className='btn btn-success float-right mt-3 mb-5'
                  onClick={event => this.props.showAddNewCourseModal()}>
              <i className='fa fa-plus mr-3'></i>Thêm mới khóa học
          </button>
        </div>
      </div>
    );
  }

}

function mapStateToProps({ summary }) {
  return { summary };
}

export default connect(mapStateToProps, { fetchAllInstructor,
                                          fetchCourse,
                                          fetchSummary,
                                          showAddNewCourseModal,
                                          showConfirmDialog,
                                          hideConfirmDialog,
                                          removeCourse,
                                          manageCourse
                                         })(Course);
