import React, { memo } from 'react';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { forwardTo } from 'helpers/forwardTo';
import messages from '../messages';

export function UploadVideoSuccess({ intl }) {
  return (
    <Modal id="videoUploadSuccess" dismissable size="md">
      <ModalToggler modalId="videoUploadSuccess" />
      <div>
        <div className="text-center my-4">
          {intl.formatMessage({ ...messages.uploadVideoMsg })}
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                forwardTo('/mypage');
              }}
            >
              {intl.formatMessage({ ...messages.done })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

UploadVideoSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default compose(
  memo,
  injectIntl,
)(UploadVideoSuccess);
