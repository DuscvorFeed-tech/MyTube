/**
 *
 * HeaderSummary
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IcoFont from 'react-icofont';
import Button from 'components/Button';

const StyledHeaderSummary = styled.div`
  display: flex;
  align-items: center;

  h5 {
    font-weight: 600;
    font-size: ${props => props.theme.fontSize.md};
    margin-bottom: 0;
  }

  span {
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

function HeaderSummary(props) {
  const { icon, title, subTitle, info, tooltip } = props;
  return (
    <StyledHeaderSummary>
      <IcoFont
        icon={icon}
        style={{
          verticalAlign: '1px',
          fontSize: '2em',
          marginRight: '0.4rem',
        }}
      />
      <div>
        <h5>
          {title}
          {info && (
            <Button
              link
              dataToggle="tooltip"
              dataPlacement="top"
              title={tooltip}
              className="header-toolbtn"
            >
              <IcoFont
                className="cursorPointer active"
                icon="icofont-info-circle"
                style={{
                  verticalAlign: 'top',
                  lineHeight: '0',
                  margin: '0 1px',
                  fontSize: '0.7rem',
                }}
              />
            </Button>
          )}
        </h5>
        <span>{subTitle}</span>
      </div>
    </StyledHeaderSummary>
  );
}

HeaderSummary.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  info: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default memo(HeaderSummary);
