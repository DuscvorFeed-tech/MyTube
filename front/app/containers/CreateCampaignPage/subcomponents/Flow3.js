import React from 'react';
import moment from 'moment';
import { formatDateTime, modalToggler } from 'utils/commonHelper';
import PropTypes from 'prop-types';

import ColorLabel from 'components/ColorLabel';
import Form from 'components/Form';
import Button from 'components/Button';
import Tweet from 'components/Tweet';
import Modal from 'components/Modal';
import LoadingIndicator from 'components/LoadingIndicator';
import ModalToggler from 'components/Modal/ModalToggler';
import TemplatePreview from 'components/TemplatePreview';
import FormPreview from 'containers/FormPreviewPage';
import ErrorFormatted from 'components/ErrorFormatted';
import ColorCircle from 'components/ColorCircle';
import Text from 'components/Text';

import User from 'assets/images/icons/user_primary.png';
import Table from './CustomTable';

import messages from '../messages';

const momentDateFormatted = dt => moment(dt, 'MM/DD/YYYY HH:mm');

const isValidEndDate = (startOnPublish, startDate, endDate) =>
  startOnPublish
    ? momentDateFormatted(endDate).diff(moment()) > 0
    : momentDateFormatted(endDate).diff(momentDateFormatted(startDate)) > 0;

const isValidStartDate = (startOnPublish, startDate) => {
  const jptimedifference = -540; // By minutes
  const timedifference = jptimedifference - new Date().getTimezoneOffset(); // By minutes
  return (
    startOnPublish ||
    momentDateFormatted(startDate).diff(
      new Date(new Date().getTime() - timedifference * 60 * 1000),
    ) > 0
  );
};

