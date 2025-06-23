import React from 'react';
// import PropTypes from 'prop-types';

import Card from 'components/Card';
import Filter from 'components/Filter';
import Search from 'components/Search';
import Tweet from 'components/Tweet';
import DatePicker from 'components/DatePicker';
import User from 'assets/images/icons/user_primary.png';

// import messages from './messages';

function Tweets() {
  return (
    <Card className="p-3">
      <div className="col-12">
        <div className="row my-4">
          <div className="col-12 col-lg-3">
            <Search />
          </div>
          <div className="col-12 col-lg-3">
            <DatePicker />
          </div>
          <div className="col-12 col-lg-3">
            <Filter />
          </div>
        </div>
      </div>
      <h5 className="text-uppercase font-weight-bold py-4 text-center">
        November 2019
      </h5>
      <div className="row justify-content-center my-4">
        <div className="col-8">
          <div className="row no-gutters">
            <div className="col-3 font-weight-bold text-center">
              <div className="mt-5">
                <p className="pt-5">Wednesday</p>
                <p>11</p>
              </div>
            </div>
            <div className="col-8">
              <Tweet
                twitterLink
                userImg={User}
                name="BlotocolTwitter"
                username="@blotocolTwt"
                content="#Campaign2019"
                onDelete
                dateTime="November 11, 2019 8:57AM (UTC +08:00)"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center my-4">
        <div className="col-8">
          <div className="row no-gutters">
            <div className="col-3 font-weight-bold text-center">
              <div className="mt-5">
                <p className="pt-5">Tuesday</p>
                <p>11</p>
              </div>
            </div>
            <div className="col-8">
              <Tweet
                twitterLink
                userImg={User}
                name="BlotocolTwitter"
                username="@blotocolTwt"
                content="#Campaign2019"
                onDelete
                dateTime="November 10, 2019 8:57AM (UTC +08:00)"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Tweets;
