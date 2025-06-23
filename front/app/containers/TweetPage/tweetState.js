/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import moment from 'moment';
import * as parseTweet from 'twitter-text/dist/parseTweet';
import { expandDateTime } from 'utils/commonHelper';
import { MediaType, TWEET_TEXT_LIMIT } from 'library/commonValues';
import validation from './validators';
import useValidation, { isValid } from '../../library/validator';
import {
  checkFileCount,
  checkFileSize,
  fileExt,
  minValue,
} from '../../library/validator/rules';
import messages from './messages';

/**
 * Image Validation
 * @param {*} evt event data
 * @param {*} state state data
 * @param {*} intl intl
 * @param {*} isAdd true or false
 */
export const ImageValidation = (evt, state, intl, isAdd = false) => {
  let error = [];
  if (evt && evt.target) {
    let { files } = evt.target;
    if (isAdd) {
      files = [...files];
      if (files.length > 4) {
        // pending error code
        error.push({
          errorCode: 'ERROR0046',
          formatIntl: { id: 'ERROR0046', values: { max: 4 } },
        });
      }

      const subErr = [];
      const err = files.map(file => {
        if (subErr.length === 0) {
          const sizeErr = checkFileSize({
            name: intl.formatMessage(messages.image),
            max: 5,
          })({
            value: file,
          });
          const extErr = fileExt({
            ext: ['jpg', 'jpeg', 'png'],
            name: intl.formatMessage(messages.image),
          })({
            value: file,
          });

          if (sizeErr || extErr) {
            subErr.push({
              errorCode: 'ERROR0045',
              formatIntl: {
                id: 'ERROR0045',
                values: { ext: ['jpg', 'jpeg', 'png'], max: 5 },
              },
            });
          }
          return subErr;
        }

        return false;
      });

      if (err) {
        error = error.concat(subErr);
      }
    }
  }

  const arr = Array.from(state.image);
  let media = MediaType.Photo;
  if (error.length === 0) {
    if (isAdd) {
      arr.push(...evt.target.files);
    } else {
      arr.splice(evt,1);
    }
  }

  if (error.length > 0 || arr.length === 0) {
    media = MediaType.Data;
  }

  return { imgErr: error, media, arr };
};

export const VidGIFValidation = (evt, intl, isVid = false) => {
  const error = [];

  if (evt) {
    let ext = ['gif'];
    let id = messages.GIF;
    const { files } = evt;
    if (isVid) {
      ext = ['mp4, mov'];
      id = messages.video;
    } else {
      const sizeErr = checkFileSize({
        name: intl.formatMessage(messages.GIF),
        max: 5,
      })({
        value: files[0],
      });

      if (sizeErr) {
        error.push(sizeErr);
      }
    }

    const extErr = fileExt({
      ext,
      name: intl.formatMessage(id),
    })({
      value: files[0],
    });

    if (extErr) {
      error.push(extErr);
    }
  }

  return error;
};

export const tweetTextLengthValidation = (name, content) => {
  const errors = [];
  let invalid = false;
  let weightLength = 0;

  if (content && content.value) {
    const { weightedLength } = parseTweet(content.value);
    weightLength = weightedLength;
    if (weightLength > TWEET_TEXT_LIMIT) {
      errors.push({
        errorCode: 'ERROR0028',
        formatIntl: { id: 'ERROR0028', values: { name, max: TWEET_TEXT_LIMIT } },
      });

      invalid = true;
    }
  }

  return {content: {error: {list: errors, touched:true, invalid}, ...content}, availableBytes: TWEET_TEXT_LIMIT - weightLength};
};

export const ValidateSchedule = (intl, tweetType) => {
  const validator = validation(intl);
  const date = useValidation(new Date(), undefined, undefined, ({ value }) => {
    if (value) {
      return { dt: moment(value).format('MM/DD/YYYY') };
    }
    return { dt: null };
  });

  const hour = useValidation(expandDateTime(false, 5).hours);
  const minute = useValidation(expandDateTime(false, 5).minutes);
  const schedDate =
    date.dt && Number(tweetType) === 2
      ? moment(`${date.dt} ${hour}:${minute}`).format(
        'MM/DD/YYYY HH:mm',
      )
      : undefined;


  function resetToCurrent(type) {
    if (type === 1) {
      const expand = expandDateTime(false, 5);
      date.setvalue(expand.dt);
      hour.setvalue(expand.hours);
      minute.setvalue(expand.minutes);
    }

  }

  return {
    date,
    hour,
    minute,
    schedDate,
    resetToCurrent,
  };
};

export const onChangeScheduleValidation = state => {
  const format = 'MM/DD/YYYY HH:mm';
  const [error, setError] = useState(null);
  const { intl, tweetType, date, hour, minute } = state;
  useEffect(() => {
    let invalid = null;
    const startDate = moment(`${date} ${hour}:${minute}`, format);
    if (tweetType === 2) {
      invalid = minValue({ errorCode: 'ERROR0033', min: moment() })({
        value: startDate,
      });
    }

    setError(invalid);
  }, [tweetType, date, hour, minute]);

  if (error) {
    return { list: [error], invalid: true };
  }

  return undefined;
};
