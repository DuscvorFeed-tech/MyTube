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
import { forwardTo } from 'helpers/forwardTo';
import Pager from 'components/Pager';
import messages from './messages';

const Forms = ({ intl, data, setDelId, error, onPageFormList }) => (
  <React.Fragment>
    <div className="p-10 d-flex border-left min-50">
      <div className="mb-4">
        {error && (
          <ErrorFormatted
            invalid
            list={error.list}
            names={['id']}
            customName="formSmallCaps"
          />
        )}
        <TableList header>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.formName })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.description })}
          </ListContent>
          <ListContent width="25" />
        </TableList>
        <TableListWrapper>
          {data &&
            data.list.map(({ id, name, description }) => (
              <TableList index="1">
                <ListContent align="left">
                  <Text text={name} />
                </ListContent>
                <ListContent align="left">
                  <Text text={description} />
                </ListContent>
                <ListContent width="25">
                  <div className="row col-lg-12 d-inline-flex">
                    <div className="col-md-6">
                      <Button
                        small
                        secondary
                        type="submit"
                        onClick={() => forwardTo(`/settings/form/detail/${id}`)}
                      >
                        {' '}
                        {intl.formatMessage({ ...messages.btnView })}
                      </Button>
                    </div>
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
          onPageChange={onPageFormList}
        />
      )}
    </div>
  </React.Fragment>
);

Forms.propTypes = {
  data: PropTypes.object,
  setDelId: PropTypes.func,
  error: PropTypes.any,
  intl: intlShape.isRequired,
  onPageFormList: PropTypes.any,
};

export default compose(injectIntl)(Forms);
