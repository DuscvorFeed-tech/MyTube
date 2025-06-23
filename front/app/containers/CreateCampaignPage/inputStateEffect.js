/* eslint-disable no-plusplus */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { MediaType } from 'library/commonValues';
import validation from './validators';
import useValidation, { isValid } from '../../library/validator';
import {
  minValue,
  maxValue,
  required,
  maxLength,
} from '../../library/validator/rules';
import { prizeName } from '../../helpers/validators';
import messages from './messages';
import { ImageValidation } from '../TweetPage/tweetState';
import {
  GenerateTime,
  GenerateFormatted,
} from './subcomponents/ConditionalOption';

export function dateExtraProps({ value }) {
  const sm = moment(value);
  let toDate = null;

  function toApiFormat(hour, min) {
    const m = moment(`${sm.format('MM/DD/YYYY')} ${hour}:${min}`);
    if (m.isValid()) {
      return m.format('MM/DD/YYYY HH:mm');
    }

    return null;
  }

  if (value && sm.isValid()) {
    toDate = sm.format('MM/DD/YYYY');
  }
  return { toDate, toApiFormat };
}

function datePickerChecker(startOnPublish, start, end, onChange) {
  let value = end;
  if (!startOnPublish && start && start > end) {
    value = start;
    onChange(value);
  }
  return { value };
}

export const CampaignDetailState = (intl, snsType) => {
  const validator = validation(intl);
  const campaignTitle = useValidation('', validator.campaignTitle);
  const campaignDescription = useValidation(
    '',
    validator.campaignDescription,
    true,
  );
  const labelId = useValidation(UNDEF, UNDEF, true);
  const startOnPublish = useValidation('');
  const startPeriod = useValidation(
    new Date(),
    undefined,
    undefined,
    props => ({
      ...dateExtraProps(props),
      beforesetvalue: target => {
        if (!startOnPublish.value && target && target > endPeriod.value) {
          endPeriod.setvalue(target);
        }
        return target;
      },
    }),
  );
  const startHour = useValidation(
    '',
    validator.startHour(startOnPublish.value),
  );
  useEffect(() => {
    if (startOnPublish !== '') {
      if (!startPeriod.value) {
        startPeriod.setvalue(new Date());
      }
    }
  }, [startOnPublish.value]);
  const startMinute = useValidation('', validator.startMinute);
  const seriesStartTime = GenerateTime({
    min: 'today',
    schedule: { date: startPeriod.value },
  });
  useEffect(() => {
    if (startPeriod.value) {
      const { minDate, maxDate } = seriesStartTime;
      const ref = moment(startPeriod.value).format('YYYYMMDD');
      if (
        (minDate && minDate.format('YYYYMMDD') === ref) ||
        (maxDate && maxDate.format('YYYYMMDD') === ref)
      ) {
        const dtime = seriesStartTime.getDefaultValues();
        if (dtime) {
          startHour.onChange(dtime.hour);
          startMinute.onChange(dtime.minute);
        }
      }
    }
  }, [startPeriod.value]);

  useEffect(() => {
    if (startPeriod.value) {
      const { minDate, maxDate } = seriesStartTime;
      const ref = moment(startPeriod.value).format('YYYYMMDD');
      if (
        (minDate && minDate.format('YYYYMMDD') === ref) ||
        (maxDate && maxDate.format('YYYYMMDD') === ref)
      ) {
        startHour.onChange('');
        startMinute.onChange('');
      }
    }
  }, [startPeriod.value]);

  const endPeriod = useValidation(new Date(), undefined, undefined, props => ({
    ...dateExtraProps(props),
    // ...datePickerChecker(
    //   startOnPublish.value,
    //   startPeriod.value,
    //   props.value,
    //   props.onChange,
    // ),
  }));
  const endHour = useValidation('', validator.startHour(false));
  const endMinute = useValidation('', validator.endMinute);
  const seriesEndTime = GenerateTime({
    min: !startOnPublish.value
      ? GenerateFormatted({
          date: startPeriod.value,
          hour: startHour.value,
          min: startMinute.value,
        }).add(5, 'minute')
      : startPeriod.value,
    schedule: { date: endPeriod.value },
  });
  useEffect(() => {
    if (endPeriod.value) {
      const { minDate, maxDate } = seriesStartTime;
      const ref = moment(endPeriod.value).format('YYYYMMDD');
      if (
        (minDate && minDate.format('YYYYMMDD') === ref) ||
        (maxDate && maxDate.format('YYYYMMDD') === ref)
      ) {
        const dtime = seriesEndTime.getDefaultValues();
        if (dtime) {
          endHour.onChange(dtime.hour);
          endMinute.onChange(dtime.minute);
        }
      }
    }
  }, [endPeriod.value]);

  useEffect(() => {
    if (endPeriod.value) {
      const { minDate, maxDate } = seriesEndTime;
      const ref = moment(endPeriod.value).format('YYYYMMDD');
      if (
        (minDate && minDate.format('YYYYMMDD') === ref) ||
        (maxDate && maxDate.format('YYYYMMDD') === ref)
      ) {
        endHour.onChange('');
        endMinute.onChange('');
      }
    }
  }, [endPeriod.value]);
  const campaignType = useValidation(
    snsType === 1 ? '1' : '2',
    validator.campaignType,
    true,
  );

  // const targetHashTag = useValidation('');
  const start_period = startPeriod.toApiFormat(
    startHour.value,
    startMinute.value,
  );
  const end_period = endPeriod.toApiFormat(endHour.value, endMinute.value);

  let startMaxDays = moment()
    .add(31, 'days')
    .toDate();

  let endMinDays = new Date();

  if (!startOnPublish.value) {
    startMaxDays = startPeriod.toDate
      ? moment(startPeriod.toDate)
          .add(31, 'days')
          .toDate()
      : undefined;

    endMinDays = startPeriod.toDate ? new Date(startPeriod.toDate) : undefined;
  }

  useEffect(() => {
    if (new Date(endPeriod.value) !== new Date()) {
      if (startMaxDays < endPeriod.value) {
        endPeriod.setvalue(startPeriod.value);
      }
    }
  }, [startPeriod.value]);

  const hashtagCondition = useValidation(0, validator.hashtagCondition, true);

  const invalid = !isValid([
    campaignTitle,
    campaignDescription,
    labelId,
    campaignType,
    hashtagCondition,
  ]);

  // const invalidDate = startOnPublish.value ? startPeriod.
  // console.log(invalidDate);
  return {
    campaignTitle,
    campaignDescription,
    labelId,
    seriesStartTime: seriesStartTime.series,
    seriesEndTime: seriesEndTime.series,
    startOnPublish,
    startPeriod,
    startHour,
    startMinute,
    endPeriod,
    endHour,
    endMinute,
    campaignType,
    // targetHashTag,
    start_period,
    end_period,
    startMaxDays,
    endMinDays,
    invalid,
    hashtagCondition,
  };
};

