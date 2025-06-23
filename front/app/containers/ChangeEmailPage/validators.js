import { required, maxLength } from '../../library/validator/rules';
import { email } from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  password: [
    required({ name: intl.formatMessage(messages.password) }),
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
  newEmail: [
    required({ name: intl.formatMessage(messages.newEmail) }),
    ...email(intl.formatMessage(messages.newEmail)),
    maxLength({ name: intl.formatMessage(messages.newEmail), max: 255 }),
  ],
  confirmEmail: [
    required({ name: intl.formatMessage(messages.confirmEmail) }),
    ...email(intl.formatMessage(messages.confirmEmail)),
    maxLength({ name: intl.formatMessage(messages.confirmEmail), max: 255 }),
  ],
});
