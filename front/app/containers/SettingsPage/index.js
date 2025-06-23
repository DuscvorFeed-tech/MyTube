/**
 *
 * SettingsPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Card from 'components/Card';
import NavTabWrapper from 'components/NavTab/Wrapper';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo, replaceTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import NavTab from '../../components/NavTab';
import makeSelectSettingsPage, {
  makeSelectLabels,
  makeSelectAccounts,
  makeSelectForms,
  makeSelectTemplates,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import Template from './Template';
import Forms from './Forms';
import Accounts from './Accounts';
import Labels from './Labels';
import {
  fetchLabelList,
  deleteLabel,
  linkAccount,
  fetchAccountList,
  fetchFormList,
  fetchTemplateList,
  deleteTemplate,
  deleteForm,
  resetPage,
  setSnsAsDefault,
  deleteSnsAccount,
} from './actions';
import PATH from '../path';
import messages from './messages';

function getTab({ pageTab }) {
  if (pageTab) {
    switch (pageTab.toLowerCase()) {
      case 'template':
        return 1;
      case 'forms':
        return 2;
      case 'accounts':
        return 3;
      case 'labels':
        return 4;
      default:
        forwardTo(PATH.PAGE404);
        break;
    }
  }
  return undefined;
}

export function SettingsPage({
  onLoadLabelList,
  labels,
  onDeleteLabel,
  routeParams,
  onLoadAccountList,
  accounts,
  onLoadForms,
  forms,
  onLoadTemplateList,
  templates,
  commonTypes,
  onDeleteTemplate,
  settingsPage: { error },
  onDeleteForm,
  onReset,
  onSubmitSetSnsAsDefault,
  onDeleteSnsAccount,
  intl,
  systemSettings,
}) {
  useInjectReducer({ key: 'settingsPage', reducer });
  useInjectSaga({ key: 'settingsPage', saga });

  const [activeTab] = useState(getTab(routeParams) || 1);
  const [delId, setDelId] = useState(0);
  // const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    onReset();
    switch (activeTab) {
      case 1:
        onLoadTemplateList(1);
        break;
      case 2:
        onLoadForms(1);
        break;
      case 3:
        onLoadAccountList(1);
        break;
      case 4:
        onLoadLabelList(1);
        break;
      default:
        break;
    }
  }, [activeTab]);

  const deleteItem = () => {
    switch (activeTab) {
      case 1:
        onDeleteTemplate(delId);
        break;
      case 2:
        onDeleteForm(delId);
        break;
      case 3:
        onDeleteSnsAccount(delId);
        break;
      case 4:
        onDeleteLabel(delId);
        break;
      default:
        break;
    }
    setDelId(0);
  };

  const onPageTemplateList = page => {
    onLoadTemplateList(page);
  };

  const onPageFormList = page => {
    onLoadForms(page);
  };

  const onPageLabelList = page => {
    onLoadLabelList(page);
  };

  const onPageUserAccountList = page => {
    onLoadAccountList(page);
  };

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.template })}</title>
        <meta name="description" content="Description of Settings Page" />
      </Helmet>
      <Card
        title={intl.formatMessage({ ...messages.T0000012 })}
        className="p-0 text-left"
        footer={
          <div className="button-holder">
            <div className="row">
              <div className="col-auto ml-auto">
                {activeTab === 1 && (
                  <Button
                    onClick={() => forwardTo('/settings/template/add')}
                    width="md"
                  >
                    {intl.formatMessage({ ...messages.add })}
                  </Button>
                )}
                {activeTab === 2 && (
                  <Button
                    onClick={() => forwardTo('/settings/form/add')}
                    width="md"
                  >
                    {intl.formatMessage({ ...messages.addForm })}
                  </Button>
                )}
                {/* LIMIT TO 3 SNS ACCOUNT */}
                {activeTab === 3 && (
                  <Button
                    // eslint-disable-next-line no-return-assign
                    onClick={() => forwardTo(PATH.ADD_ACCOUNT)}
                    width="md"
                    disabled={
                      accounts &&
                      (accounts.pageInfo && accounts.pageInfo.totalRecords) >=
                        systemSettings.sns_account_limit
                    }
                  >
                    {intl.formatMessage({ ...messages.addAccount })}
                  </Button>
                )}
                {activeTab === 4 && (
                  <Button
                    onClick={() => forwardTo('/settings/label/add')}
                    width="md"
                  >
                    {intl.formatMessage({ ...messages.addLabel })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        }
      >
        <NavTabWrapper>
          <NavTab
            id="template"
            label={intl.formatMessage({ ...messages.message })}
            className={activeTab === 1 ? 'active' : ''}
            onClick={() => replaceTo(PATH.SETTINGS_TEMPLATE)}
          />
          <NavTab
            id="forms"
            label={intl.formatMessage({ ...messages.forms })}
            className={activeTab === 2 ? 'active' : ''}
            onClick={() => replaceTo(PATH.SETTINGS_FORMS)}
          />
          <NavTab
            id="accounts"
            label={intl.formatMessage({ ...messages.accounts })}
            className={activeTab === 3 ? 'active' : ''}
            onClick={() => replaceTo(PATH.SETTINGS_ACCOUNTS)}
          />
          <NavTab
            id="labels"
            label={intl.formatMessage({ ...messages.labels })}
            className={activeTab === 4 ? 'active' : ''}
            onClick={() => replaceTo(PATH.SETTINGS_LABELS)}
          />
        </NavTabWrapper>

        {activeTab === 1 && (
          <div>
            <Template
              data={templates}
              templateCategories={commonTypes.TemplateCategory}
              setDelId={setDelId}
              error={error}
              onPageTemplateList={onPageTemplateList}
            />
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <Forms
              data={forms}
              setDelId={setDelId}
              error={error}
              onPageFormList={onPageFormList}
            />
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <Accounts
              data={accounts}
              error={error}
              onSubmitSetSnsAsDefault={onSubmitSetSnsAsDefault}
              setDelId={setDelId}
              onDeleteSnsAccount={onDeleteSnsAccount}
              onPageUserAccountList={onPageUserAccountList}
            />
          </div>
        )}
        {activeTab === 4 && (
          <div>
            <Labels
              data={labels}
              setDelId={setDelId}
              error={error}
              onPageLabelList={onPageLabelList}
            />
          </div>
        )}
        <div>
          <Modal id="DeleteTemplateSuccess" dismissable>
            <ModalToggler modalId="DeleteTemplateSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.messageTemplate })}</p>
              <Button primary className="col-4" dataDismiss="modal">
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
          <Modal id="DeleteLabelSuccess" dismissable>
            <ModalToggler modalId="DeleteLabelSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.messageLabel })}</p>
              <Button primary className="col-4" dataDismiss="modal">
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
          <Modal id="DeleteFormSuccess" dismissable>
            <ModalToggler modalId="DeleteFormSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.messageForm })}</p>
              <Button primary className="col-4" dataDismiss="modal">
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
          <Modal id="DeleteSnsSuccess">
            <ModalToggler modalId="DeleteSnsSuccess" />
            <div className="text-center">
              <p>{intl.formatMessage({ ...messages.messageSns })}</p>
              <Button
                primary
                className="col-4"
                dataDismiss="modal"
                onClick={() => {
                  replaceTo(PATH.SETTINGS_ACCOUNTS);
                  window.location.replace(PATH.SETTINGS_ACCOUNTS);
                }}
              >
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
          <Modal id="DeleteConfirm" dismissable>
            <ModalToggler modalId="DeleteConfirm" />
            <div className="col-10 text-center mx-auto">
              <p>
                {activeTab === 3
                  ? intl.formatMessage({ ...messages.deleteAccountConfirm })
                  : intl.formatMessage({ ...messages.deleteConfirm })}
              </p>
              <Button
                primary
                className="col-3 mr-2"
                dataDismiss="modal"
                onClick={() => deleteItem()}
              >
                {intl.formatMessage({ ...messages.btnYes })}
              </Button>
              <Button primary className="col-3" dataDismiss="modal">
                {intl.formatMessage({ ...messages.btnNo })}
              </Button>
            </div>
          </Modal>
          <Modal id="DeleteError" dismissable>
            <ModalToggler modalId="DeleteError" />
            <div className="col-10 text-center mx-auto">
              <p>{intl.formatMessage({ ...messages.deleteAccountError })}</p>
              <Button primary className="col-3" dataDismiss="modal">
                {intl.formatMessage({ ...messages.btnOk })}
              </Button>
            </div>
          </Modal>
        </div>
      </Card>
    </div>
  );
}

