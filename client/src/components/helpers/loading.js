import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';

class Loading extends Component {
  render () {
    return (
      <div>
        <ReactLoading type={this.props.type} color="#444"/>
      </div>
    );
  }
}

function mapStateToProps() {
  return { };
}

export default connect(mapStateToProps)(Loading);
