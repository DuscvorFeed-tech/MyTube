import styled from 'styled-components';

export const StyledRadioGroup = styled.div`
  position: relative;
`;

export const StyledRadioButton = styled.input`
  position: absolute;
  opacity: 0;
  z-index: 1;

  + label::after {
    border-radius: 18px;
  }

  & :checked + label {
    padding-left: 10px;
    color: #fff;
    font-weight: normal;
    margin-right: 10px;
    background: ${props => props.theme.secondary};
    border-radius: 18px;
    width: fit-content;
    margin-bottom: 3px;
  }

  & :checked + label::after {
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    text-align: center;
    padding: 0 1rem;
  }

  & + label,
  label::after {
    -webkit-transition: 0.25s all ease;
    -o-transition: 0.25s all ease;
    transition: 0.25s all ease;
    width: fit-content;
    margin-bottom: 3px;
  }
`;

export const StyledLabel = styled.label`
  position: relative;
  display: inline-block;
  padding-left: 30px;
  padding-right: 10px;
  line-height: 36px;
  cursor: pointer;
  font-weight: normal;

  & ::after {
    content: ' ';
    position: absolute;
    top: 6px;
    left: 0;
    display: block;
    width: 24px;
    height: 24px;
    border: 2px solid ${props => props.theme.secondary};
    z-index: 0;
  }
`;

export const StyledSubLabel = styled.label`
  display: block;
  margin: 2px;
  line-height: 12px;
  font-size: ${props => props.theme.fontSize.xs};
`;
