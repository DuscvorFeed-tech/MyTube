import { config } from 'utils/config';
import { required, fileExt } from '../../library/validator/rules';
import { email } from '../../helpers/validators';
import messages from './messages';

export default intl => ({
  title: [
    required({ name: intl.formatMessage(messages.title) }),
    ...email(intl.formatMessage(messages.title)),
  ],
  description: [],
  videoFile: [
    fileExt({
      name: intl.formatMessage(messages.uploadVidoeFile),
      ext: [config.SUPPORTED_VIDEO_FORMAT],
    }),
  ],
  videoThumbnail: [
    required({ name: intl.formatMessage(messages.videoThumbnail) }),
  ],
});