export const ReffleSettingsState = (intl, campaignType) => {
  const validator = validation(intl);
  const limitError = useValidation(false);
  const autoRaffle = useValidation(false);
  const raffleType = useValidation('2');
  const winLimit = useValidation('1', validator.winLimit, undefined, () => {
    if (raffleType.value === '2' || campaignType === '1') {
      return { error: { invalid: false } };
    }
    return {};
  });
  const raffleInterval = useValidation(
    '',
    validator.raffleInterval,
    undefined,
    () => {
      if (raffleType.value !== '3') {
        return { error: { invalid: false } };
      }
      return {};
    },
  );

  function checkWinLimit(max) {
    const err = {
      list: [],
      invalid: false,
    };

    if (Number(campaignType) !== 1 && Number(raffleType) !== 2) {
      const invalid = maxValue({
        name: intl.formatMessage(messages.winLimit),
        max: Number(max) === 0 ? 1 : max,
      })({
        value: winLimit.value,
      });
      return invalid
        ? {
            list: [invalid],
            invalid: true,
          }
        : err;
    }
    return err;
  }

  const ifWin =
    [1, 3].includes(Number(raffleType.value)) && Number(campaignType) === 2
      ? winLimit.value === ''
      : false;

  const invalid = isValid([raffleType]) && ifWin;
  return {
    raffleType,
    winLimit,
    autoRaffle,
    raffleInterval,
    invalid,
    checkWinLimit,
  };
};

export const useCampaignPrize = (intl, name, prize, percentage) => {
  const validator = validation(intl);
  return {
    prizeName: useValidation(name, validator.prizeName),
    prizeAmount: useValidation(prize, validator.prizeAmount),
    winPercentage: useValidation(percentage, validator.percentage),
  };
};

export const useRaffleFixedPrize = (intl, maxAmount) => {
  const validator = validation(intl);
  return {
    prizeName: useValidation(UNDEF, validator.prizeName),
    prizeAmount: useValidation(
      UNDEF,
      validator.fixedAmount(maxAmount || UNDEF),
    ),
    winPercentage: useValidation(UNDEF),
  };
};

