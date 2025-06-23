import { required } from '../../library/validator/rules';
import messages from './messages';

export default intl => ({
  emailUsername: [
    required({ name: intl.formatMessage(messages.emailUsername) }),
  ],
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
});
