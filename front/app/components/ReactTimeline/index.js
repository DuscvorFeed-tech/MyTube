/**
 *
 * ReactTimeline
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import Text from 'components/Text';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  CursorMarker,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import { formatDateTime } from 'utils/commonHelper';
import { forwardTo } from '../../helpers/forwardTo';

// import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ReactTimeline(props) {
  const { items, intl, color, theme } = props;
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const dateStart = new Date(y, m, 1).setHours(0, 0, 0, 0);
  const dateEnd = new Date(y, m + 1, 10).setHours(23, 59, 59, 59);

  const itmColor = id => {
    const itm = color && color.find(f => f.id === id);
    return (itm && itm.color_code) || theme.primary;
  };

  const itms =
    items &&
    items.map(itm => ({
      id: itm.id,
      group: itm.id,
      start_time: moment(formatDateTime(itm.start_period)),
      end_time: moment(formatDateTime(itm.end_period)),
      itemProps: {
        style: {
          background: itmColor(itm.label_id),
          border: itmColor(itm.label_id),
        },
      },
    }));

  const grps =
    items &&
    items.map(itm => ({
      id: itm.id,
      title: (
        <Text
          text={itm.title}
          className="link"
          onClick={() =>
            forwardTo({
              pathname: `/campaign/detail/${itm.id}`,
              pathInfo: {
                backUrl: 'schedule',
              },
            })
          }
        />
      ),
    }));

  return (
    <div>
      {itms && itms.length > 0 && grps ? (
        <Timeline
          groups={grps}
          items={itms}
          defaultTimeStart={moment(dateStart)}
          defaultTimeEnd={moment(dateEnd)}
          showCursorLine
          canMove={false}
          canResize={false}
        >
          <CursorMarker />
          <TimelineHeaders className="sticky">
            <SidebarHeader>
              {({ getRootProps }) => (
                <div className="calendar-grp-title" {...getRootProps()}>
                  {intl.formatMessage({ ...messages.campaignTitle })}
                </div>
              )}
            </SidebarHeader>
            <DateHeader unit="primaryHeader" />
            <DateHeader />
          </TimelineHeaders>
        </Timeline>
      ) : (
        <div className="text-center">
          <Text text="NO RESULTS FOUND." />
        </div>
      )}
    </div>
  );
}

ReactTimeline.propTypes = {
  theme: PropTypes.object,
  items: PropTypes.array,
  color: PropTypes.array,
  intl: intlShape,
};

export default compose(
  memo,
  injectIntl,
  withTheme,
)(ReactTimeline);
