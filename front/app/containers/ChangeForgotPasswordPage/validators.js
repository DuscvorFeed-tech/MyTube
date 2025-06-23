import { required } from '../../library/validator/rules';
import messages from './messages';

export default intl => ({
  password: [
    required({ name: intl.formatMessage(messages.password) }),
    {
      normalize: (value, prevVal) => {
        if (value.length > 20) {
          return prevVal;
        }
        return value;
      },
    },
  ],
  confirmPassword: [
    required({ name: intl.formatMessage(messages.confirmPassword) }),
    {
      normalize: (value, prevVal) => {
        if (value.length > 20) {
          return prevVal;
        }
        return value;
      },
    },
  ],
});