export const TemplateAndFormState = (intl, snsType) => {
  const validator = validation(intl);

  const postWinTemplate = useValidation('', validator.postWinTemplate);
  const postLoseTemplate = useValidation('');
  const postTyTemplate = useValidation('');

  const dmWinTemplate = useValidation('', validator.dmWinTemplate(snsType));
  const dmLoseTemplate = useValidation('');
  const dmTyTemplate = useValidation('');
  const dmFormTemplate = useValidation('', validator.dmFormTemplate);

  const formMessageTemplate = useValidation('', validator.formTemplate);
  const inputFormFields = useValidation(
    ['1', '2', '3', '4', '5'],
    validator.formFields,
  );
  const inputFormFieldsRequired = useValidation(['1', '2', '3', '4', '5']);
  const inputFormFields2 = useValidation(
    ['1', '2', '3', '4'],
    validator.formFields2,
  );
  const inputFormFields3 = useValidation(
    ['1', '2', '3', '4'],
    validator.formFields3,
  );
  const inputFieldEmail = useValidation('1');
  const inputFieldFullname = useValidation('2');
  const inputFieldContactNo = useValidation('3');
  const inputFieldAddress = useValidation('4');

  function invalid({
    showPostWin,
    showPostLose,
    showPostTy,
    showDMLose,
    showDMTy,
    showDMForm,
  }) {
    return (
      (showPostWin && !postWinTemplate.value) ||
      (showPostLose && !postLoseTemplate.value) ||
      (showPostTy && !postTyTemplate.value) ||
      (showDMLose && !dmLoseTemplate.value) ||
      (showDMTy && !dmTyTemplate.value) ||
      (showDMForm && !dmFormTemplate.value) ||
      inputFormFields.value.every(frm => !frm) ||
      inputFormFields2.value.every(frm => !frm)
    );
  }

  return {
    postWinTemplate,
    postLoseTemplate,
    postTyTemplate,
    dmWinTemplate,
    dmLoseTemplate,
    dmTyTemplate,
    dmFormTemplate,
    formMessageTemplate,
    inputFormFields,
    inputFormFields2,
    inputFormFields3,
    inputFormFieldsRequired,
    inputFieldEmail,
    inputFieldFullname,
    inputFieldContactNo,
    inputFieldAddress,
    form_fields: inputFormFields.value,
    form_fields2: inputFormFields2.value,
    form_fields3: inputFormFields3.value,
    invalid,
  };
};

export const PublishTwitterState = intl => {
  const validator = validation(intl);
  const content = useValidation('', validator.content);
  const postTweetViaCamps = useValidation(false, validator.postTweetViaCamps);
  const postId = useValidation('', validator.postId);
  return {
    content,
    postTweetViaCamps,
    postId,
  };
};

