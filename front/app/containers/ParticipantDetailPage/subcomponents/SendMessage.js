/* eslint-disable prettier/prettier, no-param-reassign */
import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
// components
import ErrorFormatted from 'components/ErrorFormatted';
import Label from 'components/Label';
import RadioButton from 'components/RadioButton';
import PostDm from 'components/PostDm';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { config } from 'utils/config';
import useSubmitEffect from 'library/submitter';

import messages from '../messages';

export function SendMessage({
  intl,
  onSubmit,
  errors,
  userAccount,
  participantDetailPage: { partDetails, templateList },
  routeParams: { campaignId },
  tweetState: { tweetUploadFile, publishTwitterState, messageTemplateId },
  winner,
  hasImageFile,
}) {
  const { content } = publishTwitterState;
  const contentInvalid = (content.value === '' && hasImageFile === false);
  const [state, setState] = useState({
    tplType: 0,
  });
  const submitter = useSubmitEffect([
    onSubmit,
    [
      [partDetails.sns_id],
      userAccount.primary.id,
      winner && (!state.tplType) ? messageTemplateId.value : '',
      content.value,
      tweetUploadFile.uploadFiles,
      Number(campaignId),
    ],
  ]);

  useEffect(() => {
    const tempId = templateList.find(
      itm => itm.id === Number(messageTemplateId.value),
    );

    hasImageFile = false;

    if (tempId) {
      if (tempId.message_file !== null) {
        tweetUploadFile.setUploadFile([tempId.message_file]);
        hasImageFile = true;
      } else {
        tweetUploadFile.setUploadFile([]);
      }
      content.setvalue(tempId.content);
    } else {
      tweetUploadFile.setUploadFile([]);
      content.onClearValue('', true);
    }
  }, [messageTemplateId.value]);

  useEffect(() => {
    
    hasImageFile = false;

    if (winner && (!state.tplType)) {
      const tempId = templateList.find(
        itm => itm.id === Number(messageTemplateId.value),
      );
      if (tempId) {
        if (tempId.message_file !== null) {
          tweetUploadFile.setUploadFile([tempId.message_file]);
          hasImageFile = true;
        } else {
          tweetUploadFile.setUploadFile([]);
        }
        content.setvalue(tempId.content);
      } else {
        tweetUploadFile.setUploadFile([]);
        content.onClearValue('', true);
      }
    } else {
      tweetUploadFile.setUploadFile([]);
      content.onClearValue('', true);
    }
  }, [state.tplType]);

  return (
    <Modal id="modalTemplatePreview" dismissible={false}  size="lg" backdrop="static">
      <ModalToggler modalId="modalTemplatePreview" />
      <form>
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-4 text-left" />
          <div className="col-md-8 text-left">
            {errors && <ErrorFormatted invalid list={errors.list} />}
          </div>
        </div>
        <div className="row justify-content-center m-4">
          {winner &&
          <div className="col-12 p-0 d-flex mb-2">
            <div className="col-5 p-0">
              <RadioButton
                id="3"
                name="filter"
                text={`${intl.formatMessage({
                  ...messages.dmWinnerTemplate,
                })}`}
                value="1"
                onChange={() =>
                  setState({
                    tplType: 0,
                  })
                }
                checked={state.tplType === 0}
              />
            </div>
            <div className="col-5 p-0">
              <RadioButton
                id="4"
                name="filter"
                text={`${intl.formatMessage({
                  ...messages.dmGeneralTemplate,
                })}`}
                value="2"
                onChange={() => {
                  setState({
                    tplType: 1,
                  });
                }}
                checked={state.tplType === 1}
              />
            </div>
          </div>
          }
          <div className="col-12 border d-flex">
            <Label className="col-2">
              {intl.formatMessage({ ...messages.sendTo })}
            </Label>
            {/* <Input secondary value={partDetails.sns_username} disabled /> */}
            <Label className="col-10 mr-auto">
              <Button
                link
                onClick={() =>
                  window.open(
                    `${config.TWITTER_URL}/${partDetails.sns_username}`,
                  )
                }
              >
                {partDetails.sns_username}&nbsp;
              </Button>
            </Label>
          </div>
          {/* <div className="col-12 my-3 mr-0 pr-0 d-flex border"> */}
          {/*  <Label className="col-2"> */}
          {/*    {intl.formatMessage({ ...messages.template })} */}
          {/*  </Label> */}
          {/*  <Select className="border-0" {...messageTemplateId}> */}
          {/*    <option value=""> */}
          {/*      {intl.formatMessage( */}
          {/*        { id: 'M0000008' }, */}
          {/*        { name: intl.formatMessage({ ...messages.template }) }, */}
          {/*      )} */}
          {/*    </option> */}
          {/*    {partDetails.entry_status === 1 */}
          {/*      ? templateList */}
          {/*        .filter(fil => Number(fil.category) === 1) */}
          {/*        .map(itm => ( */}
          {/*          <option value={itm.id} key={itm.id}> */}
          {/*            {itm.name} */}
          {/*          </option> */}
          {/*        )) */}
          {/*      : templateList */}
          {/*        .filter(fil => Number(fil.category) !== 1) */}
          {/*        .map(itm => ( */}
          {/*          <option value={itm.id} key={itm.id}> */}
          {/*            {itm.name} */}
          {/*          </option> */}
          {/*        ))} */}
          {/*  </Select> */}
          {/*  <ErrorFormatted {...messageTemplateId.error} /> */}
          {/* </div> */}
          <div className="col-12 mb-3 border">
            <div>
              <PostDm
                id="images"
                noBorder
                className="col-12"
                placeholder="Message here"
                height={150}
                noTextLimit
                {...content}
                imagesFile={tweetUploadFile.imageFile}
                gifFile={tweetUploadFile.gifFile}
                videoFile={tweetUploadFile.videoFile}
                uploadFiles={tweetUploadFile.uploadFiles}
                fileType={tweetUploadFile.fileType}
                uploadError={tweetUploadFile.uploadError}
                onRemove={tweetUploadFile.onRemove}
                winner={winner}
                tplType={state.tplType}
              />
            </div>
            {contentInvalid === true && (
              <ErrorFormatted {...content.error} />
            )}
          </div>
        </div>
        <div className="row mx-4">
          <div className="col-2 ml-auto mr-0">
            <Button tertiary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.back })}
            </Button>
          </div>
          <div className="col-2">
            <Button
              small
              dataDismiss="modal"
              disabled={submitter.submitting || contentInvalid}
              {...submitter}
            >
              {intl.formatMessage({ ...messages.send })}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

SendMessage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  userAccount: PropTypes.object,
  participantDetailPage: PropTypes.any,
  routeParams: PropTypes.any,
  tweetState: PropTypes.any,
  winner: PropTypes.any,
  hasImageFile: PropTypes.any
};

export default compose(
  memo,
  injectIntl,
)(SendMessage);
