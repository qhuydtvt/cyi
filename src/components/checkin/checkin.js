import React, { Component } from 'react';

import InstructorList from './instructor-list';
import SearchBar from '../helpers/search-bar';
import User from '../helpers/user';
import FeedbackModal from '../helpers/feedback-modal';
import InstructorRecordNew from './instructor-record-new';


class CheckIn extends Component {

  render() {
    return (
      <div>
        <FeedbackModal />
        <InstructorRecordNew />
        <div className="container" id="check-in">
          <div className="row">
            <SearchBar />
            <User />
          </div>
        </div>
        <InstructorList />
      </div>
    );
  }
}

export default CheckIn;