export const useStartPeriodValidation = state => {
  const format = 'MM/DD/YYYY HH:mm';
  const [error, setError] = useState(null);
  const { intl, startOnPublish, startPeriod, startHour, startMinute } = state;

  function isValidDate() {
    if (startHour >= 0 && startMinute >= 0) {
      const m = moment(`${startPeriod} ${startHour}:${startMinute}`, format);
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;

    if (startPeriod) {
      const startDate = moment(
        `${startPeriod} ${startHour}:${startMinute}`,
        format,
      );
      if (!startOnPublish) {
        // invalid = required({ name: intl.formatMessage(messages.startMinute) })({
        //   value: startMinute,
        // });
        // invalid = required({ name: intl.formatMessage(messages.startHour) })({
        //   value: startHour,
        // });
        if (startHour && startMinute) {
          invalid = minValue({ errorCode: 'ERROR0037', min: moment() })({
            value: startDate,
          });
        }
      }
    } else if (!startOnPublish) {
      invalid = required({
        name: intl.formatMessage(messages.campaignPeriodStart),
      })({
        value: startPeriod,
      });
    }

    setError(invalid);
  }, [startOnPublish, startPeriod, startHour, startMinute]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return { list: [], invalid: !startOnPublish && !isValidDate() };
};

export const useEndPeriodValidation = state => {
  const format = 'MM/DD/YYYY HH:mm';
  const [error, setError] = useState(null);
  const {
    startOnPublish,
    endPeriod,
    endHour,
    endMinute,
    startPeriod,
    startHour,
    startMinute,
    intl,
  } = state;

  function isValidDate() {
    if (endHour >= 0 && endMinute >= 0) {
      const m = moment(`${endPeriod} ${endHour}:${endMinute}`, format);
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;

    if (endPeriod) {
      if (endHour && endMinute) {
        const endDate = moment(`${endPeriod} ${endHour}:${endMinute}`, format);
        let startDate = moment();
        if (startOnPublish) {
          invalid = minValue({ errorCode: 'ERROR0037', min: startDate })({
            value: endDate,
          });
        } else {
          startDate = moment(
            `${startPeriod} ${startHour}:${startMinute}`,
            format,
          );
          invalid = minValue({ errorCode: 'ERROR0038', min: startDate })({
            value: endDate,
          });

          if (new Date(endDate).getTime() === new Date(startDate).getTime()) {
            invalid = {
              errorCode: 'ERROR0038',
              formatIntl: { id: 'ERROR0038', values: {} },
            };
          }
        }

        if ((startHour && startMinute) || startOnPublish) {
          const durationDays = endDate.diff(startDate, 'days');
          if (durationDays > 31) {
            invalid = {
              errorCode: 'ERROR0039',
              formatIntl: { id: 'ERROR0039', values: {} },
            };
          }
        }
      } else {
        invalid = minValue({
          errorCode: 'ERROR0038',
          min: moment(startPeriod),
        })({
          value: moment(endPeriod),
        });
      }
    } else {
      invalid = required({
        name: intl.formatMessage(messages.campaignPeriodEnd),
      })({
        value: endPeriod,
      });
    }
    setError(invalid);
  }, [
    startOnPublish,
    endPeriod,
    endHour,
    endMinute,
    startPeriod,
    startHour,
    startMinute,
  ]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return { list: [], invalid: !isValidDate() };
};

export function getKeyDex() {
  return Math.floor(Math.random() * 900) + 100;
}

export const useRafflePrizeState = () => {
  const [prizeInfo, setPrizeInfo] = useState([
    {
      name: '',
      amount: '',
      percentage: '',
      keydex: getKeyDex(),
    },
  ]);

  function addPrizeInfo() {
    setPrizeInfo(oldInfo => [
      ...oldInfo,
      {
        name: '',
        amount: '',
        percentage: '',
        keydex: getKeyDex(),
      },
    ]);
  }

  function removePrizeInfo(index) {
    setPrizeInfo(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo.splice(index, 1);
      return newInfo;
    });
  }

  function runValidation(prizes) {
    prizes.forEach(({ name }, index) => {
      // eslint-disable-next-line no-param-reassign
      prizes[index].error = undefined;
      if (
        name &&
        prizes.find(
          (info, i) =>
            i !== index &&
            info.name &&
            info.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        const invalid = {
          errorCode: 'ERROR0047',
          formatIntl: { id: 'ERROR0047', values: { name } },
        };
        // eslint-disable-next-line no-param-reassign
        prizes[index].error = { list: [invalid], invalid: true };
      }
    });
  }

  function setCampaignPrize(index, name, amount, percentage) {
    setPrizeInfo(oldInfo => {
      const newInfo = Array.from(oldInfo);
      newInfo[index] = { ...newInfo[index], name, amount, percentage };
      runValidation(newInfo);
      return newInfo;
    });
  }

  function updatePrizeAmount(index, amount) {
    setPrizeInfo(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo[index].amount = amount;
      return newInfo;
    });
  }

  const numberOfWinners = [...prizeInfo].reduce(
    (am, pir) => am + (Number(pir.amount) || 0),
    0,
  );

  return {
    prizeInfo,
    addPrizeInfo,
    removePrizeInfo,
    setCampaignPrize,
    updatePrizeAmount,
    numberOfWinners,
    invalid: raffleType =>
      prizeInfo.every(
        ({ name, amount, percentage, error }) =>
          !name ||
          !amount ||
          (raffleType === '1' && !percentage) ||
          error ||
          prizeName('')[0]({ value: name }),
      ) ||
      prizeInfo.some(({ name, amount, percentage }) => {
        const arr = [!name, !Number(amount)];
        if (raffleType === '1') {
          arr.push(!Number(percentage));
        }

        return arr.some(val => val);
      }),
  };
};

export const useTargetHashtagState = intl => {
  const [values, setvalue] = useState([
    { value: undefined, keydex: getKeyDex(), invalid: false },
  ]);

  function addRow() {
    setvalue(oldInfo => [
      ...oldInfo,
      { value: '', keydex: getKeyDex(), invalid: false },
    ]);
  }

  function removeRow(index) {
    setvalue(prev => {
      const newDt = [...prev];
      newDt.splice(index, 1);
      return newDt;
    });
  }

  function setIndexValue(index, value, invalid) {
    setvalue(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo[index] = { ...newInfo[index], value, invalid };
      return newInfo;
    });
  }

  function check() {
    const fil = values.filter(f => !f.value || f.invalid === true);
    return fil.length > 0;
  }

  return {
    values,
    payload: values.every(e => e.value) ? values.map(m => m.value) : [],
    removeRow,
    addRow,
    setIndexValue,
    invalid: type => Number(type) === 2 && check(),
  };
};

const optionInterval = { 1: 1, 6: 6, 12: 12, 24: 24 };

export const getValidInterval = (start, end) => {
  const interval = [];
  const { diff } = getNumberOfRaffle(start, end);

  Object.keys(optionInterval).forEach(key => {
    if (diff / optionInterval[key] <= 31 || diff <= 31) {
      interval.push(Number(key));
    }
  });
  return interval;
};

export const getNumberOfRaffle = (start, end, raffleInt) => {
  const raffleDates = [];
  const diff =
    1 + moment(end).diff(moment(start || new Date()), 'hours', false);
  const interval = Number(raffleInt);
  // const interval = optionInterval[Number(raffleInt)];
  // const result = diff / (interval || 1);
  // let times = Math.round(result);
  // if (result > 30) {
  //   times = 1;
  // } else if (result < 1) {
  //   times = 1;
  // }
  if (raffleInt) {
    const endDate = moment(end);
    const { toMoment } = getSchedule(start || new Date());
    let nextRaffle = moment(toMoment);
    while (endDate > nextRaffle) {
      nextRaffle = nextRaffle.add(raffleInt, 'hours');
      if (raffleDates.length >= 30 || endDate <= nextRaffle) {
        if (endDate !== nextRaffle) {
          raffleDates.push(endDate);
        }
        break;
      }
      raffleDates.push(moment(nextRaffle.toDate()));
    }
  }

  return { diff, interval, raffleTimes: raffleDates.length, raffleDates };
};

