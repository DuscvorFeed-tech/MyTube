/**
 *
 * ConfirmForgotPasswordEmailFailPage
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import { compose } from 'redux';

import Layout from 'components/Layout';
import { withTheme } from 'styled-components';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import makeSelectConfirmForgotPasswordEmailFailPage, {
  makeSelectSuccess,
} from './selectors';
import messages from './messages';
import { confirmEmail } from './actions';
import './ConfirmForgotPasswordEmailFailPage.scss';

export function ConfirmForgotPasswordEmailFailPage(props) {
  const { intl } = props;

  return (
    <Layout isFullPage>
      <div className="page-content">
        <Grid className="grid">
          <Grid.Column className="grid-column">
            <Segment>
              <Header as="h2" className="header">
                {intl.formatMessage({ ...messages.confirmError })}
              </Header>
              <div className="row mt-5">
                <div className="col-md-5 mx-auto mb-3">
                  <Button color="red" fluid size="large" href="/login">
                    {intl.formatMessage({ ...messages.login })}
                  </Button>
                </div>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
}

ConfirmForgotPasswordEmailFailPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ConfirmForgotPasswordEmailFailPage: makeSelectConfirmForgotPasswordEmailFailPage(),
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
)(ConfirmForgotPasswordEmailFailPage);
