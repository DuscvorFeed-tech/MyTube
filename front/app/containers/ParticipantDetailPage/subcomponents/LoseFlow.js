import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// components
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import messages from '../messages';

export function LoseFlow({
  routeParams: { entryId, campaignId },
  onCancelWinner,
  participantDetailPage: { cancelledWinner },
  onGenerateWinner,
  onGetPartDetails,
  onResetData,
  intl,
  userAccount,
}) {
  const [showFlow, setShowFlow] = useState(1);
  const [generatedValue, getGeneratedValue] = useState();

  const resetFlow = () => {
    onResetData();
    onGetPartDetails(entryId, campaignId, userAccount.primary.id);
    setShowFlow(1);
  };

  const setGeneratedValue = e => {
    const x = e.target.value;
    getGeneratedValue(Number(x));
  };

  return (
    <Modal id="loseFlow" dismissable size="md">
      <ModalToggler modalId="loseFlow" />
      {showFlow === 1 && (
        <div>
          <div className="text-center my-4">
            {intl.formatMessage({ ...messages.M0000011 })}
          </div>
          <div className="row justify-content-center mt-5 mb-3 px-5">
            <div className="col-auto">
              <Button
                width="sm"
                secondary
                small
                dataDismiss="modal"
                onClick={resetFlow}
              >
                {intl.formatMessage({ ...messages.no })}
              </Button>
            </div>
            <div className="col-auto">
              <Button
                width="sm"
                primary
                small
                onClick={() => {
                  setShowFlow(2);
                  onCancelWinner(entryId, campaignId, userAccount.primary.id);
                }}
              >
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 2 && (
        <div>
          <div className="text-center my-4">
            {intl.formatMessage({ ...messages.M0000012 })}
          </div>
          <div className="row justify-content-center mt-5 mb-3 px-5">
            <div className="col-auto">
              <Button
                width="sm"
                secondary
                small
                dataDismiss="modal"
                onClick={resetFlow}
              >
                {intl.formatMessage({ ...messages.no })}
              </Button>
            </div>
            <div className="col-auto">
              <Button width="sm" primary small onClick={() => setShowFlow(3)}>
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 3 && (
        <div>
          <div className="font-weight-bold text-center my-4">
            {intl.formatMessage({ ...messages.generateWinner })}
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-4 content">
              {intl.formatMessage(
                { id: 'T0000011' },
                { name: intl.formatMessage({ ...messages.cancelledWinners }) },
              )}
            </div>
            <div className="col-6 label">{cancelledWinner}</div>
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-4 content">
              {intl.formatMessage(
                { id: 'T0000011' },
                {
                  name: intl.formatMessage({ ...messages.noOfWinnersGenerate }),
                },
              )}
            </div>
            <div className="col-6 label">
              <Input
                type="number"
                name="count"
                className="py-2"
                onChange={e => setGeneratedValue(e)}
                value={generatedValue}
              />
            </div>
          </div>
          <div className="row justify-content-center mt-5 mb-3 px-5">
            <div className="col-auto">
              <Button
                width="sm"
                secondary
                small
                dataDismiss="modal"
                onClick={resetFlow}
              >
                {intl.formatMessage({ ...messages.no })}
              </Button>
            </div>
            <div className="col-auto">
              <Button
                width="sm"
                primary
                small
                dataDismiss="modal"
                onClick={() =>
                  onGenerateWinner(
                    campaignId,
                    Number(generatedValue),
                    userAccount.primary.id,
                  )
                }
              >
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

LoseFlow.propTypes = {
  routeParams: PropTypes.any,
  onCancelWinner: PropTypes.any,
  onGenerateWinner: PropTypes.any,
  onGetPartDetails: PropTypes.any,
  onResetData: PropTypes.any,
  participantDetailPage: PropTypes.any,
  intl: PropTypes.any,
  userAccount: PropTypes.any,
};

export default compose(memo)(LoseFlow);
