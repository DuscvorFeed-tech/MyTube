/**
 *
 * AddFormPage
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

import PATH from 'containers/path';

import Card from 'components/Card';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';

import makeSelectAddFormPage, {
  makeSelectErrors,
  makeSelectImage,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { submitForm, removeImageHeader, setImageHeader } from './actions';
import validation from './validators';
import messages from './messages';

import AddForm from './subcomponents/AddForm';
import Preview from './subcomponents/Preview';

export function AddFormPage({
  intl,
  onSubmit,
  errors,
  theme,
  onRemove,
  changeImageHeader,
  image,
}) {
  useInjectReducer({ key: 'addFormPage', reducer });
  useInjectSaga({ key: 'addFormPage', saga });

  const validator = validation(intl);
  const formName = useValidation('', validator.formName);
  const description = useValidation('', validator.description);
  const imageHeader = useValidation('', validator.imageHeader);
  const title = useValidation('', validator.title);
  const content = useValidation('', validator.content);
  const footer = useValidation('', validator.footer);

  const invalid = !isValid([formName, title, content]);
  const submitter = useSubmitEffect([
    onSubmit,
    {
      name: formName.value,
      description: description.value,
      title: title.value,
      imageHeader: imageHeader.value,
      content: content.value,
      footer: footer.value,
    },
  ]);

  useEffect(() => {
    imageHeader.setvalue(image);
  }, [image]);

  /* eslint-disable func-names */
  imageHeader.onChange = (function(onchange) {
    return function(evt) {
      if (onchange) {
        onchange(evt);
      }
      changeImageHeader(evt.target.files ? evt.target.files[0] : null);
    };
  })(imageHeader.onChange);

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.addForm })}</title>
        <meta name="description" content="Description of Add Form Page" />
      </Helmet>
      <div className="text-center col-md-12 mb-3">
        <Card title="General Settings" className="p-0">
          <div className="d-flex">
            <AddForm
              errors={errors}
              theme={theme}
              formName={formName}
              imageHeader={imageHeader}
              description={description}
              title={title}
              content={content}
              footer={footer}
              onRemove={onRemove}
            />
            <Preview
              theme={theme}
              title={title}
              content={content}
              footer={footer}
              imageHeader={imageHeader}
            />
          </div>
          <div className="button-holder">
            <div className="row">
              <div className="col-auto">
                <Button
                  tertiary
                  onClick={() => {
                    onRemove();
                    forwardTo(PATH.SETTINGS_FORMS);
                  }}
                  width="sm"
                >
                  {intl.formatMessage({ ...messages.btnCancel })}
                </Button>
              </div>
              <div className="col-2 ml-auto">
                <Button
                  disabled={invalid || submitter.submitting}
                  {...submitter}
                >
                  {intl.formatMessage({ ...messages.btnAdd })}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Modal id="AddFormSuccess" dismissable>
              <ModalToggler modalId="AddFormSuccess" />
              <div className="text-center">
                <p>New Form was successfully added!</p>
                <Button
                  primary
                  className="col-4"
                  dataDismiss="modal"
                  onClick={() => {
                    onRemove();
                    forwardTo(PATH.SETTINGS_FORMS);
                  }}
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

AddFormPage.propTypes = {
  intl: PropTypes.any,
  onSubmit: PropTypes.func,
  onInputImage: PropTypes.func,
  errors: PropTypes.any,
  theme: PropTypes.any,
  onRemove: PropTypes.func,
  changeImageHeader: PropTypes.func,
  image: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  addFormPage: makeSelectAddFormPage(),
  image: makeSelectImage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      dispatch(submitForm(values, onSubmitted));
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
)(AddFormPage);
