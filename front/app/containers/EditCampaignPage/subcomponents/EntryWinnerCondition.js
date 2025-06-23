/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
// import React, { useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Label from 'components/Label';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import DatePicker from 'components/DatePicker';
import RadioButton from 'components/RadioButton';

import ErrorFormatted from 'components/ErrorFormatted';
import { WinnerCondition } from './WinnerCondition';
import messages from '../messages';
import { ConditionalHour, ConditionalMinute } from './ConditionalOption';

const EntryWinnerCondition = props => {
  const {
    theme,
    isSavedSched,
    intl,
    campaignList,
    raffle_type,
    winnerConditionState: { conditions },
    winDateErr: { winStartErrState, winEndErrState },
    commons: { WinnerConditionType, PreventPreviousWinnerType },
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
    },
  } = props;
  return (
    <>
      <div className="row mb-3">
        <div className="col-4">
          <Label
            htmlFor="winnerCondition"
            info
            tooltip={intl.formatMessage({ id: 'M0000089' })}
          >
            {intl.formatMessage({ ...messages.winnerCondition })}
          </Label>
        </div>
        <div className="col-8">
          {WinnerConditionType &&
            WinnerConditionType.map((m, idx) => (
              <RadioButton
                key={idx}
                id={`winnerCondition${m.value}`}
                name={`winnerCondition${m.value}`}
                text={intl.formatMessage({
                  id: `winnerCondition${m.value}`,
                  defaultMessage: m.name,
                })}
                disabled={!isSavedSched}
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
                      onChange={({ target }) => {
                        showConditions.setvalue(target.checked);
                      }}
                      disabled={!isSavedSched}
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
                    key={Number(m.keydex)}
                    intl={intl}
                    item={m}
                    idx={idx}
                    raffle_type={raffle_type}
                    isSavedSched={isSavedSched}
                    iconPlus={
                      conditions.length === 1 ||
                      (idx + 1 === conditions.length &&
                        conditions.length !== 10)
                    }
                    {...props.winnerConditionState}
                  />
                ))}
              <div className="col-8 px-0 mt-3">
                <div className="row">
                  <div className="col-auto pr-0">
                    <Checkbox
                      id="preventPrev"
                      {...preventPrevWinner}
                      onChange={({ target }) => {
                        preventPrevWinner.setvalue(target.checked);
                      }}
                      disabled={!isSavedSched}
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
                    {PreventPreviousWinnerType &&
                      PreventPreviousWinnerType.map(m => (
                        <RadioButton
                          key={m.value}
                          id={`preventPrevWinner${m.value}`}
                          name={`preventPrevWinner${m.value}`}
                          text={intl.formatMessage({
                            id: `preventPrevWinner${m.value}`,
                            defaultMessage: m.name,
                          })}
                          disabled={!isSavedSched}
                          {...previousWinnerType}
                          value={m.value}
                          checked={Number(previousWinnerType.value) === m.value}
                          subLabel={intl.formatMessage({
                            id: `preventPrevWinner${m.value}desc`,
                            defaultMessage: m.name,
                          })}
                        />
                      ))}

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
                              disabled={!isSavedSched}
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
                                    name="winStartHour"
                                    {...winStartHour}
                                    disabled={!isSavedSched}
                                  >
                                    <option value="">
                                      {intl.formatMessage({
                                        id: 'hour',
                                      })}
                                    </option>
                                    {Array(24)
                                      .fill()
                                      .map((_, i) => (
                                        <option key={i} value={i + 1}>
                                          {i + 1}
                                        </option>
                                      ))}
                                  </Select>
                                </div>
                                <div className="col-auto px-1 d-flex align-items-center">
                                  :
                                </div>
                                <div className="col px-1">
                                  <Select
                                    name="winStartMinute"
                                    {...winStartMinute}
                                    disabled={!isSavedSched}
                                  >
                                    <option value="">
                                      {intl.formatMessage({
                                        id: 'min',
                                      })}
                                    </option>
                                    {Array(12)
                                      .fill()
                                      .map((_, i) => (
                                        <option key={i} value={i * 5}>
                                          {(i * 5).toString().padStart(2, '0')}
                                        </option>
                                      ))}
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
                        <div className="row pl-4 mb-3">
                          <div className="col-5">
                            <Text
                              size={theme.fontSize.xs}
                              text={intl.formatMessage({ ...messages.date })}
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
                              disabled={!isSavedSched}
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
                                  <Select
                                    name="winEndHour"
                                    {...winEndHour}
                                    disabled={!isSavedSched}
                                  >
                                    <option value="">
                                      {intl.formatMessage({
                                        ...messages.hour,
                                      })}
                                    </option>
                                    {/* {Array(12)
                                      .fill()
                                      .map((_, i) => (
                                        <option value={i + 1}>{i + 1}</option>
                                      ))} */}
                                    <ConditionalHour
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
                                    name="winEndMinute"
                                    {...winEndMinute}
                                    disabled={!isSavedSched}
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
                    {Number(previousWinnerType.value) === 3 && (
                      <>
                        <Select
                          name="campaignList"
                          {...winCampIds}
                          disabled={!isSavedSched}
                        >
                          <option value="">
                            {intl.formatMessage(
                              { id: 'M0000008' },
                              { name: intl.formatMessage(messages.campaign) },
                            )}
                          </option>
                          {campaignList &&
                            campaignList.list.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.title}
                              </option>
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
                onChange={() => {
                  autoSendDM.setvalue(!autoSendDM.value);
                }}
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
  theme: PropTypes.any,
  entryWinnerState: PropTypes.any,
  accountFollowedState: PropTypes.any,
  intl: PropTypes.any,
  campaignList: PropTypes.any,
  winnerConditionState: PropTypes.any,
  winDateErr: PropTypes.any,
  commons: PropTypes.any,
  raffle_type: PropTypes.any,
  isSavedSched: PropTypes.any,
};

export default EntryWinnerCondition;
