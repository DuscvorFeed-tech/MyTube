/**
 *
 * FormsDetailPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import PATH from 'containers/path';

import useValidation, { isValid } from 'library/validator';
import useSubmitEffect from 'library/submitter';

import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectFormsDetailPage, {
  makeSelectFormDetails,
  makeSelectErrors,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  fetchFormDetails,
  updateForm,
  setData,
  resetData,
  removeImageHeader,
  setImageHeader,
} from './actions';
import validation from './validators';
import messages from './messages';

import ViewDetail from './subcomponents/ViewDetail';
import EditDetail from './subcomponents/EditDetail';
import PreviewDetail from './subcomponents/PreviewDetail';

export function FormsDetailPage({
  intl,
  onfetchFormDetails,
  formDetails,
  errors,
  theme,
  routeParams,
  onSubmit,
  onResetData,
  onSet,
  formsDetailPage,
  onRemove,
  changeImageHeader,
}) {
  useInjectReducer({ key: 'formsDetailPage', reducer });
  useInjectSaga({ key: 'formsDetailPage', saga });

  const { isEdit } = formsDetailPage;

  const validator = validation(intl);
  const formName = useValidation('', validator.formName, true);
  const formDescription = useValidation('', validator.description, true);
  const formImageHeader = useValidation('', validator.imageHeader);
  const formTitle = useValidation('', validator.title, true);
  const formContent = useValidation('', validator.content, true);
  const formFooter = useValidation('', validator.footer, true);

  const invalid = !isValid([
    formName,
    formDescription,
    formTitle,
    formContent,
    formFooter,
  ]);

  const submitter = useSubmitEffect([
    onSubmit,
    [
      routeParams.id,
      formName.value,
      formDescription.value,
      formImageHeader.value,
      formTitle.value,
      formContent.value,
      formFooter.value,
    ],
  ]);

  useEffect(() => {
    onResetData();
    onSet('isEdit', false);
    onfetchFormDetails(routeParams.id);
    submitter.submittedcallback(() => onSet('isEdit', true));
  }, []);

  useEffect(() => {
    if (formDetails) {
      const {
        name,
        description,
        imageHeader,
        title,
        content,
        footer,
      } = formDetails;
      formName.setvalue(name);
      formDescription.setvalue(description);
      formImageHeader.setvalue(imageHeader);
      formTitle.setvalue(title);
      formContent.setvalue(content);
      formFooter.setvalue(footer);
    }
  }, [formDetails]);

  /* eslint-disable func-names */
  formImageHeader.onChange = (function(onchange) {
    return function(evt) {
      if (onchange) {
        onchange(evt);
      }
      changeImageHeader(evt.target.files ? evt.target.files[0] : null);
    };
  })(formImageHeader.onChange);

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.titleMain })}</title>
        <meta name="description" content="Description of Forms Details Page" />
      </Helmet>
      <Card title="General Settings  -  Form Details" className="p-0">
        <div className="d-flex">
          {!isEdit ? (
            <ViewDetail
              formName={formName}
              formDescription={formDescription}
              formImageHeader={formImageHeader}
              formTitle={formTitle}
              formContent={formContent}
              formFooter={formFooter}
              theme={theme}
            />
          ) : (
            <EditDetail
              formName={formName}
              formDescription={formDescription}
              formImageHeader={formImageHeader}
              formTitle={formTitle}
              formContent={formContent}
              formFooter={formFooter}
              theme={theme}
              errors={errors}
              onRemove={onRemove}
            />
          )}
          <PreviewDetail
            formImageHeader={formImageHeader}
            formTitle={formTitle}
            formContent={formContent}
            formFooter={formFooter}
            theme={theme}
          />
        </div>
        <div className="button-holder">
          {!isEdit ? (
            <div className="row">
              <div className="col-auto">
                <Button
                  tertiary
                  onClick={() => forwardTo(PATH.SETTINGS_FORMS)}
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
                    onfetchFormDetails(routeParams.id);
                  }}
                  width="sm"
                >
                  {intl.formatMessage({ ...messages.btnCancel })}
                </Button>
              </div>
              <div className="col-auto ml-auto">
                <Button
                  width="sm"
                  disabled={invalid || submitter.submitting}
                  {...submitter}
                >
                  {intl.formatMessage({ ...messages.btnSave })}
                </Button>
              </div>
            </div>
          )}
        </div>
        <div>
          <Modal id="EditSuccess" dismissable>
            <ModalToggler modalId="EditSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.message })}</p>
              <Button
                primary
                className="col-4"
                dataDismiss="modal"
                onClick={() => {
                  onSet('isEdit', false);
                  onResetData();
                  onfetchFormDetails(routeParams.id);
                }}
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

FormsDetailPage.propTypes = {
  intl: PropTypes.any,
  onSubmit: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onfetchFormDetails: PropTypes.func,
  formDetails: PropTypes.object,
  errors: PropTypes.any,
  theme: PropTypes.any,
  routeParams: PropTypes.any,
  onResetData: PropTypes.func,
  onSet: PropTypes.func,
  formsDetailPage: PropTypes.any,
  onRemove: PropTypes.func,
  changeImageHeader: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formsDetailPage: makeSelectFormsDetailPage(),
  formDetails: makeSelectFormDetails(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onfetchFormDetails: data => {
      dispatch(fetchFormDetails(data));
    },
    onSet: (key, value) => dispatch(setData(key, value)),
    onResetData: () => {
      dispatch(resetData());
    },
    onSubmit: (values, onSubmitted) => {
      const [
        id,
        name,
        description,
        imageHeader,
        title,
        content,
        footer,
      ] = values;
      dispatch(
        updateForm(
          { id, name, description, imageHeader, title, content, footer },
          onSubmitted,
        ),
      );
    },
    onRemove: () => dispatch(removeImageHeader()),
    changeImageHeader: imageHeader => dispatch(setImageHeader(imageHeader)),
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
)(FormsDetailPage);
