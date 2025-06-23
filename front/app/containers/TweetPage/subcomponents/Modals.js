import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { forwardTo } from 'helpers/forwardTo';

import messages from '../messages';
const Modals = props => {
  const { submitter, intl } = props;
  return (
    <>
      <Modal id="scheduleModal">
        <ModalToggler modalId="scheduleModal" />
        <div className="text-center">
          <p>{intl.formatMessage({ ...messages.tweetScheduleConfirm })}</p>

          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button secondary dataDismiss="modal">
                {intl.formatMessage({ ...messages.no })}
              </Button>
            </div>
            <div className="col-4">
              <Button dataDismiss="modal" {...submitter}>
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="scheduleModalSuccess">
        <ModalToggler modalId="scheduleModalSuccess" />
        <div className="text-center">
          <p>{intl.formatMessage({ ...messages.tweetSuccessScheduled })}</p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() => forwardTo('/post')}
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="publishModal">
        <ModalToggler modalId="publishModal" />
        <div className="text-center">
          <p>{intl.formatMessage({ ...messages.tweetPublishConfirm })}</p>

          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button secondary dataDismiss="modal">
                {intl.formatMessage({ ...messages.no })}
              </Button>
            </div>
            <div className="col-4">
              <Button type="submit" dataDismiss="modal" {...submitter}>
                {intl.formatMessage({ ...messages.yes })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="publishModalSuccess">
        <ModalToggler modalId="publishModalSuccess" />
        <div className="text-center">
          <p>{intl.formatMessage({ ...messages.tweetSuccessPublished })}</p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() => forwardTo('/post')}
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="saveModal">
        <ModalToggler modalId="saveModal" />
        <div className="text-center">
          <p>{intl.formatMessage({ ...messages.tweetSuccessSaved })}</p>

          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button dataDismiss="modal">
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

Modals.propTypes = {
  submitter: PropTypes.any,
  intl: PropTypes.any,
};

export default compose(injectIntl)(Modals);
