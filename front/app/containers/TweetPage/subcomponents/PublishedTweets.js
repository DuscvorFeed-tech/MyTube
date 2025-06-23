/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import Tweet from 'components/Tweet';
import User from 'assets/images/icons/user_primary.png';
// import Img from 'components/Img';

function PublishedTweets({ data, userAccount }) {
  // console.log(data);
  return (
    <div className="col-12 mx-auto">
      {data &&
        // eslint-disable-next-line no-unused-vars
        data.list.map(({ id, content, createdAt, media_file, media_type }) => (
          <React.Fragment key={id}>
            <div className="mb-4">
              <Tweet
                userImg={User}
                name="Lawrence"
                content={content}
                dateTime={createdAt}
                fileType={media_type}
                files={media_file ? media_file.map(m => m.url) : []}
                showDelete={false}
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}

PublishedTweets.propTypes = {
  data: PropTypes.object,
  userAccount: PropTypes.object,
};

export default PublishedTweets;
