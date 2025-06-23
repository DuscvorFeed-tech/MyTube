/* eslint-disable camelcase */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import IcoFont from 'react-icofont';
import Text from 'components/Text';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import DatePicker from 'components/DatePicker';
import RadioButton from 'components/RadioButton';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import Textarea from 'components/Textarea';
import FormPreview from 'containers/FormPreviewPage';

import { modalToggler } from 'utils/commonHelper';

// import ListContent from 'components/TableList/ListContent';
// import IcoFont from 'react-icofont';
// import TableList from './CustomTable';
import useValidation, { isValid } from '../../../library/validator';
import ErrorFormatted from '../../../components/ErrorFormatted';
import { PrizeForCampaignEnd } from './CampaignPrize';
import validation from '../validators';
import {
  getValidInterval,
  getNumberOfRaffle,
  // getNumberOfRaffle,
} from '../inputStateEffect';
import messages from '../messages';

import { EntryWinnerCondition } from './EntryWinnerCondition';
import { PrizeForDistribution } from './PrizeDistribution';
// import ErrorFormatted from 'components/ErrorFormatted';
// import { minValue } from '../../../library/validator/rules';

// import { alertToggler } from 'utils/commonHelper';
// import { ConditionalHour, ConditionalMinute } from './ConditionalOption';
const { STAGING_CONTENT } = NOCONTENT;

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
  return (
    <>
      <div className={`col ${index !== 0 ? 'mt-2' : ''}`}>
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
                    fontSize: '1rem',
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
                  fontSize: '1rem',
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
    intl,
    theme,
    labels,
    CampaignTypes,
    campaignList,
    RaffleTypes,
    WinnerConditionTypes,
    PreventPreviousWinnerTypes,
    userAccount,
    snsType,
    // RaffleInterval,
    prizeDistribute,
    setPrizeDistribute,
    validatorEffect,
    systemSettings,
    minDateForPD,
    formTemplates,
    formFields,
  } = props;
  // const [raffleType, setRaffleType] = useState(2);

  const {
    campaignTitle,
    campaignDescription,
    campaignType,
    hashtagCondition,
    labelId,
    seriesStartTime,
    seriesEndTime,
    startOnPublish,
    startPeriod,
    startHour,
    startMinute,
    endPeriod,
    endHour,
    endMinute,
    targetHashTag,
    accountFollowed,
    winLimit,
    maxWinLimitError,
    start_period,
    end_period,
    startMaxDays,
    endMinDays,
    campaignEndPrize,
    instantWinPrize,
    fixedWinPrize,
    raffleType,
    autoRaffle,
    raffleInterval,
    scheduleDistribution,
    startErrState,
    endErrState,
    entryWinnerState,
    winDateErr,
    winnerConditionState,
    formMessageTemplate,
    inputFormFields,
  } = validatorEffect;

  const { prizeInfo, numberOfWinners } = campaignEndPrize;

  const {
    prizeInfo: prizeInfoInstant,
    numberOfWinners: numberOfWinnersInstant,
  } = instantWinPrize;

  const {
    prizeInfo: prizeInfoFixed,
    numberOfWinners: numberOfWinnersFixed,
  } = fixedWinPrize;

  const { values: hashTags, addRow, setIndexValue, removeRow } = targetHashTag;

  const invalidPeriod =
    (!startOnPublish.value && !isValid([startHour, startMinute])) ||
    !isValid([endHour, endMinute]);

  const validInternals = getValidInterval(
    startOnPublish ? new Date() : start_period,
    end_period,
  );

  const [numberOfRaffle, setNumberOfRaffle] = useState(0);
  useEffect(() => {
    const { raffleTimes } = getNumberOfRaffle(
      startOnPublish.value ? new Date() : start_period,
      end_period,
      raffleInterval.value,
    );

    setNumberOfRaffle(raffleInterval.value ? raffleTimes : 0);
  }, [raffleInterval.value]);

  const showToday = () => {
    const st = startPeriod.toDate;
    const td = moment().format('MM/DD/YYYY');

    return st !== td;
  };
  const onSiteChanged = e => {
    localStorage.setItem('entryMethod', e.target.value);
  };
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
          <Input id="campaignTitle" name="campaignTitle" {...campaignTitle} />
          <ErrorFormatted {...campaignTitle.error} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="desc"
            subLabel={intl.formatMessage({ id: 'M0000005' }, { name: '255' })}
          >
            {intl.formatMessage({ ...messages.description })}
          </Label>
        </div>
        <div className="col-8">
          <div className="dynamic-textarea-holder mt-3">
            <Textarea
              name="description"
              {...campaignDescription}
              className="withHolder"
              placeholder="Write decsription here."
              cols="35"
              rows={
                campaignDescription.value
                  ? campaignDescription.value.split(/\r\n|\r|\n/).length + 1
                  : 1
              }
              maxHeight={1500}
              minHeight={5}
            />
          </div>
          <ErrorFormatted {...campaignDescription.error} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label htmlFor="label">
            {intl.formatMessage({ ...messages.label })}
          </Label>
        </div>
        <div className="col-8">
          <Select id="label" name="label" {...labelId}>
            <option />
            {labels &&
              labels.list.map(type => (
                <option key={Number(type.id)} value={type.id}>
                  {type.name}
                </option>
              ))}
          </Select>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="campaignPeriod"
            required
            info
            tooltip={intl.formatMessage({ id: 'M0000033' })}
          >
            {intl.formatMessage({ ...messages.campaignPeriod })}
          </Label>
        </div>
        <div className="col-8">
          <div>
            <Label className="px-0">
              {intl.formatMessage({ ...messages.start })}
            </Label>
            <div className="row">
              <div className="col-auto pr-0">
                <Checkbox
                  id="startOnPublish"
                  {...startOnPublish}
                  checked={startOnPublish.value === true}
                />
              </div>
              <Label
                className="py-0"
                htmlFor="startOnPublish"
                subLabel={intl.formatMessage({ ...messages.M0000067 })}
              />
            </div>
            {!startOnPublish.value && (
              <div className="row">
                <div className="col-5">
                  <Text
                    size={theme.fontSize.xs}
                    text={intl.formatMessage({ ...messages.date })}
                  />
                  <br />
                  <DatePicker
                    {...startPeriod}
                    defaultDt={null}
                    minDate={new Date()}
                    maxDate={undefined}
                    canClearSelection={false}
                  />
                </div>
                <div className="col pl-0">
                  <Text
                    size={theme.fontSize.xs}
                    text={intl.formatMessage({ ...messages.time })}
                  />
                  <br />
                  <div className="col pr-0">
                    <div className="row align-items-center justify-content-center">
                      <div className="col px-1">
                        <Select name="startHour" {...startHour}>
                          <option value="">
                            {intl.formatMessage({ ...messages.hour })}
                          </option>
                          {seriesStartTime &&
                            seriesStartTime.map(hour => (
                              <option key={Math.random()} value={hour.value}>
                                {hour.value.toString().padStart(2, '0')}
                              </option>
                            ))}
                        </Select>
                      </div>
                      <div className="col-auto px-1 d-flex align-items-center">
                        :
                      </div>
                      <div className="col px-1">
                        <Select name="startMinute" {...startMinute}>
                          <option value="">
                            {intl.formatMessage({ ...messages.min })}
                          </option>
                          {seriesStartTime &&
                            seriesStartTime
                              .filter(
                                ({ value }) =>
                                  value === Number(startHour.value),
                              )
                              .map(hour =>
                                hour.list.map(mins => (
                                  <option key={Math.random()} value={mins}>
                                    {mins.toString().padStart(2, '0')}
                                  </option>
                                )),
                              )}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ErrorFormatted {...startErrState} />
          </div>
          <div>
            <Label className="p-0 mt-3">
              {intl.formatMessage({ ...messages.end })}
            </Label>
            <div className="row">
              <div className="col-5">
                <Text
                  size={theme.fontSize.xs}
                  text={intl.formatMessage({ ...messages.date })}
                />
                <br />
                <DatePicker
                  {...endPeriod}
                  hideTodayButton={showToday()}
                  minDate={endMinDays}
                  maxDate={startMaxDays}
                  canClearSelection={false}
                />
              </div>
              <div className="col pl-0">
                <Text
                  size={theme.fontSize.xs}
                  text={intl.formatMessage({ ...messages.time })}
                />
                <br />
                <div className="col pr-0">
                  <div className="row align-items-center justify-content-center">
                    <div className="col px-1">
                      <Select name="endHour" {...endHour}>
                        <option value="">
                          {intl.formatMessage({ ...messages.hour })}
                        </option>
                        {seriesEndTime &&
                          seriesEndTime.map(hour => (
                            <option key={Math.random()} value={hour.value}>
                              {hour.value.toString().padStart(2, '0')}
                            </option>
                          ))}
                      </Select>
                    </div>
                    <div className="col-auto px-1 d-flex align-items-center">
                      :
                    </div>
                    <div className="col px-1">
                      <Select name="endMinute" {...endMinute}>
                        <option value="">
                          {intl.formatMessage({ ...messages.min })}
                        </option>
                        {seriesEndTime &&
                          seriesEndTime
                            .filter(
                              ({ value }) => value === Number(endHour.value),
                            )
                            .map(hour =>
                              hour.list.map(mins => (
                                <option key={Math.random()} value={mins}>
                                  {mins.toString().padStart(2, '0')}
                                </option>
                              )),
                            )}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ErrorFormatted {...endErrState} />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="entryMethod"
            required
            info
            tooltip={intl.formatMessage(
              snsType === 1 ? { id: 'M0000034' } : { id: `M0000047` },
              { limit: systemSettings.hashtag_limit },
            )}
          >
            {intl.formatMessage(
              snsType === 1
                ? { ...messages.entryMethods }
                : { ...messages.campaignHashtag },
            )}
          </Label>
        </div>
        <div className="col-8">
          {CampaignTypes &&
            CampaignTypes.map(
              ({ name, value }) =>
                snsType === 1 && (
                  <RadioButton
                    onClick={onSiteChanged}
                    id={`entryMethod1${value}`}
                    name="entryMethod"
                    for={`rb${value}`}
                    key={value}
                    text={intl.formatMessage({
                      id: `entryMethod${value}`,
                      defaultMessage: name,
                    })}
                    {...campaignType}
                    value={value}
                    checked={Number(campaignType.value) === value}
                    subLabel={intl.formatMessage(
                      {
                        id: `entryMethod${value}desc`,
                      },
                      {
                        amount: intl.formatHTMLMessage({
                          id: `three`,
                        }),
                      },
                    )}
                  />
                ),
            )}
          {Number(campaignType.value) === 2 && (
            <React.Fragment>
              <div className="row align-items-baseline justify-content-between">
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
                  {hashTags &&
                    hashTags.map(({ value, keydex }, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <React.Fragment key={index}>
                        <div className="row">
                          {/* {index > 0 && <div className="col-auto" />} */}
                          <TargetHashTag
                            intl={intl}
                            index={index}
                            value={value}
                            key={Number(keydex)}
                            addRow={addRow}
                            removeRow={removeRow}
                            iconPlus={
                              hashTags.length === 1 ||
                              (index + 1 === hashTags.length &&
                                hashTags.length !==
                                  systemSettings.hashtag_limit)
                            }
                            setIndexValue={setIndexValue}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
              {targetHashTag.error && (
                <div className="row align-items-baseline mb-3">
                  <div className="col-md-4" />
                  <div className="col-md-6 mt-2 pr-0">
                    <ErrorFormatted {...targetHashTag.error} />
                  </div>
                </div>
              )}
              {/* <Button
                small
                secondary
                disabled={hashTags.length === 5}
                onClick={addRow}
              >
                Add Hashtag
              </Button> */}
              {snsType === 1 && hashTags.length >= 2 && (
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
            </React.Fragment>
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
          {RaffleTypes &&
            RaffleTypes.map(
              ({ name, value }) =>
                ((snsType !== 1 && value === 2) || snsType === 1) &&
                !(STAGING_CONTENT && value === 1) && (
                  <>
                    <RadioButton
                      id={`raffleType${value}`}
                      name="raffleType"
                      for="rt1"
                      text={intl.formatMessage({
                        id: `raffleType${value}`,
                        defaultMessage: name,
                      })}
                      {...raffleType}
                      value={value}
                      checked={Number(raffleType.value) === value}
                      subLabel={intl.formatMessage({
                        id: `raffleType${value}desc`,
                      })}
                    />
                    {Number(raffleType.value) === 1 &&
                      Number(value) === 1 &&
                      Number(campaignType.value) === 2 && (
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
                              id="winningLimit"
                              name="winningLimit"
                              disabled
                              {...winLimit}
                            />
                            <ErrorFormatted {...winLimit.error} />
                            <ErrorFormatted {...maxWinLimitError} />
                          </div>
                        </div>
                      )}
                    {Number(raffleType.value) === 3 && Number(value) === 3 && (
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
                            <Select id="raffleInterval" {...raffleInterval}>
                              <option />
                              {validInternals.includes(1) && (
                                <option value="1">
                                  {intl.formatMessage(
                                    { id: 'noOfHour' },
                                    { num: '1' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(6) && (
                                <option value="6">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '6' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(12) && (
                                <option value="12">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '12' },
                                  )}
                                </option>
                              )}
                              {validInternals.includes(24) && (
                                <option value="24">
                                  {intl.formatMessage(
                                    { id: 'noOfHours' },
                                    { num: '24' },
                                  )}
                                </option>
                              )}
                            </Select>
                            <ErrorFormatted {...raffleInterval.error} />
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
                        {Number(campaignType.value) === 2 && (
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
                                id="winningLimit"
                                name="winningLimit"
                                disabled
                                {...winLimit}
                              />
                              <ErrorFormatted {...winLimit.error} />
                              <ErrorFormatted {...maxWinLimitError} />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </>
                ),
            )}

          {[2, 3].includes(Number(raffleType.value)) && ( // Raff;e Type is Fixed | End
            <div className="row">
              <div className="col-12 d-flex">
                <Label className="py-0">
                  {intl.formatMessage({ ...messages.autoRaffle })}
                </Label>
                <div className="col-auto pr-0">
                  <Checkbox
                    id="autoRaffle"
                    {...autoRaffle}
                    onChange={() => {
                      autoRaffle.setvalue(!autoRaffle.value);
                    }}
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

      {/* {['1', '3'].includes(raffleType.value) &&
        Number(campaignType.value) === 2 && (
          <div className="row mb-3">
            <div className="col-4">
              <Label
                htmlFor="winningLimit"
                required
                info
                tooltip={intl.formatMessage({ ...messages.M0000022 })}
              >
                {intl.formatMessage({ ...messages.winningLimit })}
              </Label>
            </div>
            <div className="col-8">
              <Input id="winningLimit" name="winningLimit" {...winLimit} />
              <ErrorFormatted {...winLimit.error} />
            </div>
          </div>
        )} */}
      {snsType === 1 && (
        <EntryWinnerCondition
          userAccount={userAccount}
          commons={{ WinnerConditionTypes, PreventPreviousWinnerTypes }}
          entryWinnerState={{ ...entryWinnerState, startPeriod }}
          accountFollowedState={accountFollowed}
          campaignList={campaignList}
          winDateErr={winDateErr}
          winnerConditionState={winnerConditionState}
          theme={theme}
          raffle_type={raffleType}
          intl={intl}
        />
      )}
      <div className="row mb-3">
        <div className="col-4">
          <Label htmlFor="prize" required>
            {intl.formatMessage({ ...messages.prizeManagement })}
          </Label>
        </div>
        <div className="col-8">
          {raffleType.value === '2' &&
            prizeInfo &&
            prizeInfo.map(
              ({ name, amount, percentage, error, keydex }, index) => (
                <PrizeForCampaignEnd
                  intl={intl}
                  key={Number(keydex)}
                  index={index}
                  name={name}
                  amount={amount}
                  iconPlus={
                    prizeInfo.length === 1 ||
                    (index + 1 === prizeInfo.length && prizeInfo.length !== 10)
                  }
                  percentage={percentage}
                  raffleType={raffleType.value}
                  error={error}
                  {...campaignEndPrize}
                />
              ),
            )}

          {raffleType.value === '1' &&
            prizeInfoInstant &&
            prizeInfoInstant.map(
              ({ name, amount, percentage, error }, index) => (
                <PrizeForCampaignEnd
                  intl={intl}
                  key={Number(index)}
                  index={index}
                  name={name}
                  amount={amount}
                  iconPlus={
                    prizeInfoInstant.length === 1 ||
                    (index + 1 === prizeInfoInstant.length &&
                      prizeInfoInstant.length !== 10)
                  }
                  percentage={percentage}
                  raffleType={raffleType.value}
                  error={error}
                  {...instantWinPrize}
                />
              ),
            )}

          {raffleType.value === '3' &&
            prizeInfoFixed &&
            prizeInfoFixed.map(({ name, amount, percentage, error }, index) => (
              <PrizeForCampaignEnd
                intl={intl}
                key={Number(index)}
                index={index}
                name={name}
                amount={amount}
                iconPlus={
                  prizeInfoFixed.length === 1 ||
                  (index + 1 === prizeInfoFixed.length &&
                    prizeInfoFixed.length !== 10)
                }
                percentage={percentage}
                raffleType={raffleType.value}
                disabled={prizeDistribute}
                prizeDistribute={prizeDistribute}
                maxAmount={5000}
                error={error}
                {...fixedWinPrize}
              />
            ))}
          <div className="row mt-3 align-items-center">
            <div className="col-md-6">
              <Label>{intl.formatMessage({ ...messages.totalWinners })}</Label>
            </div>
            <div className="col">
              {raffleType.value === '2' && numberOfWinners}
              {raffleType.value === '1' && numberOfWinnersInstant}
              {raffleType.value === '3' && numberOfWinnersFixed}
            </div>
          </div>
          {raffleType.value === '3' && (
            <Button
              secondary
              small
              onClick={() => setPrizeDistribute(prizeDistribute + 1)}
              disabled={
                invalidPeriod ||
                (startErrState && startErrState.invalid) ||
                (endErrState && endErrState.invalid) ||
                !raffleInterval.value
              }
            >
              {intl.formatMessage({ ...messages.suggestedPrizeDis })}
            </Button>
          )}
        </div>
      </div>
      {raffleType.value === '3' && prizeDistribute && (
        <div>
          <div className="pb-3">
            <Label>{intl.formatMessage({ ...messages.prizeDistribute })}</Label>
          </div>
          <PrizeForDistribution
            {...scheduleDistribution}
            intl={intl}
            prizeInfo={prizeInfoFixed}
            {...fixedWinPrize}
            startPeriod={minDateForPD}
            endPeriod={moment(end_period)}
            numberOfWinnersFixed={numberOfWinnersFixed}
          />

          <div className="text-right mt-5">
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
              {formTemplates &&
                formTemplates.map(({ id, name }, index) => (
                  <option value={id} key={Number(index)}>
                    {name}
                  </option>
                ))}
            </Select>
            <ErrorFormatted {...formMessageTemplate.error} />
            <div className="my-3">
              <Label>{intl.formatMessage({ ...messages.inputFields })}</Label>
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
                    <Checkbox
                      id={name}
                      name="formFields"
                      {...inputFormFields}
                      value={value}
                      checked={inputFormFields.value.includes(value.toString())}
                    />
                  </div>
                ))}
              {formFields && <ErrorFormatted {...inputFormFields.error} />}
            </div>
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
          template={(formTemplates || []).find(
            ({ id }) => id === Number(formMessageTemplate.value),
          )}
        />
      </Modal>
    </React.Fragment>
  );
};

TargetHashTag.propTypes = {
  addRow: PropTypes.any,
  hasError: PropTypes.any,
  setIndexValue: PropTypes.any,
  value: PropTypes.any,
  index: PropTypes.any,
  intl: PropTypes.any,
  removeRow: PropTypes.any,
  iconPlus: PropTypes.any,
};

Flow1.propTypes = {
  theme: PropTypes.object,
  validatorEffect: PropTypes.object,
  // entryMethod: PropTypes.number,
  // setEntryMethod: PropTypes.func,
  intl: PropTypes.any,
  campaignList: PropTypes.any,
  // validatorEffect: PropTypes.object,
  userAccount: PropTypes.any,
  labels: PropTypes.object,
  CampaignTypes: PropTypes.array,
  RaffleTypes: PropTypes.array,
  WinnerConditionTypes: PropTypes.array,
  PreventPreviousWinnerTypes: PropTypes.array,
  RaffleInterval: PropTypes.array,
  prizeDistribute: PropTypes.bool,
  setPrizeDistribute: PropTypes.func,
  snsType: PropTypes.number,
  systemSettings: PropTypes.object,
  minDateForPD: PropTypes.any,
  formTemplates: PropTypes.array,
  formFields: PropTypes.array,
};

export default Flow1;
