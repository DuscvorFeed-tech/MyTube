/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Card from 'components/Card';
import Text from 'components/Text';
import Button from 'components/Button';
import Select from 'components/Select';
import RadioButton from 'components/RadioButton';
import DatePickerRange from 'components/DatePickerRange';
import Search from 'components/Search';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import Chart2 from 'components/Chart2';
import Tags from 'components/Tags';
import Label from 'components/Label';
import { intlShape } from 'react-intl';
import { formatDateTime } from 'utils/commonHelper';

import messages from '../messages';

const Campaign = ({
  // theme,
  intl,
  // eslint-disable-next-line no-unused-vars
  dashboardPage: {
    loadStats,
    statistics,
    statTotals,
    campaignList,
    onSearchCampaign,
    allcampaignList,
  },
  userAccount,
}) => {
  const snsType = 1;
  const [state, setState] = useState({
    campaign: true,
    graph: true,
    table: true,
    filterType: 1,
  });
  const [status, setStatus] = useState(2);
  const [filter, setFilter] = useState({
    title: '',
    filterBy: 1,
    id: [],
  });
  const [filterDate, setFilterDate] = useState({
    filterBy: 2,
    dateStart: '',
    dateEnd: '',
  });

  const categories =
    statistics && statistics.map(m => formatDateTime(m.statistics_date));
  const series = [
    {
      name: `Participants (${statTotals.grandTotalEnries})`,
      data: statistics && statistics.map(m => m.number_of_entries),
    },
    {
      name: `Followers (${statTotals.grandTotalFollowers})`,
      data: statistics && statistics.map(m => m.total_followers),
    },
    {
      name: `Winners (${statTotals.grandTotalWinners})`,
      data: statistics && statistics.map(m => m.total_winner),
    },
    // {
    //   name: `Likes (${statTotals.grandTotalLikes})`,
    //   data: statistics && statistics.map(m => m.total_likes),
    // },
  ];

  if (snsType === 2) {
    series.splice(1, 1);
  }

  const statusList = [
    {
      value: 0,
      name: 'All',
    },
    {
      value: 1,
      name: 'On Going',
    },
    {
      value: 2,
      name: 'Ended',
    },
  ];

  const onSetTags = id => {
    const arr = Array.from(filter.id);
    arr.push(id);
    setFilter(prev => ({
      ...prev,
      id: arr,
      title: '',
    }));
    loadStats(arr, { status });
  };

  const onRemoveTags = id => {
    const arr = Array.from(filter.id);
    const ids = arr.filter(f => f !== id);
    setFilter(prev => ({
      ...prev,
      id: ids,
    }));
    loadStats(ids, { status });
  };

  return (
    <React.Fragment>
      {/* ---------------------Chart Section Start---------------------------------- */}
      <div className="mt-5">
        <div className="d-flex justify-content-between">
          <div>
            {snsType !== 2 && (
              <Text
                title
                text={intl.formatMessage({
                  ...messages.campaignFollowerReport,
                })}
              />
            )}
            {snsType === 2 && (
              <Text
                title
                text={intl.formatMessage({
                  ...messages.campaignReport,
                })}
              />
            )}
            <Label info tooltip={intl.formatMessage({ id: 'M0000071' })} />
          </div>
          <Button
            link
            onClick={() =>
              setState(prev => ({
                ...prev,
                campaign: !state.campaign,
              }))
            }
          >
            {state.campaign ? (
              <Text
                text={`${intl.formatMessage({
                  ...messages.hide,
                })}`}
              />
            ) : (
              <Text
                text={`${intl.formatMessage({
                  ...messages.show,
                })}`}
              />
            )}
          </Button>
        </div>
        {!state.campaign && <hr />}
        {state.campaign && (
          <React.Fragment>
            <div className="row">
              <div className="col-5">
                <div className="row">
                  <div className="col-3">
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.filter,
                      })}`}
                    />
                  </div>
                  <div className="col-8">
                    <div className="row mb-1">
                      <div className="col">
                        <RadioButton
                          id="1"
                          name="filter"
                          text={`${intl.formatMessage({
                            ...messages.campaignName,
                          })}`}
                          value="1"
                          onChange={() =>
                            setState(prev => ({
                              ...prev,
                              filterType: 1,
                            }))
                          }
                          checked={state.filterType === 1}
                        />
                      </div>
                      <div className="col">
                        <RadioButton
                          id="2"
                          name="filter"
                          text={`${intl.formatMessage({
                            ...messages.date,
                          })}`}
                          value="2"
                          onChange={() => {
                            setState(prev => ({
                              ...prev,
                              filterType: 2,
                            }));
                            setFilter(prev => ({
                              ...prev,
                              title: '',
                              id: [],
                            }));
                          }}
                          checked={state.filterType === 2}
                        />
                      </div>
                    </div>
                    <div>
                      {state.filterType === 1 && (
                        <Search
                          title={filter.title}
                          id={filter.id}
                          list={campaignList && campaignList}
                          onChange={({ target }) => {
                            onSearchCampaign(target.value);
                            setFilter(prev => ({
                              ...prev,
                              title: target.value,
                            }));
                          }}
                          onClickSuggestions={onSetTags}
                        />
                      )}
                      {state.filterType === 2 && (
                        <DatePickerRange
                          input
                          setState={dt => {
                            if (dt.length === 2) {
                              const dateStart = dt[0]
                                ? moment(dt[0]).format('MM/DD/YYYY')
                                : null;
                              const dateEnd = dt[1]
                                ? moment(dt[1]).format('MM/DD/YYYY')
                                : null;
                              setFilterDate(prev => ({
                                ...prev,
                                dateStart,
                                dateEnd,
                              }));
                              loadStats(null, {
                                filterBy: state.filterType,
                                dateStart,
                                dateEnd,
                                status,
                              });
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="col-2">
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.status,
                      })}`}
                    />
                  </div>
                  <div className="col-4">
                    {/* <Filter
                  statusList={statusList}
                  onSubmitFilter={fil => {
                    const dateStart = fil.state[0]
                      ? moment(state[0]).format('MM/DD/YYYY')
                      : null;
                    const dateEnd = fil.state[1]
                      ? moment(state[1]).format('MM/DD/YYYY')
                      : null;
                    loadStats({ dateStart, dateEnd });
                  }}
                /> */}
                    <Select
                      value={filter.status}
                      onChange={({ target }) => {
                        setStatus(Number(target.value));
                        const id = state.filterType === 1 ? filter.id : null;
                        loadStats(id, { ...filterDate, status });
                      }}
                    >
                      {statusList &&
                        statusList.map(itm => (
                          <option key={itm.value} value={itm.value}>
                            {itm.name}
                          </option>
                        ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div>
              {allcampaignList &&
                allcampaignList.list.map(
                  itm =>
                    filter.id.includes(itm.id) && (
                      <Tags
                        text={`${itm.id} - ${itm.title}`}
                        onClick={() => onRemoveTags(itm.id)}
                      />
                    ),
                )}
            </div>
            <div className="row pb-2">
              <div className="col-auto ml-auto">
                {/* <Button
                  link
                  className="danger underline"
                  // onClick={() => onDownload({ ...filter, id })}
                >
                  {intl.formatMessage({
                    ...messages.downloadCSV,
                  })}
                </Button> */}
              </div>
            </div>
            <Card minHeight="0">
              <div className="d-flex justify-content-between">
                <Text
                  title
                  text={intl.formatMessage({
                    ...messages.graph,
                  })}
                />
                <Button
                  link
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      graph: !state.graph,
                    }))
                  }
                >
                  {state.graph ? (
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.hide,
                      })}`}
                    />
                  ) : (
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.show,
                      })}`}
                    />
                  )}
                </Button>
              </div>
              {state.graph && (
                <div className="col mx-auto">
                  {statistics && statTotals && (
                    <Chart2
                      chartType="line"
                      series={series}
                      cate={categories}
                      showLegend
                      axisType="datetime"
                    />
                  )}
                </div>
              )}
              <hr />
              <div className="mt-3 d-flex justify-content-between">
                <Text
                  title
                  text={intl.formatMessage({
                    ...messages.table,
                  })}
                />
                <Button
                  link
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      table: !state.table,
                    }))
                  }
                >
                  {state.table ? (
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.hide,
                      })}`}
                    />
                  ) : (
                    <Text
                      text={`${intl.formatMessage({
                        ...messages.show,
                      })}`}
                    />
                  )}
                </Button>
              </div>
              {state.table && (
                <div className="row">
                  <div className="col">
                    {/* {errors && <ErrorFormatted invalid list={[errors]} />} */}
                    <TableList header bgGray align="center">
                      <ListContent>
                        {intl.formatMessage({
                          ...messages.date,
                        })}
                      </ListContent>
                      <ListContent>
                        {intl.formatMessage({
                          ...messages.participants,
                        })}
                      </ListContent>
                      {snsType !== 2 && (
                        <ListContent>
                          {intl.formatMessage({
                            ...messages.followers,
                          })}
                          <Label
                            info
                            tooltip={intl.formatMessage({ id: 'M0000071' })}
                          />
                        </ListContent>
                      )}
                      {/* <ListContent>
                        {intl.formatMessage({
                          ...messages.likes,
                        })}
                      </ListContent> */}
                      <ListContent>
                        {intl.formatMessage({
                          ...messages.winners,
                        })}
                      </ListContent>
                    </TableList>
                    {statistics &&
                      statistics.map(m => (
                        <TableList align="center" className="font-weight-bold">
                          <ListContent>{m.statistics_date}</ListContent>
                          <ListContent>{m.number_of_entries}</ListContent>
                          {snsType !== 2 && (
                            <ListContent>{m.total_followers}</ListContent>
                          )}
                          {/* <ListContent>{m.total_likes}</ListContent> */}
                          <ListContent>
                            {m.total_winner}/{m.total_expected_winner}
                          </ListContent>
                        </TableList>
                      ))}
                    {statTotals && (
                      <TableList align="center" className="font-weight-bold">
                        <ListContent>Total</ListContent>
                        <ListContent>{statTotals.grandTotalEnries}</ListContent>
                        {snsType !== 2 && (
                          <ListContent>
                            {statTotals.grandTotalFollowers}
                          </ListContent>
                        )}
                        {/* <ListContent>{statTotals.grandTotalLikes}</ListContent> */}
                        <ListContent>
                          {statTotals.grandTotalWinners}/
                          {statTotals.grandTotalExpected}
                        </ListContent>
                      </TableList>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </React.Fragment>
        )}
      </div>
      {/* ---------------------Chart Section End------------------------------------ */}
    </React.Fragment>
  );
};

Campaign.propTypes = {
  // theme: PropTypes.any,
  dashboardPage: PropTypes.any,
  intl: intlShape,
  userAccount: PropTypes.object,
};

export default Campaign;
