<template>
  <div class="module-detail-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ moduleData?.name || 'Módulo' }}</h1>
        <p class="page-subtitle">{{ moduleData?.description || '' }}</p>
      </div>
      <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left" class="back-btn">
        Volver
      </v-btn>
    </div>

    <v-progress-linear v-if="loadingDetail" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <!-- Module info -->
    <v-row class="mb-6" v-if="moduleDetail">
      <!-- Professors -->
      <v-col cols="12" md="6">
        <v-card class="info-card">
          <div class="info-card-header">
            <v-icon color="primary" size="small" class="mr-2">mdi-account-tie</v-icon>
            <h3 class="info-card-title">Profesores</h3>
          </div>
          <div class="info-card-content">
            <template v-if="moduleDetail.professors && moduleDetail.professors.length">
              <v-chip
                v-for="prof in moduleDetail.professors"
                :key="prof._id || prof"
                size="small"
                color="primary"
                variant="tonal"
                class="mr-2 mb-2"
              >
                {{ prof.name ? `${prof.name} ${prof.lastName || ''}`.trim() : prof }}
              </v-chip>
            </template>
            <span v-else class="text-medium-emphasis">Sin profesores asignados</span>
          </div>
        </v-card>
      </v-col>

      <!-- Materials -->
      <v-col cols="12" md="6">
        <v-card class="info-card">
          <div class="info-card-header">
            <v-icon color="primary" size="small" class="mr-2">mdi-book-open-variant</v-icon>
            <h3 class="info-card-title">Material de lectura</h3>
          </div>
          <div class="info-card-content">
            <template v-if="moduleDetail.materialLinks && moduleDetail.materialLinks.length">
              <div v-for="(link, index) in moduleDetail.materialLinks" :key="index" class="material-link-item">
                <v-icon size="small" color="primary" class="mr-2">mdi-link</v-icon>
                <a :href="link" target="_blank" class="file-link">{{ formatLink(link) }}</a>
              </div>
            </template>
            <span v-else class="text-medium-emphasis">No hay material disponible</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Submit section -->
    <div class="section-header">
      <h2 class="section-title">Subir entrega</h2>
    </div>
    <v-card class="submit-card mb-6">
      <v-form ref="submitForm" v-model="isSubmitFormValid" class="submit-form">
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="submitData.fileName"
              label="Nombre del archivo"
              prepend-inner-icon="mdi-file-document-outline"
              :rules="[v => !!v || 'Obligatorio']"
              hide-details="auto"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="submitData.fileUrl"
              label="URL del archivo (Google Drive, etc.)"
              prepend-inner-icon="mdi-link"
              :rules="[v => !!v || 'Obligatorio']"
              hide-details="auto"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              block
              prepend-icon="mdi-upload"
              :loading="submitting"
              :disabled="!isSubmitFormValid"
              @click="submitWork"
              class="submit-btn"
            >
              Enviar entrega
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- My submissions for this module -->
    <div class="section-header">
      <h2 class="section-title">Mis entregas</h2>
    </div>
    <v-card class="submissions-card">
      <v-data-table
        :items="moduleSubmissions"
        :loading="loadingSubmissions"
        :headers="submissionHeaders"
        items-per-page="25"
        class="submissions-table"
        hover
      >
        <template #item.fileName="{ item }">
          <a v-if="item.fileUrl" :href="item.fileUrl" target="_blank" class="file-link">
            {{ item.fileName || 'Ver archivo' }}
          </a>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="submissionStatusColor(item.status)" size="small" variant="tonal">
            {{ submissionStatusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.feedback="{ item }">
          <span v-if="item.feedback">{{ item.feedback }}</span>
          <span v-else class="text-medium-emphasis">Sin feedback aún</span>
        </template>
        <template #item.reviewedBy="{ item }">
          <span v-if="item.reviewedBy">
            {{ item.reviewedBy.name ? `${item.reviewedBy.name} ${item.reviewedBy.lastName || ''}`.trim() : item.reviewedBy }}
          </span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-AR') : '—' }}
        </template>
      </v-data-table>
    </v-card>

    <!-- Companions -->
    <div class="section-header mt-6">
      <h2 class="section-title">Compañeros del módulo</h2>
    </div>
    <v-card class="companions-card">
      <v-progress-linear v-if="loadingCompanions" indeterminate color="primary"></v-progress-linear>
      <div v-else-if="companions.length" class="companions-grid">
        <div v-for="companion in companions" :key="companion._id" class="companion-item">
          <v-avatar size="36" color="#D97706" class="companion-avatar">
            <span class="text-white text-body-2 font-weight-bold">
              {{ companion.name ? companion.name.charAt(0).toUpperCase() : '?' }}
            </span>
          </v-avatar>
          <div class="companion-info">
            <span class="companion-name">{{ companion.name }} {{ companion.lastName || '' }}</span>
          </div>
        </div>
      </div>
      <div v-else class="companions-empty">
        <span class="text-medium-emphasis">No hay compañeros en este módulo</span>
      </div>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useEnrollmentStore } from "@/store/enrollment";
import { getAcademicModule, getModuleMembers } from "@/services/academicModules";
import { createSubmission, getMySubmissions } from "@/services/submissions";

export default {
  name: "StudentModuleDetail",
  setup() {
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();
    const moduleData = enrollmentStore.getSelectedModule;
    const moduleId = moduleData?._id || moduleData;

    const moduleDetail = ref(null);
    const loadingDetail = ref(false);
    const moduleSubmissions = ref([]);
    const loadingSubmissions = ref(false);

    // Submit form
    const submitData = ref({ fileName: "", fileUrl: "" });
    const isSubmitFormValid = ref(false);
    const submitting = ref(false);
    const submitForm = ref(null);

    const companions = ref([]);
    const loadingCompanions = ref(false);
    const snackbar = reactive({ show: false, text: "", color: "" });

    const submissionHeaders = [
      { title: "Archivo", key: "fileName", sortable: false },
      { title: "Fecha", key: "createdAt", sortable: true },
      { title: "Estado", key: "status", sortable: true },
      { title: "Feedback", key: "feedback", sortable: false },
      { title: "Revisado por", key: "reviewedBy", sortable: false },
    ];

    const fetchModuleDetail = async () => {
      if (!moduleId) return;
      try {
        loadingDetail.value = true;
        moduleDetail.value = await getAcademicModule(moduleId);
      } catch (error) {
        console.error("Error fetching module detail:", error);
      } finally {
        loadingDetail.value = false;
      }
    };

    const fetchMySubmissions = async () => {
      try {
        loadingSubmissions.value = true;
        const all = await getMySubmissions();
        moduleSubmissions.value = all.filter(s => {
          const subModuleId = s.academicModule?._id || s.academicModule;
          return String(subModuleId) === String(moduleId);
        });
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        loadingSubmissions.value = false;
      }
    };

    const fetchCompanions = async () => {
      if (!moduleId) return;
      try {
        loadingCompanions.value = true;
        companions.value = await getModuleMembers(moduleId);
      } catch (error) {
        console.error("Error fetching companions:", error);
      } finally {
        loadingCompanions.value = false;
      }
    };

    onMounted(() => {
      fetchModuleDetail();
      fetchMySubmissions();
      fetchCompanions();
    });

    const formatLink = (link) => {
      try {
        const url = new URL(link);
        return url.hostname + url.pathname.substring(0, 30) + (url.pathname.length > 30 ? '...' : '');
      } catch {
        return link.length > 50 ? link.substring(0, 50) + '...' : link;
      }
    };

    const submissionStatusColor = (status) => {
      const map = { pending_review: "warning", approved: "success", rejected: "error" };
      return map[status] || "secondary";
    };
    const submissionStatusLabel = (status) => {
      const map = { pending_review: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
      return map[status] || status;
    };

    const submitWork = async () => {
      if (!isSubmitFormValid.value) return;
      try {
        submitting.value = true;
        await createSubmission({
          academicModule: moduleId,
          fileUrl: submitData.value.fileUrl,
          fileName: submitData.value.fileName,
        });
        submitData.value = { fileName: "", fileUrl: "" };
        if (submitForm.value) submitForm.value.resetValidation();
        snackbar.text = "Entrega enviada correctamente";
        snackbar.color = "success";
        snackbar.show = true;
        fetchMySubmissions();
      } catch (err) {
        console.error("Error submitting:", err);
        snackbar.text = "Error al enviar la entrega";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        submitting.value = false;
      }
    };

    const goBack = () => {
      enrollmentStore.setSelectedModule(null);
      router.push("/schools/modules");
    };

    return {
      moduleData, moduleDetail, loadingDetail,
      moduleSubmissions, loadingSubmissions, submissionHeaders,
      submitData, isSubmitFormValid, submitting, submitForm, submitWork,
      formatLink, submissionStatusColor, submissionStatusLabel,
      companions, loadingCompanions,
      goBack, snackbar,
    };
  },
};
</script>

<style lang="scss" scoped>
.module-detail-page {
  max-width: 1100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1A1918;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #6B6560;
  margin: 0;
}

.back-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.info-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  height: 100%;
}

.info-card-header {
  display: flex;
  align-items: center;
  padding: 16px 20px 8px;
}

.info-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B6560;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-card-content {
  padding: 8px 20px 20px;
}

.material-link-item {
  display: flex;
  align-items: center;
  padding: 6px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }
}

.file-link {
  color: #D97706;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A1918;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.submit-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.submit-form {
  padding: 20px 24px;
}

.submit-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.submissions-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.submissions-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.companions-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.companions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  padding: 20px;
}

.companion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #F5F3EF;
}

.companion-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1A1918;
}

.companions-empty {
  padding: 24px 20px;
  text-align: center;
}
</style>
