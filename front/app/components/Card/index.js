/**
 *
 * Card
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import CardBody from './CardBody';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

const StyledCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  padding: 1.25rem;
  border: 1px solid #93939380;
  background: ${x => x.theme.light};
  border-radius: 3px;
  overflow: hidden;

  &.full {
    .body {
      padding: 0;
    }
  }

  ${props =>
    props.title !== null &&
    css`
      padding: 0;
    `};

  ${props =>
    props.noBorderBottom &&
    css`
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `};
`;

function Card(props) {
  const {
    children,
    className,
    title,
    component,
    minHeight,
    noBody,
    subTitle,
    footer,
    noBorderBottom,
  } = props;
  return (
    <StyledCard
      className={className}
      minHeight={minHeight}
      noBody={noBody}
      subTitle
      noBorderBottom={noBorderBottom}
    >
      {(title || component) && (
        <CardHeader>
          <div className="text-left">
            {title}
            <div className="subtitle">{subTitle}</div>
          </div>
          <div>{component && component}</div>
        </CardHeader>
      )}
      {!noBody && (
        <CardBody minHeight={minHeight}>{Children.toArray(children)}</CardBody>
      )}
      {footer && <CardFooter>{footer}</CardFooter>}
    </StyledCard>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.any,
  minHeight: PropTypes.string,
  component: PropTypes.object,
  subTitle: PropTypes.any,
  noBody: PropTypes.bool,
  footer: PropTypes.object,
  noBorderBottom: PropTypes.bool,
};

export default memo(Card);
