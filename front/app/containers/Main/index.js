/**
 *
 * Main
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ComponentPage from 'containers/ComponentPage/Loadable';
import UploadVideoPage from 'containers/UploadVideoPage/Loadable';
import CreateCampaignPage from 'containers/CreateCampaignPage/Loadable';
import CampaignDetailPage from 'containers/CampaignDetailPage/Loadable';
import EditCampaignPage from 'containers/EditCampaignPage/Loadable';
import ParticipantDetailPage from 'containers/ParticipantDetailPage/Loadable';
import DashboardPage from 'containers/DashboardPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import WatchPage from 'containers/WatchPage/Loadable';
import PublishedPage from 'containers/PublishedPage/Loadable';
import SettingsPage from 'containers/SettingsPage/Loadable';
import AddTemplatePage from 'containers/SettingsPage/Template/AddTemplatePage/Loadable';
import TemplateDetailsPage from 'containers/SettingsPage/Template/TemplateDetailsPage/Loadable';
import AddFormPage from 'containers/SettingsPage/Form/AddFormPage/Loadable';
import FormsDetailPage from 'containers/SettingsPage/Form/FormsDetailPage/Loadable';
import AddLabelPage from 'containers/SettingsPage/Label/AddLabelPage/Loadable';
import AddCategoryPage from 'containers/SettingsPage/Category/AddCategoryPage/Loadable';
import NotificationPage from 'containers/NotificationPage/Loadable';
import SchedulePage from 'containers/SchedulePage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import LinkSnsPage from 'containers/LinkSnsPage/Loadable';
import SearchVideoPage from 'containers/SearchVideoPage/Loadable';
import CategoryVideoPage from 'containers/CategoryVideoPage/Loadable';
import MyPage from 'containers/MyPage/Loadable';
import { changeLocale } from 'containers/LanguageProvider/actions';

import Layout from 'components/Layout';
import PATH from '../path';

// import AddTemplatePage from '../SettingsPage/Template/AddTemplatePage';

export function Main(props) {
  const {
    location,
    userAccount,
    dispatch,
    systemSettings,
    // changeDefaultLocale,
  } = props;
  // const HomePage = () => <Redirect to="/sigma" />;
  const NotFoundRedirect = () => <Redirect to="/404" />;
  const DashboardRedirect = () => <Redirect to={PATH.HOME} />;
  // const language = 'en';
  // if (language === 'en' || language === '' || language == null) {
  //  changeDefaultLocale('en');
  // } else {
  //  changeDefaultLocale(userAccount.lang);
  // }
  return (
    <Layout
      location={location}
      userAccount={userAccount}
      systemSettings={systemSettings}
      dispatch={dispatch}
    >
      <TransitionGroup className="transition-group" exit={false}>
        <CSSTransition
          key={location.pathname}
          timeout={{ enter: 200, exit: 100 }}
          classNames="fade"
        >
          <section className="route-section">
            <Switch location={location}>
              <Route
                exact
                path="/upload"
                // eslint-disable-next-line no-shadow
                render={props => (
                  <UploadVideoPage {...props} userAccount={userAccount} />
                )}
              />
              <Route
                exact
                path="/publish/campaign"
                component={CreateCampaignPage}
              />
              <Route
                exact
                path="/campaign/detail/:id"
                component={CampaignDetailPage}
              />
              <Route
                exact
                path="/campaign/edit/:id"
                component={EditCampaignPage}
              />
              <Route
                exact
                path="/campaign/participant/detail/:campaignId/:entryId"
                component={ParticipantDetailPage}
              />
              <Route exact path={PATH.DASHBOARD} component={DashboardPage} />
              <Route
                exact
                path={PATH.HOME}
                component={HomePage}
                userAccount={userAccount}
              />
              <Route
                exact
                path={`${PATH.WATCH}/v/:hash`}
                component={WatchPage}
              />
              <Route exact path="/campaign" component={PublishedPage} />
              <Route exact path="/components" component={ComponentPage} />
              <Route exact path={PATH.SETTINGS} component={SettingsPage} />
              <Route
                exact
                path={`${PATH.SETTINGS}/:pageTab`}
                component={SettingsPage}
              />
              <Route
                exact
                path="/settings/template/add"
                component={AddTemplatePage}
                userAccount={userAccount}
              />
              <Route
                exact
                path={`${PATH.TEMPLATE_DETAIL}/:id`}
                component={TemplateDetailsPage}
              />
              <Route exact path="/settings/form/add" component={AddFormPage} />
              <Route
                exact
                path="/settings/form/detail/:id"
                component={FormsDetailPage}
              />
              <Route
                exact
                path="/settings/label/add"
                component={AddLabelPage}
              />
              <Route exact path="/add/category" component={AddCategoryPage} />
              <Route exact path="/notification" component={NotificationPage} />
              <Route exact path="/schedule" component={SchedulePage} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/search/" component={SearchVideoPage} />
              <Route
                exact
                path="/search/:keyword"
                component={SearchVideoPage}
              />
              <Route exact path="/mypage" component={MyPage} />
              <Route
                exact
                path="/category/:videoCategoryId"
                component={CategoryVideoPage}
              />
              <Route exact path={PATH.CALLBACK_SNS} component={LinkSnsPage} />
              <Route exact path="/" component={DashboardRedirect} />
              <Route exact path="*" component={NotFoundRedirect} />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Layout>
  );
}

Main.propTypes = {
  location: PropTypes.object,
  userAccount: PropTypes.object,
  dispatch: PropTypes.func,
  systemSettings: PropTypes.object,
  changeDefaultLocale: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    changeDefaultLocale: data => dispatch(changeLocale(data)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Main);
