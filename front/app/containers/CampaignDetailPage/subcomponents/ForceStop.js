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
import Input from 'components/Input';
import Modal from 'components/Modal';
import LoadingIndicator from 'components/LoadingIndicator';
import ErrorFormatted from 'components/ErrorFormatted';
import ModalToggler from 'components/Modal/ModalToggler';
import validation from '../validators';
import useSubmitEffect from '../../../library/submitter';
import useValidation, { isValid } from '../../../library/validator';

import messages from '../messages';

export function ForceStop({
  showFlow,
  setShowFlow,
  setIsGenerate,
  onForceEnd,
  // onGenerateWinner,
  intl,
  detailPage: { campDetails, errors, loading = true },
}) {
  const resetFlow = () => {
    setShowFlow(1);
  };

  const validator = validation(intl);
  const password = useValidation('', validator.password);

  const invalid = !isValid([password]);

  const submitter = useSubmitEffect(
    [onForceEnd, [password.value]],
    () => !invalid,
  );

  return (
    <Modal id="forceStop" dismissable size="md">
      <ModalToggler modalId="forceStop" />
      {showFlow === 1 && (
        <div>
          <div className="text-center my-4 text-danger font-weight-bold text-uppercase">
            {intl.formatMessage({ ...messages.warning })}
          </div>
          <div className="text-center my-4">
            <FormattedHTMLMessage
              id="M0000015"
              values={{
                name: campDetails.title,
              }}
            />
            {/* You are about to force stop <b>{campDetails.title}</b>
            <br />
            Do you want to proceed? */}
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
                onClick={() =>
                  setShowFlow(Number(campDetails.status) === 0 ? 2 : 5)
                }
              >
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 2 && (
        <div>
          <div className="text-center my-4 text-danger font-weight-bold">
            {intl.formatMessage({ ...messages.warning })}
          </div>
          <div className="text-center my-4">
            {intl.formatMessage({ ...messages.M0000016 })}
            {/* Do you want to generate winners? */}
          </div>
          <div className="row justify-content-center mt-5 mb-3 px-5">
            <div className="col-auto">
              <Button
                width="sm"
                secondary
                small
                onClick={() => {
                  setIsGenerate(false);
                  setShowFlow(5);
                }}
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
                  setIsGenerate(true);
                  setShowFlow(3);
                }}
              >
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 3 && (
        <div>
          <div className="font-weight-bold text-center my-4 text-danger">
            {intl.formatMessage({ ...messages.M0000017 })}
          </div>
          <div className="row justify-content-center align-items-center">
            {/* <div className="col-4 content">
              {intl.formatMessage({ ...messages.currentEntries })}
            </div>
            <div className="col-2 label">{winnerListCount}</div>
            */}
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-6 content">
              {intl.formatMessage({ ...messages.remainingPrizes })}
            </div>
          </div>
          {campDetails.raffle_type === Number(EnumRaffleTypes.END) && (
            <>
              {campDetails.campaign_prize.map(m => (
                <div className="row justify-content-center align-items-center">
                  <div className="col-4 content">{m.name}</div>
                  <div className="col-2 label">
                    {m.raffle_schedule
                      .map(mm => mm.winner_total)
                      .reduce((sum, mm) => sum + mm)}
                  </div>
                </div>
              ))}
            </>
          )}
          {campDetails.raffle_type === Number(EnumRaffleTypes.FIXED) && (
            <>
              {campDetails.closestPrize.map(m => (
                <div className="row justify-content-center align-items-center">
                  <div className="col-4 content">{m.name}</div>
                  <div className="col-2 label">
                    {m.raffle_schedule
                      .map(mm => mm.winner_total)
                      .reduce((sum, mm) => sum + mm)}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="row justify-content-center align-items-center mt-3">
            <div className="col-4 content">
              {intl.formatMessage({ ...messages.T0000018 })}
            </div>
            <div className="col-2 label">{campDetails.forceStopRemWinners}</div>
          </div>
          <div className="text-center my-4">
            <FormattedHTMLMessage id="M0000018" />
            {/* You are about to force stop this campaign and generate winners,
            <br />
            <b>Do you want to continue?</b> */}
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
              <Button width="sm" primary small onClick={() => setShowFlow(4)}>
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 4 && (
        <div>
          <div className="text-center my-4">
            <FormattedHTMLMessage
              id="M0000019"
              values={{
                name: campDetails.title,
              }}
            />
          </div>
          <div className=" row justify-content-center my-4">
            <div className="col-6">
              {loading && <LoadingIndicator height="auto" />}
              {!loading && (
                <>
                  <Input type="password" name="password" {...password} />
                  <ErrorFormatted {...password.error} />
                  {errors && !password.error.invalid && (
                    <ErrorFormatted invalid list={[errors]} />
                  )}
                </>
              )}
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
                {intl.formatMessage({ ...messages.cancel })}
              </Button>
            </div>
            <div className="col-auto">
              <Button
                type="submit"
                width="sm"
                primary
                small
                disabled={invalid || submitter.submitting}
                {...submitter}
              >
                {intl.formatMessage({ ...messages.submit })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 5 && (
        <div>
          <div className="text-center my-4 text-danger font-weight-bold">
            {intl.formatMessage({ ...messages.warning })}
          </div>
          <div className="text-center my-4">
            <FormattedHTMLMessage {...messages.M0000020} />
            {/* You are about to force stop this campaign WITHOUT generating
            winners.
            <br />
            <b>Do you want to continue?</b> */}
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
              <Button width="sm" primary small onClick={() => setShowFlow(6)}>
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showFlow === 6 && (
        <div>
          <div className="text-center my-4">
            <FormattedHTMLMessage
              id="M0000019"
              values={{
                name: campDetails.title,
              }}
            />
            {/* Please input password to FORCE STOP <b>{campDetails.title}</b> */}
          </div>
          <div className=" row justify-content-center my-4">
            <div className="col-6">
              {loading && <LoadingIndicator height="auto" />}
              {!loading && (
                <>
                  <Input type="password" name="password" {...password} />
                  <ErrorFormatted {...password.error} />
                  {errors && !password.error.invalid && (
                    <ErrorFormatted invalid list={[errors]} />
                  )}
                </>
              )}
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
                {intl.formatMessage({ ...messages.cancel })}
              </Button>
            </div>
            <div className="col-auto">
              <Button
                width="sm"
                primary
                small
                disabled={invalid || submitter.submitting}
                {...submitter}
              >
                {intl.formatMessage({ ...messages.submit })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

ForceStop.propTypes = {
  showFlow: PropTypes.any,
  setShowFlow: PropTypes.any,
  isGenerate: PropTypes.any,
  setIsGenerate: PropTypes.any,
  detailPage: PropTypes.any,
  onForceEnd: PropTypes.any,
  // intl: PropTypes.any,
  intl: intlShape.isRequired,
  onGenerateWinner: PropTypes.any,
};

export default compose(
  memo,
  injectIntl,
)(ForceStop);
