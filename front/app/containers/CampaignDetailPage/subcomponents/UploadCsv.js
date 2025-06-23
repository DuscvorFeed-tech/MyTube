/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import FileUpload from 'components/FileUpload';
import Label from 'components/Label';
import ErrorFormatted from 'components/ErrorFormatted';
import useSubmitEffect from 'library/submitter';
import messages from '../messages';

export function UploadCsv({ intl, campaignId, snsId, csvFile, onSubmit }) {
  const submitter = useSubmitEffect([onSubmit, [campaignId, snsId, csvFile]]);

  return (
    <Modal
      id="modalTemplatePreview"
      modalOptions={{ dismissible: true }}
      size="lg"
      backdrop="static"
    >
      <ModalToggler modalId="modalTemplatePreview" />
      <form>
        <div className="row justify-content-center align-items-center">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.uploadCSVFile })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <FileUpload
              name="csvFile"
              label="Choose File"
              accept=".csv"
              {...csvFile}
            />
            {csvFile.value && csvFile.value.name ? (
              <Label className="pl-0">{csvFile.value.name}</Label>
            ) : null}
            <ErrorFormatted {...csvFile.error} />
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
              disabled={!(csvFile.value && csvFile.value.name)}
              {...submitter}
            >
              {intl.formatMessage({ ...messages.proceed })}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

UploadCsv.propTypes = {
  intl: intlShape.isRequired,
  campaignId: PropTypes.number,
  setState: PropTypes.func,
  snsId: PropTypes.any,
  csvFile: PropTypes.any,
  onSubmit: PropTypes.any,
};

export default compose(
  memo,
  injectIntl,
)(UploadCsv);
