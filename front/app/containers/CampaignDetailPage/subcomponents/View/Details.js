/* eslint-disable indent */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import User from 'assets/images/icons/user_primary.png';
import ColorLabel from 'components/ColorLabel';
import Tweet from 'components/Tweet';
import Form from 'components/Form';
import TemplatePreview from 'components/TemplatePreview';
import Button from 'components/Button';
import Table from 'components/Table';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Label from 'components/Label';
import Text from 'components/Text';
import ColorCircle from 'components/ColorCircle';
import ModalToggler from 'components/Modal/ModalToggler';
import FormPreview from 'containers/FormPreviewPage';
import ErrorFormatted from 'components/ErrorFormatted';
import { modalToggler, formatDateTime } from 'utils/commonHelper';
import { config } from 'utils/config';
import { forwardTo } from 'helpers/forwardTo';
import { PathEnum } from 'library/commonValues';
import HeaderSummary from './HeaderSummary';

import messages from '../../messages';

function Details({
  detailPage: {
    campDetails,
    labelList,
    tempDetails,
    totalExpectedWinners,
    formTemplates,
    campaignList,
    newCampPrize,
    statTotals,
    errors,
  },
  intl,
  onGetTemplate,
  commonTypes: {
    CampaignType,
    RaffleType,
    FormFields,
    WinnerConditionType,
    PreventPreviousWinnerType,
  },
  userAccount,
  routeParams,
  location,
  onAddPostLink,
}) {
  const snsType = userAccount.primary.type;
  const snsAccountName = userAccount.primary.name
    ? userAccount.primary.name.replace('@', '')
    : null;
  const sumPrize = raffleSched => {
    let total = 0;
    // eslint-disable-next-line array-callback-return
    raffleSched.map(p => {
      total += p.winner_total;
    });

    return total;
  };

  const getField = formFields =>
    FormFields.filter(t => t.value === formFields)
      .map(({ name, value }) =>
        intl.formatMessage(
          { id: `formFields${value}` },
          { defaultMessage: name },
        ),
      )
      .join(', ');

  const filterFormFields = value => {
    if (value.toString() !== EnumFormFields.TEXTBOX) {
      return true;
    }
    if (campDetails.form_design && campDetails.form_design !== 1) {
      return false;
    }
    return true;
  };

  const showThankful = campDetails.form_design === 2;
  const form_fields1 = campDetails.form_fields
    ? campDetails.form_fields.filter(f => f < 20).map(f => f % 10)
    : [];
  const form_fields2 =
    showThankful && campDetails.form_fields
      ? campDetails.form_fields.filter(f => f > 20 && f < 30).map(f => f % 20)
      : [];
  const form_fields3 =
    showThankful && campDetails.form_fields
      ? campDetails.form_fields.filter(f => f > 30).map(f => f % 30)
      : [];
  const targetHashtags = campDetails.target_hashtag
    ? campDetails.target_hashtag.split(',')
    : [];
  const form_fields_required = campDetails.form_fields_schema
    ? campDetails.form_fields_schema.filter(f => f.required).map(f => f.form_id)
    : [];
  return (
    <div>
      {campDetails && (
        <>
          <div className="row m-4 justify-content-center py-4 border-bottom">
            <div className="col-12">
              <div className="row">
                <div className="col">
                  <HeaderSummary
                    icon="icofont-ticket"
                    title={intl.formatMessage({ ...messages.entryPosts })}
                    subTitle={statTotals.grandTotalEntries}
                    info
                    tooltip={
                      campDetails.campaign_type === 1
                        ? intl.formatMessage({ ...messages.M0000079 })
                        : intl.formatMessage({ ...messages.M0000080 })
                    }
                  />
                </div>
                <div className="col">
                  <HeaderSummary
                    icon="icofont-light-bulb"
                    title={intl.formatMessage({ ...messages.uniqueEntries })}
                    subTitle={statTotals.grandTotalUniqueEntries}
                    info
                    tooltip={intl.formatMessage({ ...messages.M0000081 })}
                  />
                </div>
                <div className="col">
                  <HeaderSummary
                    icon="list"
                    title={intl.formatMessage({ ...messages.followerEntries })}
                    subTitle={statTotals.grandTotalFollowers}
                    info
                    tooltip={intl.formatMessage({ ...messages.M0000082 })}
                  />
                </div>
                {snsType === 100123 && (
                  <div className="col">
                    <HeaderSummary
                      icon="users-social"
                      title={intl.formatMessage({
                        ...messages.gainedFollowers,
                      })}
                      subTitle={statTotals.grandTotalGainedFollowers}
                      info
                      tooltip={intl.formatMessage({ ...messages.M0000083 })}
                    />
                  </div>
                )}
                <div className="col">
                  <HeaderSummary
                    icon="icofont-win-trophy"
                    title={intl.formatMessage({ ...messages.winners })}
                    subTitle={statTotals.grandTotalWinners}
                    info
                    tooltip={intl.formatMessage({ ...messages.M0000076 })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom py-3">
            <Form className="col-11 mx-auto">
              <div className="row">
                <div className="col-6">
                  <div className="title">
                    {intl.formatMessage({ ...messages.campaignDetails })}
                  </div>
                  <div className="ml-4">
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage(
                          { id: 'T0000004' },
                          { name: intl.formatMessage({ ...messages.title }) },
                        )}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {campDetails.title}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.description })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {campDetails.description &&
                        campDetails.description.length > 0 ? (
                          <span style={{ whiteSpace: 'pre-line' }}>
                            {campDetails.description}
                          </span>
                        ) : (
                          '_'
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.label })}
                      </div>
                      {campDetails.label_id && (
                        <div className="col-12 content pt-0 pb-0">
                          <ColorLabel
                            color={
                              labelList &&
                              labelList.list
                                .filter(p => p.id === campDetails.label_id)
                                .map(p => p.color_code)
                            }
                            className="mr-2"
                          />{' '}
                          {labelList &&
                            labelList.list
                              .filter(p => p.id === campDetails.label_id)
                              .map(p => p.name)}
                        </div>
                      )}
                      {!campDetails.label_id && (
                        <div className="col-12 content pt-0 pb-0">_</div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.campaignPeriod })}
                      </div>
                      <div className="col-12 content">
                        {intl.formatMessage({ ...messages.start })}:&nbsp;{' '}
                        {formatDateTime(campDetails.start_period)}
                        <br />
                        {intl.formatMessage({ ...messages.end })}:&nbsp;{' '}
                        {formatDateTime(campDetails.end_period)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.entryMethods })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {CampaignType &&
                          CampaignType.map(
                            ({ value, name }) =>
                              value === Number(campDetails.campaign_type) &&
                              intl.formatMessage(
                                { id: `entryMethod${value}` },
                                { defaultMessage: name },
                              ),
                          )}
                        {/* If Entry Method (Campaign Type) is Hashtag */}
                        {Number(campDetails.campaign_type) === 2 && (
                          <>
                            <div className="w-100">
                              {(campDetails.target_hashtag || '')
                                .split(',')
                                .join(', ')}
                            </div>
                            {targetHashtags.length >= 2 && (
                              <>
                                <div>
                                  {intl.formatMessage({
                                    ...messages.multipleHashtagLogicSettings,
                                  })}
                                </div>
                                <div>
                                  <span>
                                    {intl.formatMessage(
                                      {
                                        id: `hashtagCondition${
                                          campDetails.hashtag_condition
                                        }`,
                                      },
                                      // eslint-disable-next-line no-restricted-globals
                                      { defaultMessage: name },
                                    )}
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.raffleType })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {RaffleType &&
                          RaffleType.filter(
                            t => t.value === campDetails.raffle_type,
                          ).map(t =>
                            intl.formatMessage(
                              { id: `raffleType${t.value}` },
                              { defaultMessage: t.name },
                            ),
                          )}
                      </div>
                    </div>
                    {campDetails.raffle_type ===
                      Number(EnumRaffleTypes.FIXED) && (
                      <div>
                        <div className="row">
                          <div className="col-12 label pb-0">
                            {intl.formatMessage({ ...messages.noOfRaffle })}
                          </div>
                          <div className="col-12 content pt-0 pb-0">
                            {newCampPrize.length}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 label pb-0">
                            {intl.formatMessage({ ...messages.raffleInterval })}
                          </div>
                          <div className="col-12 content pt-0 pb-0">
                            {campDetails.raffle_interval === 1 &&
                              intl.formatMessage(
                                { id: 'noOfHour' },
                                { num: '1' },
                              )}
                            {campDetails.raffle_interval === 2 &&
                              intl.formatMessage(
                                { id: 'noOfHours' },
                                { num: '6' },
                              )}
                            {campDetails.raffle_interval === 3 &&
                              intl.formatMessage(
                                { id: 'noOfHours' },
                                { num: '12' },
                              )}
                            {campDetails.raffle_interval === 4 &&
                              intl.formatMessage(
                                { id: 'noOfHours' },
                                { num: '24' },
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    {[2, 3].includes(Number(campDetails.raffle_type)) && ( // Raffle Type is Fixed | End
                      <div className="row">
                        <div className="col-12 label pb-0">
                          {intl.formatMessage({ ...messages.autoRaffle })}
                        </div>
                        <div className="col-12 content pb-0 pt-0">
                          {campDetails.auto_raffle
                            ? intl.formatMessage({ ...messages.yes })
                            : intl.formatMessage({ ...messages.no })}
                        </div>
                      </div>
                    )}
                    {/* If Entry Method (Campaign Type) is Hashtag, Raffle Type is Instant OR Fixed */}
                    {Number(campDetails.campaign_type) === 2 &&
                      (campDetails.raffle_type ===
                        Number(EnumRaffleTypes.INSTANT) ||
                        campDetails.raffle_type ===
                          Number(EnumRaffleTypes.FIXED)) && (
                        /* eslint-disable */
                        <div className="row">
                          <div className="col-12 label pb-0">
                            {intl.formatMessage({ ...messages.winningLimit })}
                          </div>
                          <div className="col-12 content pt-0 pb-0">
                            {campDetails.account_winning_limit}
                          </div>
                        </div>
                      )}
                    {campDetails.entry_condition_followers && (
                      <div className="row">
                        <div className="col-12 label pb-0">
                          {intl.formatMessage({ ...messages.entryCondition })}
                        </div>
                        <div className="col-12 content pt-0 pb-0">
                          <div className="row">
                            <div className="col-12">
                              {campDetails.entry_condition_followers.map(
                                (tag, index) => (
                                  <p key={Number(index)}>@{tag}</p>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {snsType === 1 && (<div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.winnerCondition })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {WinnerConditionType &&
                          WinnerConditionType.filter(
                            t =>
                              t.value ===
                              campDetails.winning_condition
                                .winner_condition_type,
                          ).map(t =>
                            intl.formatMessage(
                              { id: `winnerCondition${t.value}` },
                              { defaultMessage: t.name },
                            ),
                          )}
                        {/* If Winning Condition is Custom Modified */}
                        {campDetails.winning_condition.winner_condition_type ===
                          2 &&
                          campDetails.winning_condition.follower_condition
                            .length !== 0 &&
                          campDetails.winning_condition.follower_condition.map(
                            cond => (
                              <div className="row">
                                <div className="col-8">
                                  {intl.formatMessage({
                                    ...messages.noOfFollowers,
                                  })}
                                  {/* If Retweet-Instant, Hashtag-Instant */}
                                  {((campDetails.campaign_type === 1 &&
                                    campDetails.raffle_type ===
                                    Number(EnumRaffleTypes.INSTANT)) ||
                                    (campDetails.campaign_type === 2 &&
                                      campDetails.raffle_type ===
                                      Number(EnumRaffleTypes.INSTANT))) &&
                                    intl.formatMessage({
                                      ...messages.winRate,
                                    })}
                                </div>
                                <div className="col-4">
                                  {cond.follower_count}
                                  {/* If Retweet-Instant, Hashtag-Instant */}
                                  {((campDetails.campaign_type === 1 &&
                                    campDetails.raffle_type ===
                                    Number(EnumRaffleTypes.INSTANT)) ||
                                    (campDetails.campaign_type === 2 &&
                                      campDetails.raffle_type ===
                                      Number(EnumRaffleTypes.INSTANT))) &&
                                    `${cond.increase_percentage}%`}
                                </div>
                              </div>
                            ),
                          )}
                        {/* If Prevent Previous Winner Type is checked */}
                        {campDetails.prevent_previous_winner_type !== null && (
                          <div className="row">
                            <div className="col-8">
                              {intl.formatMessage({
                                ...messages.preventPreviousWinner,
                              })}
                            </div>
                            <div className="col-4">
                              {PreventPreviousWinnerType &&
                                PreventPreviousWinnerType.map(
                                  ({ name, value }) =>
                                    value ===
                                    campDetails.prevent_previous_winner_type && [
                                      intl.formatMessage({
                                        id: `preventPrevWinner${value}`,
                                        defaultMessage: name,
                                      }),
                                    ],
                                )}
                            </div>
                          </div>
                        )}
                        {/* If Prevent Previous Winner Type is checked AND selected DateTime */}
                        {campDetails.prevent_previous_winner_type === 2 && (
                          <div className="row">
                            <div className="col-8">
                              {intl.formatMessage({
                                ...messages.preventPreviousWinner,
                              })}
                            </div>
                            <div className="col-4">
                              {`${campDetails.prevent_previous_from} - ${
                                campDetails.prevent_previous_to
                                }`}
                            </div>
                          </div>
                        )}
                        {/* If Prevent Previous Winner Type is checked AND selected Campaign Ids */}
                        {campDetails.prevent_previous_winner_type === 3 &&
                          campDetails.prevent_previous_campaigns !== null && (
                            <div className="row">
                              <div className="col-4 offset-8">
                                {campDetails.prevent_previous_campaigns.map(
                                  itm =>
                                    campaignList.list.find(m => m.id === itm)
                                      .title,
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                    )}

                    {snsType === 1 && (<div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.autoDMWinner })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {campDetails.auto_send_dm === 1
                          ? intl.formatMessage({ ...messages.yes })
                          : intl.formatMessage({ ...messages.no })}
                      </div>
                    </div>)}
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.prize })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {campDetails.campaign_prize.map(
                          (
                            { name, winning_percentage, raffle_schedule },
                            index,
                          ) => (
                              <div className="row" key={Number(index)}>
                                <div className="col-12">
                                  <ColorCircle nomargin />{name}
                                </div>
                                <div className="col-6">
                                  {sumPrize(raffle_schedule)}
                                </div>
                                {snsType === 1 &&
                                  <div className="col-6">
                                    {winning_percentage
                                      ? `${winning_percentage}%`
                                      : ''}
                                  </div>
                                }
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                    {false &&
                      Number(campDetails.raffle_type) ===
                      Number(EnumRaffleTypes.FIXED) && (
                        <div className="row">
                          <div className="col-12 label pb-0">
                            {intl.formatMessage({ ...messages.raffleDetails })}
                          </div>
                          <div className="col-12 content pt-0 pb-0">
                            <Button
                              link
                              onClick={() => modalToggler('prizeDistribution')}
                            >
                              {intl.formatMessage({ ...messages.viewDetails })}
                            </Button>
                            <Modal id="prizeDistribution" dismissable size="lg">
                              <ModalToggler modalId="prizeDistribution" />
                              <div>
                                <Table className="summary" isResponsive>
                                  <thead>
                                    <tr>
                                      <td colSpan="2" />
                                      {campDetails.campaign_prize &&
                                        campDetails.campaign_prize.map(
                                          ({ name }) => (
                                            <td className="col font-weight-bold">
                                              <label>{name}</label>
                                            </td>
                                          ),
                                        )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {campDetails.fixed_prize &&
                                      campDetails.fixed_prize.map(
                                        (
                                          {
                                            schedule,
                                            prizeInfo: prizes,
                                            ordinalNumber,
                                          },
                                          index,
                                        ) => (
                                            <tr key={Number(index)}>
                                              <td>
                                                <label>
                                                  {index + 1}
                                                  {intl.locale === 'en' &&
                                                    ordinalNumber
                                                    ? intl.formatMessage({
                                                      id: `ordinal${ordinalNumber}`,
                                                    })
                                                    : ''}
                                                  {` ${intl.formatMessage({
                                                    id: 'raffle',
                                                  })}`}
                                                </label>
                                              </td>
                                              <td>
                                                <div>
                                                  {moment(schedule.toApi).format(
                                                    `MM/DD/YYYY (hh:mm A)`,
                                                  )}
                                                </div>
                                              </td>
                                              {prizes.map(({ amount }) => (
                                                <td>
                                                  <div>{amount}</div>
                                                </td>
                                              ))}
                                            </tr>
                                          ),
                                      )}
                                  </tbody>
                                </Table>
                              </div>
                            </Modal>
                          </div>
                        </div>
                      )}
                    <div className="row">
                      <div className="col-12 label pb-0">
                        {intl.formatMessage({ ...messages.totalWinners })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">{totalExpectedWinners}</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  {snsType === 1 && (
                    <div className="title">
                      {intl.formatMessage({ ...messages.formContentSettings })}
                    </div>)}
                  {snsType !== 1 && (
                    <div className="title">
                      {intl.formatMessage({ ...messages.formSettings })}
                    </div>)}
                  <ol>
                    {snsType === 1 && (<li>
                      <div className="row">
                        <div className="col-12 title pb-0">
                          {intl.formatMessage({ ...messages.post })}
                        </div>
                        <div className="col-12 content pb-0 pt-0">
                          <ColorCircle /> {intl.formatMessage({ ...messages.tweetViaCamps })}
                        </div>
                        <div className="col-12 content pt-0 pb-0">
                          {campDetails.post_tweet_via_camps ? intl.formatMessage({ ...messages.yes }) : intl.formatMessage({ ...messages.no })}
                        </div>
                        {campDetails.post_id && campDetails.post_id !== "" && !campDetails.fake_post && (
                          <>
                            <div className="col-12 content pb-0">
                              <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                            </div>
                            <div className="col-12 content pt-0">
                              {snsType === 1 && (
                                <Button link
                                  onClick={() => window.open('https://twitter.com/'
                                    .concat(snsAccountName)
                                    .concat('/status/')
                                    .concat(campDetails.post_id), '_blank')}
                                >
                                  <Text
                                    text={'https://twitter.com/'
                                      .concat(snsAccountName)
                                      .concat('/status/')
                                      .concat(campDetails.post_id)}
                                  />
                                </Button>
                              )}
                              {snsType === 2 && (
                                <Button link
                                  onClick={() => window.open('https://www.instagram.com/p/'.concat(
                                    campDetails.content,
                                  ), "_blank")}
                                >
                                  <Text
                                    text={'https://www.instagram.com/p/'.concat(
                                      campDetails.content,
                                    )}
                                  />
                                </Button>
                              )}
                              {snsType === 3 && (
                                <Button link
                                  onClick={() => window.open(config.TIKTOK_URL.concat('/@')
                                    .concat(snsAccountName).concat('/video/')
                                    .concat(campDetails.post_id)
                                    , "_blank")}
                                >
                                  <Text
                                    text={`${config.TIKTOK_URL}`
                                      .concat('/@').concat(snsAccountName).concat('/video/')
                                      .concat(
                                        campDetails.post_id,
                                      )}
                                  />
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                        {campDetails.post_tweet_via_camps === 1 && (
                          <div className="col-12 content pb-0 pt-0">
                            <ColorCircle /> {intl.formatMessage({ ...messages.content })}
                          </div>
                        )}
                        {campDetails.post_tweet_via_camps === 1 && (
                          <div className="col-12 content pt-0">
                            <Tweet
                              twitterLink={campDetails.post_id ? `${config.TWITTER_URL}/${userAccount.primary.name.replace('@', '')}/status/${
                                campDetails.post_id
                                }` : false}
                              userImg={User}
                              name={userAccount.primary.name}
                              username={userAccount.primary.name}
                              content={campDetails.sns_post_content}
                              dateTime={campDetails.createdAt}
                              files={campDetails.sns_post_media_path}
                              fileType={campDetails.media_type}
                            />
                          </div>
                        )}
                      </div>
                    </li>)}
                    {campDetails.raffle_type ===
                      Number(EnumRaffleTypes.INSTANT) && (
                        <li>
                          <div className="row">
                            <div className="col-12 title pl-0">
                              {intl.formatMessage({ ...messages.post })}
                            </div>
                            {campDetails.post_winner_message_template && (
                              <div className="w-100 align-items-baseline">
                                <div className="col-12 content pb-0 pt-0">
                                  {intl.formatMessage(
                                    { id: 'T0000016' },
                                    {
                                      name: intl.formatMessage({
                                        ...messages.winner,
                                      }),
                                    },
                                  )}
                                </div>
                                <div className="col-12 content pb-0 pt-0">
                                  {campDetails.post_winner_message_template.title}
                                </div>
                                <Button
                                  className="col"
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.post_winner_message_template.id,
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            )}
                            {campDetails.post_loser_message_template && (
                              <div className="w-00 align-items-baseline">
                                <div className="col-12 content pb-0 pt-0">
                                  {intl.formatMessage(
                                    { id: 'T0000016' },
                                    {
                                      name: intl.formatMessage({
                                        ...messages.loser,
                                      }),
                                    },
                                  )}
                                </div>
                                <div className="col-12 content pb-0 pt-0">
                                  {campDetails.post_loser_message_template.title}
                                </div>
                                <Button
                                  className="col"
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.post_loser_message_template.id,
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            )}

                            {campDetails.post_ty_message_template && (
                              <div className="w-100 align-items-baseline">
                                <div className="col-12 content pb-0 pt-0">
                                  {intl.formatMessage(
                                    { id: 'T0000016' },
                                    {
                                      name: intl.formatMessage({
                                        ...messages.thankYou,
                                      }),
                                    },
                                  )}
                                </div>
                                <div className="col-12 content pb-0 pt-0">
                                  {campDetails.post_ty_message_template.title}
                                </div>
                                <Button
                                  className="col"
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.post_ty_message_template.id,
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            )}
                          </div>
                        </li>
                      )}
                    {snsType === 1 && (
                      <li>
                        <div className="row">
                          <div className="col-12 title pb-0">
                            {snsType === 1 ? intl.formatMessage({ ...messages.directMessage }) : intl.formatMessage({ ...messages.message })}
                          </div>
                          {campDetails.winner_message_template && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0 pt-0">
                                <ColorCircle /> {intl.formatMessage(
                                  { id: 'T0000016' },
                                  {
                                    name: intl.formatMessage({
                                      ...messages.winner,
                                    }),
                                  },
                                )}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                {campDetails.winner_message_template.title}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                <Button
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.winner_message_template.id,
                                    )
                                  }
                                  className="col-12 content pb-0 pt-0"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                          {campDetails.fc_message_template && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0">
                                <ColorCircle /> {intl.formatMessage(
                                  { id: 'T0000016' },
                                  {
                                    name: intl.formatMessage({
                                      ...messages.formSubmit,
                                    }),
                                  },
                                )}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                {campDetails.fc_message_template.title}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                <Button
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.fc_message_template.id,
                                    )
                                  }
                                  className="col"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                          {campDetails.loser_message_template && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0">
                                {intl.formatMessage(
                                  { id: 'T0000016' },
                                  {
                                    name: intl.formatMessage({
                                      ...messages.loser,
                                    }),
                                  },
                                )}
                              </div>
                              <div className="col-12 content pb-0 pt-0 text-muted">
                                {campDetails.loser_message_template.title}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                <Button
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.loser_message_template.id,
                                    )
                                  }
                                  className="col text-underline"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                          {campDetails.ty_message_template && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0">
                                {intl.formatMessage(
                                  { id: 'T0000016' },
                                  {
                                    name: intl.formatMessage({
                                      ...messages.thankYou,
                                    }),
                                  },
                                )}
                              </div>
                              <div className="col-12 content pb-0 pt-0 text-muted">
                                {campDetails.ty_message_template.title}
                              </div>
                              <div className="col-12 content pb-0 pt-0">
                                <Button
                                  small
                                  link
                                  onClick={() =>
                                    onGetTemplate(
                                      campDetails.ty_message_template.id,
                                    )
                                  }
                                  className="col-12 content pb-0 pt-0 text-underline"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    )}
                    {snsType === 1 && (
                      <li>
                        <div className="row">
                          <div className="col-12 title pb-0">
                            {intl.formatMessage({ ...messages.form })}
                          </div>
                          {campDetails.template_form && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0 pt-0">
                                <ColorCircle /> {campDetails.template_form.name}
                              </div>
                              <div className="col-12 content pt-0">
                                <Button
                                  link
                                  onClick={() => modalToggler('formPreviewModal')}
                                  className="col"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                          {
                            form_fields1.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.personalInformation,
                                  })}
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields1.filter(s => filterFormFields(s)).map(
                                      t => `${getField(t)}`,
                                    ).join(', ')}
                                </div>
                              </div>
                            )
                          }
                          {
                            form_fields2.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.thankfulPerson,
                                  })} 1
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields2.map(
                                      t => `${getField(t)}`,
                                    ).join(', ')}
                                </div>
                              </div>
                            )
                          }
                          {
                            form_fields3.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.thankfulPerson,
                                  })} 2
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields3.map(
                                      t => `${getField(t)}`,
                                    ).join(', ')}
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </li>
                    )}
                    {snsType !== 1 && (
                      <>
                        <div className="row">
                          {campDetails.post_id && campDetails.post_id !== "" && !campDetails.fake_post && campDetails.content !== "" && (
                            <>
                              <div className="col-12 content pb-0">
                                <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                              </div>
                              <div className="col-12 content pt-0">
                                {
                                  snsType === 2 ? (
                                    <Button link
                                      onClick={() => window.open('https://www.instagram.com/p/'.concat(
                                        campDetails.content,
                                      ), "_blank")}
                                    >
                                      <Text
                                        text={'https://www.instagram.com/p/'.concat(
                                          campDetails.content,
                                        )}
                                      />
                                    </Button>
                                  ) : (
                                      <Button link
                                        onClick={() => window.open(config.TIKTOK_URL
                                          .concat('/@').concat(snsAccountName).concat('/video/')
                                          .concat(
                                            campDetails.content,
                                          ), "_blank")}
                                      >
                                        <Text
                                          text={`${config.TIKTOK_URL}`
                                            .concat('/@').concat(snsAccountName).concat('/video/')
                                            .concat(
                                              campDetails.content,
                                            )}
                                        />
                                      </Button>
                                    )
                                }
                              </div>
                            </>
                          )}
                        </div>
                        <div className="row">
                          <div className="col-12 pb-0">
                            <ColorCircle />
                            {intl.formatMessage({ ...messages.formTemplate })}
                          </div>
                          {campDetails.template_form && (
                            <div className="w-100 m-0">
                              <div className="col-12 content pb-0 pt-0">
                                {campDetails.template_form.name}
                              </div>
                              <div className="col-12 content pt-0">
                                <Button
                                  small
                                  link
                                  onClick={() => modalToggler('formPreviewModal')}
                                  className="col"
                                >
                                  {intl.formatMessage({
                                    ...messages.preview,
                                  })}
                                </Button>
                              </div>
                            </div>
                          )}
                          {
                            form_fields1.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.personalInformation,
                                  })}
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields1.map(
                                      t => `${getField(t)}, `,
                                    )}
                                </div>
                              </div>
                            )
                          }
                          {
                            form_fields2.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.thankfulPerson,
                                  })} 1
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields2.map(
                                      t => `${getField(t)}, `,
                                    )}
                                </div>
                              </div>
                            )
                          }
                          {
                            form_fields3.length > 0 && (
                              <div className="w-100 m-0">
                                <div className="col-12 content pb-0 pt-0">
                                  <ColorCircle /> {intl.formatMessage({
                                    ...messages.thankfulPerson,
                                  })} 2
                                </div>
                                <div className="col-12 content pb-0 pt-0 text-muted">
                                  {RaffleType &&
                                    form_fields3.map(
                                      t => `${getField(t)}, `,
                                    )}
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </Form>
          </div>
          <div className="row py-4">
            <div className="col-auto">
              <Button
                width="sm"
                tertiary
                small
                onClick={() => {
                  if (
                    location.pathInfo &&
                    location.pathInfo.backUrl === PathEnum.Schedule
                  ) {
                    forwardTo('/schedule');
                  } else {
                    forwardTo({
                      pathname: '/campaign',
                      state: { campaignTab: campDetails.campaign_type },
                    });
                  }
                }}
              >
                {intl.formatMessage({
                  ...messages.back,
                })}
              </Button>
            </div>
            <div className="col-auto ml-auto">
              {/* Ongoing: 0, Scheduled: 1, Ended: 2, Save: 5,*/}
              {[0, 1, 2, 5, 9].includes(Number(campDetails.status)) && (
                <Button
                  width="sm"
                  primary
                  small
                  disabled={campDetails.is_sub_campaign}
                  onClick={() => forwardTo(`/campaign/edit/${routeParams.id}`)}
                >
                  {intl.formatMessage({
                    ...messages.edit,
                  })}
                </Button>
              )}
            </div>
            {[0, 1, 9].includes(Number(campDetails.status)) && (
              <Button
                width="sm"
                primary
                small
                disabled={campDetails.is_sub_campaign}
                onClick={() => modalToggler('addPostLink')}
              >
                {intl.formatMessage({
                  ...messages.addPostLinkButton,
                })}
              </Button>
            )}
          </div>
          <Modal id="modalTemplatePreview" dismissable size="md">
            <ModalToggler modalId="modalTemplatePreview" />
            <div className="row justify-content-center my-4">
              <div className="col-md-12 mb-3">
                {tempDetails && (
                  <TemplatePreview
                    content={tempDetails.content}
                    uploadFiles={
                      tempDetails.message_file ? [tempDetails.message_file] : []
                    }
                  />
                )}
              </div>
            </div>
          </Modal>

          <Modal id="formPreviewModal" size="md" dismissable>
            <ModalToggler modalId="formPreviewModal" />
            <FormPreview
              inputFormFields={form_fields1.map(String)}
              inputFormFields2={form_fields2.map(String)}
              inputFormFields3={form_fields3.map(String)}
              inputFormFieldsRequired={form_fields_required}
              formDesign={campDetails.form_design}
              template={(formTemplates || []).find(
                ({ id }) => id === campDetails.template_form.id,
              )}
            />
          </Modal>
          {[0, 1, 9].includes(Number(campDetails.status)) && (
            <Modal id="addPostLink" size="md" dismissable>
              <ModalToggler modalId="addPostLink" />
              <Form>
                <Label required>
                  <FormattedMessage {...messages.addPostLinkMessage} values={{ campaignName: campDetails.title }} />
                </Label>
                <Input id="postLink" name="postLink" />
                {errors && (<ErrorFormatted
                  invalid
                  list={errors.list}
                  names={['postLink']}
                />
                )}
                <Button type="submit" className="col-5 mx-auto mt-3" onClick={() => onAddPostLink()}>
                  {intl.formatMessage({ ...messages.submit })}
                </Button>
              </Form>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

Details.propTypes = {
  intl: intlShape.isRequired,
  detailPage: PropTypes.any,
  onGetTemplate: PropTypes.any,
  userAccount: PropTypes.any,
  commonTypes: PropTypes.object,
  routeParams: PropTypes.any,
  location: PropTypes.any,
  statTotals: PropTypes.any,
  onAddPostLink: PropTypes.func,
  targetHashtags: PropTypes.object,
};

export default injectIntl(Details);
