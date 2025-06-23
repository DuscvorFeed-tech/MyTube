import {
  required,
  fileExt,
  checkFileSize,
  checkFileCount,
} from '../../../../library/validator/rules';
import {
  templateName,
  templateDescription,
  templateContent,
} from '../../../../helpers/validators';
import messages from './messages';

export default intl => ({
  templateName: [
    required({ name: intl.formatMessage(messages.templateName) }),
    ...templateName(intl.formatMessage(messages.templateName)),
  ],
  templateType: [required({ name: intl.formatMessage(messages.type) })],
  templateCategory: [required({ name: intl.formatMessage(messages.category) })],
  templateDescription: templateDescription(
    intl.formatMessage(messages.templateDescription),
  ),
  templateContent: [
    required({ name: intl.formatMessage(messages.templateContent) }),
    ...templateContent(intl.formatMessage(messages.templateContent)),
  ],
  templateImage: [
    fileExt({
      name: intl.formatMessage(messages.templateImage),
      ext: ['jpg', 'jpeg', 'png'],
    }),
    checkFileSize({
      name: intl.formatMessage(messages.templateImage),
      max: 5,
    }),
  ],
  templateVideo: [
    fileExt({
      name: intl.formatMessage(messages.templateImage),
      ext: ['mp4', 'mov'],
    }),
    checkFileSize({
      name: intl.formatMessage(messages.templateImage),
      max: 512,
    }),
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
});
