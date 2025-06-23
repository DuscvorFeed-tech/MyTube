import { maxPrizeNameLength } from '../../library/validator/rules';

export default name => [maxPrizeNameLength({ name, max: 100 })];
