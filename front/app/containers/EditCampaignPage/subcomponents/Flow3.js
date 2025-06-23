/* eslint-disable indent */
import React from 'react';
import { formatDateTime, modalToggler } from 'utils/commonHelper';
import PropTypes from 'prop-types';
import Form from 'components/Form';
import Button from 'components/Button';
import Tweet from 'components/Tweet';
import Modal from 'components/Modal';
import ErrorFormatted from 'components/ErrorFormatted';
import ModalToggler from 'components/Modal/ModalToggler';
import LoadingIndicator from 'components/LoadingIndicator';
import ColorCircle from 'components/ColorCircle';
import Text from 'components/Text';

import { config } from 'utils/config';
import User from 'assets/images/icons/user_primary.png';
import messages from '../messages';
import Table from './CustomTable';
import Modals from './Modals';

// eslint-disable-next-line arrow-body-style
const Flow3 = props => {
  const {
    payload,
    filterFormFields,
    fields: {
      formMessageTemplate,
      inputFormFields,
      inputFormFields2,
      inputFormFields3,
      inputFormFieldsRequired,
    },
    store: {
      intl,
      errors,
      userAccount,
      snsType,
      loading,
      labelList,
      campaignList,
      winTempList,
      loseTempList,
      tempDetails,
      tyTempList,
      formCompTempList,
      formList,
      onGetTemplate,
      commonTypes: {
        RaffleType,
        CampaignType,
        FormFields,
        FormFields2,
        FormFields3,
        WinnerConditionType,
        PreventPreviousWinnerType,
      },
    },
  } = props;
  const {
    tweetUploadFile: { uploadFiles },
  } = payload;

  const snsAccountName = userAccount.name
    ? userAccount.name.replace('@', '')
    : null;

  const { showThankful, checkedTweetViaCamps } = payload.templateToggle;
  const isShowPostTweet = checkedTweetViaCamps && payload.content;

  return (
    <React.Fragment>
      {loading && <LoadingIndicator />}
      {!loading && (
        <div className="row">
          <Modals
            intl={intl}
            form={{
              formMessageTemplate,
              inputFormFields: inputFormFields.value.toString(),
              inputFormFields2: showThankful
                ? inputFormFields2.value.toString()
                : [],
              inputFormFields3: showThankful
                ? inputFormFields3.value.toString()
                : [],
              formList,
              inputFormFieldsRequired: inputFormFieldsRequired.value,
            }}
            tempDetails={tempDetails}
            campaignId={Number(payload.id)}
          />
          <Form className="col-6">
            <div className="title">
              {intl.formatMessage({ ...messages.campaignDetails })}
            </div>
            {errors && (
              <ErrorFormatted
                invalid
                list={errors.list}
                names={['sns_account']}
                customName="snsAccount"
              />
            )}
            <div className="ml-4">
              <div className="row">
                <div className="col-12 label pb-0">
                  {intl.formatMessage({ ...messages.campaignTitle })}
                </div>
                <div className="col-12 pt-0 pb-0 content">{payload.title}</div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.description })}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {payload.description}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.label })}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  {labelList &&
                    labelList.list.map(
                      ({ id, name }) => id === Number(payload.label_id) && name,
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {' '}
                  {intl.formatMessage({ ...messages.campaignPeriod })}
                  {errors && (
                    <>
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['end_period']}
                        customState={{
                          name: intl.formatMessage({
                            id: `campaignPeriodEnd`,
                          }),
                          name2: intl.formatMessage({
                            id: `campaignPeriodStart`,
                          }),
                        }}
                      />
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['start_period']}
                        customState="campaignPeriodStart"
                      />
                    </>
                  )}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  {intl.formatMessage({ ...messages.start })}:&nbsp;{' '}
                  {(!payload.startOnPublish ||
                    [0, 2, 4, 5].includes(payload.status)) && // Ongoing: 0,Scheduled: 1,Ended: 2,Failed: 3,Stop: 4,Save: 5,SyncData: 6,ValidatingData: 7,GeneratingData: 8,
                    formatDateTime(payload.start_period || new Date())}
                  {payload.startOnPublish &&
                    ![0, 2, 4, 5].includes(payload.status) &&
                    `${intl.formatMessage({ ...messages.M0000021 })}`}
                  <br />
                  {/* {formatDateTime(payload.start_period || new Date())}
                  <br /> */}
                  {intl.formatMessage({ ...messages.end })}:&nbsp;{' '}
                  {formatDateTime(payload.end_period || new Date())}
                </div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.entryMethods })}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  {CampaignType &&
                    CampaignType.map(
                      ({ value, name }) =>
                        value === Number(payload.campaign_type) &&
                        intl.formatMessage(
                          { id: `entryMethod${value}` },
                          { defaultMessage: name },
                        ),
                    )}
                  {/* If Entry Method (Campaign Type) is Hashtag */}
                  {Number(payload.campaign_type) === 2 && (
                    <>
                      {errors && (
                        <ErrorFormatted
                          invalid
                          list={errors.list}
                          names={['target_hashtag']}
                          customName="campaignHashtag"
                        />
                      )}
                      <div>
                        {(payload.target_hashtag || '').split(',').join(', ')}
                      </div>
                    </>
                  )}
                </div>
                {Number(payload.campaign_type) === 2 && (
                  <div className="col-12">
                    {intl.formatMessage({
                      ...messages.multipleHashtagLogicSettings,
                    })}
                    <div>
                      <span>
                        {intl.formatMessage(
                          {
                            id: `hashtagCondition${payload.hashtag_condition}`,
                          },
                          // eslint-disable-next-line no-restricted-globals
                          { defaultMessage: name },
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.raffleType })}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  {RaffleType &&
                    RaffleType.map(
                      ({ name, value }) =>
                        value === Number(payload.raffle_type) && [
                          intl.formatMessage({
                            id: `raffleType${value}`,
                            defaultMessage: name,
                          }),
                        ],
                    )}
                </div>
              </div>
              {Number(payload.raffle_type) ===
                Number(EnumRaffleTypes.FIXED) && (
                <>
                  <div className="row">
                    <div className="col-12 pb-0 label">
                      {intl.formatMessage({ ...messages.noOfRaffle })}
                    </div>
                    <div className="col-12 pt-0 pb-0 content">
                      {payload.raffleTimes}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 pb-0 label">
                      {intl.formatMessage({ ...messages.raffleInterval })}
                    </div>
                    <div className="col-12 pt-0 pb-0 content">
                      {intl.formatMessage(
                        {
                          id:
                            Number(payload.raffle_interval) === 1
                              ? 'noOfHour'
                              : 'noOfHours',
                        },
                        { num: payload.raffle_interval },
                      )}
                    </div>
                  </div>
                </>
              )}
              {[2, 3].includes(Number(payload.raffle_type)) && ( // Raffle Type is Fixed | End
                <div className="row">
                  <div className="col-12 label pb-0">
                    {intl.formatMessage({ ...messages.autoRaffle })}
                  </div>
                  <div className="col-12 content pb-0 pt-0">
                    {payload.auto_raffle
                      ? intl.formatMessage({ ...messages.yes })
                      : intl.formatMessage({ ...messages.no })}
                  </div>
                </div>
              )}
              {Number(payload.campaign_type) === 2 &&
                (payload.raffle_type === Number(EnumRaffleTypes.INSTANT) ||
                  payload.raffle_type === Number(EnumRaffleTypes.FIXED)) && (
                  <div className="row">
                    <div className="col-12 pb-0 label">
                      {intl.formatMessage({ ...messages.winningLimit })}
                    </div>
                    <div className="col-12 pt-0 pb-0 content">
                      {payload.account_winning_limit}
                    </div>
                  </div>
                )}
              {/* Account to be followed = Hide */}
              {/* {errors && (
                <ErrorFormatted
                  invalid
                  list={errors.list}
                  names={['entry_condition']}
                  customName="accountFollowed"
                />
              )}
              <div className="row">
                <div className="col-4 label">
                  {intl.formatMessage({ ...messages.entryCondition })}
                </div>
                <div className="col content">
                  <div className="row">
                    <div className="col-5">
                      {payload.entry_condition &&
                        payload.entry_condition.map((tag, index) => (
                          <p key={Number(index)}>@{tag}</p>
                        ))}
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.winnerCondition })}
                </div>
                <div className="col-12 pt-0 pb-0 content">
                  {WinnerConditionType &&
                    WinnerConditionType.map(
                      ({ name, value }) =>
                        value ===
                          Number(
                            payload.winning_condition.winner_condition_type,
                          ) && [
                          intl.formatMessage({
                            id: `winnerCondition${value}`,
                            defaultMessage: name,
                          }),
                        ],
                    )}
                  {/* If Winning Condition is Custom Modified */}
                  {Number(payload.winning_condition.winner_condition_type) ===
                    2 &&
                    payload.winning_condition.follower_condition !== null &&
                    payload.winning_condition.follower_condition.map(cond => (
                      <div className="row">
                        <div className="col-8">
                          <p>
                            {intl.formatMessage({
                              ...messages.noOfFollowers,
                            })}
                          </p>
                          {/* If Retweet-Instant, Hashtag-Instant */}
                          {((Number(payload.campaign_type) === 1 &&
                            payload.raffle_type === EnumRaffleTypes.INSTANT) ||
                            (Number(payload.campaign_type) === 2 &&
                              payload.raffle_type ===
                                EnumRaffleTypes.INSTANT)) && (
                            <p>{intl.formatMessage({ ...messages.winRate })}</p>
                          )}
                        </div>
                        <div className="col-4">
                          <p>{cond.follower_count}</p>
                          {/* If Retweet-Instant, Hashtag-Instant */}
                          {((Number(payload.campaign_type) === 1 &&
                            payload.raffle_type === EnumRaffleTypes.INSTANT) ||
                            (Number(payload.campaign_type) === 2 &&
                              payload.raffle_type ===
                                EnumRaffleTypes.INSTANT)) && (
                            <p>{cond.increase_percentage}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  {/* If Prevent Previous Winner Type is checked */}
                  {payload.winning_condition.prevent_previous_winner_type !==
                    null && (
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
                                Number(
                                  payload.winning_condition
                                    .prevent_previous_winner_type,
                                ) && [
                                intl.formatMessage({
                                  id: `preventPrevWinnerType${value}`,
                                  defaultMessage: name,
                                }),
                              ],
                          )}
                      </div>
                    </div>
                  )}
                  {/* If Prevent Previous Winner Type is checked AND selected DateTime */}
                  {payload.prevent_previous_winner_type === 2 && (
                    <div className="row">
                      <div className="col-8">
                        {intl.formatMessage({
                          ...messages.preventPreviousWinner,
                        })}
                      </div>
                      <div className="col-4">
                        {payload.winning_condition.prevent_previous_from &&
                          formatDateTime(
                            payload.winning_condition.prevent_previous_from,
                          )}
                        {payload.winning_condition.prevent_previous_to &&
                          formatDateTime(
                            payload.winning_condition.prevent_previous_to,
                          )}
                      </div>
                    </div>
                  )}
                  {/* If Prevent Previous Winner Type is checked AND selected Campaign Ids */}
                  {payload.prevent_previous_winner_type === 3 &&
                    payload.winning_condition
                      .prevent_previous_from_campaigns !== null && (
                      <div className="row">
                        <div className="col-8">
                          {intl.formatMessage({
                            ...messages.preventPreviousWinner,
                          })}
                        </div>
                        <div className="col-4">
                          {intl.formatMessage({ ...messages.M0000044 })}:
                          <div className="row">
                            <ul>
                              {payload.winning_condition.prevent_previous_from_campaigns.map(
                                itm => (
                                  <li>
                                    {
                                      campaignList.list.find(m => m.id === itm)
                                        .name
                                    }
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.autoDMWinner })}
                </div>
                <div className="col-12 pb-0 pt-0 content">
                  {payload.auto_send_dm === true
                    ? intl.formatMessage({ ...messages.yes })
                    : intl.formatMessage({ ...messages.no })}
                </div>
              </div>
              {Number(payload.raffle_type) ===
                Number(EnumRaffleTypes.FIXED) && (
                <div className="row">
                  <div className="col-12 pb-0 label">
                    {intl.formatMessage({ ...messages.raffleDetails })}
                  </div>
                  <div className="col-12 pb-0 pt-0 content">
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
                              {payload.campaign_prize &&
                                payload.campaign_prize.map(({ name }) => (
                                  <td className="text-center font-weight-bold">
                                    <label>{name}</label>
                                  </td>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {payload.fixed_prize &&
                              payload.fixed_prize.map(
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
                                        {intl.locale === 'en' && ordinalNumber
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
                                        {formatDateTime(schedule.toApi)}
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
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.prize })}
                </div>
                <div className="col-12 pb-0 pt-0 content">
                  {payload.campaign_prize &&
                    payload.campaign_prize.map(
                      ({ name, amount, percentage }, index) => (
                        <div className="row" key={Number(index)}>
                          <div className="col-12">{name}</div>
                          <div className="col-6">{amount}</div>
                          {percentage && (
                            <div className="col">{percentage}%</div>
                          )}
                        </div>
                      ),
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 pb-0 label">
                  {intl.formatMessage({ ...messages.totalWinners })}
                </div>
                <div className="col-12 pb-0 pt-0 content">
                  {payload.numberOfWinners}
                </div>
              </div>
            </div>
          </Form>
          <Form className="col-6">
            {errors && (
              <>
                <ErrorFormatted
                  invalid
                  list={errors.list}
                  names={['content']}
                />
                <ErrorFormatted invalid list={errors.list} names={['image']} />
                <ErrorFormatted invalid list={errors.list} names={['video']} />
                <ErrorFormatted invalid list={errors.list} names={['gif']} />
              </>
            )}
            <div className="title">
              {intl.formatMessage({ ...messages.formContentSettings })}
            </div>
            <ol>
              {snsType === 1 && (
                <>
                  <li>
                    <div className="row">
                      <div className="col-12 title pb-0">
                        {intl.formatMessage({ ...messages.post })}
                      </div>
                      <div className="col-12 content pb-0 pt-0">
                        <ColorCircle />{' '}
                        {intl.formatMessage({ ...messages.tweetViaCamps })}
                      </div>
                      <div className="col-12 content pt-0 pb-0">
                        {payload.post_tweet_via_camps
                          ? intl.formatMessage({ ...messages.yes })
                          : intl.formatMessage({ ...messages.no })}
                      </div>
                      {payload.post_id &&
                        payload.post_id !== '' &&
                        !payload.fake_post && (
                          <>
                            <div className="col-12 content pb-0">
                              <ColorCircle />{' '}
                              {intl.formatMessage({ ...messages.link })}
                            </div>
                            <div className="col-12 content pt-0">
                              {snsType === 1 ? (
                                <Button
                                  link
                                  onClick={() =>
                                    window.open(
                                      'https://twitter.com/'
                                        .concat(snsAccountName)
                                        .concat('/status/')
                                        .concat(payload.post_id),
                                      '_blank',
                                    )
                                  }
                                >
                                  <Text
                                    text={'https://twitter.com/'
                                      .concat(snsAccountName)
                                      .concat('/status/')
                                      .concat(payload.post_id)}
                                  />
                                </Button>
                              ) : (
                                <Button
                                  link
                                  onClick={() =>
                                    window.open(
                                      'https://www.instagram.com/p/'.concat(
                                        payload.content,
                                      ),
                                      '_blank',
                                    )
                                  }
                                >
                                  <Text
                                    text={'https://www.instagram.com/p/'.concat(
                                      payload.content,
                                    )}
                                  />
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                    </div>
                  </li>
                  {isShowPostTweet && (
                    <li>
                      <div className="row">
                        <div className="col-12 ml-1">
                          <Tweet
                            twitterLink={
                              payload.post_id
                                ? `${
                                    config.TWITTER_URL
                                  }/${userAccount.name.replace(
                                    '@',
                                    '',
                                  )}/status/${payload.post_id}`
                                : false
                            }
                            userImg={User}
                            name={userAccount.name}
                            username={userAccount.name}
                            content={payload.content}
                            dateTime={
                              payload.startOnPublish
                                ? new Date()
                                : payload.startDate
                            }
                            files={
                              uploadFiles.length > 0
                                ? uploadFiles.map(m =>
                                    Array.isArray(m.url) ? m.url[0] : m.url,
                                  )
                                : null
                            }
                            fileType={payload.media_type}
                          />
                        </div>
                      </div>
                    </li>
                  )}
                </>
              )}
              {snsType !== 1 &&
                payload.post_id &&
                payload.post_id !== '' &&
                !payload.fake_post &&
                payload.content !== '' && (
                  <>
                    <li>
                      <div className="row">
                        <>
                          <div className="col-12 label pb-0">
                            {intl.formatMessage({ ...messages.link })}
                          </div>
                          <div className="col-12 content pt-0 pb-0">
                            <ColorCircle />
                            <Button
                              link
                              onClick={() =>
                                window.open(
                                  'https://www.instagram.com/p/'.concat(
                                    payload.content,
                                  ),
                                  '_blank',
                                )
                              }
                            >
                              <Text
                                text={'https://www.instagram.com/p/'.concat(
                                  payload.content,
                                )}
                              />
                            </Button>
                          </div>
                        </>
                      </div>
                    </li>
                  </>
                )}
              <div>
                {payload.raffle_type === EnumRaffleTypes.INSTANT && (
                  <li>
                    <div className="w-100 pb-0 title">
                      {intl.formatMessage({ ...messages.post })}
                    </div>
                    {payload.templateToggle.showPostWin && (
                      <div className="row">
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            {
                              name: intl.formatMessage({
                                ...messages.winner,
                              }),
                            },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {winTempList &&
                                winTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(
                                        payload.post_winner_message_template,
                                      ) && [name],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(
                                    payload.post_winner_message_template,
                                    true,
                                  )
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {payload.templateToggle.showPostLose && (
                      <div className="row">
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            {
                              name: intl.formatMessage({ ...messages.loser }),
                            },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {loseTempList &&
                                loseTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(
                                        payload.post_loser_message_template,
                                      ) && [name],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(
                                    payload.post_loser_message_template,
                                    true,
                                  )
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {payload.templateToggle.showPostTy && (
                      <div className="row">
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T000016' },
                            {
                              name: intl.formatMessage({
                                ...messages.thankYou,
                              }),
                            },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {tyTempList &&
                                tyTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(
                                        payload.post_ty_message_template,
                                      ) && [name],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(
                                    payload.post_ty_message_template,
                                    true,
                                  )
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                {snsType === 1 && (
                  <li>
                    <div className="w-100 pb-0 title">
                      {intl.formatMessage({ ...messages.directMessage })}
                    </div>
                    <div className="row">
                      <div className="col-12 pb-0 pt-0 content">
                        <ColorCircle />
                        {intl.formatMessage(
                          { id: 'T0000016' },
                          { name: intl.formatMessage({ ...messages.winner }) },
                        )}
                      </div>
                      <div className="col-12 pb-0 pt-0 content">
                        <div className="row">
                          <div className="col-12">
                            {winTempList &&
                              winTempList.map(
                                ({ id, name }) =>
                                  id ===
                                    Number(payload.winner_message_template) && [
                                    name,
                                  ],
                              )}
                          </div>
                          <div className="col-12">
                            <Button
                              link
                              onClick={() =>
                                onGetTemplate(payload.winner_message_template)
                              }
                            >
                              {intl.formatMessage({ ...messages.preview })}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {payload.templateToggle.showDMLose && (
                      <div className="row">
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            { name: intl.formatMessage({ ...messages.loser }) },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {loseTempList &&
                                loseTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(
                                        payload.loser_message_template,
                                      ) && [name],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(payload.loser_message_template)
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {payload.templateToggle.showDMTy && (
                      <div className="row">
                        {payload.form_fields && payload.form_fields.length > 0 && (
                          <div className="col-12 pb-0 pt-0 content">
                            <ColorCircle />
                            {intl.formatMessage({
                              ...messages.personalInformation,
                            })}
                            <br />
                            {FormFields.filter(({ value }) =>
                              payload.form_fields.includes(
                                Number(value.toString()),
                              ),
                            )
                              .map(({ name, value }) =>
                                intl.formatMessage(
                                  { id: `formFields${value}` },
                                  { defaultMessage: name },
                                ),
                              )
                              .join(', ')}
                          </div>
                        )}
                        {payload.form_fields2 &&
                          payload.form_fields2.length > 0 && (
                            <div className="col-12 pb-0 pt-0 content">
                              <ColorCircle />
                              {intl.formatMessage({
                                ...messages.thankfulPerson,
                              })}{' '}
                              1
                              <br />
                              {FormFields2.filter(({ value }) =>
                                payload.form_fields2.includes(
                                  Number(value.toString()),
                                ),
                              )
                                .map(({ name, value }) =>
                                  intl.formatMessage(
                                    { id: `formFields${value}` },
                                    { defaultMessage: name },
                                  ),
                                )
                                .join(', ')}
                            </div>
                          )}
                        {payload.form_fields3 &&
                          payload.form_fields3.length > 0 && (
                            <div className="col-12 pb-0 pt-0 content">
                              <ColorCircle />
                              {intl.formatMessage({
                                ...messages.thankfulPerson,
                              })}{' '}
                              2
                              <br />
                              {FormFields3.filter(({ value }) =>
                                payload.form_fields3.includes(
                                  Number(value.toString()),
                                ),
                              )
                                .map(({ name, value }) =>
                                  intl.formatMessage(
                                    { id: `formFields${value}` },
                                    { defaultMessage: name },
                                  ),
                                )
                                .join(', ')}
                            </div>
                          )}
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            {
                              name: intl.formatMessage({
                                ...messages.thankYou,
                              }),
                            },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {tyTempList &&
                                tyTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(payload.ty_message_template) && [
                                      name,
                                    ],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(payload.ty_message_template)
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {payload.templateToggle.showDMForm && (
                      <div className="row">
                        <div className="col-12 pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            {
                              name: intl.formatMessage({
                                ...messages.formComplete,
                              }),
                            },
                          )}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <div className="row">
                            <div className="col-12">
                              {formCompTempList &&
                                formCompTempList.map(
                                  ({ id, name }) =>
                                    id ===
                                      Number(payload.fc_message_template) && [
                                      name,
                                    ],
                                )}
                            </div>
                            <div className="col-12">
                              <Button
                                link
                                onClick={() =>
                                  onGetTemplate(payload.fc_message_template)
                                }
                              >
                                {intl.formatMessage({ ...messages.preview })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                <li>
                  <div className="w-100 pb-0 title">
                    {intl.formatMessage({ ...messages.form })}
                  </div>
                  <div className="row">
                    <div className="col-12 pb-0 pt-0">
                      <ColorCircle />
                      {formList &&
                        formList.map(
                          ({ id, name }) =>
                            id === Number(payload.template_form_id) && [name],
                        )}
                    </div>
                    <div className="col-12 pb-0 pt-0 content">
                      <div className="row">
                        <div className="col-12">
                          <Button
                            link
                            onClick={() => modalToggler('formPreviewModal')}
                          >
                            {intl.formatMessage({ ...messages.preview })}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {payload.form_fields && payload.form_fields.length > 0 && (
                      <div className="col-12 pb-0 pt-0 content">
                        <ColorCircle />
                        {intl.formatMessage({
                          ...messages.personalInformation,
                        })}
                        <br />
                        {FormFields.filter(s => filterFormFields(s.value))
                          .filter(({ value }) =>
                            payload.form_fields.includes(
                              Number(value.toString()),
                            ),
                          )
                          .map(({ name, value }) =>
                            intl.formatMessage(
                              { id: `formFields${value}` },
                              { defaultMessage: name },
                            ),
                          )
                          .join(', ')}
                      </div>
                    )}
                    {showThankful &&
                      payload.form_fields2 &&
                      payload.form_fields2.length > 0 && (
                        <div className="col-12 pb-0 pt-0 content">
                          <ColorCircle />
                          {intl.formatMessage({ ...messages.thankfulPerson })} 1
                          <br />
                          {FormFields2.filter(({ value }) =>
                            payload.form_fields2.includes(
                              Number(value.toString()),
                            ),
                          )
                            .map(({ name, value }) =>
                              intl.formatMessage(
                                { id: `formFields${value}` },
                                { defaultMessage: name },
                              ),
                            )
                            .join(', ')}
                        </div>
                      )}
                    {showThankful &&
                      payload.form_fields3 &&
                      payload.form_fields3.length > 0 && (
                        <div className="col-12 pb-0 pt-0 content">
                          <ColorCircle />
                          {intl.formatMessage({ ...messages.thankfulPerson })} 2
                          <br />
                          {FormFields3.filter(({ value }) =>
                            payload.form_fields3.includes(
                              Number(value.toString()),
                            ),
                          )
                            .map(({ name, value }) =>
                              intl.formatMessage(
                                { id: `formFields${value}` },
                                { defaultMessage: name },
                              ),
                            )
                            .join(', ')}
                        </div>
                      )}
                  </div>
                </li>
              </div>
            </ol>
          </Form>
        </div>
      )}
    </React.Fragment>
  );
};

Flow3.propTypes = {
  payload: PropTypes.any,
  fields: PropTypes.any,
  store: PropTypes.any,
  filterFormFields: PropTypes.func,
  // theme: PropTypes.object,
  // entryMethod: PropTypes.number,
  // setEntryMethod: PropTypes.func,
  // validatorEffect: PropTypes.object,
  // labels: PropTypes.object,
  // CampaignTypes: PropTypes.array,
};

export default Flow3;
