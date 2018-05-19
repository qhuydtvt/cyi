import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import _ from 'lodash';

import CourseGeneralForm from './CourseGeneral.form';
import ClassInfoNewModal from './ClassInfoNew.modal';
import { fetchCourse, addOrEditClassInfo } from '../../networks';

import './CourseDetail.css';
 
class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmitClassInfo = this.onSubmitClassInfo.bind(this);
  }

  componentWillMount() {
    const courseId = this.props.match.params.id;
    fetchCourse(courseId).then((course) => {
      this.setState({
        course: {
          ...course,
          classes: _.mapKeys(course.classes, "classNo")
        }
      });
    });
  }

  render() {
    const course = this.state.course;
    
    if(!course) return <div className="panel">Loading</div>;

    return (
      <div className="p-3 d-flex">
        <CourseGeneralForm
          className="panel general"
          initialValues={course} />
        { this.renderClassList(course.classes) }
      </div>
    );
  }

  renderClassList(classInfoDict) {
    const classInfoRangeList = this.fillGapsBetweenClasses(classInfoDict);

    return (
      <div className="panel p-4 class-list">
        <div className="d-flex justify-content-end">
          <Button
            onClick={this.openModal}
            className="mb-3"
            color="success"
          >
              Thêm thông tin khóa học
          </Button>
        </div>
        <ClassInfoNewModal
          isOpen={this.state.modalIsOpen}
          onCancel={this.closeModal} 
          onSubmit={this.onSubmitClassInfo}
        />
        <Table >
          <thead>
            <tr>
              <th>#</th>
              <th>Tổng số buổi</th>
            </tr>
          </thead>
          <tbody>
            {
              classInfoRangeList.map((classInfo, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {this.renderClassRange(classInfo.startClassNo, classInfo.endClassNo)}
                    </td>
                    <td>{classInfo.maxSession}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>  
      </div>
    );
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  onSubmitClassInfo(classInfo) {
    addOrEditClassInfo({
      ...classInfo,
      course: this.state.course._id
    })
    .then((classInfo) => {
      this.setState({
        course: {
          classes: {
            ...this.state.course.classes,
            [classInfo.classNo]: classInfo
          }
        }
      });
    });
    
    this.closeModal();
  }

  renderClassRange(startClassNo, endClassNo) {
    if (startClassNo == endClassNo - 1 || startClassNo == endClassNo) {
      return (<span>
        Lớp <b>{startClassNo}</b>
      </span>);
    }
    else if(endClassNo == -1) {
      return (
        <span>
          Từ lớp <b>{startClassNo}</b> trở đi
        </span>
      );
    }
    else {
      return (
        <span>
          Từ lớp <b>{startClassNo}</b> cho đến trước lớp <b>{endClassNo}</b>
        </span>
      );
    }
  }

  fillGapsBetweenClasses(classInfoDict) {

    if(_.isEmpty(classInfoDict)) return [];

    const classInfoList = _.values(classInfoDict);
  
    const sorted = _.sortBy(classInfoList, "classNo");
    if(sorted[0].classNo != 1) {
      sorted.unshift({
        classNo: 1,
        maxSession: sorted[0].maxSession
      });
    }
    
    const sumUpList = [];
    for(var classIndex = 0; classIndex < sorted.length - 1; classIndex++) {
      const classInfo = sorted[classIndex];
      const nextClassInfo = sorted[classIndex + 1];
      sumUpList.push({
        startClassNo: classInfo.classNo,
        endClassNo: nextClassInfo.classNo,
        maxSession: classInfo.maxSession
      });
    }
    const lastClassInfo = sorted[sorted.length - 1];
    sumUpList.push({
      startClassNo: lastClassInfo.classNo,
      endClassNo: -1,
      maxSession: lastClassInfo.maxSession
    });
    return sumUpList;
  }
}
 
export default CourseDetail;