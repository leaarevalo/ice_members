<template>
  <div class="form-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Registrar miembro</h1>
        <p class="page-subtitle">Completá los datos del nuevo miembro</p>
      </div>
    </div>

    <v-card class="form-card">
      <v-form ref="form">
        <v-container class="form-container">
          <!-- Documento -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.document"
                label="Documento (DNI/CI)"
                :rules="[v => !!v || 'El documento es obligatorio']"
                prepend-inner-icon="mdi-card-account-details-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Nombre y Apellido -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.name"
                label="Nombre"
                :rules="[v => !!v || 'El nombre es obligatorio']"
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.lastName"
                label="Apellido"
                :rules="[v => !!v || 'El apellido es obligatorio']"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Teléfono y Email -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.phone"
                label="Teléfono"
                prepend-inner-icon="mdi-phone-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.email"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Estado civil y Casamiento -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.civilState"
                label="Estado civil"
                prepend-inner-icon="mdi-heart-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.marriageDate"
                label="Fecha de casamiento"
                type="date"
                prepend-inner-icon="mdi-ring"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Célula y Grupo -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.belongToCelula"
                label="Célula a la que pertenece"
                prepend-inner-icon="mdi-account-multiple-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.belongToGroup"
                label="Grupo al que pertenece"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Dirección -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.address"
                label="Dirección"
                prepend-inner-icon="mdi-map-marker-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Fechas -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.dateOfBirth"
                label="Fecha de nacimiento"
                type="date"
                prepend-inner-icon="mdi-cake-variant-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.dateOfConversion"
                label="Fecha de conversión"
                type="date"
                prepend-inner-icon="mdi-cross"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Estudios y Ocupación -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.studyStatus"
                label="Nivel de estudios"
                prepend-inner-icon="mdi-school-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="member.ocupation"
                label="Ocupación"
                prepend-inner-icon="mdi-briefcase-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Obra social y Cantidad de hijos -->
          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="member.hasSocialWork"
                label="Tiene obra social"
                color="primary"
                hide-details
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="member.numberOfChilds"
                label="Cantidad de hijos"
                type="number"
                min="0"
                prepend-inner-icon="mdi-human-male-child"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Tutor y Rol -->
          <v-row>
            <v-col cols="12" :md="isManager ? 6 : 12">
              <v-text-field
                v-model="member.tutorInfo"
                label="Información del tutor"
                prepend-inner-icon="mdi-account-supervisor-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="isManager">
              <v-select
                v-model="member.role"
                :items="roleOptions"
                item-title="label"
                item-value="value"
                label="Rol"
                prepend-inner-icon="mdi-shield-account-outline"
              ></v-select>
            </v-col>
          </v-row>

        </v-container>

        <!-- Action Buttons -->
        <div class="form-actions">
          <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left">
            Volver
          </v-btn>
          <v-btn color="primary" @click="createMember" prepend-icon="mdi-content-save-outline">
            Guardar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { createNewMember } from "@/services/members";
import { useMemberStore } from "@/store/member";
import { useRouter } from "vue-router";
export default {
  name: "CreateMember",
  setup() {
    const router = useRouter();
    const store = useMemberStore();
    const isManager = computed(() => store.isManager);
    const form = ref(null);
    const roleOptions = [
      { label: "Usuario", value: "user" },
      { label: "Líder", value: "lider" },
      { label: "Manager", value: "manager" },
      { label: "Consejero", value: "counselor" },
    ];

    const member = ref({
      document: "",
      name: "",
      lastName: "",
      password: "",
      email: "",
      dateOfBirth: "",
      dateOfConversion: "",
      phone: "",
      address: "",
      role: "user",
      civilState: "",
      marriageDate: "",
      belongToCelula: "",
      belongToGroup: "",
      studyStatus: "",
      ocupation: "",
      hasSocialWork: false,
      numberOfChilds: null,
      tutorInfo: "",
    });

    const createMember = async () => {
      const { valid } = await form.value.validate();
      if (!valid) return;
      try {
        const newMember = { ...member.value };
        newMember.password = newMember.document; // Set password to document value
        const response = await createNewMember(newMember);
        store.addNewMember(response);
        router.push("/members");
      } catch (err) {
        console.log("error", err);
      }
    };
    const goBack = () => {
      window.history.back();
    };
    return {
      member,
      createMember,
      goBack,
      isManager,
      roleOptions,
      form,
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
