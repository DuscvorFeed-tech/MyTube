/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// import Text from 'components/Text';
import Button from 'components/Button';
import ColorLabel from 'components/ColorLabel';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import { formatDateTime } from 'utils/commonHelper';

import { forwardTo } from 'helpers/forwardTo';
import messages from '../../messages';
import { getNumberWithOrdinal } from '../../../CreateCampaignPage/inputStateEffect';

function PrizeDistribution({ campDetails, listOfPrizes, intl }) {
  const toOrdinalSuffix = num => {
    const int = Number(num);
    const digits = [int % 10, int % 100];
    // const ordinals = ['st', 'nd', 'rd', 'th'];
    const oPattern = [1, 2, 3, 4];
    const tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
      ? int + digits[0] - 1 // ? int + ordinals[digits[0] - 1]
      : int + 3; // : int + ordinals[3];
  };

  return (
    <React.Fragment>
      <div className="border-bottom">
        <div className="row my-4 mx-5 no-gutters">
          <div className="col-6">
            {/* <Text
              text={intl.formatMessage({
                ...messages.legend,
              })}
              className="font-weight-bold m-3"
            /> */}
            <TableList align="left" className="borderLess font-weight-bold">
              <ListContent align="left" className="col-2">
                <ColorLabel color="lightOrange" className="mr-2" />{' '}
                {intl.formatMessage({
                  ...messages.legend1,
                })}
              </ListContent>
              <ListContent align="left" className="col-2">
                <ColorLabel color="red" className="mr-2" />{' '}
                {intl.formatMessage({
                  ...messages.legend2,
                })}
              </ListContent>
              <ListContent align="left" className="col-4">
                <ColorLabel color="blue" className="mr-4" />{' '}
                {intl.formatMessage({
                  ...messages.legend3,
                })}
              </ListContent>
            </TableList>
          </div>
        </div>
        <div className="row mx-5">
          <div className="col">
            <TableList header bgGray align="center">
              <ListContent width="10" />
              <ListContent width="15" />
              {listOfPrizes &&
                listOfPrizes.map(prize => <ListContent>{prize}</ListContent>)}
            </TableList>
            {campDetails &&
              campDetails.map((itm, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableList
                  align="center"
                  className="font-weight-bold"
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                >
                  <ListContent width="10">
                    {idx + 1}
                    {intl.locale === 'en'
                      ? intl.formatMessage({
                          id: `ordinal${getNumberWithOrdinal(idx + 1, false)}`,
                        })
                      : ''}
                    {` ${intl.formatMessage({
                      ...messages.raffle,
                    })}`}
                  </ListContent>
                  <ListContent width="15">
                    {formatDateTime(itm.raffle_schedule)}
                  </ListContent>
                  {listOfPrizes &&
                    listOfPrizes.map((prize, idxP) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <ListContent key={idxP}>
                        <span className="col-4 color-02">
                          {itm[prize] ? itm[prize].set : 0}
                        </span>
                        <span className="col-4 color-03">
                          {itm[prize] ? itm[prize].claim : 0}
                        </span>
                        <span className="col-4 color-01">
                          {itm[prize] ? itm[prize].form : 0}
                        </span>
                      </ListContent>
                    ))}
                </TableList>
              ))}
          </div>
        </div>
      </div>
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
    </React.Fragment>
  );
}

PrizeDistribution.propTypes = {
  intl: intlShape.isRequired,
  campDetails: PropTypes.any,
  listOfPrizes: PropTypes.any,
};

export default injectIntl(PrizeDistribution);
