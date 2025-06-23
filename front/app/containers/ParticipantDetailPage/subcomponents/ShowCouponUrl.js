import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// components
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import Button from 'components/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import messages from '../messages';

export function ShowCouponUrl({ intl, url }) {
  const onCopied = () => {
    alert(intl.formatMessage({ ...messages.copied }));
  };

  return (
    <Modal id="modalShowCouponUrl" dismissable size="md">
      <ModalToggler modalId="modalShowCouponUrl" />
      <div className="mb-3 text-center">Coupon Link</div>
      <div className="mb-3 text-center">{url}</div>
      <CopyToClipboard
        style={{ margin: 'auto' }}
        text={url}
        onCopy={() => onCopied()}
      >
        <div className="text-center">
          <Button width="sm" primary small>
            {intl.formatMessage({ ...messages.copy })}
          </Button>
        </div>
      </CopyToClipboard>
    </Modal>
  );
}

ShowCouponUrl.propTypes = {
  intl: PropTypes.any,
  url: PropTypes.string,
};

export default compose(memo)(ShowCouponUrl);
