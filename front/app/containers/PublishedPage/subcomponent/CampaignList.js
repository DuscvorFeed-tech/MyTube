/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Search from 'components/Search';
import Filter from 'components/Filter';
import Button from 'components/Button';
import TableList from 'components/TableList';
import ColorLabel from 'components/ColorLabel';
import ListContent from 'components/TableList/ListContent';
import Pager from 'components/Pager';
import { forwardTo } from 'helpers/forwardTo';
import { formatDateTime } from 'utils/commonHelper';

import messages from '../messages';

function CampaignInfo({
  intl,
  campaignsList,
  setFilter,
  labelList,
  statusList,
  statusList2,
  onPageList,
}) {
  return (
    <div className="col-12">
      <div className="row">
        <div className="col mt-2">
          <div>
            <div className="row my-5">
              <div className="col-12 col-lg-4">
                <Search
                  onChange={({ target }) =>
                    setFilter(prev => ({ ...prev, title: target.value }))
                  }
                />
              </div>
              <div className="col-12 col-lg-4">
                <Filter
                  labelList={labelList && labelList.list}
                  statusList2={statusList2}
                  statusList={statusList}
                  onSubmitFilter={({ label, status, status2, state }) => {
                    const sp = state[0]
                      ? moment(state[0]).format('MM/DD/YYYY')
                      : null;
                    const ep = state[1]
                      ? moment(state[1]).format('MM/DD/YYYY')
                      : null;
                    setFilter(prev => ({
                      ...prev,
                      label_id: label ? Number(label) : null,
                      campaign_status: status ? Number(status) : null,
                      raffle_type: status2 ? Number(status2) : null,
                      start_period: sp,
                      end_period: ep,
                    }));
                  }}
                  onClear={() => {
                    setFilter(prev => ({
                      ...prev,
                      label_id: null,
                      campaign_status: null,
                      raffle_type: null,
                      start_period: null,
                      end_period: null,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <TableList header bgGray align="center">
                  <ListContent hasCheckbox />
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.dateCreated })}
                  </ListContent>
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.campaignName })}
                  </ListContent>
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.raffleType })}
                  </ListContent>
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.campaignStart })}
                  </ListContent>
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.campaignEnd })}
                  </ListContent>
                  <ListContent align="left">
                    {intl.formatMessage({ ...messages.campaignStatus })}
                  </ListContent>
                  <ListContent width="8" />
                </TableList>
                {campaignsList &&
                  campaignsList.list.length === 0 &&
                  'No Results Found'}
                {campaignsList &&
                  campaignsList.list.map(
                    ({
                      id,
                      title,
                      createdAt,
                      start_period,
                      end_period,
                      status,
                      raffle_type,
                      label_id,
                    }) => (
                      <TableList align="center" key={id}>
                        <ListContent hasCheckbox>
                          <ColorLabel
                            color={
                              labelList &&
                              labelList.list
                                .filter(p => p.id === label_id)
                                .map(p => p.color_code)
                            }
                          />
                        </ListContent>
                        <ListContent align="left">
                          {formatDateTime(createdAt)}
                        </ListContent>
                        <ListContent align="left">{title}</ListContent>
                        <ListContent align="left">
                          {statusList2 &&
                            statusList2.data &&
                            statusList2.data
                              .filter(t => t.value === raffle_type)
                              .map(t =>
                                intl.formatMessage(
                                  { id: `${statusList2.listType}${t.value}` },
                                  { defaultMessage: t.name },
                                ),
                              )}
                        </ListContent>
                        <ListContent align="left">
                          {formatDateTime(start_period)}
                        </ListContent>
                        <ListContent align="left">
                          {formatDateTime(end_period)}
                        </ListContent>
                        <ListContent align="left">
                          {statusList &&
                            statusList.data &&
                            statusList.data
                              .filter(t => t.value === status)
                              .map(t =>
                                intl.formatMessage(
                                  { id: `${statusList.listType}${t.value}` },
                                  { defaultMessage: t.name },
                                ),
                              )}
                        </ListContent>
                        <ListContent width="8">
                          <Button
                            secondary
                            small
                            onClick={() => forwardTo(`/campaign/detail/${id}`)}
                          >
                            {intl.formatMessage({ ...messages.btnView })}
                          </Button>
                        </ListContent>
                      </TableList>
                    ),
                  )}
              </div>
            </div>
            <div className="col">
              {campaignsList && campaignsList.pageInfo && (
                <Pager
                  align="justify-content-end"
                  totalPage={campaignsList.pageInfo.totalPage}
                  currentPage={campaignsList.pageInfo.currentPage}
                  onPageChange={onPageList}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CampaignInfo.propTypes = {
  campaignsList: PropTypes.any,
  setFilter: PropTypes.any,
  labelList: PropTypes.any,
  statusList: PropTypes.any,
  statusList2: PropTypes.any,
  onPageList: PropTypes.any,
  intl: PropTypes.any,
};

export default CampaignInfo;
