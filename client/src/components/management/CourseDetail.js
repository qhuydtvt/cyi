import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, Button } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import _ from 'lodash';

import CourseGeneralForm from './CourseGeneral.form';
import ClassInfoModal from './ClassInfo.modal';

import { fetchCourse, addOrEditClassInfo, editCourse, deleteClassInfo } from '../../networks';

import { showConfirmDialog, hideConfirmDialog } from '../../actions';

import './CourseDetail.css';
 
class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      modalIsOpen: false,
      activeTab: "1"
    };
    this.showAddModal = this.showAddModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmitClassInfo = this.onSubmitClassInfo.bind(this);

    this.showDeleteClassDialog = this.showDeleteClassDialog.bind(this);
    
    this.toggleTab = this.toggleTab.bind(this);
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

  onCourseGeneralSubmit(course) {
    editCourse(course).then((courseUpdated) => {
      // TODO: Notify user here
    });
  }

  render() {
    const course = this.state.course;
    
    if(!course) return <div className="panel">Loading</div>;

    return (
      <div className="p-3 d-flex">
        <CourseGeneralForm
          className="panel w-50"
          initialValues={course}
          onSubmit={this.onCourseGeneralSubmit.bind(this)}
        />
        {this.renderClassListInTabs(course.classes)}
      </div>
    );
  }

  toggleTab (tab) {
    this.setState({
      activeTab: tab
    });
  }

  renderClassListInTabs(classInfoDict) {
    return (
      <div className="w-50">
        {this.renderNewClassBtn()}
        <Nav tabs>
          <NavItem>
            <NavLink 
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggleTab('1'); }}>
              Các mốc
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggleTab('2'); }}>
              Thực chạy
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            {this.renderClassListInDetail(classInfoDict)}
          </TabPane>
          <TabPane tabId="2">
            {this.renderClassListInRange(classInfoDict)}
          </TabPane>
        </TabContent>
      </div>
    )
  }

  renderNewClassBtn() {
    return (
      <div>
        <div className="d-flex justify-content-end">
          <Button
            onClick={this.showAddModal}
            className="mb-3"
            color="success"
          >
              Thêm thông tin khóa học
          </Button>
        </div>
        <ClassInfoModal
          isOpen={this.state.modalIsOpen}
          initialValues={this.state.modalInitialValues}
          title={this.state.modalTitle}
          onCancel={this.closeModal} 
          onSubmit={this.onSubmitClassInfo}
        />
      </div>
    )
  }

  showAddModal() {
    this.setState({
      modalIsOpen: true,
      modalInitialValues: {
        classNo: "",
        maxSession: ""
      },
      modalTitle: "Thêm chi tiết lớp",
    });
  }

  showEditModal(classInfo) {
    this.setState({
      modalIsOpen: true,
      modalInitialValues: classInfo,
      modalTitle: "Sửa chi tiết lớp",
    });
  }


  showDeleteClassDialog(classInfo) {
    const onYesClick = () => {
      this.props.hideConfirmDialog();

      deleteClassInfo(classInfo._id).then((deletedClass) => {

        this.setState({
          course: {
            ...this.state.course,
            classes: _.omit(this.state.course.classes, deletedClass.classNo)
          }
        });
      });
    };

    const onNoClick = () => {
      this.props.hideConfirmDialog();
    };

    this.props.showConfirmDialog(`Xóa lớp học ${classInfo.classNo}`, "Bạn có chắc muốn xóa?", onYesClick, onNoClick);
  }

  renderClassListInDetail(classInfoDict) {
    
    return (
      <div className="panel p-4 class-list ml-0">
        <Table>
          <thead>
            <tr>
              <th>Lớp số</th>
              <th>Số buổi học</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(classInfoDict, (classInfo, id) => {
                return (
                  <tr key={id}>
                    <td>
                      {classInfo.classNo}
                    </td>
                    <td>{classInfo.maxSession}</td>
                    <td>
                      <i
                        className='text-success fas fa-pencil-alt fa-lg mx-3'
                        title='Sửa thông tin'
                        onClick={() => this.showEditModal(classInfo)}
                      />
                      <i
                        className='text-danger fa fa-trash fa-lg mx-3'
                        title='Xóa lớp'
                        onClick={(event) => this.showDeleteClassDialog(classInfo)}
                      >
                      </i>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      </div>
    );
  }

  renderClassListInRange(classInfoDict) {
    const classInfoRangeList = this.fillGapsBetweenClasses(classInfoDict);
    return (
      <div className="panel p-4 class-list ml-0">
        <Table >
          <thead>
            <tr>
              <th>#</th>
              <th>Số buổi học</th>
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
    if (startClassNo === endClassNo - 1 || startClassNo === endClassNo) {
      return (<span>
        Lớp <b>{startClassNo}</b>
      </span>);
    }
    else if(endClassNo === -1) {
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
    if(sorted[0].classNo !== 1) {
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
 
function mapStateToProps({ ConfirmDialogReducer }) {
  return { ConfirmDialogReducer };
}

export default connect(mapStateToProps, { showConfirmDialog, hideConfirmDialog })(CourseDetail);