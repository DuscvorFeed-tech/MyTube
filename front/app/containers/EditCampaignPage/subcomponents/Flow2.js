/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
// import moment from 'moment';
import PropTypes from 'prop-types';
import Label from 'components/Label';
import Input from 'components/Input';
import Text from 'components/Text';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import Form from 'components/Form';
import Button from 'components/Button';
import PostTweet from 'components/PostTweet';
import ErrorFormatted from 'components/ErrorFormatted';
import ColorCircle from 'components/ColorCircle';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { modalToggler, nonUrlSearch } from 'utils/commonHelper';
import { FormattedMessage } from 'react-intl';
import Modals from './Modals';
import messages from '../messages';

const Flow2 = props => {
  const {
    intl,
    isSavedSched,
    filterFormFields,
    fields: {
      tweetUploadFile: {
        imageFile,
        gifFile,
        videoFile,
        uploadFiles,
        fileType,
        uploadError,
        onRemove,
      },
      flow1Fields: {
        raffleState: { raffle_type },
      },
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

      templateToggle,
      setTemplateToggle,

      sns_post_content,
      inputFormFieldsRequired,
    },
    store: {
      winTempList,
      // loseTempList,
      // tyTempList,
      formCompTempList,
      formList,
      onGetTemplate,
      tempDetails,
      campDetails,
      commonTypes: { FormFields, FormFields2, FormFields3, CampaignStatus },
      snsType,
      userAccount,
    },
    validatorEffect,
  } = props;
  const snsAccountName = userAccount.primary.name;
  const { postId } = validatorEffect;

  const campstatus =
    CampaignStatus && campDetails
      ? CampaignStatus.filter(t => t.value === campDetails.status)
      : [];

  const linkShow = postId.value && postId.value !== '';
  const isScheduledCampaign = campstatus.length && campstatus[0].value === 1;
  const showTweetLink =
    templateToggle.checkedTweetViaCamps === false &&
    !linkShow &&
    campDetails.fake_post === 0;
  const { showThankful } = templateToggle;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <Modals
        intl={intl}
        form={{
          formMessageTemplate,
          inputFormFields: inputFormFields.value.toString(),
          inputFormFields2: showThankful
            ? inputFormFields2.value.toString()
            : [],
          inputFormFields3: showThankful
            ? inputFormFields3.value.toString()
            : [],
          formList,
          inputFormFieldsRequired: inputFormFieldsRequired.value,
          formDesign: campDetails.form_design,
        }}
        tempDetails={tempDetails}
        campaignId={campDetails.id}
      />
      <ol>
        {/* Will only appear if Scheduled Campaign */}
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
                  onChange={e =>
                    setTemplateToggle({
                      ...templateToggle,
                      ...{
                        checkedTweetViaCamps: e.target.checked,
                      },
                    })
                  }
                  disabled={!isScheduledCampaign}
                  checked={templateToggle.checkedTweetViaCamps}
                />
              </div>
              {(isScheduledCampaign || campDetails.status === 9) &&
                templateToggle.checkedTweetViaCamps === false && (
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
              {templateToggle.checkedTweetViaCamps === false && linkShow && (
                <div className="offset-4 col-8 pb-0 pl-1">
                  <div className="col-12 pt-0 ml-2">
                    <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                  </div>
                  <div className="col-12 pt-0">
                    <Button
                      link
                      onClick={() => window.open(postId.value, '_blank')}
                    >
                      <Text text={postId.value} />
                    </Button>
                  </div>
                </div>
              )}
              {showTweetLink && campDetails.post_id && (
                <div className="offset-4 col-8 pb-0 pl-1">
                  <div className="col-12 pt-0 ml-2">
                    <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                  </div>
                  <div className="col-12 pt-0">
                    <Button
                      link
                      onClick={() =>
                        window.open(
                          'https://twitter.com/'
                            .concat(snsAccountName)
                            .concat('/status/')
                            .concat(nonUrlSearch(campDetails.post_id)),
                          '_blank',
                        )
                      }
                    >
                      <Text
                        text={'https://twitter.com/'
                          .concat(snsAccountName)
                          .concat('/status/')
                          .concat(nonUrlSearch(campDetails.post_id))}
                      />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </li>
        )}

        <li>
          <div className="row mb-3">
            <div className="col-4">
              <Label htmlFor="campaignContent" required={templateToggle.checkedTweetViaCamps === true}>
                {intl.formatMessage({ ...messages.campaignContent })}
              </Label>
            </div>

            <div className="col-8">
              <PostTweet
                intl={intl}
                {...sns_post_content}
                disabled={!isSavedSched && !isScheduledCampaign || templateToggle.checkedTweetViaCamps === false}
                imagesFile={imageFile}
                gifFile={gifFile}
                videoFile={videoFile}
                uploadFiles={uploadFiles.map(m =>
                  Array.isArray(m.url) ? m.url[0] : m.url,
                )}
                fileType={fileType}
                uploadError={uploadError}
                onRemove={onRemove}
                showDelete={isSavedSched}
              />
              {/* Please check tweet page */}
            </div>
          </div>
        </li>
        {/* Will only appear if instant fix */}
        {raffle_type.value === Number(EnumRaffleTypes.INSTANT) && (
          <li>
            <div className="row mb-5">
              <div className="col-4">
                <Label htmlFor="campaignTitle" required>
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
                      disabled={!isSavedSched}
                      onChange={e =>
                        setTemplateToggle({
                          ...templateToggle,
                          ...{
                            showPostWin: e.target.checked,
                          },
                        })
                      }
                      checked={templateToggle.showPostWin}
                    />
                  </div>
                  {/* if checked */}
                  {templateToggle.showPostWin && (
                    <>
                      <Select {...postWinTemplate} disabled={!isSavedSched}>
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
                        {winTempList &&
                          winTempList
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
                        disabled={!isSavedSched}
                        onClick={() =>
                          onGetTemplate(postWinTemplate.value, true)
                        }
                      >
                        {intl.formatMessage({ id: 'preview' })}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        )}
        {/* Will only appear if instant fix end */}
        <li>
          <div className="row mb-5">
            <div className="col-4">
              <Label
                htmlFor="directMsg"
                required
                info
                tooltip={intl.formatMessage({ id: 'M0000050' })}
              >
                {intl.formatMessage({ ...messages.directMessage })}
              </Label>
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
                <Checkbox id="win" checked disabled={!isSavedSched} />
              </div>
              <Select {...dmWinTemplate}>
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
                {winTempList &&
                  winTempList
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
                onClick={() => onGetTemplate(dmWinTemplate.value)}
              >
                {intl.formatMessage({ id: 'preview' })}
              </Button>
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
                  disabled={!isSavedSched}
                  onChange={e =>
                    setTemplateToggle({ showDMLose: e.target.checked })
                  }
                  checked={templateToggle.showDMLose}
                />
              </div> */}
              {/* if checked */}
              {/* {templateToggle.showDMLose && (
                <>
                  <Select disabled={!isSavedSched} {...dmLoseTemplate}>
                    {loseTempList &&
                      loseTempList
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
                    onClick={() => onGetTemplate(dmLoseTemplate.value)}
                  >
                    {intl.formatMessage({ id: 'preview' })}
                  </Button>
                </>
              )} */}
              {/* if checked */}
              <div>
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
                    <Select disabled={!isSavedSched} {...dmTyTemplate}>
                      {tyTempList &&
                        tyTempList
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
                      onClick={() => onGetTemplate(dmTyTemplate.value)}
                    >
                      {intl.formatMessage({ id: 'preview' })}
                    </Button>
                  </React.Fragment>
                )} */}
                <div className="row mb-2">
                  <div className="col-6 pr-0">
                    <Label
                      className="py-0"
                      htmlFor="formComplete"
                      subLabel={intl.formatMessage({
                        ...messages.formSubmit,
                      })}
                    />
                  </div>
                  <Checkbox
                    id="formComplete"
                    onChange={e =>
                      setTemplateToggle({
                        ...templateToggle,
                        ...{
                          showDMForm: e.target.checked,
                        },
                      })
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
                      {formCompTempList &&
                        formCompTempList
                          .filter(x => Number(x.type) === 1)
                          .map(({ id, name }, index) => (
                            <option value={id} key={Number(index)}>
                              {name}
                            </option>
                          ))}
                    </Select>
                    <ErrorFormatted {...dmFormTemplate.error} />
                    <Button
                      className="mt-2 mb-4"
                      link
                      onClick={() => onGetTemplate(dmFormTemplate.value)}
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
                {formList &&
                  formList.map(({ id, name }, index) => (
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
                  <Label>
                    {intl.formatMessage({ ...messages.formShow })}
                  </Label>
                  <Label className="col-auto ml-auto">
                    {intl.formatMessage({ ...messages.formRequired })}
                  </Label>
                </div>
                {FormFields &&
                  FormFields.filter(s => filterFormFields(s.value)).map(({ name, value }) => (
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
                          value={`1${value}`}
                          checked={inputFormFieldsRequired.value.includes(
                            `1${value}`,
                          )}
                        />
                      </div>
                    </div>
                  ))}
                {FormFields && <ErrorFormatted {...inputFormFields.error} />}
              </div>
              {showThankful && FormFields2 && FormFields2.length > 0 && (
                <div className="my-3">
                  <div className="row">
                    <Label className="col-6 pr-0 pb-2">
                      {intl.formatMessage({ ...messages.thankfulPerson })} 1
                    </Label>
                    
                    <Label>
                      {intl.formatMessage({ ...messages.formShow })}
                    </Label>

                    <Label className="col-auto ml-auto">
                      {intl.formatMessage({ ...messages.formRequired })}
                    </Label>
                  </div>
                  {FormFields2.map(({ name, value }) => (
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
                          {...inputFormFields2}
                          value={value}
                          checked={inputFormFields2.value.includes(
                            value.toString(),
                          )}
                        />
                      </div>
                      <div className="col-auto ml-auto">
                        <Checkbox
                          className="col-auto ml-auto"
                          id={`${name}formFieldsRequired`}
                          name="formFieldsRequired2"
                          {...inputFormFieldsRequired}
                          value={`2${value}`}
                          checked={inputFormFieldsRequired.value.includes(
                            `2${value}`,
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <ErrorFormatted {...inputFormFields2.error} />
                </div>
              )}
              {showThankful && FormFields3 && FormFields3.length > 0 && (
                <div className="my-3">
                  <div className="row">
                    <Label className="col-6 pr-0 pb-2">
                      {intl.formatMessage({ ...messages.thankfulPerson })} 2
                    </Label>

                    <Label>
                      {intl.formatMessage({ ...messages.formShow })}
                    </Label>

                    <Label className="col-auto ml-auto">
                      {intl.formatMessage({ ...messages.formRequired })}
                    </Label>
                  </div>
                  {FormFields3.map(({ name, value }) => (
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
                          {...inputFormFields3}
                          value={value}
                          checked={inputFormFields3.value.includes(
                            value.toString(),
                          )}
                        />
                      </div>
                      <div className="col-auto ml-auto">
                        <Checkbox
                          className="col-auto ml-auto"
                          id={`${name}formFieldsRequired`}
                          name="formFieldsRequired3"
                          {...inputFormFieldsRequired}
                          value={`3${value}`}
                          checked={inputFormFieldsRequired.value.includes(
                            `3${value}`,
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button link onClick={() => modalToggler('formPreviewModal')}>
                {intl.formatMessage({ id: 'preview' })}
              </Button>
            </div>
          </div>
        </li>
      </ol>
      <Modal id="addPostLink" size="sm" dismissable>
        <ModalToggler modalId="addPostLink" />
        <Form>
          <Label required>
            <FormattedMessage
              {...messages.addPostLinkMessage}
              values={{ campaignName: campDetails.title }}
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
  isSavedSched: PropTypes.any,
  fields: PropTypes.any,
  store: PropTypes.any,
  intl: PropTypes.any,
  validatorEffect: PropTypes.object,
  filterFormFields: PropTypes.func,
  // labels: PropTypes.object,
  // CampaignTypes: PropTypes.array,
};

export default Flow2;
