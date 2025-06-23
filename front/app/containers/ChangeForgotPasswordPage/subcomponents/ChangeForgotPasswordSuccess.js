import React, { memo } from 'react';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

// components
import PATH from 'containers/path';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { forwardTo } from 'helpers/forwardTo';
import messages from '../messages';

export function ChangeForgotPasswordSuccess({ intl }) {
  return (
    <Modal id="changeForgotPasswordSuccess" dismissable size="md">
      <ModalToggler modalId="changeForgotPasswordSuccess" />
      <div>
        <div className="text-center my-4">
          {intl.formatMessage({
            ...messages.changeForgotPasswordConfirmationMsg,
          })}
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                forwardTo(PATH.LOGIN);
              }}
            >
              {intl.formatMessage({ ...messages.okButton })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

ChangeForgotPasswordSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default compose(
  memo,
  injectIntl,
)(ChangeForgotPasswordSuccess);
