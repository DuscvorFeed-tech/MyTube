/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
// import IcoFont from 'react-icofont';
import DatePicker from 'components/DatePicker';
import Table from './CustomTable';
import validation from '../validators';
import useValidation, { isValid } from '../../../library/validator';
import { dateExtraProps, useCampaignPrize } from '../inputStateEffect';
import ErrorFormatted from '../../../components/ErrorFormatted';
import {
  ConditionalHour,
  ConditionalMinute,
  GenerateTime,
} from './ConditionalOption';
import messages from '../messages';

const InputPrizeName = ({
  intl,
  index,
  name,
  amount,
  setCampaignPrize,
  setPrizeName,
}) => {
  const { prizeName } = useCampaignPrize(intl, name);
  useEffect(() => {
    if (prizeName.value !== undefined && name !== prizeName.value) {
      setCampaignPrize(index, prizeName.value, amount, '');
      setPrizeName(index, prizeName.value);
    }
  }, [prizeName.value]);

  return (
    <td>
      <Input
        {...prizeName}
        type="text"
        value={prizeName.value || name}
        placeholder={intl.formatMessage(
          { id: 'T0000031' },
          { name: intl.formatMessage({ ...messages.prizeName }) },
        )}
      />
      <ErrorFormatted {...prizeName.error} />
    </td>
  );
};

const InputPrizeAmount = ({
  intl,
  index,
  idx,
  amount,
  updatePrizeAmount,
  setPrizeInfo,
}) => {
  const { prizeAmount } = useCampaignPrize(intl);
  useEffect(() => {
    if (prizeAmount.value !== undefined) {
      const newAmount = setPrizeInfo(index, idx, prizeAmount.value);
      // setCampaignPrize(idx, (prizeAmount.value || 0) - baseAmount);
      updatePrizeAmount(idx, newAmount);
    }
  }, [prizeAmount.value]);

  return (
    <td>
      <div>
        <Input
          {...prizeAmount}
          value={amount}
          placeholder={intl.formatMessage(
            { id: 'T0000031' },
            { name: intl.formatMessage({ ...messages.quantity }) },
          )}
        />
      </div>
    </td>
  );
};

const InputSchedule = ({
  index,
  intl,
  max,
  min,
  schedule,
  setScheduleDate,
}) => {
  const validator = validation(intl);
  const date = useValidation(UNDEF, UNDEF, UNDEF, dateExtraProps);
  const hour = useValidation();
  const minuite = useValidation();
  const seriesTimeForPD = GenerateTime({
    min,
    max,
    schedule: { date: schedule.date },
  });

  const seriesForPD = seriesTimeForPD.series;

  useEffect(() => {
    if (![date.value, hour.value, minuite.value].every(s => s === undefined)) {
      let tempH = null;
      let tempM = null;
      const tempAmp = null;

      const { minDate, maxDate } = seriesTimeForPD;
      const d = moment(date.value || schedule.date).format('MM/DD/YYYY');
      const ref = moment(
        `${d} ${hour.value || schedule.hour}:${minuite.value || schedule.min}`,
        'MM/DD/YYYY HH:mm',
      );
      if ((minDate && minDate >= ref) || (maxDate && maxDate < ref)) {
        const dtime = seriesTimeForPD.getDefaultValues();
        if (dtime) {
          tempH = dtime.hour;
          tempM = dtime.minute;
        }
      }
      setScheduleDate(
        index,
        date.value === null || date.value ? date.value : schedule.date,
        tempH || hour.value || schedule.hour,
        tempM || minuite.value || schedule.min,
        { pastDate: min, intl },
      );
    }
  }, [date.value, hour.value, minuite.value]);
  return (
    <td>
      <div>
        <DatePicker
          {...date}
          value={schedule.date}
          maxDate={max && max.toDate()}
          minDate={min && min.toDate()}
          disabled={schedule.disabled}
        />
        <div className="row align-items-center justify-content-center mt-1">
          <div className="col pr-1">
            <Select
              name="startHour"
              {...hour}
              value={schedule.hour}
              disabled={schedule.disabled}
            >
              {seriesForPD &&
                seriesForPD.map(h => (
                  <option key={Math.random()} value={h.value}>
                    {h.value.toString().padStart(2, '0')}
                  </option>
                ))}
            </Select>
          </div>
          <div className="col-auto px-1 d-flex align-items-center">:</div>
          <div className="col px-1">
            <Select
              name="startMinute"
              {...minuite}
              value={schedule.min}
              disabled={schedule.disabled}
            >
              {seriesForPD &&
                seriesForPD
                  .filter(({ value }) => value === Number(schedule.hour))
                  .map(h =>
                    h.list.map(mins => (
                      <option key={Math.random()} value={mins}>
                        {mins.toString().padStart(2, '0')}
                      </option>
                    )),
                  )}
            </Select>
          </div>
        </div>
        <ErrorFormatted {...schedule.error} />
      </div>
    </td>
  );
};

