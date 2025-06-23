/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import TableList from 'components/TableList';
import TableListWrapper from 'components/TableList/Wrapper';
import ListContent from 'components/TableList/ListContent';
import Button from 'components/Button';
import Text from 'components/Text';
import ErrorFormatted from 'components/ErrorFormatted';
import { modalToggler } from 'utils/commonHelper';
import Pager from 'components/Pager';
import messages from './messages';

const Labels = ({ intl, data, setDelId, error, onPageLabelList }) => (
  <React.Fragment>
    <div className="p-10 d-flex border-left min-50">
      <div className="mb-4">
        {error && (
          <ErrorFormatted
            invalid
            list={error.list}
            customName="labelSmallCaps"
          />
        )}
        <TableList header>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.labelName })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.color })}
          </ListContent>
          <ListContent width="25" />
        </TableList>
        <TableListWrapper>
          {data &&
            data.list.map(({ id, name, color_code }, index) => (
              <TableList index="1" key={Number(index)}>
                <ListContent align="left">
                  <Text text={name} />
                </ListContent>
                <ListContent align="left">
                  <Text text={color_code} color={color_code} />
                </ListContent>
                <ListContent width="25">
                  <div className="row col-lg-12 justify-content-center mr-0 ml-0">
                    <div className="col-md-6">
                      <Button
                        small
                        tertiary
                        onClick={() => {
                          setDelId(id);
                          modalToggler('DeleteConfirm');
                        }}
                      >
                        {intl.formatMessage({ ...messages.btnDelete })}
                      </Button>
                    </div>
                  </div>
                </ListContent>
              </TableList>
            ))}
        </TableListWrapper>
      </div>
    </div>
    <div className="col">
      {data && data.pageInfo && (
        <Pager
          align="justify-content-end"
          totalPage={data.pageInfo.totalPage}
          currentPage={data.pageInfo.currentPage}
          onPageChange={onPageLabelList}
        />
      )}
    </div>
  </React.Fragment>
);

Labels.propTypes = {
  data: PropTypes.object,
  setDelId: PropTypes.func,
  error: PropTypes.any,
  intl: intlShape.isRequired,
  onPageLabelList: PropTypes.any,
};

export default compose(injectIntl)(Labels);
