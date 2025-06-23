/* eslint-disable prettier/prettier */
import React from 'react';
import moment from 'moment';

export function ConditionalHour({ max, min, schedule, ongoingFixedRaffle }) {
  function valid(hour) {
    if (min === 'today' || max === 'today') {
      if (
        moment(schedule.date).format('MM/DD/YYYY') ===
        moment().format('MM/DD/YYYY')
      ) {
        const schedHour = moment(`${hour}:00`, 'HH').hour();
        const todayHour = moment().hour();

        if (max === 'today') {
          return schedHour < todayHour;
        }
        return schedHour >= todayHour;
      }
      return true;
    }

    const sched = moment(
      `${moment(schedule.date).format('MM/DD/YYYY')} ${hour}:${schedule.min}`,
    );
    return sched >= min && (!max || sched <= max);
  }

  return Array(24)
    .fill()
    .map(
      (_, i) =>
        valid(ongoingFixedRaffle || i + 1) && (
          <option key={Number(i)} value={i + 1}>
            {(i + 1).toString().padStart(2, '0')}
          </option>
        ),
    );
}

export function ConditionalMinute({ max, min, schedule, ongoingFixedRaffle }) {
  function valid(minute) {
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
          return schedMin <= todayMin;
        }
        return schedMin >= todayMin;
      }
      return true;
    }

    const sched = moment(
      `${moment(schedule.date).format('MM/DD/YYYY')} ${
        schedule.hour
      }:${minute}`,
    );
    return sched >= min && (!max || sched <= max);
  }
  return Array(12)
    .fill()
    .map(
      (_, i) =>
        valid(i * 5 || ongoingFixedRaffle) && (
          <option key={Number(i)} value={i * 5}>
            {(i * 5).toString().padStart(2, '0')}
          </option>
        ),
    );
}
