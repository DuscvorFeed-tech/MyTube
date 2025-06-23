import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import Label from 'components/Label';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';

import { config } from 'utils/config';

import messages from '../messages';

function ParticipantEntryList({
  participantDetailPage: { partDetails, entryList },
  intl,
  userAccount,
}) {
  const snsType = userAccount.primary.type;

  return (
    <div className="border-bottom py-4">
      <div className="col-10 mx-auto mt-5 mb-5">
        <TableList header bgGray align="center">
          <ListContent>
            {intl.formatMessage({ ...messages.dateOfEntry })}
          </ListContent>
          {snsType !== 3 && (
            <ListContent>
              {intl.formatMessage({ ...messages.liked })}
            </ListContent>
          )}
          {snsType === 3 && (
            <>
              <ListContent>
                {intl.formatMessage({ ...messages.comments })}
              </ListContent>
              <ListContent>
                {intl.formatMessage({ ...messages.play })}
              </ListContent>
              <ListContent>
                {intl.formatMessage({ ...messages.share })}
              </ListContent>
              <ListContent>
                {intl.formatMessage({ ...messages.description })}
              </ListContent>
            </>
          )}
          <ListContent />
        </TableList>
        {entryList &&
          entryList.map(itm => (
            <TableList header align="center" key={itm.id}>
              <ListContent>
                <Label>{itm.entry_date}</Label>
              </ListContent>
              {snsType !== 3 && (
                <ListContent>
                  <Label>{itm.liked}</Label>
                </ListContent>
              )}
              {snsType === 3 && (
                <>
                  <ListContent>
                    <Label>{itm.comment_count}</Label>
                  </ListContent>
                  <ListContent>
                    <Label>{itm.play_count}</Label>
                  </ListContent>
                  <ListContent>
                    <Label>{itm.share_count}</Label>
                  </ListContent>
                  <ListContent>
                    <Label>{itm.description}</Label>
                  </ListContent>
                </>
              )}
              <ListContent>
                {snsType === 1 && (
                  <Button
                    link
                    onClick={() =>
                      window.open(
                        `${config.TWITTER_URL}/${
                          partDetails.sns_username
                        }/status/${itm.sns_post_id}`,
                      )
                    }
                  >
                    {intl.formatMessage({ ...messages.M0000045 })}
                  </Button>
                )}
                {snsType === 2 && (
                  <Button
                    link
                    onClick={() =>
                      window.open(
                        `${config.INSTAGRAM_URL}/p/${itm.sns_post_id}`,
                      )
                    }
                  >
                    {intl.formatMessage({ ...messages.M0000078 })}
                  </Button>
                )}
                {snsType === 3 && (
                  <Button
                    link
                    onClick={() =>
                      window.open(
                        `${config.TIKTOK_URL}/@${
                          partDetails.sns_username
                        }/video/${itm.sns_post_id}`,
                      )
                    }
                  >
                    {intl.formatMessage({ ...messages.M0000088 })}
                  </Button>
                )}
              </ListContent>
            </TableList>
          ))}
      </div>
    </div>
  );
}

ParticipantEntryList.propTypes = {
  participantDetailPage: PropTypes.object,
  userAccount: PropTypes.object,
  intl: PropTypes.any,
};

export default ParticipantEntryList;
