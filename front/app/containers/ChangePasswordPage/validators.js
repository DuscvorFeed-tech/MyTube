import { required, range } from '../../library/validator/rules';
import messages from './messages';

export default intl => ({
  currentPassword: [
    required({ name: intl.formatMessage(messages.currentPassword) }),
    range({
      name: intl.formatMessage(messages.currentPassword),
      from: 6,
      to: 20,
      nullable: true,
    }),
    {
      normalize: (value, prevVal) => {
        if (value.length > 20) {
          return prevVal;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return value;
      },
    },
  ],
  newPassword: [
    required({ name: intl.formatMessage(messages.newPassword) }),
    range({
      name: intl.formatMessage(messages.newPassword),
      from: 6,
      to: 20,
      nullable: true,
    }),
    {
      normalize: (value, prevVal) => {
        if (value.length > 20) {
          return prevVal;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return value.replace(/\s/g, '');
      },
    },
  ],
  confirmNewPassword: [
    required({ name: intl.formatMessage(messages.confirmNewPassword) }),
    range({
      name: intl.formatMessage(messages.confirmNewPassword),
      from: 6,
      to: 20,
      nullable: true,
    }),
    {
      normalize: (value, prevVal) => {
        if (value.length > 20) {
          return prevVal;
        }

        // return value.replace(/[^a-zA-Z0-9]/g, '');
        return value.replace(/\s/g, '');
      },
    },
  ],
});
