/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import Tweet from 'components/Tweet';
import User from 'assets/images/icons/user_primary.png';

function SavedTweets({ data, userAccount }) {
  return (
    <div className="col-12 mx-auto">
      {data &&
        // eslint-disable-next-line no-unused-vars
        data.list.map(({ id, content, createdAt, media_file }) => (
          <React.Fragment key={id}>
            <div className="mb-4">
              <Tweet
                userImg={User}
                name={userAccount.name}
                content={content}
                dateTime={createdAt}
                files={media_file}
                showDelete
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}

SavedTweets.propTypes = {
  data: PropTypes.object,
  userAccount: PropTypes.object,
};

export default SavedTweets;
