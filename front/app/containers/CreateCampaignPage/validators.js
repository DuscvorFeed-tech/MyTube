import { nonUrlSearch } from 'utils/commonHelper';
import {
  required,
  maxValue,
  maxLength,
  checkFileCount,
  checkFileSize,
  fileExt,
  minValue,
} from '../../library/validator/rules';
import {
  campaignTitle,
  campaignDescription,
  campaignType,
  content,
  prizeName,
} from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  campaignTitle: [
    required({ name: intl.formatMessage(messages.campaignTitle) }),
    ...campaignTitle(intl.formatMessage(messages.campaignTitle)),
  ],
  campaignDescription: [
    ...campaignDescription(intl.formatMessage(messages.campaignDescription)),
  ],
  hashTag: [
    required({ name: intl.formatMessage(messages.campaignHashtag) }),
    // temporary limit each hashtag length to 20
    // maxLength({ name: intl.formatMessage(messages.campaignHashtag), max: 20 }),
    maxLength({ name: intl.formatMessage(messages.campaignHashtag), max: 100 }),
    ({ value }) => {
      if (value) {
        const numTest = new RegExp(/[^0-9]/g);
        if (!numTest.test(value)) {
          const errorCode = 'ERROR0021';
          return {
            errorCode,
            formatIntl: {
              id: errorCode,
              values: {
                errorCode,
                name: intl.formatMessage(messages.campaignHashtag),
              },
            },
          };
        }
      }
      return undefined;
    },
    {
      normalize: value => value.replace(/[#\s]/g, ''),
    },
  ],
  accountFollowed: [
    maxLength({ name: intl.formatMessage(messages.entryCondition), max: 15 }),
    {
      normalize: value => value.replace(/[^a-zA-Z0-9_]/g, ''),
    },
  ],
  campaignType: [
    required({ name: intl.formatMessage(messages.campaignType) }),
    ...campaignType(intl.formatMessage(messages.campaignType)),
  ],
  startHour: startOnPublish => [
    startOnPublish
      ? () => undefined
      : required({ name: intl.formatMessage(messages.startHour) }),
    maxValue({ name: intl.formatMessage(messages.startHour), max: 24 }),
  ],
  startMinute: [required({ name: intl.formatMessage(messages.startMinute) })],
  endMinute: [required({ name: intl.formatMessage(messages.endMinute) })],
  formTemplate: [required({ name: intl.formatMessage(messages.form) })],
  dmWinTemplate: snsType =>
    snsType === 1
      ? [required({ name: intl.formatMessage(messages.winnerTemplate) })]
      : [],
  dmFormTemplate: [
    required({ name: intl.formatMessage(messages.FormTemplate) }),
  ],
  postWinTemplate: [
    required({ name: intl.formatMessage(messages.winnerTemplate) }),
  ],
  prizeAmount: [
    required({ name: intl.formatMessage(messages.quantity) }),
    minValue({ name: intl.formatMessage(messages.quantity), min: 1 }),
    {
      normalize: value => {
        const normalizedValue = value.replace(/[^\d]/g, '');
        if (normalizedValue) {
          let valueInt = parseInt(value.replace(/[^\d]-/g, ''), 10);
          if (valueInt > 5000) {
            valueInt = 5000;
          }

          return valueInt;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return normalizedValue;
      },
    },
  ],
  percentage: [
    required({ name: intl.formatMessage(messages.winningRate) }),
    minValue({
      name: intl.formatMessage(messages.winningRate),
      min: 1,
    }),
    maxValue({ name: intl.formatMessage(messages.winningRate), max: 100 }),
    {
      normalize: value => {
        const normalizedValue = value.replace(/[^\d]/g, '');
        if (normalizedValue) {
          let valueInt = parseInt(value.replace(/[^\d]-/g, ''), 10);
          if (valueInt > 100) {
            valueInt = 100;
          }

          return valueInt;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return normalizedValue;
      },
    },
  ],
  fixedAmount: (max = 100) => [
    required({ name: intl.formatMessage(messages.quantity) }),
    minValue({ name: intl.formatMessage(messages.quantity), min: 1 }),
    maxValue({ name: intl.formatMessage(messages.quantity), max }),
    {
      normalize: value => {
        const normalizedValue = value.replace(/[^\d]/g, '');
        if (normalizedValue) {
          let valueInt = parseInt(value.replace(/[^\d]-/g, ''), 10);
          if (valueInt > max) {
            valueInt = max;
          }

          return valueInt;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return normalizedValue;
      },
    },
  ],
  postTweetViaCamps: [
    required({ name: intl.formatMessage(messages.postTweetViaCamps) }),
  ],
  content: [
    required({ name: intl.formatMessage(messages.campaignContent) }),
    ...content(intl.formatMessage(messages.campaignContent)),
  ],
  winLimit: [
    required({ name: intl.formatMessage(messages.winLimit) }),
    minValue({ name: intl.formatMessage(messages.winLimit), min: 1 }),
    {
      normalize: value => value.replace(/[^\d]/g, ''),
    },
  ],
  raffleInterval: [
    required({ name: intl.formatMessage(messages.raffleInterval) }),
  ],
  prizeName: [
    required({ name: intl.formatMessage(messages.prizeName) }),
    ...prizeName(intl.formatMessage(messages.prizeName)),
    {
      normalize: value => {
        const normalizedValue = value.replace(/ /g, '');
        if (normalizedValue === '') {
          return '';
        }
        return value;
      },
    },
  ],
  winCampaignId: isCamp => [
    Number(isCamp) === 3
      ? required({ name: intl.formatMessage(messages.campaign) })
      : () => undefined,
  ],
  followerCount: [
    required({ name: intl.formatMessage(messages.followersCondition) }),
    {
      normalize: value => value.replace(/[^\d]/g, ''),
    },
  ],
  increasePercent: [
    required({ name: intl.formatMessage(messages.incWinRate) }),
    minValue({
      name: intl.formatMessage(messages.incWinRate),
      min: 1,
    }),
    maxValue({ name: intl.formatMessage(messages.incWinRate), max: 100 }),
    {
      normalize: value => {
        const normalizedValue = value.replace(/[^\d]/g, '');
        if (normalizedValue) {
          let valueInt = parseInt(value.replace(/[^\d]-/g, ''), 10);
          if (valueInt > 100) {
            valueInt = 100;
          }

          return valueInt;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return normalizedValue;
      },
    },
  ],
  formFields: [
    required({
      name: intl.formatMessage(messages.inputFields),
      errorCode: 'ERROR0003',
    }),
  ],
  formFields2: [
    required({
      name: intl.formatMessage(messages.inputFields),
      errorCode: 'ERROR0003',
    }),
  ],
  formFields3: [],
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
  hashtagCondition: [
    required({
      name: intl.formatMessage(messages.multipleHashtagLogicSettings),
    }),
  ],
  postId: [
    {
      normalize: value => nonUrlSearch(value),
    },
  ],
});
