/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import { takeLatest, call, put, takeLeading, select } from 'redux-saga/effects';
import { GraphqlAPI, Authorization, NativeAPI } from 'utils/request';
import { modalToggler } from 'utils/commonHelper';
import { forwardTo } from 'helpers/forwardTo';
import { setData, setErrors } from './actions';
import {
  GET_WINNER_LIST,
  GET_CAMP_DETAILS,
  GET_TEMPLATE,
  UPDATE_CAMPAIGN,
} from './constants';
import PATH from '../path';
import makeSelectEditCampaignPage from './selectors';

// Individual exports for testing
export default function* createCampaignPageSaga() {
  yield takeLatest(GET_WINNER_LIST, getWinnerList);
  yield takeLatest(GET_CAMP_DETAILS, getCampDetails);
  yield takeLatest(GET_TEMPLATE, getTemplate);
  yield takeLeading(UPDATE_CAMPAIGN, updateCampaign);
}

function* updateCampaign({ payload, btnType, modal }) {
  const tmp_form_fields = []
  payload.form_fields.filter(s=> payload.filterFormFields(s)).forEach(element => {
    tmp_form_fields.push(`1${element}`)
  });
  payload.form_fields2.forEach(element => {
    tmp_form_fields.push(`2${element}`)
  });
  payload.form_fields3.forEach(element => {
    tmp_form_fields.push(`3${element}`)
  });
  payload.form_fields = tmp_form_fields.map(Number);

  const tmp_form_fields_schema = payload.form_fields_required.map(String);
  payload.form_fields_schema = tmp_form_fields.map(f => ({
    id: Number(f),
    required: tmp_form_fields_schema.includes(f),
  }));
  
  payload.auto_send_dm = payload.auto_send_dm===true;

  const { tweetUploadFile } = payload;
  let isForm = true;
  let formData = new FormData();
  payload.campaign_prize = getCampaignPrizeScheme(payload);
  payload.updateAction = btnType;
  const endPoint = tweetUploadFile.setUploadImage(formData);
  if (endPoint === 'modify-campaign') {
    isForm = false;
    formData = payload;
  }
  else {
    formData.append('updateCampaignInput', JSON.stringify(payload));
  }
  const res = yield call(
    NativeAPI,
    formData,
    `api/${endPoint}`,
    isForm,
  );
  if (res.success) {
    modalToggler(modal);
  } else {
    yield put(setErrors(res.errors));
  }
}

function getCampaignPrizeScheme({
  raffle_type,
  campaign_prize,
  end_period,
  fixed_prize,
  isSavedSched,
}) {
  const arr = [];
  if (Number(raffle_type) === 3) {
    const cids = campaign_prize.map(s => s.id);
    fixed_prize
      .map(({ schedule, prizeInfo }, index) =>
        prizeInfo
          .filter(d => Number(d.amount))
          .map(
            d => {
              arr.push({
                id: !isSavedSched ? d.id || cids[index] || null : null,
                name: d.name.trim(),
                winner_total: d.amount,
                winning_percentage: null,
                raffle_schedule: schedule.toApi,
                raffle_schedule_id: d.raffle_schedule_id
              })
            }
          )
      )
      .filter(s => s);

    return arr;
  }
  campaign_prize
    .map(
      ({ id, name, amount, raffle_schedule_id }) => {
        arr.push({
          id: !isSavedSched ? id : null,
          name: name.trim(),
          winner_total: amount,
          winning_percentage: null,
          raffle_schedule: end_period,
          raffle_schedule_id: raffle_schedule_id ? raffle_schedule_id[0] : null,
        })
      }
    )
  return arr;
}

