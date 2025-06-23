/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
import { takeLatest, call, put } from 'redux-saga/effects';
import { GraphqlAPI, Authorization } from 'utils/request';
import { setData, setErrors } from './actions';
import { GET_STATS, GET_BAR_STATS, FETCH_CAMPAIGN } from './constants';

// Individual exports for testing
export default function* dashboardPageSaga() {
  yield takeLatest(GET_STATS, getStats);
  yield takeLatest(GET_BAR_STATS, getStatsBar);
  yield takeLatest(FETCH_CAMPAIGN, fetchCampaign);
}

function* getStats({ data }) {
  const res = yield call(GetStatsQuery, data);
  if (res.success) {
    let grandTotalLikes = 0;
    let grandTotalEnries = 0;
    let grandTotalFollowers = 0;
    let grandTotalWinners = 0;
    let grandTotalExpected = 0;
    const list = res.GetCampaignStatistics;

    list.map(m => {
      grandTotalLikes += Number(m.total_likes);
      grandTotalEnries += Number(m.number_of_entries);
      grandTotalFollowers += Number(m.total_followers);
      grandTotalWinners += Number(m.total_winner);
      grandTotalExpected += Number(m.total_expected_winner);
    });
    yield put(
      setData('statTotals', {
        grandTotalLikes,
        grandTotalEnries,
        grandTotalFollowers,
        grandTotalWinners,
        grandTotalExpected,
      }),
    );
    yield put(setData('statistics', list));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getStatsBar({ data }) {
  const res = yield call(GetStatsQuery, data);
  if (res.success) {
    let list = res.GetCampaignStatistics;
    list = supplyValue(data, list);
    list.map((m, idx) => {
      m.gains = 0;
      m.loss = 0;
      m.percentage = 0;
      m.diff = 0;
      m.barFollower = m.total_followers;
      if (idx !== 0) {
        let before_val = list[idx - 1].total_followers;
        const diff = m.total_followers - before_val;
        const sign = Math.sign(diff);
        m.diff = diff;
        m.gains = sign === 1 || sign === 0 ? diff : 0;
        m.loss = sign === -1 ? diff : 0;
        m.barFollower =
          sign === 1 || sign === 0 ? before_val : m.total_followers;
        before_val = before_val === 0 ? 1 : before_val;
        m.percentage = diff !== 0 ? Math.round((diff / before_val) * 100) : 0;
      }
    });
    yield put(setData('barStatistics', list));
  } else {
    yield put(setErrors(res.errors));
  }
}

function supplyValue(data, res) {
  const list = res;
  const newList = [];
  if (Object.keys(data.filter).length > 0) {
    const { dateStart, dateEnd } = data.filter;
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    while (start.getTime() <= end.getTime()) {
      const newObj = {
        number_of_entries: 0,
        total_followers: 0,
        total_likes: 0,
        total_winner: 0,
        total_expected_winner: 0,
        statistics_date: '',
      };
      const find = list.find(
        f => new Date(f.statistics_date).getTime() === end.getTime(),
      );
      if (!find) {
        let dt = end.toDateString().split(' ');
        dt = `${dt[1]}-${dt[2]}-${dt[3]}`;
        newObj.statistics_date = dt;
        newList.unshift(newObj);
      } else {
        newList.unshift(find);
      }
      end.setDate(end.getDate() - 1);
    }
  }

  return newList;
}

function* fetchCampaign({ data }) {
  try {
    const response = yield call(GetCampaignList, data);
    const res = yield call(GetCampaignList);

    if (response.success) {
      yield put(setData('campaignList', response.GetCampaignList));
      yield put(setData('allcampaignList', res.GetCampaignList));
    } else {
      throw response.errors;
    }
  } catch (err) {
    yield put(setErrors(err));
  }
}

function GetStatsQuery(data) {
  const query = {
    query: `
    query($snsId: Int!, $campaignId: [Int!], $filter: CampaignStatisticsSearch){
      GetCampaignStatistics(
        campaignStatisticsFilter:{
        snsId: $snsId
        campaignId: $campaignId
        filter:$filter
      }){
        
          number_of_entries
          total_followers
          total_likes
          total_winner
          total_expected_winner
          statistics_date
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function GetCampaignList(data) {
  const query = {
    query: `
    query($title: String, $sns_account_id: Int){
      GetCampaignList(
        campaignRecordFilter: {
          title: $title,
          sns_account_id: $sns_account_id,
        }
        ){
        list{
          id
          title
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