export function getNumberWithOrdinal(n, include = true) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return (include ? n : '') + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getSchedule(date, keep = false) {
  const m = moment(date);
  const d = m.toDate();
  const hour = m.format('H');
  const min = keep ? m.format('m') : getNearestMinutes(Number(m.format('m')));
  const toMoment = moment(
    `${moment(date).format('MM/DD/YYYY')} ${hour}:${min}`,
  );

  const toApi = toMoment.format('MM/DD/YYYY HH:mm');

  return { date: d, hour, min, toMoment, toApi };
}

function getNearestMinutes(minutes) {
  const result = 5 * Math.ceil(minutes / 5);
  if (result === 0) {
    return 5;
  }

  if (result === 60) {
    return 0;
  }

  return result;
}

export function useScheduleDistribution() {
  const def = [
    {
      schedule: {
        date: new Date(),
        hour: '',
        min: '',
        ordinalNumber: '',
      },
      prizeInfo: [{ name: '', amount: '' }],
      keydex: getKeyDex(),
    },
  ];
  const [schedDistribution, setSchedDistribution] = useState(def);
  const [numberOfRaffle, setNumberOfRaffle] = useState('');

  function suggestPrizeDistribute(start, end, interval, prizeInfo = []) {
    const dates = [];

    function getPrizeInfo(times, amount, name) {
      if (times && amount) {
        const allocated = Math.floor(amount / times);
        let diff = amount - allocated * times;
        const shuffle = Array(times).fill(0);
        if (diff > 0) {
          while (diff > 0) {
            const index = Math.floor(
              Math.random() * Math.floor(shuffle.length),
            );
            shuffle[index]++;
            diff--;
          }
        }

        return { allocated, shuffle, name, src: amount };
      }

      return { name };
    }
    const { interval: intrvl, raffleTimes, raffleDates } = getNumberOfRaffle(
      start,
      end,
      interval,
    );

    if (intrvl && start && end) {
      const prizeAllocation = [...prizeInfo].map(({ amount, name }) =>
        getPrizeInfo(raffleTimes, amount, name),
      );
      raffleDates.forEach(function useLoop(_date, index) {
        const schedPrize = [];
        const idx = index + 1;
        const ordinalNumber = getNumberWithOrdinal(idx, false);
        const sched = getSchedule(_date.toDate(), true);
        sched.disabled = index + 1 === raffleDates.length;
        // let sched = getSchedule(
        //   moment(start)
        //     .add(idx * intrvl, 'hour')
        //     .toDate(),
        // );
        // if (idx === raffleTimes) {
        //   sched = getSchedule(end);
        // }

        prizeAllocation.forEach((p, indx) => {
          const addPrize = p.shuffle && p.shuffle[index];
          schedPrize.push({
            indx,
            name: p.name,
            amount: p.allocated + addPrize || undefined,
            baseAmount: p.allocated + addPrize || undefined,
            setPrizeInfo: p.src,
            keydex: getKeyDex(),
          });
        });
        dates.push({
          schedule: sched,
          ordinalNumber,
          prizeInfo: schedPrize,
          keydex: getKeyDex(),
        });
      });
      setNumberOfRaffle(raffleTimes);
      setSchedDistribution(dates);
    }
  }

  function clear() {
    setSchedDistribution(def);
  }

  function runValidation(schedules = schedDistribution, options = {}) {
    let failed = false;
    schedules.forEach(({ schedule: baseSched }, baseIndex) => {
      // eslint-disable-next-line no-param-reassign
      schedules[baseIndex].schedule.error = undefined;
      const isOverlap = schedules.find(
        ({ schedule }, index) =>
          index < baseIndex && baseSched.toMoment < schedule.toMoment,
      );

      const { pastDate, intl } = options;

      const isPast = pastDate > baseSched.toMoment;
      if (intl) {
        const isRequired = required({
          name: intl.formatMessage(messages.raffleSchedule),
        })({ value: baseSched.date });
        if (isRequired) {
          const invalid = isRequired;
          // eslint-disable-next-line no-param-reassign
          schedules[baseIndex].schedule.error = {
            list: [invalid],
            invalid: true,
          };
          failed = true;
        }
      }

      if (!failed) {
        if (isPast) {
          const invalid = {
            errorCode: 'ERROR0033',
            formatIntl: { id: 'ERROR0033', values: {} },
          };
          // eslint-disable-next-line no-param-reassign
          schedules[baseIndex].schedule.error = {
            list: [invalid],
            invalid: true,
          };
          failed = true;
        } else if (isOverlap) {
          const invalid = {
            errorCode: 'ERROR0048',
            formatIntl: { id: 'ERROR0048', values: {} },
          };
          // eslint-disable-next-line no-param-reassign
          schedules[baseIndex].schedule.error = {
            list: [invalid],
            invalid: true,
          };
          failed = true;
        } else {
          const isExists = schedules.find(
            ({ schedule }, index) =>
              index < baseIndex && baseSched.toApi === schedule.toApi,
          );
          if (isExists) {
            const invalid = {
              errorCode: 'ERROR0049',
              formatIntl: { id: 'ERROR0049', values: {} },
            };
            // eslint-disable-next-line no-param-reassign
            schedules[baseIndex].schedule.error = {
              list: [invalid],
              invalid: true,
            };
            failed = true;
          }
        }
      }
    });

    return failed;
  }

  function setScheduleDate(index, date, hour, min, options) {
    setSchedDistribution(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo[index].schedule.date = date;
      newInfo[index].schedule.hour = hour;
      newInfo[index].schedule.min = min;

      newInfo[index].schedule.toMoment = moment(
        `${moment(date).format('MM/DD/YYYY')} ${hour}:${min}`,
      );
      newInfo[index].schedule.toApi = newInfo[index].schedule.toMoment.format(
        'MM/DD/YYYY HH:mm',
      );
      runValidation(newInfo, options);

      return newInfo;
    });
  }

  function setPrizeInfo(index, idx, amount) {
    setSchedDistribution(oldInfo => {
      const newInfo = [...oldInfo];
      const sched = newInfo[index];
      sched.prizeInfo[idx].amount = amount;
      return newInfo;
    });

    // return schedDistribution.map
    const updatedAmount = [...schedDistribution].reduce(
      (am, pir) => am + (Number(pir.prizeInfo[idx].amount) || 0),
      0,
    );
    return updatedAmount;
  }

  function setPrizeName(index, name) {
    setSchedDistribution(oldInfo => {
      const schedInfo = Array.from(oldInfo);
      schedInfo.forEach(sched => {
        // eslint-disable-next-line no-param-reassign
        sched.prizeInfo[index] = { ...sched.prizeInfo[index], name };
      });
      return schedInfo;
    });
  }

  return {
    schedDistribution,
    setSchedDistribution,
    suggestPrizeDistribute,
    numberOfRaffle,
    setScheduleDate,
    setPrizeInfo,
    setPrizeName,
    clear,
    runValidation,
  };
}

