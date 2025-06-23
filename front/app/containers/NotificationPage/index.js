/**
 *
 * NotificationPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

// components
import Card from 'components/Card';
import Text from 'components/Text';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectNotificationPage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export function NotificationPage() {
  useInjectReducer({ key: 'notificationPage', reducer });
  useInjectSaga({ key: 'notificationPage', saga });

  return (
    <div>
      <Card title="Notifications">
        <div className="mb-4">
          <div className="row mx-3 border-bottom align-items-center">
            <div className="col-6 px-5 pt-3 pb-4">
              <Text text="Campaign A is now posted." />
            </div>
            <div className="col-6 px-5 pt-3 pb-4 text-right">
              <div className="justify-content-center">
                <Text text="Just Now." />
              </div>
            </div>
          </div>
          <div className="row mx-3 border-bottom align-items-center">
            <div className="col-6 px-5 pt-4 pb-4">
              <Text text="Campaign A is now posted." />
            </div>
            <div className="px-5 pt-4 pb-4 text-right ml-auto">
              <div className="text-center">
                <Text text="11/10/2019" className="d-block" />
                <Text text="12:34 PM" className="d-block" />
              </div>
            </div>
          </div>
          <div className="row mx-3 border-bottom align-items-center">
            <div className="col-6 px-5 pt-4 pb-4">
              <Text text="Campaign A is now posted." />
            </div>
            <div className="px-5 pt-4 pb-4 text-right ml-auto">
              <div className="text-center">
                <Text text="11/10/2019" className="d-block" />
                <Text text="12:34 PM" className="d-block" />
              </div>
            </div>
          </div>
          <div className="row mx-3 border-bottom align-items-center">
            <div className="col-6 px-5 pt-4 pb-4">
              <Text text="Campaign A is now posted." />
            </div>
            <div className="px-5 pt-4 pb-4 text-right ml-auto">
              <div className="text-center">
                <Text text="11/10/2019" className="d-block" />
                <Text text="12:34 PM" className="d-block" />
              </div>
            </div>
          </div>
          <div className="row mx-3 border-bottom align-items-center">
            <div className="col-6 px-5 pt-4 pb-4">
              <Text text="Campaign A is now posted." />
            </div>
            <div className="px-5 pt-4 pb-4 text-right ml-auto">
              <div className="text-center">
                <Text text="11/10/2019" className="d-block" />
                <Text text="12:34 PM" className="d-block" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

NotificationPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notificationPage: makeSelectNotificationPage(),
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
)(NotificationPage);
