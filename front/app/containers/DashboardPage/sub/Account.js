import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePickerRange from 'components/DatePickerRange';
import Card from 'components/Card';
import Text from 'components/Text';
import Button from 'components/Button';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import Chart2 from 'components/Chart2';
import Label from 'components/Label';
import { intlShape } from 'react-intl';
import { formatDateTime } from 'utils/commonHelper';

import messages from '../messages';

const Account = ({
  theme,
  intl,
  dashboardPage: { barStatistics, loadBarStats },
  userAccount,
}) => {
  const snsType = userAccount.primary.type;
  const [state, setState] = useState({
    account: true,
    graph: true,
    table: true,
  });

  const categories =
    barStatistics && barStatistics.map(m => formatDateTime(m.statistics_date));
  const series = [
    {
      name: 'Followers',
      data: barStatistics && barStatistics.map(m => m.barFollower),
    },
    {
      name: 'Gain',
      data: barStatistics && barStatistics.map(m => m.gains),
    },
    {
      name: 'Loss',
      data: barStatistics && barStatistics.map(m => Math.abs(m.loss)),
    },
  ];

  if (snsType === 2) {
    series.splice(0, 1);
  }

  return (
    <React.Fragment>
      {/* ---------------------Chart Section Start---------------------------------- */}
      <div className="mt-5">
        <div className="d-flex justify-content-between">
          <div>
            <Text
              title
              text={intl.formatMessage({
                ...messages.accountOverallFollowed,
              })}
            />
            <Label info tooltip={intl.formatMessage({ id: 'M0000068' })} />
          </div>
          <Button
            link
            onClick={() =>
              setState(prev => ({
                ...prev,
                account: !state.account,
              }))
            }
          >
            {state.account ? (
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
        {!state.account && <hr />}
        {state.account && (
          <React.Fragment>
            <div className="row pl-1">
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
                      loadBarStats({
                        filterBy: 2,
                        dateStart,
                        dateEnd,
                      });
                    }
                  }}
                />
              </div>
              <div className="col-3" />
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
              {state.graph && barStatistics && (
                <div className="col mx-auto">
                  <Chart2
                    chartType="bar"
                    series={series}
                    cate={categories}
                    axisType="datetime"
                    showLegend
                    isStacked
                    colorset={theme.colorSet1}
                  />
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
                          ...messages.followers,
                        })}
                        <Label
                          info
                          tooltip={intl.formatMessage({ id: 'M0000071' })}
                        />
                      </ListContent>
                      <ListContent>
                        {intl.formatMessage({
                          ...messages.count,
                        })}
                      </ListContent>
                      <ListContent>
                        {intl.formatMessage({
                          ...messages.percentage,
                        })}
                      </ListContent>
                    </TableList>
                    {barStatistics &&
                      barStatistics.map((m, index) => (
                        <TableList
                          align="center"
                          className="font-weight-bold"
                          key={Number(index)}
                        >
                          <ListContent>{m.statistics_date}</ListContent>
                          <ListContent>{m.total_followers}</ListContent>
                          <ListContent>{m.diff}</ListContent>
                          <ListContent>{m.percentage}%</ListContent>
                        </TableList>
                      ))}
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

Account.propTypes = {
  theme: PropTypes.any,
  dashboardPage: PropTypes.any,
  intl: intlShape,
  userAccount: PropTypes.object,
};

export default Account;
