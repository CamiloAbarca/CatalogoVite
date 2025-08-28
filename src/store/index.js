import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import equipos from './modules/equipos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    equipos
  }
})