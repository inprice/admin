import Consts from '../helpers/consts';

export default {

  saveSessionInfo(info) {
    // tokens
    localStorage.setItem(Consts.keys.token.access, info.access);
    localStorage.setItem(Consts.keys.token.refresh, info.refresh);
    // user
    localStorage.setItem(Consts.keys.user.id, info.user.id);
    localStorage.setItem(Consts.keys.user.role, info.user.role);
    localStorage.setItem(Consts.keys.user.name, info.user.name);
    localStorage.setItem(Consts.keys.user.email, info.user.email);
    localStorage.setItem(Consts.keys.user.companyId, info.user.companyId);
  },

  removeSessionInfo() {
    // tokens
    localStorage.removeItem(Consts.keys.token.access);
    localStorage.removeItem(Consts.keys.token.refresh);
    // user
    localStorage.removeItem(Consts.keys.user.id);
    localStorage.removeItem(Consts.keys.user.role);
    localStorage.removeItem(Consts.keys.user.name);
    localStorage.removeItem(Consts.keys.user.email);
    localStorage.removeItem(Consts.keys.user.companyId);
  },

  getAccessToken() {
    return localStorage.getItem(Consts.keys.token.access);
  },

  getRefreshToken() {
    return localStorage.getItem(Consts.keys.token.refresh);
  },

  getTokens() {
    return {
      access: this.getAccessToken(),
      refresh: this.getRefreshToken()
    };
  },

  getUserId() {
    return localStorage.getItem(Consts.keys.user.id) || 0;
  },
  
  getUserRole() {
    return localStorage.getItem(Consts.keys.user.role) || 'READER';
  },
  
  getUserName() {
    return localStorage.getItem(Consts.keys.user.name) || '';
  },
  
  getUserEmail() {
    return localStorage.getItem(Consts.keys.user.email) || '';
  },

  getCompanyId() {
    return localStorage.getItem(Consts.keys.user.company_id) || 0;
  },

  getUser() {
    return {
      id: this.getUserId(),
      email: this.getUserEmail(),
      name: this.getUserName(),
      role: this.getUserRole(),
      companyId: this.getCompanyId(),
    };
  }

};