SettingsPage.propTypes = {
  onLoadLabelList: PropTypes.func,
  labels: PropTypes.object,
  onDeleteLabel: PropTypes.func,
  // onLinkAccount: PropTypes.func,
  routeParams: PropTypes.object,
  onLoadAccountList: PropTypes.func,
  accounts: PropTypes.object,
  // dispatch: PropTypes.func.isRequired,
  onLoadForms: PropTypes.func,
  forms: PropTypes.object,
  onLoadTemplateList: PropTypes.func,
  templates: PropTypes.object,
  commonTypes: PropTypes.object,
  onDeleteTemplate: PropTypes.func,
  onDeleteForm: PropTypes.func,
  onReset: PropTypes.func,
  settingsPage: PropTypes.any,
  onSubmitSetSnsAsDefault: PropTypes.func,
  intl: intlShape.isRequired,
  onDeleteSnsAccount: PropTypes.func,
  systemSettings: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  settingsPage: makeSelectSettingsPage(),
  labels: makeSelectLabels(),
  accounts: makeSelectAccounts(),
  forms: makeSelectForms(),
  templates: makeSelectTemplates(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadLabelList: page => dispatch(fetchLabelList(page)),
    onLoadAccountList: page => dispatch(fetchAccountList(page)),
    onDeleteLabel: id => dispatch(deleteLabel({ id })),
    onLinkAccount: () => dispatch(linkAccount({ snsType: 1 })),
    onLoadForms: page => {
      dispatch(fetchFormList(page));
    },
    onLoadTemplateList: page => dispatch(fetchTemplateList(page)),
    onDeleteTemplate: id => dispatch(deleteTemplate({ id })),
    onDeleteForm: id => dispatch(deleteForm({ id })),
    onReset: id => dispatch(resetPage({ id })),
    onSubmitSetSnsAsDefault: id => dispatch(setSnsAsDefault({ id })),
    onDeleteSnsAccount: (id, validate = false) =>
      dispatch(deleteSnsAccount({ id, validate })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(SettingsPage);
