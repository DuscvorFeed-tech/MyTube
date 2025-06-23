/* eslint-disable indent */
import React from 'react';
import moment from 'moment';
const hours = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
const minutes = Array(12)
  .fill()
  .map((_, i) => i * 5);

function getRefMoment(date) {
  if (date) {
    if (date === 'today') {
      return moment(new Date()).seconds(0);
    }
    if (!moment.isMoment(date)) {
      return moment(date);
    }
  }
  return date;
}

export function GenerateFormatted({ date, hour, min }) {
  const d = moment(date).format('MM/DD/YYYY');
  const h = hour || 0;
  const m = min || 0;

  return moment(`${d} ${h}:${m}`, 'MM/DD/YYYY HH:mm');
}

export function GenerateTime({ max, min, schedule }) {
  const pattern = 'MM/DD/YYYY HH:mm';
  const refMin = getRefMoment(min);
  const refMax = getRefMoment(max);

  const stringDate = moment(schedule.date).format('MM/DD/YYYY');

  const time = [];
  hours.forEach(h => {
    const hourList = [];
    minutes.forEach(m => {
      const target = moment(`${stringDate} ${h}:${m}`, pattern);
      const result = compare(target);
      if (result) {
        hourList.push(m);
      }
    });

    if (hourList.length) {
      time.push({ list: hourList, value: h });
    }
  });

  function compare(target) {
    if (refMin && refMax) {
      return refMin <= target && refMax >= target;
    }
    if (refMin) {
      return refMin <= target;
    }
    if (refMax) {
      return refMax >= target;
    }
    return true;
  }

  function getDefaultValues() {
    const stime = time;
    if (stime) {
      const st = stime[0];
      const h = st.value;
      const m = st.list[0];
      return { hour: h, minute: m };
    }
    return null;
  }

  return {
    series: time,
    minDate: refMin,
    maxDate: refMax,
    getDefaultValues,
  };
}

export function ConditionalHour({ max, min, schedule }) {
  function valid(hour) {
    const sched = moment(moment(schedule.date).format('MM/DD/YYYY')).add(
      Number(hour),
      'hour',
    );

    if (min === 'today' || max === 'today') {
      if (
        moment(schedule.date).format('MM/DD/YYYY') ===
        moment().format('MM/DD/YYYY')
      ) {
        const schedHour = moment(`${hour}:00`, 'HH').hour();
        const todayHour = moment().hour();

        if (max === 'today') {
          return (
            schedHour < todayHour && (!min || (min !== 'today' && sched >= min))
          );
        }
        return schedHour >= todayHour;
      }
      return true;
    }
    const hformat = 'MM/DD/YYYY HH:00';
    const schedMin = min && moment(min.format(hformat), hformat);
    const schedMax = max && moment(max.format(hformat), hformat);
    return sched >= schedMin && (!schedMax || sched <= schedMax);
  }

  return Array(24)
    .fill()
    .map(
      (_, i) =>
        valid(i) && (
          <option key={Math.random()} value={i + 1}>
            {(i + 1).toString().padStart(2, '0')}
          </option>
        ),
    );
}

export function ConditionalMinute({ max, min, schedule }) {
  function valid(minute) {
    const sched = moment(moment(schedule.date).format('MM/DD/YYYY'))
      .add(Number(schedule.hour))
      .add(minute, 'minute');

    if (min === 'today' || max === 'today') {
      const schedDate = moment(
        `${moment(schedule.date).format('MM/DD/YYYY')} ${schedule.hour}:00`,
      ).format('MM/DD/YYYY HH');

      const schedToday =
        max === 'today'
          ? moment()
              .subtract(1, 'h')
              .format('MM/DD/YYYY HH')
          : moment().format('MM/DD/YYYY HH');

      if (schedDate === schedToday) {
        const schedMin = Number(minute);
        const todayMin = moment().minute();

        if (max === 'today') {
          return (
            schedMin <= todayMin && (!min || (min !== 'today' && sched >= min))
          );
        }
        return schedMin >= todayMin;
      }
      return true;
    }

    // const sched = moment(
    //   `${moment(schedule.date).format('MM/DD/YYYY')} ${
    //     schedule.hour
    //   }:${minute} ${schedule.ampm}`,
    // );
    return sched >= min && (!max || sched <= max);
  }

  return Array(12)
    .fill()
    .map(
      (_, i) =>
        valid(i * 5) && (
          <option value={i * 5}>{(i * 5).toString().padStart(2, '0')}</option>
        ),
    );
}
