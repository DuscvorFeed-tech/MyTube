/**
 *
 * DatePicker
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateInput } from '@blueprintjs/datetime';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { createSelector } from 'reselect';
// import { IntlProvider } from 'react-intl';

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
// import ErrorMsg from 'components/ErrorMsg';

import { isFunction } from 'util';
import { intlShape, injectIntl } from 'react-intl';
import StyledDatePicker from './StyledDatePicker';

const regexDate = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);

function DatePicker({
  canClearSelection = true,
  showActionsBar = true,
  disabled,
  onChange,
  value,
  defaultValue,
  inputRef,
  minDate,
  maxDate = new Date(new Date().getFullYear() + 5, 11, 31),
  defaultDt = new Date(),
  locale,
  intl,
  hideTodayButton = false,
}) {
  // const { errors } = props;

  const format = 'YYYY/MM/DD';
  const [selectedDate, setSelectedDate] = useState(defaultValue || defaultDt);

  const onChangeDate = date => {
    setSelectedDate(date);
    // eslint-disable-next-line no-unused-expressions
    isFunction(onChange) && onChange(date);
  };

  const normalize = val => {
    if (val && typeof val === 'string') {
      return moment(val).toDate();
    }

    if (val === true) {
      return null;
    }

    return val;
  };

  const WEEKDAYS_LONG = {
    [locale]: [
      intl.formatMessage({ id: 'Sunday' }),
      intl.formatMessage({ id: 'Monday' }),
      intl.formatMessage({ id: 'Tuesday' }),
      intl.formatMessage({ id: 'Wednesday' }),
      intl.formatMessage({ id: 'Thursday' }),
      intl.formatMessage({ id: 'Friday' }),
      intl.formatMessage({ id: 'Saturday' }),
    ],
  };
  const WEEKDAYS_SHORT = {
    [locale]: [
      intl.formatMessage({ id: 'Su' }),
      intl.formatMessage({ id: 'Mo' }),
      intl.formatMessage({ id: 'Tu' }),
      intl.formatMessage({ id: 'We' }),
      intl.formatMessage({ id: 'Th' }),
      intl.formatMessage({ id: 'Fr' }),
      intl.formatMessage({ id: 'Sa' }),
    ],
  };

  const MONTHS = {
    [locale]: [
      intl.formatMessage({ id: 'January' }),
      intl.formatMessage({ id: 'February' }),
      intl.formatMessage({ id: 'March' }),
      intl.formatMessage({ id: 'April' }),
      intl.formatMessage({ id: 'May' }),
      intl.formatMessage({ id: 'June' }),
      intl.formatMessage({ id: 'July' }),
      intl.formatMessage({ id: 'August' }),
      intl.formatMessage({ id: 'September' }),
      intl.formatMessage({ id: 'October' }),
      intl.formatMessage({ id: 'November' }),
      intl.formatMessage({ id: 'December' }),
    ],
  };

  const FIRST_DAY = {
    [locale]: 0,
  };

  const formatDay = d =>
    `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${
      MONTHS[locale][d.getMonth()]
    } ${d.getFullYear()}`;

  const formatMonthTitle = d =>
    `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;

  const formatWeekdayShort = i => WEEKDAYS_SHORT[locale][i];

  const formatWeekdayLong = i => WEEKDAYS_SHORT[locale][i];
  const getFirstDayOfWeek = () => FIRST_DAY[locale];
  const getMonths = () => MONTHS[locale];

  const localeUtils = {
    formatDay,
    formatMonthTitle,
    formatWeekdayShort,
    formatWeekdayLong,
    getFirstDayOfWeek,
    getMonths,
  };

  return (
    <StyledDatePicker>
      <DateInput
        className={hideTodayButton && 'noTodayBtn'}
        locale={locale}
        localeUtils={localeUtils}
        inputProps={{ inputRef, readOnly: true }}
        showActionsBar={showActionsBar}
        formatDate={date => moment(date).format(format)}
        onChange={onChangeDate}
        parseDate={str => {
          let newDt = 'empty';
          if (regexDate.test(str)) {
            newDt = moment(str, format);
          }
          return new Date(newDt);
        }}
        placeholder={format}
        value={normalize(value || selectedDate) || undefined}
        invalidDateMessage=""
        outOfRangeMessage=""
        minDate={minDate}
        maxDate={maxDate}
        canClearSelection={canClearSelection}
        disabled={disabled}
      />
    </StyledDatePicker>
  );
}

DatePicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.bool,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  onChange: PropTypes.func,
  canClearSelection: PropTypes.bool,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  inputRef: PropTypes.any,
  defaultDt: PropTypes.any,
  showActionsBar: PropTypes.bool,
  disabled: PropTypes.bool,
  locale: PropTypes.string,
  intl: intlShape,
  hideTodayButton: PropTypes.bool,
  // errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  locale => ({
    locale,
  }),
);

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(DatePicker);
