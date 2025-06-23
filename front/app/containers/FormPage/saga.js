import { takeLatest, call, put, takeLeading } from 'redux-saga/effects';
// import { modalToggler } from 'utils/commonHelper';
import { forwardTo } from '../../helpers/forwardTo';
import { GraphqlAPI } from '../../utils/request';
import { SUBMIT_FORM, GET_FORM } from './constants';
import { setForm, setErrors, setSuccess } from './actions';

// Individual exports for testing
export default function* formPageSaga() {
  yield takeLatest(GET_FORM, getForm);
  yield takeLeading(SUBMIT_FORM, submitForm);
}

function* submitForm({ data }) {
  const res = yield call(submitFormQuery, data);
  if (res.success) {
    yield put(setSuccess(true));
    forwardTo('/successform');
    // yield put(setForm(res.GetClaimPrizeForm));
  } else {
    yield put(setErrors(res.errors));
  }
}

function* getForm({ coupon }) {
  const res = yield call(getFormQuery, coupon);
  if (res.success) {
    yield put(setForm(res.GetClaimPrizeForm));
  } else {
    yield put(setErrors(res.errors));
  }
}

function getFormQuery(coupon) {
  const query = {
    query: `
      query{
        GetClaimPrizeForm(coupon:"${coupon}"){
              id
              form_fields
              form_design
              form_fields_schema { form_id, required}
              template_form_id
              campaign_id
              campaign_entry_id
              name
              title
              descriptiom
              content
              footer
              header_file
              active
              claim_coupon
              winner_email
        }
      }`,
  };
  return GraphqlAPI(query);
}

function submitFormQuery(data) {
  const formInput =
    `personal_name:${data.personal_name ||
      null}|personal_email:${data.personal_email || null}` +
    `|personal_phone:${data.personal_phone ||
      null}|personal_zip_code:${data.personal_zip_code ||
      null}|personal_prefecture:${data.personal_prefecture}` +
    `|personal_address1:${data.personal_address1 ||
      null}|personal_address2:${data.personal_address2 ||
      null}|personal_address3:${data.personal_address3 || null}` +
    `${
      data.personal_notes
        ? `|personal_notes:${data.personal_notes || null}`
        : ''
    }` +
    `|thankful1_name:${data.thankful1_name ||
      null}|thankful1_email:${data.thankful1_email || null}` +
    `|thankful1_phone:${data.thankful1_phone ||
      null}|thankful1_zip_code:${data.thankful1_zip_code ||
      null}|thankful1_prefecture:${data.thankful1_prefecture}` +
    `|thankful1_address1:${data.thankful1_address1 ||
      null}|thankful1_address2:${data.thankful1_address2 ||
      null}|thankful1_address3:${data.thankful1_address3}` +
    `|thankful2_name:${data.thankful2_name ||
      null}|thankful2_email:${data.thankful2_email || null}` +
    `|thankful2_phone:${data.thankful2_phone ||
      null}|thankful2_zip_code:${data.thankful2_zip_code ||
      null}|thankful2_prefecture:${data.thankful2_prefecture}` +
    `|thankful2_address1:${data.thankful2_address1 ||
      null}|thankful2_address2:${data.thankful2_address2 ||
      null}|thankful2_address3:${data.thankful2_address3 || null}`;
  const query = {
    query: `
      mutation($form_input: String){
        SubmitCampaignClaimPrize(submitCampaignClaimprizeInput: {
          email:"${data.email || null}"
          full_name: "${data.full_name || null}"
          contact_no: "${data.contact_no || null}"
          zip_code:"${data.zip_code || null}"
          state: "${data.state || null}"
          city: "${data.city || null}"
          street:"${data.street || null}"
          building: "${data.building || null}"
          coupon: "${data.coupon || null}"
          form_input: $form_input
        })
      }`,
    variables: {
      form_input: formInput,
    },
  };
  return GraphqlAPI(query);
}
