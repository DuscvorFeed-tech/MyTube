import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import ErrorFormatted from 'components/ErrorFormatted';
import messages from '../messages';

export function FailedUploadCsv({ intl, errors, onResetUploadCsvFile }) {
  return (
    <Modal id="failedUploadCsv" dismissable size="md">
      <ModalToggler modalId="failedUploadCsv" />
      <div>
        <div className="text-center my-4">
          {intl.formatMessage({ ...messages.E0000070 })}
          {errors && <ErrorFormatted invalid list={errors.list} />}
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                onResetUploadCsvFile();
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

FailedUploadCsv.propTypes = {
  intl: intlShape.isRequired,
  errors: PropTypes.any,
  onResetUploadCsvFile: PropTypes.func,
};

export default compose(
  memo,
  injectIntl,
)(FailedUploadCsv);