export const useAccountFollowed = intl => {
  const [values, setvalue] = useState([
    { value: undefined, keydex: getKeyDex(), invalid: false },
  ]);

  function addRow() {
    setvalue(oldInfo => [
      ...oldInfo,
      { value: '', keydex: getKeyDex(), invalid: false },
    ]);
  }

  function removeRow(index) {
    setvalue(prev => {
      const newDt = [...prev];
      newDt.splice(index, 1);
      return newDt;
    });
  }

  function setIndexValue(index, value, invalid) {
    setvalue(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo[index] = { ...newInfo[index], value, invalid };
      return newInfo;
    });
  }

  return {
    values,
    payload: values.every(e => e.value) ? values.map(m => m.value) : [],
    addRow,
    removeRow,
    setIndexValue,
    invalid: type => Number(type) === 2 && !values.every(val => !val.invalid),
  };
};

export const EntryWinnerConditionState = (
  intl,
  raffleType,
  followerCondtion,
) => {
  const validator = validation(intl);
  const autoSendDM = useValidation(true);
  // const start = startPeriod ? new Date(startPeriod) : new Date();
  // start.setDate(start.getDate() - 1);
  const winnerConditionType = useValidation(1);
  const previousWinnerType = useValidation(1);
  const preventPrevWinner = useValidation('');
  const showConditions = useValidation('');

  const winCampIds = useValidation(
    '',
    validator.winCampaignId(previousWinnerType.value),
  );

  const winStartPeriod = useValidation(
    new Date(),
    undefined,
    undefined,
    props => ({
      ...dateExtraProps(props),
      beforesetvalue: target => {
        if (target && target > winEndPeriod.value) {
          winEndPeriod.setvalue(target);
        }
        return target;
      },
    }),
  );
  const winStartHour = useValidation('', validator.startHour(false));
  const winStartMinute = useValidation('', validator.startMinute);
  const winEndPeriod = useValidation(
    new Date(),
    undefined,
    undefined,
    dateExtraProps,
  );

  const winEndHour = useValidation('', validator.startHour(false));
  const winEndMinute = useValidation('', validator.endMinute);
  let winStartMax = new Date();

  if (winEndPeriod.toDate && winStartPeriod.toDate < winEndPeriod.toDate) {
    winStartMax = new Date(winEndPeriod.toDate);
  }

  // useEffect(() => {
  //   if (Number(previousWinnerType.value) === 2) {
  //     if (startPeriod < winStartPeriod.toDate) {
  //       winStartPeriod.setvalue(new Date(undefined));
  //     }
  //     winEndPeriod.setvalue(start);
  //   }
  // }, [startPeriod, previousWinnerType.value]);

  // useEffect(() => {
  //   winStartPeriod.setvalue(start);
  //   winStartHour.setvalue();
  //   winStartMinute.setvalue();
  //   winStartAmPm.setvalue();

  //   winEndPeriod.setvalue(start);
  //   winEndHour.setvalue();
  //   winEndMinute.setvalue();
  //   winEndAmPm.setvalue();

  //   if (Number(previousWinnerType.value) === 2) {

  //   }
  //   else if (Number(previousWinnerType.value) === 3) {

  //   }
  // }, [previousWinnerType.value])

  function checkFollower() {
    let fil = [];
    if (Number(raffleType) === 1) {
      fil = followerCondtion.filter(
        f => !f.follower_count || !f.increase_percentage || f.invalid === true,
      );
    } else {
      fil = followerCondtion.filter(
        f => !f.follower_count || f.invalid === true,
      );
    }
    return fil.length > 0;
  }

  let invalid = false;
  if (Number(winnerConditionType.value) === 2) {
    invalid = true;
    if (preventPrevWinner.value !== '') {
      invalid = false;
      if (Number(previousWinnerType.value) === 2) {
        invalid = !isValid([
          winStartHour,
          winStartMinute,
          winEndHour,
          winEndMinute,
        ]);
      } else if (Number(previousWinnerType.value) === 3) {
        invalid = !isValid([winCampIds]);
      }
    }
    if (showConditions.value !== '') {
      invalid = checkFollower();
    }
  }

  // useEffect(() => {
  //   if (Number(winnerConditionType.value) === 1) {
  //     showConditions.onClearValue('', true);
  //     preventPrevWinner.onClearValue('', true);
  //   }
  // }, [winnerConditionType.value]);

  const win_start_period = winStartPeriod.toApiFormat(
    winStartHour.value,
    winStartMinute.value,
  );
  const win_end_period = winEndPeriod.toApiFormat(
    winEndHour.value,
    winEndMinute.value,
  );

  const winning_condition = {
    winner_condition_type: Number(winnerConditionType.value),
    follower_condition: null,
    prevent_previous_winner_type:
      (preventPrevWinner.value && Number(previousWinnerType.value)) || null,
    prevent_previous_from:
      preventPrevWinner.value && Number(previousWinnerType.value) === 2
        ? win_start_period
        : null,
    prevent_previous_to:
      preventPrevWinner.value && Number(previousWinnerType.value) === 2
        ? win_end_period
        : null,
    prevent_previous_from_campaigns:
      preventPrevWinner.value && Number(previousWinnerType.value) === 3
        ? [Number(winCampIds.value)]
        : null,
  };
  return {
    autoSendDM,
    winnerConditionType,
    previousWinnerType,
    preventPrevWinner,

    winCampIds,

    winStartPeriod,
    winStartHour,
    winStartMinute,
    winEndPeriod,
    winEndHour,
    winEndMinute,
    win_start_period,
    win_end_period,
    winStartMax,
    invalid,

    winning_condition,
    showConditions,
  };
};

