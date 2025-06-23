import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// components
import Button from 'components/Button';
import Input from 'components/Input';
import ErrorFormatted from 'components/ErrorFormatted';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import messages from '../messages';

export function LoseFlow({
  intl,
  ids,
  campaignId,
  onCancelWinner,
  cancelledWinner,
  onGenerateWinner,
  showFlow,
  onSetData,
  onResetData,
  onGetCampDetails,
  setState,
  winner,
  invalid,
  errors,
  snsId,
  onCancelResetList,
  setEffectClear,
}) {
  const resetFlow = () => {
    onResetData();
    onGetCampDetails(campaignId, snsId);
    onCancelResetList();
    onSetData('tab', 4);
    onSetData('ids', []);
    setState(prev => ({
      ...prev,
      checkedList: [],
    }));
    onSetData('showFlow', 1);
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
                  onCancelWinner(ids.map(itm => itm.id), campaignId);
                  onGetCampDetails(campaignId, snsId);
                  setEffectClear(new Date().getTime());
                  onSetData('showFlow', 2);
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
              <Button
                width="sm"
                primary
                small
                onClick={() => onSetData('showFlow', 3)}
              >
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
              {intl.formatMessage({ ...messages.noOfWinnersGenerate })}
            </div>
            <div className="col-6 label">
              <Input type="number" name="count" className="py-2" {...winner} />
              <ErrorFormatted {...winner.error} />
              {errors && <ErrorFormatted invalid list={[errors]} />}
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
                disabled={invalid}
                dataDismiss="modal"
                onClick={() => {
                  onSetData('generateMessage', false);
                  onGenerateWinner(campaignId, Number(winner.value), snsId);
                }}
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
  intl: intlShape.isRequired,
  campaignId: PropTypes.number,
  ids: PropTypes.array,
  onCancelWinner: PropTypes.any,
  onGenerateWinner: PropTypes.any,
  cancelledWinner: PropTypes.number,
  showFlow: PropTypes.number,
  onResetData: PropTypes.any,
  onSetData: PropTypes.any,
  onGetCampDetails: PropTypes.any,
  setState: PropTypes.func,
  winner: PropTypes.any,
  invalid: PropTypes.any,
  errors: PropTypes.any,
  snsId: PropTypes.any,
  onCancelResetList: PropTypes.func,
  setEffectClear: PropTypes.func,
};

export default compose(
  memo,
  injectIntl,
)(LoseFlow);
