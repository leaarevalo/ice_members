<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600">
    <v-card rounded="xl">
      <v-card-title class="dialog-title">
        {{ isEditing ? 'Editar módulo' : 'Nuevo módulo' }}
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="formData.name"
            label="Nombre del módulo"
            :rules="[v => !!v || 'El nombre es obligatorio']"
            required
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Descripción"
            rows="2"
          ></v-textarea>

          <v-text-field
            v-model.number="formData.order"
            label="Orden"
            type="number"
            min="1"
          ></v-text-field>

          <v-autocomplete
            v-model="formData.professors"
            :items="members"
            :item-title="getMemberLabel"
            item-value="document"
            return-object
            label="Profesores"
            multiple
            chips
            closable-chips
          ></v-autocomplete>

          <div class="mb-2 mt-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-2 font-weight-medium">Enlaces de material (Google Drive)</span>
              <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="addLink" class="action-btn">
                Agregar enlace
              </v-btn>
            </div>
            <div v-for="(link, index) in formData.materialLinks" :key="index" class="d-flex align-center gap-2 mb-2">
              <v-text-field
                v-model="formData.materialLinks[index]"
                :label="`Enlace ${index + 1}`"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-link"
              ></v-text-field>
              <v-btn icon="mdi-close" size="small" variant="text" color="error" @click="removeLink(index)"></v-btn>
            </div>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <v-btn variant="outlined" color="secondary" @click="close">Cancelar</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!isFormValid" @click="save">
          {{ isEditing ? 'Guardar cambios' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import { createAcademicModule, updateAcademicModule } from "@/services/academicModules";

export default {
  name: "AcademicModuleDialog",
  props: {
    modelValue: Boolean,
    moduleData: Object,
    schoolId: String,
    members: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue", "saved"],
  setup(props, { emit }) {
    const isFormValid = ref(false);
    const saving = ref(false);
    const form = ref(null);

    const formData = ref({
      name: "",
      description: "",
      order: 1,
      professors: [],
      materialLinks: [],
    });

    const isEditing = computed(() => !!props.moduleData);

    watch(() => props.modelValue, (open) => {
      if (open) {
        if (props.moduleData) {
          formData.value = {
            ...props.moduleData,
            professors: (props.moduleData.professors || []).map(p => {
              if (typeof p === "object" && p !== null) return p;
              return props.members.find(m => String(m._id) === String(p) || String(m.document) === String(p)) || p;
            }),
            materialLinks: [...(props.moduleData.materialLinks || [])],
          };
        } else {
          formData.value = { name: "", description: "", order: 1, professors: [], materialLinks: [] };
        }
      }
    });

    const getMemberLabel = (member) => {
      if (typeof member === "string") return member;
      return `${member.name || ""} ${member.lastName || ""}`.trim();
    };

    const addLink = () => {
      formData.value.materialLinks.push("");
    };

    const removeLink = (index) => {
      formData.value.materialLinks.splice(index, 1);
    };

    const close = () => {
      emit("update:modelValue", false);
    };

    const save = async () => {
      if (!isFormValid.value) return;
      try {
        saving.value = true;
        const payload = {
          ...formData.value,
          school: props.schoolId,
          professors: (formData.value.professors || []).map(p =>
            typeof p === "object" && p !== null ? String(p.document || p._id) : String(p)
          ),
          materialLinks: formData.value.materialLinks.filter(l => l && l.trim()),
        };

        if (isEditing.value) {
          await updateAcademicModule(payload);
        } else {
          await createAcademicModule(payload);
        }

        emit("saved");
        close();
      } catch (err) {
        console.error("Error saving module:", err);
      } finally {
        saving.value = false;
      }
    };

    return {
      formData, isFormValid, saving, form, isEditing,
      getMemberLabel, addLink, removeLink, close, save,
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  padding: 20px 24px !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dialog-actions {
  padding: 16px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  justify-content: flex-end;
  gap: 8px;
}

.dialog-actions .v-btn,
.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
