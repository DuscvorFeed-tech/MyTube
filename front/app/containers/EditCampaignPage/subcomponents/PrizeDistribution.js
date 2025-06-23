/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
// import moment from 'moment';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
// import IcoFont from 'react-icofont';
import DatePicker from 'components/DatePicker';
import { expandDateTime } from 'utils/commonHelper';
import Table from './CustomTable';
import validation from '../validators';
import useValidation, { isValid } from '../../../library/validator';
import { dateExtraProps, useCampaignPrize } from '../editState';
import ErrorFormatted from '../../../components/ErrorFormatted';
import { ConditionalHour, ConditionalMinute } from './ConditionalOption';
import messages from '../messages';
const today = expandDateTime(false);
const InputPrizeName = ({
  intl,
  index,
  name,
  amount,
  setCampaignPrize,
  ongoingFixedRaffle,
}) => {
  const validator = validation(intl);
  const { prizeName } = useCampaignPrize(intl);
  useEffect(() => {
    if (prizeName.value !== undefined) {
      setCampaignPrize(index, prizeName.value, amount, '');
    }
  }, [prizeName.value]);

  return (
    <td>
      <div>
        <Input
          {...prizeName}
          value={name}
          disabled={ongoingFixedRaffle}
          placeholder={intl.formatMessage(
            { id: 'T0000031' },
            { name: intl.formatMessage({ ...messages.prizeName }) },
          )}
        />
        <ErrorFormatted {...prizeName.error} />
      </div>
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
  ongoingFixedRaffle,
  isPastSchedule,
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
          disabled={isPastSchedule}
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
  ongoingFixedRaffle,
}) => {
  const validator = validation(intl);
  const date = useValidation(UNDEF, UNDEF, UNDEF, dateExtraProps);
  const hour = useValidation();
  const minuite = useValidation();
  useEffect(() => {
    if (![date.value, hour.value, minuite.value].every(s => s === undefined))
      setScheduleDate(
        index,
        date.value || schedule.date,
        hour.value || schedule.hour,
        minuite.value || schedule.min,
      );
  }, [date.value, hour.value, minuite.value]);

  return (
    <td>
      <div>
        <DatePicker
          {...date}
          value={schedule.date}
          disabled={schedule.disabled}
        />
        <div className="row align-items-center justify-content-center mt-1">
          <div className="col pr-1">
            {schedule.disabled ? (
              <Input
                name="startHour"
                {...hour}
                value={schedule.hour}
                disabled={schedule.disabled}
              />
            ) : (
              <Select
                name="startHour"
                {...hour}
                value={schedule.hour}
                disabled={schedule.disabled}
              >
                <ConditionalHour
                  max={max}
                  min={min}
                  schedule={schedule}
                  ongoingFixedRaffle={ongoingFixedRaffle}
                />
              </Select>
            )}
          </div>
          <div className="col-auto px-1 d-flex align-items-center">:</div>
          <div className="col px-1">
            {schedule.disabled ? (
              <Input
                name="startMinute"
                {...minuite}
                value={schedule.min.toString().padStart(2, '0')}
                disabled={schedule.disabled}
              />
            ) : (
              <Select
                name="startMinute"
                {...minuite}
                value={schedule.min}
                disabled={schedule.disabled}
              >
                <ConditionalMinute
                  max={max}
                  min={min}
                  schedule={schedule}
                  ongoingFixedRaffle={ongoingFixedRaffle}
                />
              </Select>
            )}
          </div>
          <ErrorFormatted {...schedule.error} />
        </div>
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
  setScheduleDate,
  startPeriod,
  endPeriod,
  ongoingFixedRaffle,
  numberOfWinnersFixed,
  autoSendDm,
  disabled,
}) => (
  <React.Fragment>
    <Table isResponsive>
      <thead>
        <td colSpan="2" />
        {prizeInfo &&
          prizeInfo.map(({ name, amount }, index) => (
            <InputPrizeName
              index={index}
              name={name}
              amount={amount}
              intl={intl}
              ongoingFixedRaffle={ongoingFixedRaffle}
              setCampaignPrize={setCampaignPrize}
              // prizeInfo={prizeInfo}
            />
          ))}
      </thead>
      <tbody>
        {schedDistribution &&
          schedDistribution
            .sort(
              (a, b) =>
                new Date(a.schedule.date).getTime() -
                new Date(b.schedule.date).getTime(),
            )
            .map(({ schedule, ordinalNumber, prizeInfo: prizes }, index) => {
              let b = false;
              prizes.forEach(prize => {
                if (prize.amount) {
                  b = true;
                }
              });

              return (
                <tr>
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
                    ongoingFixedRaffle={ongoingFixedRaffle}
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
                        index={index}
                        idx={idx}
                        intl={intl}
                        isPastSchedule={
                          schedule.toMoment < today.toMoment ||
                          autoSendDm ||
                          disabled
                        } // Disable prize edit when auto send is checked
                        ongoingFixedRaffle={ongoingFixedRaffle}
                        updatePrizeAmount={updatePrizeAmount}
                        setPrizeInfo={setPrizeInfo}
                        srcInfo={prizeInfo[d.indx]}
                      />
                    ))}
                </tr>
              );
            })}
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
