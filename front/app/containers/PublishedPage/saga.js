import { takeLatest, call, put } from 'redux-saga/effects';
import { GraphqlAPI, Authorization } from '../../utils/request';
import { setCampaignList, setError, setData } from './actions';
import { FETCH_CAMPAIGN } from './constants';
// Individual exports for testing
export default function* publishedPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_CAMPAIGN, fetchCampaign);
}

function* fetchCampaign({ data }) {
  try {
    const response = yield call(GetCampaignList, data);
    const labels = yield call(GetLabels);

    if (labels.success) {
      yield put(setData('labelList', labels.Labels));
    } else {
      throw labels.errors;
    }

    if (response.success) {
      yield put(setCampaignList(response.GetCampaignList));
    } else {
      throw response.errors;
    }
  } catch (err) {
    yield put(setError(err));
  }
}

// #region GRAPHQL QUERIES
function GetCampaignList(data) {
  const x =
    data.campaign_status !== null
      ? `campaign_status: ${data.campaign_status}`
      : '';
  const query = {
    query: `
    query(
      $title: String,
      $start_period: String,
      $end_period: String,
      $campaign_type: Int,
      $label_id: Int,
      $raffle_type: Int,
      $sns_account_id: Int,
      $page: Int!,
    ){
      GetCampaignList(
        campaignRecordFilter: {
          title: $title,
          sns_account_id: $sns_account_id,
          start_period: $start_period,
          end_period: $end_period,
          campaign_type: $campaign_type,
          label_id: $label_id,
          raffle_type: $raffle_type
          ${x}
        },
        pager:{
        page:$page
        maxRecord:10
      }){
        list{
          id
          title
          label_id
          start_period
          end_period
          campaign_type
          target_hashtag
          raffle_type
          raffle_interval
          account_winning_limit
          form_fields
          status
          createdAt
          campaign_prize{
            id
            name
            raffle_schedule{
              id
              winner_total
              raffle_schedule
            }
          }
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function GetLabels(data) {
  const query = {
    query: `
    query{
      Labels{
        list{
          id
        name
        color_code
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

// #endregion
