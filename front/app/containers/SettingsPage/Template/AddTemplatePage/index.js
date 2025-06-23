/**
 *
 * AddTemplatePage
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Title from 'components/Title';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Tweet from 'components/Tweet';
import TemplatePreview from 'components/TemplatePreview';
import ModalToggler from 'components/Modal/ModalToggler';

import PATH from 'containers/path';

import { forwardTo } from 'helpers/forwardTo';
// import { modalToggler } from 'utils/commonHelper';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';
import LocalStorage from 'utils/localstorage';
import { SELECTED_SNS_ID } from 'utils/constants';

import makeSelectAddTemplatePage, {
  makeSelectErrors,
  makeSelectCommonTypes,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchCommonTypes, submitTemplate } from './actions';
import validation from './validators';
import AddTemplate from './subcomponents/AddTemplate';
import { useUploadFile, PublishTwitterState } from './inputStateEffect';
import messages from './messages';

export function AddTemplatePage({
  intl,
  onSubmit,
  errors,
  theme,
  commonTypes,
  onLoadTypes,
  userAccount,
}) {
  useInjectReducer({ key: 'addTemplatePage', reducer });
  useInjectSaga({ key: 'addTemplatePage', saga });

  useEffect(() => {
    onLoadTypes();
  }, []);

  const tweetUploadFile = useUploadFile(intl);
  const publishTwitterState = PublishTwitterState(intl, tweetUploadFile);

  const validator = validation(intl);
  const templateName = useValidation('', validator.templateName);
  const templateTypeValue = 1;
  const templateCategory = useValidation('', validator.templateCategory);
  const templateDescription = useValidation(
    '',
    validator.templateDescription,
    true,
  );
  // const templateContent = useValidation('', validator.templateContent);
  // const templateImage = useValidation('', validator.templateImage);
  // const templateVideo = useValidation('', validator.templateVideo);
  // const mediaInvalid =
  //   templateImage.error.invalid || templateVideo.error.invalid;
  const contentInvalid =
    tweetUploadFile &&
    tweetUploadFile.uploadError &&
    tweetUploadFile.uploadError.invalid;

  let invalid = !isValid([
    templateName,
    templateDescription,
    templateCategory,
    publishTwitterState.content,
  ]);
  if (tweetUploadFile.uploadFiles && tweetUploadFile.uploadFiles.length) {
    invalid = !isValid([templateName, templateDescription, templateCategory]);
  }
  const submitter = useSubmitEffect([
    onSubmit,
    [
      userAccount,
      templateName.value,
      templateTypeValue,
      templateDescription.value,
      templateCategory.value,
      publishTwitterState.content.value,
      tweetUploadFile.uploadFiles,
    ],
  ]);

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.addTemplate })}</title>
        <meta name="description" content="Description of Add Template Page" />
      </Helmet>
      <Card
        title={intl.formatMessage({ ...messages.T0000012 })}
        className="p-0"
      >
        <div className="d-flex">
          <AddTemplate
            theme={theme}
            errors={errors}
            templateName={templateName}
            templateTypeValue={templateTypeValue}
            templateCategory={templateCategory}
            templateDescription={templateDescription}
            commonTypes={commonTypes}
            validatorEffect={{ ...tweetUploadFile, ...publishTwitterState }}
          />
          <div className="p-5 d-block col-lg-5 border-left">
            <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
              {intl.formatMessage({ ...messages.templatePreview })}
            </Title>
            {Number(templateTypeValue) === 1 && (
              <>
                <TemplatePreview
                  content={publishTwitterState.content.value}
                  uploadFiles={tweetUploadFile.uploadFiles}
                />
              </>
            )}
            {Number(templateTypeValue) === 2 && (
              <Tweet
                name={intl.formatMessage({ ...messages.templatePreview })}
                content={publishTwitterState.content.value}
                files={tweetUploadFile.uploadFiles}
                fileType={tweetUploadFile.fileType}
              />
            )}
          </div>
        </div>
        <div className="button-holder">
          <div className="row">
            <div className="col-auto">
              <Button
                tertiary
                onClick={() => forwardTo('/settings')}
                width="sm"
              >
                {intl.formatMessage({ ...messages.btnCancel })}
              </Button>
            </div>
            <div className="col-auto ml-auto">
              <Button
                disabled={invalid || contentInvalid || submitter.submitting}
                {...submitter}
                width="sm"
              >
                {intl.formatMessage({ ...messages.btnAdd })}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Modal id="AddTemplateSuccess" dismissable>
            <ModalToggler modalId="AddTemplateSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.addMessage })}</p>
              <Button
                primary
                className="col-4"
                dataDismiss="modal"
                onClick={() => forwardTo(PATH.SETTINGS_TEMPLATE)}
              >
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
        </div>
      </Card>
    </div>
  );
}

AddTemplatePage.propTypes = {
  onLoadTypes: PropTypes.func,
  commonTypes: PropTypes.any,
  intl: PropTypes.any,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  theme: PropTypes.any,
  userAccount: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
  commonTypes: makeSelectCommonTypes(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadTypes: () => dispatch(fetchCommonTypes()),
    onSubmit: (values, onSubmitted) => {
      const [
        userAccount,
        name,
        type,
        description,
        category,
        content,
        uploadFiles,
        // image,
        // video,
      ] = values;
      // eslint-disable-next-line no-nested-ternary
      // const messageImage = image !== '' ? image : video !== '' ? video : null;
      const file = uploadFiles.length > 0 ? uploadFiles[0] : null;
      const selectedSns = LocalStorage.readLocalStorage(SELECTED_SNS_ID);
      const snsAccount = userAccount.sns_account;
      let selectedSnsAccount = (snsAccount || []).find(
        sns => sns.id === Number(selectedSns) || (!selectedSns && sns.primary),
      );
      if (!selectedSnsAccount && snsAccount.length) {
        [selectedSnsAccount] = snsAccount;
      }

      dispatch(
        submitTemplate(
          {
            name,
            type,
            description,
            content,
            category,
            file,
            snsId: selectedSnsAccount.id,
          },
          onSubmitted,
        ),
      );
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
  withTheme,
)(AddTemplatePage);
