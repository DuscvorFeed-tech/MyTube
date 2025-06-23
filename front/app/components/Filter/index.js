/* eslint-disable camelcase */
/**
 *
 * Filter
 *
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// import styled from 'styled-components';
import Text from 'components/Text';
// import DatePicker from 'components/DatePicker';
import DatePickerRange from 'components/DatePickerRange';
import Select from 'components/Select';
import Button from 'components/Button';
import useValidation from 'library/validator';
import { StyledFilter, StyledHiddenDiv } from './StyledFilter';

import useOutsideClick from './useOutsideClick';

import messages from './messages';

function Filter(props) {
  const {
    intl,
    className,
    statusList,
    statusList2,
    statusList3,
    prizeList,
    labelList,
    onSubmitFilter,
    onClear,
    dateFilter = { show: true },
    formInputDateFilter = { show: true },
  } = props;

  const status = useValidation('');
  const status2 = useValidation('');
  const status3 = useValidation('');
  const label = useValidation('');
  const prize = useValidation('');

  const [filterDiv, setFilterDiv] = useState(false);
  const [state, setState] = useState([]);
  const [formPeriodState, setFormPeriodState] = useState([]);

  const ref = useRef();
  useOutsideClick(ref, () => {
    const x = document.getElementsByClassName('bp3-overlay');

    if (x.length > 0) {
      // if (!x[0].classList.contains('bp3-overlay-open')) {
      //   if (filterDiv) {
      //     setFilterDiv(false);
      //   }
      // }
      if (!x[0].classList.contains('bp3-overlay-open')) {
        if (filterDiv) {
          setFilterDiv(false);
        }
      }
    } else if (filterDiv) {
      setFilterDiv(false);
    }
  });

  return (
    <StyledFilter className={className} ref={ref}>
      <Button
        small
        className="col withBar position-relative"
        onClick={() => {
          setFilterDiv(true);
        }}
      >
        <div className="text-left">
          <Text
            className="p-0"
            text={intl.formatMessage({ ...messages.filter })}
          />
        </div>
      </Button>
      {filterDiv && (
        <StyledHiddenDiv className="position-absolute">
          <div className="">
            {/* <div className="row mb-3 align-items-baseline">
              <div className="col-4">Name</div>
              <div className="col">
                <Input name="name" />
              </div>
            </div> */}
            {labelList && (
              <div className="row mb-3 align-items-baseline">
                <div className="col-4">
                  {intl.formatMessage({ ...messages.label })}
                </div>
                <div className="col">
                  <Select {...label}>
                    <option value="">
                      {intl.formatMessage(
                        { id: 'M0000008' },
                        { name: intl.formatMessage({ ...messages.label }) },
                      )}
                    </option>
                    {labelList.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {statusList && (
              <div className="row mb-3 align-items-baseline">
                <div className="col-4">{statusList.type}</div>
                <div className="col">
                  <Select {...status}>
                    <option value="">
                      {intl.formatMessage(
                        { id: 'M0000008' },
                        { name: intl.formatMessage({ ...messages.status }) },
                      )}
                    </option>
                    {statusList.data.map(m => (
                      <option key={m.value} value={m.value}>
                        {intl.formatMessage(
                          { id: `${statusList.listType}${m.value}` },
                          { defaultMessage: m.name },
                        )}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {/* eslint-disable-next-line prettier/prettier */}
            {!statusList2 || statusList.data.filter(e => e.name === 'Loser').length > 0 && status.value === "0" ? null : (
              <div className="row mb-3 align-items-baseline">
                <div className="col-4">{statusList2.type}</div>
                <div className="col">
                  <Select {...status2}>
                    <option value="">
                      {intl.formatMessage(
                        { id: 'M0000008' },
                        { name: intl.formatMessage({ ...messages.status }) },
                      )}
                    </option>
                    {statusList2.data.map(m => (
                      <option key={m.value} value={m.value}>
                        {intl.formatMessage(
                          { id: `${statusList2.listType}${m.value}` },
                          { defaultMessage: m.name },
                        )}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {/* eslint-disable-next-line prettier/prettier */}
            {!statusList3 || statusList.data.filter(e => e.name === 'Loser').length > 0 && status.value === "0" ? null : (
              <div className="row mb-3 align-items-baseline">
                <div className="col-4">{statusList3.type}</div>
                <div className="col">
                  <Select {...status3}>
                    <option value="">
                      {intl.formatMessage(
                        { id: 'M0000008' },
                        { name: intl.formatMessage({ ...messages.status }) },
                      )}
                    </option>
                    {statusList3.data.map(m => (
                      <option key={m.value} value={m.value}>
                        {intl.formatMessage(
                          { id: `${statusList3.listType}${m.value}` },
                          { defaultMessage: m.name },
                        )}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {prizeList && (
              <div className="row mb-3 align-items-baseline">
                <div className="col-4">{prizeList.name}</div>
                <div className="col">
                  <Select {...prize}>
                    <option value="">
                      {intl.formatMessage(
                        { id: 'M0000008' },
                        { name: intl.formatMessage({ ...messages.prize }) },
                      )}
                    </option>
                    {prizeList.data.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {dateFilter && dateFilter.show && (
              <div className="row mb-4 align-items-baseline">
                <div className="col-4">
                  {intl.formatMessage({
                    ...messages.period,
                    ...dateFilter.messages,
                  })}
                </div>
                <div className="col">
                  <DatePickerRange input state={state} setState={setState} />
                </div>
              </div>
            )}
            {formInputDateFilter && formInputDateFilter.show && (
              <div className="row mb-4 align-items-baseline">
                <div className="col-4">
                  {intl.formatMessage({
                    ...messages.formInputPeriod,
                    ...formInputDateFilter.messages,
                  })}
                </div>
                <div className="col">
                  <DatePickerRange
                    input
                    state={formPeriodState}
                    setState={setFormPeriodState}
                  />
                </div>
              </div>
            )}
            <div className="row text-right mr-1">
              <div className="col-3 ml-auto">
                <Button
                  link
                  className="col-12 ml-3"
                  onClick={() => {
                    status.onChange('');
                    status2.onChange('');
                    status3.onChange('');
                    prize.onChange('');
                    label.onChange('');
                    setState([null, null]);
                    setFormPeriodState([]);
                    onClear();
                  }}
                >
                  {intl.formatMessage({ ...messages.clear })}
                </Button>
              </div>
              <div className="col-3 px-0 text-left">
                <Button
                  small
                  light
                  className="col-12"
                  onClick={() => {
                    setFilterDiv(false);
                    onSubmitFilter({
                      label: label.value,
                      status: status.value,
                      status2: status2.value,
                      status3: status3.value,
                      prize: prize.value,
                      state,
                      formPeriodState,
                    });
                  }}
                >
                  {intl.formatMessage({ ...messages.apply })}
                </Button>
              </div>
            </div>
          </div>
        </StyledHiddenDiv>
      )}
    </StyledFilter>
  );
}

Filter.propTypes = {
  className: PropTypes.string,
  statusList: PropTypes.any,
  statusList2: PropTypes.any,
  statusList3: PropTypes.any,
  labelList: PropTypes.any,
  prizeList: PropTypes.any,
  onSubmitFilter: PropTypes.any,
  onClear: PropTypes.any,
  dateFilter: PropTypes.any,
  formInputDateFilter: PropTypes.any,
  intl: intlShape,
};

export default injectIntl(Filter);
