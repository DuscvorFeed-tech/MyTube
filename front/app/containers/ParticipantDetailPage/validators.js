/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */

import {
  required,
  maxLength,
  fileExt,
  checkFileSize,
  checkFileCount,
} from 'library/validator/rules';
import { email } from 'helpers/validators';
import messages from './messages';

export default intl => ({
  content: [
    required({ name: intl.formatMessage(messages.content) }),
    maxLength({ name: intl.formatMessage(messages.content), max: 10000 }),
  ],
  email: (isExist, isRequired=true) =>
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.email) }):()=>undefined,
        maxLength({ name: intl.formatMessage(messages.email), max: 100 }),
        ...email(intl.formatMessage(messages.email)),
      ]
      : [() => undefined],
  name: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.name) }):()=>undefined,
        maxLength({ name: intl.formatMessage(messages.name), max: 50 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [() => undefined],
  contact_no: isExist => 
    isExist
      ? [
        required({ name: intl.formatMessage(messages.contact_no) }),
        maxLength({ name: intl.formatMessage(messages.contact_no), max: 12 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\D/g, '');
            return normvalue;
          },
        },
      ]
      : [() => undefined],
  phone: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.phone) }):()=>undefined,
        maxLength({ name: intl.formatMessage(messages.phone), max: 12 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\D/g, '');
            return normvalue;
          },
        },
      ]
      : [() => undefined],
  zip_code: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.zip_code) }):()=>undefined,
        maxLength({ name: intl.formatMessage(messages.zip_code), max: 8 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\D/g, '');
            if (normvalue.length>3) {
              return `${normvalue.substr(0,3)}-${normvalue.substr(3,4)}`
            } 
            return normvalue
            
          },
        },
      ]
      : [() => undefined],
  state: isExist => 
    isExist
      ? [
        required({ name: intl.formatMessage(messages.state) }),
        maxLength({ name: intl.formatMessage(messages.state), max: 100 }),
      ]
      : [
        () => undefined
      ],
  prefecture: (isExist, isRequired=true) =>  [
    isExist
      ? isRequired?required({ name: intl.formatMessage(messages.prefecture) }):() => undefined
      : () => undefined,
  ],
  address1: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.address1) }):() => undefined,
        maxLength({ name: intl.formatMessage(messages.address1), max: 100 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [
        () => undefined
      ],
  address2: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.address2) }):() => undefined,
        maxLength({ name: intl.formatMessage(messages.address2), max: 100 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [
        () => undefined
      ],
  address3: (isExist, isRequired=true) => 
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.address3) }):()=> undefined,
        maxLength({ name: intl.formatMessage(messages.address3), max: 100 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [
        () => undefined
      ],
  city: isExist => 
    isExist
      ? [
        required({ name: intl.formatMessage(messages.city) }),
        maxLength({ name: intl.formatMessage(messages.city), max: 100 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [
        () => undefined
      ],
  street: isExist => 
    isExist
      ? [
        required({ name: intl.formatMessage(messages.street) }),
        maxLength({ name: intl.formatMessage(messages.street), max: 100 }),
        {
          normalize: value => {
            const normvalue = value.replace(/\||\:|\,|\;|\//g, '');
            return normvalue;
          },
        },
      ]
      : [
        () => undefined
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
  textbox: (isExist, isRequired=true) =>
    isExist
      ? [
        isRequired?required({ name: intl.formatMessage(messages.formTextbox) }):()=>undefined,
        maxLength({ name: intl.formatMessage(messages.formTextbox), max: 120 }),
        {
          normalize: value => {
            const normvalue = value.replace(/,/g, '');
            return normvalue;
          },
        },
      ]
      : [() => undefined],
});