function* getLabels(id) {
  const res = yield call(labels);
  if (res.success) {
    yield put(setData('labelList', res.Labels));
    const campRes = yield call(GetCampaignList, id);
    if (campRes.success) {
      campRes.GetCampaignList.list = campRes.GetCampaignList.list.filter(f => [2, 4].includes(f.status));
      yield put(setData('campaignList', campRes.GetCampaignList));
    }
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getWinnerList({ data }) {
  const res = yield call(winnerList, data);
  if (res.success) {
    yield put(setData('winnerList', res.GetCampaignEntryList));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getWinnerAlreadyGenerated(id) {
  const res = yield call(winnerAlreadyGenerated, id);
  if (res.success) {
    yield put(setData('winnerAlreadyGenerated', res.GetWinnerAlreadyGenerated));
  } else {
    yield put(setErrors(res.errors));
  }
}

function getKeyDex() {
  return Math.floor(Math.random() * 900) + 100;
};

function* getCampDetails({ data }) {
  const res = yield call(campaignDetails, data.id, data.snsId);
  if (res.success) {

    if (res.GetCampaignDetail === null) {
      yield call(forwardTo, PATH.PAGE404);
    }

    const details = res.GetCampaignDetail;

    //  Check if campaign is sub campaign
    if(details.is_sub_campaign === 1){
      yield call(forwardTo, PATH.PAGE404);
    }

    yield* getStats({
      data: {
        snsId: details.sns_account_id,
        campaignId: [Number(data.id)],
      },
    });

    const { statTotals } = yield select(makeSelectEditCampaignPage())

    const { campaign_prize } = res.GetCampaignDetail;
    const prizeMgmt = [];
    const isSaveAmount  = [5].includes(Number(details.status)) ? 1 : 0;
    const isAmtDisabled = details.raffle_type === Number(EnumRaffleTypes.FIXED) ||
    (details.raffle_type === Number(EnumRaffleTypes.END) && (statTotals && statTotals.grandTotalWinners));

    campaign_prize.map(m => {
      let winner_total = 0;
      let validMinAmount = 0;

      m.raffle_schedule.map(mm => {
        winner_total += Number(mm.winner_total);
      });

      if(details.raffle_type === Number(EnumRaffleTypes.END)) {
        if([0, 1, 2].includes(Number(details.status)) && (!statTotals || !statTotals.grandTotalWinners)) {
          validMinAmount = 1;
        }
      }

      prizeMgmt.push({
        id: m.id,
        name: m.name,
        percentage: m.winning_percentage,
        amount: winner_total,
        origAmnt: isSaveAmount || winner_total,
        validMinAmount,
        isAmtDisabled,
        keydex: getKeyDex(),
        raffle_schedule_id: m.raffle_schedule.map(p => p.id),
      });
    });

    let sortedArr = [];
    // Re structure array object
    sortedArr = campaign_prize.map(m =>
      m.raffle_schedule.map(mm => ({ ...mm, name: m.name })),
    );

    // Sorted by Date in Asc
    sortedArr = sortedArr
      .flat()
      .sort(
        (a, b) => new Date(a.raffle_schedule) - new Date(b.raffle_schedule),
      );
    details.origRaffleDates = sortedArr;
    details.prizeMgmt = prizeMgmt;
    yield put(setData('campDetails', details));
    yield* getLabels(data.snsId);
    yield* getTemplates();
    yield* getForms();
    yield* getWinnerAlreadyGenerated(data.id);
    yield put(setData('loading', false));
  } else {
    yield put(setErrors(res.errors));
    yield put(setData('loading', false));
  }
}

function* getTemplates() {
  const res = yield call(getTemplateList);
  if (res.success) {
    const { list } = res.MessageTemplates;
    const win = list.filter(f => Number(f.category) === 1);
    const lose = list.filter(f => Number(f.category) === 3);
    const ty = list.filter(f => Number(f.category) === 4);
    const fc = list.filter(f => Number(f.category) === 5);

    yield put(setData('winTempList', win));
    yield put(setData('loseTempList', lose));
    yield put(setData('tyTempList', ty));
    yield put(setData('formCompTempList', fc));
  } else {
    yield put(setErrors(res.errors));
  }
}
function* getForms() {
  const res = yield call(getFormList);
  if (res.success) {
    yield put(setData('formList', res.TemplateForms.list));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getTemplate({ id, isPost }) {
  if (id) {
    const res = yield call(msgTemplateById, id);
    if (res.success && res.MessageTemplateById) {
      yield put(setData('tempDetails', res.MessageTemplateById));
      if (isPost) {
        modalToggler('postPreviewModal');
      } else {
        modalToggler('previewTemplateModal');
      }
    } else {
      yield put(setErrors(res.errors));
    }
  }
}

function* getStats({ data }) {
  const res = yield call(GetStatsQuery, data);
  if (res.success) {
    let grandTotalWinners = 0;

    res.GetCampaignStatistics.map(m => {
      grandTotalWinners += Number(m.total_winner);
    });
    yield put(
      setData('statTotals', {
        grandTotalWinners,
      }),
    );
    yield put(setData('statistics', res.GetCampaignStatistics));
  }
}

// #region GRAPHQL QUERIES
function campaignDetails(id, snsId) {
  const query = {
    query: `query{
      GetCampaignDetail(campaignId:${id}, snsId:${snsId}){
        id
        title
        hashtag_entry_type
        description
        label_id
        post_id
        start_period
        end_period
        campaign_type
        target_hashtag
        raffle_type
        raffle_interval
        auto_raffle
        account_winning_limit
        form_fields
        form_design
        form_fields_schema { form_id, required }
        media_type
        winner_message_template {
          id
          title
        }
        loser_message_template {
          id
          title
        }
        ty_message_template {
          id
          title
        }
        fc_message_template {
          id
          title
        }
        post_winner_message_template {
          id
          title
        }
        post_loser_message_template {
          id
          title
        }
        post_ty_message_template {
          id
          title
        }
        template_form {
          id
          title
        }
        status
        createdAt
        sns_post_content
        sns_post_media_path {
          id
          url
        }
        start_follower_count
        sns_account_id
        auto_send_dm
        prevent_previous_winner_type
        prevent_previous_from
        prevent_previous_to
        prevent_previous_campaigns
        entry_condition_followers
        winning_condition {
          winner_condition_type
          follower_condition {
            follower_count
            increase_percentage
          }
        }
        campaign_prize {
          id
          name
          winning_percentage
          raffle_schedule {
            id
            winner_total
            raffle_schedule
            winner_count
            claimed_count
          }
        }
        post_tweet_via_camps
        fake_post
        hashtag_condition
        is_sub_campaign
      }
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function winnerList({ id, page }) {
  const query = {
    query: `query{
      GetCampaignEntryList(campaignId:${id},
        pager: {
          page: ${page}
          maxRecord:10
      }){
        list{
          id
          sns_username
          prize_name
          entry_date
          createdAt
          updatedAt
          form_status
          claimed
          winner
          followed
          liked
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function labels() {
  const query = {
    query: `
    query{
      Labels{
        list{
          id
        name
        color_code
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function msgTemplateById(id) {
  const query = {
    query: `
    query{
      MessageTemplateById(id:${id}){
          id
          name
          type
          description
          category
          content
          message_file
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function getTemplateList() {
  const query = {
    query: `
    query{
      MessageTemplates{
        list{
          id
          name
          type
          description
          header
          content
          footer
          createdAt
          category
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function getFormList() {
  const query = {
    query: `
    query{
      TemplateForms{
        list{
          id
          name
          title
          description
          content
          footer
          imageHeader
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function GetCampaignList(id) {
  const query = {
    query: `
    query{
      GetCampaignList(campaignRecordFilter : { sns_account_id : ${id}})
      {
        list{
          id
          title
          status
          }
        }
    }`,
  };

  return GraphqlAPI(query, Authorization);
}

function winnerAlreadyGenerated(id) {
  const query = {
    query: `
    query{
      GetWinnerAlreadyGenerated(campaignId: ${id}){
          status
      }
    }`,
  };
  // return GraphqlAPI(query, Authorization);

  // const query = {
  //   query: `
  //   query{
  //     Labels{
  //       list{
  //         id
  //       name
  //       color_code
  //       }
  //     }
  //   }`,
  // };
  return GraphqlAPI(query, Authorization);

}

function GetStatsQuery(data) {
  const query = {
    query: `
    query($snsId: Int!, $campaignId: [Int!], $dateStart: String, $dateEnd: String){
      GetCampaignStatistics(
        campaignStatisticsFilter:{
        snsId: $snsId
        campaignId: $campaignId
        filter:{
          filterBy: 0
          dateStart: $dateStart
          dateEnd: $dateEnd
        }
      }){
          total_winner
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

// #endregion
