/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import moment from 'moment';
import { GraphqlAPI, Authorization } from '../../../utils/request';

const topCampaignQuery = ({ snsId, campaignType, startPeriod, endPeriod }) => ({
  query: `
  query{
    GetTopCampaignList(pager: {
     page:1
     maxRecord:3
   }, topCampaignRecordFilter: {
     sns_account_id: ${snsId}
     campaign_type: ${campaignType}
     start_period: ${
       startPeriod ? `"${moment(startPeriod).format('MM/DD/YYYY')}"` : null
     }
     end_period: ${
       endPeriod ? `"${moment(endPeriod).format('MM/DD/YYYY')}"` : null
     }
   }){
   list{
     id
     title
     description
     sns_post_content
     sns_post_media_path {
       id
       url
     }
     number_of_entries
     total_followers
     total_replies
     total_likes
     total_retweet
     total_winner
     total_claimed
     total_form_submitted
     start_period
     end_period
   }
     pageInfo{
       totalPage
       currentPage
       totalRecords
     }
    }
   }`,
});

export const TopCampaignContext = createContext({
  list: [],
});

const TopCampaignProvider = ({
  snsId,
  campaignType,
  startPeriod,
  endPeriod,
  children,
}) => {
  const [list, setList] = useState([]);

  const fetchTopCampaigns = async () => {
    const { success, GetTopCampaignList } = await GraphqlAPI(
      topCampaignQuery({ snsId, campaignType, startPeriod, endPeriod }),
      Authorization,
    );
    if (success && GetTopCampaignList) {
      // eslint-disable-next-line array-callback-return
      GetTopCampaignList.list.map(m => {
        // eslint-disable-next-line no-param-reassign
        m.sns_post_media_path = m.sns_post_media_path
          ? m.sns_post_media_path.map(mm => mm.url)
          : null;
      });
      setList(GetTopCampaignList.list);
    }
  };

  useEffect(() => {
    fetchTopCampaigns();
  }, [snsId, startPeriod, endPeriod]);

  return (
    <TopCampaignContext.Provider value={{ list }}>
      {children}
    </TopCampaignContext.Provider>
  );
};

export default TopCampaignProvider;
