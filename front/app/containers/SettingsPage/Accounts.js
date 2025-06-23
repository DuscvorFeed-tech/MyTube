import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import TableList from 'components/TableList';
import TableListWrapper from 'components/TableList/Wrapper';
import ListContent from 'components/TableList/ListContent';
import Button from 'components/Button';
import Text from 'components/Text';
import Pager from 'components/Pager';
import messages from './messages';

const Accounts = ({
  intl,
  data,
  onSubmitSetSnsAsDefault,
  setDelId,
  onDeleteSnsAccount,
  onPageUserAccountList,
}) => (
  <React.Fragment>
    <div className="p-10 d-flex border-left min-50">
      <div className="mb-4">
        <TableList header>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.accountName })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.type })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.username })}
          </ListContent>
          <ListContent width="30" />
        </TableList>
        {data &&
          data.sns_account.map(({ id, name, primary, type }, index) => (
            <TableListWrapper key={Number(index)}>
              <TableList index="1">
                <ListContent align="left">
                  <Text text={name} />
                </ListContent>
                <ListContent align="left">
                  {type === 1 ? (
                    <Text text={intl.formatMessage({ ...messages.twitter })} />
                  ) : (
                    <>
                      {type === 2 ? (
                        <Text
                          text={intl.formatMessage({ ...messages.instagram })}
                        />
                      ) : (
                        <Text
                          text={intl.formatMessage({ ...messages.tiktok })}
                        />
                      )}
                    </>
                  )}
                </ListContent>
                <ListContent align="left">
                  <Text text={name} />
                </ListContent>
                <ListContent width="30">
                  <div className="row col-lg-12 justify-content-center mr-0 ml-0 inline">
                    <div className="col-md-5">
                      <Button
                        small
                        tertiary
                        onClick={() => {
                          setDelId(id);
                          onDeleteSnsAccount(id, true);
                        }}
                      >
                        {intl.formatMessage({ ...messages.btnDelete })}
                      </Button>
                    </div>
                    {primary && (
                      <div className="col-md-7 pr-0">
                        <Button small secondary disabled>
                          {intl.formatMessage({ ...messages.currentDefault })}
                        </Button>
                      </div>
                    )}
                    {!primary && (
                      <div className="col-md-7 pr-0">
                        <Button
                          small
                          secondary
                          onClick={() => onSubmitSetSnsAsDefault(id)}
                        >
                          {intl.formatMessage({ ...messages.default })}
                        </Button>
                      </div>
                    )}
                  </div>
                </ListContent>
              </TableList>
            </TableListWrapper>
          ))}
      </div>
    </div>
    <div className="col">
      {data && data.pageInfo && (
        <Pager
          align="justify-content-end"
          totalPage={data.pageInfo.totalPage}
          currentPage={data.pageInfo.currentPage}
          onPageChange={onPageUserAccountList}
        />
      )}
    </div>
  </React.Fragment>
);

Accounts.propTypes = {
  data: PropTypes.object,
  onSubmitSetSnsAsDefault: PropTypes.func,
  onDeleteSnsAccount: PropTypes.func,
  setDelId: PropTypes.any,
  intl: intlShape.isRequired,
  onPageUserAccountList: PropTypes.any,
};

export default compose(injectIntl)(Accounts);
