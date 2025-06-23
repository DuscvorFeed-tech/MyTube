import React, { memo, useState } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

// components
import Input from 'components/Input';
import Select from 'components/Select';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import messages from '../messages';

export function ClaimStatus({
  intl,
  ids,
  campaignId,
  snsId,
  onUpdateClaim,
  ClaimStat,
  setState,
}) {
  const data = ids.find(c => c.claimed !== undefined)
    ? ids.find(c => c.claimed !== undefined).claimed
    : 0;
  const [claimStatus, getClaimStatus] = useState(data);

  const setClaimStatus = e => {
    const x = e.target.value;
    getClaimStatus(Number(x));
  };

  return (
    <Modal id="modalTemplatePreview" dismissable size="md">
      <ModalToggler modalId="modalTemplatePreview" />
      <form>
        <div className="font-weight-bold text-center my-4">
          {intl.formatMessage(
            { id: 'T0000017' },
            { name: intl.formatMessage({ ...messages.claimStatus }) },
          )}
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <div className="col-4 content">
            {intl.formatMessage(
              { id: 'T0000011' },
              { name: intl.formatMessage({ ...messages.selectedWinners }) },
            )}
          </div>
          <div className="col-6 label">
            <Input value={ids.length} disabled className="py-2" />
          </div>
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <div className="col-4 content">
            {intl.formatMessage({ ...messages.claimStatus })}
          </div>
          <div className="col-6 label">
            <Select
              borderRadius
              onChange={e => setClaimStatus(e)}
              value={claimStatus}
            >
              {ClaimStat &&
                ClaimStat.slice(0, 3).map((t, index) => (
                  <option key={Number(index)} value={t.value}>
                    {intl.formatMessage({ id: `claimStatus${index}` })}
                  </option>
                ))}
            </Select>
          </div>
        </div>
        <div className="row justify-content-center mt-5 mb-3 px-5">
          <div className="col-auto">
            <Button width="sm" secondary small dataDismiss="modal">
              {intl.formatMessage({ ...messages.cancel })}
            </Button>
          </div>
          <div className="col-auto ml-auto">
            <Button
              width="sm"
              primary
              small
              dataDismiss="modal"
              onClick={() => {
                onUpdateClaim(
                  ids.map(itm => itm.id),
                  campaignId,
                  claimStatus,
                  snsId,
                );
                setState(prev => ({
                  ...prev,
                  checkedList: [],
                }));
              }}
            >
              {intl.formatMessage({ ...messages.proceed })}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

ClaimStatus.propTypes = {
  intl: intlShape.isRequired,
  ids: PropTypes.array,
  campaignId: PropTypes.number,
  snsId: PropTypes.number,
  ClaimStat: PropTypes.array,
  onUpdateClaim: PropTypes.any,
  setState: PropTypes.func,
};

export default compose(
  memo,
  injectIntl,
)(ClaimStatus);
