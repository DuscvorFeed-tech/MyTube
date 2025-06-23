import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// components
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import ErrorFormatted from 'components/ErrorFormatted';

import messages from '../messages';

export function GenerateNewWinner({
  intl,
  campaignId,
  cancelledWinner,
  onGenerateWinner,
  onSetData,
  errors,
  winner,
  invalid,
  snsId,
}) {
  return (
    <Modal id="modalGenerateNewWinner" dismissable size="md">
      <ModalToggler modalId="modalGenerateNewWinner" />
      <form>
        <div className="font-weight-bold text-center my-4">
          {intl.formatMessage({ ...messages.generateWinner })}
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <div className="col-5 content">
            {intl.formatMessage(
              { id: 'T0000011' },
              { name: intl.formatMessage({ ...messages.cancelledWinners }) },
            )}
          </div>
          <div className="col-2 label">{cancelledWinner}</div>
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <div className="col-5 content">
            {intl.formatMessage({ ...messages.noOfWinnersGenerate })}
          </div>
          <div className="col-2 label">
            <Input type="number" name="count" className="py-2" {...winner} />
            <ErrorFormatted {...winner.error} />
            {errors && <ErrorFormatted invalid list={[errors]} />}
          </div>
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button width="sm" secondary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.cancel })}
            </Button>
          </div>
          <div className="col-auto ml-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              disabled={invalid}
              onClick={() => {
                onSetData('generateMessage', true);
                onGenerateWinner(campaignId, Number(winner.value), snsId);
              }}
            >
              {intl.formatMessage({ ...messages.proceed })}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

GenerateNewWinner.propTypes = {
  intl: intlShape.isRequired,
  cancelledWinner: PropTypes.number,
  onGenerateWinner: PropTypes.any,
  onSetData: PropTypes.any,
  campaignId: PropTypes.number,
  winner: PropTypes.any,
  invalid: PropTypes.any,
  errors: PropTypes.any,
  snsId: PropTypes.any,
};

export default injectIntl(GenerateNewWinner);