const PrizeForDistribution = ({
  intl,
  schedDistribution,
  prizeInfo,
  setCampaignPrize,
  updatePrizeAmount,
  setPrizeInfo,
  setPrizeName,
  setScheduleDate,
  startPeriod,
  endPeriod,
  numberOfWinnersFixed,
}) => (
  <React.Fragment>
    <Table isResponsive>
      <thead>
        <td colSpan="2" />
        {prizeInfo &&
          prizeInfo.map(({ name, amount, keydex }, index) => (
            <InputPrizeName
              key={keydex}
              index={index}
              name={name}
              amount={amount}
              intl={intl}
              setCampaignPrize={setCampaignPrize}
              setPrizeName={setPrizeName}
              // prizeInfo={prizeInfo}
            />
          ))}
      </thead>
      <tbody>
        {schedDistribution &&
          schedDistribution.map(
            ({ schedule, ordinalNumber, prizeInfo: prizes, keydex }, index) => (
              <tr key={keydex}>
                <td>
                  <Label>
                    {index + 1}
                    {intl.locale === 'en' && ordinalNumber
                      ? intl.formatMessage({ id: `ordinal${ordinalNumber}` })
                      : ''}
                    {` ${intl.formatMessage({ id: 'raffle' })}`}
                  </Label>
                </td>
                <InputSchedule
                  index={index}
                  intl={intl}
                  schedule={schedule}
                  setScheduleDate={setScheduleDate}
                  schedDistribution={schedDistribution}
                  min={startPeriod}
                  max={endPeriod}
                />
                {prizes &&
                  prizes.map((d, idx) => (
                    <InputPrizeAmount
                      {...d}
                      key={d.keydex}
                      index={index}
                      idx={idx}
                      intl={intl}
                      updatePrizeAmount={updatePrizeAmount}
                      setPrizeInfo={setPrizeInfo}
                      srcInfo={prizeInfo[d.indx]}
                    />
                  ))}
              </tr>
            ),
          )}
        <tr className="pt-3">
          <td>
            <Label />
          </td>
          <td className="text-right">
            <div>
              <Label>{intl.formatMessage({ ...messages.subtotal })}</Label>
            </div>
          </td>
          {prizeInfo &&
            prizeInfo.map((d, idx) => (
              <td>
                <div>
                  <Label>{d.amount}</Label>
                </div>
              </td>
            ))}
        </tr>
        <tr className="pt-3">
          <td className="border-0">
            <Label />
          </td>
          <td className="text-right border-0 font-weight-bold text-uppercase">
            <div>
              <Label>{intl.formatMessage({ ...messages.total })}</Label>
            </div>
          </td>
          <td className="border-0 font-weight-bold text-uppercase">
            <div>
              <Label>{numberOfWinnersFixed}</Label>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  </React.Fragment>
);

export { PrizeForDistribution };
