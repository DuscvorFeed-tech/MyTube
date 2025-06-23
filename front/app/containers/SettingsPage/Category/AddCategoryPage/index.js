/**
 *
 * AddCategoryPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Title from 'components/Title';
import Label from 'components/Label';
import Button from 'components/Button';
import Input from 'components/Input';
import Select from 'components/Select';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAddCategoryPage from './selectors';
// import ErrorFormatted from '../../../../components/ErrorFormatted';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
// import useValidation, { isValid } from '../../../../library/validator';
// import useSubmitEffect from '../../../../library/submitter';
import PATH from '../../../path';

export function AddCategoryPage({ theme }) {
  useInjectReducer({ key: 'addCategoryPage', reducer });
  useInjectSaga({ key: 'addCategoryPage', saga });

  return (
    <div>
      <Helmet>
        <title>Add Category Page</title>;
        <meta name="description" content="Description of Add Category Page" />
      </Helmet>
      <div className="col-md-12 mb-3">
        <Card title="General Settings" className="p-0">
          <div className="d-flex p-3">
            <div className="p-5 d-block col-lg-7">
              <div className="row mb-4">
                <Title
                  main
                  size={theme.fontSize.md}
                  color={theme.secondaryDark}
                >
                  Add Category
                </Title>
              </div>
              <div className="row align-items-baseline pb-3 col-lg-12">
                <div className="col-md-4 text-left" />
                <div className="col-md-8 text-left">
                  {/* {errors && (
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                      />
                    )} */}
                </div>
              </div>
              <div className="row">
                <div className="row align-items-baseline pb-3 col-lg-12">
                  <div className="col-md-4 text-left">
                    <Label required>Category Name</Label>
                  </div>
                  <div className="col-md-8 text-left">
                    <Input name="categoryName" />
                    {/* <ErrorFormatted {...labelName.error} /> */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="row align-items-baseline pb-3 col-lg-12">
                  <div className="col-md-4 text-left">
                    <Label>Type</Label>
                  </div>
                  <div className="col-md-8 text-left">
                    <Select>
                      <option>Post</option>
                      <option>Message</option>
                    </Select>
                    {/* <ErrorFormatted {...color.error} /> */}
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
                  width="sm"
                  onClick={() => forwardTo(PATH.SETTINGS_CATEGORY)}
                >
                  Cancel
                </Button>
              </div>
              <div className="col-auto ml-auto">
                <Button width="sm">Add</Button>
              </div>
            </div>
          </div>
          <div>
            <Modal id="AddCategorySuccess" dismissable>
              <ModalToggler modalId="AddCategorySuccess" />
              <div className="text-center">
                <p />
                <Button
                  primary
                  className="col-4"
                  dataDismiss="modal"
                  onClick={() => forwardTo(PATH.SETTINGS_CATEGORY)}
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

AddCategoryPage.propTypes = {
  theme: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  addCategoryPage: makeSelectAddCategoryPage(),
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
  withTheme,
)(AddCategoryPage);
