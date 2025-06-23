/* eslint-disable indent */
/* eslint-disable camelcase */
import { takeLatest, call, put, takeLeading } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { Authorization, GraphqlAPI, NativeAPI } from '../../utils/request';
import { FETCH_LABELS, FETCH_TEMPLATES, SUBMIT_CAMPAIGN } from './constants';
import {
  setLabels,
  setWinnerTemplates,
  setThankyouTemplates,
  setLoserTemplates,
  setForms,
  setErrors,
  setCampaignId,
  setFormCompleteTemplates,
  setCampaignList,
  setLoading,
} from './actions';

// Individual exports for testing
export default function* campaignPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_LABELS, fetchLabelList);
  yield takeLatest(FETCH_TEMPLATES, fetchTemplates);
  yield takeLeading(SUBMIT_CAMPAIGN, submitCampaign);
}

function* fetchLabelList() {
  const data = yield call(labels);
  if (data.success) {
    yield put(setLabels(data.Labels));
    const campRes = yield call(GetCampaignList);
    if (campRes.success) {
      campRes.GetCampaignList.list = campRes.GetCampaignList.list.filter(f =>
        [2, 4].includes(f.status),
      );
      yield put(setCampaignList(campRes.GetCampaignList));
    }
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* fetchTemplates({ state = {} }) {
  const data = yield call(messageTemplates);
  if (data.success) {
    const { formMessageTemplate } = state;
    const { list } = data.MessageTemplates;
    const winner = list.filter(template => Number(template.category) === 1);
    const loser = list.filter(template => Number(template.category) === 3);
    const thankyou = list.filter(template => Number(template.category) === 4);
    const formComplete = list.filter(
      template => Number(template.category) === 5,
    );
    yield put(setWinnerTemplates(winner));
    yield put(setThankyouTemplates(thankyou));
    yield put(setLoserTemplates(loser));
    yield put(setFormCompleteTemplates(formComplete));
    yield fetchForms(formMessageTemplate);

    setDefaultValues({ ...state, winner, loser, thankyou, formComplete });
  } else {
    // yield put(setErrors(data.errors));
  }
}

function setDefaultValues({
  postLoseTemplate,
  postTyTemplate,
  dmLoseTemplate,
  dmTyTemplate,
  loser,
  thankyou,
}) {
  postLoseTemplate.setvalue((loser.find(t => Number(t.type) === 2) || ['']).id);
  postTyTemplate.setvalue(
    (thankyou.find(t => Number(t.type) === 2) || ['']).id,
  );

  dmLoseTemplate.setvalue((loser.find(t => Number(t.type) === 1) || ['']).id);
  dmTyTemplate.setvalue((thankyou.find(t => Number(t.type) === 1) || ['']).id);
  dmTyTemplate.setvalue((thankyou.find(t => Number(t.type) === 1) || ['']).id);
}

function* fetchForms() {
  const data = yield call(templateForms);
  if (data.success) {
    const { list } = data.TemplateForms;
    yield put(setForms(list));
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* submitCampaign({ payload, saveOnly = false }) {
  yield put(setLoading(true));
  const data = yield call(createCampaign, payload);

  if (data.success) {
    // eslint-disable-next-line no-unused-vars
    const saveId = data.CreateCampaign;
    let isForm = true;
    const { tweetUploadFile } = payload;
    let formData = new FormData();
    formData.append('campaignId', saveId);
    formData.append('snsId', payload.snsId);
    formData.append('content', payload.pubishContent);
    formData.append('saveOnly', saveOnly);
    const endPoint = tweetUploadFile.setUploadImage(formData);
    if (endPoint === 'publish-campaign') {
      isForm = false;
      formData = {
        campaignId: saveId,
        snsId: payload.snsId,
        content: payload.pubishContent,
        saveOnly,
      };
    }
    const publishData = yield call(
      NativeAPI,
      formData,
      `api/${endPoint}`,
      isForm,
    );
    if (publishData.success) {
      yield put(setCampaignId(publishData[endPoint]));
      yield put(setLoading(false));
      if (!saveOnly) {
        modalToggler('publishSuccess');
      } else {
        modalToggler('saveSuccess');
      }
    } else {
      yield put(setErrors(publishData.errors));
      yield put(setLoading(false));
    }
  } else {
    yield put(setErrors(data.errors));
    yield put(setLoading(false));
  }
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

function messageTemplates() {
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

const optionInterval = { '1': 1, '6': 2, '12': 3, '24': 4 };
function createCampaign({
  title,
  description,
  label_id,
  startOnPublish,
  start_period,
  end_period,
  campaign_type,
  target_hashtag,
  raffle_type,
  raffle_interval,
  auto_raffle,
  fixed_prize,
  account_winning_limit,
  post_winner_message_template,
  post_loser_message_template,
  post_ty_message_template,
  winner_message_template,
  loser_message_template,
  ty_message_template,
  fc_message_template,
  template_form_id,
  form_fields,
  form_fields_required,
  campaign_prize,
  templateToggle,
  autoSendDM,
  winning_condition,
  entry_condition,
  snsId,
  saveOnly,
  post_tweet_via_camps,
  post_id,
  hashtag_condition,
}) {
  const {
    showPostWin,
    showPostLose,
    showPostTy,
    showDMLose,
    showDMTy,
    showDMForm,
  } = templateToggle;
  const tmp_form_fields = [];
  form_fields.forEach(element => {
    tmp_form_fields.push(`1${element}`);
  });
  const tmp_form_fields_schema = form_fields_required.map(f => `1${f}`);
  const form_fields_schema = tmp_form_fields.map(f => ({
    id: Number(f),
    required: tmp_form_fields_schema.includes(f),
  }));
  const query = {
    query: `
    mutation($winning_condition: WinnerConditionInput!, $entry_condition: [String], $form_fields_schema: [FormFieldSchemaInput]!){
      CreateCampaign(createCampaignInput:{
        post_id: "${post_id}"
        saveOnly: ${saveOnly || false}
        snsId:${snsId}
        title:"${title}"
        description:"""${description}"""
        label_id: ${label_id || null}
        startOnPublish: ${startOnPublish || false}
        start_period:${startOnPublish ? null : `"${start_period}"`}
        end_period:"${end_period}"
        campaign_type:${campaign_type}
        target_hashtag:"${target_hashtag.join(',')}"
        raffle_type:${raffle_type}
        raffle_interval:${optionInterval[raffle_interval] || null}
        auto_raffle: ${auto_raffle}
        account_winning_limit: ${
          campaign_type === '2' ? account_winning_limit || 1 : 1
        }
        post_winner_message_template: ${
          showPostWin ? post_winner_message_template : null
        }
        post_loser_message_template: ${
          showPostLose ? post_loser_message_template : null
        }
        post_ty_message_template: ${
          showPostTy ? post_ty_message_template : null
        }
        winner_message_template: ${winner_message_template}
        loser_message_template: ${showDMLose ? loser_message_template : null}
        ty_message_template: ${showDMTy ? ty_message_template : null}
        fc_message_template: ${showDMForm ? fc_message_template : null}
        template_form_id: ${template_form_id}
        form_fields: [${tmp_form_fields.join(',')}]
        form_fields_schema: $form_fields_schema
        auto_send_dm: ${autoSendDM === true ? autoSendDM : false}
        entry_condition: $entry_condition
        winning_condition : $winning_condition
        hashtag_entry_type: 2
        campaign_prize: [
          ${getCampaignPrizeScheme({
            raffle_type,
            fixed_prize,
            campaign_prize,
            end_period,
          })}
        ]
        post_tweet_via_camps: ${post_tweet_via_camps || false}
        hashtag_condition : ${hashtag_condition}
      })
    }`,
    variables: {
      winning_condition,
      entry_condition,
      form_fields_schema,
    },
  };
  return GraphqlAPI(query, Authorization);
}

function getCampaignPrizeScheme({
  raffle_type,
  campaign_prize,
  end_period,
  fixed_prize,
}) {
  if (raffle_type === '3') {
    return fixed_prize
      .map(({ schedule, prizeInfo }) =>
        prizeInfo
          .filter(d => Number(d.amount))
          .map(
            d => `{
            name: "${d.name.trim()}"
            winner_total: ${d.amount}
            winning_percentage: null
            raffle_schedule: "${schedule.toApi}"
            }`,
          )
          .join(','),
      )
      .filter(s => s)
      .join(',');
  }

  return campaign_prize
    .map(
      ({ name, amount, percentage }) => `{
        name: "${name.trim()}"
        winner_total: ${amount}
        winning_percentage: ${percentage || null}
        raffle_schedule: "${end_period}"
        }`,
    )
    .join(',');
}

function GetCampaignList() {
  const query = {
    query: `
    query{
      GetCampaignList{
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
