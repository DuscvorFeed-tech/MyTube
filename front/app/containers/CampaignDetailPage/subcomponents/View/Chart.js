import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Text from 'components/Text';
import Button from 'components/Button';
import DatePickerRange from 'components/DatePickerRange';
// import Search from 'components/Search';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import Chart2 from 'components/Chart2';
import { forwardTo } from 'helpers/forwardTo';
import { formatDateTime } from 'utils/commonHelper';

import messages from '../../messages';

function Chart({
  intl,
  theme,
  loadStats,
  detailPage: { statistics, statTotals },
}) {
  const [state, setState] = useState({
    graph: true,
    table: true,
  });
  const categories =
    statistics && statistics.map(m => formatDateTime(m.statistics_date));
  const series = [
    {
      name: `${intl.formatMessage({ ...messages.participants })} (${
        statTotals.grandTotalEntries
      })`,
      data: statistics && statistics.map(m => m.number_of_entries),
    },
    {
      name: `${intl.formatMessage({ ...messages.followers })} (${
        statTotals.grandTotalFollowers
      })`,
      data: statistics && statistics.map(m => m.total_followers),
    },
    {
      name: `${intl.formatMessage({ ...messages.winners })} (${
        statTotals.grandTotalWinners
      })`,
      data: statistics && statistics.map(m => m.total_winner),
    },
    // {
    //   name: `Likes (${statTotals.grandTotalLikes})`,
    //   data: statistics && statistics.map(m => m.total_likes),
    // },
  ];
  return (
    <React.Fragment>
      {/* ---------------------Chart Section Start---------------------------------- */}
      <div className="col-auto mx-5 mt-5">
        <React.Fragment>
          <div className="row align-items-baseline">
            {/* <div className="col-4">
              <Search
              // onChange={({ target }) =>
              //   setFilter(prev => ({ ...prev, username: target.value }))
              // }
              />
            </div> */}
            <div className="col-1">
              <Text
                text={`${intl.formatMessage({
                  ...messages.filter,
                })}`}
              />
            </div>
            <div className="col-3">
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
                    loadStats({
                      dateStart,
                      dateEnd,
                    });
                  }
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row pb-2">
            <div className="col-auto ml-auto">
              <Button
                link
                className="danger underline"
                // onClick={() => onDownload({ ...filter, id })}
              >
                {intl.formatMessage({
                  ...messages.downloadCSV,
                })}
              </Button>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <Text
              size={theme.fontSize.lg}
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
                />
              )}
            </div>
          )}
          <hr />
          <div className="my-3 d-flex justify-content-between">
            <Text
              size={theme.fontSize.lg}
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
                  <ListContent>
                    {intl.formatMessage({
                      ...messages.followers,
                    })}
                  </ListContent>
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
                      <ListContent>{m.total_followers}</ListContent>
                      {/* <ListContent>{m.total_likes}</ListContent> */}
                      <ListContent>
                        {m.total_winner}/{m.total_expected_winner}
                      </ListContent>
                    </TableList>
                  ))}
                {statTotals && (
                  <TableList align="center" className="font-weight-bold">
                    <ListContent>Total</ListContent>
                    <ListContent>{statTotals.grandTotalEntries}</ListContent>
                    <ListContent>{statTotals.grandTotalFollowers}</ListContent>
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
        </React.Fragment>
      </div>
      <div className="border-bottom" />
      <div className="row py-4">
        <div className="col-auto">
          <Button
            width="sm"
            tertiary
            small
            onClick={() => {
              forwardTo('/campaign');
            }}
          >
            {intl.formatMessage({
              ...messages.back,
            })}
          </Button>
        </div>
      </div>
      {/* ---------------------Chart Section End------------------------------------ */}
    </React.Fragment>
  );
}

Chart.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.any,
  detailPage: PropTypes.any,
  loadStats: PropTypes.any,
};

export default injectIntl(Chart);
