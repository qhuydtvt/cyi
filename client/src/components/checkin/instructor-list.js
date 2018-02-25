import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchInstructor,
  showAddInstructorModal,
  showInstructorRecord,
  hideInstructorRecord,
  showConfirmDialog,
  hideConfirmDialog,
  removeInstructorRecord
} from '../../actions';

import _ from 'lodash';
import moment from 'moment';

class InstructorList extends Component {

  constructor(props) {
    super(props);
    this.handleInstructorClick = this.handleInstructorClick.bind(this);
    this.showRecord = this.showRecord.bind(this);
    this.hideRecord = this.hideRecord.bind(this);
    this.showConfirmDialog = this.showConfirmDialog.bind(this);
    this.deleted = false;
  }

  componentDidMount() {
    this.props.fetchInstructor();
  }

  handleInstructorClick(instructor) {
    this.props.showAddInstructorModal(instructor);
  }

  showRecord(instructor) {
    this.props.showInstructorRecord(instructor);
  }

  hideRecord(instructor) {
    this.props.hideInstructorRecord(instructor);
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

  renderRoleName(role) {
    if (role === 'instructor') {
      return 'Giảng viên'
    } else {
      return 'Trợ giảng'
    }
  }

  renderDate(time) {
    var date = moment(time).get('date');
    var month = moment(time).get('month') + 1;

    return date + "/" + month;
  }

  renderTodayRecords(instructor) {
    const todayRecords = instructor.todayRecords;
    if (!todayRecords) {
      return <div>Đang tải...</div>;
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Lớp</th>
            <th>Vai trò</th>
            <th>Ngày</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {
              _.map(todayRecords, (todayRecord, index) => {
                return (
                  <tr key={index}>
                    <td>{todayRecord.className}</td>
                    <td>{this.renderRoleName(todayRecord.role)}</td>
                    <td>{this.renderDate(todayRecord.recordDate)}</td>
                    <td>
                      <button
                        className="delete-record fa fa-trash"
                        title="Xóa lượt chấm công này"
                        onClick={(event) => this.showConfirmDialog(todayRecord)}
                        disabled={this.deleted}
                        >
                      </button>
                    </td>
                  </tr>
                );
              })
            }
        </tbody>
      </table>
    )
  }

  renderAddRecordButton(instructor) {
    return (
      <b className="btn btn-primary"
         onClick={(event) => this.handleInstructorClick(instructor)}
      >
         Chấm công
      </b>
    );
  }

  renderInstructor(instructor) {
    const recordOpen = instructor.recordOpen;
    if(!recordOpen) {
      return (
        <div key={instructor._id} className="instructor col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <div className="card">
            <img className="card-img-top" src={instructor.image} alt="Card cap"/>
            <div className="card-block">
              <h4 className="card-title">{instructor.name}</h4>
              <div className="d-flex justify-between-content bottom">
                {this.renderAddRecordButton(instructor)}
                <a
                  className="col card-link text-right btn text-success"
                  onClick={(event) => this.showRecord(instructor)}
                  >
                    Chi tiết
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
          <div key={instructor._id} className="col-xl-4 col-lg-4 col-md-4 instructor">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">{instructor.name}</h4>
                {this.renderTodayRecords(instructor)}
                <div className="d-flex justify-between-content text-right bottom">
                  {this.renderAddRecordButton(instructor)}
                  <a className="col card-link text-right btn text-success" onClick={(event) => {this.hideRecord(instructor)}}>Quay lại</a>
                </div>
              </div>
            </div>
          </div>
      )
    }
  }

  render() {
    const instructorList = this.props.instructorList;
    if (!instructorList) {
      return <div className="container text-center h5 mt-5">Đang tải thông tin giảng viên....</div>
    } else if (_.isEmpty(instructorList)) {
      return <div className="container text-center h5 mt-5">Không tìm thấy giảng viên</div>
    }

    return  (
      <div>
        <div className="container">
        {
          _.map(instructorList, (instructor) => {
            return this.renderInstructor(instructor)
          })
        }
        </div>
      </div>
    );
  }
}

function mapStateToProps({ instructorList }) {
  return { instructorList };
}

export default connect(mapStateToProps,
  {
    fetchInstructor,
    showAddInstructorModal,
    showInstructorRecord,
    hideInstructorRecord,
    showConfirmDialog,
    hideConfirmDialog,
    removeInstructorRecord
  })(InstructorList);
