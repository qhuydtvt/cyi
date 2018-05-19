import React, { Component } from 'react';
import { Input } from 'reactstrap';
import _ from 'lodash';

import './SearchBar.css';

export default function(props) {
  const localClassName = props.className ? props.className : "w-300p";
  const debounceTime = props.debounceTime ? props.debounceTime : 100;
  const handleChange = _.debounce(props.onChange ? props.onChange : (value) => console.log(value), debounceTime);
  const handleBlur = props.onBlur;
  return (
    <div className={localClassName}>
      <Input
        placeholder={props.placeholder}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur} />
    </div>
  );
}
