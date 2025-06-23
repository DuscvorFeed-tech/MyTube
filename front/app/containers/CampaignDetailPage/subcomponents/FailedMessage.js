import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

// components
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';

import { config } from 'utils/config';

import messages from '../messages';

export function FailedMessage({
  intl,
  onSetData,
  failedEntries,
  checkedList,
  userAccount,
}) {
  const snsType = userAccount.primary.type;
  return (
    <Modal id="failedEntry" dismissable size="md">
      <ModalToggler modalId="failedEntry" />
      <div>
        <div className="text-center my-4">
          {intl.formatMessage({ ...messages.E0000067 })}
        </div>

        <div className="row mx-5">
          <div className="col">
            <TableList header bgGray align="center">
              <ListContent align="left">
                {intl.formatMessage({
                  ...messages.username,
                })}
              </ListContent>
              <ListContent align="left">
                {intl.formatMessage({
                  ...messages.followed,
                })}
              </ListContent>
            </TableList>
            {checkedList.map(itm =>
              failedEntries
                .filter(entry => entry.key.includes(itm.sns_id))
                .map(() => (
                  <TableList
                    align="center"
                    className="font-weight-bold"
                    key={itm.id}
                  >
                    <ListContent align="left">
                      <Button
                        link
                        // delete disabled for INSTA when username is fixed
                        onClick={() =>
                          window.open(
                            snsType === 1
                              ? `${config.TWITTER_URL}/${itm.sns_username}`
                              : `${config.INSTAGRAM_URL}/${itm.sns_username}`,
                          )
                        }
                      >
                        {itm.sns_username}
                      </Button>
                    </ListContent>
                    <ListContent align="left">
                      {itm.followed === 1 &&
                        intl.formatMessage({
                          ...messages.follow,
                        })}
                    </ListContent>
                  </TableList>
                )),
            )}
          </div>
        </div>

        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                onSetData('selectedValue', 0);
              }}
            >
              {intl.formatMessage({ ...messages.ok })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

FailedMessage.propTypes = {
  intl: intlShape.isRequired,
  onSetData: PropTypes.any,
  failedEntries: PropTypes.any,
  checkedList: PropTypes.any,
  userAccount: PropTypes.any,
};

export default compose(
  memo,
  injectIntl,
)(FailedMessage);
