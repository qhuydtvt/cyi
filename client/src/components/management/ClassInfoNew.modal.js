import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import ClassInfoForm from './ClassInfo.form';

export default class ClassInfoNewModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.onCancel}
      >
        <ModalHeader>
          Thêm chi tiết khóa
        </ModalHeader>
        <ModalBody>
          <ClassInfoForm
              onCancel={this.props.onCancel}
              onSubmit={this.props.onSubmit}
          />
        </ModalBody>
      </Modal>
    );
  }
}
 