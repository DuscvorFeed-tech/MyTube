import {
  required,
  maxValue,
  minValue,
  fileExt,
  checkFileSize,
  checkFileCount,
  maxLength,
} from 'library/validator/rules';
import messages from './messages';

export default intl => ({
  password: [
    required({ name: intl.formatMessage(messages.password) }),
    {
      normalize: value => value.replace(/ /g, ''),
    },
  ],
  winner: max => [
    required({ name: intl.formatMessage(messages.winner) }),
    minValue({ name: intl.formatMessage(messages.winner), min: 1 }),
    maxValue({ name: intl.formatMessage(messages.winner), max }),
    {
      normalize: value => {
        const normalizedValue = value.replace(/[^\d]/g, '');
        if (normalizedValue) {
          let valueInt = parseInt(value.replace(/[^\d]-/g, ''), 10);
          if (valueInt > max) {
            valueInt = max;
            return valueInt;
          }
        }

        return normalizedValue;
      },
    },
  ],
  content: [
    required({ name: intl.formatMessage(messages.content) }),
    maxLength({ name: intl.formatMessage(messages.content), max: 10000 }),
  ],
  tweetImageUpload: [
    ({ value }) =>
      checkFileCount({
        name: intl.formatMessage(messages.imageFile),
        max: 4,
      })({
        value,
      }),
    ({ value }) => {
      if (value && value.length) {
        const errors = value.map(val =>
          checkFileSize({
            name: intl.formatMessage(messages.imageFile),
            max: 5,
          })({
            value: val,
          }),
        );

        return errors.find(e => e !== undefined);
      }
      return undefined;
    },
    ({ value }) => {
      if (value && value.length) {
        const errors = value.map(val =>
          fileExt({
            name: intl.formatMessage(messages.imageFile),
            ext: 'jpg,jpeg,png',
          })({
            value: val,
          }),
        );

        return errors.find(e => e !== undefined);
      }
      return undefined;
    },
  ],
  tweetGifUpload: [
    ({ value }) =>
      checkFileCount({
        name: intl.formatMessage(messages.gifFile),
        max: 1,
      })({
        value,
      }),
    ({ value }) => {
      if (value && value.length) {
        const errors = value.map(val =>
          checkFileSize({
            name: intl.formatMessage(messages.gifFile),
            max: 5,
          })({
            value: val,
          }),
        );

        return errors.find(e => e !== undefined);
      }
      return undefined;
    },
    ({ value }) => {
      if (value && value.length) {
        const errors = value.map(val =>
          fileExt({
            name: intl.formatMessage(messages.gifFile),
            ext: 'gif',
          })({
            value: val,
          }),
        );

        return errors.find(e => e !== undefined);
      }
      return undefined;
    },
  ],
  tweetVideoUpload: [
    ({ value }) =>
      checkFileCount({
        name: intl.formatMessage(messages.videoFile),
        max: 1,
      })({
        value,
      }),
    ({ value }) => {
      if (value && value.length) {
        const errors = value.map(val =>
          fileExt({
            name: intl.formatMessage(messages.videoFile),
            ext: 'mp4,mov',
          })({
            value: val,
          }),
        );

        return errors.find(e => e !== undefined);
      }
      return undefined;
    },
  ],
  csvFile: [
    fileExt({
      name: intl.formatMessage(messages.uploadCSVFile),
      ext: ['csv'],
    }),
    checkFileSize({
      name: intl.formatMessage(messages.uploadCSVFile),
      max: 3,
    }),
  ],
});
