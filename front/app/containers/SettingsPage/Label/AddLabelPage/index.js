/**
 *
 * AddLabelPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Title from 'components/Title';
import Label from 'components/Label';
import Button from 'components/Button';
import Input from 'components/Input';
import CustomColorPicker from 'components/CustomColorPicker';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAddLabelPage, { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { submitLabel } from './actions';
import validation from './validators';
import useValidation, { isValid } from '../../../../library/validator';
import useSubmitEffect from '../../../../library/submitter';
import ErrorFormatted from '../../../../components/ErrorFormatted';
import messages from './messages';
import PATH from '../../../path';

export function AddLabelPage({ intl, onSubmit, errors, theme }) {
  useInjectReducer({ key: 'addLabelPage', reducer });
  useInjectSaga({ key: 'addLabelPage', saga });

  const validator = validation(intl);
  const labelName = useValidation('', validator.labelName);
  const color = useValidation('', validator.color);

  const invalid = !isValid([labelName, color]);
  const submitter = useSubmitEffect([onSubmit, [labelName.value, color.value]]);

  const onAccept = hex => {
    color.setvalue(hex);
    color.onBlur();
  };

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.addLabel })}</title>;
        <meta name="description" content="Description of Add Label Page" />
      </Helmet>
      <div className="col-md-12 mb-3">
        <Card title="General Settings" className="p-0 overflow-visible">
          <div className="d-flex p-3">
            <div className="p-5 d-block col-lg-7">
              <div className="row mb-4">
                <Title
                  main
                  size={theme.fontSize.md}
                  color={theme.secondaryDark}
                >
                  {intl.formatMessage({ ...messages.addLabel })}
                </Title>
              </div>
              <div className="row align-items-baseline pb-3 col-lg-12">
                <div className="col-md-4 text-left" />
                <div className="col-md-8 text-left">
                  {errors && <ErrorFormatted invalid list={errors.list} />}
                </div>
              </div>
              <div className="row">
                <div className="row align-items-baseline pb-3 col-lg-12">
                  <div className="col-md-4 text-left">
                    <Label required>
                      {intl.formatMessage({ ...messages.labelName })}
                    </Label>
                  </div>
                  <div className="col-md-8 text-left">
                    <Input name="labelName" {...labelName} />
                    <ErrorFormatted {...labelName.error} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="row align-items-start pb-3 col-lg-12">
                  <div className="col-md-4 text-left">
                    <Label>{intl.formatMessage({ ...messages.color })}</Label>
                  </div>
                  <div className="col-md-8 text-left">
                    <CustomColorPicker {...color} onAccept={onAccept} />
                    {/* <Select {...color}>
                      <option />
                      <option
                        value="#100b9c"
                        style={{ backgroundColor: '#100b9c' }}
                      >
                        Blue
                      </option>
                      <option
                        value="#f50c23"
                        style={{ backgroundColor: '#f50c23' }}
                      >
                        Red
                      </option>
                      <option
                        value="#1eb507"
                        style={{ backgroundColor: '#1eb507' }}
                      >
                        Green
                      </option>
                    </Select> */}
                    <ErrorFormatted {...color.error} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-holder p-15">
            <div className="row">
              <div className="col-auto">
                <Button
                  tertiary
                  onClick={() => forwardTo(PATH.SETTINGS_LABELS)}
                  width="sm"
                >
                  {intl.formatMessage({ ...messages.btnCancel })}
                </Button>
              </div>
              <div className="col-auto ml-auto">
                <Button
                  disabled={invalid || submitter.submitting}
                  {...submitter}
                  width="sm"
                >
                  {intl.formatMessage({ ...messages.btnAdd })}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Modal id="AddLabelSuccess" dismissable>
              <ModalToggler modalId="AddLabelSuccess" />
              <div className="text-center">
                <p>{intl.formatMessage(messages.completionMessage)}</p>
                <Button
                  primary
                  className="col-4"
                  dataDismiss="modal"
                  onClick={() => forwardTo(PATH.SETTINGS_LABELS)}
                >
                  OK
                </Button>
              </div>
            </Modal>
          </div>
        </Card>
      </div>
    </div>
  );
}

AddLabelPage.propTypes = {
  intl: PropTypes.any,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  theme: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  addLabelPage: makeSelectAddLabelPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      // eslint-disable-next-line camelcase
      const [name, color_code] = values;
      dispatch(submitLabel({ name, color_code }, onSubmitted));
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
)(AddLabelPage);
