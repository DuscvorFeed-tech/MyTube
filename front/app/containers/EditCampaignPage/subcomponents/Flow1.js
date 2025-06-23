/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import IcoFont from 'react-icofont';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import RadioButton from 'components/RadioButton';
import Button from 'components/Button';
import ErrorFormatted from 'components/ErrorFormatted';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import FormPreview from 'containers/FormPreviewPage';
import Checkbox from 'components/Checkbox';
import Textarea from 'components/Textarea';

import { modalToggler } from 'utils/commonHelper';
import CampaignPeriod from './CampaignPeriod';
import CampaignPrize from './CampaignPrize';
import { PrizeForDistribution } from './PrizeDistribution';
import EntryWinnerCondition from './EntryWinnerCondition';
// eslint-disable-next-line no-unused-vars
import { getValidInterval, getNumberOfRaffle } from '../editState';
import validation from '../validators';
import useValidation from '../../../library/validator';
import messages from '../messages';

const { STAGING_CONTENT } = NOCONTENT;
// eslint-disable-next-line react/prop-types
const TargetHashTag = ({
  intl,
  index,
  value,
  setIndexValue,
  addRow,
  removeRow,
  iconPlus,
}) => {
  const validator = validation(intl);
  const targetHashTag = useValidation(value, validator.hashTag);
  useEffect(() => {
    setIndexValue(
      index,
      targetHashTag.value,
      targetHashTag.error.invalid || false,
    );
  }, [targetHashTag.value, targetHashTag.error]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={`col px-0 ${index !== 0 ? 'mt-2' : ''}`}>
        <Input name="targetHashTag" {...targetHashTag} />
        <ErrorFormatted {...targetHashTag.error} />
      </div>
      <div className={`col-auto ${index !== 0 ? 'mt-2' : ''}`}>
        <div className="iconPlus-container">
          {iconPlus && (
            <>
              {index !== 0 && (
                <Button
                  className="mr-3"
                  secondary
                  small
                  width="icon"
                  onClick={() => removeRow(index)}
                >
                  <IcoFont
                    icon="icofont-close-circled"
                    style={{
                      fontSize: '1rem',
                    }}
                  />
                </Button>
              )}
              <Button
                small
                width="icon"
                disabled={!value || targetHashTag.error.invalid || false}
                onClick={() => addRow()}
                secondary
              >
                <IcoFont
                  icon="icofont-plus-circle"
                  style={{
                    fontSize: '1.1rem',
                  }}
                />
              </Button>
            </>
          )}
          {!iconPlus && (
            <Button
              small
              secondary
              width="icon"
              onClick={() => removeRow(index)}
            >
              <IcoFont
                icon="icofont-close-circled"
                style={{
                  fontSize: '1.1rem',
                }}
              />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const Flow1 = props => {
  const {
    theme,
    isSavedSched,
    store: {
      intl,
      snsType,
      labelList,
      campaignList,
      campDetails,
      winnerAlreadyGenerated,
      prizeDistribute,
      setPrizeDistribute,
      ongoingFixedRaffle,
      maxWinLimitError,
      systemSettings,
      commonTypes: {
        FormFields,
        FormFields2,
        FormFields3,
        CampaignType,
        RaffleType,
      },
      formList,
    },
    fields: {
      flow1Fields: {
        title,
        description,
        label_id,
        campaign_type,
        // eslint-disable-next-line no-unused-vars
        winner_total,
        raffleState: {
          account_winning_limit,
          raffle_type,
          raffle_interval,
          auto_raffle,
        },
        hashtagCondition,
      },
      flow2Fields: {
        formMessageTemplate,
        inputFormFields,
        inputFormFields2,
        inputFormFields3,
        templateToggle,
      },
      dateFields,
      hashtagFields,
      entryWinnerFields,
      winnerConditionFields,
      accountFollowedFields,
      winDateErr,
      periodDateErr,
      scheduleDistribution,
      campPrizes: { campaignEndPrize, instantWinPrize, fixedWinPrize },
    },
  } = props;
  const validInternals = getValidInterval(
    isSavedSched && dateFields.startOnPublish.value
      ? new Date()
      : dateFields.startPeriod,
    dateFields.endPeriod,
  );

  const [numberOfRaffle, setNumberOfRaffle] = useState(0);
  useEffect(() => {
    const { raffleTimes } = getNumberOfRaffle(
      isSavedSched && dateFields.startOnPublish.value
        ? new Date()
        : dateFields.startPeriod,
      dateFields.endPeriod || campDetails.end_period,
      raffle_interval.value,
    );

    setNumberOfRaffle(raffle_interval.value ? raffleTimes : 0);
  }, [raffle_interval.value]);

  const { values: hashTags, addRow, removeRow, setIndexValue } = hashtagFields;

  const { prizeInfo, numberOfWinners } = campaignEndPrize;

  const {
    prizeInfo: prizeInfoInstant,
    numberOfWinners: numberOfWinnersInstant,
  } = instantWinPrize;

  const {
    prizeInfo: prizeInfoFixed,
    numberOfWinners: numberOfWinnersFixed,
  } = fixedWinPrize;
  const invalidCampPeriod =
    periodDateErr.startErrState.invalid || periodDateErr.endErrState.invalid;

  const isEditableCampaign = ![0, 2].includes(Number(campDetails.status));
  // Prize fields should still be editable if campaign raffle type is Campaign End,
  // Auto-DM= Yes but status should be SCHEDULED or ONGOING. Do not allow editing of the prize field if status is ENDED.
  const isEditablePrize = [0, 1, 2, 5].includes(Number(campDetails.status)); // entryWinnerFields.autoSendDM.value && --- removed
  const { showThankful } = templateToggle;

  // Check Campaign Winner is already generated
  const isWinnerGenerated = !(
    winnerAlreadyGenerated && winnerAlreadyGenerated.status === true
  );

  const isHashtagConditionEditable = [0, 1, 5].includes(
    Number(campDetails.status),
  );
  return (
    <React.Fragment>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="campaignTitle"
            required
            subLabel={intl.formatMessage({ id: 'M0000005' }, { name: '100' })}
          >
            {intl.formatMessage({ ...messages.campaignTitle })}
          </Label>
        </div>
        <div className="col-8">
          <Input id="title" name="title" {...title} />
          <ErrorFormatted {...title.error} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="desc"
            subLabel={intl.formatMessage({ id: 'M0000005' }, { name: '100' })}
          >
            {intl.formatMessage({ ...messages.description })}
          </Label>
        </div>
        <div className="col-8">
          <div className="dynamic-textarea-holder mt-3">
            <Textarea
              name="description"
              {...description}
              className="withHolder"
              placeholder="Write decsription here."
              cols="35"
              rows={
                description.value
                  ? description.value.split(/\r\n|\r|\n/).length + 1
                  : 1
              }
              maxHeight={1500}
              minHeight={5}
            />
          </div>
          {/* <Input id="description" name="description" {...description} /> */}
          <ErrorFormatted {...description.error} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label htmlFor="label">
            {intl.formatMessage({ ...messages.label })}
          </Label>
        </div>
        <div className="col-8">
          <Select id="label_id" name="label_id" {...label_id}>
            <option />
            {labelList &&
              labelList.list.map(type => (
                <option key={Number(type.id)} value={type.id}>
                  {type.name}
                </option>
              ))}
          </Select>
        </div>
      </div>
      {dateFields && (
        <CampaignPeriod
          intl={intl}
          theme={theme}
          dateFields={dateFields}
          campDetails={campDetails}
          periodDateEr={periodDateErr}
          ongoingFixedRaffle={ongoingFixedRaffle}
        />
      )}

      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="entryMethod"
            required
            info
            tooltip={intl.formatMessage({ id: 'M0000034' })}
          >
            {intl.formatMessage(
              snsType === 1
                ? { ...messages.entryMethods }
                : { ...messages.campaignHashtag },
            )}
          </Label>
        </div>
        <div className="col-8">
          {CampaignType &&
            CampaignType.map(
              ({ value, name }) =>
                snsType === 1 && (
                  <RadioButton
                    key={value}
                    id={`entryMethod${value}`}
                    name="entryMethod"
                    for={`rb1${value}`}
                    text={intl.formatMessage({
                      id: `entryMethod${value}`,
                      defaultMessage: name,
                    })}
                    disabled={!isSavedSched}
                    {...campaign_type}
                    value={Number(value)}
                    checked={Number(campaign_type.value) === value}
                    subLabel={intl.formatMessage(
                      {
                        id: `entryMethod${value}desc`,
                      },
                      {
                        amount: intl.formatHTMLMessage({
                          id: snsType === 1 ? `three` : `five`,
                        }),
                      },
                    )}
                  />
                ),
            )}
          {Number(campaign_type.value) === 2 && (
            <>
              <div
                {...snsType}
                className={
                  snsType === 1 &&
                  'row align-items-baseline justify-content-between'
                }
              >
                {snsType === 1 && (
                  <div className="col-auto">
                    <div className="col-auto px-0">
                      <Label
                        required
                        info
                        tooltip={intl.formatHTMLMessage(
                          { id: `M0000047` },
                          { limit: systemSettings.hashtag_limit },
                        )}
                      >
                        {intl.formatMessage({ ...messages.campaignHashtag })}
                      </Label>
                    </div>
                  </div>
                )}
                <div className="col">
                  {!isEditableCampaign && (
                    <span>
                      {(campDetails.target_hashtag || '').split(',').join(', ')}
                    </span>
                  )}
                  {hashTags &&
                    isEditableCampaign &&
                    hashTags.map(({ value, keydex }, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <React.Fragment key={index}>
                        <div className="row">
                          <TargetHashTag
                            intl={intl}
                            index={index}
                            value={value}
                            addRow={addRow}
                            removeRow={removeRow}
                            setIndexValue={setIndexValue}
                            iconPlus={
                              hashTags.length === 1 ||
                              (index + 1 === hashTags.length &&
                                hashTags.length !== 3)
                              // hashTags.length !== 5)
                              // temporary limit 3 hashtag per campaign
                            }
                            key={Number(keydex)}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
              {isHashtagConditionEditable &&
                snsType === 1 &&
                hashTags.length >= 2 && (
                  <>
                    <br />
                    <div className="row align-items-baseline justify-content-between">
                      <div className="col-auto">
                        <div className="col-auto px-0">
                          <Label htmlFor="hashtagCondition" required>
                            {intl.formatMessage({
                              ...messages.multipleHashtagLogicSettings,
                            })}
                          </Label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="row">
                          <RadioButton
                            name="hashtagCondition"
                            id="hashtagCondition1"
                            {...hashtagCondition}
                            value="1"
                            checked={Number(hashtagCondition.value) === 1}
                            text={intl.formatMessage({
                              ...messages.hashtagCondition1,
                            })}
                            subLabel={intl.formatMessage({
                              ...messages.hashtagCondition1desc,
                            })}
                          />
                        </div>
                        <div className="row">
                          <RadioButton
                            name="hashtagCondition"
                            id="hashtagCondition0"
                            {...hashtagCondition}
                            value="0"
                            checked={Number(hashtagCondition.value) === 0}
                            text={intl.formatMessage({
                              ...messages.hashtagCondition0,
                            })}
                            subLabel={intl.formatMessage({
                              ...messages.hashtagCondition0desc,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              {!isHashtagConditionEditable &&
                snsType === 1 &&
                hashTags.length >= 2 && (
                  <div className="row align-items-baseline justify-content-between">
                    <div className="col-auto">
                      <div className="col-auto px-0">
                        <Label required>
                          {intl.formatMessage({
                            ...messages.multipleHashtagLogicSettings,
                          })}
                        </Label>
                      </div>
                    </div>
                    <div className="col">
                      <span>
                        {intl.formatMessage(
                          {
                            id: `hashtagCondition${hashtagCondition.value}`,
                          },
                          // eslint-disable-next-line no-restricted-globals
                          { defaultMessage: name },
                        )}
                      </span>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      {snsType !== 1 && hashTags.length >= 2 && (
        <div className="row mb-3">
          <div className="col-4">
            <Label htmlFor="hashtagCondition" required>
              {intl.formatMessage({
                ...messages.multipleHashtagLogicSettings,
              })}
            </Label>
          </div>
          <div className="col-8">
            {isHashtagConditionEditable ? (
              <>
                <RadioButton
                  name="hashtagCondition"
                  id="hashtagCondition1"
                  {...hashtagCondition}
                  value="1"
                  checked={Number(hashtagCondition.value) === 1}
                  text={intl.formatMessage({ ...messages.hashtagCondition1 })}
                  subLabel={intl.formatMessage({
                    ...messages.hashtagCondition1desc,
                  })}
                />
                <RadioButton
                  name="hashtagCondition"
                  id="hashtagCondition0"
                  {...hashtagCondition}
                  value="0"
                  checked={Number(hashtagCondition.value) === 0}
                  text={intl.formatMessage({ ...messages.hashtagCondition0 })}
                  subLabel={intl.formatMessage({
                    ...messages.hashtagCondition0desc,
                  })}
                />
              </>
            ) : (
              <span>
                {intl.formatMessage(
                  {
                    id: `hashtagCondition${hashtagCondition.value}`,
                  },
                  // eslint-disable-next-line no-restricted-globals
                  { defaultMessage: name },
                )}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="raffleType"
            required
            info
            tooltip={intl.formatMessage({ id: 'M0000035' })}
          >
            {intl.formatMessage({ ...messages.raffleType })}
          </Label>
        </div>
        <div className="col-8">
          {/* Filter Instant Win for Edit page only */}
          {RaffleType &&
            RaffleType.filter(r => r.value !== 1).map(
              ({ name, value }) =>
                ((snsType !== 1 && value === 2) || snsType === 1) &&
                !(STAGING_CONTENT && value === 1) && (
                  <>
                    <RadioButton
                      key={value}
                      id={`raffleType${value}`}
                      name="raffleType"
                      for={`rbrt${value}`}
                      text={intl.formatMessage({
                        id: `raffleType${value}`,
                        defaultMessage: name,
                      })}
                      disabled={!isSavedSched}
                      {...raffle_type}
                      value={Number(value)}
                      checked={Number(raffle_type.value) === value}
                      subLabel={intl.formatMessage({
                        id: `raffleType${value}desc`,
                      })}
                    />
                    {Number(raffle_type.value) === 1 &&
                      Number(value) === 1 &&
                      Number(campaign_type.value) === 2 && (
                        <div className="row mb-3">
                          <div className="col-4">
                            <Label
                              htmlFor="raffleInterval"
                              required
                              info
                              tooltip={intl.formatMessage({
                                ...messages.M0000049,
                              })}
                            >
                              {intl.formatMessage({ ...messages.winningLimit })}
                            </Label>
                          </div>
                          <div className="col-8">
                            <Input
                              id="account_winning_limit"
                              name="account_winning_limit"
                              {...account_winning_limit}
                              disabled={!isEditableCampaign}
                            />
                            <ErrorFormatted {...account_winning_limit.error} />
                            <ErrorFormatted {...maxWinLimitError} />
                          </div>
                        </div>
                      )}
                    {Number(raffle_type.value) === 3 && Number(value) === 3 && (
                      <React.Fragment>
                        <div className="row mb-3">
                          <div className="col-4">
                            <Label
                              htmlFor="raffleInterval"
                              required
                              info
                              tooltip={intl.formatMessage({
                                ...messages.M0000049,
                              })}
                            >
                              {intl.formatMessage({
                                ...messages.raffleInterval,
                              })}
                            </Label>
                          </div>
                          <div className="col-8">
                            <Select
                              id="raffleInterval"
                              {...raffle_interval}
                              disabled={ongoingFixedRaffle}
                            >
                              <option value="" />
                              {validInternals.includes(1) && (
                                <option value="1">
                                  {intl.formatMessage(
                                    { id: 'noOfHour' },
                                    { num: '1' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(2) && (
                                <option value="2">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '6' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(3) && (
                                <option value="3">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '12' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(4) && (
                                <option value="4">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '24' },
                                  )}
                                </option>
                              )}
                              {/* {RaffleInterval &&
                              RaffleInterval.map(interval => (
                                <option
                                  key={Number(interval.value)}
                                  value={interval.value}
                                >
                                  {intl.formatMessage({
                                    id: `raffleInterval${interval.value}`,
                                    defaultMessage: interval.name,
                                  })}
                                </option>
                              ))} */}
                            </Select>
                            <ErrorFormatted {...raffle_interval.error} />
                          </div>
                        </div>
                        <div className="row mb-3 align-items-baseline">
                          <div className="col-4">
                            <Label
                              htmlFor="raffleNo"
                              info
                              tooltip={intl.formatMessage({
                                ...messages.M0000048,
                              })}
                            >
                              {intl.formatMessage({ ...messages.noOfRaffle })}
                            </Label>
                          </div>
                          <div className="col-8">{numberOfRaffle || 0}</div>
                        </div>
                        {Number(campaign_type.value) === 2 && (
                          <div className="row mb-3">
                            <div className="col-4">
                              <Label
                                htmlFor="winningLimit"
                                required
                                info
                                tooltip={intl.formatMessage({
                                  ...messages.M0000022,
                                })}
                              >
                                {intl.formatMessage({
                                  ...messages.winningLimit,
                                })}
                              </Label>
                            </div>
                            <div className="col-8">
                              <Input
                                id="account_winning_limit"
                                name="account_winning_limit"
                                {...account_winning_limit}
                                disabled={!isEditableCampaign}
                              />
                              <ErrorFormatted
                                {...account_winning_limit.error}
                              />
                              <ErrorFormatted {...maxWinLimitError} />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </>
                ),
            )}

          {[2, 3].includes(Number(raffle_type.value)) && ( // Raff;e Type is Fixed | End
            <div className="row">
              <div className="col-12 d-flex">
                <Label className="py-0">
                  {intl.formatMessage({ ...messages.autoRaffle })}
                </Label>
                <div className="col-auto pr-0">
                  <Checkbox
                    id="autoRaffle"
                    {...auto_raffle}
                    onChange={() => {
                      auto_raffle.setvalue(!auto_raffle.value);
                    }}
                    checked={auto_raffle.value === true}
                    disabled={!isEditableCampaign}
                  />
                </div>
                <Label
                  className="py-0"
                  htmlFor="autoRaffle"
                  subLabel={intl.formatMessage({ ...messages.On })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {snsType === 1 && (
        <EntryWinnerCondition
          theme={theme}
          isSavedSched={isWinnerGenerated} // Winner is not generated, it be editable
          raffle_type={raffle_type}
          entryWinnerState={entryWinnerFields}
          accountFollowedState={accountFollowedFields}
          campaignList={campaignList}
          winDateErr={winDateErr}
          winnerConditionState={winnerConditionFields}
          intl={intl}
          commons={{ ...props.store.commonTypes }}
        />
      )}

      <div className="row mb-3">
        <div className="col-4">
          <Label htmlFor="prize" required>
            {intl.formatMessage({ ...messages.prizeManagement })}
          </Label>
        </div>
        <div className="col-8">
          {Number(raffle_type.value) === 2 &&
            prizeInfo &&
            prizeInfo.map(
              (
                {
                  id,
                  name,
                  amount,
                  percentage,
                  validMinAmount,
                  origAmnt,
                  isAmtDisabled,
                  error,
                  keydex,
                },
                index,
              ) => (
                <CampaignPrize
                  intl={intl}
                  key={Number(keydex)}
                  index={index}
                  name={name}
                  id={id}
                  amount={amount}
                  origAmnt={validMinAmount || origAmnt}
                  isSavedSched={isSavedSched}
                  iconPlus={
                    prizeInfo.length === 1 ||
                    (index + 1 === prizeInfo.length && prizeInfo.length !== 10)
                  }
                  percentage={percentage}
                  raffle_type={raffle_type.value}
                  error={error}
                  {...campaignEndPrize}
                  disabled={!isEditablePrize}
                  isAmtDisabled={isAmtDisabled}
                />
              ),
            )}

          {Number(raffle_type.value) === 1 &&
            prizeInfoInstant &&
            prizeInfoInstant.map(
              (
                { id, name, amount, percentage, origAmnt, error, keydex },
                index,
              ) => (
                <CampaignPrize
                  intl={intl}
                  key={Number(keydex)}
                  index={index}
                  name={name}
                  id={id}
                  amount={amount}
                  origAmnt={origAmnt}
                  isSavedSched={isSavedSched}
                  iconPlus={
                    prizeInfoInstant.length === 1 ||
                    (index + 1 === prizeInfoInstant.length &&
                      prizeInfoInstant.length !== 10)
                  }
                  percentage={percentage}
                  raffle_type={raffle_type.value}
                  error={error}
                  {...instantWinPrize}
                />
              ),
            )}

          {Number(raffle_type.value) === 3 &&
            prizeInfoFixed &&
            prizeInfoFixed.map(
              ({ name, amount, percentage, error, keydex }, index) => (
                <CampaignPrize
                  intl={intl}
                  key={Number(keydex)}
                  index={index}
                  name={name}
                  amount={amount}
                  iconPlus={
                    prizeInfoFixed.length === 1 ||
                    (index + 1 === prizeInfoFixed.length &&
                      prizeInfoFixed.length !== 10)
                  }
                  percentage={percentage}
                  raffle_type={raffle_type.value}
                  disabled={prizeDistribute || ongoingFixedRaffle}
                  maxAmount={5000}
                  error={error}
                  {...fixedWinPrize}
                />
              ),
            )}
          <div className="row mt-3 align-items-center">
            <div className="col-6 mb-3">
              <Label>{intl.formatMessage({ ...messages.totalWinners })}</Label>
            </div>
            <div className="col">
              {Number(raffle_type.value) === 2 && numberOfWinners}
              {Number(raffle_type.value) === 1 && numberOfWinnersInstant}
              {Number(raffle_type.value) === 3 && numberOfWinnersFixed}
            </div>
          </div>
          {Number(raffle_type.value) === 3 && (
            <Button
              secondary
              small
              onClick={() => setPrizeDistribute(prizeDistribute + 1)}
              disabled={invalidCampPeriod || !raffle_interval.value}
            >
              {intl.formatMessage({ ...messages.suggestedPrizeDis })}
            </Button>
          )}
        </div>
      </div>

      {Number(raffle_type.value) === 3 && prizeDistribute && (
        <div>
          <div className="pb-3">
            <Label>
              {intl.formatMessage({ ...messages.prizeDistribution })}
            </Label>
          </div>
          <PrizeForDistribution
            {...scheduleDistribution}
            isSavedSched={isSavedSched}
            intl={intl}
            prizeInfo={prizeInfoFixed}
            {...fixedWinPrize}
            startPeriod={
              !dateFields.startOnPublish.value
                ? moment(dateFields.startPerio)
                : moment()
            }
            ongoingFixedRaffle={ongoingFixedRaffle}
            endPeriod={moment(dateFields.endPeriod)}
            numberOfWinnersFixed={numberOfWinnersFixed}
            autoSendDm={campDetails.auto_send_dm}
            disabled={!isEditableCampaign}
          />

          {/* <div className="mt-3 row justify-content-end align-items-baseline">
            <div className="col-auto">
              <Label>{intl.formatMessage({ ...messages.total })}</Label>
            </div>
            <div className="col-auto">{numberOfWinnersFixed}</div>
          </div> */}

          <div className="text-right pt-5">
            <Button
              width="md"
              secondary
              small
              onClick={() => setPrizeDistribute(0)}
            >
              {intl.formatMessage({ ...messages.clearSuggestedPrize })}
            </Button>
          </div>
        </div>
      )}

      {snsType !== 1 && (
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
                {intl.formatMessage({ ...messages.winnerTemplate })}
              </Label>
            )}
          </div>
          <div className="col-8">
            <Select {...formMessageTemplate}>
              <option value="">
                {intl.formatMessage(
                  { id: 'M0000008' },
                  {
                    name: intl.formatMessage({ ...messages.template }),
                  },
                )}
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
              <Label>
                {intl.formatMessage({ ...messages.personalInformation })}
              </Label>
              {FormFields &&
                FormFields.map(({ name, value }) => (
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
                      {...inputFormFields}
                      value={value}
                      checked={inputFormFields.value.includes(value.toString())}
                    />
                  </div>
                ))}
              {FormFields && <ErrorFormatted {...inputFormFields.error} />}
            </div>
            {showThankful && FormFields2 && FormFields2.length > 0 && (
              <div className="my-3">
                <Label>
                  {intl.formatMessage({ ...messages.thankfulPerson })} 1
                </Label>
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
            {showThankful && FormFields3 && FormFields3.length > 0 && (
              <div className="my-3">
                <Label>
                  {intl.formatMessage({ ...messages.thankfulPerson })} 2
                </Label>
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
      )}
      <Modal id="formPreviewModal" size="md" dismissable>
        <ModalToggler modalId="formPreviewModal" />
        <FormPreview
          inputFormFields={inputFormFields.value}
          inputFormFields2={
            showThankful ? inputFormFields2.value.toString() : []
          }
          inputFormFields3={
            showThankful ? inputFormFields3.value.toString() : []
          }
          template={(formList || []).find(
            ({ id }) => id === Number(formMessageTemplate.value),
          )}
        />
      </Modal>
    </React.Fragment>
  );
};

Flow1.propTypes = {
  theme: PropTypes.object,
  store: PropTypes.any,
  fields: PropTypes.any,
  dateFields: PropTypes.any,
  commonTypes: PropTypes.any,
  campDetails: PropTypes.any,
  intl: PropTypes.any,
  isSavedSched: PropTypes.any,
  systemSettings: PropTypes.object,
  // CampaignTypes: PropTypes.array,
};

export default Flow1;
