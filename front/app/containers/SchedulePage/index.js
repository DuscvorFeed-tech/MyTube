/* eslint-disable no-unused-vars */
/**
 *
 * SchedulePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Card from 'components/Card';

// import GanttCalendar from 'components/GanttCalendar';
import Timeline from 'components/ReactTimeline';
import Filter from 'components/Filter';

import moment from 'moment';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSchedulePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchCampaign, resetData } from './actions';
import messages from './messages';

export function SchedulePage(props) {
  useInjectReducer({ key: 'schedulePage', reducer });
  useInjectSaga({ key: 'schedulePage', saga });

  const {
    intl,
    onLoadCampaignList,
    onResetPage,
    commonTypes,
    userAccount,
    schedulePage: { labelList, campaignList },
  } = props;

  const [filter, setFilter] = useState({
    label_id: null,
    campaign_status: null,
    start_period: null,
    end_period: null,
  });
  useEffect(() => {
    onResetPage();
    onLoadCampaignList({ ...filter, sns_account_id: 1 });
  }, []);

  useEffect(() => {
    onLoadCampaignList({ ...filter, sns_account_id: 1 });
  }, [filter]);

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.publishSchedule })}</title>
        <meta name="description" content="Description of SchedulePage" />
      </Helmet>
      {/* <FormattedMessage {...messages.header} /> */}
      <Card title={intl.formatMessage({ ...messages.publishSchedule })}>
        <div className="row">
          <div className="col-2">
            <Filter
              labelList={labelList && labelList.list}
              filter={filter}
              statusList={{
                type: intl.formatMessage({
                  ...messages.campaignStatus,
                }),
                listType: 'campaignStatus',
                data: commonTypes && commonTypes.CampaignStatus,
              }}
              onSubmitFilter={({ label, status, state }) => {
                const sp = state[0]
                  ? moment(state[0]).format('MM/DD/YYYY')
                  : null;
                const ep = state[1]
                  ? moment(state[1]).format('MM/DD/YYYY')
                  : null;
                setFilter(prev => ({
                  ...prev,
                  label_id: label ? Number(label) : null,
                  campaign_status: status ? Number(status) : null,
                  start_period: sp,
                  end_period: ep,
                }));
              }}
              onClear={() => {
                setFilter(prev => ({
                  ...prev,
                  label_id: null,
                  campaign_status: null,
                  start_period: null,
                  end_period: null,
                }));
              }}
            />
          </div>
        </div>
        <Timeline items={campaignList.list} color={labelList.list} />
        {/* <GanttCalendar /> */}
      </Card>
    </div>
  );
}

SchedulePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape,
  onLoadCampaignList: PropTypes.func,
  onResetPage: PropTypes.func,
  schedulePage: PropTypes.any,
  commonTypes: PropTypes.any,
  userAccount: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  schedulePage: makeSelectSchedulePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadCampaignList: data => dispatch(fetchCampaign(data)),
    onResetPage: () => dispatch(resetData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(SchedulePage);
