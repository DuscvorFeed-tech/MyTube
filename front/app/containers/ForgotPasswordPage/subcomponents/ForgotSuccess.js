import React, { memo } from 'react';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { forwardTo } from 'helpers/forwardTo';
import messages from '../messages';

export function ForgotSuccess({ intl }) {
  return (
    <Modal id="ForgotSuccess" dismissable size="md">
      <ModalToggler modalId="ForgotSuccess" />
      <div>
        <div className="text-center my-4">
          {intl.formatMessage({ ...messages.completionMessage })}
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                forwardTo('login');
              }}
            >
              {intl.formatMessage({ ...messages.btn_ok })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

ForgotSuccess.propTypes = {
  intl: intlShape.isRequired,
};

export default compose(
  memo,
  injectIntl,
)(ForgotSuccess);
