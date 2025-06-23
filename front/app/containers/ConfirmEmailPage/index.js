/**
 *
 * ConfirmEmailPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import { compose } from 'redux';

import { withTheme } from 'styled-components';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectConfirmEmailPage, { makeSelectSuccess } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { confirmEmail } from './actions';
import './ConfirmEmailPage.scss';
import 'semantic-ui-css/semantic.min.css';
export function ConfirmEmailPage(props) {
  useInjectReducer({ key: 'confirmEmailPage', reducer });
  useInjectSaga({ key: 'confirmEmailPage', saga });

  const {
    intl,
    confirmEmailBtn,
    success,
    routeParams: { key, confirmcode },
  } = props;

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (key && key.trim().length > 0) confirmEmailBtn(key, confirmcode);
  }, []);

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment>
            <Header as="h2" className="header">
              {success
                ? intl.formatMessage({ ...messages.headerTitle })
                : intl.formatMessage({ ...messages.confirmError })}
            </Header>
            <Button color="red" fluid size="large" href="/login">
              {intl.formatMessage({ ...messages.login })}
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

ConfirmEmailPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  confirmEmailBtn: PropTypes.func,
  success: PropTypes.bool,
  routeParams: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  ConfirmEmailPage: makeSelectConfirmEmailPage(),
  success: makeSelectSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    confirmEmailBtn: (key, confirmcode) => {
      dispatch(confirmEmail({ key, confirmcode }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withTheme,
  memo,
  injectIntl,
)(ConfirmEmailPage);
