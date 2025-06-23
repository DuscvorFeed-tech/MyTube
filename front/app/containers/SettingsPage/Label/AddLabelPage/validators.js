import { required } from '../../../../library/validator/rules';
import { labelName } from '../../../../helpers/validators';
import messages from './messages';

export default intl => ({
  labelName: [
    required({ name: intl.formatMessage(messages.labelName) }),
    ...labelName(intl.formatMessage(messages.labelName)),
  ],
  color: [required({ name: intl.formatMessage(messages.color) })],
});
