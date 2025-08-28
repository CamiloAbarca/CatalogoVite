import axios from 'axios'

const state = {
  equipos: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  filterType: 'all'
}

const mutations = {
  SET_EQUIPOS(state, equipos) {
    state.equipos = equipos
  },
  ADD_EQUIPO(state, equipo) {
    state.equipos.push(equipo)
  },
  UPDATE_EQUIPO(state, updatedEquipo) {
    const index = state.equipos.findIndex(e => e.id === updatedEquipo.id)
    if (index !== -1) {
      state.equipos.splice(index, 1, updatedEquipo)
    }
  },
  REMOVE_EQUIPO(state, equipoId) {
    state.equipos = state.equipos.filter(e => e.id !== equipoId)
  },
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term
  },
  SET_FILTER_TYPE(state, type) {
    state.filterType = type
  }
}

const actions = {
  async fetchEquipos({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('https://mmedical.cl/apiCatalogo/equipos')
      commit('SET_EQUIPOS', response.data)
    } catch (error) {
      commit('SET_ERROR', 'Error al cargar equipos')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createEquipo({ commit }, equipoData) {
    try {
      const formData = new FormData()
      Object.keys(equipoData).forEach(key => {
        formData.append(key, equipoData[key])
      })
      
      const response = await axios.post('https://mmedical.cl/apiCatalogo/equipos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      commit('ADD_EQUIPO', response.data)
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', 'Error al crear equipo')
      return { success: false, error: error.message }
    }
  },
  
  async updateEquipo({ commit }, { id, equipoData }) {
    try {
      const formData = new FormData()
      Object.keys(equipoData).forEach(key => {
        formData.append(key, equipoData[key])
      })
      
      const response = await axios.put(`https://mmedical.cl/apiCatalogo/equipos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      commit('UPDATE_EQUIPO', response.data)
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', 'Error al actualizar equipo')
      return { success: false, error: error.message }
    }
  },
  
  async deleteEquipo({ commit }, equipoId) {
    try {
      await axios.delete(`https://mmedical.cl/apiCatalogo/equipos`, {
        data: { id: equipoId }
      })
      commit('REMOVE_EQUIPO', equipoId)
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', 'Error al eliminar equipo')
      return { success: false, error: error.message }
    }
  }
}

const getters = {
  equipos: state => state.equipos,
  filteredEquipos: state => {
    let filtered = state.equipos
    
    if (state.filterType !== 'all') {
      filtered = filtered.filter(equipo => equipo.tipo.toLowerCase() === state.filterType)
    }
    
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase()
      filtered = filtered.filter(equipo => 
        equipo.titulo.toLowerCase().includes(term) ||
        equipo.detalle.toLowerCase().includes(term)
      )
    }
    
    return filtered
  },
  isLoading: state => state.isLoading,
  error: state => state.error,
  searchTerm: state => state.searchTerm,
  filterType: state => state.filterType
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}