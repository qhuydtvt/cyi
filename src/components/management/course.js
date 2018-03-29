import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import _ from 'lodash';

import { fetchCourse,
        fetchSummary,
        showAddNewCourseModal,
        showConfirmDialog,
        hideConfirmDialog,
        removeCourse
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
        <div className="row">
          <div className="row col-md-7 ml-1">
            <button
              className="btn btn-primary float-left mt-1"
              style={{height: 38 + 'px'}}
              onClick={event => this.props.fetchSummary(this.props.summary.startDate,
                                  this.props.summary.endDate, '')}
            >
              <i className="fa fa-arrow-left mr-3"></i>Danh sách lương
            </button>
          </div>
          <User />
        </div>
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

export default connect(mapStateToProps, { fetchCourse,
                                          fetchSummary,
                                          showAddNewCourseModal,
                                          showConfirmDialog,
                                          hideConfirmDialog,
                                          removeCourse
                                         })(Course);
