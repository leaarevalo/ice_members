<template>
  <div class="form-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Detalle del miembro</h1>
        <p class="page-subtitle">Visualizá y editá la información del miembro</p>
      </div>
    </div>

    <v-card class="form-card">
      <v-form ref="form">
        <v-container class="form-container">
          <!-- Documento -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.document"
                label="Documento (DNI/CI)"
                required
                prepend-inner-icon="mdi-card-account-details-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Nombre y Apellido -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.name"
                label="Nombre"
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.lastName"
                label="Apellido"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Teléfono y Email -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.phone"
                label="Teléfono"
                prepend-inner-icon="mdi-phone-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.email"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Estado civil y Matrimonio -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.civilState"
                label="Estado civil"
                prepend-inner-icon="mdi-heart-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.marriageDate"
                label="Fecha de matrimonio"
                type="date"
                prepend-inner-icon="mdi-ring"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Célula y Grupo -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.belongToCelula"
                label="Célula a la que pertenece"
                prepend-inner-icon="mdi-account-multiple-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.belongToGroup"
                label="Grupo al que pertenece"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Fecha de nacimiento y Conversión -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.dateOfBirth"
                label="Fecha de nacimiento"
                type="date"
                prepend-inner-icon="mdi-cake-variant-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="memberDetail.dateOfConversion"
                label="Fecha de conversión"
                type="date"
                prepend-inner-icon="mdi-cross"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Dirección -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="memberDetail.address"
                label="Dirección"
                prepend-inner-icon="mdi-map-marker-outline"
              ></v-text-field>
            </v-col>
          </v-row>

        </v-container>

        <!-- Action Buttons -->
        <div class="form-actions">
          <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left">
            Volver
          </v-btn>
          <v-btn color="primary" @click="saveMemberInformation" prepend-icon="mdi-content-save-outline">
            Guardar cambios
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { updateMember } from "@/services/members";
import { useMemberStore } from "@/store/member";
import { useRouter } from "vue-router";
export default {
  name: "MemberDetail",
  props: {
    member: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const router = useRouter();
    const store = useMemberStore();
    const memberDetail = ref(store.getSelectedMember);

    // Initialize user from store first
    store.initializeUser();
    const isManager = computed(() => store.isManager);

    const saveMemberInformation = async () => {
      await updateMember(memberDetail.value);
      store.updateMember(memberDetail.value);
      router.push("/members");
    };
    const goBack = () => {
      store.setSelectedMember(null);
      window.history.back();
    };
    return {
      memberDetail,
      isManager,
      saveMemberInformation,
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
