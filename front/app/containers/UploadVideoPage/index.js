/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
import { config } from 'utils/config';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  Form,
  Label,
  Input,
  TextArea,
  Image,
  Radio,
  Checkbox,
} from 'semantic-ui-react';
import AdminLocal from 'utils/AdminLocal';
import FileUpload from 'components/FileUpload';
import LoadingIndicator from 'components/LoadingIndicator';
import Select from 'components/Select';
import { forwardTo } from 'helpers/forwardTo';
import ErrorFormatted from 'components/ErrorFormatted';
import makeSelectUploadVideoPage, {
  makeSelectErrors,
  makeSelectLoading,
  makeSelectVideoResponse,
  makeSelectCategories,
  makeSelectCategoryID,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import {
  submitUpload,
  loadThumbnail,
  videoProcess,
  loadCategory,
  setCategory,
} from './actions';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
import 'semantic-ui-css/semantic.min.css';
import './UploadVideoContent/UploadVideoContent.scss';
import messages from './messages';
import UploadVideoSuccessModal from './subcomponents/UploadVideoSuccess';
import './UploadVideoPage.scss';

export function UploadVideoPage({
  intl,
  onSubmit,
  userAccount,
  loading,
  errors,
  // loadImage,
  processVideo,
  videoResponse,
  loadCategories,
  categoriesResponse,
  setCategoryId,
  categoryId,
}) {
  useInjectReducer({ key: 'uploadVideoPage', reducer });
  useInjectSaga({ key: 'uploadVideoPage', saga });

  const validator = validation(intl);
  const title = useValidation('', validator.title);
  const description = useValidation('', validator.description);
  const videoFile = useValidation('', validator.videoFile);
  const videoThumbnail = useValidation('', validator.videoThumbnail);
  const invalid = !isValid([title, description, videoFile]);
  const videoCategoryId = useValidation('', validator.VideoCategoryId);
  const antiForgeryLicense = useValidation('', validator.antiForgeryLicense);
  const customVideoThumbnail = useValidation(
    '',
    validator.customVideoThumbnail,
  );
  const submitter = useSubmitEffect(
    [
      onSubmit,
      [
        title.value,
        description.value,
        videoFile.value,
        videoThumbnail.value,
        videoCategoryId.value,
        customVideoThumbnail.value,
        antiForgeryLicense.value,
      ],
    ],
    () => !invalid,
  );

  const supportVideoFormat = config.SUPPORTED_VIDEO_FORMAT.split(',')
    .map(format => `.${format}`)
    .join(',');

  useEffect(() => {
    if (userAccount===null) {
      forwardTo('login');
    }
    loadCategories();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  // if (videoResponse && videoResponse.thumbnails) {
  //  videoResponse.thumbnails.map(key => loadImage(key));
  // }

  return (
    <main className="container-fluid">
      <section className="upload-section">
        <div className="upload-box">
          <div className="row">
            <div className="col-12">
              <h2>{intl.formatMessage({ ...messages.uploadVidoeFile })}</h2>
            </div>
          </div>
          <Form>
            <div className="row">
              <div className="col-12">
                  <h4>
                    {intl.formatMessage({ ...messages.selectVideoTitle })}
                  </h4>
                <Form.Field>
                  <FileUpload
                    name="videoFile"
                    label={intl.formatMessage({ ...messages.selectFile })}
                    accept={supportVideoFormat}
                    {...videoFile}
                    onChange={e => processVideo(e)}
                    className="btn-upload"
                  />
                  {videoResponse ? (
                    <Label className="pl-0">
                      {videoResponse.data.videoFileName}
                    </Label>
                  ) : null}
                  {errors && errors.VideoFile && (
                    <Label pointing>
                      <ErrorFormatted errors={errors} name="VideoFile" />
                    </Label>
                  )}
                </Form.Field>
              </div>
              <div className="col-12">
               <h4> {intl.formatMessage({ ...messages.title })} (Required)</h4>
                <Form.Field>
                  <Input
                    placeholder={intl.formatMessage({ ...messages.title })}
                    type="text"
                    name="title"
                    {...title}
                    onKeyDown={submitter.onPressedEnter}
                    className="inpu-textt"
                  />
                  {errors && errors.Title && (
                    <Label pointing>
                      {intl.formatMessage({ ...messages.E0000075 })}
                    </Label>
                  )}
                </Form.Field>
              </div>
              <div className="col-12">
               <h4> {intl.formatMessage({
                      ...messages.description,
                    })}</h4>
                <Form.Field>
                  <TextArea
                    placeholder={intl.formatMessage({
                      ...messages.description,
                    })}
                    name="description"
                    type="text"
                    {...description}
                    onKeyDown={submitter.onPressedEnter}
                  />
                  {errors && errors.Description && (
                    <Label pointing>
                      <ErrorFormatted errors={errors} name="Description" />
                    </Label>
                  )}
                </Form.Field>
              </div>
              {/* <div className="col-12">
                <Form.Field>
                  <Select
                    borderRadius
                    onChange={e => setCategoryId(e)}
                    value={categoryId}
                  >
                    <option key="">
                      {intl.formatMessage({ ...messages.category })}
                    </option>
                    {categoriesResponse &&
                      categoriesResponse.list &&
                      categoriesResponse.list.map((t, index) => (
                        <option key={Number(index)} value={t.id}>
                          {t.category}
                        </option>
                      ))}
                  </Select>
                  {errors && errors.videoCategoryId && (
                    <Label pointing>
                      {intl.formatMessage({ ...messages.E0000074 })}
                    </Label>
                  )}
                </Form.Field>
              </div>
              <div className="col-12">
                <Form.Field>
                  <Checkbox
                    type="checkbox"
                    name="antiForgeryLicense"
                    value="1"
                    id="antiForgeryLicense"
                    {...antiForgeryLicense}
                    label={intl.formatMessage({
                      ...messages.antiForgeryLicense,
                    })}
                  />
                </Form.Field>
              </div> */}
              <div className="col-12">
                <div className="col-12 thumbnail-group">
                  <h4>
                    {intl.formatMessage({ ...messages.selectThumbnailTitle })}
                  </h4>
                  <Form.Field>
                    <FileUpload
                      name="customVideoThumbnail"
                      label={intl.formatMessage({ ...messages.selectFile })}
                      accept="images/*"
                      {...customVideoThumbnail}
                    />
                    {errors && errors.customVideoThumbnail && (
                      <Label pointing>
                        {intl.formatMessage({ ...messages.E0000074 })}
                      </Label>
                    )}
                  </Form.Field>
                  {customVideoThumbnail.value &&
                    customVideoThumbnail.value.name && (
                    <Form.Field>
                      <Radio
                        // eslint-disable-next-line prettier/prettier
                        type="radio"
                        label={customVideoThumbnail.value.name}
                        name="videoThumbnail"
                        id={customVideoThumbnail.value.name}
                        {...videoThumbnail}
                        value={customVideoThumbnail.value.name}
                      // eslint-disable-next-line prettier/prettier
                      />
                    </Form.Field>
                  )}
                  {videoResponse &&
                    videoResponse.data.thumbnails &&
                    videoResponse.data.thumbnails.map(thumb => (
                      <Form.Field>
                        <Radio
                          type="radio"
                          label={thumb}
                          name="videoThumbnail"
                          id={thumb}
                          {...videoThumbnail}
                          value={thumb}
                        />
                        <Image
                          className="thumbnailImg"
                          src={`${
                            config.LOAD_THUMBNAIL
                          }/${thumb}/${AdminLocal.getAdminToken()}`}
                        />
                      </Form.Field>
                    ))}
                  {errors && errors.VideoThumbnail && (
                    <Label pointing>
                      <ErrorFormatted errors={errors} name="VideoThumbnail" />
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-12 col-submit">
                <button
                  color="red"
                  fluid
                  size="large"
                  type="submit"
                  className="btn-charcoal"
                  // disabled={submitter.submitting}
                  {...submitter}
                >
                  {intl.formatMessage({ ...messages.publish })}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </section>
      <UploadVideoSuccessModal />
    </main>
  );
}

UploadVideoPage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  userAccount: PropTypes.any,
  loading: PropTypes.bool,
  loadImage: PropTypes.func,
  processVideo: PropTypes.func,
  videoResponse: PropTypes.any,
  categoriesResponse: PropTypes.any,
  loadCategories: PropTypes.func,
  categoryId: PropTypes.number,
  setCategoryId: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  registerPage: makeSelectUploadVideoPage(),
  errors: makeSelectErrors(),
  loading: makeSelectLoading(),
  videoResponse: makeSelectVideoResponse(),
  categoriesResponse: makeSelectCategories(),
  categoryId: makeSelectCategoryID(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async (values, onSubmitted) => {
      const [
        title,
        description,
        videoFile,
        videoThumbnail,
        videoCategoryId,
        customVideoThumbnail,
        antiForgeryLicense,
      ] = values;
      dispatch(
        submitUpload(
          {
            title,
            description,
            videoFile,
            videoThumbnail,
            videoCategoryId,
            customVideoThumbnail,
            antiForgeryLicense,
          },
          onSubmitted,
        ),
      );
    },
    loadImage: filename => {
      dispatch(loadThumbnail(filename));
    },
    processVideo: videoFile => {
      dispatch(videoProcess(videoFile.target.files[0]));
    },
    loadCategories: () => {
      dispatch(loadCategory());
    },
    setCategoryId: e => {
      dispatch(setCategory(e.target.value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  injectIntl,
)(UploadVideoPage);
