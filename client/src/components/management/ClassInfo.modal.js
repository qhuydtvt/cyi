import React, { Component } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import ClassInfoForm from './ClassInfo.form';

export default class ClassInfoNewModal extends Component {

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.onCancel}
      >
        <ModalHeader>
          {this.props.title}
        </ModalHeader>
        <ModalBody>
          <ClassInfoForm
              initialValues={this.props.initialValues}
              onCancel={this.props.onCancel}
              onSubmit={this.props.onSubmit}
          />
        </ModalBody>
      </Modal>
    );
  }
}
 