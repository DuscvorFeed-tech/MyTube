/* eslint-disable camelcase */
import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import TableList from 'components/TableList';
import TableListWrapper from 'components/TableList/Wrapper';
import ListContent from 'components/TableList/ListContent';
import Button from 'components/Button';
import Text from 'components/Text';

const Category = () => (
  <React.Fragment>
    <div className="p-10 d-flex border-left min-50">
      <div className="mb-4 mx-auto">
        <TableList header align="center">
          <ListContent>Category Name</ListContent>
          <ListContent>Type</ListContent>
          <ListContent>Action</ListContent>
        </TableList>
        <TableListWrapper>
          <TableList align="center" index="1">
            <ListContent>
              <Text text="Win" />
            </ListContent>
            <ListContent>
              <Text text="Post" />
            </ListContent>
            <ListContent>
              <div className="row col-lg-12 justify-content-center mr-0 ml-0">
                <div className="col-md-6">
                  <Button small tertiary>
                    Delete
                  </Button>
                </div>
              </div>
            </ListContent>
          </TableList>
        </TableListWrapper>
      </div>
    </div>
  </React.Fragment>
);

Category.propTypes = {
  //   data: PropTypes.object,
  //   onDeleteLabel: PropTypes.func,
};

export default memo(Category);
