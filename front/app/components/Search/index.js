/**
 *
 * Search
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// import styled from 'styled-components';

import Input from 'components/Input';
import { StyledSearch, StyledAutocomplete } from './StyledSearch';
import messages from './messages';

function Search(props) {
  const {
    className,
    onChange,
    value,
    intl,
    list,
    title,
    id,
    onClickSuggestions,
  } = props;
  return (
    <StyledSearch className={className}>
      <Input
        placeholder={intl.formatMessage({ ...messages.btnSearch })}
        className="icon-font"
        coin="\ed12"
        value={value}
        onChange={onChange}
      />
      {list && title && (
        <StyledAutocomplete>
          <ul>
            {list.list.map(
              itm =>
                !id.includes(itm.id) && (
                  <li key={itm.id}>
                    <button
                      type="button"
                      onClick={() => onClickSuggestions(itm.id)}
                    >
                      {itm.id} - {itm.title}
                    </button>
                  </li>
                ),
            )}
          </ul>
        </StyledAutocomplete>
      )}
    </StyledSearch>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.any,
  value: PropTypes.any,
  list: PropTypes.any,
  title: PropTypes.any,
  id: PropTypes.any,
  onClickSuggestions: PropTypes.func,
  intl: intlShape,
};

export default injectIntl(Search);
