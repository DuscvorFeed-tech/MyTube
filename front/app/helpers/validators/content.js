import { maxLength } from '../../library/validator/rules';

export default name => [maxLength({ name, max: 280 })];
