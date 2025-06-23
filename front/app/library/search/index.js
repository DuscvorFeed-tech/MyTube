/* eslint-disable no-unused-expressions */
class UriSearchParams {
  constructor(p) {
    this.params = {};
    if (p) {
      const result = (/^[?#]/.test(p) ? p.slice(1) : p).split('&');
      result.forEach(query => {
        const [key, value] = query.split('=');
        this.params[key] = value
          ? decodeURIComponent(value.replace(/\+/g, ' '))
          : '';
      });
    }
  }

  /**
   * Appends a specified key/value pair as a new search parameter.
   */
  append(name, value) {
    const values = this.getAll(name) || [];
    values.push(value);
    this.set(name, values.join(','));
  }

  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   */
  delete(name) {
    delete this.params[name];
  }

  /**
   * Returns the first value associated to the given search parameter.
   */
  get(name) {
    if (this.has(name)) {
      return this.params[name];
    }

    return null;
  }

  /**
   * Returns all the values association with a given search parameter.
   */
  getAll(name) {
    const value = this.get(name);
    return value && value.split(',');
  }

  /**
   * Returns a Boolean indicating if such a search parameter exists.
   */
  has(name) {
    return Object.keys(this.params).includes(name);
  }

  /**
   * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
   */
  set(name, value) {
    this.params[name] = value;
  }

  forEach(callbackfn, args) {
    Object.keys(this.params).forEach(key => {
      callbackfn && callbackfn(key, this.params[key]);
    }, args);
  }

  toString() {
    return Object.keys(this.params)
      .map(k => `${k}=${encodeURIComponent(this.params[k])}`)
      .join('&');
  }

  [Symbol.iterator]() {
    return Object.keys(this.params)
      .map(k => `${k}=${this.params[k]}`)
      .values();
  }
}

const UnsupportedURLSearchParams = () => {
  if (!window.URLSearchParams) {
    window.URLSearchParams = UriSearchParams;
  }
};

export default UnsupportedURLSearchParams();
export { UnsupportedURLSearchParams };
