/* eslint-disable camelcase */
import { takeLatest, call, put } from 'redux-saga/effects';
import { NativeAPI, GraphqlAPI, Authorization } from 'utils/request';
import { config } from 'utils/config';
import { modalToggler } from 'utils/commonHelper';
import { setData, setErrors } from './actions';
import {
  GET_PART_DETAILS,
  GENERATE_WINNER,
  SELECT_WINNER,
  CANCEL_WINNER,
  SEND_MESSAGE,
  UPDATE_CLAIM_STATUS,
  UPDATE_WINNER_INFO,
} from './constants';

// Individual exports for testing
export default function* participantDetailPageSaga() {
  yield takeLatest(GET_PART_DETAILS, getPartDetails);
  yield takeLatest(GENERATE_WINNER, generateWinner);
  yield takeLatest(SELECT_WINNER, selectWinner);
  yield takeLatest(CANCEL_WINNER, cancelWinner);
  yield takeLatest(SEND_MESSAGE, sendMessage);
  yield takeLatest(UPDATE_CLAIM_STATUS, updateClaimStatus);
  yield takeLatest(UPDATE_WINNER_INFO, updateWinnerInfo);
}

function* getPartDetails({ data }) {
  const res = yield call(participantDetails, data.entryId);
  const genRes = yield call(campaignGenerateDetails, data.campaignId);
  if (res.success) {
    yield put(setData('partDetails', res.GetCampaignEntryDetailById));
    const getCampDetails = yield call(campDetails, data.campaignId, data.snsId);
    yield put(setData('campDetails', getCampDetails.GetCampaignDetail));
    yield put(setData('snsAccountId', data.snsId));
    const getEntryList = yield call(entryList, {
      id: data.campaignId,
      snsId: res.GetCampaignEntryDetailById.sns_id,
    });
    yield put(setData('entryList', getEntryList.GetHashtagEntryList.list));

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

        yield put(setData('cancelledWinner', total));
      }
    }
    const tempList = yield call(templateList);
    yield put(setData('templateList', tempList.MessageTemplates.list));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* generateWinner({ data }) {
  const res = yield call(generateNewWinner, data);
  if (res.success) {
    modalToggler('successClaim');
  } else {
    yield put(setErrors(res.errors));
  }
}

function* selectWinner({ data }) {
  const res = yield call(selectedWinner, data);
  if (res.success) {
    yield call(getPartDetails, {
      data: {
        entryId: data.ids,
        campaignId: data.campaignId,
        snsId: data.snsId,
      },
    });
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
      formData.append(key, data[key]);
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

  if (result.success) {
    modalToggler('successClaim');
  } else {
    yield put(setErrors(result.errors));
  }
}

function* updateClaimStatus({ data }) {
  const res = yield call(changeClaimStatus, data);
  if (res.success) {
    yield call(getPartDetails, {
      data: {
        entryId: data.ids,
        campaignId: data.campaignId,
        snsId: data.snsId,
      },
    });
    modalToggler('successClaim');
  } else {
    yield put(setErrors(res.errors));
  }
}

function* updateWinnerInfo({ data }) {
  const res = yield call(changeWinnerInfo, data);
  if (res.success) {
    yield put(setData('isEdit', false));
    yield call(getPartDetails, {
      data: {
        entryId: data.entryId,
        campaignId: data.campaignId,
        snsId: data.snsId,
      },
    });
  } else {
    yield put(setErrors(res.errors));
  }
}

// #region GRAPHQL QUERIES
function participantDetails(id) {
  const query = {
    query: `query{
      GetCampaignEntryDetailById(campaignEntryId:${id}){
        id
        winner_info_Id
        sns_username
        sns_id
        prize_name
        entry_date
        createdAt
        updatedAt
        form_status
        claimed
        email
        full_name
        contact_no
        zip_code
        state
        city
        street
        building
        form_input
        followers_count
        winner_date
        form_submission_date
        form_latest_update
        entry_status
        dm_sent_date
        winner
        winner_message_id
        claim_coupon_link
        sns_post_id
        followed
        liked
        winner_message_template
        dm_logs{
          error
          message
          media_url
          media_id
          dmDate
          isPending
        }
        nickname
        signature
        following_count
        video_count
        like_count
        verified
      }
    }
    `,
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
          user_id
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
          ids: ${ids}
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
          ids: ${ids}
          campaign_id: ${campaignId}
        }
      )
    }
    `,
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

function campDetails(id, snsId) {
  const query = {
    query: `query{
      GetCampaignDetail(campaignId:${id}, snsId:${snsId}){
        form_fields
        form_design
        form_fields_schema { form_id, required }
        campaign_type
        raffle_type
        status
        campaign_prize {
          name
          raffle_schedule {
            id
            winner_total
            raffle_schedule
            winner_count
            claimed_count
          }
        }
      }
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
          ids: ${ids}
          campaign_id: ${campaignId}
          claim_status: ${claimStatus}
        }
      )
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}

function changeWinnerInfo({ id, form_input }) {
  const formInput =
    `personal_name:${form_input.personal_name ||
      null}|personal_email:${form_input.personal_email || null}` +
    `personal_email:${form_input.personal_email ||
      null}|personal_name:${form_input.personal_name || null}` +
    `|personal_phone:${form_input.personal_phone ||
      null}|personal_zip_code:${form_input.personal_zip_code ||
      null}|personal_prefecture:${form_input.personal_prefecture}` +
    `|personal_address1:${form_input.personal_address1 ||
      null}|personal_address2:${form_input.personal_address2 ||
      null}|personal_address3:${form_input.personal_address3}` +
    `${
      form_input.personal_notes
        ? `|personal_notes:${form_input.personal_notes || null}`
        : ''
    }` +
    `|thankful1_name:${form_input.thankful1_name ||
      null}|thankful1_email:${form_input.thankful1_email || null}` +
    `|thankful1_phone:${form_input.thankful1_phone ||
      null}|thankful1_zip_code:${form_input.thankful1_zip_code ||
      null}|thankful1_prefecture:${form_input.thankful1_prefecture}` +
    `|thankful1_address1:${form_input.thankful1_address1 ||
      null}|thankful1_address2:${form_input.thankful1_address2 ||
      null}|thankful1_address3:${form_input.thankful1_address3}` +
    `|thankful2_name:${form_input.thankful2_name ||
      null}|thankful2_email:${form_input.thankful2_name || null}` +
    `|thankful2_phone:${form_input.thankful2_phone ||
      null}|thankful2_zip_code:${form_input.thankful2_zip_code ||
      null}|thankful2_prefecture:${form_input.thankful2_prefecture}` +
    `|thankful2_address1:${form_input.thankful2_address1 ||
      null}|thankful2_address2:${form_input.thankful2_address2 ||
      null}|thankful2_address3:${form_input.thankful2_address3 || null}`;

  const query = {
    query: `mutation($form_input: String){
      SubmitUpdateWinnerInfo(
        updateWinnerInfoInput:{
          id: ${id}
          form_input: $form_input
        }
      )
    }
    `,
    variables: {
      form_input: formInput,
    },
  };

  return GraphqlAPI(query, Authorization);
}

function entryList({ id, snsId }) {
  const query = {
    query: `query{
      GetHashtagEntryList(
        hashtagEntryFilter:{
          snsId: "${snsId}"
        },
        campaignId: ${id}
      ){
        list {
          id
          sns_id
          campaign_id
          sns_post_id
          entry_date
          liked
          share_count
          comment_count
          play_count
          description
        }
      }
    }
    `,
  };

  return GraphqlAPI(query, Authorization);
}
// #endregion
