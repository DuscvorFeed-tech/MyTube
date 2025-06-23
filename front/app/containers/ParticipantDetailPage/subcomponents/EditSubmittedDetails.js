import React from 'react';
import PropTypes from 'prop-types';

// components
import Label from 'components/Label';
import Button from 'components/Button';
import Input from 'components/Input';
import ErrorFormatted from 'components/ErrorFormatted';
import messages from '../messages';

function EditSubmittedDetails({
  snsType,
  participantDetailPage: { partDetails, error },
  intl,
  locale,
  validatorEffect: {
    email,
    fullName,
    contactNo,
    zipCode,
    city,
    state,
    street,
    building,
  },
}) {
  return (
    <div>
      {error && <ErrorFormatted invalid list={[error]} />}
      {partDetails && (
        <div className="row">
          <div className="col-12">
            {snsType === 2 && (
              <div className="row">
                <div className="col-3">
                  <Label htmlFor="email">
                    {intl.formatMessage({ ...messages.couponLink })}
                  </Label>
                </div>
                <div className="col-9">
                  <Button
                    link
                    onClick={() => {
                      if (partDetails.claim_coupon_link) {
                        window.open(partDetails.claim_coupon_link, '_blank');
                      }
                    }}
                  >
                    {partDetails.claim_coupon_link}
                  </Button>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-3">
                <Label htmlFor="email" required>
                  {intl.formatMessage({ ...messages.email })}
                </Label>
              </div>
              <div className="col-9">
                <Input id="email" name="email" {...email} />
                <ErrorFormatted {...email.error} />
              </div>
            </div>
            <div className="row my-2">
              <div className="col-3">
                <Label htmlFor="fullName" required>
                  {intl.formatMessage({ ...messages.fullName })}
                </Label>
              </div>
              <div className="col-9">
                <Input id="fullName" name="fullName" {...fullName} />
                <ErrorFormatted {...fullName.error} />
              </div>
            </div>
            <div className="row my-2">
              <div className="col-3">
                <Label htmlFor="contactNo">
                  {intl.formatMessage({ ...messages.contactNo })}
                </Label>
              </div>
              <div className="col-9">
                <Input id="contactNo" name="contactNo" {...contactNo} />
                <ErrorFormatted {...contactNo.error} />
              </div>
            </div>
            <div className="content label">
              {intl.formatMessage({ ...messages.address })}
            </div>
            {locale === 'ja' ? (
              <div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="zipCode">
                      {intl.formatMessage({ ...messages.zipCode })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="zipCode" name="zipCode" {...zipCode} />
                    <ErrorFormatted {...zipCode.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="state">
                      {intl.formatMessage({ ...messages.state })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="state" name="state" {...state} />
                    <ErrorFormatted {...state.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="city">
                      {intl.formatMessage({ ...messages.city })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="city" name="city" {...city} />
                    <ErrorFormatted {...city.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="street">
                      {intl.formatMessage({ ...messages.street })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="street" name="street" {...street} />
                    <ErrorFormatted {...street.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="building">
                      {intl.formatMessage({ ...messages.building })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="building" name="building" {...building} />
                    <ErrorFormatted {...building.error} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="street">
                      {intl.formatMessage({ ...messages.street })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="street" name="street" {...street} />
                    <ErrorFormatted {...street.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="building">
                      {intl.formatMessage({ ...messages.building })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="building" name="building" {...building} />
                    <ErrorFormatted {...building.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="city">
                      {intl.formatMessage({ ...messages.city })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="city" name="city" {...city} />
                    <ErrorFormatted {...city.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="state">
                      {intl.formatMessage({ ...messages.state })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="state" name="state" {...state} />
                    <ErrorFormatted {...state.error} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-3">
                    <Label htmlFor="zipCode">
                      {intl.formatMessage({ ...messages.zipCode })}
                    </Label>
                  </div>
                  <div className="col-9">
                    <Input id="zipCode" name="zipCode" {...zipCode} />
                    <ErrorFormatted {...zipCode.error} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

EditSubmittedDetails.propTypes = {
  participantDetailPage: PropTypes.any,
  intl: PropTypes.any,
  routeParams: PropTypes.any,
  onSubmitDetails: PropTypes.any,
  onSetData: PropTypes.any,
  locale: PropTypes.any,
  snsType: PropTypes.any,
  validatorEffect: PropTypes.any,
};

export default EditSubmittedDetails;
