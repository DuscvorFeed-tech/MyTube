/* eslint-disable camelcase */
/**
 *
 * DashboardPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Text from 'components/Text';
import Tweet from 'components/Tweet';
import Title from 'components/Title';
// import DatePickerRange from 'components/DatePickerRange';

import User from 'assets/images/icons/user_primary.png';

import { injectIntl, intlShape } from 'react-intl';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { config } from 'utils/config';
import makeSelectDashboardPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getStats, getBarStats, fetchCampaign } from './actions';
import Campaign from './sub/Campaign';
import Account from './sub/Account';
import TopCampaignProvider, { TopCampaignContext } from './context/topCampaign';
import { fileExt } from '../../library/validator/rules';
import messages from './messages';
export const getFileType = tokens => {
  try {
    if (tokens.length > 1) {
      return 'PHOTO';
    }

    if (tokens.length) {
      const { filename } = JSON.parse(atob(tokens[0].split('.')[1]));
      if (filename) {
        const result = fileExt({
          name: '',
          ext: 'mp4,mov',
        })({
          value: tokens[0],
        });

        if (result) {
          return 'PHOTO';
        }

        return 'VIDEO';
      }
    }
  } catch (e) {
    return null;
  }
  return null;
};

export function DashboardPage(props) {
  useInjectReducer({ key: 'dashboardPage', reducer });
  useInjectSaga({ key: 'dashboardPage', saga });
  const { userAccount, theme, intl } = props;
  // eslint-disable-next-line no-unused-vars
  const [selectedDate, setSelectedDate] = useState([]);
  const [startPeriod, endPeriod] = selectedDate;

  const snsPrimary = 1;
  const snsType = snsPrimary.type;
  useEffect(() => {
    const dt = {
      snsId: 1,
      campaignId: null,
      filter: {},
    };

    props.onLoadData(dt);
    const ed = moment(new Date()).format('MM/DD/YYYY');
    const sd = new Date();
    sd.setDate(sd.getDate() - 10);
    dt.filter = {
      filterBy: 2,
      dateStart: moment(sd).format('MM/DD/YYYY'),
      dateEnd: ed,
    };
    props.onLoadBar(dt);
  }, []);

  const loadStats = (id, filter) => {
    props.onLoadData({
      snsId: 1,
      campaignId: id,
      filter,
    });
  };
  const loadBarStats = filter => {
    props.onLoadBar({
      snsId: 1,
      campaignId: null,
      filter,
    });
  };

  const onSearchCampaign = val => {
    props.onFetchCampaign({
      title: val,
      sns_account_id: 1,
    });
  };

  return (
    <div>
      <Helmet>
        <title>
          {intl.formatMessage({
            ...messages.T0000006,
          })}
        </title>
        <meta name="description" content="Description of DashboardPage" />
      </Helmet>
      <Title
        text={intl.formatMessage({
          ...messages.T0000006,
        })}
        className="py-3"
        component={
          <div className="row align-items-center justify-content-end">
            <div className="text-uppercase col-auto">
              {/* <Button red small className="text-uppercase" width="sm">
                force stop
              </Button> */}
            </div>
          </div>
        }
      >
        <div className="row ml-2">
          <div className="text-uppercase col-7">
            {/* <DatePickerRange setState={setSelectedDate} /> */}
          </div>
        </div>
      </Title>
      <div className="row">
        {snsType === 1 && (
          <div className="col">
            <TopCampaignProvider
              snsId={1}
              campaignType={1}
              startPeriod={startPeriod}
              endPeriod={endPeriod}
            >
              <Card noBorderBottom className="mt-4">
                <Text
                  title
                  text={intl.formatMessage({
                    ...messages.M0000063,
                  })}
                />
                <TopCampaignContext.Consumer>
                  {({ list }) =>
                    list.map(
                      (
                        {
                          sns_post_content,
                          sns_post_media_path,
                          total_replies,
                          total_likes,
                          total_retweet,
                          start_period,
                          number_of_entries,
                        },
                        index,
                      ) => (
                        <div className="mb-4" key={Number(index)}>
                          <Tweet
                            // username="@blotocolTwt"
                            userImg={User}
                            name={snsPrimary.name}
                            replyCount={total_replies}
                            retweetCount={total_retweet}
                            likeCount={total_likes}
                            content={sns_post_content}
                            files={
                              sns_post_media_path &&
                              sns_post_media_path.map(
                                s =>
                                  `${config.SNS_CAMPAIGN_IMAGE}?filename=${
                                    s.url
                                  }`,
                              )
                            }
                            fileType={getFileType(sns_post_media_path)}
                            dateTime={moment(
                              start_period,
                              'MMM/DD/YYYY (hh:mm A)',
                            ).format('MM/DD/YYYY hh:mm A ([GMT] ZZ)')}
                            entryCount={number_of_entries}
                            // dateTime="November 11, 2019 8:57AM (UTC +08:00)"
                          />
                        </div>
                      ),
                    )
                  }
                </TopCampaignContext.Consumer>
              </Card>
            </TopCampaignProvider>
          </div>
        )}
        <div className="col">
          <TopCampaignProvider snsId={1} campaignType={2}>
            <Card noBorderBottom className="mt-4">
              <Text
                title
                text={intl.formatMessage({
                  ...messages.M0000064,
                })}
              />
              <TopCampaignContext.Consumer>
                {({ list }) =>
                  list.map(
                    (
                      {
                        sns_post_content,
                        sns_post_media_path,
                        total_replies,
                        total_likes,
                        total_retweet,
                        start_period,
                        number_of_entries,
                      },
                      index,
                    ) => (
                      <div className="mb-4" key={Number(index)}>
                        <Tweet
                          // username="@blotocolTwt"
                          userImg={User}
                          name={snsPrimary.name}
                          replyCount={total_replies}
                          retweetCount={total_retweet}
                          likeCount={total_likes}
                          content={sns_post_content}
                          files={
                            sns_post_media_path &&
                            sns_post_media_path.map(
                              s =>
                                `${config.SNS_CAMPAIGN_IMAGE}?filename=${
                                  s.url
                                }`,
                            )
                          }
                          fileType={getFileType(sns_post_media_path)}
                          dateTime={moment(
                            start_period,
                            'MMM/DD/YYYY (hh:mm A)',
                          ).format('MM/DD/YYYY hh:mm A ([GMT] ZZ)')}
                          entryCount={number_of_entries}
                          // dateTime="November 11, 2019 8:57AM (UTC +08:00)"
                        />
                      </div>
                    ),
                  )
                }
              </TopCampaignContext.Consumer>
            </Card>
          </TopCampaignProvider>
        </div>
      </div>

      {/* --------------chart------------------- */}
      {snsType === 1 && (
        <Account
          theme={theme}
          intl={intl}
          dashboardPage={{ ...props.dashboardPage, loadBarStats }}
          userAccount={userAccount}
        />
      )}
      <Campaign
        theme={theme}
        intl={intl}
        dashboardPage={{ ...props.dashboardPage, loadStats, onSearchCampaign }}
        userAccount={userAccount}
      />
      {/* --------------chart------------------- */}
    </div>
  );
}

DashboardPage.propTypes = {
  userAccount: PropTypes.object,
  theme: PropTypes.any,
  onLoadData: PropTypes.any,
  onLoadBar: PropTypes.any,
  dashboardPage: PropTypes.any,
  onFetchCampaign: PropTypes.func,
  intl: intlShape,
};

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadData: data => dispatch(getStats(data)),
    onLoadBar: data => dispatch(getBarStats(data)),
    onFetchCampaign: data => dispatch(fetchCampaign(data)),
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
)(DashboardPage);
