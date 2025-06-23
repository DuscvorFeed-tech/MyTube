import {
  required,
  maxLength,
  fileExt,
  checkFileSize,
} from 'library/validator/rules';
import messages from './messages';

export default intl => ({
  formName: [
    required({ name: intl.formatMessage(messages.formName) }),
    maxLength({ name: intl.formatMessage(messages.formName), max: 100 }),
  ],
  content: [
    required({ name: intl.formatMessage(messages.content) }),
    maxLength({ name: intl.formatMessage(messages.content), max: 1000 }),
  ],
  description: [
    maxLength({ name: intl.formatMessage(messages.description), max: 100 }),
  ],
  imageHeader: [
    fileExt({
      name: intl.formatMessage(messages.imageHeader),
      ext: ['jpg', 'jpeg', 'png'],
    }),
    checkFileSize({
      name: intl.formatMessage(messages.imageHeader),
      max: 5,
    }),
  ],
  title: [
    required({ name: intl.formatMessage(messages.title) }),
    maxLength({ name: intl.formatMessage(messages.title), max: 100 }),
  ],
  footer: [maxLength({ name: intl.formatMessage(messages.footer), max: 100 })],
});
