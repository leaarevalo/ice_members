<template>
  <div class="professor-module-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ moduleData?.name || 'Módulo' }}</h1>
        <p class="page-subtitle">
          <v-chip size="small" color="primary" variant="tonal" v-if="moduleData?.school?.name">
            {{ moduleData.school.name }}
          </v-chip>
        </p>
      </div>
      <div class="header-actions">
        <v-btn variant="outlined" color="secondary" @click="goToEnrollments" prepend-icon="mdi-account-group" class="action-btn mr-2">
          Alumnos
        </v-btn>
        <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left" class="action-btn">
          Volver
        </v-btn>
      </div>
    </div>

    <!-- Edit module info -->
    <v-card class="section-card mb-6">
      <div class="section-card-header">
        <h3 class="section-card-title">Información del módulo</h3>
        <v-btn size="small" color="primary" prepend-icon="mdi-content-save-outline" @click="saveModule" :loading="savingModule" class="action-btn">
          Guardar cambios
        </v-btn>
      </div>
      <v-form class="section-card-content">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="editData.description"
              label="Descripción"
              prepend-inner-icon="mdi-text-box-outline"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="editData.order"
              label="Orden"
              type="number"
              min="1"
              prepend-inner-icon="mdi-sort-numeric-ascending"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-body-2 font-weight-medium">Enlaces de material</span>
          <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="addLink" class="action-btn">
            Agregar
          </v-btn>
        </div>
        <div v-for="(link, index) in editData.materialLinks" :key="index" class="d-flex align-center gap-2 mb-2">
          <v-text-field
            v-model="editData.materialLinks[index]"
            :label="`Enlace ${index + 1}`"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-link"
          ></v-text-field>
          <v-btn icon="mdi-close" size="small" variant="text" color="error" @click="removeLink(index)"></v-btn>
        </div>
      </v-form>
    </v-card>

    <!-- Submissions -->
    <div class="section-header">
      <h2 class="section-title">Entregas de alumnos</h2>
    </div>
    <v-card class="section-card mb-6">
      <v-data-table
        :items="submissions"
        :loading="loadingSubmissions"
        :headers="submissionHeaders"
        items-per-page="25"
        class="data-table"
        hover
      >
        <template #item.student="{ item }">
          {{ item.student?.name ? `${item.student.name} ${item.student.lastName || ''}`.trim() : item.student }}
        </template>
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
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-AR') : '—' }}
        </template>
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" color="primary" icon="mdi-pencil" @click="openReviewDialog(item)">
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Corregir</v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Review dialog -->
    <v-dialog v-model="reviewDialog" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">
          Corregir entrega
        </v-card-title>
        <v-card-text class="pt-4" v-if="reviewingSubmission">
          <div class="review-info mb-4">
            <p><strong>Alumno:</strong> {{ reviewingSubmission.student?.name ? `${reviewingSubmission.student.name} ${reviewingSubmission.student.lastName || ''}`.trim() : reviewingSubmission.student }}</p>
            <p><strong>Archivo:</strong>
              <a v-if="reviewingSubmission.fileUrl" :href="reviewingSubmission.fileUrl" target="_blank" class="file-link">{{ reviewingSubmission.fileName || 'Ver archivo' }}</a>
              <span v-else>—</span>
            </p>
          </div>
          <v-select
            v-model="reviewData.status"
            :items="reviewStatuses"
            label="Estado"
            prepend-inner-icon="mdi-check-circle-outline"
          ></v-select>
          <v-textarea
            v-model="reviewData.feedback"
            label="Feedback / Comentarios"
            rows="3"
            prepend-inner-icon="mdi-comment-text-outline"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="reviewDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="savingReview" @click="submitReview">Guardar corrección</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { updateAcademicModule } from "@/services/academicModules";
import { getSubmissionsByModule, reviewSubmission } from "@/services/submissions";

