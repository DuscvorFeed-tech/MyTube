/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Button from 'components/Button';
import Label from 'components/Label';
import Input from 'components/Input';
import IcoFont from 'react-icofont';
import { useCampaignPrize, useRaffleFixedPrize } from '../inputStateEffect';
import ErrorFormatted from '../../../components/ErrorFormatted';
import messages from '../messages';

const PrizeForCampaignEnd = ({
  intl,
  name,
  index,
  amount,
  percentage,
  iconPlus,
  raffleType,
  addPrizeInfo,
  removePrizeInfo,
  setCampaignPrize,
  updatePrizeAmount,
  maxAmount,
  disabled,
  error,
  prizeDistribute,
  // prizeInfo,
}) => {
  const { prizeName, prizeAmount, winPercentage } =
    raffleType !== EnumRaffleTypes.FIXED
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useCampaignPrize(intl, name, amount, percentage)
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useRaffleFixedPrize(intl, maxAmount);

  useEffect(() => {
    if (prizeDistribute) {
      if (name !== prizeName.value) {
        prizeName.setvalue(name);
      }
      if (amount !== prizeAmount.value) {
        prizeAmount.setvalue(amount);
      }
    }
  }, [name, amount]);

  useEffect(() => {
    if (
      ![prizeName.value, prizeAmount.value, winPercentage.value].every(
        s => s === undefined,
      ) &&
      !prizeDistribute
    ) {
      setCampaignPrize(
        index,
        prizeName.value,
        prizeAmount.value,
        winPercentage.value,
      );
    }
  }, [prizeAmount.value, prizeName.value, winPercentage.value]);

  useEffect(() => {
    if (raffleType === EnumRaffleTypes.FIXED) {
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
    (raffleType === EnumRaffleTypes.INSTANT
      ? winPercentage.error.invalid || !percentage
      : false);

  return (
    <>
      <div className="row justify-items-center mb-2">
        <div className="col-auto pr-0">
          <Label>{index + 1}</Label>
        </div>
        <div className="col pr-0">
          <Input
            placeholder={intl.formatMessage(
              { id: 'T0000031' },
              { name: intl.formatMessage({ ...messages.prizeName }) },
            )}
            {...prizeName}
            // value={name}
            name={name}
            disabled={disabled}
          />
          <ErrorFormatted {...prizeName.error} />
          <ErrorFormatted {...error} />
        </div>
        <div className="col pr-0" style={{ maxWidth: 150 }}>
          <Input
            placeholder={intl.formatMessage(
              { id: 'T0000031' },
              { name: intl.formatMessage({ ...messages.quantity }) },
            )}
            {...prizeAmount}
            value={amount}
            disabled={disabled}
            maxLength="4"
          />
          <ErrorFormatted {...prizeAmount.error} />
        </div>
        {raffleType === '1' && (
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
                    className="mr-3"
                    small
                    width="icon"
                    secondary
                    onClick={() => removePrizeInfo(index)}
                    disabled={disabled}
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
                  disabled={disabled || invalid}
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
                disabled={disabled}
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
      <div />
    </>
  );
};

export { PrizeForCampaignEnd };
