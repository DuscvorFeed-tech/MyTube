import { takeLatest, call, put } from 'redux-saga/effects';
import { GraphqlAPI, Authorization } from '../../utils/request';
import { setError, setData } from './actions';
import { FETCH_CAMPAIGN } from './constants';

// Individual exports for testing
export default function* schedulePageSaga() {
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
      yield put(setData('campaignList', response.GetCampaignList));
    } else {
      throw response.errors;
    }
  } catch (err) {
    yield put(setError(err));
  }
}

// #region GRAPHQL QUERIES
function GetCampaignList(data) {
  const query = {
    query: `
    query($title: String, $start_period: String, $end_period: String, $label_id: Int, $campaign_status: Int, $sns_account_id: Int){
      GetCampaignList(
        campaignRecordFilter: {
          title: $title,
          start_period: $start_period,
          end_period: $end_period,
          label_id: $label_id
          campaign_status: $campaign_status
          sns_account_id: $sns_account_id
        }){
        list{
          id
          title
          label_id
          start_period
          end_period
          status
          createdAt
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