export default {
  name: "ProfessorModuleDetail",
  setup() {
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();
    const moduleData = enrollmentStore.getSelectedModule;

    const editData = ref({
      _id: moduleData?._id,
      description: moduleData?.description || "",
      order: moduleData?.order || 1,
      materialLinks: [...(moduleData?.materialLinks || [])],
    });
    const savingModule = ref(false);

    const submissions = ref([]);
    const loadingSubmissions = ref(false);

    // Review
    const reviewDialog = ref(false);
    const reviewingSubmission = ref(null);
    const reviewData = ref({ status: "pending_review", feedback: "" });
    const savingReview = ref(false);

    const reviewStatuses = [
      { title: "Pendiente de revisión", value: "pending_review" },
      { title: "Aprobado", value: "approved" },
      { title: "Rechazado", value: "rejected" },
    ];

    const snackbar = reactive({ show: false, text: "", color: "" });

    const submissionHeaders = [
      { title: "Alumno", key: "student", sortable: true },
      { title: "Archivo", key: "fileName", sortable: false },
      { title: "Fecha", key: "createdAt", sortable: true },
      { title: "Estado", key: "status", sortable: true },
      { title: "", key: "actions", sortable: false, align: "end", width: "60px" },
    ];

    const fetchSubmissions = async () => {
      if (!moduleData?._id) return;
      try {
        loadingSubmissions.value = true;
        submissions.value = await getSubmissionsByModule(moduleData._id);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        loadingSubmissions.value = false;
      }
    };

    onMounted(() => {
      fetchSubmissions();
    });

    const addLink = () => {
      editData.value.materialLinks.push("");
    };

    const removeLink = (index) => {
      editData.value.materialLinks.splice(index, 1);
    };

    const saveModule = async () => {
      try {
        savingModule.value = true;
        const payload = {
          _id: editData.value._id,
          description: editData.value.description,
          order: editData.value.order,
          materialLinks: editData.value.materialLinks.filter(l => l && l.trim()),
        };
        const updated = await updateAcademicModule(payload);
        enrollmentStore.setSelectedModule(updated);
        snackbar.text = "Módulo actualizado";
        snackbar.color = "success";
        snackbar.show = true;
      } catch (err) {
        console.error("Error updating module:", err);
        snackbar.text = "Error al actualizar";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        savingModule.value = false;
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

    const openReviewDialog = (submission) => {
      reviewingSubmission.value = submission;
      reviewData.value = {
        status: submission.status || "pending_review",
        feedback: submission.feedback || "",
      };
      reviewDialog.value = true;
    };

    const submitReview = async () => {
      if (!reviewingSubmission.value) return;
      try {
        savingReview.value = true;
        await reviewSubmission(reviewingSubmission.value._id, {
          status: reviewData.value.status,
          feedback: reviewData.value.feedback,
        });
        reviewDialog.value = false;
        snackbar.text = "Corrección guardada";
        snackbar.color = "success";
        snackbar.show = true;
        fetchSubmissions();
      } catch (err) {
        console.error("Error reviewing submission:", err);
        snackbar.text = "Error al guardar corrección";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        savingReview.value = false;
      }
    };

    const goToEnrollments = () => {
      router.push("/professor/enrollments");
    };

    const goBack = () => {
      enrollmentStore.setSelectedModule(null);
      router.push("/professor");
    };

    return {
      moduleData, editData, savingModule, saveModule, addLink, removeLink,
      submissions, loadingSubmissions, submissionHeaders,
      submissionStatusColor, submissionStatusLabel,
      reviewDialog, reviewingSubmission, reviewData, reviewStatuses, savingReview,
      openReviewDialog, submitReview,
      goToEnrollments, goBack, snackbar,
    };
  },
};
</script>

<style lang="scss" scoped>
.professor-module-page {
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
  margin: 0;
}

.header-actions {
  display: flex;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.section-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.section-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 8px;
}

.section-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1A1918;
}

.section-card-content {
  padding: 12px 24px 24px;
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

.data-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.file-link {
  color: #D97706;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.review-info p {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

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
