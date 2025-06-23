import React from 'react';
import PropTypes from 'prop-types';
import './UploadVideoContent.scss';
import {
  Header,
  Grid,
  Segment,
  Form,
  Image,
  GridColumn,
  Select,
  Button,
} from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

const UploadVideo3Content = ({ gotoPage2, gotoPage4 }) => (
  <div className="page-content">
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment>
          <Header as="h2" className="video-title3 header-border">
            Video Title
          </Header>
          <Form>
            <Grid>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header as="h5" className="select-title">
                    {'Category'}
                  </Header>
                  <Select
                    placeholder="Music and Arts"
                    className="select-page3"
                  />
                  <Header as="h5" className="select-title">
                    {'LicenseDistribution'}
                  </Header>
                  <Select
                    placeholder="Creative commons license"
                    className="select-page3"
                  />
                  <Header as="h5" className="select-title">
                    {'CommentRating'}
                  </Header>
                  <Select
                    placeholder="Hide all Comments"
                    className="select-page3"
                  />
                  <div className="add-margin-top">
                    <Form.Checkbox label="PrivacyPolicy" />
                  </div>
                </Grid.Column>
                <GridColumn width={5}>
                  <Image src="http://via.placeholder.com/210x118" />
                  <Header as="h5">
                    {'VideoHash'}: <span>Qmdh47fh8dktj8h3djfh</span>
                  </Header>
                  <div className="add-margin-top">
                    <Button color="red" onClick={gotoPage2}>
                      {'Back'}
                    </Button>
                    <Button color="red" onClick={gotoPage4}>
                      {'Next'}
                    </Button>
                  </div>
                </GridColumn>
              </Grid.Row>
            </Grid>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  </div>
);

UploadVideo3Content.propTypes = {
  gotoPage2: PropTypes.func,
  gotoPage4: PropTypes.func,
};

export default withTranslation()(UploadVideo3Content);
