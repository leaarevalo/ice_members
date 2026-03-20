<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500">
    <v-card rounded="xl">
      <v-card-title class="dialog-title">
        Inscribir alumno
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="isFormValid">
          <v-autocomplete
            v-model="selectedStudent"
            :items="members"
            :item-title="getMemberLabel"
            item-value="document"
            label="Seleccionar alumno"
            :rules="[v => !!v || 'Debe seleccionar un alumno']"
            prepend-inner-icon="mdi-account-search-outline"
            required
          ></v-autocomplete>

          <v-autocomplete
            v-model="selectedModules"
            :items="modules"
            item-title="name"
            item-value="_id"
            label="Seleccionar módulo(s)"
            :rules="[v => (v && v.length > 0) || 'Debe seleccionar al menos un módulo']"
            prepend-inner-icon="mdi-book-outline"
            multiple
            chips
            closable-chips
            required
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <v-btn variant="outlined" color="secondary" @click="close">Cancelar</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!isFormValid" @click="save">
          Inscribir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { createEnrollment } from "@/services/enrollments";

export default {
  name: "EnrollmentDialog",
  props: {
    modelValue: Boolean,
    schoolId: String,
    members: { type: Array, default: () => [] },
    modules: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue", "saved"],
  setup(props, { emit }) {
    const isFormValid = ref(false);
    const saving = ref(false);
    const selectedStudent = ref(null);
    const selectedModules = ref([]);

    watch(() => props.modelValue, (open) => {
      if (open) {
        selectedStudent.value = null;
        selectedModules.value = [];
      }
    });

    const getMemberLabel = (member) => {
      if (typeof member === "string") return member;
      return `${member.name || ""} ${member.lastName || ""} (${member.document || ""})`.trim();
    };

    const close = () => {
      emit("update:modelValue", false);
    };

    const save = async () => {
      if (!isFormValid.value) return;
      try {
        saving.value = true;
        await createEnrollment({
          studentDocument: selectedStudent.value,
          school: props.schoolId,
          academicModules: selectedModules.value,
        });
        emit("saved");
        close();
      } catch (err) {
        console.error("Error creating enrollment:", err);
      } finally {
        saving.value = false;
      }
    };

    return {
      isFormValid, saving, selectedStudent, selectedModules,
      getMemberLabel, close, save,
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

.dialog-actions .v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
