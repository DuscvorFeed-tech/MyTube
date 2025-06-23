/**
 *
 * Tags
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

import StyledTags from './StyledTags';

function Tags(props) {
  const { id, text, onClick } = props;
  return (
    <div className="text-nowrap d-inline-block">
      <StyledTags text={text}>
        <label htmlFor={id}>{text}</label>
        <Button icon="eee4" onClick={onClick} />
      </StyledTags>
    </div>
  );
}

Tags.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default Tags;
