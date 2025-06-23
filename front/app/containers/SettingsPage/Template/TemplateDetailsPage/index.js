/* eslint-disable camelcase */
/**
 *
 * TemplateDetailsPage
 *
 */
import React, { memo, useEffect } from 'react';
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
import ModalToggler from 'components/Modal/ModalToggler';
import Tweet from 'components/Tweet';
import TemplatePreview from 'components/TemplatePreview';

import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';
import makeSelectTemplateDetailsPage, {
  makeSelectTemplateDetail,
  makeSelectErrors,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  fetchTemplateDetail,
  updateTemplate,
  setData,
  resetData,
} from './actions';
import { useUploadFile, PublishTwitterState } from './inputStateEffect';
import validation from './validators';
import messages from './messages';

import ViewDetail from './subcomponents/ViewDetail';
import EditDetail from './subcomponents/EditDetail';

let checkUploadImage;
export function TemplateDetailsPage({
  intl,
  commonTypes,
  routeParams,
  onFetchDetail,
  templateDetail,
  errors,
  onSubmit,
  theme,
  onResetData,
  onSet,
  templateDetailsPage,
  userAccount,
}) {
  useInjectReducer({ key: 'templateDetailsPage', reducer });
  useInjectSaga({ key: 'templateDetailsPage', saga });

  const { isEdit } = templateDetailsPage;

  const tweetUploadFile = useUploadFile(intl);
  checkUploadImage = tweetUploadFile.imageFile.value;
  const publishTwitterState = PublishTwitterState(intl);

  const validator = validation(intl);
  const templateName = useValidation('', validator.templateName, true);
  const templateType = useValidation(1, validator.templateType, true);
  const templateCategory = useValidation(1, validator.templateCategory, true);
  const templateDescription = useValidation(
    '',
    validator.templateDescription,
    true,
  );
  const invalid = !isValid([
    templateName,
    templateType,
    templateDescription,
    templateCategory,
    publishTwitterState.content,
  ]);

  const submitter = useSubmitEffect([
    onSubmit,
    [
      routeParams.id,
      templateName.value,
      templateType.value,
      templateCategory.value,
      templateDescription.value,
      publishTwitterState.content.value,
      tweetUploadFile.uploadFiles,
      userAccount,
    ],
  ]);

  useEffect(() => {
    onResetData();
    onFetchDetail(routeParams.id);
    submitter.submittedcallback(() => onSet('isEdit', true));
  }, []);

  useEffect(() => {
    if (templateDetail) {
      const {
        name,
        type,
        description,
        category,
        content,
        message_file,
      } = templateDetail;
      templateName.setvalue(name);
      templateType.setvalue(type);
      templateCategory.setvalue(category);
      templateDescription.setvalue(description);
      publishTwitterState.content.setvalue(content);
      if (message_file !== undefined && message_file !== null) {
        tweetUploadFile.setUploadFile([message_file]);
        tweetUploadFile.getFileUpload(message_file);
      }
    }
  }, [templateDetail]);

  return (
    <div>
      <div>
        <Helmet>
          <title>{intl.formatMessage({ ...messages.title })}</title>
          <meta
            name="description"
            content="Description of Template Details Page"
          />
        </Helmet>
        <Card
          title={`${intl.formatMessage({
            ...messages.T0000012,
          })} - ${intl.formatMessage({ ...messages.T0000024 })}`}
          className="p-0"
        >
          <div className="d-flex">
            {!isEdit ? (
              <ViewDetail
                theme={theme}
                templateName={templateName}
                templateType={templateType}
                templateCategory={templateCategory}
                templateDescription={templateDescription}
                validatorEffect={{ ...tweetUploadFile, ...publishTwitterState }}
                commonTypes={commonTypes}
              />
            ) : (
              <EditDetail
                errors={errors}
                theme={theme}
                templateName={templateName}
                templateType={templateType}
                templateCategory={templateCategory}
                templateDescription={templateDescription}
                validatorEffect={{ ...tweetUploadFile, ...publishTwitterState }}
                commonTypes={commonTypes}
              />
            )}
            <div className="p-5 d-block col-lg-5 border-left">
              <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
                {intl.formatMessage({ ...messages.templatePreview })}
              </Title>
              {Number(templateType.value) === 1 && (
                <>
                  <TemplatePreview
                    content={publishTwitterState.content.value}
                    uploadFiles={tweetUploadFile.uploadFiles}
                  />
                </>
              )}
              {Number(templateType.value) === 2 && (
                <Tweet
                  name={intl.formatMessage({ ...messages.templatePreview })}
                  content={publishTwitterState.content.value}
                  files={
                    tweetUploadFile.uploadFiles.length > 0
                      ? tweetUploadFile.uploadFiles
                      : null
                  }
                  fileType={tweetUploadFile.fileType}
                />
              )}
            </div>
          </div>
          <div className="button-holder">
            {!isEdit ? (
              <div className="row">
                <div className="col-auto">
                  <Button
                    tertiary
                    onClick={() => forwardTo('/settings')}
                    width="sm"
                  >
                    {intl.formatMessage({ ...messages.btnBack })}
                  </Button>
                </div>
                <div className="col-auto ml-auto">
                  <Button
                    secondary
                    onClick={() => onSet('isEdit', true)}
                    width="sm"
                  >
                    {intl.formatMessage({ ...messages.btnEdit })}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-auto">
                  <Button
                    tertiary
                    onClick={() => {
                      onSet('isEdit', false);
                      onFetchDetail(routeParams.id);
                    }}
                    width="sm"
                  >
                    {intl.formatMessage({ ...messages.btnCancel })}
                  </Button>
                </div>
                {checkUploadImage === undefined ? (
                  <div className="col-auto ml-auto">
                    <Button
                      width="sm"
                      disabled={invalid || submitter.submitting}
                      {...submitter}
                    >
                      {intl.formatMessage({ ...messages.btnSave })}
                    </Button>
                  </div>
                ) : (
                  <div className="col-auto ml-auto">
                    <Button
                      width="sm"
                      enabled={invalid || submitter.submitting}
                      {...submitter}
                    >
                      {intl.formatMessage({ ...messages.btnSave })}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <Modal id="EditSuccess" dismissable>
              <ModalToggler modalId="EditSuccess" />
              <div className="text-center">
                <p>
                  {intl.formatMessage({ ...messages.templateChangeMessage })}
                </p>
                <Button
                  primary
                  className="col-4"
                  onClick={() => {
                    onSet('isEdit', false);
                    tweetUploadFile.uploadFiles.onClearValue([]);
                    onResetData();
                    onFetchDetail(routeParams.id);
                  }}
                  dataDismiss="modal"
                >
                  {intl.formatMessage({ ...messages.btnOk })}
                </Button>
              </div>
            </Modal>
          </div>
        </Card>
      </div>
    </div>
  );
}

TemplateDetailsPage.propTypes = {
  onFetchDetail: PropTypes.func,
  templateDetail: PropTypes.object,
  routeParams: PropTypes.object,
  intl: PropTypes.any,
  commonTypes: PropTypes.object,
  errors: PropTypes.object,
  onSubmit: PropTypes.func,
  theme: PropTypes.any,
  onResetData: PropTypes.func,
  onSet: PropTypes.func,
  templateDetailsPage: PropTypes.any,
  userAccount: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  templateDetailsPage: makeSelectTemplateDetailsPage(),
  templateDetail: makeSelectTemplateDetail(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchDetail: id => dispatch(fetchTemplateDetail(id)),
    onSet: (key, value) => dispatch(setData(key, value)),
    onResetData: () => {
      dispatch(resetData());
    },
    onSubmit: (values, onSubmitted) => {
      const [
        id,
        name,
        type,
        category,
        description,
        content,
        uploadFiles,
        userAccount,
      ] = values;
      const file = uploadFiles.length > 0 ? uploadFiles[0] : null;
      dispatch(
        updateTemplate(
          {
            id,
            name,
            type,
            category,
            description,
            content,
            file,
            snsId: userAccount.sns_account[0].id,
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
)(TemplateDetailsPage);
