/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/**
 *
 * PublishedPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Tabs from 'components/Tabs';
import TabsWrapper from 'components/Tabs/Wrapper';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectPublishedPage, { makeSelectCampaignList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

// import Tweets from './Tweets';
import CampaignList from './subcomponent/CampaignList';
// import TweetList from './subcomponent/TweetList';
import { fetchCampaign, resetData } from './actions';

export function PublishedPage({
  intl,
  onLoadCampaignList,
  campaignsList,
  commonTypes,
  onResetPage,
  userAccount,
  pubPage: { labelList },
  location,
}) {
  useInjectReducer({ key: 'publishedPage', reducer });
  useInjectSaga({ key: 'publishedPage', saga });

  const snsType = 1;

  const campaignTab = location.state && location.state.campaignTab;
  const [filter, setFilter] = useState({
    title: '',
    campaign_type: campaignTab || 2,
    label_id: null,
    campaign_status: null,
    raffle_type: null,
    start_period: null,
    end_period: null,
  });
  useEffect(() => {
    onResetPage();
    onLoadCampaignList({ ...filter, sns_account_id: 1 });
  }, []);

  const { campaign_type } = filter;

  useEffect(() => {
    onLoadCampaignList({ ...filter, sns_account_id: 1 });
  }, [filter]);

  const onPageList = page => {
    onLoadCampaignList({ ...filter, sns_account_id: 1 }, page);
  };

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.published })}</title>
        <meta name="description" content="Description of Published Page" />
      </Helmet>
      <Card
        title={intl.formatMessage({ ...messages.campaignList })}
        className="p-0"
      >
        <Card className="p-3">
          <div className="col-12">
            <div className="row">
              <div className="col mt-2">
                {snsType === 1 && (
                  <TabsWrapper>
                    <Tabs
                      id="flow1"
                      className={campaign_type === 2 ? 'active' : ''}
                      onClick={() =>
                        setFilter(prev => ({
                          ...prev,
                          campaign_type: 2,
                        }))
                      }
                      label={intl.formatMessage({
                        ...messages.hashtagCampaign,
                      })}
                      activeClassName="active"
                    />
                    <Tabs
                      id="flow1"
                      className={campaign_type === 1 ? 'active' : ''}
                      onClick={() =>
                        setFilter(prev => ({
                          ...prev,
                          campaign_type: 1,
                        }))
                      }
                      label={intl.formatMessage({
                        ...messages.retweetCampaign,
                      })}
                      activeClassName="active"
                    />
                  </TabsWrapper>
                )}
                <CampaignList
                  intl={intl}
                  campaignsList={campaignsList}
                  labelList={labelList}
                  onPageList={onPageList}
                  setFilter={setFilter}
                  statusList={{
                    type: intl.formatMessage({
                      ...messages.campaignStatus,
                    }),
                    listType: 'campaignStatus',
                    data: commonTypes && commonTypes.CampaignStatus,
                  }}
                  statusList2={{
                    type: intl.formatMessage({
                      ...messages.raffleType,
                    }),
                    listType: 'raffleType',
                    data: commonTypes && commonTypes.RaffleType,
                  }}
                />
                {/* {campaign_type === 2 && (
                  <CampaignList campaignsList={campaignsList} />
                )} */}
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}

PublishedPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape,
  onLoadCampaignList: PropTypes.func,
  campaignsList: PropTypes.any,
  pubPage: PropTypes.any,
  commonTypes: PropTypes.any,
  onResetPage: PropTypes.any,
  userAccount: PropTypes.any,
  location: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  pubPage: makeSelectPublishedPage(),
  campaignsList: makeSelectCampaignList(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadCampaignList: (data, page = 1) =>
      dispatch(fetchCampaign({ ...data, page })),
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
  withTheme,
  injectIntl,
)(PublishedPage);
