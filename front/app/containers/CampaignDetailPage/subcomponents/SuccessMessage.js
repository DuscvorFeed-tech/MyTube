/* eslint-disable no-unused-expressions */
import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
// import { modalToggler } from 'utils/commonHelper';

import { isFunction } from 'lodash';
import messages from '../messages';

export function SuccessMessage({
  intl,
  value,
  participantStatus,
  generateMessage,
  forceStopMessage,
  campDetails,
  onSetData,
  backfillMessage,
  onClickOkSuccess,
}) {
  return (
    <Modal id="successClaim" dismissable size="md">
      <ModalToggler modalId="successClaim" />
      <div>
        {value === 1 && (
          <div className="text-center my-4">
            {intl.formatMessage(
              { id: 'M0000013' },
              { status: intl.formatMessage({ ...messages.messageSent }) },
            )}
          </div>
        )}
        {value === 2 && (
          <div className="text-center my-4">
            {intl.formatMessage(
              { id: 'M0000013' },
              { status: intl.formatMessage({ ...messages.changeCStatus }) },
            )}
          </div>
        )}
        {value === 3 && (
          <div>
            {participantStatus === 1 && (
              <div className="text-center my-4">
                {intl.formatMessage(
                  { id: 'M0000013' },
                  { status: intl.formatMessage({ ...messages.changePStatus }) },
                )}
              </div>
            )}
            {participantStatus === 2 && (
              <div className="text-center my-4">
                {intl.formatMessage(
                  { id: 'M0000003' },
                  {
                    name: intl.formatMessage({ ...messages.newWinner }),
                    status: intl.formatMessage({ ...messages.generated }),
                  },
                )}
              </div>
            )}
          </div>
        )}
        {value === 6 && (
          <div className="text-center my-4">
            {intl.formatMessage(
              { id: 'M0000013' },
              { status: intl.formatMessage({ ...messages.uploadedCSVFile }) },
            )}
          </div>
        )}
        {generateMessage && (
          <div className="text-center my-4">
            {intl.formatMessage(
              { id: 'M0000003' },
              {
                name: intl.formatMessage({ ...messages.newWinner }),
                status: intl.formatMessage({ ...messages.generated }),
              },
            )}
          </div>
        )}
        {forceStopMessage && (
          <div className="text-center my-4">
            {/* {campDetails && campDetails.title} was successfully forced stop. */}
            {intl.formatMessage(
              { id: 'M0000077' },
              { name: campDetails && campDetails.title },
            )}
          </div>
        )}
        {backfillMessage && (
          <div className="text-center my-4">
            {/* {campDetails && campDetails.title} was successfully forced stop. */}
            {intl.formatMessage({ id: 'M0000087' })}
          </div>
        )}
        {/* <div className="text-center my-4">
          Changed Claim Status Successfully
        </div> */}
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                onSetData('selectedValue', 0);
                onSetData('participantStatus', 0);
                onSetData('showFlow', 1);
                isFunction(onClickOkSuccess) && onClickOkSuccess();
              }}
            >
              {intl.formatMessage({ ...messages.ok })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

SuccessMessage.propTypes = {
  intl: intlShape.isRequired,
  value: PropTypes.number,
  participantStatus: PropTypes.number,
  generateMessage: PropTypes.bool,
  forceStopMessage: PropTypes.bool,
  campDetails: PropTypes.any,
  onSetData: PropTypes.any,
  backfillMessage: PropTypes.any,
  onClickOkSuccess: PropTypes.func,
};

export default compose(
  memo,
  injectIntl,
)(SuccessMessage);
