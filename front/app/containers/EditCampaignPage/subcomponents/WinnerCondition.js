/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useEffect } from 'react';
// import Button from 'components/Button';
// import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
// import IcoFont from 'react-icofont';
import { CountPercentageState } from '../editState';
import ErrorFormatted from '../../../components/ErrorFormatted';
import messages from '../messages';

const WinnerCondition = ({
  intl,
  item,
  idx,
  // iconPlus,
  // addCondition,
  // removeCondition,
  setWinCondition,
  raffle_type,
  isSavedSched,
}) => {
  const { follower_count, increase_percentage } = CountPercentageState(
    intl,
    raffle_type,
    item.follower_count,
    item.increase_percentage,
  );

  useEffect(() => {
    if (
      ![follower_count.value, increase_percentage.value].every(
        s => s === undefined,
      )
    ) {
      let inv = follower_count.error.invalid;
      inv =
        Number(raffle_type.value) === 1
          ? increase_percentage.error.invalid || false
          : false;
      setWinCondition(
        idx,
        follower_count.value,
        increase_percentage.value,
        inv,
      );
    }
  }, [
    follower_count.value,
    increase_percentage.value,
    follower_count.error,
    increase_percentage.error,
  ]);
  return (
    <>
      <div className="row align-items-baseline">
        <div className="col">
          <div className="row align-items-baseline">
            <div className="col pr-0" style={{ maxWidth: 150 }}>
              <Input
                id="numberFollow"
                name="numberFollow"
                {...follower_count}
                value={item.follower_count}
                disabled={!isSavedSched}
                maxLength="6"
              />
              <ErrorFormatted {...follower_count.error} />
            </div>
          </div>
        </div>
        {Number(raffle_type.value) === 1 && (
          <div className="col ml-4">
            <div className="row align-items-baseline">
              <div className="col-auto pr-0">
                {intl.formatMessage({ ...messages.incWinRate })}
              </div>
              <div className="col">
                <Input
                  id="winRate"
                  name="winRate"
                  {...increase_percentage}
                  value={item.increase_percentage}
                  disabled={!isSavedSched}
                />
                <ErrorFormatted {...increase_percentage.error} />
              </div>
            </div>
          </div>
        )}
        {/* <div className="col-1 px-0">
          {isSavedSched && iconPlus && (
            <>
              {idx !== 0 && (
                <Button
                  className="mr-3"
                  secondary
                  small
                  width="icon"
                  disabled={!isSavedSched}
                  onClick={() => removeCondition(idx)}
                >
                  <IcoFont
                    icon="icofont-close-circled"
                    style={{
                      fontSize: '1rem',
                    }}
                  />
                </Button>
              )}
              <Button
                small
                width="icon"
                secondary
                onClick={() => addCondition()}
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
          {isSavedSched && !iconPlus && (
            <Button
              small
              width="icon"
              secondary
              onClick={() => removeCondition(idx)}
            >
              <IcoFont
                icon="icofont-close-circled"
                style={{
                  fontSize: '1.1rem',
                }}
              />
            </Button>
          )}
        </div> */}
      </div>
    </>
  );
};

export { WinnerCondition };
