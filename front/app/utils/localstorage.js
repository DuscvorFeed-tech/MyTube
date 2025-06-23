class LocalStorage {
  static readLocalStorage(key) {
    try {
      return atob(localStorage.getItem(key) || '');
    } catch (err) {
      return null;
    }
  }

  static writeLocalStorage(key, value) {
    if (value === undefined) {
      throw new Error('invalid value');
    }
    localStorage.setItem(key, btoa(value));
  }

  static removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  static clearLocalStorage() {
    localStorage.clear();
  }
}

export default LocalStorage;
