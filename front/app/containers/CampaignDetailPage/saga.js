/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
import moment from 'moment';
import { takeLatest, call, put, delay } from 'redux-saga/effects';
import { NativeAPI, GraphqlAPI, Authorization } from 'utils/request';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { forwardTo } from 'helpers/forwardTo';
import { setData, setErrors } from './actions';
import {
  GET_WINNER_LIST,
  GET_CAMP_DETAILS,
  GET_TEMPLATE,
  GET_PRIZE_DISTRIBUTION,
  GENERATE_WINNER,
  SELECT_WINNER,
  CANCEL_WINNER,
  UPDATE_CLAIM_STATUS,
  DOWNLOAD_CSV,
  FORCE_END,
  SEND_DM,
  GET_STATS,
  ADD_POST_LINK,
  BACK_FILL,
  UPLOAD_CSV,
} from './constants';
import PATH from '../path';

// Individual exports for testing
export default function* campaignDetailPageSaga() {
  yield takeLatest(GET_STATS, getStats);
  yield takeLatest(GET_WINNER_LIST, getWinnerList);
  yield takeLatest(GET_CAMP_DETAILS, getCampDetails);
  yield takeLatest(GET_TEMPLATE, getTemplate);
  yield takeLatest(GENERATE_WINNER, generateWinner);
  yield takeLatest(SELECT_WINNER, selectWinner);
  yield takeLatest(CANCEL_WINNER, cancelWinner);
  yield takeLatest(UPDATE_CLAIM_STATUS, updateClaimStatus);
  yield takeLatest(DOWNLOAD_CSV, downloadCsv);
  yield takeLatest(FORCE_END, forceEnd);
  yield takeLatest(GET_PRIZE_DISTRIBUTION, getPrizeDistribution);
  yield takeLatest(SEND_DM, sendMessage);
  yield takeLatest(ADD_POST_LINK, addIGCampaignPostLink);
  yield takeLatest(BACK_FILL, backFill);
  yield takeLatest(UPLOAD_CSV, uploadCsv);
}

