import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Grid,
  Segment,
  Form,
  Image,
  GridColumn,
  Select,
  Label,
  Button,
} from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

const UploadVideo2Content = ({ languageOptions, gotoPage3 }) => (
  <div className="page-content">
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment>
          <Header as="h2" className="video-title2 header-border">
            Video Title
          </Header>
          <Form>
            <Grid>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Form.Input label="Details" placeholder="Title" />
                  <Form.TextArea placeholder="Description" />
                  <Header as="h5">Thumbnail</Header>
                  <div className="thumbnail-content">
                    <Label className="thumbnail-wrap">
                      <input
                        className="file-upload-thumbnail"
                        type="file"
                        accept="video/*"
                      />
                    </Label>
                    <Label className="thumbnail-wrap">
                      <input
                        className="file-upload-thumbnail"
                        type="file"
                        accept="video/*"
                      />
                    </Label>
                    <Label className="thumbnail-wrap">
                      <input
                        className="file-upload-thumbnail"
                        type="file"
                        accept="video/*"
                      />
                    </Label>
                    <Label className="thumbnail-wrap">
                      <input
                        className="file-upload-thumbnail"
                        type="file"
                        accept="video/*"
                      />
                    </Label>
                    <Label className="thumbnail-wrap">
                      <input
                        className="file-upload-thumbnail"
                        type="file"
                        accept="video/*"
                      />
                    </Label>
                  </div>
                </Grid.Column>
                <GridColumn width={5}>
                  <Image src="http://via.placeholder.com/210x118" />
                  <Header as="h5">
                    {'VideoHash'}: <span>Qmdh47fh8dktj8h3djfh</span>
                  </Header>
                  <Select
                    placeholder="PrimaryLanguage"
                    options={languageOptions}
                  />
                  <div className="add-margin-top">
                    <Button color="red" fluid size="large" onClick={gotoPage3}>
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

UploadVideo2Content.propTypes = {
  languageOptions: PropTypes.array,
  gotoPage3: PropTypes.func,
};

export default withTranslation()(UploadVideo2Content);
