/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/**
 *
 * ErrorMsg
 *
 */

import React, { memo } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import ErrorMsg from '../ErrorMsg';

function ErrorFormatted({ errors, name, intl}) {
  return (
  // invalid &&
  // list.filter(({ formatIntl }) => !names || names.includes(formatIntl.name)).map(({ formatIntl }, index) => (
  //  <ErrorMsg key={Number(index)}>
  //    {formatIntl.values ? <FormattedMessage {...formatIntl} /> :
  //      formatIntl.id
  //        ? intl.formatMessage(
  //          { id: formatIntl.id },
  //          {
  //            name: intl.formatMessage({
  //              id: customName || formatIntl.name,
  //              defaultMessage: formatIntl.name,
  //            }),
  //            ...(formatIntl.state ? ({...formatIntl.state, ...customState}) : {}),
  //          },
  //        )
  //        : `Error Code is missing. Error Key: ${formatIntl.name}`}

  //  </ErrorMsg>
  // ))

    <ErrorMsg>
      {errors &&
        errors[name] &&
        intl.formatMessage({
          id: `${errors[name].code}`,
        },{name})
      }
    </ErrorMsg>
  );
}

ErrorFormatted.propTypes = {
  // invalid: PropTypes.bool,
  // list: PropTypes.array,
  intl: PropTypes.any,
  // name: PropTypes.array,
  errors: PropTypes.array,
  name: PropTypes.string,
};

export default compose(
  injectIntl,
  memo,
)(ErrorFormatted);