export const CountPercentageState = (intl, count, pct) => {
  const validator = validation(intl);
  const follower_count = useValidation(count, validator.followerCount);
  const increase_percentage = useValidation(pct, validator.increasePercent);

  return {
    follower_count,
    increase_percentage,
  };
};

export const WinnerConditionState = () => {
  const [conditions, setConditions] = useState([
    {
      follower_count: null,
      increase_percentage: null,
      invalid: false,
      keydex: getKeyDex(),
    },
  ]);

  function addCondition() {
    const newInfo = Array.from(conditions);
    newInfo.push({
      follower_count: null,
      increase_percentage: null,
      invalid: false,
      keydex: getKeyDex(),
    });
    setConditions(newInfo);
  }

  function removeCondition(index) {
    setConditions(prev => {
      const newDt = [...prev];
      newDt.splice(index, 1);
      return newDt;
    });
  }

  function setWinCondition(index, count, pct, invalid) {
    const newInfo = Array.from(conditions);
    newInfo[index] = {
      ...newInfo[index],
      follower_count: count ? Number(count) : count,
      increase_percentage: pct ? Number(pct) : pct,
      invalid,
    };
    setConditions(newInfo);
  }

  function resetCondition() {
    setConditions({
      follower_count: null,
      increase_percentage: null,
      invalid: false,
      keydex: getKeyDex(),
    });
  }

  return {
    conditions,
    payload: conditions.map(({ follower_count, increase_percentage }) => ({
      follower_count,
      increase_percentage,
    })),
    addCondition,
    removeCondition,
    setWinCondition,
    resetCondition,
  };
};

