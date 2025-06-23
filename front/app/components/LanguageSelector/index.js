/**
 *
 * LanguageSelector
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import styled from 'styled-components';

import {
  changeLocale,
  changeLanguageInDB,
} from 'containers/LanguageProvider/actions';

import { intlShape, injectIntl } from 'react-intl';
// import messages from './messages';

function LanguageSelector(props) {
  const { onChangeLocale, intl } = props;
  return (
    <select onChange={e => onChangeLocale(e)} value={intl.locale}>
      <option value="en">EN</option>
      <option value="ja">JP</option>
    </select>
  );
}

LanguageSelector.propTypes = {
  onChangeLocale: PropTypes.func,
  // submitLanguage: PropTypes.func,
  intl: intlShape,
};

function mapDispatchToProps(dispatch) {
  return {
    onChangeLocale: e => dispatch(changeLocale(e.target.value)),
    submitLanguage: data => dispatch(changeLanguageInDB({ data })),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
  injectIntl,
)(LanguageSelector);
