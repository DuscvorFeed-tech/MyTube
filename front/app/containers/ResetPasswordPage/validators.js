import { required } from '../../library/validator/rules';
import { password, equalTo } from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  password: [
    required({ name: intl.formatMessage(messages.newPassword) }),
    ...password(intl.formatMessage(messages.newPassword), true),
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
  confirmPassword: passValue => [
    required({ name: intl.formatMessage(messages.confirmPassword) }),
    ...equalTo(
      intl.formatMessage(messages.confirmPassword),
      passValue,
      intl.formatMessage(messages.newPassword),
    ),
  ],
});
