import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// components
import Select from 'components/Select';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import messages from '../messages';

export function ClaimStatus({
  routeParams: { entryId, campaignId },
  participantDetailPage: { partDetails },
  onUpdateClaim,
  ClaimStat,
  intl,
  userAccount,
}) {
  const [claimStatus, getClaimStatus] = useState(partDetails.claimed);

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
              onClick={() =>
                onUpdateClaim(
                  entryId,
                  campaignId,
                  claimStatus,
                  userAccount.primary.id,
                )
              }
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
  routeParams: PropTypes.any,
  ClaimStat: PropTypes.any,
  participantDetailPage: PropTypes.any,
  onUpdateClaim: PropTypes.any,
  intl: PropTypes.any,
  userAccount: PropTypes.any,
};

export default compose(memo)(ClaimStatus);
