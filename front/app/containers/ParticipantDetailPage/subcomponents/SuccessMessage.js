import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
// import { modalToggler } from 'utils/commonHelper';

import messages from '../messages';

export function SuccessMessage({
  value,
  participantDetailPage: { participantStatus },
  routeParams: { entryId, campaignId },
  onGetPartDetails,
  onResetData,
  intl,
  userAccount,
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
                onResetData();
                onGetPartDetails(entryId, campaignId, userAccount.primary.id);
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
  value: PropTypes.number,
  participantDetailPage: PropTypes.any,
  routeParams: PropTypes.any,
  onGetPartDetails: PropTypes.any,
  onResetData: PropTypes.any,
  intl: PropTypes.any,
  userAccount: PropTypes.any,
};

export default compose(memo)(SuccessMessage);
