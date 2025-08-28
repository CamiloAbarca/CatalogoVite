<template>
  <div :class="['equipo-card', viewMode]">
    <div class="card-image">
      <img
        :src="equipoImageUrl"
        :alt="equipo.titulo"
        @error="handleImageError"
      />
      <div class="tipo-badge" :class="equipo.tipo.toLowerCase()">
        {{ equipo.tipo }}
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ equipo.titulo }}</h3>
        <div class="card-actions">
          <button @click="$emit('edit', equipo)" class="action-button edit">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <button @click="$emit('delete', equipo.id)" class="action-button delete">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <p class="card-description">{{ equipo.detalle }}</p>
      
      <div class="card-footer">
        <a v-if="equipo.pdf" :href="equipoPdfUrl" target="_blank" class="pdf-link">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Ver PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipoCard',
  props: {
    equipo: {
      type: Object,
      required: true
    },
    viewMode: {
      type: String,
      default: 'grid'
    }
  },
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    equipoImageUrl() {
      if (this.imageError || !this.equipo.img) {
        return 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
      return `https://mmedical.cl/upload/${this.equipo.img}`
    },
    equipoPdfUrl() {
      return this.equipo.pdf ? `https://mmedical.cl/upload/${this.equipo.pdf}` : null
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true
    }
  }
}
</script>

<style scoped>
.equipo-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.equipo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.equipo-card.grid {
  display: flex;
  flex-direction: column;
}

.equipo-card.list {
  display: flex;
  flex-direction: row;
}

.card-image {
  position: relative;
  overflow: hidden;
}

.equipo-card.grid .card-image {
  height: 200px;
}

.equipo-card.list .card-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.equipo-card:hover .card-image img {
  transform: scale(1.05);
}

.tipo-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.tipo-badge.humano {
  background: #2563eb;
}

.tipo-badge.veterinario {
  background: #059669;
}

.card-content {
  padding: 16px;
  flex: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.action-button.edit {
  background: #fef3c7;
  color: #d97706;
}

.action-button.edit:hover {
  background: #fcd34d;
}

.action-button.delete {
  background: #fecaca;
  color: #dc2626;
}

.action-button.delete:hover {
  background: #f87171;
}

.card-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pdf-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.pdf-link:hover {
  color: #b91c1c;
}

.pdf-link svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .equipo-card.list {
    flex-direction: column;
  }
  
  .equipo-card.list .card-image {
    width: 100%;
    height: 160px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .card-actions {
    align-self: flex-end;
  }
}
</style>