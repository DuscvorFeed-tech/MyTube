import { required } from '../../library/validator/rules';
import { email } from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  username: [required({ username: intl.formatMessage(messages.username) })],
  email: [
    required({ name: intl.formatMessage(messages.email) }),
    ...email(intl.formatMessage(messages.email)),
  ],
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
  agree: [required({ name: intl.formatMessage(messages.terms) })],
  securedFileTransfer: [],
});
