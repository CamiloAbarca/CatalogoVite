<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ equipo ? 'Editar Equipo' : 'Nuevo Equipo' }}</h2>
        <button @click="$emit('close')" class="close-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              v-model="form.titulo"
              required
              placeholder="Nombre del equipo"
            />
          </div>

          <div class="form-group">
            <label for="tipo">Tipo *</label>
            <select id="tipo" v-model="form.tipo" required>
              <option value="">Seleccionar tipo</option>
              <option value="humano">Humano</option>
              <option value="veterinario">Veterinario</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="detalle">Descripción *</label>
          <textarea
            id="detalle"
            v-model="form.detalle"
            rows="4"
            required
            placeholder="Descripción detallada del equipo"
          ></textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="imagen">Imagen</label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="imagen"
                @change="handleImageChange"
                accept="image/*"
                ref="imageInput"
              />
              <div class="file-input-content">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span>{{ imageFileName || 'Seleccionar imagen' }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="pdf">Archivo PDF</label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="pdf"
                @change="handlePdfChange"
                accept=".pdf"
                ref="pdfInput"
              />
              <div class="file-input-content">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span>{{ pdfFileName || 'Seleccionar PDF' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Vista previa" />
        </div>

        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="cancel-button">
            Cancelar
          </button>
          <button type="submit" class="save-button" :disabled="!isFormValid">
            {{ equipo ? 'Actualizar' : 'Crear' }} Equipo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipoModal',
  props: {
    equipo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        titulo: '',
        detalle: '',
        tipo: '',
        imagen: null,
        pdf: null
      },
      imageFileName: '',
      pdfFileName: '',
      imagePreview: null
    }
  },
  computed: {
    isFormValid() {
      return this.form.titulo.trim() && 
             this.form.detalle.trim() && 
             this.form.tipo
    }
  },
  mounted() {
    if (this.equipo) {
      this.form.titulo = this.equipo.titulo || ''
      this.form.detalle = this.equipo.detalle || ''
      this.form.tipo = this.equipo.tipo || ''
      
      if (this.equipo.img) {
        this.imageFileName = this.equipo.img
        this.imagePreview = `https://mmedical.cl/upload/${this.equipo.img}`
      }
      if (this.equipo.pdf) {
        this.pdfFileName = this.equipo.pdf
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.imagen = file
        this.imageFileName = file.name
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    handlePdfChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.pdf = file
        this.pdfFileName = file.name
      }
    },
    
    handleSubmit() {
      if (this.isFormValid) {
        const formData = {
          titulo: this.form.titulo,
          detalle: this.form.detalle,
          tipo: this.form.tipo
        }
        
        if (this.form.imagen) {
          formData.img = this.form.imagen
        }
        if (this.form.pdf) {
          formData.pdf = this.form.pdf
        }
        
        this.$emit('save', formData)
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #e5e7eb;
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.modal-form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

input, select, textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.file-input-wrapper {
  position: relative;
}

.file-input-wrapper input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-input-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.file-input-wrapper:hover .file-input-content {
  border-color: #2563eb;
  color: #2563eb;
}

.file-input-content svg {
  width: 20px;
  height: 20px;
}

.image-preview {
  margin-top: 16px;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button {
  padding: 12px 24px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: #f3f4f6;
}

.save-button {
  padding: 12px 24px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 8px;
    max-height: calc(100vh - 16px);
  }
  
  .modal-header {
    padding: 16px 16px 0;
  }
  
  .modal-form {
    padding: 0 16px 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>