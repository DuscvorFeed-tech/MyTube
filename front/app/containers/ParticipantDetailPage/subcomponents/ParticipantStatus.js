import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

// components
import Select from 'components/Select';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { modalToggler } from 'utils/commonHelper';

import messages from '../messages';

export function ParticipantStatus({
  participantStatus,
  setParticipantStatus,
  campaignId,
  partDetails,
  onSelectWinner,
  intl,
  snsAccountId,
}) {
  return (
    <Modal id="modalTemplatePreview" dismissable size="md">
      <ModalToggler modalId="modalTemplatePreview" />
      <form>
        <div className="font-weight-bold text-center my-4">
          {intl.formatMessage(
            { id: 'T0000017' },
            { name: intl.formatMessage({ ...messages.participantStatus }) },
          )}
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <div className="col-4 content">
            {intl.formatMessage({ ...messages.participantStatus })}
          </div>
          <div className="col-6 label">
            <Select
              borderRadius
              onChange={e => setParticipantStatus(e)}
              value={participantStatus}
            >
              <option value="0">
                {intl.formatMessage(
                  { id: 'M0000008' },
                  { name: intl.formatMessage({ ...messages.status }) },
                )}
              </option>
              {Number(partDetails.entry_status) !== 1 && (
                <option value="1">
                  {intl.formatMessage({ ...messages.win })}
                </option>
              )}
              {Number(partDetails.entry_status) === 1 && (
                <option value="2">
                  {intl.formatMessage({ ...messages.cancelled })}
                </option>
              )}
            </Select>
          </div>
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button width="sm" secondary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.cancel })}
            </Button>
          </div>
          <div className="col-auto ml-auto">
            {participantStatus === 1 && partDetails ? (
              <Button
                width="sm"
                primary
                small
                disabled={Number(participantStatus) === 0}
                dataDismiss="modal"
                onClick={() =>
                  onSelectWinner(partDetails.id, campaignId, snsAccountId)
                }
              >
                {intl.formatMessage({ ...messages.proceed })}
              </Button>
            ) : (
              <Button
                width="sm"
                primary
                small
                disabled={Number(participantStatus) === 0}
                dataDismiss="modal"
                onClick={() => modalToggler('loseFlow')}
              >
                {intl.formatMessage({ ...messages.proceed })}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

ParticipantStatus.propTypes = {
  participantStatus: PropTypes.number,
  setParticipantStatus: PropTypes.func,
  campaignId: PropTypes.any,
  partDetails: PropTypes.any,
  onSelectWinner: PropTypes.any,
  intl: PropTypes.any,
  snsAccountId: PropTypes.any,
};

export default compose(memo)(ParticipantStatus);
