<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <div class="medical-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 3A2.5 2.5 0 0122 5.5v13A2.5 2.5 0 0119.5 21h-15A2.5 2.5 0 012 18.5v-13A2.5 2.5 0 014.5 3h15zM12 8a1 1 0 00-1 1v2H9a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2h-2V9a1 1 0 00-1-1z"/>
              </svg>
            </div>
            <span>Medical Equipment</span>
          </div>
        </div>
        
        <div class="header-right">
          <span class="user-name">{{ user?.nombre }} {{ user?.apellido }}</span>
          <button @click="logout" class="logout-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z"/>
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="controls-bar">
        <div class="controls-left">
          <button @click="showModal = true" class="create-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4V10H20C21.1 10 22 10.9 22 12S21.1 14 20 14H14V20C14 21.1 13.1 22 12 22S10 21.1 10 20V14H4C2.9 14 2 13.1 2 12S2.9 10 4 10H10V4C10 2.9 10.9 2 12 2Z"/>
            </svg>
            Nuevo Equipo
          </button>
          
          <div class="search-input">
            <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar equipos..."
              v-model="searchTerm"
              @input="updateSearch"
            />
          </div>
        </div>
        
        <div class="controls-right">
          <div class="filter-group">
            <label>Tipo:</label>
            <select v-model="filterType" @change="updateFilter">
              <option value="all">Todos</option>
              <option value="humano">Humano</option>
              <option value="veterinario">Veterinario</option>
            </select>
          </div>
          
          <div class="view-toggle">
            <button
              @click="viewMode = 'grid'"
              :class="{ active: viewMode === 'grid' }"
              class="toggle-button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="{ active: viewMode === 'list' }"
              class="toggle-button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Cargando equipos...</p>
      </div>

      <div v-else-if="filteredEquipos.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C7.6 4 4 7.6 4 12S7.6 20 12 20 20 16.4 20 12 16.4 4 12 4M12 6C15.3 6 18 8.7 18 12S15.3 18 12 18 6 15.3 6 12 8.7 6 12 6M12 8C9.8 8 8 9.8 8 12S9.8 16 12 16 16 14.2 16 12 14.2 8 12 8M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10Z"/>
        </svg>
        <h3>No hay equipos</h3>
        <p>No se encontraron equipos con los filtros aplicados</p>
      </div>

      <div v-else :class="['equipos-container', viewMode]">
        <EquipoCard
          v-for="equipo in filteredEquipos"
          :key="equipo.id"
          :equipo="equipo"
          :view-mode="viewMode"
          @edit="editEquipo"
          @delete="deleteEquipo"
        />
      </div>
    </main>

    <EquipoModal
      v-if="showModal"
      :equipo="selectedEquipo"
      @close="closeModal"
      @save="saveEquipo"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EquipoCard from '../components/EquipoCard.vue'
import EquipoModal from '../components/EquipoModal.vue'

export default {
  name: 'Dashboard',
  components: {
    EquipoCard,
    EquipoModal
  },
  data() {
    return {
      viewMode: 'grid',
      showModal: false,
      selectedEquipo: null,
      searchTerm: '',
      filterType: 'all'
    }
  },
  computed: {
    ...mapGetters('auth', { user: 'user' }),
    ...mapGetters('equipos', ['filteredEquipos', 'isLoading'])
  },
  async mounted() {
    await this.fetchEquipos()
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('equipos', ['fetchEquipos', 'createEquipo', 'updateEquipo', 'deleteEquipo']),
    
    updateSearch() {
      this.$store.commit('equipos/SET_SEARCH_TERM', this.searchTerm)
    },
    
    updateFilter() {
      this.$store.commit('equipos/SET_FILTER_TYPE', this.filterType)
    },
    
    editEquipo(equipo) {
      this.selectedEquipo = { ...equipo }
      this.showModal = true
    },
    
    async deleteEquipo(equipoId) {
      if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
        await this.$store.dispatch('equipos/deleteEquipo', equipoId)
      }
    },
    
    closeModal() {
      this.showModal = false
      this.selectedEquipo = null
    },
    
    async saveEquipo(equipoData) {
      if (this.selectedEquipo) {
        await this.updateEquipo({ id: this.selectedEquipo.id, equipoData })
      } else {
        await this.createEquipo(equipoData)
      }
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.medical-icon {
  width: 40px;
  height: 40px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medical-icon svg {
  width: 20px;
  height: 20px;
}

.logo span {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 500;
  color: #374151;
}

.logout-button {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.logout-button svg {
  width: 16px;
  height: 16px;
}

.dashboard-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.create-button {
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.create-button:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
}

.create-button svg {
  width: 18px;
  height: 18px;
}

.search-input {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.search-input input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.filter-group select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.toggle-button {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.toggle-button:hover {
  background: #e5e7eb;
}

.toggle-button.active {
  background: #2563eb;
  color: white;
}

.toggle-button svg {
  width: 16px;
  height: 16px;
}

.equipos-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.equipos-container.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #2563eb;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .dashboard-main {
    padding: 16px;
  }
  
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .controls-left {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
  
  .equipos-container.grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    padding: 0 8px;
  }
}
</style>