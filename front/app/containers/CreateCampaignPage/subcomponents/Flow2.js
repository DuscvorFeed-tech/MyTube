import React, { useEffect } from 'react';
// import moment from 'moment';
import PropTypes from 'prop-types';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import Form from 'components/Form';
import Card from 'components/Card';
import Button from 'components/Button';
import Tweet from 'components/Tweet';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import TemplatePreview from 'components/TemplatePreview';
import PostTweet from 'components/PostTweet';
import ErrorFormatted from 'components/ErrorFormatted';
import FormPreview from 'containers/FormPreviewPage';
import ColorCircle from 'components/ColorCircle';
import Text from 'components/Text';
import User from 'assets/images/icons/user_primary.png';

import { modalToggler } from 'utils/commonHelper';
import { FormattedMessage } from 'react-intl';
import { tweetTextLengthValidation } from '../../TweetPage/tweetState';

import messages from '../messages';

// eslint-disable-next-line arrow-body-style
const Flow2 = props => {
  const {
    winnerTemplates,
    // loserTemplates,
    // thankyouTemplates,
    formCompleteTemplates,
    formTemplates,
    formFields,
    formFields2,
    formFields3,
    templateToggle,
    setTemplateToggle,
    validatorEffect,
    getContentFromTemplate,
    setModalState,
    previewContent,
    intl,
    snsType,
  } = props;

  const {
    campaignTitle,
    content,
    postTweetViaCamps,
    postId,
    postWinTemplate,
    // postLoseTemplate,
    // postTyTemplate,
    dmWinTemplate,
    // dmLoseTemplate,
    // dmTyTemplate,
    dmFormTemplate,
    formMessageTemplate,
    inputFormFields,
    inputFormFields2,
    inputFormFields3,
    raffleType,
    imageFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    onRemove,
    inputFormFieldsRequired,
  } = validatorEffect;

  const { availableBytes } = tweetTextLengthValidation(
    intl.formatMessage({ ...messages.campaignContent }),
    content,
  );

  const isCheckedTweetViaCamps = postTweetViaCamps.value;

  const linkShow = postId.value && postId.value !== '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <ol>
        {snsType === 1 && (
          <li>
            <div className="row mb-3">
              <div className="col-4">
                <Label htmlFor="postTweetViaCamps">
                  {intl.formatMessage({ ...messages.postTweetViaCamps })}
                </Label>
              </div>
              <div className="col-auto">
                <Checkbox
                  id="postTweetViaCamps"
                  onChange={e => {
                    postTweetViaCamps.setvalue(e.target.checked);
                    if (e.target.checked) {
                      postId.setvalue('');
                    }
                  }}
                  checked={isCheckedTweetViaCamps}
                />
              </div>
              {!postTweetViaCamps.value && (
                <div className="col-auto ml-auto">
                  <Button
                    width="sm"
                    primary
                    small
                    onClick={() => modalToggler('addPostLink')}
                  >
                    {intl.formatMessage({
                      ...messages.addPostLinkButton,
                    })}
                  </Button>
                </div>
              )}
              {!postTweetViaCamps.value && linkShow && (
                <div className="offset-4 col-8 pb-0">
                  <div className="col-12 pt-0">
                    <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                  </div>
                  <div className="pt-0 pl-1">
                    {snsType === 1 ? (
                      <Button
                        link
                        onClick={() => window.open(postId.value, '_blank')}
                      >
                        <Text text={postId.value} className="text-left" />
                      </Button>
                    ) : (
                      <Button
                        link
                        onClick={() => window.open(postId.value, '_blank')}
                      >
                        <Text text={postId.value} className="text-left" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        )}
        {snsType === 1 && (
          <li>
            <div className="row mb-3">
              <div className="col-4">
                {localStorage.getItem('entryMethod') === '1' ? (
                  <Label htmlFor="campaignContent" required>
                    {intl.formatMessage({ ...messages.campaignContent })}
                  </Label>
                ) : (
                  <Label htmlFor="campaignContent">
                    {intl.formatMessage({ ...messages.campaignContent })}
                  </Label>
                )}
              </div>
              <div className="col-8">
                <PostTweet
                  intl={intl}
                  {...content}
                  imagesFile={imageFile}
                  gifFile={gifFile}
                  videoFile={videoFile}
                  uploadFiles={uploadFiles}
                  fileType={fileType}
                  uploadError={uploadError}
                  onRemove={onRemove}
                  availableBytes={availableBytes}
                  disabled={!isCheckedTweetViaCamps}
                />

                {localStorage.getItem('entryMethod') === '1'
                  ? availableBytes >= 0 && <ErrorFormatted {...content.error} />
                  : ''}
                {/* Please check tweet page */}
              </div>
            </div>
          </li>
        )}
        {/* Will only appear if instant fix */}
        {raffleType.value === EnumRaffleTypes.INSTANT && (
          <li>
            <div className="row mb-5">
              <div className="col-4">
                <Label htmlFor="campaignTitle">
                  {intl.formatMessage({ ...messages.post })}
                </Label>
              </div>
              <div className="col-8">
                <div className="my-3">
                  <div className="row my-2">
                    <div className="col-6 pr-0">
                      <Label
                        className="py-0"
                        htmlFor="postWin"
                        subLabel={intl.formatMessage({ ...messages.win })}
                      />
                    </div>
                    <Checkbox
                      id="postWin"
                      onChange={e =>
                        setTemplateToggle({ showPostWin: e.target.checked })
                      }
                      checked={templateToggle.showPostWin}
                    />
                  </div>
                  {/* if checked */}
                  {templateToggle.showPostWin && (
                    <>
                      <Select {...postWinTemplate}>
                        <option value="">
                          {intl.formatMessage(
                            { id: 'M0000008' },
                            {
                              name: intl.formatMessage({
                                ...messages.winnerTemplate,
                              }),
                            },
                          )}
                        </option>
                        {winnerTemplates &&
                          winnerTemplates
                            .filter(x => Number(x.type) === 2)
                            .map(({ id, name }, index) => (
                              <option value={id} key={Number(index)}>
                                {name}
                              </option>
                            ))}
                      </Select>
                      <ErrorFormatted {...postWinTemplate.error} />
                      <Button
                        className="mt-2 mb-4"
                        link
                        onClick={() =>
                          setModalState(
                            'postPreviewModal',
                            getContentFromTemplate(
                              postWinTemplate.value,
                              winnerTemplates,
                            ),
                          )
                        }
                      >
                        {intl.formatMessage({ id: 'preview' })}
                      </Button>
                    </>
                  )}
                  {/* if checked end */}
                  {/* TEMPORARY HIDE LOSE POST */}
                  {/* <div className="row mb-2">
                    <div className="col-6 pr-0">
                      <Label
                        className="py-0"
                        htmlFor="postLose"
                        subLabel={intl.formatMessage({ ...messages.lose })}
                      />
                    </div>
                    <Checkbox
                      id="postLose"
                      onChange={e =>
                        setTemplateToggle({ showPostLose: e.target.checked })
                      }
                      checked={templateToggle.showPostLose}
                    />
                  </div> */}
                  {/* {templateToggle.showPostLose && (
                    <>
                      <Select {...postLoseTemplate}>
                        {loserTemplates &&
                          loserTemplates
                            .filter(x => Number(x.type) === 2)
                            .map(({ id, name }, index) => (
                              <option value={id} key={Number(index)}>
                                {name}
                              </option>
                            ))}
                      </Select>
                      <Button
                        className="mt-2 mb-4"
                        link
                        onClick={() =>
                          setModalState(
                            'postPreviewModal',
                            getContentFromTemplate(
                              postLoseTemplate.value,
                              loserTemplates,
                            ),
                          )
                        }
                      >
                        {intl.formatMessage({ id: 'preview' })}
                      </Button>
                    </>
                  )} */}
                  {/* TEMPORARY HIDE THANK YOU POST */}
                  {/* <div className="row mb-2">
                    <div className="col-6 pr-0">
                      <Label
                        className="py-0"
                        htmlFor="postThankYou"
                        subLabel={intl.formatMessage({ ...messages.thankYou })}
                      />
                    </div>
                    <Checkbox
                      id="postThankYou"
                      onChange={e =>
                        setTemplateToggle({ showPostTy: e.target.checked })
                      }
                      checked={templateToggle.showPostTy}
                    />
                  </div> */}
                  {/* {templateToggle.showPostTy && (
                    <React.Fragment>
                      <Select {...postTyTemplate}>
                        {thankyouTemplates &&
                          thankyouTemplates
                            .filter(x => Number(x.type) === 2)
                            .map(({ id, name }, index) => (
                              <option value={id} key={Number(index)}>
                                {name}
                              </option>
                            ))}
                      </Select>
                      <Button
                        className="mt-2 mb-4"
                        link
                        onClick={() =>
                          setModalState(
                            'postPreviewModal',
                            getContentFromTemplate(
                              postTyTemplate.value,
                              thankyouTemplates,
                            ),
                          )
                        }
                      >
                        {intl.formatMessage({ id: 'preview' })}
                      </Button>
                    </React.Fragment>
                  )} */}
                </div>
              </div>
            </div>
          </li>
        )}
        {/* Will only appear if instant fix end */}
        <li>
          <div className="row mb-5">
            <div className="col-4">
              {snsType === 1 && (
                <Label
                  htmlFor="directMsg"
                  required
                  info
                  tooltip={intl.formatMessage({ id: 'M0000050' })}
                >
                  {intl.formatMessage({ ...messages.directMessage })}
                </Label>
              )}

              {snsType !== 1 && (
                <Label
                  htmlFor="directMsg"
                  required
                  info
                  tooltip={intl.formatMessage({ id: 'M0000050' })}
                >
                  {intl.formatMessage({ ...messages.message })}
                </Label>
              )}
            </div>
            <div className="col-8">
              <div className="row mb-1">
                <div className="col-6 pr-0 pb-2">
                  <Label
                    className="py-0"
                    htmlFor="win"
                    subLabel={intl.formatMessage({ ...messages.win })}
                  />
                </div>
                <Checkbox id="win" checked disabled />
              </div>
              <Select {...dmWinTemplate}>
                <option value="">
                  {intl.formatMessage(
                    { id: 'M0000008' },
                    {
                      name: intl.formatMessage({ ...messages.winnerTemplate }),
                    },
                  )}
                </option>
                {winnerTemplates &&
                  winnerTemplates
                    .filter(x => Number(x.type) === 1)
                    .map(({ id, name }, index) => (
                      <option value={id} key={Number(index)}>
                        {name}
                      </option>
                    ))}
              </Select>
              <ErrorFormatted {...dmWinTemplate.error} />
              <Button
                className="mt-2 mb-4"
                link
                onClick={() =>
                  setModalState(
                    'winTemplateModal',
                    getContentFromTemplate(
                      dmWinTemplate.value,
                      winnerTemplates,
                    ),
                  )
                }
              >
                {intl.formatMessage({ id: 'preview' })}
              </Button>

              {/* if checked */}
              <div>
                {/* TEMPORARY HIDE LOSE DM */}
                {/* <div className="row mb-2">
                  <div className="col-6 pr-0">
                    <Label
                      className="py-0"
                      htmlFor="lose"
                      subLabel={intl.formatMessage({ ...messages.lose })}
                    />
                  </div>
                  <Checkbox
                    id="lose"
                    onChange={e =>
                      setTemplateToggle({ showDMLose: e.target.checked })
                    }
                    checked={templateToggle.showDMLose}
                  />
                </div> */}
                {/* if checked */}
                {/* {templateToggle.showDMLose && (
                  <>
                    <Select {...dmLoseTemplate}>
                      {loserTemplates &&
                        loserTemplates
                          .filter(x => Number(x.type) === 1)
                          .map(({ id, name }, index) => (
                            <option value={id} key={Number(index)}>
                              {name}
                            </option>
                          ))}
                    </Select>
                    <Button
                      className="mt-2 mb-4"
                      link
                      onClick={() =>
                        setModalState(
                          'loseTemplateModal',
                          getContentFromTemplate(
                            dmLoseTemplate.value,
                            loserTemplates,
                          ),
                        )
                      }
                    >
                      {intl.formatMessage({ id: 'preview' })}
                    </Button>
                  </>
                )} */}
                {/* TEMPORARY HIDE THANK YOU DM */}
                {/* <div className="row mb-2">
                  <div className="col-6 pr-0">
                    <Label
                      className="py-0"
                      htmlFor="thankYou"
                      subLabel={intl.formatMessage({ ...messages.thankYou })}
                    />
                  </div>
                  <Checkbox
                    id="thankYou"
                    onChange={e =>
                      setTemplateToggle({ showDMTy: e.target.checked })
                    }
                    checked={templateToggle.showDMTy}
                  />
                </div> */}
                {/* {templateToggle.showDMTy && (
                  <React.Fragment>
                    <Select {...dmTyTemplate}>
                      {thankyouTemplates &&
                        thankyouTemplates
                          .filter(x => Number(x.type) === 1)
                          .map(({ id, name }, index) => (
                            <option value={id} key={Number(index)}>
                              {name}
                            </option>
                          ))}
                    </Select>
                    <Button
                      className="mt-2 mb-4"
                      link
                      onClick={() =>
                        setModalState(
                          'loseTemplateModal',
                          getContentFromTemplate(
                            dmTyTemplate.value,
                            thankyouTemplates,
                          ),
                        )
                      }
                    >
                      {intl.formatMessage({ id: 'preview' })}
                    </Button>
                  </React.Fragment>
                )} */}
                <div className="row mb-2">
                  <div className="col-6 pr-0">
                    <Label
                      className="py-0"
                      htmlFor="formSubmit"
                      subLabel={intl.formatMessage({ ...messages.formSubmit })}
                    />
                  </div>
                  <Checkbox
                    id="formSubmit"
                    onChange={e =>
                      setTemplateToggle({ showDMForm: e.target.checked })
                    }
                    checked={templateToggle.showDMForm}
                  />
                </div>
                {templateToggle.showDMForm && (
                  <React.Fragment>
                    <Select {...dmFormTemplate}>
                      <option value="">
                        {intl.formatMessage(
                          { id: 'M0000008' },
                          {
                            name: intl.formatMessage({
                              ...messages.FormTemplate,
                            }),
                          },
                        )}
                      </option>
                      {formCompleteTemplates &&
                        formCompleteTemplates
                          .filter(x => Number(x.type) === 1)
                          .map(({ id, name }, index) => (
                            <option value={id} key={Number(index)}>
                              {name}
                            </option>
                          ))}
                    </Select>
                    <ErrorFormatted {...dmFormTemplate.error} />
                    <Button
                      className="mt-2"
                      link
                      onClick={() =>
                        setModalState(
                          'loseTemplateModal',
                          getContentFromTemplate(
                            dmFormTemplate.value,
                            formCompleteTemplates,
                          ),
                        )
                      }
                    >
                      {intl.formatMessage({ id: 'preview' })}
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="row mb-5">
            <div className="col-4">
              <Label
                htmlFor="campaignTitle"
                required
                info
                tooltip={intl.formatMessage({ id: 'M0000051' })}
              >
                {intl.formatMessage({ ...messages.form })}
              </Label>
            </div>
            <div className="col-8">
              <Select {...formMessageTemplate}>
                <option value="">
                  {intl.formatMessage({ id: 'M0000061' })}
                </option>
                {formTemplates &&
                  formTemplates.map(({ id, name }, index) => (
                    <option value={id} key={Number(index)}>
                      {name}
                    </option>
                  ))}
              </Select>
              <ErrorFormatted {...formMessageTemplate.error} />
              <div className="my-3">
                <div className="row">
                  <Label className="col-6 pr-0 pb-2">
                    {intl.formatMessage({ ...messages.personalInformation })}
                  </Label>

                  <Label>{intl.formatMessage({ ...messages.formShow })}</Label>

                  <Label className="col-auto ml-auto">
                    {intl.formatMessage({ ...messages.formRequired })}
                  </Label>
                </div>
                {formFields &&
                  formFields.map(({ name, value }) => (
                    <div className="row my-2">
                      <div className="col-6 pr-0">
                        <Label
                          className="py-0"
                          htmlFor={name}
                          subLabel={intl.formatMessage(
                            { id: `formFields${value}` },
                            { defaultMessage: name },
                          )}
                        />
                      </div>
                      <div className="col-4">
                        <Checkbox
                          id={name}
                          name="formFields"
                          {...inputFormFields}
                          value={value}
                          checked={inputFormFields.value.includes(
                            value.toString(),
                          )}
                        />
                      </div>
                      <div className="col-auto ml-auto">
                        <Checkbox
                          className="col-auto ml-auto"
                          id={`${name}formFieldsRequired`}
                          name="formFieldsRequired"
                          {...inputFormFieldsRequired}
                          value={value}
                          checked={inputFormFieldsRequired.value.includes(
                            value.toString(),
                          )}
                        />
                      </div>
                    </div>
                  ))}
                {formFields && <ErrorFormatted {...inputFormFields.error} />}
              </div>
              {false && formFields2 && formFields2.length > 0 && (
                <div className="my-3">
                  <Label>
                    {intl.formatMessage({ ...messages.thankfulPerson })} 1
                  </Label>
                  {formFields2.map(({ name, value }) => (
                    <div className="row my-2">
                      <div className="col-6 pr-0">
                        <Label
                          className="py-0"
                          htmlFor={name}
                          subLabel={intl.formatMessage(
                            { id: `formFields${value}` },
                            { defaultMessage: name },
                          )}
                        />
                      </div>
                      <Checkbox
                        id={name}
                        name="formFields"
                        {...inputFormFields2}
                        value={value}
                        checked={inputFormFields2.value.includes(
                          value.toString(),
                        )}
                      />
                    </div>
                  ))}
                  <ErrorFormatted {...inputFormFields2.error} />
                </div>
              )}
              {false && formFields3 && formFields3.length > 0 && (
                <div className="my-3">
                  <Label>
                    {intl.formatMessage({ ...messages.thankfulPerson })} 2
                  </Label>
                  {formFields3.map(({ name, value }) => (
                    <div className="row my-2">
                      <div className="col-6 pr-0">
                        <Label
                          className="py-0"
                          htmlFor={name}
                          subLabel={intl.formatMessage(
                            { id: `formFields${value}` },
                            { defaultMessage: name },
                          )}
                        />
                      </div>
                      <Checkbox
                        id={name}
                        name="formFields"
                        {...inputFormFields3}
                        value={value}
                        checked={inputFormFields3.value.includes(
                          value.toString(),
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button
                className="mb-4"
                link
                onClick={() => modalToggler('formPreviewModal')}
              >
                {intl.formatMessage({ ...messages.formPreview })}
              </Button>
            </div>
          </div>
        </li>
      </ol>
      <Modal id="winTemplateModal" dismissable size="lg">
        <ModalToggler modalId="winTemplateModal" />
        <TemplatePreview
          content={previewContent.content || ''}
          uploadFiles={previewContent.img || []}
        />
        <div className="row justify-content-center">
          {/* <div className="col-auto">
            <Button
              secondary
              width="md"
              className="mr-2"
              dataDismiss="modal"
              onClick={() => modalToggler('updateTemplate')}
            >
              {intl.formatMessage(
                { id: 'T0000020' },
                { name: intl.formatMessage({ ...messages.template }) },
              )}
            </Button>
            <Button
              width="md"
              dataDismiss="modal"
              onClick={() => modalToggler('newTemplate')}
            >
              {intl.formatMessage(
                { id: 'T0000021' },
                { name: intl.formatMessage({ ...messages.template }) },
              )}
            </Button>
          </div> */}
        </div>
      </Modal>

      <Modal id="updateTemplate" dismissable size="lg">
        <ModalToggler modalId="updateTemplate" />
        <div className="row mb-3">
          <div className="col-4">
            <Label>{intl.formatMessage({ ...messages.templateContent })}</Label>
          </div>
          <div className="col-8">
            <PostTweet intl={intl} content={previewContent.content} />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-auto">
            <Button secondary width="sm" className="mr-2">
              {intl.formatMessage({ ...messages.back })}
            </Button>
            <Button width="sm">
              {intl.formatMessage({ ...messages.save })}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal id="newTemplate" size="lg">
        <ModalToggler modalId="newTemplate" />
        <Form className="mb-3">
          <Card>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="templateName" required>
                  {intl.formatMessage({ ...messages.templateName })}
                </Label>
              </div>
              <div className="col-8">
                <Input id="templateName" name="templateName" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="type" required>
                  {intl.formatMessage({ ...messages.type })}
                </Label>
              </div>
              <div className="col-8">
                <Select id="type" name="type">
                  <option>test</option>
                </Select>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="cate" required>
                  {intl.formatMessage({ ...messages.category })}
                </Label>
              </div>
              <div className="col-8">
                <Select id="cate" name="cate">
                  <option>test</option>
                </Select>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="desc">
                  {intl.formatMessage({ ...messages.description })}
                </Label>
              </div>
              <div className="col-8">
                <Input id="desc" name="desc" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="content" required>
                  {intl.formatMessage({ ...messages.templateContent })}
                </Label>
              </div>
              <div className="col-8">
                <PostTweet intl={intl} />
              </div>
            </div>
          </Card>
        </Form>
        <div className="row justify-content-center">
          <div className="col-auto">
            <Button secondary width="sm" className="mr-2" dataDismiss="modal">
              {intl.formatMessage({ ...messages.back })}
            </Button>
            <Button width="sm" dataDismiss="modal">
              {intl.formatMessage({ ...messages.save })}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal id="loseTemplateModal" size="md" dismissable>
        <ModalToggler modalId="loseTemplateModal" />
        <TemplatePreview
          content={previewContent.content || ''}
          uploadFiles={previewContent.img || []}
        />
      </Modal>

      <Modal id="formPreviewModal" size="md" dismissable>
        <ModalToggler modalId="formPreviewModal" />
        <FormPreview
          inputFormFields={inputFormFields.value}
          inputFormFields2={[]}
          inputFormFields3={[]}
          inputFormFieldsRequired={inputFormFieldsRequired.value.map(
            f => `1${f}`,
          )}
          template={(formTemplates || []).find(
            ({ id }) => id === Number(formMessageTemplate.value),
          )}
        />
      </Modal>
      <Modal id="postPreviewModal" size="md" dismissable>
        <ModalToggler modalId="postPreviewModal" />
        <Tweet
          userImg={User}
          name="sample"
          content={previewContent.content || ''}
          dateTime="12/09/2018"
          files={previewContent.img.length > 0 ? previewContent.img : null}
          onDelete={false}
        />
      </Modal>
      <Modal id="addPostLink" size="sm" dismissable>
        <ModalToggler modalId="addPostLink" />
        <Form>
          <Label required>
            <FormattedMessage
              {...messages.addPostLinkMessage}
              values={{ campaignName: campaignTitle }}
            />
          </Label>
          <Input id="postId" name="postId" {...postId} />
          <Button
            type="submit"
            className="col-5 mx-auto mt-3"
            onClick={() => modalToggler('addPostLink')}
          >
            {intl.formatMessage({ ...messages.submit })}
          </Button>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

Flow2.propTypes = {
  // theme: PropTypes.any,
  winnerTemplates: PropTypes.array,
  loserTemplates: PropTypes.array,
  thankyouTemplates: PropTypes.array,
  formCompleteTemplates: PropTypes.array,
  formTemplates: PropTypes.array,
  validatorEffect: PropTypes.object,
  showLose: PropTypes.bool,
  showTY: PropTypes.bool,
  setShowLose: PropTypes.func,
  setShowTY: PropTypes.func,
  formFields: PropTypes.array,
  formFields2: PropTypes.array,
  formFields3: PropTypes.array,
  templateToggle: PropTypes.object,
  setTemplateToggle: PropTypes.func,
  getContentFromTemplate: PropTypes.func,
  setModalState: PropTypes.func,
  previewContent: PropTypes.object,
  intl: PropTypes.any,
  snsType: PropTypes.number,
};

export default Flow2;
