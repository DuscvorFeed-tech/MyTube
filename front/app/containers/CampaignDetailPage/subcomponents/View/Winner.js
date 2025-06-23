import React from 'react';
// import PropTypes from 'prop-types';
// import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

import Button from 'components/Button';
// import Tags from 'components/Tags';
import Select from 'components/Select';
import Search from 'components/Search';
import Checkbox from 'components/Checkbox';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import Pager from 'components/Pager';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import Label from 'components/Label';
import Modal from 'components/Modal';
import Filter from 'components/Filter';
// import ErrorFormatted from 'components/ErrorFormatted';

import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo } from 'helpers/forwardTo';
// import { modalToggler, countRecord } from 'utils/commonHelper';
// import { config } from 'utils/config';

// import useValidation, { isValid } from 'library/validator';
// import validation from '../../validators';

// subcomponents
// import SendMessageModal from '../SendMessage';
// import ClaimStatusModal from '../ClaimStatus';
// import ParticipantStatusModal from '../ParticipantStatus';
import SuccessMessageModal from '../SuccessMessage';
import LoseFlowModal from '../LoseFlow';
// import GenerateNewWinner from '../GenerateNewWinner';

import messages from '../../messages';

function Winner(props) {
  const { intl } = props;

  return (
    <div>
      <div className="row mx-5 mt-5">
        <div className="col-4">
          <Search />
        </div>
        <div className="col-3">
          <Filter />
        </div>
      </div>
      <div className="row mx-5 p-2">
        <div className="col-auto m-0 p-0">
          {/* <Tags text="winning entries" /> */}
        </div>
        <div className="col-auto m-0 p-0">{/* <Tags text="pending" /> */}</div>
      </div>
      <div className="row mx-5">
        <div className="col-auto ml-auto">
          <Button>
            {intl.formatMessage({
              ...messages.generateWinner,
            })}
          </Button>
        </div>
      </div>
      <div className="row mx-5 pb-2">
        <div className="col-auto text-muted pt-2">
          {/* {intl.formatMessage(
            { id: 'M0000004' },
            {
              pageNumber: countRecord(winnerList),
              totalPage: total,
            },
          )} */}
          Results: 5 of 10 records found
        </div>
        <div className="col-auto ml-auto">
          <Button link className="danger underline">
            {intl.formatMessage({
              ...messages.downloadCSV,
            })}
          </Button>
        </div>
      </div>
      <div className="row mx-5">
        <div className="col">
          {/* {errors && <ErrorFormatted invalid list={[errors]} />} */}
          <TableList header bgGray align="center">
            <ListContent align="left" width="3">
              <Checkbox />
            </ListContent>
            <ListContent>Post Link</ListContent>
            <ListContent>Post Type</ListContent>
            <ListContent>Comments Count</ListContent>
            <ListContent>Like Count</ListContent>
            <ListContent>Prize</ListContent>
            <ListContent>Form Status</ListContent>
            <ListContent />
          </TableList>
          <TableList align="center" className="font-weight-bold">
            <ListContent align="left" width="3">
              <Checkbox />
            </ListContent>
            <ListContent>
              <Button link>https://www.instagram.....</Button>
              {/* <Button link>{itm.sns_username}</Button> */}
            </ListContent>
            <ListContent>Image</ListContent>
            <ListContent>10</ListContent>
            <ListContent>70</ListContent>
            <ListContent>Prize Name</ListContent>
            <ListContent>Submitted</ListContent>
            <ListContent>
              <Button link>
                <u>
                  {intl.formatMessage({
                    ...messages.viewDetails,
                  })}
                </u>
              </Button>
            </ListContent>
          </TableList>
        </div>
      </div>
      <div className="row mx-5 mt-5">
        <div className="col-3 pr-0">
          <Select>
            <option value="2">Change Claim Status</option>
            <option value="3">Change Participant Status</option>
          </Select>
        </div>
        <div className="col-auto">
          <Button width="sm" primary small>
            {intl.formatMessage({
              ...messages.apply,
            })}
          </Button>
        </div>
        <div className="col">
          {/* {winnerList && winnerList.pageInfo && ( */}
          <Pager />
          {/* )} */}
        </div>
        {/* <Form2 isEdit className="mx-5"/> */}

        {/* {selectedValue === 2 && (
          <ClaimStatusModal
            ids={ids}
            campaignId={id}
            ClaimStat={ClaimStatus}
            onUpdateClaim={onUpdateClaim}
            setState={setState}
          />
        )}
        {selectedValue === 3 && (
          <ParticipantStatusModal
            participantStatus={participantStatus}
            setParticipantStatus={setParticipantStatus}
            onSelectWinner={onSelectWinner}
            campaignId={id}
            ids={ids}
            setState={setState}
          />
        )} */}
        <SuccessMessageModal />
        <LoseFlowModal />
      </div>
      <div className="row justify-content-end mx-5">
        <div className="text-muted col-auto">
          {/* {intl.formatMessage({
            ...messages.show,
          })}
          <select className="p-1 mx-2">
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
          </select>
          {intl.formatMessage({
            ...messages.entries,
          })} */}
        </div>
      </div>
      <hr />
      <div className="row py-3">
        <div className="col-auto">
          <Button
            width="sm"
            tertiary
            small
            onClick={() => forwardTo('/campaign')}
          >
            {intl.formatMessage({
              ...messages.back,
            })}
          </Button>
        </div>
      </div>
      <Modal id="chooseAction" dismissable size="lg">
        <ModalToggler modalId="chooseAction" />
        <div className="row justify-content-center m-4">
          <div className="col-12 border d-flex">
            <Label className="col-2">
              {intl.formatMessage({
                ...messages.to,
              })}
            </Label>
            <Input secondary />
          </div>
          <div className="col-12 my-3 mr-0 pr-0 d-flex border">
            <Label className="col-2">
              {intl.formatMessage({
                ...messages.template,
              })}
            </Label>
            <Select className="border-0">
              <option>
                {intl.formatMessage({ id: 'M0000008' }, { name: 'Template' })}
              </option>
            </Select>
          </div>
          <div className="col-12 mb-3 border">
            <Textarea
              className="withHolder"
              placeholder="Message here"
              height={150}
              maxLength={200}
            />
          </div>
        </div>
        <div className="row mx-4">
          <div className="col-2 ml-auto mr-0">
            <Button tertiary small dataDismiss="modal">
              Back
            </Button>
          </div>
          <div className="col-2">
            <Button small dataDismiss="modal">
              Send
            </Button>
          </div>
        </div>
      </Modal>
      {/* <GenerateNewWinner/> */}
    </div>
  );
}

Winner.propTypes = {
  // theme: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(Winner);
