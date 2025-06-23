/* eslint-disable react/no-array-index-key */
/* eslint-disable */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Label from 'components/Label';
import Checkbox from 'components/Checkbox';
import Select from 'components/Select';
import DatePicker from 'components/DatePicker';
import ErrorFormatted from 'components/ErrorFormatted';
import { ConditionalHour, ConditionalMinute } from './ConditionalOption';
import messages from '../messages';

const CampaignPeriod = props => {
  const {
    intl,
    theme,
    campDetails,
    ongoingFixedRaffle,
    periodDateEr: { startErrState, endErrState },
    dateFields: {
      startDate,
      startHour,
      startMinute,
      endDate,
      endHour,
      endMinute,
      startMaxDays,
      endMinDays,
      startOnPublish,
    },
  } = props;

  const showToday = () => {
    const st = startDate.toDate;
    const td = moment().format('MM/DD/YYYY');

    return st !== td;
  };

  return (
    <>
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
              {Number(campDetails.status) !== 0 &&
                Number(campDetails.status) !== 2 &&
                Number(campDetails.status) !== 9 && (
                  <>
                    <div className="col-auto pr-0">
                      <Checkbox
                        id="startOnPublish"
                        {...startOnPublish}
                        onChange={({ target }) => {
                          startOnPublish.setvalue(target.checked);
                        }}
                        checked={startOnPublish.value === true}
                      />
                    </div>
                    <Label
                      className="py-0"
                      htmlFor="startOnPublish"
                      subLabel={intl.formatMessage({
                        ...messages.M0000067,
                      })}
                    />
                  </>
              )}
            </div>
            <div className="row">
              {[0, 2, 9].includes(Number(campDetails.status)) && (
                <div className="col-5">
                  <Text
                    size={theme.fontSize.xs}
                    text={intl.formatMessage({ ...messages.date })}
                  />
                  <br />
                  {campDetails.start_period}
                </div>
              )}

              {!startOnPublish.value &&
              Number(campDetails.status) !== 0 &&
              Number(campDetails.status) !== 2 ? (
                <>
                  <div className="col-5">
                    <Text
                      size={theme.fontSize.xs}
                      text={intl.formatMessage({ ...messages.date })}
                    />
                    <br />

                    <DatePicker
                      {...startDate}
                      defaultDt={null}
                      minDate={new Date()}
                      maxDate={undefined}
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
                            {/* {[...Array(12)].map((x, i) => (
                              <option key={i + 1} value={Number(i + 1)}>
                                {(i + 1).toString().padStart(2, '0')}
                              </option>
                            ))} */}
                            <ConditionalHour
                              min="today"
                              schedule={{
                                date: startDate.value,
                              }}
                            />
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
                            {/* {Array(12)
                              .fill()
                              .map((_, i) => (
                                <option key={i * 5} value={i * 5}>
                                  {(i * 5).toString().padStart(2, '0')}
                                </option>
                              ))} */}
                            <ConditionalMinute
                              min="today"
                              schedule={{
                                date: startDate.value,
                                hour: startHour.value,
                              }}
                            />
                          </Select>
                        </div>
                      </div>

                      <ErrorFormatted {...startHour.error} />
                      <ErrorFormatted {...startErrState} />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div>
            <Label className="p-0 mt-3">
              {intl.formatMessage({ ...messages.end })}
            </Label>
            <div className="row">
              {(ongoingFixedRaffle || [2].includes(Number(campDetails.status))) && (
                <div className="col-5">
                  <Text
                    size={theme.fontSize.xs}
                    text={intl.formatMessage({ ...messages.date })}
                  />
                  <br />
                  {campDetails.end_period}
                </div>
              )}
              {!ongoingFixedRaffle && ![2].includes(Number(campDetails.status)) && (
                <>
                  <div className="col-5">
                    <Text
                      size={theme.fontSize.xs}
                      text={intl.formatMessage({ ...messages.date })}
                    />
                    <br />
                    <DatePicker
                      {...endDate}
                      defaultDt={null}
                      minDate={endMinDays}
                      maxDate={startMaxDays}
                      hideTodayButton={showToday()}
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
                            {Array(24)
                              .fill()
                              .map((_, i) => (
                                <option key={i + 1} value={Number(i + 1)}>
                                  {(i + 1).toString().padStart(2, '0')}
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
                            {Array(12)
                              .fill()
                              .map((_, i) => (
                                <option key={i * 5} value={i * 5}>
                                  {(i * 5).toString().padStart(2, '0')}
                                </option>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <ErrorFormatted {...endMinute.error} />
                      <ErrorFormatted {...endErrState} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CampaignPeriod.propTypes = {
  dateFields: PropTypes.any,
  campDetails: PropTypes.any,
  theme: PropTypes.any,
  intl: PropTypes.any,
  periodDateEr: PropTypes.any,
  ongoingFixedRaffle: PropTypes.any,
};

export default CampaignPeriod;
