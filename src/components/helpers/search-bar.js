import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { searchInstructor,
          showSearchLoading,
          hideSearchLoading,
          fetchSummary
        } from '../../actions';

import Loading from './loading';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = _.debounce(this.handleSearch, 300);
    this.handleSearch.bind(this);
  }

  getUnicodeSearchName(keyword) {
    var searchName = keyword;
    searchName = searchName.toLowerCase();
    searchName = searchName.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    searchName = searchName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    searchName = searchName.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    searchName = searchName.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    searchName = searchName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    searchName = searchName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    searchName = searchName.replace(/đ/g,"d");
    searchName = searchName.replace(/!|@|\$|%|\^|\*|∣|\+|=|<|>|\?|\/|,|\.|:|'|"|&|#|\[|\]|~/g,"-");
    searchName = searchName.replace(/-+-/g,"-"); //thay thế 2- thành 1-
    searchName = searchName.replace(/^-+|-+$/g,"");//cắt bỏ ký tự - ở đầu và cuối chuỗi
    return searchName;
  }

  handleSearch(keyword) {
    var searchName = this.getUnicodeSearchName(keyword);
    this.props.showSearchLoading();
    const finishSearchCallback = () => {
      this.props.hideSearchLoading();
    }
    // for fetching summary
    var startDate = this.props.summary.startDate;
    var endDate = this.props.summary.endDate;

    if (startDate && endDate) {
      this.props.fetchSummary(startDate, endDate, searchName, finishSearchCallback);
      this.props.summary.name = searchName;
    } else {
      this.props.searchInstructor(searchName, finishSearchCallback);
    }
  }

  renderSearchIcon () {
    const searching = this.props.searchBar.searching;
      if (searching) {
      return  (
        <div id="search-loading" className="col-md-1 d-flex">
          <Loading type="spin"/>
        </div>
      );
    } else {
      return (
        <div id="search-loading" className="col-md-1 d-flex">
          <i className="fa fa-search align-self-center"></i>
        </div>
      );
    }
  }

  render() {
    return (
      <div id="search-bar" className="row col-md-7 ml-2">
        <input placeholder="Nhập tên giảng viên" type="text" className="col-md-11"
         onChange={event => this.handleSearch(event.target.value)}></input>
         {this.renderSearchIcon()}
     </div>
    )
  }
}

function mapStateToProps({ searchBar, summary }) {
  return { searchBar, summary };
}

export default connect(mapStateToProps, {
                                          searchInstructor,
                                          showSearchLoading,
                                          hideSearchLoading,
                                          fetchSummary }
                                        )(SearchBar);
