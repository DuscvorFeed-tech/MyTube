import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  injectIntl,
  intlShape,
  FormattedHTMLMessage,
  // FormattedMessage,
} from 'react-intl';
// components
import Button from 'components/Button';
import Modal from 'components/Modal';
// import LoadingIndicator from 'components/LoadingIndicator';
// import ErrorFormatted from 'components/ErrorFormatted';
import ModalToggler from 'components/Modal/ModalToggler';

import messages from '../messages';

export function BackFill({ intl, applyBackFill }) {
  return (
    <Modal id="backFill" dismissable size="md">
      <ModalToggler modalId="backFill" />
      <div>
        <div className="text-center my-4">
          <FormattedHTMLMessage id="M0000090" />
          {/* You are about to force stop <b>{campDetails.title}</b>
            <br />
            Do you want to proceed? */}
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button width="sm" secondary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.no })}
            </Button>
          </div>
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={applyBackFill}
            >
              {intl.formatMessage({ ...messages.yes })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

BackFill.propTypes = {
  applyBackFill: PropTypes.func,
  intl: intlShape.isRequired,
};

export default compose(
  memo,
  injectIntl,
)(BackFill);
