import axios from 'axios'

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.post('https://mmedical.cl/apiCatalogo/usuarios/login', credentials)
      
      if (response.data.success) {
        const { user, token } = response.data
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Error de autenticación')
      }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message || 'Error de conexión')
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  logout({ commit }) {
    commit('SET_USER', null)
    commit('SET_TOKEN', null)
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  isLoading: state => state.isLoading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}