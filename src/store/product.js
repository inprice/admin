import ApiService from '../service/api-service';
import Utility from '@/helpers/utility';

const baseURL = '/product';

const formExample = {
  code: '',
  name: '',
  brand: '',
  category: '',
  price: 0,
  money: {
    decimal: '.',
    thousands: ','
  }
};

const state = {
  search: {
    form: {
      term: '',
      orderBy: 'name',
      orderDir: 'asc',
      lastRowNo: 0,
    },
    result: {
      rows: [],
      totalRowCount: 0,
      totalPageCount: 0
    }
  },
  editForm: null,
  editFormStatus: false
};

const actions = {
  edit({ commit }, item) {
    commit('setEditForm', item);
    commit('changeEditFormStatus', true);
  },

  async save({ commit, dispatch, state }) {
    try {
      let apiRes;
      if (state.editForm.id == null) {
        apiRes = await ApiService.post(baseURL, state.editForm);
      } else {
        apiRes = await ApiService.put(baseURL, state.editForm);
      }

      if (apiRes.data.status === 0) {
        commit('changeEditFormStatus', false);
        dispatch('search');
      } else {
        Utility.showErrorMessage('Add', 'api', apiRes.data);
      }
    } catch (error) {
      Utility.showErrorMessage('Add', 'network', error.message);
    }
  },

  async delete({ dispatch }, id) {
    try {
      let apiRes = await ApiService.delete(baseURL + '/' + id);

      if (apiRes.data.status === 0) {
        dispatch('search');
      } else {
        Utility.showErrorMessage('Delete', 'api', apiRes.data);
      }
    } catch (error) {
      Utility.showErrorMessage('Delete', 'network', error.message);
    }
  },

  async search({ commit, state }) {
    try {
      let result = [];
      const apiRes = await ApiService.get(baseURL + 's/search', state.search.form);

      if (!apiRes.data.reason) result = apiRes.data.data;
      commit('setProducts', result);
    } catch (error) {
      Utility.showErrorMessage('Search', 'network', error.message);
    }
  },

  changeSearchTerm({ commit, dispatch }, term) {
    commit('setSearchTerm', term);
    dispatch('search');
  },

  changePageNo({ commit, dispatch }, pageNo) {
    commit('setPageNo', pageNo);
    dispatch('search');
  },

  changePageLimit({ commit, dispatch }, pageLimit) {
    commit('setPageLimit', pageLimit);
    dispatch('search');
  },

  sortColumn({ commit, dispatch }, colName) {
    commit('setOrderBy', colName);
    dispatch('search');
  }
};

const mutations = {
  setEditForm: (state, item) => {
    if (!item) item = JSON.parse(JSON.stringify(formExample)); //cloning!
    state.editForm = item;
  },
  changeEditFormStatus: (state, status) => {
    state.editFormStatus = status;
  },
  setSearchTerm: (state, term) => {
    state.search.form.term = term;
    state.search.form.pageNo = 1;
  },
  setPageNo: (state, pageNo) => {
    state.search.form.pageNo = pageNo;
  },
  setPageLimit: (state, pageLimit) => {
    state.search.form.pageNo = 1;
    state.search.form.pageLimit = pageLimit;
  },
  setOrderBy: (state, colName) => {
    state.search.form.pageNo = 1;
    state.search.form.orderBy = colName;
    state.search.form.orderDir =
      state.search.form.orderBy == colName && state.search.form.orderDir == 'asc' ? 'desc' : 'asc';
  },
  setProducts: (state, data) => {
    state.search.result.rows = data.rows;
    state.search.result.totalRowCount = data.totalRowCount;
    state.search.result.totalPageCount = data.totalPageCount;
  }
};

const getters = {
  getEditForm() {
    return state.editForm;
  },
  getEditFormStatus() {
    return state.editFormStatus;
  },
  getSearchTerm() {
    return state.search.form.term;
  },
  getPageNo() {
    return state.search.form.pageNo;
  },
  getPageLimit() {
    return state.search.form.pageLimit;
  },
  getOrderBy() {
    return state.search.form.orderBy;
  },
  getOrderDir() {
    return state.search.form.orderDir;
  },

  getRows() {
    return state.search.result.rows;
  },
  getTotalRowCount() {
    return state.search.result.totalRowCount;
  },
  getTotalPageCount() {
    return state.search.result.totalPageCount;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
