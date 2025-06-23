/**
 *
 * ProfilePage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import author from 'assets/images/common/author.png';
// import Input from 'components/Input';
// import LanguageSelector from 'components/LanguageSelector';

// import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectProfilePage, makeSelectSnsAccounts } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './ProfilePage.scss';
import { loadSNSAccounts, submitRegister } from './actions';
import validation from './validators';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
export function ProfilePage(props) {
  useInjectReducer({ key: 'profilePage', reducer });
  useInjectSaga({ key: 'profilePage', saga });
  const { intl, snsAccounts, onSubmit, onLoad } = props;

  const validator = validation(intl);
  const instagram = useValidation('', validator.instagram);
  const facebook = useValidation('', validator.facebook);
  const twitter = useValidation('', validator.twitter);
  const youtube = useValidation('', validator.youtube);
  const invalid = !isValid([instagram, facebook, twitter, youtube]);
  const submitter = useSubmitEffect(
    [onSubmit, [instagram.value, facebook.value, twitter.value, youtube.value]],
    () => !invalid,
  );

  useEffect(() => {
    onLoad();
  }, []);

  if (snsAccounts) {
    if (!instagram.value) {
      instagram.setvalue(snsAccounts.instagram);
    }
    if (!youtube.value) {
      youtube.setvalue(snsAccounts.youtube);
    }
    if (!facebook.value) {
      facebook.setvalue(snsAccounts.facebook);
    }
    if (!twitter.value) {
      twitter.setvalue(snsAccounts.twitter);
    }
  }

  return (
    <main className="container-fluid">
      <section className="user-heading">
        <div className="row">
          <div className="col-12">
            <img src={author} className="profile-pic" alt="author" />
            <div className="user-info">
              <div className="user-name">DJ Ally</div>
              <div className="user-stat">
                <i className="fas fa-thumbs-up" /> <span>18,400</span>
                <i className="fas fa-play-circle" /> <span>15 Videos</span>
                <i className="fas fa-signal" /> <span>Rank 3rd</span>
                <i className="fas fa-star" /> <span>350 Points</span>
                <a href="/" className="btn-black">
                  Use Points
                </a>
                <a href="/profile" className="btn-gradient">
                  Edit Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="edit-account-form">
        <div className="row">
          <div className="col-12">
            <h2>Edit Account</h2>
            <form action="">
              <div className="row">
                <div className="col-12">
                  <h3>My SNS Account</h3>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="twitter"
                    className="input-text"
                    placeholder="Twitter"
                    // value={snsAccounts && snsAccounts.instagram}
                    {...twitter}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="instagram"
                    className="input-text"
                    placeholder="Instagram"
                    // value={snsAccounts && snsAccounts.instagram}
                    {...instagram}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="youtube"
                    className="input-text"
                    placeholder="Youtube"
                    // value={snsAccounts && snsAccounts.instagram}
                    {...youtube}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="facebook"
                    className="input-text"
                    placeholder="Facebook"
                    // value={snsAccounts && snsAccounts.instagram}
                    {...facebook}
                  />
                </div>
                <div className="col-12">
                  <h3>Password</h3>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Current"
                  />
                </div>
                <div className="col-12">
                  <input type="text" className="input-text" placeholder="New" />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Confirm New"
                  />
                </div>
                <div className="col-12 col-submit">
                  <button className="btn-grey" type="button">
                    Cancel
                  </button>
                  <button
                    className="btn-gradient"
                    type="submit"
                    disabled={invalid || submitter.submitting}
                    {...submitter}
                  >
                    {intl.formatMessage({ ...messages.save })}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <updateSuccess />
    </main>
  );
}

ProfilePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  onLoad: PropTypes.func,
  intl: intlShape,
  onSubmit: PropTypes.func,
  userAccount: PropTypes.any,
  snsAccounts: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profilePage: makeSelectProfilePage(),
  snsAccounts: makeSelectSnsAccounts(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => {
      dispatch(loadSNSAccounts());
    },
    onSubmit: (values, onSubmitted) => {
      const [instagram, facebook, twitter, youtube] = values;
      dispatch(
        submitRegister(
          {
            instagram,
            facebook,
            twitter,
            youtube,
          },
          onSubmitted,
        ),
      );
    },
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
)(ProfilePage);