export const useUploadFile = intl => {
  const validator = validation(intl);
  const [uploadFiles, setUploadFile] = useState([]);
  const [fileType, setFileType] = useState();
  const [uploadError, seUploadError] = useState();
  const imageFile = useValidation(
    UNDEF,
    validator.tweetImageUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target =
          fileType === 'PHOTO'
            ? [...uploadFiles, ...e.target.files]
            : [...e.target.files];
        onChange(target);
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('PHOTO');
          setUploadFile(value);
        }
        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  const gifFile = useValidation(
    UNDEF,
    validator.tweetGifUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target = [e.target.files[0]];
        if (target[0]) {
          onChange(target);
        }
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('GIF');
          setUploadFile(value);
        }

        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  const videoFile = useValidation(
    UNDEF,
    validator.tweetVideoUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target = [e.target.files[0]];
        if (target[0]) {
          onChange(target);
        }
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('VIDEO');
          setUploadFile(value);
        }

        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  function setUploadImage(formData) {
    if (uploadFiles && uploadFiles.length) {
      if (fileType === 'PHOTO') {
        uploadFiles.forEach(val => {
          formData.append('image', val);
        });
        return 'publish-photo-campaign';
      }
      if (fileType === 'GIF') {
        uploadFiles.forEach(val => {
          formData.append('gif', val);
        });
        return 'publish-gif-campaign';
      }
      if (fileType === 'VIDEO') {
        uploadFiles.forEach(val => {
          formData.append('video', val);
        });
        return 'publish-video-campaign';
      }
    }

    return 'publish-campaign';
  }

  function onRemove(index) {
    setUploadFile(oldFiles => {
      const newFiles = Array.from(oldFiles);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  return {
    imageFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    setUploadImage,
    onRemove,
  };
};

export const useWinStartPeriodValidation = state => {
  const format = 'MM/DD/YYYY HH:mm';
  const [error, setError] = useState(null);
  const { intl, startPeriod, startHour, startMinute } = state;

  function isValidDate() {
    if (startHour >= 0 && startMinute >= 0) {
      const m = moment(`${startPeriod} ${startHour}:${startMinute}`, format);
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;
    if (!startPeriod) {
      invalid = required({
        name: intl.formatMessage(messages.startDate),
      })({
        value: startPeriod,
      });
    }

    setError(invalid);
  }, [startPeriod, startHour, startMinute]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return { list: [], invalid: !isValidDate() };
};

export const useWinEndPeriodValidation = state => {
  const format = 'MM/DD/YYYY HH:mm';
  const [error, setError] = useState(null);
  const {
    endPeriod,
    endHour,
    endMinute,
    startPeriod,
    startHour,
    startMinute,
    intl,
  } = state;

  function isValidDate() {
    if (endHour >= 0 && endMinute >= 0) {
      const m = moment(`${endPeriod} ${endHour}:${endMinute}`, format);
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;

    if (endPeriod) {
      if (endHour && endMinute) {
        const startDate = moment(
          `${startPeriod} ${startHour}:${startMinute}`,
          format,
        );
        const endDate = moment(`${endPeriod} ${endHour}:${endMinute}`, format);

        invalid = maxValue({ errorCode: 'ERROR0038', max: endDate })({
          value: startDate,
        });

        if (!invalid) {
          const tdMoment = moment().subtract(1, 'H');
          invalid = maxValue({ errorCode: 'ERROR0038', max: tdMoment })({
            value: endDate,
          });
        }

        if (new Date(endDate).getTime() === new Date(startDate).getTime()) {
          invalid = {
            errorCode: 'ERROR0038',
            formatIntl: { id: 'ERROR0038', values: {} },
          };
        }
      } else {
        invalid = minValue({
          errorCode: 'ERROR0038',
          min: moment(startPeriod),
        })({
          value: moment(endPeriod),
        });
      }
    } else {
      invalid = required({
        name: intl.formatMessage(messages.endDate),
      })({
        value: endPeriod,
      });
    }

    // if (startPeriod.toDate && endPeriod.toDate) {
    //   if (
    //     (startPeriod.error && startPeriod.error.touched) ||
    //     (endPeriod.error && endPeriod.error.touched) ||
    //     (endHour && endMinute)
    //   ) {
    //     const endDate = moment(
    //       `${endPeriod.toDate} ${endHour || 0}:${endMinute || 0} ${endAmPm}`,
    //       format,
    //     );
    //     const startDate = moment(
    //       `${startPeriod.toDate} ${startHour || 0}:${startMinute ||
    //       0} ${startAmPm}`,
    //       format,
    //     );
    //     invalid = minValue({ errorCode: 'ERROR0035', min: startDate })({
    //       value: endDate,
    //     });

    //     if (endHour && endMinute) {

    //       if (endPeriod.toDate === startPeriod.toDate) {
    //         invalid = {
    //           errorCode: 'ERROR0035',
    //           formatIntl: { id: 'ERROR0035', values: {} },
    //         };
    //       }
    //     }
    //   }
    // }

    // if (!endPeriod.toDate) {
    //   invalid = {
    //     errorCode: 'E0000003',
    //     formatIntl: {
    //       id: 'E0000003',
    //       values: { name: intl.formatMessage(messages.endDate) },
    //     },
    //   };
    // }
    setError(invalid);
  }, [endPeriod, endHour, endMinute, startPeriod, startHour, startMinute]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return { list: [], invalid: !isValidDate() };
};
