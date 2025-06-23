import React from 'react';
// import PropTypes from 'prop-types';
import './UploadVideoContent.scss';
import { Header, Grid, Segment, Button } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

const UploadVideo4Content = () => (
  <div className="page-content">
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment textAlign="center">
          <Header as="h2">VideoCompleted</Header>
          <Header as="h5">{'VideoHash'}: Qmdh47fh8dktj8h3djfh</Header>
          <Button href="/login" color="red">
            {'Done'}
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  </div>
);

UploadVideo4Content.propTypes = {};

export default withTranslation()(UploadVideo4Content);
