import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const START_YEAR = 2020;
export const NUM_OF_YEARS = 3;
export const MONTH_NAMES = [
  <React.Fragment>
    <FormattedMessage {...messages.Jan} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Feb} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Mar} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Apr} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.May} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Jun} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Jul} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Aug} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Sep} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Oct} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Nov} />
  </React.Fragment>,
  <React.Fragment>
    <FormattedMessage {...messages.Dec} />
  </React.Fragment>,
];
export const MONTHS_PER_YEAR = 12;
export const QUARTERS_PER_YEAR = 4;
export const MONTHS_PER_QUARTER = 3;
export const NUM_OF_MONTHS = NUM_OF_YEARS * MONTHS_PER_YEAR;
export const MAX_TRACK_START_GAP = 4;
export const MAX_ELEMENT_GAP = 8;
export const MAX_MONTH_SPAN = 8;
export const MIN_MONTH_SPAN = 2;
export const NUM_OF_TRACKS = 20;
export const MAX_NUM_OF_SUBTRACKS = 5;

export const TITLE_HEADER_1 = 'Quarters';
export const TITLE_HEADER_2 = 'Months';
