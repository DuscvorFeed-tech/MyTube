import React, { memo } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import { compose } from 'redux';

import { withTheme } from 'styled-components';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import makeSelectConfirmEmailSuccessPage from './selectors';
import messages from '../../messages';
import './ConfirmEmailSuccessPage.scss';
import 'semantic-ui-css/semantic.min.css';

export function ConfirmEmailSuccessPage(props) {
  const { intl } = props;

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment>
            <Header as="h2" className="header">
              {intl.formatMessage({ ...messages.headerTitle })}
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
  );
}

ConfirmEmailSuccessPage.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ConfirmEmailSuccessPage: makeSelectConfirmEmailSuccessPage(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  withTheme,
  memo,
  injectIntl,
)(ConfirmEmailSuccessPage);
