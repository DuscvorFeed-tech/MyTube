import moment from 'moment';
import LocalStorage from './localstorage';

class AdminLocal {
  static successfulLogin({ token, tokenExpiration, userId, firstLogin }) {
    LocalStorage.writeLocalStorage('admin_token', token);
    console.log(token);
    if (!firstLogin) {
      LocalStorage.writeLocalStorage('token_expiration', tokenExpiration);
      LocalStorage.writeLocalStorage(
        'expiry',
        moment()
          .add(tokenExpiration, 'hour')
          .format(),
      );
      LocalStorage.writeLocalStorage('user_id', userId);
    }
  }

  static logout() {
    LocalStorage.clearLocalStorage();
  }

  static isLoggedIn() {
    return (
      !!LocalStorage.readLocalStorage('admin_token') && !AdminLocal.isExpired()
    );
  }

  static isExpired() {
    const expiry = AdminLocal.getExpiry();
    return !expiry || moment() > moment(expiry);
  }

  static isForResetPassword() {
    return AdminLocal.isExpired() && !!AdminLocal.getAdminToken();
  }

  static getAdminToken() {
    return LocalStorage.readLocalStorage('admin_token');
  }

  static getTokenExp() {
    return LocalStorage.readLocalStorage('token_expiration');
  }

  static getExpiry() {
    return LocalStorage.readLocalStorage('expiry');
  }

  static getUserId() {
    return LocalStorage.readLocalStorage('user_id');
  }

  static getTokenInfo() {
    return {
      adminToken: LocalStorage.readLocalStorage('admin_token'),
      tokenExp: LocalStorage.readLocalStorage('token_expiration'),
      userId: LocalStorage.readLocalStorage('user_id'),
    };
  }

  static getIPAddress() {
    return LocalStorage.readLocalStorage('publicIP');
  }

  static setIPAddress(ip) {
    if (ip === undefined) {
      throw new Error('invalid ip address');
    }
    LocalStorage.writeLocalStorage('publicIP', ip);
  }

  static savePagePath(page) {
    LocalStorage.writeLocalStorage('pagePath', page);
  }
}

export default AdminLocal;
