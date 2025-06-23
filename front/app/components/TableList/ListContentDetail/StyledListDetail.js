import styled from 'styled-components';

const StyledListDetail = styled.div`
  display: block;
  text-align: ${x => x.align};
  line-height: 2.5;
  padding: 0.5rem 1.25rem 0.5rem 5.5rem;
  border-bottom: 1px dashed #f0f3ff;
  width: ${props => (props.width ? `${props.width}%` : 'auto')};

  &.hidden {
    display: none;
  }
`;

export default StyledListDetail;
