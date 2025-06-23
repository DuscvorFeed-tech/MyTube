import { range, alphanumeric } from '../../library/validator/rules';

export default (name, nullable) => [
  range({ name, from: 6, to: 20, nullable }),
  alphanumeric({ name, nullable }),
];
