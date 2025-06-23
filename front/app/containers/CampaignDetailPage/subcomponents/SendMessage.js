/* eslint-disable prettier/prettier, no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import ErrorFormatted from 'components/ErrorFormatted';
import Label from 'components/Label';
import Select from 'components/Select';
import RadioButton from 'components/RadioButton';
import PostDm from 'components/PostDm';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import { config } from 'utils/config';
import useSubmitEffect from 'library/submitter';

import messages from '../messages';

export function SendMessage({
  checkedList,
  intl,
  userAccount,
  onSubmit,
  errors,
  campaignId,
  templateList,
  tweetState,
  hasImageFile
}) {

  const { templateId, content, tweetUploadFile } = tweetState;
  // entry_status 1: winner, 0: loser, 3: cancel
  // Send coupon code when auto-dm is disabled, for winners only.
  const checkWinner = checkedList.find(m => m.entry_status === 1);
  const [state, setState] = useState({
    tplType: checkWinner ? 0 : 1,
  });
  const [editable, setEditable] = useState(false)

  const submitter = useSubmitEffect([
    onSubmit,
    [
      checkedList.map(m => m.sns_id),
      userAccount.primary.id,
      checkWinner && (!state.tplType) ? templateId.value : '',
      content.value,
      tweetUploadFile.uploadFiles,
      Number(campaignId),
    ],
  ]);
  const onlyUnique = (value, index, self) => self.indexOf(value) === index;

  useEffect(() => {
    const tempId = templateList.find(
      itm => itm.id === Number(templateId.value),
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
  }, [templateId.value]);

  useEffect(() => {

    hasImageFile = false;

    if (checkWinner && (!state.tplType)) {
      const tempId = templateList.find(
        itm => itm.id === Number(templateId.value),
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

  const contentInvalid = (content.value === '' && hasImageFile === false);

  return (
    <Modal id="modalTemplatePreview" modalOptions={{ dismissible: false }} size="lg" backdrop='static'>
      <ModalToggler modalId="modalTemplatePreview" />
      <form>
        <div className="row justify-content-center m-4">
          {errors && <ErrorFormatted invalid list={errors.list} />}
          <div className="col-12 p-0 d-flex mb-2">
            {checkWinner &&
              <div className="col-5 p-0">
                <RadioButton
                  id="1"
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
            }
            <div className="col-5 p-0">
              <RadioButton
                id="2"
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
          <div className="col-12 border d-flex">
            <Label className="col-2">{intl.formatMessage({ ...messages.sendTo })}</Label>
            <Label className="col-10 mr-auto">
              {checkedList &&
                checkedList.map(m =>
                  <Button
                    link
                    onClick={() =>
                      window.open(
                        `${config.TWITTER_URL}/${m.sns_username}`,
                      )
                    }
                  >
                    {m.sns_username}&nbsp;
                  </Button>
                ).filter(onlyUnique)}
            </Label>
          </div>
          {/* <div className="col-12 my-3 mr-0 pr-0 d-flex border"> */}
          {/*  <Label className="col-2"> */}
          {/*    {intl.formatMessage({ ...messages.template })} */}
          {/*  </Label> */}
          {/*  <Select className="border-0" {...templateId}> */}
          {/*    <option value=""> */}
          {/*      {intl.formatMessage( */}
          {/*        { id: 'M0000008' }, */}
          {/*        { name: intl.formatMessage({ ...messages.template }) }, */}
          {/*      )} */}
          {/*    </option> */}
          {/*    {checkWinner && checkWinner.entry_status === 1 */}
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
          {/*  <ErrorFormatted {...templateId.error} /> */}
          {/* </div> */}
          <div className="col-12 mb-3 border p-0">
            <div>
              <PostDm
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
                winner={checkWinner && !editable}
                tplType={state.tplType}
              />
            </div>
            {contentInvalid === true && (
              <ErrorFormatted {...content.error} />
            )}
          </div>
        </div>
        <div className="row mx-4">
          {
            checkWinner && (
              <div className="col-4">
                <Button
                  small
                  type="button"
                  disabled={editable}
                  onClick={(event) => {
                    event.preventDefault();
                    setEditable(!editable);
                  }}
                >
                  {intl.formatMessage({ ...messages.editMessage })}
                </Button>
              </div>
            )
          }
          <div className="col-2 ml-auto mr-0">
            <Button tertiary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.back })}
            </Button>
          </div>
          <div className="col-2">
            <Button
              small
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
  checkedList: PropTypes.any,
  // intl: PropTypes.any,
  userAccount: PropTypes.any,
  onSubmit: PropTypes.any,
  errors: PropTypes.any,
  campaignId: PropTypes.any,
  templateList: PropTypes.any,
  tweetState: PropTypes.any,
  validatorEffect: PropTypes.object,
  winnerTempleteId: PropTypes.any,
  hasImageFile: PropTypes.any
};

export default compose(
  memo,
  injectIntl,
)(SendMessage);
