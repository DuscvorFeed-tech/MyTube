/* eslint-disable indent */
import styled, { css } from 'styled-components';

const StyledModal = styled.div`
  .modal-dialog {
    @media (${props => props.theme.mediaQuery.min.xs}) {
      max-width: 65%;
    }
  }
  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: ${props => props.theme.quarter};
    color: ${props => props.theme.dark};
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border: none;
    border-radius: 0rem;
    outline: 0;
  }
  .custom-modal-content {
    border-radius: 1rem;
    margin: 0 auto;
    min-width: 400px;
    margin: 0px auto;
    width: unset;
    max-width: auto;
    ${props =>
      props.size === 'sm' &&
      css`
        max-width: 400px;
      `};
    ${props =>
      props.size === 'md' &&
      css`
        min-width: 500px;
        max-width: 600px;
      `};
    ${props =>
      props.size === 'lg' &&
      css`
        min-width: 600px;
        max-width: 1000px;
      `};

    @media (${props => props.theme.mediaQuery.max.xs}) {
      min-width: 100%;
      max-width: 100%;
    }
  }
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    padding-top: ${props => (props.dismissable ? '1rem' : '1rem')};
    border-bottom: 1px solid ${props => props.theme.gray};
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    background-color: ${props => props.theme.light};
    & h5 {
      color: ${props => props.theme.primary};
    }
  }

  .modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem 1rem;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: none;
    border-bottom-right-radius: 0rem;
    border-bottom-left-radius: 0rem;
  }

  .close {
    color: ${props => props.theme.tertiaryLight};
    display: ${props => (props.dismissable ? 'block' : 'none')};
    opacity: 1;
    & :not(:disabled):not(.disabled):hover,
    :not(:disabled):not(.disabled):focus {
      color: ${props => props.theme.tertiary};
      text-shadow: 0 1px 0 ${props => props.theme.dark};
    }
  }
  &.full {
    .modal-body {
      padding: 1rem 0;
    }
  }

  &.modal-static .modal-dialog {
    transform: none;
  }
`;

export default StyledModal;
