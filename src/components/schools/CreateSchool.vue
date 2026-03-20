<template>
  <div class="form-page">
    <div class="page-header">
      <h1 class="page-title">Crear escuela</h1>
      <p class="page-subtitle">Completá los datos de la nueva escuela</p>
    </div>

    <v-card class="form-card">
      <v-form ref="form">
        <v-container class="form-container">
          <!-- Nombre -->
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="school.name"
                label="Nombre de la escuela"
                prepend-inner-icon="mdi-school-outline"
                :rules="[v => !!v || 'El nombre es obligatorio']"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Descripción -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="school.description"
                label="Descripción"
                prepend-inner-icon="mdi-text-box-outline"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <!-- Action Buttons -->
        <div class="form-actions">
          <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left">
            Volver
          </v-btn>
          <v-btn color="primary" @click="saveSchool" prepend-icon="mdi-content-save-outline" :loading="saving">
            Guardar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { createSchool } from "@/services/schools";
import { useSchoolStore } from "@/store/school";
import { useRouter } from "vue-router";

export default {
  name: "CreateSchool",
  setup() {
    const router = useRouter();
    const store = useSchoolStore();
    const saving = ref(false);

    const school = ref({
      name: "",
      description: "",
    });

    const saveSchool = async () => {
      if (!school.value.name) return;
      try {
        saving.value = true;
        const response = await createSchool(school.value);
        store.addNewSchool(response);
        router.push("/schools");
      } catch (err) {
        console.error("Error creating school:", err);
      } finally {
        saving.value = false;
      }
    };

    const goBack = () => {
      window.history.back();
    };

    return {
      school,
      saving,
      saveSchool,
      goBack,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-page {
  max-width: 900px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1A1918;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #6B6560;
  margin: 0;
}

.form-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.form-container {
  padding: 24px 28px 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 28px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.form-actions .v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
