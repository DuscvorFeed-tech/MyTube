import { required } from '../../library/validator/rules';
import { email } from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  email: [
    required({ name: intl.formatMessage(messages.email) }),
    ...email(intl.formatMessage(messages.email)),
  ],
});
