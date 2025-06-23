/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { expandDateTime, nonHashtag } from 'utils/commonHelper';
import validation from './validators';
import useValidation, { isValid } from '../../library/validator';
import { prizeName } from '../../helpers/validators';
import { maxValue, minValue, required, maxLength } from '../../library/validator/rules';
import messages from './messages';

const dateOnlyFormat = 'MM/DD/YYYY';
const militaryTimeFormat = 'MM/DD/YYYY HH:mm';

export function getKeyDex() {
  return Math.floor(Math.random() * 900) + 100;
}

export function dateExtraProps({ value }) {
  const sm = moment(value);
  let toDate = null;

  function toApiFormat(hour, min) {
    const m = moment(`${sm.format(dateOnlyFormat)} ${hour}:${min}`);
    if (m.isValid()) {
      return moment(m, militaryTimeFormat).format(militaryTimeFormat);
    }

    return null;
  }

  if (value && sm.isValid()) {
    toDate = sm.format(dateOnlyFormat);
  }

  return { toDate, toApiFormat };
}

export const Flow1State = (intl, campDetails) => {
  const validator = validation(intl);
  const title = useValidation('', validator.campaignTitle);
  const description = useValidation('', validator.campaignDescription);
  const label_id = useValidation('');

  const winner_total = useValidation(0);
  let winCount = 0;
  if (campDetails) {
    campDetails.campaign_prize.map(m =>
      // eslint-disable-next-line array-callback-return
      m.raffle_schedule.map(rs => {
        winCount += Number(rs.winner_total);
      }),
    );
  }

  const campaign_type = useValidation(0, validator.campaign_type);

  const hashtagCondition = useValidation(0, validator.hashtagCondition);

  // Raffle State
  const raffle_type = useValidation(0, validator.raffle_type);
  // Auto Raffle
  const auto_raffle = useValidation(false);

  const withWinLimit = [1, 3].includes(Number(raffle_type.value)) && Number(campaign_type.value) === 2;

  const account_winning_limit = useValidation('', validator.winLimit(withWinLimit), undefined, (value) => {
    if (Number(raffle_type.value) === 2 || Number(campaign_type) === 1) {
      return { error: { invalid: false } };
    }
    return {};
  });
  const raffle_interval = useValidation(
    '',
    validator.raffle_interval(raffle_type.value),
    undefined,
    () => {
      if (Number(raffle_type.value) !== 3) {
        return { error: { invalid: false } };
      }
      return {};
    },
  );
  const optionInterval = { 1: 1, 2: 6, 3: 12, 4: 4 };
  useEffect(() => {
    if (campDetails) {
      title.setvalue(campDetails.title);
      description.setvalue(campDetails.description);
      label_id.setvalue(campDetails.label_id);
      campaign_type.setvalue(campDetails.campaign_type);
      winner_total.setvalue(winCount);

      // Raffle
      account_winning_limit.setvalue(Number(campDetails.account_winning_limit));
      raffle_type.setvalue(campDetails.raffle_type);
      raffle_interval.setvalue(campDetails.raffle_interval);
      auto_raffle.setvalue(campDetails.auto_raffle===1);
      hashtagCondition.setvalue(campDetails.hashtag_condition);
    }
  }, [campDetails]);

  const flow1payload = {
    title: title.value,
    description: description.value,
    label_id: label_id.value,
    campaign_type: campaign_type.value,
    raffle_type: raffle_type.value,
    raffle_interval: raffle_interval.value,
    auto_raffle: auto_raffle.value,
    account_winning_limit: campaign_type === '2' ? account_winning_limit.value || 1 : 1,
    hashtag_condition: hashtagCondition.value,
  };

  function checkWinLimit(max) {
    const err = {
      list: [],
      invalid: false,
    };

    if (Number(campaign_type.value) !== 1 && Number(raffle_type.value) !== 2) {
      const invalid = maxValue({
        name: intl.formatMessage(messages.winLimit),
        max: Number(max) === 0 ? 1 : max,
      })({
        value: account_winning_limit.value,
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

  const invalid = title.error.invalid && description.error.invalid && label_id.error.invalid && campaign_type.error.invalid;

  return {
    title,
    description,
    label_id,
    winner_total,
    campaign_type,
    raffleState: {
      account_winning_limit,
      raffle_type,
      raffle_interval,
      auto_raffle,
    },
    invalid,
    flow1payload,
    checkWinLimit,
    hashtagCondition,
  };
};

export const Flow2State = (intl, campDetails) => {
  const validator = validation(intl);
  const sns_post_content = useValidation('', validator.content);

  const postWinTemplate = useValidation('', validator.postWinTemplate);
  const postLoseTemplate = useValidation('');
  const postTyTemplate = useValidation('');

  const dmWinTemplate = useValidation('', validator.dmWinTemplate);
  const dmLoseTemplate = useValidation('');
  const dmTyTemplate = useValidation('');
  const dmFormTemplate = useValidation('', validator.dmFormTemplate);

  const formMessageTemplate = useValidation('', validator.formTemplate);
  const inputFormFields = useValidation(
    ['1', '2', '3', '4', '5'],
    validator.formFields,
  );
  const inputFormFieldsRequired = useValidation(['11', '12', '13', '14', '15']);
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

  const [templateToggle, setTemplateToggle] = useState({
    checkedTweetViaCamps: false,
    showPostWin: false,
    showPostLose: false,
    showPostTy: false,
    showDMLose: false,
    showDMTy: false,
    showDMForm: false,
    showThankful: false
  });

  useEffect(() => {
    if (campDetails) {

      sns_post_content.setvalue(campDetails.sns_post_content);

      postWinTemplate.setvalue(campDetails.post_winner_message_template && campDetails.post_winner_message_template.id);
      postLoseTemplate.setvalue(campDetails.post_loser_message_template && campDetails.post_loser_message_template.id);
      postTyTemplate.setvalue(campDetails.post_ty_message_template && campDetails.post_ty_message_template.id);
      dmWinTemplate.setvalue(campDetails.winner_message_template && campDetails.winner_message_template.id);
      dmLoseTemplate.setvalue(campDetails.loser_message_template && campDetails.loser_message_template.id);
      dmTyTemplate.setvalue(campDetails.ty_message_template && campDetails.ty_message_template.id);
      dmFormTemplate.setvalue(campDetails.fc_message_template && campDetails.fc_message_template.id);
      formMessageTemplate.setvalue(campDetails.template_form && campDetails.template_form.id);

      let tmpFormFieldsRequired = campDetails.form_fields_schema.filter(f => f.required).map(f=>f.form_id).toString().split(',');
      inputFormFields.setvalue(campDetails.form_fields.filter(f => f<20).map(f => f%10).toString().split(','));
      // inputFormFieldsRequired.setvalue(campDetails.form_fields_schema.filter(f => f.required).map(f=>f.form_id).toString().split(','));
      inputFormFields2.setvalue((campDetails.form_fields.filter(f => f>=20 && f < 30).length>0)?campDetails.form_fields.filter(f => f>=20 && f < 30).map(f => f%10).toString().split(','):[]);
      inputFormFields3.setvalue((campDetails.form_fields.filter(f => f>=30).length>0)?campDetails.form_fields.filter(f => f>=30).map(f => f%10).toString().split(','):[]);

      if(!campDetails.form_fields_schema.some(f => [21,22,23,24].includes(f.form_id))) {
        tmpFormFieldsRequired = ([...tmpFormFieldsRequired, ...['22','23','24']]);
      }

      inputFormFieldsRequired.setvalue(tmpFormFieldsRequired);

      setTemplateToggle(prev => ({
        checkedTweetViaCamps: campDetails.post_tweet_via_camps===1,
        showPostWin: campDetails.post_winner_message_template !== null,
        showPostLose: campDetails.post_loser_message_template !== null,
        showPostTy: campDetails.post_ty_message_template !== null,
        showDMLose: campDetails.loser_message_template !== null,
        showDMTy: campDetails.ty_message_template !== null,
        showDMForm: campDetails.fc_message_template !== null,
        showThankful: campDetails.form_design === 2
      }))
    }
  }, [campDetails])

  function invalid() {
    return (
      (templateToggle.showPostWin && !postWinTemplate.value) ||
      (templateToggle.showPostLose && !postLoseTemplate.value) ||
      (templateToggle.showPostTy && !postTyTemplate.value) ||
      (templateToggle.showDMLose && !dmLoseTemplate.value) ||
      (templateToggle.showDMTy && !dmTyTemplate.value) ||
      (templateToggle.showDMForm && !dmFormTemplate.value) ||
      inputFormFields.value.every(frm => !frm) ||
      inputFormFields2.value.length>0 && inputFormFields2.value.every(frm => !frm)
    );
  }

  const flow2payload = {
    winner_message_template: Number(dmWinTemplate.value),
    loser_message_template: templateToggle.showDMLose ? dmLoseTemplate.value : null,
    ty_message_template: templateToggle.showDMTy ? dmTyTemplate.value : null,
    fc_message_template: templateToggle.showDMForm ? Number(dmFormTemplate.value) : null,
    template_form_id: Number(formMessageTemplate.value),
    post_winner_message_template: templateToggle.showPostWin ? postWinTemplate.value : null,
    post_loser_message_template: templateToggle.showPostLose ? postLoseTemplate.value : null,
    post_ty_message_template: templateToggle.showPostTy ? postTyTemplate.value : null,
    form_fields: inputFormFields.value.map(Number).filter(v=>v>0),
    form_fields2: inputFormFields2.value.map(Number).filter(v=>v>0),
    form_fields3: inputFormFields3.value.map(Number).filter(v=>v>0),
    form_fields_required: inputFormFieldsRequired.value.map(Number).filter(v=>v>0),
    content: sns_post_content.value,
    templateToggle,
    post_tweet_via_camps: templateToggle.checkedTweetViaCamps ? 1 : 0
  };

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
    inputFieldEmail,
    inputFieldFullname,
    inputFieldContactNo,
    inputFieldAddress,
    form_fields: inputFormFields.value,
    form_fields2: inputFormFields2.value,
    form_fields3: inputFormFields3.value,
    inputFormFieldsRequired,
    invalid,

    templateToggle,
    setTemplateToggle,

    sns_post_content,

    flow2payload,
  };
};

export const DatePeriodState = (intl, campDetails, isSaveSched) => {
  const startHour = useValidation(null);
  const startMinute = useValidation(null);
  let startPeriod = null;

  const endDate = useValidation(undefined, undefined,
    undefined,
    dateExtraProps);
  const endHour = useValidation(null);
  const endMinute = useValidation(null);

  const startDate = useValidation(undefined, undefined,
    undefined,
    props => ({
      ...dateExtraProps(props),
      beforesetvalue: target => {
        if (!startOnPublish.value && target && target > new Date(endDate.value)) {
          endDate.setvalue(target);
        }
        return target;
      },
    }));
  let endPeriod = null;

  const startOnPublish = useValidation('');

  let startData = null;
  let endData = null;
  const td = new Date();
  const apiFormat = 'MMM/DD/YYYY HH:mm A';
  const dtFormat = 'MM/DD/YYYY HH:mm:ss';

  let startMaxDays = moment()
    .add(31, 'days')
    .toDate();

  let endMinDays = new Date();
  if (!startOnPublish.value) {
    startMaxDays = startDate.toDate
      ? moment(startDate.toDate)
        .add(31, 'days')
        .toDate()
      : undefined;

    endMinDays = startDate.toDate ? new Date(startDate.toDate) : undefined;
  }

  useEffect(() => {
    if (startOnPublish.value) {
      if (!startDate.value) {
        startDate.setvalue(new Date());
      }
    }
  }, [startOnPublish.value]);

  useEffect(() => {
    if (campDetails) {
      const stTarget = new Date(moment(campDetails.start_period, apiFormat).format(dtFormat));
      const etTarget = new Date(moment(campDetails.end_period, apiFormat).format(dtFormat));
      startOnPublish.setvalue(!isSaveSched);
      startOnPublish.onBlur();

      startData = expandDateTime(campDetails.start_period, 0, isSaveSched);
      endData = expandDateTime(campDetails.end_period);
      if (td < stTarget && startData || [0,2,9].includes(campDetails.status)) {
        startDate.setvalue(startData.dt);
        startHour.setvalue(startData.hours);
        startMinute.setvalue(startData.minutes);
      }
      else {
        startDate.setvalue(null);
        startHour.setvalue(null);
        startMinute.setvalue(null);
      }

      if (etTarget > td && endData || [2].includes(campDetails.status)) {
        endDate.setvalue(endData.dt);
        endHour.setvalue(endData.hours);
        endMinute.setvalue(endData.minutes);
      }
      else {
        endDate.setvalue(null);
        endHour.setvalue(null);
        endMinute.setvalue(null);
      }
    }
  }, [campDetails]);

  startPeriod = startDate.toApiFormat(
    startHour.value,
    startMinute.value,
  );

  endPeriod = endDate.toApiFormat(
    endHour.value,
    endMinute.value,
  );

  const checkDateFields = () => startDate.value && endDate.value;
  const dtTouched = startDate.error.touched || startHour.error.touched || startMinute.error.touched ||
    endDate.error.touched || endHour.error.touched || endMinute.error.touched || startOnPublish.error.touched;

  const datePayload = {
    startDate: startDate.toDate,
    startHour: startHour.value,
    startMinute: startMinute.value,
    start_period: startPeriod,
    endDate: endDate.toDate,
    endHour: endHour.value,
    endMinute: endMinute.value,
    end_period: endPeriod,
    startOnPublish: startOnPublish.value || false,
  };

  return {
    startDate,
    startHour,
    startMinute,
    startPeriod,
    endDate,
    endHour,
    endMinute,
    endPeriod,
    startMaxDays,
    endMinDays,
    checkDateFields,
    startOnPublish,
    dtTouched,
    datePayload,
  };
};

export const StartDateValidation = state => {

  const [error, setError] = useState(null);
  const {
    intl,
    startOnPublish,
    startPeriod,
    startHour,
    startMinute,
    status,
    campDetails,
  } = state;

  function isValidDate() {
    if (startHour>=0 && startMinute >= 0) {
      const m = moment(
        `${startPeriod} ${startHour}:${startMinute}`,
        militaryTimeFormat,
      );
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;
    if (startPeriod) {
      const startDate = moment(
        `${startPeriod} ${startHour}:${startMinute}`,
        militaryTimeFormat,
      );
      if (!startOnPublish && [1, 5].includes(Number(status))) {
        if (startHour && startMinute >= 0) {
          invalid = minValue({ errorCode: 'ERROR0037', min: moment() })({
            value: startDate,
          });
        }
      }
    }
    else if (!startOnPublish) {
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

export const EndDateValidation = state => {
  const [error, setError] = useState(null);
  const {
    startOnPublish,
    endPeriod, // endDate
    endHour,
    endMinute,
    startPeriod, // startDate
    startHour,
    startMinute,
    ongoingFixedRaffle,
    intl,
  } = state;

  function isValidDate() {
    if (endHour>=0 && endMinute >= 0) {
      const m = moment(
        `${endPeriod} ${endHour}:${endMinute}`,
        militaryTimeFormat,
      );
      return m.isValid();
    }
    return !!ongoingFixedRaffle;
  }

  useEffect(() => {
    let invalid = null;
    if (!ongoingFixedRaffle) {
      if (endPeriod) {
        if (endHour && endMinute >= 0) {
          const endDate = moment(
            `${endPeriod} ${endHour}:${endMinute}`,
            militaryTimeFormat,
          );
          let startDate = moment();
          if (startOnPublish) {
            invalid = minValue({ errorCode: 'ERROR0037', min: startDate })({
              value: endDate,
            });
          } else {
            startDate = moment(
              `${startPeriod} ${startHour}:${startMinute}`,
              militaryTimeFormat,
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

          if ((startHour && startMinute >= 0) || startOnPublish) {
            const durationDays = endDate.diff(startDate, 'days');
            if (durationDays > 31) {
              invalid = {
                errorCode: 'ERROR0039',
                formatIntl: { id: 'ERROR0039', values: {} },
              };
            }
          }
        }
        else {
          invalid = minValue({
            errorCode: 'ERROR0038',
            min: moment(startPeriod),
          })({
            value: moment(endPeriod),
          });
        }
      }
      else {
        invalid = required({
          name: intl.formatMessage(messages.campaignPeriodEnd),
        })({
          value: endPeriod,
        });
      }
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

const optionInterval = { 1: 1, 2: 6, 3: 12, 4: 24 };

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

export const getNumberOfRaffle = (start, end, raffleInt, isOrig = false) => {
  const raffleDates = [];
  const diff =
    1 + moment(end).diff(moment(start || new Date()), 'hours', false);

  const interval = Number(raffleInt)===1?1:Number(raffleInt)===2?6:Number(raffleInt)===3?12:Number(raffleInt)===4?24:Number(raffleInt); // eslint-disable-line no-nested-ternary

  // If isOrig --> // When raffle time is scheduled and find correct start time
  if (isOrig && isOrig.length) {
    const m = moment(isOrig[0].raffle_schedule);
    const min = m.format('m')
    start = new Date(start).setMinutes(min) // eslint-disable-line no-param-reassign
  }

  if (raffleInt && isOrig) {
    isOrig.forEach(date1 => {
      let b = true;
      raffleDates.forEach(date2 => {
        try {
          if (moment(date1.raffle_schedule).isSame(date2)) {
            b = false;        
          }
        } catch (err) {
          b = false;
        }
      });
      if (b) {
        raffleDates.push(moment(date1.raffle_schedule));
      }
    });
  } else if (raffleInt && !isOrig) {
    const endDate = moment(end);
    const { toMoment } = getSchedule(start || new Date());
    let nextRaffle = moment(toMoment);
    while (endDate > nextRaffle) {
      nextRaffle = nextRaffle.add(interval, 'hours');
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

function getSchedule(date, keep = false) {
  const m = moment(date);
  const d = m.toDate();
  const hour = m.format('H');
  const min = keep ? m.format('m') : getNearestMinutes(Number(m.format('m')));
  const toMoment = moment(
    `${moment(date).format(dateOnlyFormat)} ${hour}:${min}`,
  );

  const toApi = toMoment.format(militaryTimeFormat);

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

export const useCampaignPrize = (intl, name, prize, percentage, origAmnt, isSavedSched) => {
  const validator = validation(intl);
  return {
    prizeName: useValidation(name, validator.prizeName),
    prizeAmount: useValidation(prize, validator.prizeAmount(origAmnt, isSavedSched)),
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

export const useRafflePrizeState = (campDetails) => {
  const [prizeInfo, setPrizeInfo] = useState([
    { id: null, name: '', amount: '', percentage: '', origAmnt: 1, },
  ]);

  useEffect(() => {
    if (campDetails) {
      setPrizeInfo(campDetails.prizeMgmt);
    }
  }, [campDetails]);

  function addPrizeInfo() {
    setPrizeInfo(oldInfo => [
      ...oldInfo,
      { id: null, name: '', amount: '', percentage: '', origAmnt: 1, keydex: getKeyDex(), },
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
            i !== index && info.name.toLowerCase() === name.toLowerCase(),
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

  function setCampaignPrize(index, name, amount, percentage, origAmnt) {
    setPrizeInfo(oldInfo => {
      const newInfo = Array.from(oldInfo);
      newInfo[index] = { ...newInfo[index], name, amount, percentage, origAmnt };
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

  const prizePayload = {
    campaign_prize: prizeInfo,
    numberOfWinners,
  };

  return {
    prizePayload,
    prizeInfo,
    addPrizeInfo,
    removePrizeInfo,
    setCampaignPrize,
    updatePrizeAmount,
    numberOfWinners,
    invalid: raffleType =>
      prizeInfo.every(
        ({ name, amount, percentage, error, origAmnt, validMinAmount }) =>
          !name ||
          !amount ||
          (raffleType === '1' && !percentage) ||
          error ||
          prizeName('')[0]({ value: name }) ||
          minValue({ min: validMinAmount || origAmnt })({
            value: amount,
          }),
      ),
  };
};

export function getNumberWithOrdinal(n, include = true) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return (include ? n : '') + (s[(v - 20) % 10] || s[v] || s[0]);
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
      prizeInfo: [{ name: '', amount: '', id: null }],
      keydex: getKeyDex(),
    },
  ];
  const [schedDistribution, setSchedDistribution] = useState(def);
  const [numberOfRaffle, setNumberOfRaffle] = useState('');

  function suggestPrizeDistribute(start, end, interval, prizeInfo = [], campDetails, isSavedSched) {
    const dates = [];
    const { origRaffleDates } = campDetails;
    function getPrizeInfo(times, amount, name, id) {
      if (times && amount) {
        const allocated = Math.floor(amount / times);
        const shuffle = Array(times).fill(0);
        const raffle_schedule_ids = Array(times).fill(0);
        for (let j = 0; j < raffleDates.length; j += 1) {
          if (origRaffleDates) {
            origRaffleDates.forEach(schedule => {
              if ((schedule.name === name) && (new Date(schedule.raffle_schedule).getTime() === new Date(raffleDates[j].toDate()).getTime())) {
                shuffle[j] = schedule.winner_total;
                raffle_schedule_ids[j] = schedule.id;
              }
            });
          }
        }
        return { allocated, shuffle, raffle_schedule_ids, name, src: amount, id };
      }

      return { name, id };
    }
    const { interval: intrvl, raffleTimes, raffleDates } = getNumberOfRaffle(
      start,
      campDetails.end_period,
      interval,
      !isSavedSched ? campDetails.origRaffleDates : false,
    );

    if (intrvl && start && end) {
      const prizeAllocation = [...prizeInfo].map(({ amount, name, id }) =>
        getPrizeInfo(raffleTimes, amount, name, id),
      );
      raffleDates.forEach(function useLoop(_date, index) {
        const schedPrize = [];
        const idx = index + 1;
        const ordinalNumber = getNumberWithOrdinal(idx, false);
        const sched = getSchedule(_date.toDate(), true);
        sched.disabled = index + 1 === raffleDates.length || !isSavedSched;

        prizeAllocation.forEach((p, indx) => {
          const addPrize = p.shuffle && p.shuffle[index];
          const raffle_schedule_id = p.raffle_schedule_ids && p.raffle_schedule_ids[index]
          schedPrize.push({
            indx,
            id: p.id,
            name: p.name,
            amount: addPrize || undefined,
            baseAmount: addPrize || undefined,
            setPrizeInfo: p.src,
            raffle_schedule_id
          });
        });
        dates.push({
          schedule: sched,
          ordinalNumber,
          prizeInfo: schedPrize,
        });
      });
      setNumberOfRaffle(raffleTimes);
      setSchedDistribution(dates);
    }
  }

  function clear() {
    setSchedDistribution(def);
  }

  function runValidation(schedules) {
    schedules.forEach(({ schedule: baseSched }, baseIndex) => {
      // eslint-disable-next-line no-param-reassign
      schedules[baseIndex].schedule.error = undefined;
      const load = schedules.find(
        ({ schedule }, index) =>
          index < baseIndex && baseSched.toMoment < schedule.toMoment,
      );

      if (load) {
        const invalid = {
          errorCode: 'ERROR0048',
          formatIntl: { id: 'ERROR0048', values: {} },
        };
        // eslint-disable-next-line no-param-reassign
        schedules[baseIndex].schedule.error = {
          list: [invalid],
          invalid: true,
        };
      }
    });
  }

  function setScheduleDate(index, date, hour, min) {
    setSchedDistribution(oldInfo => {
      const newInfo = [...oldInfo];
      newInfo[index].schedule.date = date;
      newInfo[index].schedule.hour = hour;
      newInfo[index].schedule.min = min;

      newInfo[index].schedule.toMoment = moment(
        `${moment(date).format(dateOnlyFormat)} ${hour}:${min}`,
      );
      newInfo[index].schedule.toApi = newInfo[index].schedule.toMoment.format(
        militaryTimeFormat,
      );
      runValidation(newInfo);

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

  return {
    schedDistribution,
    setSchedDistribution,
    suggestPrizeDistribute,
    numberOfRaffle,
    setScheduleDate,
    setPrizeInfo,
    clear,
  };
}

export const HashTagState = (intl, campDetails) => {
  const [values, setvalue] = useState([
    { value: undefined, keydex: getKeyDex(), invalid: false },
  ]);

  useEffect(() => {
    if (campDetails && Number(campDetails.campaign_type) === 2) {
      const hash = [];
      campDetails.target_hashtag.split(',').map(m => (
        hash.push({ value: nonHashtag(m), keydex: getKeyDex(), invalid: false, })
      ));
      setvalue(hash);
    }
  }, [campDetails]);

  function addRow() {
    setvalue(oldInfo => [...oldInfo, { value: '', keydex: getKeyDex(), invalid: false },]);
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
  const payload = values && values[0] && values.every(e => e.value) ? values.map(m => m.value) : [];
  function check() {
    const fil = values.filter(f => !f.value || f.invalid === true);
    return fil.length > 0;
  }
  return {
    values,
    hashPayload: payload.join(','),
    addRow,
    removeRow,
    setIndexValue,
    invalid: type => Number(type) === 2 && check(),
  };
};

export const AccountFollowedState = (intl, campDetails) => {
  const [values, setvalue] = useState([{ value: undefined, keydex: getKeyDex(), invalid: false },]);

  function addRow() {
    setvalue(oldInfo => [...oldInfo, { value: '', keydex: getKeyDex(), invalid: false },]);
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

  useEffect(() => {
    if (campDetails && campDetails.entry_condition_followers) {
      const accounts = [];
      campDetails.entry_condition_followers.map(m => (
        accounts.push({ value: m, keydex: getKeyDex(), invalid: false, })
      ));
      setvalue(accounts);
    }
  }, [campDetails]);

  const payload = values.every(e => e.value) ? values.map(m => m.value) : [];
  return {
    values,
    payload,
    addRow,
    removeRow,
    setIndexValue,
    invalid: type => Number(type) === 2 && !values.every(val => !val.invalid),
  };
};

export const EntryWinnerConditionState = (intl, campDetails, followerCondtion) => {
  const validator = validation(intl);
  const autoSendDM = useValidation(true);
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
    dateExtraProps,
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

  const win_start_period = winStartPeriod.toApiFormat(
    winStartHour.value,
    winStartMinute.value,
  );
  const win_end_period = winEndPeriod.toApiFormat(
    winEndHour.value,
    winEndMinute.value,
  );
  function isValidDate() {
    if (winStartHour>=0 && winStartMinute>=0) {
      const m = moment(
        `${winStartPeriod} ${winStartHour}:${winStartMinute}`,
        militaryTimeFormat,
      );
      return m.isValid();
    }
    return false;
  }

  function checkFollower() {
    let fil = [];
    if (campDetails) {
      if (Number(campDetails.raffle_type) === 1) {
        fil = followerCondtion.filter(
          f => !f.follower_count || !f.increase_percentage || f.invalid === true,
        );
      } else {
        fil = followerCondtion.filter(
          f => !f.follower_count || f.invalid === true,
        );
      }
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
    if (showConditions.value !== '' && (campDetails.winning_condition && (campDetails.winning_condition.winner_condition_type === 1))) {
      invalid = checkFollower();
    }
  }

  useEffect(() => {
    if (campDetails) {
      autoSendDM.setvalue(Number(campDetails.auto_send_dm) === 1);
      // winnerConditionType.setvalue(campDetails.prevent_previous_winner_type !== null ? 2 : 1);
      winnerConditionType.setvalue(campDetails.winning_condition.winner_condition_type);
      previousWinnerType.setvalue(campDetails.prevent_previous_winner_type);
      preventPrevWinner.setvalue(campDetails.prevent_previous_winner_type !== null);
      showConditions.setvalue(campDetails.winning_condition.follower_condition.length > 0);
      if (campDetails.prevent_previous_from && campDetails.prevent_previous_to) {
        const win_start = expandDateTime(campDetails.prevent_previous_from);
        if (win_start) {
          winStartPeriod.setvalue(win_start.dt);
          winStartHour.setvalue(win_start.hours);
          winStartMinute.setvalue(win_start.minutes);
        }
        const win_end = expandDateTime(campDetails.prevent_previous_to);
        if (win_end) {
          winEndPeriod.setvalue(win_end.dt);
          winEndHour.setvalue(win_end.hours);
          winEndMinute.setvalue(win_end.minutes);
        }
      }
      if (campDetails.prevent_previous_winner_type === 3) {
        winCampIds.setvalue(campDetails.prevent_previous_campaigns ? campDetails.prevent_previous_campaigns[0] : '');
        winCampIds.onBlur();
      }

    }
  }, [campDetails])

  const entryWinnerPayload = {
    auto_send_dm: autoSendDM.value,
    winning_condition: {
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
    }

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
    invalid,

    entryWinnerPayload,
    showConditions,
  };
};

export const CountPercentageState = (intl, type, count, pct) => {
  const validator = validation(intl);
  const follower_count = useValidation(count, validator.followerCount);
  const increase_percentage = useValidation(pct, validator.increasePercent);

  return {
    follower_count,
    increase_percentage,
  };
};

export const WinnerConditionState = (campDetails, raffle_type) => {
  const [conditions, setConditions] = useState([
    {
      follower_count: null,
      increase_percentage: null,
      invalid: false,
      keydex: getKeyDex(),
    },
  ]);

  useEffect(() => {
    if (campDetails) {
      if (campDetails.winning_condition.follower_condition.length > 0) {
        const newArr = [];
        // eslint-disable-next-line array-callback-return
        campDetails.winning_condition.follower_condition.map(m => {
          newArr.push({ ...m, invalid: false, keydex: getKeyDex(), });
        })
        setConditions(newArr);
      }
    }
  }, [campDetails]);

  function addCondition() {
    const newInfo = Array.from(conditions);
    newInfo.push({ follower_count: null, increase_percentage: null, invalid: false, keydex: getKeyDex(), });
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

  let invalid = false;
  if (Number(raffle_type) === 1) {
    invalid = conditions.every(itm => itm && itm.follower_count !== '' && itm.increase_percentage !== '');
  } else {
    invalid = conditions.every(itm => itm && itm.follower_count !== '');
  }

  return {
    conditions,
    payload: conditions.map(({ follower_count, increase_percentage }) => ({ follower_count, increase_percentage })),
    addCondition,
    removeCondition,
    setWinCondition,
    invalid,
    resetCondition,
  };
};

export const useUploadFile = (intl, campDetails) => {
  const validator = validation(intl);
  const [uploadFiles, setUploadFile] = useState([]);
  const [fileType, setFileType] = useState();
  const [imgDel, setImgDel] = useState([]);
  const [uploadError, seUploadError] = useState();
  const imageFile = useValidation(
    UNDEF,
    validator.tweetImageUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        // const body = {
        //   id: e.target.files.length > 0 ? null : e.target.value.id,
        //   data: e.target.files.length > 0 ? e.target.files : e.target.value.url
        // };
        let target;
        if (e.target) {
          const arr = fileType === 'PHOTO' ? [...uploadFiles] : [];
          if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i += 1) {
              arr.push({
                id: null,
                url: e.target.files[i],
              })
            }
          }
          target = arr;
        }
        else {
          target = [...e];
        }

        onChange(target);
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType(oldType => {
            if (oldType !== 'PHOTO') {
              setImgDel(prev => [...prev, ...getFilesWithIds()]);
            }
            return 'PHOTO';
          });
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
        if (e.target) {
          const target = [e.target.files[0]];
          if (target[0]) {
            onChange([{ id: null, url: target }]);
          }
        }
        else {
          onChange(e);
        }
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType(oldType => {
            if (oldType !== 'GIF') {
              setImgDel(prev => [...prev, ...getFilesWithIds()]);
            }
            return 'GIF';
          });
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
        if (e.target) {
          const target = [e.target.files[0]];
          if (target[0]) {
            onChange([{ id: null, url: target }]);
          }
        }
        else {
          onChange(e);
        }

      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType(oldType => {
            if (oldType !== 'VIDEO') {
              setImgDel([]);
            }
            return 'VIDEO';
          });
          setUploadFile(value);
        }

        seUploadError(e);
        onSetError(e);
      },
    }),
  );
  useEffect(() => {
    if (campDetails) {
      if (campDetails.media_type === '1') {
        imageFile.onChange(campDetails.sns_post_media_path);
        setFileType('PHOTO');
      }
      else if (campDetails.media_type === '2') {
        gifFile.onChange(campDetails.sns_post_media_path);
        setFileType('GIF');
      } else if (campDetails.media_type === '3') {
        videoFile.onChange(campDetails.sns_post_media_path);
        setFileType('VIDEO');
      }
    }
  }, [campDetails]);

  function setUploadImage(formData) {
    if (uploadFiles && uploadFiles.length) {
      const hasNew = uploadFiles.filter(f => f.id === null);
      if (hasNew.length === 0) {
        return 'modify-campaign';
      }
      if (fileType === 'PHOTO') {
        uploadFiles.forEach(val => {
          if (!val.id) {
            formData.append('image', val.url);
          }
        });
        return 'modify-photo-campaign';
      }
      if (fileType === 'GIF') {
        uploadFiles.forEach(val => {
          if (!val.id) {
            formData.append('gif', val.url[0]);
          }
        });
        return 'modify-gif-campaign';
      }
      if (fileType === 'VIDEO') {
        uploadFiles.forEach(val => {
          if (!val.id) {
            formData.append('video', val[0]);
          }
        });
        return 'modify-video-campaign';
      }
    }

    return 'modify-campaign';
  }

  function onRemove(index) {
    setUploadFile(oldFiles => {
      const { id } = oldFiles[index || 0];
      if (id !== null) {
        if (fileType === 'PHOTO') {
          setImgDel([...imgDel, id]);
        }
        if (fileType === 'GIF') {
          setImgDel([id]);
        }
        if (fileType === 'VIDEO') {
          setImgDel([id]);
        }
      }
      const newFiles = Array.from(oldFiles);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  function getFilesWithIds() {
    return uploadFiles.map(p => p.id).filter(p => p !== null) || [];
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
    imgDel,
  };
};

export const WinStartPeriodValidation = state => {
  const [error, setError] = useState(null);
  const { intl, startPeriod, startHour, startMinute } = state;
  function isValidDate() {
    if (startHour>=0 && startMinute>=0) {
      const m = moment(
        `${startPeriod.toDate} ${startHour}:${startMinute}`,
        militaryTimeFormat,
      );
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

export const WinEndPeriodValidation = state => {
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
    if (endHour>=0 && endMinute>=0) {
      const m = moment(
        `${endPeriod.toDate} ${endHour}:${endMinute}`,
        militaryTimeFormat,
      );
      return m.isValid();
    }
    return false;
  }

  useEffect(() => {
    let invalid = null;
    if (endPeriod) {
      if (endHour && endMinute) {
        const startDate = moment(
          `${startPeriod.toDate?startPeriod.toDate:startPeriod} ${startHour}:${startMinute}`,
          militaryTimeFormat,
        );
        const endDate = moment(
          `${endPeriod.toDate?endPeriod.toDate:endPeriod} ${endHour}:${endMinute}`,
          militaryTimeFormat,
        );

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

    setError(invalid);
  }, [
    endPeriod.toDate,
    endPeriod.error.touched,
    endHour,
    endMinute,
    startPeriod.toDate,
    startPeriod.error.touched,
    startHour,
    startMinute,
  ]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return { list: [], invalid: !isValidDate() };
};

export const PublishTwitterState = intl => {
  const validator = validation(intl);
  const postId = useValidation('', validator.postId);
  return {
    postId,
  };
};
