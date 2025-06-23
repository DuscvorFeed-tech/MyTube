/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import Text from 'components/Text';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import DatePicker from 'components/DatePicker';
import RadioButton from 'components/RadioButton';
import Button from 'components/Button';
import IcoFont from 'react-icofont';
import ErrorFormatted from 'components/ErrorFormatted';

import moment from 'moment';
import validation from '../validators';
import useValidation from '../../../library/validator';
import { WinnerCondition } from './WinnerCondition';
import messages from '../messages';
import { ConditionalHour, ConditionalMinute } from './ConditionalOption';
const { BETA_CONTENT } = NOCONTENT;

const AccountFollowedTag = ({
  intl,
  index,
  value,
  setIndexValue,
  addRow,
  removeRow,
  iconPlus,
}) => {
  const validator = validation(intl);
  const accountFollowed = useValidation(value, validator.accountFollowed);
  useEffect(() => {
    setIndexValue(
      index,
      accountFollowed.value,
      accountFollowed.error.invalid || false,
    );
  }, [accountFollowed.value, accountFollowed.error]);
  return (
    <div className="row mb-2">
      <div className="col pr-0">
        <Input
          id="accountFollow"
          name="accountFollow"
          {...accountFollowed}
          value={value}
        />
        <ErrorFormatted {...accountFollowed.error} />
      </div>
      <div className="col-auto">
        <div className="iconPlus-container">
          {iconPlus && (
            <>
              {index !== 0 && (
                <Button
                  className="mr-3"
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
              <Button
                small
                width="icon"
                secondary
                disabled={!value || accountFollowed.error.invalid || false}
                onClick={() => addRow()}
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
          {/* temporary remove X button */}
          {/* {!iconPlus && (
            <Button
              small
              width="icon"
              secondary
              onClick={() => removeRow(index)}
            >
              <IcoFont
                icon="icofont-close-circled"
                style={{
                  fontSize: '1.1rem',
                }}
              />
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};

const EntryWinnerCondition = props => {
  const {
    intl,
    campaignList,
    theme,
    raffle_type,
    winnerConditionState: { conditions },
    winDateErr: { winStartErrState, winEndErrState },
    commons: { WinnerConditionTypes, PreventPreviousWinnerTypes },
    entryWinnerState: {
      preventPrevWinner,
      winnerConditionType,
      autoSendDM,
      previousWinnerType,
      showConditions,
      winCampIds,

      winStartPeriod,
      winStartHour,
      winStartMinute,
      winEndPeriod,
      winEndHour,
      winEndMinute,
      // winStartMax,
      // startPeriod,
      // win_start_period,
      // win_end_period,
      // winStartMaxDays,
    },
    accountFollowedState,
  } = props;

  const {
    values: accountFollowed,
    addRow,
    removeRow,
    setIndexValue,
  } = accountFollowedState;

  return (
    <>
      {!BETA_CONTENT && (
        <div className="row mb-3">
          <div className="col-4">
            <Label
              htmlFor="entryMethod"
              info
              tooltip={intl.formatMessage({ id: 'M0000036' })}
            >
              {intl.formatMessage({ ...messages.entryCondition })}
            </Label>
          </div>
          <div className="col-8">
            <div className="row align-items-baseline justify-content-between">
              {accountFollowed &&
                accountFollowed.map(({ value, keydex }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={index}>
                    <div className="col-12">
                      <AccountFollowedTag
                        intl={intl}
                        index={index}
                        value={value}
                        addRow={addRow}
                        setIndexValue={setIndexValue}
                        key={Number(keydex)}
                        removeRow={removeRow}
                        // temporary limit 1 follower per campaign
                        // iconPlus={
                        //   accountFollowed.length === 1 ||
                        //   (index + 1 === accountFollowed.length &&
                        //     accountFollowed.length !== 4)
                        // }
                      />
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="winnerCondition"
            info
            tooltip={intl.formatMessage({ id: 'M0000037' })}
          >
            {intl.formatMessage({ ...messages.winnerCondition })}
          </Label>
        </div>
        <div className="col-8">
          {WinnerConditionTypes &&
            WinnerConditionTypes.map((m, idx) => (
              <RadioButton
                id={`winnerCondition${m.value}`}
                name={`winnerCondition${m.value}`}
                text={intl.formatMessage({
                  id: `winnerCondition${m.value}`,
                  defaultMessage: m.name,
                })}
                {...winnerConditionType}
                value={Number(m.value)}
                checked={Number(winnerConditionType.value) === m.value}
                subLabel={
                  idx === 1 &&
                  intl.formatMessage({
                    id: `winnerCondition${m.value}desc`,
                  })
                }
              />
            ))}
          {/* if Modify is check show */}
          {Number(winnerConditionType.value) === 2 && (
            <>
              <div className="col-8 px-0">
                <div className="row">
                  <div className="col-auto pr-0">
                    <Checkbox
                      id="showConditions"
                      {...showConditions}
                      checked={showConditions.value === true}
                    />
                  </div>
                  <Label
                    className="py-0"
                    htmlFor="showConditions"
                    subLabel={intl.formatMessage({ id: 'followersCondition' })}
                  />
                </div>
              </div>
              {showConditions.value &&
                conditions &&
                conditions.map((m, idx) => (
                  <WinnerCondition
                    // eslint-disable-next-line react/no-array-index-key
                    key={Number(m.keydex)}
                    intl={intl}
                    item={m}
                    idx={idx}
                    iconPlus={
                      conditions.length === 1 ||
                      (idx + 1 === conditions.length &&
                        conditions.length !== 10)
                    }
                    raffle_type={raffle_type}
                    {...props.winnerConditionState}
                  />
                ))}
              <div className="col-8 px-0 mt-3">
                <div className="row">
                  <div className="col-auto pr-0">
                    <Checkbox
                      id="preventPrev"
                      {...preventPrevWinner}
                      checked={preventPrevWinner.value === true}
                    />
                  </div>
                  <Label
                    className="py-0"
                    htmlFor="preventPrev"
                    subLabel={intl.formatMessage({
                      id: 'preventPreviousWinner',
                    })}
                  />
                </div>
              </div>
              <div className="pl-5 mt-3">
                {preventPrevWinner.value === true && (
                  <>
                    {PreventPreviousWinnerTypes &&
                      PreventPreviousWinnerTypes.map(m => (
                        <>
                          <RadioButton
                            id={`preventPrevWinner${m.value}`}
                            name={`preventPrevWinner${m.value}`}
                            text={intl.formatMessage({
                              id: `preventPrevWinner${m.value}`,
                              defaultMessage: m.name,
                            })}
                            {...previousWinnerType}
                            value={m.value}
                            checked={
                              Number(previousWinnerType.value) === m.value
                            }
                            subLabel={intl.formatMessage({
                              id: `preventPrevWinner${m.value}desc`,
                              defaultMessage: m.name,
                            })}
                          />
                          {Number(m.value) === 2 && (
                            <>
                              {/* show when date time selected */}
                              {Number(previousWinnerType.value) === 2 && (
                                <React.Fragment>
                                  <div className="pl-4 font-weight-bold mt-3">
                                    {intl.formatMessage({ ...messages.start })}
                                  </div>
                                  <div className="row pl-4">
                                    <div className="col-5">
                                      <Text
                                        size={theme.fontSize.xs}
                                        text={intl.formatMessage({
                                          id: 'date',
                                        })}
                                      />
                                      <br />
                                      <DatePicker
                                        {...winStartPeriod}
                                        minDate={new Date(null)}
                                        maxDate={new Date()}
                                        canClearSelection={false}
                                      />
                                    </div>
                                    <div className="col pl-0">
                                      <Text
                                        size={theme.fontSize.xs}
                                        text={intl.formatMessage({
                                          id: 'time',
                                        })}
                                      />
                                      <br />
                                      <div className="col pr-0">
                                        <div className="row align-items-center justify-content-center">
                                          <div className="col px-1">
                                            <Select
                                              name="startHour"
                                              {...winStartHour}
                                            >
                                              <option value="">
                                                {intl.formatMessage({
                                                  id: 'hour',
                                                })}
                                              </option>
                                              {/* {Array(12)
                                                .fill()
                                                .map((_, i) => (
                                                  <option value={i + 1}>
                                                    {(i + 1)
                                                      .toString()
                                                      .padStart(2, '0')}
                                                  </option>
                                                ))} */}
                                              <ConditionalHour
                                                max="today"
                                                schedule={{
                                                  date: winStartPeriod.value,
                                                }}
                                              />
                                            </Select>
                                          </div>
                                          <div className="col-auto px-1 d-flex align-items-center">
                                            :
                                          </div>
                                          <div className="col px-1">
                                            <Select
                                              name="startMinute"
                                              {...winStartMinute}
                                            >
                                              <option value="">
                                                {intl.formatMessage({
                                                  id: 'min',
                                                })}
                                              </option>
                                              {/* {Array(12)
                                                .fill()
                                                .map((_, i) => (
                                                  <option value={i * 5}>
                                                    {(i * 5)
                                                      .toString()
                                                      .padStart(2, '0')}
                                                  </option>
                                                ))} */}
                                              <ConditionalMinute
                                                max="today"
                                                schedule={{
                                                  date: winStartPeriod.value,
                                                  hour: winStartHour.value,
                                                }}
                                              />
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pl-4">
                                    <ErrorFormatted {...winStartErrState} />
                                  </div>
                                  <div className="pl-4 font-weight-bold mt-3">
                                    {intl.formatMessage({ ...messages.end })}
                                  </div>
                                  <div className="row pl-4">
                                    <div className="col-5">
                                      <Text
                                        size={theme.fontSize.xs}
                                        text={intl.formatMessage({
                                          ...messages.date,
                                        })}
                                      />
                                      <br />
                                      <DatePicker
                                        {...winEndPeriod}
                                        minDate={
                                          winStartPeriod.toDate
                                            ? new Date(winStartPeriod.toDate)
                                            : undefined
                                        }
                                        maxDate={new Date()}
                                        canClearSelection={false}
                                      />
                                    </div>
                                    <div className="col pl-0">
                                      <Text
                                        size={theme.fontSize.xs}
                                        text={intl.formatMessage({
                                          ...messages.time,
                                        })}
                                      />
                                      <br />
                                      <div className="col pr-0">
                                        <div className="row align-items-center justify-content-center">
                                          <div className="col px-1">
                                            <Select
                                              name="startHour"
                                              {...winEndHour}
                                            >
                                              <option value="">
                                                {intl.formatMessage({
                                                  ...messages.hour,
                                                })}
                                              </option>
                                              {/* {Array(12)
                                                .fill()
                                                .map((_, i) => (
                                                  <option value={i + 1}>
                                                    {i + 1}
                                                  </option>
                                                ))} */}
                                              <ConditionalHour
                                                min={
                                                  winStartHour.value
                                                    ? moment(
                                                        `${
                                                          winStartPeriod.toDate
                                                        } ${
                                                          winStartHour.value
                                                        }:00`,
                                                        'MM/DD/YYYY HH',
                                                      )
                                                    : undefined
                                                }
                                                max="today"
                                                schedule={{
                                                  date: winEndPeriod.value,
                                                }}
                                              />
                                            </Select>
                                          </div>
                                          <div className="col-auto px-1 d-flex align-items-center">
                                            :
                                          </div>
                                          <div className="col px-1">
                                            <Select
                                              name="startMinute"
                                              {...winEndMinute}
                                            >
                                              <option value="">
                                                {intl.formatMessage({
                                                  ...messages.min,
                                                })}
                                              </option>
                                              {/* {Array(12)
                                                .fill()
                                                .map((_, i) => (
                                                  <option value={i * 5}>
                                                    {(i * 5)
                                                      .toString()
                                                      .padStart(2, '0')}
                                                  </option>
                                                ))} */}
                                              <ConditionalMinute
                                                min={
                                                  winStartHour.value &&
                                                  winStartMinute.value
                                                    ? moment(
                                                        `${
                                                          winStartPeriod.toDate
                                                        } ${
                                                          winStartHour.value
                                                        }:${
                                                          winStartMinute.value
                                                        }`,
                                                        'MM/DD/YYYY HH:mm',
                                                      )
                                                    : undefined
                                                }
                                                max="today"
                                                schedule={{
                                                  date: winEndPeriod.value,
                                                  hour: winEndHour.value,
                                                }}
                                              />
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pl-4">
                                    <ErrorFormatted {...winEndErrState} />
                                  </div>
                                </React.Fragment>
                              )}
                            </>
                          )}
                        </>
                      ))}

                    {Number(previousWinnerType.value) === 3 && (
                      <>
                        <Select name="campaignList" {...winCampIds}>
                          <option value="">
                            {intl.formatMessage(
                              { id: 'M0000008' },
                              { name: intl.formatMessage(messages.campaign) },
                            )}
                          </option>
                          {campaignList &&
                            campaignList.list.map(m => (
                              <option value={m.id}>{m.title}</option>
                            ))}
                        </Select>

                        <ErrorFormatted {...winCampIds.error} />
                      </>
                    )}
                  </>
                )}

                {/* end when date time selected */}
              </div>
            </>
          )}

          {/* end modify */}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="entryMethod"
            info
            tooltip={intl.formatMessage({ id: 'M0000040' })}
          >
            {intl.formatMessage({ ...messages.autoDMWinner })}
          </Label>
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-auto pr-0">
              <Checkbox
                id="Send"
                {...autoSendDM}
                checked={autoSendDM.value === true}
              />
            </div>
            <Label
              className="py-0"
              htmlFor="Send"
              subLabel={intl.formatMessage({ ...messages.send })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

EntryWinnerCondition.propTypes = {
  commons: PropTypes.any,
  accountFollowedState: PropTypes.any,
  entryWinnerState: PropTypes.any,
  campaignList: PropTypes.any,
  theme: PropTypes.any,
  winDateErr: PropTypes.any,
  winnerConditionState: PropTypes.any,
  userAccount: PropTypes.any,
  intl: PropTypes.any,
};

AccountFollowedTag.propTypes = {
  intl: PropTypes.any,
  index: PropTypes.any,
  value: PropTypes.any,
  userAccount: PropTypes.any,
  setIndexValue: PropTypes.any,
};

export { EntryWinnerCondition };
