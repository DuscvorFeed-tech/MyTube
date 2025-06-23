import styled from 'styled-components';

const StyledColorPicker = styled.div`
  position: relative;
  .picker {
    position: absolute;
    top: 0;

    .photoshop-picker {
      .flexbox-fix {
        .flexbox-fix {
          > div {
            > div {
              div {
                div:nth-child(3) {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default StyledColorPicker;
