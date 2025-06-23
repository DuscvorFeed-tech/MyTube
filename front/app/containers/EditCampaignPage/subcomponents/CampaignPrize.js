/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Button from 'components/Button';
import Label from 'components/Label';
import Input from 'components/Input';
import IcoFont from 'react-icofont';
import { useCampaignPrize, useRaffleFixedPrize } from '../editState';
import ErrorFormatted from '../../../components/ErrorFormatted';

import messages from '../messages';

const CampaignPrize = ({
  intl,
  id,
  name,
  index,
  amount,
  percentage,
  origAmnt,
  iconPlus,
  raffle_type,
  addPrizeInfo,
  removePrizeInfo,
  setCampaignPrize,
  updatePrizeAmount,
  maxAmount,
  disabled,
  error,
  isSavedSched,
  isAmtDisabled,
  // prizeInfo,
}) => {
  const { prizeName, prizeAmount, winPercentage } =
    raffle_type !== EnumRaffleTypes.FIXED
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useCampaignPrize(intl, name, amount, percentage, origAmnt, isSavedSched)
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useRaffleFixedPrize(intl, maxAmount);

  useEffect(() => {
    if (name !== prizeName.value) {
      prizeName.setvalue(name);
    }
    if (amount !== prizeAmount.value) {
      prizeAmount.setvalue(amount);
    }
  }, [name, amount]);

  useEffect(() => {
    if (
      ![prizeName.value, prizeAmount.value, winPercentage.value].every(
        s => s === undefined,
      )
    ) {
      setCampaignPrize(
        index,
        prizeName.value,
        prizeAmount.value,
        winPercentage.value,
        origAmnt,
      );
    }
  }, [prizeAmount.value, prizeName.value, winPercentage.value]);

  useEffect(() => {
    if (raffle_type === EnumRaffleTypes.FIXED) {
      if (amount > maxAmount) {
        updatePrizeAmount(index, maxAmount);
      }
    }
  }, [maxAmount]);

  const invalid =
    (error && error.invalid) ||
    prizeName.error.invalid ||
    !name ||
    prizeAmount.error.invalid ||
    !amount ||
    (raffle_type === EnumRaffleTypes.INSTANT
      ? winPercentage.error.invalid || !percentage
      : false);

  return (
    <div className="row justify-items-center mb-2">
      <div className="col-auto pr-0">
        <Label>{index + 1}</Label>
      </div>
      <div className="col pr-0">
        <Input
          placeholder={intl.formatMessage({ ...messages.prizeName })}
          {...prizeName}
          value={name}
        />
        <ErrorFormatted {...prizeName.error} />
        <ErrorFormatted {...error} />
      </div>
      <div className="col pr-0" style={{ maxWidth: 150 }}>
        <Input
          placeholder={intl.formatMessage({ ...messages.quantity })}
          {...prizeAmount}
          value={amount}
          disabled={disabled || isAmtDisabled}
          maxLength="4"
        />
        <ErrorFormatted {...prizeAmount.error} />
      </div>
      {raffle_type === '1' && (
        <div className="col pr-0">
          <Input
            placeholder={intl.formatMessage({ ...messages.winningRate })}
            {...winPercentage}
            value={percentage}
            disabled={disabled}
          />
          <ErrorFormatted {...winPercentage.error} />
        </div>
      )}
      <div className="col-auto">
        <div className="iconPlus-container">
          {iconPlus && (
            <>
              {index !== 0 && (
                <Button
                  small
                  width="icon"
                  className="mr-3"
                  secondary
                  onClick={() => removePrizeInfo(index)}
                  disabled={isAmtDisabled}
                >
                  <IcoFont
                    icon="icofont-close-circled"
                    style={{
                      fontSize: '1.1rem',
                    }}
                  />
                </Button>
              )}
              <Button
                small
                width="icon"
                secondary
                onClick={addPrizeInfo}
                disabled={disabled || invalid || isAmtDisabled}
              >
                <IcoFont
                  icon="icofont-plus-circle"
                  style={{
                    fontSize: '1.1rem',
                  }}
                />
              </Button>
            </>
          )}
          {!iconPlus && (
            <Button
              small
              width="icon"
              secondary
              onClick={() => removePrizeInfo(index)}
              disabled={isAmtDisabled}
            >
              <IcoFont
                icon="icofont-close-circled"
                style={{
                  fontSize: '1.1rem',
                }}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignPrize;
