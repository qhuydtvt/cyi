import React, { Component } from 'react';

import InstructorList from './instructor_list';
import SearchBar from './search_bar';
import User from './user';
import InstructorRecordNew from './instructor_record_new';

class CheckIn extends Component {

  render() {
    return (
      <div>
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
