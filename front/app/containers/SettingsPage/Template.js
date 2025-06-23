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
import PATH from '../path';
import { forwardTo } from '../../helpers/forwardTo';

const Template = ({
  intl,
  data,
  templateCategories,
  setDelId,
  error,
  onPageTemplateList,
}) => (
  <React.Fragment>
    <div className="p-10 d-flex border-left min-50">
      <div className="mb-4">
        {error && (
          <ErrorFormatted
            invalid
            list={error.list}
            customName="templateSmallCaps"
          />
        )}
        <TableList header>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.templateName })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.description })}
          </ListContent>
          <ListContent align="left">
            {intl.formatMessage({ ...messages.category })}
          </ListContent>
          <ListContent width="25" />
        </TableList>
        {/* <TableListWrapper>
          <TableList align="center" index="1">
            <ListContent>
              <Text text="Winner Template" />
            </ListContent>
            <ListContent>
              <Text text="For Campaign A" />
            </ListContent>
            <ListContent>
              <Text text="Win" />
            </ListContent>
            <ListContent>
              <Text text="Campaign A" />
            </ListContent>
            <ListContent width="25">
              <div className="row col-lg-12 d-inline-flex">
                <div className="col-md-6">
                  <Button
                    small
                    secondary
                    type="submit"
                    onClick={() => forwardTo('/detail/template')}
                  >
                    View
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button small tertiary type="submit">
                    Delete
                  </Button>
                </div>
              </div>
            </ListContent>
          </TableList>
        </TableListWrapper> */}
        {data &&
          data.list.map(({ id, name, description, category }, index) => (
            <TableListWrapper key={Number(index)}>
              <TableList index="1">
                <ListContent align="left">
                  <Text text={name} />
                </ListContent>
                <ListContent align="left">
                  <Text text={description} />
                </ListContent>
                <ListContent align="left">
                  {templateCategories &&
                    templateCategories.map(
                      ({ name: cname, value }) =>
                        value === Number(category) && (
                          <Text text={cname} key={value} />
                        ),
                    )}
                </ListContent>
                <ListContent width="25">
                  <div className="row col-lg-12 d-inline-flex">
                    <div className="col-md-6">
                      <Button
                        small
                        secondary
                        type="submit"
                        onClick={() =>
                          forwardTo(`${PATH.TEMPLATE_DETAIL}/${id}`)
                        }
                      >
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
          onPageChange={onPageTemplateList}
        />
      )}
    </div>
  </React.Fragment>
);

Template.propTypes = {
  data: PropTypes.object,
  templateCategories: PropTypes.array,
  setDelId: PropTypes.func,
  error: PropTypes.any,
  intl: intlShape.isRequired,
  onPageTemplateList: PropTypes.any,
};

export default compose(injectIntl)(Template);
