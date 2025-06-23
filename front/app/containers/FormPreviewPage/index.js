/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */

/**
 *
 * FormPreviewPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Card from 'components/Card';
import Text from 'components/Text';
import Img from 'components/Img';
import Form from 'components/Form';
import Button from 'components/Button';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import PersonalInformation from './subcomponents/PersonalInformation';
import ThankfulPerson1 from './subcomponents/ThankfulPerson1';
import ThankfulPerson2 from './subcomponents/ThankfulPerson2';
// import ErrorFormatted from 'components/ErrorFormatted';
// import Modal from 'components/Modal';
// import ModalToggler from 'components/Modal/ModalToggler';

import makeSelectFormPreviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { config } from '../../utils/config';

export function FormPreviewPage(props) {
  useInjectReducer({ key: 'formPreviewPage', reducer });
  useInjectSaga({ key: 'formPreviewPage', saga });

  const {
    inputFormFields = [],
    inputFormFields2 = [],
    inputFormFields3 = [],
    inputFormFieldsRequired = [],
    formDesign,
    template = {},
    intl,
  } = props;
  return (
    <div>
      <div>
        <Form className="mx-4 col-lg-12 mx-auto">
          <Card>
            {template.imageHeader && (
              <div className="col-12 mx-auto">
                <Img
                  src={`${config.API_URL}/form-image?filename=${
                    template.imageHeader
                  }`}
                  alt="logo"
                />
              </div>
            )}
            <div
              className="col-12 title text-left pt-3 pb-1"
              style={{ textTransform: 'none' }}
            >
              {template.title}
            </div>
            <hr className="pb-1" />
            <div
              className="col-12 text-left pb-4"
              style={{ whiteSpace: 'pre-line' }}
            >
              <p>{template.content}</p>
            </div>
            <PersonalInformation
              inputFormFields={inputFormFields}
              inputFormFieldsRequired={inputFormFieldsRequired
                .filter(f => f < 20)
                .map(f => String(f % 10))}
              formDesign={formDesign}
            />
            <ThankfulPerson1
              inputFormFields={inputFormFields2}
              inputFormFieldsRequired={inputFormFieldsRequired
                .filter(f => f >= 20 && f < 30)
                .map(f => String(f % 10))}
            />
            <ThankfulPerson2
              inputFormFields={inputFormFields3}
              inputFormFieldsRequired={inputFormFieldsRequired
                .filter(f => f >= 30)
                .map(f => String(f % 10))}
            />
            <div className="mx-auto text-center">
              <Button type="submit" className="col-5 mx-auto mt-3">
                {intl.formatMessage({ ...messages.submit })}
              </Button>
            </div>

            <hr className="mt-5" />
            <div style={{ whiteSpace: 'pre-line' }}>
              <Text
                className="col-12 title"
                text={template.footer}
                noTextTransform
              />
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
}

FormPreviewPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  formPreviewPage: makeSelectFormPreviewPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
)(FormPreviewPage);
