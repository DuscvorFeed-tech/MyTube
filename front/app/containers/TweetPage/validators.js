import { required } from 'library/validator/rules';
import { content } from 'helpers/validators';
import messages from './messages';

export default intl => ({
  content: [
    required({ name: intl.formatMessage(messages.content) }),
    ...content(intl.formatMessage(messages.content)),
  ],
});