// eslint-disable-next-line arrow-body-style
const Flow3 = ({
  intl,
  detail,
  labels,
  CampaignTypes,
  RaffleTypes,
  WinnerConditionTypes,
  PreventPreviousWinnerTypes,
  campaignList,
  content,
  snsPrimary,
  winnerTemplates,
  loserTemplates,
  thankyouTemplates,
  formCompleteTemplates,
  formTemplates,
  formFields,
  formFields2,
  formFields3,
  getContentFromTemplate,
  setModalState,
  previewContent,
  uploadFiles,
  fileType,
  raffleTimes,
  snsType,
  errors,
  loading,
}) => (
  <>
    {loading && <LoadingIndicator />}
    {!loading && (
      <div className="row">
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
              <div className="col-12 content pt-0 pb-0">{detail.title}</div>
            </div>
            <div className="row">
              <div className="col-12 label pb-0">
                {intl.formatMessage({ ...messages.description })}
              </div>
              <div className="col-12 content pt-0 pb-0">
                {detail.description && detail.description.length > 0 ? (
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {detail.description}
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
              {detail.label_id && (
                <div className="col-12 content pb-0 pt-0">
                  <ColorLabel
                    color={
                      labels &&
                      labels.list
                        .filter(p => p.id === Number(detail.label_id))
                        .map(p => p.color_code)
                    }
                    className="mr-2"
                  />
                  {labels &&
                    labels.list.map(
                      ({ id, name }) =>
                        id === Number(detail.label_id) && [name],
                    )}
                </div>
              )}
              {!detail.label_id && (
                <div className="col-12 content pt-0 pb-0">_</div>
              )}
            </div>
            <div className="row">
              <div className="col-12 label pb-0">
                {intl.formatMessage({ ...messages.campaignPeriod })}
                {errors && (
                  <>
                    {!isValidEndDate(
                      detail.startOnPublish,
                      detail.start_period,
                      detail.end_period,
                    ) && (
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
                    )}
                    {!isValidStartDate(
                      detail.startOnPublish,
                      detail.start_period,
                    ) && (
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['start_period']}
                        // customState="campaignPeriodStart"
                        customState={{
                          name: intl.formatMessage({
                            id: `campaignPeriodStart`,
                          }),
                          name2: intl.formatMessage({
                            id: `currentTime`,
                          }),
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="col-12 content pb-0 pt-0">
                {intl.formatMessage({ ...messages.start })}:&nbsp;{' '}
                {!detail.startOnPublish &&
                  formatDateTime(detail.start_period || new Date())}
                {detail.startOnPublish &&
                  `${intl.formatMessage({ ...messages.M0000021 })}`}
                <br />
                {intl.formatMessage({ ...messages.end })}:&nbsp;{' '}
                {formatDateTime(detail.end_period || new Date())}
                {/* {!detail.startOnPublish &&
                  detail.start_period &&
                  `${formatDateTime(detail.start_period)} - `}
                {detail.startOnPublish &&
                  `${intl.formatMessage({ ...messages.M0000021 })} - `}
                {detail.end_period && formatDateTime(detail.end_period)} */}
              </div>
            </div>
            <div className="row">
              <div className="col-12 label pb-0">
                {intl.formatMessage({ ...messages.entryMethods })}
                {errors && (
                  <ErrorFormatted
                    invalid
                    list={errors.list}
                    names={['campaign_type']}
                    customState={{
                      methodName: intl.formatMessage({
                        id: `entryMethod${detail.campaign_type}`,
                      }),
                    }}
                  />
                )}
              </div>
              <div className="col-12 content pt-0 pb-0">
                <div className="row">
                  <div className="col-12">
                    {CampaignTypes &&
                      CampaignTypes.map(
                        ({ value, name }) =>
                          value === Number(detail.campaign_type) &&
                          intl.formatMessage(
                            { id: `entryMethod${value}` },
                            { defaultMessage: name },
                          ),
                      )}
                    {/* If Entry Method (Campaign Type) is Hashtag */}
                    {Number(detail.campaign_type) === 2 && (
                      <>
                        {errors && (
                          <ErrorFormatted
                            invalid
                            list={errors.list}
                            names={['target_hashtag']}
                            customName="campaignHashtag"
                          />
                        )}
                        <div>{(detail.target_hashtag || []).join(', ')}</div>
                      </>
                    )}
                  </div>
                  {Number(detail.campaign_type) === 2 && (
                    <div className="col-12">
                      {intl.formatMessage({
                        ...messages.multipleHashtagLogicSettings,
                      })}
                      <div>
                        <span>
                          {intl.formatMessage(
                            {
                              id: `hashtagCondition${detail.hashtag_condition}`,
                            },
                            // eslint-disable-next-line no-restricted-globals
                            { defaultMessage: name },
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 label pb-0">
                {intl.formatMessage({ ...messages.raffleType })}
              </div>
              <div className="col-12 content pb-0 pt-0">
                {RaffleTypes &&
                  RaffleTypes.map(
                    ({ name, value }) =>
                      value === Number(detail.raffle_type) && [
                        intl.formatMessage({
                          id: `raffleType${value}`,
                          defaultMessage: name,
                        }),
                      ],
                  )}
              </div>
            </div>
            {detail.raffle_type === EnumRaffleTypes.FIXED && (
              <>
                <div className="row">
                  <div className="col-12 label pb-0">
                    {intl.formatMessage({ ...messages.noOfRaffle })}
                  </div>
                  <div className="col-12 content pb-0 pt-0">{raffleTimes}</div>
                </div>
                <div className="row">
                  <div className="col-12 label pb-0">
                    {intl.formatMessage({ ...messages.raffleInterval })}
                  </div>
                  <div className="col-12 content pb-0 pt-0">
                    {/* {`${detail.raffle_interval} `}
                  {Number(detail.raffle_interval) === 1 ? 'hour' : 'hours'} */}
                    {intl.formatMessage(
                      {
                        id:
                          Number(detail.raffle_interval) === 1
                            ? 'noOfHour'
                            : 'noOfHours',
                      },
                      { num: detail.raffle_interval },
                    )}
                  </div>
                </div>
              </>
            )}

            {[2, 3].includes(Number(detail.raffle_type)) && ( // Raffle Type is Fixed | End
              <div className="row">
                <div className="col-12 label pb-0">
                  {intl.formatMessage({ ...messages.autoRaffle })}
                </div>
                <div className="col-12 content pb-0 pt-0">
                  {detail.auto_raffle
                    ? intl.formatMessage({ ...messages.yes })
                    : intl.formatMessage({ ...messages.no })}
                </div>
              </div>
            )}

            {/* If Entry Method (Campaign Type) is Hashtag, Raffle Type is Instant OR Fixed */}
            {Number(detail.campaign_type) === 2 &&
              (detail.raffle_type === EnumRaffleTypes.INSTANT ||
                detail.raffle_type === EnumRaffleTypes.FIXED) && (
              /* eslint-disable */
                  <div className="row">
                    <div className="col-12 label pb-0">
                      {intl.formatMessage({ ...messages.winningLimit })}
                    </div>
                    <div className="col-12 content pb-0 pt-0">
                      {detail.account_winning_limit}
                    </div>
                  </div>
                )}
              {errors &&
                <ErrorFormatted
                  invalid
                  list={errors.list}
                  names={['entry_condition']}
                  customName="accountFollowed"
                />
              }
              {detail.entry_condition.length !== 0 && (
                <div className="row">
                  <div className="col-12 label pb-0">
                    {intl.formatMessage({ ...messages.entryCondition })}
                  </div>
                  <div className="col-12 content pb-0 pt-0">
                    <div className="row">
                      <div className="col-5">
                        {detail.entry_condition.map((tag, index) => (
                          <p key={Number(index)}>@{tag}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {snsType === 1 && (<div className="row">
                <div className="col-12 label pb-0">
                  {intl.formatMessage({ ...messages.winnerCondition })}
                </div>
                <div className="col-12 content pb-0 pt-0">
                  <div className="row">
                    <div className="col-5">
                      <strong>
                        {WinnerConditionTypes &&
                          WinnerConditionTypes.map(
                            ({ name, value }) =>
                              value ===
                              Number(
                                detail.winning_condition.winner_condition_type,
                              ) && [
                                intl.formatMessage({
                                  id: `winnerCondition${value}`,
                                  defaultMessage: name,
                                }),
                              ],
                          )}
                      </strong>
                    </div>
                  </div>
                  {/* If Winning Condition is Custom Modified */}
                  {Number(detail.winning_condition.winner_condition_type) === 2 &&
                    detail.winning_condition.follower_condition !== null &&
                    detail.winning_condition.follower_condition.map(cond => (
                      <div className="row">
                        <div className="col-8">
                          {intl.formatMessage({ ...messages.noOfFollowers })}
                          {/* If Retweet-Instant, Hashtag-Instant */}
                          {((Number(detail.campaign_type) === 1 &&
                            detail.raffle_type === EnumRaffleTypes.INSTANT) ||
                            (Number(detail.campaign_type) === 2 &&
                              detail.raffle_type === EnumRaffleTypes.INSTANT)) &&
                            intl.formatMessage({ ...messages.winRate })}
                        </div>
                        <div className="col-4">
                          {cond.follower_count}
                          {/* If Retweet-Instant, Hashtag-Instant */}
                          {((Number(detail.campaign_type) === 1 &&
                            detail.raffle_type === EnumRaffleTypes.INSTANT) ||
                            (Number(detail.campaign_type) === 2 &&
                              detail.raffle_type === EnumRaffleTypes.INSTANT)) &&
                            `${cond.increase_percentage}%`}
                        </div>
                      </div>
                    ))}
                  {/* If Prevent Previous Winner Type is checked */}
                  {detail.winning_condition.prevent_previous_winner_type !==
                    null && (
                      <div className="row">
                        <div className="col-8">
                          {intl.formatMessage({ ...messages.preventPreviousWinner })}
                        </div>
                        <div className="col-4">
                          {PreventPreviousWinnerTypes &&
                            PreventPreviousWinnerTypes.map(
                              ({ name, value }) =>
                                value ===
                                Number(
                                  detail.winning_condition
                                    .prevent_previous_winner_type,
                                ) && [
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
                  {detail.winning_condition.prevent_previous_winner_type === 2 && (
                    <div className="row">
                      <div className="col-8">
                        {intl.formatMessage({ ...messages.preventPreviousWinner })}
                      </div>
                      <div className="col-4">
                        {detail.winning_condition.prevent_previous_from &&
                          formatDateTime(detail.winning_condition.prevent_previous_from)
                        } - 
                        {detail.winning_condition.prevent_previous_to &&
                          formatDateTime(detail.winning_condition.prevent_previous_to)
                        }
                      </div>
                    </div>
                  )}
                  {/* If Prevent Previous Winner Type is checked AND selected Campaign Ids */}
                  {detail.winning_condition.prevent_previous_winner_type === 3 &&
                    detail.winning_condition.prevent_previous_from_campaigns !==
                    null && (
                      <div className="row">
                        <div className="col-4 offset-8">
                          <ul>
                            {detail.winning_condition.prevent_previous_from_campaigns.map(
                              itm => (
                                <li>
                                  {campaignList.list.find(m => m.id === itm).title}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}
                </div>
              </div>)}

              {snsType === 1 && (<div className="row">
                <div className="col-12 label pb-0">
                  {intl.formatMessage({ ...messages.autoDMWinner })}
                </div>
                <div className="col-12 content pb-0 pt-0">
                  {detail.autoSendDM === true
                    ? intl.formatMessage({ ...messages.yes })
                    : intl.formatMessage({ ...messages.no })}
                </div>
              </div>)}

              {detail.raffle_type === EnumRaffleTypes.FIXED && (
                <div className="row">
                  <div className="col-12 label pb-0">
                    {intl.formatMessage({ ...messages.raffleDetails })}
                  </div>
                  <div className="col-12 content pb-0 pt-0">
                    <Button link onClick={() => modalToggler('prizeDistribution')}>
                      {intl.formatMessage({ ...messages.viewDetails })}
                    </Button>
                    <Modal id="prizeDistribution" dismissable size="lg">
                      <ModalToggler modalId="prizeDistribution" />
                      <div>
                        <Table className="summary" isResponsive>
                          <thead>
                            <tr>
                              <td colSpan="2" />
                              {detail.campaign_prize &&
                                detail.campaign_prize.map(({ name }) => (
                                  <td className="text-center font-weight-bold">
                                    <label>{name}</label>
                                  </td>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {detail.fixed_prize &&
                              detail.fixed_prize.map(
                                ({ schedule, prizeInfo: prizes, ordinalNumber }, index) => (
                                  <tr key={Number(index)}>
                                    <td>
                                      <label>
                                        {index + 1}
                                        {intl.locale === 'en' && ordinalNumber
                                          ? intl.formatMessage({ id: `ordinal${ordinalNumber}` })
                                          : ''}
                                        {` ${intl.formatMessage({ id: 'raffle' })}`}
                                      </label>
                                    </td>
                                    <td>
                                      <div>
                                        {
                                        formatDateTime(schedule.toApi)
                                        }
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
                  {intl.formatMessage({ ...messages.prize })}
                </div>
                <div className="col-12 content pb-0 pt-0">
                  {detail.campaign_prize &&
                    detail.campaign_prize.map(
                      ({ name, amount, percentage }, index) => (
                        <div className="row" key={Number(index)}>
                          <div className="col-12">
                            <strong>{name}</strong>
                          </div>
                          <div className="col-6">{amount}</div>
                          {percentage && <div className="col">{percentage}%</div>}
                        </div>
                      ),
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 label pb-0">
                  {intl.formatMessage({ ...messages.totalWinners })}
                </div>
                <div className="col-12 content pb-0 pt-0">{detail.numberOfWinners}</div>
              </div>
            </div>
          </Form>
          {snsType === 1 && (
            <Form className="col-6">
              <div className="title">
                {intl.formatMessage({ ...messages.formContentSettings })}
              </div>
              <ol>
                <li>
                  {errors &&
                    <>
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['content']}
                      />
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['image']}
                      />
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['video']}
                      />
                      <ErrorFormatted
                        invalid
                        list={errors.list}
                        names={['gif']}
                      />
                    </>
                  }
                  <div className="w-100">
                    <div className="title pb-0">
                      {intl.formatMessage({ ...messages.post })}
                    </div>
                    <div className="col-12 content pb-0 pt-0">
                      <ColorCircle /> {intl.formatMessage({ ...messages.tweetViaCamps })}
                    </div>
                    <div className="col-12 content pt-0 pb-0">
                      {detail.post_tweet_via_camps?intl.formatMessage({ ...messages.yes }):intl.formatMessage({ ...messages.no })}
                    </div>
                    {!detail.post_tweet_via_camps && detail.post_id && detail.post_id !== "" && !detail.fake_post && (
                      <>
                        <div className="col-12 content pb-0">
                          <ColorCircle /> {intl.formatMessage({ ...messages.link })}
                        </div>
                        <div className="col-12 content pt-0">
                          {snsType === 1 ? (
                            <Button link
                              onClick={() => window.open(detail.post_id, '_blank')}
                            >
                              <Text
                                text={detail.post_id}
                                className="text-left"
                              />
                            </Button>
                          ): null}
                        </div>
                      </>
                    )}
                  </div>
                </li>
                {detail.post_tweet_via_camps && (
                  <li>
                      <div className="title pb-0 pt-0 mt-1">
                        {intl.formatMessage({ ...messages.content })}
                      </div>
                      <div className="w-100">
                        <div className="ml-1">
                          <Tweet
                            userImg={User}
                            name={snsPrimary.name}
                            content={content.value}
                            dateTime={
                              detail.startOnPublish?new Date():detail.start_period
                            }
                            files={uploadFiles.length > 0 ? uploadFiles : null}
                            fileType={fileType}
                          />
                        </div>
                      </div>
                  </li>
                )}
                <div>
                  <div className="">
                    {detail.raffle_type === EnumRaffleTypes.INSTANT && (
                      <li>
                        <div className="title pb-0 pt-0 mt-1">
                          {intl.formatMessage({ ...messages.post })}
                        </div>
                        {detail.templateToggle.showPostWin && (
                          <div className="w-100 ml-2">
                            <div className="w-100 label pb-0 pt-0">
                              {intl.formatMessage(
                                { id: 'T0000016' },
                                { name: intl.formatMessage({ ...messages.winner }) },
                              )}
                            </div>
                            <div className="col-12 content pb-0 pt-0">
                              <div className="w-100">
                                <div className="w-100 pb-0 pt-0">
                                  {winnerTemplates &&
                                    winnerTemplates.map(
                                      ({ id, name }) =>
                                        id ===
                                        Number(
                                          detail.post_winner_message_template,
                                        ) && [name],
                                    )}
                                </div>
                                <div className="col-12 pb-0 pt-0">
                                  <Button
                                    link
                                    onClick={() =>
                                      setModalState(
                                        'postPreviewModal',
                                        getContentFromTemplate(
                                          detail.post_winner_message_template,
                                          winnerTemplates,
                                        ),
                                      )
                                    }
                                  >
                                    {intl.formatMessage({ id: 'preview' })}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {detail.templateToggle.showPostLose && (
                          <div className="w-100 ml-2">
                            <div className="w-100 label pb-0 pt-0">
                              {intl.formatMessage(
                                { id: 'T0000016' },
                                { name: intl.formatMessage({ ...messages.loser }) },
                              )}
                            </div>
                            <div className="col-12 content pb-0 pt-0">
                              <div className="w-100">
                                <div className="col-12 pb-0 pt-0">
                                  {loserTemplates &&
                                    loserTemplates.map(
                                      ({ id, name }) =>
                                        id ===
                                        Number(
                                          detail.post_loser_message_template,
                                        ) && [name],
                                    )}
                                </div>
                                <div className="col-12 pb-0 pt-0">
                                  <Button
                                    link
                                    onClick={() =>
                                      setModalState(
                                        'postPreviewModal',
                                        getContentFromTemplate(
                                          detail.post_loser_message_template,
                                          loserTemplates,
                                        ),
                                      )
                                    }
                                  >
                                    {intl.formatMessage({ id: 'preview' })}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {detail.templateToggle.showPostTy && (
                          <div className="row ml-2">
                            <div className="w-100 label pb-0 pt-0">
                              {intl.formatMessage(
                                { id: 'T000016' },
                                {
                                  name: intl.formatMessage({ ...messages.thankYou }),
                                },
                              )}
                            </div>
                            <div className="col-12 content pb-0 pt-0">
                              <div className="w-100">
                                <div className="col-12 pb-0 pt-0">
                                  {thankyouTemplates &&
                                    thankyouTemplates.map(
                                      ({ id, name }) =>
                                        id ===
                                        Number(detail.post_ty_message_template) && [
                                          name,
                                        ],
                                    )}
                                </div>
                                <div className="col-12 pb-0 pt-0">
                                  <Button
                                    link
                                    onClick={() =>
                                      setModalState(
                                        'postPreviewModal',
                                        getContentFromTemplate(
                                          detail.post_ty_message_template,
                                          thankyouTemplates,
                                        ),
                                      )
                                    }
                                  >
                                    {intl.formatMessage({ id: 'preview' })}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    )}
                    <li>
                      <div className="title pb-0 pt-0 mt-1">
                        {intl.formatMessage({ ...messages.directMessage })}
                      </div>
                      <div className="w-100">
                        <div className="col-12 label pb-0 pt-0">
                          <ColorCircle />
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            { name: intl.formatMessage({ ...messages.winner }) },
                          )}
                        </div>
                        <div className="col-12 content pb-0 pt-0">
                          <div>
                            <div className="w-100 pb-0 pt-0">
                              {winnerTemplates &&
                                winnerTemplates.map(
                                  ({ id, name }) =>
                                    id === Number(detail.winner_message_template) && [
                                      name,
                                    ],
                                )}
                            </div>
                            <div className="w-100 pb-0 pt-0">
                              <Button
                                link
                                onClick={() =>
                                  setModalState(
                                    'winTemplateModal',
                                    getContentFromTemplate(
                                      detail.winner_message_template,
                                      winnerTemplates,
                                    ),
                                  )
                                }
                              >
                                {intl.formatMessage({ id: 'preview' })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {detail.templateToggle.showDMLose && (
                        <div className="w-100">
                          <div className="col-12 label pb-0">
                            <ColorCircle />
                            {intl.formatMessage(
                              { id: 'T0000016' },
                              { name: intl.formatMessage({ ...messages.loser }) },
                            )}
                          </div>
                          <div className="col-12 content pb-0 pt-0">
                            <div>
                              <div className="w-100 pb-0 pt-0">
                                {loserTemplates &&
                                  loserTemplates.map(
                                    ({ id, name }) =>
                                      id ===
                                      Number(detail.loser_message_template) && [
                                        name,
                                      ],
                                  )}
                              </div>
                              <div className="w-100 pb-0 pt-0">
                                <Button
                                  link
                                  onClick={() =>
                                    setModalState(
                                      'winTemplateModal',
                                      getContentFromTemplate(
                                        detail.loser_message_template,
                                        loserTemplates,
                                      ),
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {detail.templateToggle.showDMTy && (
                        <div className="w-100">
                          <div className="col-12 pb-0 label">
                            <ColorCircle />
                            {intl.formatMessage(
                              { id: 'T0000016' },
                              { name: intl.formatMessage({ ...messages.thankYou }) },
                            )}
                          </div>
                          <div className="col-12 pb-0 pt-0 content">
                            <div>
                              <div className="col-12 pb-0 pt-0">
                                {thankyouTemplates &&
                                  thankyouTemplates.map(
                                    ({ id, name }) =>
                                      id === Number(detail.ty_message_template) && [
                                        name,
                                      ],
                                  )}
                              </div>
                              <div className="col-12 pb-0 pt-0">
                                <Button
                                  link
                                  onClick={() =>
                                    setModalState(
                                      'winTemplateModal',
                                      getContentFromTemplate(
                                        detail.ty_message_template,
                                        thankyouTemplates,
                                      ),
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {detail.templateToggle.showDMForm && (
                        <div className="w-100">
                          <div className="col-12 pb-0 label">
                            <ColorCircle />
                            {intl.formatMessage(
                              { id: 'T0000016' },
                              {
                                name: intl.formatMessage({ ...messages.formSubmit }),
                              },
                            )}
                          </div>
                          <div className="col-12 pb-0 pt-0 content">
                            <div>
                              <div className="col-12 pb-0 pt-0 pl-0">
                                {formCompleteTemplates &&
                                  formCompleteTemplates.map(
                                    ({ id, name }) =>
                                      id === Number(detail.fc_message_template) && [
                                        name,
                                      ],
                                  )}
                              </div>
                              <div className="col-12 pb-0 pt-0 pl-0">
                                <Button
                                  link
                                  onClick={() =>
                                    setModalState(
                                      'winTemplateModal',
                                      getContentFromTemplate(
                                        detail.fc_message_template,
                                        formCompleteTemplates,
                                      ),
                                    )
                                  }
                                >
                                  {intl.formatMessage({ id: 'preview' })}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                    <li>
                      <div className="w-100">
                        <div className="pb-0 label">
                          {intl.formatMessage(
                            { id: 'T0000016' },
                            { name: intl.formatMessage({ ...messages.form }) },
                          )}
                        </div>
                        <div className="content p-0">
                          <div className="col-12 pb-0 pt-0">
                            <ColorCircle />
                            {formTemplates &&
                              formTemplates.map(
                                ({ id, name }) =>
                                  id === Number(detail.template_form_id) && [name],
                              )}
                          </div>
                          <div className="col-12 pb-0 pt-0">
                            <Button
                              link
                              onClick={() => modalToggler('formPreviewModal')}
                            >
                              {intl.formatMessage({ id: 'preview' })}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="w-100">
                        <div className="col-12 pb-0 label">
                          <ColorCircle /> {intl.formatMessage({ ...messages.inputFields })}
                        </div>
                        <div className="col-12 pb-0 pt-0 content">
                          <b>{intl.formatMessage({ ...messages.personalInformation })}</b>
                          <br />
                          {formFields &&
                            formFields
                              .filter(({ value }) =>
                                detail.form_fields.includes(value.toString()),
                              )
                              .map(({ name, value }) =>
                                intl.formatMessage(
                                  { id: `formFields${value}` },
                                  { defaultMessage: name },
                                ),
                              )
                              .join(', ')}
                        </div>
                        {
                          false && (
                            <>
                              <div className="col-12 pb-0 pt-0 content">
                                <b>{intl.formatMessage({ ...messages.thankfulPerson })} 1</b>
                                <br />
                                {formFields2 &&
                                  formFields2
                                    .filter(({ value }) =>
                                      detail.form_fields2.includes(value.toString()),
                                    )
                                    .map(({ name, value }) =>
                                      intl.formatMessage(
                                        { id: `formFields${value}` },
                                        { defaultMessage: name },
                                      ),
                                    )
                                    .join(', ')}
                              </div>
                              <div className="col-12 pb-0 pt-0 content">
                                <b>{intl.formatMessage({ ...messages.thankfulPerson })} 2</b>
                                <br />
                                {formFields3 &&
                                  formFields3
                                    .filter(({ value }) =>
                                      detail.form_fields3.includes(value.toString()),
                                    )
                                    .map(({ name, value }) =>
                                      intl.formatMessage(
                                        { id: `formFields${value}` },
                                        { defaultMessage: name },
                                      ),
                                    )
                                    .join(', ')}
                              </div>
                            </>
                          )
                        }
                      </div>
                    </li>
                  </div>
                </div>
              </ol>
            </Form>
          )}
          {snsType !== 1 && (
            <Form className="col-6">
              <div className="title">
                {intl.formatMessage({ ...messages.formSettings })}
              </div>
              <div className="row ml-2 pb-0">
                <div className="w-100 label pb-0 pt-0">
                  <ColorCircle />
                  {intl.formatMessage(
                    { id: 'T0000016' },
                    { name: intl.formatMessage({ ...messages.form }) },
                  )}
                </div>
                <div className="content pb-0 pt-0">
                  <div className="row">
                    <div className="col-12">
                      {formTemplates &&
                        formTemplates.map(
                          ({ id, name }) =>
                            id === Number(detail.template_form_id) && [name],
                        )}
                    </div>
                    <div className="col-12">
                      <Button
                        link
                        onClick={() => modalToggler('formPreviewModal')}
                      >
                        {intl.formatMessage({ id: 'preview' })}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row ml-2 m-0">
                <div className="w-100 label m-0 pb-0 pt-0">
                  <ColorCircle />
                  {intl.formatMessage({ ...messages.inputFields })}
                </div>
                <div className="content m-0 pb-0 pt-0">
                  {formFields &&
                    formFields
                      .filter(({ value }) =>
                        detail.form_fields.includes(value.toString()),
                      )
                      .map(({ name, value }) =>
                        intl.formatMessage(
                          { id: `formFields${value}` },
                          { defaultMessage: name },
                        ),
                      )
                      .join(', ')}
                </div>
              </div>
            </Form>)}
        </div>
      )}
      <Modal id="winTemplateModal" dismissable size="md">
        <ModalToggler modalId="winTemplateModal" />
        <TemplatePreview
          content={previewContent.content}
          uploadFiles={previewContent.img || []}
        />
      </Modal>
      <Modal id="loseTemplateModal" dismissable size="md">
        <ModalToggler modalId="loseTemplateModal" />
        <TemplatePreview
          content={previewContent.content}
          uploadFiles={previewContent.img || []}
        />
      </Modal>
      <Modal id="formPreviewModal" dismissable size="md">
        <ModalToggler modalId="formPreviewModal" />
        <FormPreview
          inputFormFields={detail.form_fields}
          inputFormFields2={[]}
          inputFormFields3={[]}
          inputFormFieldsRequired={detail.form_fields_required}
          template={(formTemplates || []).find(
            ({ id }) => id === Number(detail.template_form_id),
          )}
        />
      </Modal>
      <Modal id="postPreviewModal" size="md" dismissable>
        <ModalToggler modalId="postPreviewModal" />
        <Tweet
          userImg={User}
          content={previewContent.content}
          name={snsPrimary.name}
          files={previewContent.img.length > 0 ? previewContent.img : null}
          dateTime={
            detail.startOnPublish?new Date():detail.start_period
          }
        />
      </Modal>
    </>
  );

Flow3.propTypes = {
  intl: PropTypes.any,
  errors: PropTypes.any,
  detail: PropTypes.object,
  labels: PropTypes.object,
  winnerTemplates: PropTypes.array,
  loserTemplates: PropTypes.array,
  thankyouTemplates: PropTypes.array,
  formCompleteTemplates: PropTypes.array,
  formTemplates: PropTypes.array,
  formFields: PropTypes.array,
  formFields2: PropTypes.array,
  formFields3: PropTypes.array,
  CampaignTypes: PropTypes.array,
  RaffleTypes: PropTypes.array,
  WinnerConditionTypes: PropTypes.array,
  PreventPreviousWinnerTypes: PropTypes.array,
  campaignList: PropTypes.object,
  content: PropTypes.object,
  snsPrimary: PropTypes.object,
  getContentFromTemplate: PropTypes.func,
  setModalState: PropTypes.func,
  previewContent: PropTypes.object,
  uploadFiles: PropTypes.any,
  raffleTimes: PropTypes.any,
  fileType: PropTypes.string,
  loading: PropTypes.any,
  snsType: PropTypes.number,
};

export default Flow3;
