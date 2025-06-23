/* eslint-disable indent */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import { formatDateTime, modalToggler } from 'utils/commonHelper';
import AdminLocal from 'utils/AdminLocal';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import TemplatePreview from 'components/TemplatePreview';
import messages from '../messages';

function DMRecord({
  userAccount,
  participantDetailPage: { partDetails },
  intl,
}) {
  const snsAccountId = userAccount.primary.id;
  const [messagePreview, setMessagePreview] = useState({
    content: '',
    img: null,
  });

  const dmLogs = partDetails
    ? partDetails.dm_logs.map(itm => ({
        status: itm.error ? JSON.parse(itm.error).errorMessage : 'OK',
        message: itm.message,
        media_url: itm.media_url,
        media_id: itm.media_id,
        dmDate: itm.dmDate,
        isPending: itm.isPending,
      }))
    : [];

  return (
    <div className="border-bottom py-4">
      <div className="col-10 mx-auto mt-5 mb-5">
        <TableList header bgGray align="center">
          <ListContent>
            {intl.formatMessage({ ...messages.dmDate })}
          </ListContent>
          <ListContent>
            {intl.formatMessage({ ...messages.status })}
          </ListContent>
          <ListContent>
            {/* {intl.formatMessage({ ...messages.message })} */}
          </ListContent>
        </TableList>
        {dmLogs &&
          dmLogs.map(itm => (
            <TableList align="center" key={itm.id}>
              <ListContent>
                {itm.isPending ? '' : formatDateTime(new Date(itm.dmDate))}
              </ListContent>
              <ListContent noTextTransform>
                {itm.isPending
                  ? intl.formatMessage({ ...messages.dmStatusPending })
                  : itm.status}
              </ListContent>
              <ListContent>
                {/* <Textarea value={itm.message} /> */}
                {itm.message && (
                  <Button
                    link
                    onClick={() => {
                      setMessagePreview({
                        content: itm.message,
                        img: itm.media_url
                          ? [
                              `${
                                itm.media_url
                              }&fetch_media_url=1&snsId=${snsAccountId}&token=${AdminLocal.getAdminToken()}`,
                            ]
                          : [],
                        isPending: itm.isPending,
                        media_id: itm.media_id,
                      });
                      modalToggler('messagePreviewModal');
                    }}
                  >
                    {intl.formatMessage({ ...messages.M0000091 })}
                  </Button>
                )}
              </ListContent>
            </TableList>
          ))}
      </div>
      <Modal id="messagePreviewModal" dismissable size="md">
        <ModalToggler modalId="messagePreviewModal" />
        <TemplatePreview
          content={messagePreview.content}
          uploadFiles={messagePreview.img || []}
          isPending={messagePreview.isPending && messagePreview.media_id}
        />
      </Modal>
    </div>
  );
}

DMRecord.propTypes = {
  participantDetailPage: PropTypes.object,
  intl: PropTypes.any,
  userAccount: PropTypes.object,
};

export default DMRecord;
