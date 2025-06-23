import { equalsTo } from '../../library/validator/rules';

export default (name, ref, refName) => [equalsTo({ name, ref, refName })];