function* getStats({ data }) {
  const res = yield call(GetStatsQuery, data);
  if (res.success) {
    let grandTotalLikes = 0;
    let grandTotalEntries = 0;
    let grandTotalFollowers = 0;
    let grandTotalWinners = 0;
    let grandTotalExpected = 0;
    let grandTotalGainedFollowers = 0;
    let grandTotalUniqueEntries = 0;

    res.GetCampaignStatistics.map(m => {
      grandTotalLikes += Number(m.total_likes);
      grandTotalEntries += Number(m.number_of_entries);
      grandTotalFollowers += Number(m.total_followers);
      grandTotalWinners += Number(m.total_winner);
      grandTotalExpected += Number(m.total_expected_winner);
      grandTotalGainedFollowers += Number(m.gained_followers);
      grandTotalUniqueEntries += Number(m.total_participants);
    });
    yield put(
      setData('statTotals', {
        grandTotalLikes,
        grandTotalEntries,
        grandTotalFollowers,
        grandTotalWinners,
        grandTotalExpected,
        grandTotalGainedFollowers,
        grandTotalUniqueEntries,
      }),
    );
    yield put(setData('statistics', res.GetCampaignStatistics));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getLabels() {
  const res = yield call(labels);
  if (res.success) {
    yield put(setData('labelList', res.Labels));
    const campRes = yield call(GetCampaignList);
    if (campRes.success) {
      yield put(setData('campaignList', campRes.GetCampaignList));
    } else {
      yield put(setErrors(res.errors));
    }
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getWinnerList({ data, callDetail, ids, selectAllParticipants }) {
  const res = yield call(winnerList, data);
  if (res.success) {
    yield put(setData('isPageChanged', false));
    yield put(setData('winnerList', res.GetCampaignEntryList));
    yield put(
      setData(
        'winnerListCount',
        res.GetCampaignEntryList.pageInfo.totalRecords,
      ),
    );

    if (selectAllParticipants) {
      yield put(setData('ids', res.GetCampaignEntryList.list));
    } else if (ids && ids.length > 0) {
      yield put(setData('ids', ids));
    }

    if (data.initial) {
      yield put(
        setData(
          'winnerInitialListCount',
          res.GetCampaignEntryList.pageInfo.totalRecords,
        ),
      );
    }

    const tempList = yield call(templateList);
    yield put(setData('templateList', tempList.MessageTemplates.list));
    if (callDetail) {
      const genRes = yield call(campaignGenerateDetails, data.id);
      if (genRes.success) {
        const { list } = genRes.GetCampaignGenerateDetail;
        if (list.length > 0) {
          const winnerTotal = list
            .map(prize => prize.winner_total)
            .reduce((sum, prize) => sum + prize);
          const winnerCount = list
            .map(prize => prize.winner_count)
            .reduce((sum, prize) => sum + prize);
          const total = winnerTotal - winnerCount;

          yield put(setData('remainingWinners', winnerTotal));
          yield put(setData('cancelledWinner', total > 0 ? total : 0));
        }
      }
    }
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getPrizeDistribution({ data }) {
  const res = yield call(campaignDetails, data.id, data.snsId);
  if (res.success) {
    const { campaign_prize } = res.GetCampaignDetail;
    yield* raffleSched(campaign_prize);
    yield* iterateCampPrize({ campaign_prize });
  } else {
    yield put(setErrors(res.errors));
  }
}

function* raffleSched(campaign_prize) {
  let sortedArr = [];
  const newCampPrize = [];
  // Re structure array object
  sortedArr = campaign_prize.map(m =>
    m.raffle_schedule.map(mm => ({ ...mm, name: m.name })),
  );

  // Sorted by Date in Asc
  sortedArr = sortedArr.flat().sort((a, b) => new Date(a.id) - new Date(b.id));

  for (let i = 0; i < sortedArr.length; i += 1) {
    const campFiltered = newCampPrize.filter(
      f => f.raffle_schedule === sortedArr[i].raffle_schedule,
    );
    if (campFiltered.length === 0) {
      const filteredArr = sortedArr.filter(
        f => f.raffle_schedule === sortedArr[i].raffle_schedule,
      );
      if (filteredArr) {
        const subItem = {};
        subItem.raffle_schedule = sortedArr[i].raffle_schedule;

        filteredArr.map(m => {
          subItem[`${m.name}`] = {
            set: m.winner_total || 0,
            claim: m.claimed_count || 0,
            form: m.winner_count || 0,
          };
        });
        newCampPrize.push(subItem);
      }
    }
  }
  yield put(setData('newCampPrize', newCampPrize));
}

function* getCampDetails({ data }) {
  const res = yield call(campaignDetails, data.id, data.snsId);
  if (res.success) {
    if (res.GetCampaignDetail == null) {
      yield call(forwardTo, PATH.PAGE404);
    } else {
      yield* getStats({
        data: {
          snsId: res.GetCampaignDetail.sns_account_id,
          campaignId: [data.id],
        },
      });
      yield* getLabels();

      // eslint-disable-next-line camelcase
      const {
        raffle_type,
        campaign_prize,
        sns_post_media_path,
      } = res.GetCampaignDetail;

      res.GetCampaignDetail.sns_post_media_path = sns_post_media_path
        ? sns_post_media_path.map(mm => mm.url)
        : null;
      yield* raffleSched(campaign_prize);
      const {
        closestPrize,
        totalCurrRaffleWinners,
        totalAllExpectedWinners,
      } = yield* iterateCampPrize({ raffle_type, campaign_prize }, true);
      res.GetCampaignDetail.closestPrize = closestPrize;

      res.GetCampaignDetail.forceStopRemWinners =
        res.GetCampaignDetail.raffle_type !== Number(EnumRaffleTypes.FIXED)
          ? totalAllExpectedWinners
          : totalCurrRaffleWinners;
      yield put(setData('campDetails', res.GetCampaignDetail));
    }
  } else if (res.errorCode !== 'undefined' || res.errors.length > 0) {
    yield call(forwardTo, PATH.PAGE404);
  } else {
    yield put(setErrors(res.errors));
  }

  const forms = yield call(templateForms);
  if (forms.success) {
    const { list } = forms.TemplateForms;
    yield put(setData('formTemplates', list));
  }
}

function* iterateCampPrize(list, isDetail = false) {
  let totalAllExpectedWinners = 0;
  let totalWins = 0;
  let closestPrize = [];
  let closestRaffle = '';
  let totalCurrRaffleWinners = 0;
  const listOfPrizes = [];
  const today = new Date();

  list.campaign_prize.map(m => {
    listOfPrizes.push(m.name);
    m.raffle_schedule.map(mm => {
      if (isDetail && list.raffle_type === Number(EnumRaffleTypes.FIXED)) {
        const sched = new Date(
          moment(mm.raffle_schedule, 'MMM/DD/YYYY hh:mm A').format(
            'MM/DD/YYYY hh:mm A',
          ),
        );
        const currSched = { ...m };
        currSched.raffle_schedule = [mm];
        if (closestPrize.length === 0 && today < sched) {
          closestPrize.push(currSched);
          closestRaffle = sched;
          totalCurrRaffleWinners = Number(mm.winner_total);
        } else if (closestRaffle > sched) {
          closestPrize = [currSched];
          closestRaffle = sched;
          totalCurrRaffleWinners = Number(mm.winner_total);
        } else if (
          closestRaffle !== '' &&
          closestRaffle.getTime() === sched.getTime()
        ) {
          const findRes = closestPrize.find(f => f.id === m.id);
          // const findRes = closestPrize.find(f => f.raffle_schedule.find(ff => ff.id === mm.id));
          if (findRes) {
            findRes.raffle_schedule.push(mm);
          } else {
            closestPrize.push(currSched);
          }
          totalCurrRaffleWinners += Number(mm.winner_total);
        }
      }
      totalWins += Number(mm.winner_count);
      totalAllExpectedWinners += Number(mm.winner_total);
    });
  });
  yield put(setData('listOfPrizes', listOfPrizes));
  if (isDetail) {
    // if (list.raffle_type === Number(EnumRaffleTypes.FIXED)) {
    //   yield put(
    //     setData(
    //       'cancelledWinner',
    //       Math.abs(totalCurrRaffleWinners - totalWins),
    //     ),
    //   );
    //   yield put(setData('remainingWinners', totalCurrRaffleWinners));
    // }
    yield put(setData('totalExpectedWinners', totalAllExpectedWinners));
    yield put(setData('totalGeneratedWinners', totalWins));
  }

  return { closestPrize, totalCurrRaffleWinners, totalAllExpectedWinners };
}

function* getTemplate({ id }) {
  if (id) {
    const res = yield call(msgTemplateById, id);
    if (res.success && res.MessageTemplateById) {
      yield put(setData('tempDetails', res.MessageTemplateById));
      modalToggler('modalTemplatePreview');
    } else {
      yield put(setErrors(res.errors));
    }
  }
}

function* generateWinner({ data }) {
  const res = yield call(generateNewWinner, data);
  if (res.success) {
    yield* getCampDetails({ data: { id: data.id, snsId: data.snsId } });
    yield put(setData('tab', 4));
    if (!data.forceStop) {
      modalToggler('successClaim');
      yield* getWinnerList({
        data: { id: data.id, page: 1 },
        callDetail: true,
      });
    }
  } else {
    yield put(setErrors(res.errors));
  }
}

function* selectWinner({ data, dataEntries }) {
  const res = yield call(selectedWinner, data);
  if (res.success) {
    yield* getCampDetails({ data: { id: data.campaignId, snsId: data.snsId } });
    yield* getWinnerList({
      data: dataEntries,
      callDetail: true,
    });
    yield put(setData('ids', []));
    modalToggler('successClaim');
  } else {
    yield put(setErrors(res.errors));
  }
}

function* cancelWinner({ data }) {
  const res = yield call(cancelledWinner, data);
  if (!res.success) {
    yield put(setErrors(res.errors));
  }
  yield put(setData('ids', []));
}

function* updateClaimStatus({ data }) {
  const res = yield call(changeClaimStatus, data);
  if (res.success) {
    yield* getCampDetails({ data: { id: data.campaignId, snsId: data.snsId } });
    yield put(setData('ids', []));
    modalToggler('successClaim');
  } else {
    yield put(setErrors(res.errors));
  }
}

function* downloadCsv({ data }) {
  const res = yield call(downloadCampaignEntries, data);

  if (res) {
    const csvName = res.DownloadCampaignEntries.filename.replace('.csv', '');
    if (csvName && !data.downloadId) {
      const a = document.createElement('a');
      a.href = `${config.DOWNLOAD_CSV_URL}?filename=${encodeURIComponent(
        csvName,
      )}`;
      document.body.appendChild(a);
      a.click();
    }
  } else {
    yield put(setErrors(res.errors));
  }
}

function* forceEnd({ data, onSubmitted }) {
  yield put(setData('loading', true));
  const res = yield call(forceEndQuery, data);
  if (res.success) {
    yield put(setErrors(undefined));
    yield* getCampDetails({ data });
    yield put(setData('loading', false));
    yield put(setData('disabledFS', true));
    modalToggler('forceStop');
    modalToggler('successClaim');
  } else {
    yield put(setErrors(res.errors));
    yield call(onSubmitted, true);
    yield put(setData('loading', false));
  }
}

function* sendMessage({ data }) {
  let result;
  const { file } = data;
  if (file === null) {
    // Message template has no img/gif/vid
    result = yield call(NativeAPI, data, config.DM_ENTRY_USER);
  }
  if (file) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        return data[key].forEach(val => formData.append(`${key}[]`, val));
      }
      return formData.append(key, data[key]);
    });
    formData.delete('file'); // to replace file key with new key
    // Message template has gif
    if (file.type.includes('gif')) {
      formData.append('gif', file);
      result = yield call(NativeAPI, formData, config.DM_GIF_ENTRY_USER, true);
    }
    // Message template has img
    if (
      file.type.includes('jpeg') ||
      file.type.includes('jpg') ||
      file.type.includes('png')
    ) {
      formData.append('image', file);
      result = yield call(
        NativeAPI,
        formData,
        config.DM_PHOTO_ENTRY_USER,
        true,
      );
    }
    if (file.type.includes('video')) {
      formData.append('video', file);
      result = yield call(
        NativeAPI,
        formData,
        config.DM_VIDEO_ENTRY_USER,
        true,
      );
    }
  }
  if (result && result.success && !result.failed) {
    modalToggler('modalTemplatePreview');
    modalToggler('successClaim');
  } else if (result && result.success && result.failed) {
    yield put(setData('failedEntries', result.failed));
    modalToggler('modalTemplatePreview');
    modalToggler('failedEntry');
  } else if (result && result.errors) {
    yield put(setErrors(result.errors));
  } else {
    // eslint-disable-next-line no-console
    console.log('Not Found');
  }
}

function* backFill({ id }) {
  const data = {
    campaignId: id,
  };
  yield put(setData('backfill', 'processed'));
  yield delay(2500);
  modalToggler('successClaim');
  yield put(setData('backfill', 'init'));
  yield call(NativeAPI, data, config.BACK_FILL);
  // eslint-disable-next-line no-empty
}

function* uploadCsv({ data }) {
  const formData = new FormData();

  if (data.csvFile) {
    formData.append('csvFile', data.csvFile.value);
  }

  Object.keys(data).forEach(key => {
    if (key !== 'csvFile') {
      formData.append(key, data[key]);
    }
  });

  const result = yield call(
    NativeAPI,
    formData,
    config.UPLOAD_PARTICIPANT_ENTRY_CSV,
    true,
  );

  if (result && result.success) {
    yield* getCampDetails({ data: { id: data.campaignId, snsId: data.snsId } });
    yield put(setData('tab', 4));
    yield put(setData('ids', []));
    yield put(setData('csvFileUploaded', true));
    modalToggler('successClaim');
  } else {
    yield put(setData('csvFileUploaded', true));
    yield put(setErrors(result.errors));
    modalToggler('failedUploadCsv');
  }
}

// #region GRAPHQL QUERIES
function forceEndQuery({ id, password, generate }) {
  const query = {
    query: `mutation{
      ForceEndCampaign(forceEndCampaign: {
       campaign_id:${id},
       password: "${password}"
       expected_winner: ${generate.isGenerate ? generate.cancelledWinner : null}
     })

     }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function campaignDetails(id, snsId) {
  const query = {
    query: `query{
      GetCampaignDetail(campaignId:${id}, snsId:${snsId}){
        id
        title
        sns_account_id
        description
        label_id
        post_id
        start_period
        end_period
        campaign_type
        content
        target_hashtag
        raffle_type
        raffle_interval
        auto_raffle
        account_winning_limit
        winner_message_template { id, title }
        loser_message_template { id, title }
        ty_message_template { id, title }
        fc_message_template { id, title }
        template_form { id, title, name }
        post_winner_message_template {id, title}
        post_loser_message_template {id, title}
        post_ty_message_template {id, title}
        auto_send_dm
        form_fields
        form_design
        form_fields_schema { form_id, required }
        status
        total_retweet
        createdAt
        sns_post_content
        sns_post_media_path {
          id
          url
        }
        media_type
        start_follower_count
        entry_follower_count
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

function winnerList(data) {
  const query = {
    query: `query($id: Int!, $page: Int!, $start_period: String, $end_period: String, $prize_id: Int, $claim_status: Int, $entry_status: Int, $form_status: Int, $username: String, $followersSort: Sort, $followedSort: Sort, $entryDateSort: Sort, $fi_start_period: String, $fi_end_period: String){
      GetCampaignEntryList(campaignId:$id,
        campaignEntryFilter: {
          start_period: $start_period,
          end_period: $end_period,
          prize_id: $prize_id
          claim_status: $claim_status
          entry_status: $entry_status
          form_status: $form_status
          username: $username
          fi_start_period: $fi_start_period
          fi_end_period: $fi_end_period
        }
        orderByInput: {
          followers: $followersSort
          followed: $followedSort
          entryDate: $entryDateSort
        }
        pager: {
          page: $page
          maxRecord:10
      }){
        list{
          id
          sns_username
          followers_count
          sns_id
          sns_post_id
          prize_name
          entry_date
          createdAt
          updatedAt
          form_status
          claimed
          entry_status
          claim_coupon_link
          followed
          liked
          dm_count
          form_submission_date
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }
    `,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function labels() {
  const query = {
    query: `
    query{
      Labels(pager:{
        page:1,
        maxRecord: 20
      }){
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

function campaignGenerateDetails(id) {
  const query = {
    query: `query{
      GetCampaignGenerateDetail(campaignId:${id}){
        list {
          campaign_id
          campaign_prize_id
          name
          winner_total
          winner_count
          raffle_schedule
          completed
        }
      }
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function generateNewWinner({ id, count }) {
  const query = {
    query: `mutation{
      GenerateNewWinner(
        generateNewWinner:{
          campaign_id: ${id}
          winner_count: ${count}
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function selectedWinner({ ids, campaignId }) {
  const query = {
    query: `mutation{
      SelectWinner(
        selectWinner:{
          ids: [${ids}]
          campaign_id: ${campaignId}
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function cancelledWinner({ ids, campaignId }) {
  const query = {
    query: `mutation{
      CancelWinner(
        cancelWinner:{
          ids: [${ids}]
          campaign_id: ${campaignId}
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function changeClaimStatus({ ids, campaignId, claimStatus }) {
  const query = {
    query: `mutation{
      ChangeClaimStatus(
        changeClaimStatus:{
          ids: [${ids}]
          campaign_id: ${campaignId}
          claim_status: ${claimStatus}
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function downloadCampaignEntries(data) {
  const query = {
    query: `
    query($id: Int!, $start_period: String, $end_period: String, $prize_id: Int, $claim_status: Int, $entry_status: Int, $form_status: Int, $username: String, $sns_names: [String], $exclude_sns_names: [String], $followersSort: Sort, $followedSort: Sort, $entryDateSort: Sort, $fi_start_period: String, $fi_end_period: String, $downloadId: String){
      DownloadCampaignEntries(
        campaignId: $id
        campaignEntryFilter: {
          start_period: $start_period,
          end_period: $end_period,
          prize_id: $prize_id
          claim_status: $claim_status
          entry_status: $entry_status
          form_status: $form_status
          username: $username,
          sns_names: $sns_names,
          exclude_sns_names: $exclude_sns_names
          fi_start_period: $fi_start_period
          fi_end_period: $fi_end_period
        }
        orderByInput: {
          followers: $followersSort
          followed: $followedSort
          entryDate: $entryDateSort
        }
        downloadId: $downloadId
        ){
        filename
        isCsvCreated
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function templateForms() {
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
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function templateList() {
  const query = {
    query: `
    query{
      MessageTemplates(pager:{
        page:1,
        maxRecord:500
      }){
        list{
          id
          name
          type
          description
          category
          content
          message_file
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function GetCampaignList() {
  const query = {
    query: `
    query{
      GetCampaignList
      {
        list{
          id
          title
          }
        }
    }`,
  };

  return GraphqlAPI(query, Authorization);
}

function GetStatsQuery(data) {
  const filterBy = !data.dateStart && !data.dateEnd ? 0 : 2;
  const query = {
    query: `
    query($snsId: Int!, $campaignId: [Int!], $dateStart: String, $dateEnd: String){
      GetCampaignStatistics(
        campaignStatisticsFilter:{
        snsId: $snsId
        campaignId: $campaignId
        filter:{
          filterBy: ${filterBy}
          dateStart: $dateStart
          dateEnd: $dateEnd
        }
      }){

          number_of_entries
          total_followers
          total_likes
          total_winner
          total_expected_winner
          statistics_date
          total_participants
          gained_followers
      }
    }`,
    variables: {
      ...data,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function* addIGCampaignPostLink(payload) {
  const res = yield call(addIGCampaignPostLinkQuery, payload);
  if (res.success) {
    window.location.reload();
  } else {
    yield put(setErrors(res.errors));
  }
}

function addIGCampaignPostLinkQuery({ id, snsType }) {
  const postLink = document.getElementById('postLink').value;
  const query = {
    query: `mutation{
      AddCampaignPostLink(
        addCampaignPostLinkInput:{
          id: ${id}
          snsType: ${snsType}
          postLink: "${postLink}"
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}
// #endregion
