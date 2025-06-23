/**
 *
 * DatePickerRange
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'util';
import { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import moment from 'moment';
import Text from 'components/Text';
import Button from 'components/Button';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { intlShape, injectIntl } from 'react-intl';

import { DateRangeInput } from '@blueprintjs/datetime';
import StyledDatePickerRange from './StyledDatePickerRange';

const regexDate = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);

function DatePickerRange(props) {
  const format = 'MM/DD/YYYY';
  const { state, setState, locale, intl } = props;

  const [selectedDate, setSelectedDate] = useState(state);

  useEffect(() => {
    setSelectedDate(state);
  }, [state]);

  const onChangeDate = date => {
    setSelectedDate(date);
    // eslint-disable-next-line no-unused-expressions
    isFunction(setState) && setState(date);
  };

  const {
    input,
    minDate = new Date(null),
    maxDate = new Date(new Date()),
    theme,
  } = props;

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
    <div className="row align-items-baseline">
      <div className="col-10 pr-1">
        <StyledDatePickerRange input={input}>
          <DateRangeInput
            locale={locale}
            localeUtils={localeUtils}
            formatDate={date => moment(date).format(format)}
            onChange={onChangeDate}
            parseDate={str => {
              let newDt = 'empty';
              if (regexDate.test(str)) {
                newDt = moment(str, format);
              }
              return new Date(newDt);
            }}
            value={selectedDate || ''}
            shortcuts={false}
            allowSingleDayRange
            startInputProps={{
              placeholder: intl.formatMessage({ id: 'startDate' }),
              readOnly: true,
            }}
            endInputProps={{
              placeholder: intl.formatMessage({ id: 'endDate' }),
              readOnly: true,
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </StyledDatePickerRange>
      </div>
      <Text
        className="col-1 pl-1"
        size={theme.fontSize.lg}
        text={
          <Button
            icon="eedd"
            secondary
            onClick={() => onChangeDate([null, null])}
          />
        }
      />
    </div>
  );
}

DatePickerRange.propTypes = {
  input: PropTypes.bool,
  state: PropTypes.any,
  setState: PropTypes.func,
  locale: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  intl: intlShape,
  theme: PropTypes.any,
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
  withTheme,
)(DatePickerRange);
