import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { showConfirmDialog, hideConfirmDialog } from '../../actions';

class ConfirmDialog extends Component {

  toggle() {
    this.props.hideConfirmDialog();
  }

  render() {
    const confirmDialogReducer = this.props.confirmDialog;
    return (
      <div>
        <Modal isOpen={confirmDialogReducer.isOpen} toggle={this.toggle.bind(this)}>
          <ModalHeader>{confirmDialogReducer.title}</ModalHeader>
          <ModalBody>
            {confirmDialogReducer.body}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={confirmDialogReducer.onNoClick}>Không</Button>
            <Button color="danger" onClick={confirmDialogReducer.onYesClick}>Có</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ confirmDialog }) {
  return { confirmDialog };
}

export default connect(mapStateToProps, { showConfirmDialog, hideConfirmDialog })(ConfirmDialog);
