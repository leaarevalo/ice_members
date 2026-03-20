<template>
  <div class="school-detail-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ schoolDetail.name || 'Detalle de escuela' }}</h1>
        <p class="page-subtitle">Gestión completa de la escuela y sus módulos</p>
      </div>
      <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left" class="back-btn">
        Volver
      </v-btn>
    </div>

    <v-tabs v-model="activeTab" color="primary" class="school-tabs">
      <v-tab value="info">Información</v-tab>
      <v-tab value="modules">Módulos</v-tab>
      <v-tab value="enrollments">Inscripciones</v-tab>
      <v-tab value="submissions">Entregas</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="mt-4">
      <!-- TAB: Info -->
      <v-window-item value="info">
        <v-card class="tab-card">
          <v-form ref="infoForm">
            <v-container class="form-container">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="schoolDetail.name"
                    label="Nombre"
                    prepend-inner-icon="mdi-school-outline"
                    :readonly="!isManager"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="schoolDetail.isActive"
                    :items="[{ title: 'Activa', value: true }, { title: 'Inactiva', value: false }]"
                    label="Estado"
                    prepend-inner-icon="mdi-toggle-switch-outline"
                    :readonly="!isManager"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="schoolDetail.description"
                    label="Descripción"
                    prepend-inner-icon="mdi-text-box-outline"
                    rows="3"
                    :readonly="!isManager"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <div class="form-actions" v-if="isManager">
              <v-btn color="error" variant="outlined" @click="confirmDelete" prepend-icon="mdi-delete-outline">
                Eliminar
              </v-btn>
              <v-btn color="primary" @click="saveSchoolInfo" prepend-icon="mdi-content-save-outline" :loading="savingInfo">
                Guardar cambios
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-window-item>

      <!-- TAB: Modules -->
      <v-window-item value="modules">
        <v-card class="tab-card">
          <div class="tab-header">
            <h3 class="tab-title">Módulos académicos</h3>
            <v-btn v-if="isManager" color="primary" size="small" prepend-icon="mdi-plus" @click="openModuleDialog(null)" class="action-btn">
              Nuevo módulo
            </v-btn>
          </div>
          <v-data-table
            :items="modules"
            :headers="moduleHeaders"
            :loading="loadingModules"
            items-per-page="25"
            class="detail-table"
            hover
          >
            <template #item.professors="{ item }">
              <v-chip
                v-for="prof in (item.professors || []).slice(0, 3)"
                :key="prof._id || prof"
                size="small"
                color="primary"
                variant="tonal"
                class="mr-1"
              >
                {{ getProfessorName(prof) }}
              </v-chip>
              <v-chip v-if="(item.professors || []).length > 3" size="small" variant="outlined">
                +{{ item.professors.length - 3 }}
              </v-chip>
            </template>
            <template #item.materialLinks="{ item }">
              <span v-if="item.materialLinks && item.materialLinks.length">
                {{ item.materialLinks.length }} enlace(s)
              </span>
              <span v-else class="text-medium-emphasis">—</span>
            </template>
            <template #item.actions="{ item }">
              <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="openModuleDialog(item)">
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Editar</v-tooltip>
              </v-btn>
              <v-btn v-if="isManager" icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDeleteModule(item)">
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- TAB: Enrollments -->
      <v-window-item value="enrollments">
        <v-card class="tab-card">
          <div class="tab-header">
            <h3 class="tab-title">Alumnos inscriptos</h3>
            <v-btn v-if="isManager" color="primary" size="small" prepend-icon="mdi-plus" @click="openEnrollmentDialog" class="action-btn">
              Inscribir alumno
            </v-btn>
          </div>
          <v-data-table
            :items="enrollments"
            :headers="enrollmentHeaders"
            :loading="loadingEnrollments"
            items-per-page="25"
            class="detail-table"
            hover
          >
            <template #item.student="{ item }">
              {{ getStudentName(item.student) }}
            </template>
            <template #item.status="{ item }">
              <v-chip :color="enrollmentStatusColor(item.status)" size="small" variant="tonal">
                {{ enrollmentStatusLabel(item.status) }}
              </v-chip>
            </template>
            <template #item.moduleResults="{ item }">
              <span v-if="item.moduleResults && item.moduleResults.length">
                {{ item.moduleResults.filter(mr => mr.status === 'approved').length }}/{{ item.moduleResults.length }} aprobados
              </span>
              <span v-else class="text-medium-emphasis">—</span>
            </template>
            <template #item.actions="{ item }">
              <v-btn icon="mdi-eye" variant="text" size="small" color="primary" @click="openEnrollmentDetail(item)">
                <v-icon>mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">Ver progreso</v-tooltip>
              </v-btn>
              <v-btn v-if="isManager" icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDeleteEnrollment(item)">
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- TAB: Submissions -->
      <v-window-item value="submissions">
        <v-card class="tab-card">
          <div class="tab-header">
            <h3 class="tab-title">Entregas de alumnos</h3>
            <v-autocomplete
              v-model="selectedModuleForSubmissions"
              :items="modules"
              item-title="name"
              item-value="_id"
              label="Filtrar por módulo"
              hide-details
              density="compact"
              variant="outlined"
              clearable
              style="max-width: 300px;"
            ></v-autocomplete>
          </div>
          <v-data-table
            :items="filteredSubmissions"
            :headers="submissionHeaders"
            :loading="loadingSubmissions"
            items-per-page="25"
            class="detail-table"
            hover
          >
            <template #item.student="{ item }">
              {{ getStudentName(item.student) }}
            </template>
            <template #item.academicModule="{ item }">
              {{ item.academicModule?.name || item.academicModule }}
            </template>
            <template #item.status="{ item }">
              <v-chip :color="submissionStatusColor(item.status)" size="small" variant="tonal">
                {{ submissionStatusLabel(item.status) }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <v-btn icon="mdi-eye" variant="text" size="small" color="primary" @click="openSubmissionDetail(item)">
                <v-icon>mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">Ver entrega</v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Academic Module Dialog -->
    <academic-module-dialog
      v-model="moduleDialog"
      :module-data="editingModule"
      :school-id="schoolDetail._id"
      :members="allMembers"
      @saved="onModuleSaved"
    />

    <!-- Enrollment Dialog -->
    <enrollment-dialog
      v-model="enrollmentDialog"
      :school-id="schoolDetail._id"
      :members="allMembers"
      :modules="modules"
      @saved="onEnrollmentSaved"
    />

    <!-- Submission Detail Dialog -->
    <submission-detail-dialog
      v-model="submissionDialog"
      :submission="selectedSubmission"
      :is-manager="isManager"
      @reviewed="onSubmissionReviewed"
    />

    <!-- Enrollment Detail Dialog (module results) -->
    <v-dialog v-model="enrollmentDetailDialog" max-width="700">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">
          Progreso del alumno
        </v-card-title>
        <v-card-text>
          <p class="mb-4 text-medium-emphasis" v-if="selectedEnrollment">
            Alumno: <strong>{{ getStudentName(selectedEnrollment.student) }}</strong>
            — Estado: <v-chip :color="enrollmentStatusColor(selectedEnrollment.status)" size="small" variant="tonal">{{ enrollmentStatusLabel(selectedEnrollment.status) }}</v-chip>
          </p>
          <v-data-table
            v-if="selectedEnrollment"
            :items="selectedEnrollment.moduleResults || []"
            :headers="moduleResultHeaders"
            items-per-page="-1"
            density="compact"
            class="detail-table"
          >
            <template #item.academicModule="{ item }">
              {{ item.academicModule?.name || item.academicModule }}
            </template>
            <template #item.status="{ item }">
              <v-select
                v-if="isManager"
                v-model="item.status"
                :items="moduleResultStatuses"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 180px;"
                @update:model-value="updateResult(selectedEnrollment, item)"
              ></v-select>
              <v-chip v-else :color="moduleResultStatusColor(item.status)" size="small" variant="tonal">
                {{ moduleResultStatusLabel(item.status) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="enrollmentDetailDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">Confirmar eliminación</v-card-title>
        <v-card-text>{{ deleteMessage }}</v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="executeDelete" :loading="deleting">Eliminar</v-btn>
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
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useSchoolStore } from "@/store/school";
import { useMemberStore } from "@/store/member";
import { updateSchool, deleteSchool } from "@/services/schools";
import { getAcademicModulesBySchool, deleteAcademicModule } from "@/services/academicModules";
import { getEnrollmentsBySchool, deleteEnrollment, updateModuleResult } from "@/services/enrollments";
import { getSubmissionsByModule } from "@/services/submissions";
import { getMembers } from "@/services/members";
import AcademicModuleDialog from "./AcademicModuleDialog.vue";
import EnrollmentDialog from "./EnrollmentDialog.vue";
import SubmissionDetailDialog from "./SubmissionDetailDialog.vue";

export default {
  name: "SchoolDetail",
  components: { AcademicModuleDialog, EnrollmentDialog, SubmissionDetailDialog },
  setup() {
    const router = useRouter();
    const store = useSchoolStore();
    const memberStore = useMemberStore();
    const schoolDetail = ref({ ...store.getSelectedSchool });
    const activeTab = ref("info");

    const isManager = computed(() => memberStore.isManager);

    // Data
    const modules = ref([]);
    const enrollments = ref([]);
    const submissions = ref([]);
    const allMembers = ref([]);
    const loadingModules = ref(false);
    const loadingEnrollments = ref(false);
    const loadingSubmissions = ref(false);
    const savingInfo = ref(false);

    // Dialogs
    const moduleDialog = ref(false);
    const editingModule = ref(null);
    const enrollmentDialog = ref(false);
    const enrollmentDetailDialog = ref(false);
    const selectedEnrollment = ref(null);
    const submissionDialog = ref(false);
    const selectedSubmission = ref(null);
    const selectedModuleForSubmissions = ref(null);

    // Delete
    const deleteDialog = ref(false);
    const deleteMessage = ref("");
    const deleteAction = ref(null);
    const deleting = ref(false);

    const snackbar = reactive({ show: false, text: "", color: "" });

    // Fetch data
    const fetchModules = async () => {
      if (!schoolDetail.value._id) return;
      try {
        loadingModules.value = true;
        modules.value = await getAcademicModulesBySchool(schoolDetail.value._id);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        loadingModules.value = false;
      }
    };

    const fetchEnrollments = async () => {
      if (!schoolDetail.value._id) return;
      try {
        loadingEnrollments.value = true;
        enrollments.value = await getEnrollmentsBySchool(schoolDetail.value._id);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        loadingEnrollments.value = false;
      }
    };

    const fetchSubmissions = async (moduleId) => {
      if (!moduleId) return;
      try {
        loadingSubmissions.value = true;
        submissions.value = await getSubmissionsByModule(moduleId);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        loadingSubmissions.value = false;
      }
    };

    const fetchMembers = async () => {
      try {
        const storeMembers = memberStore.getMembersFromStore;
        if (storeMembers && storeMembers.length > 0) {
          allMembers.value = storeMembers;
        } else {
          allMembers.value = await getMembers();
          memberStore.setMembers(allMembers.value);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    onMounted(() => {
      fetchMembers();
      fetchModules();
      fetchEnrollments();
    });

    watch(selectedModuleForSubmissions, (moduleId) => {
      if (moduleId) {
        fetchSubmissions(moduleId);
      } else {
        submissions.value = [];
      }
    });

    // Helpers
    const getProfessorName = (prof) => {
      if (typeof prof === "object" && prof !== null) {
        return `${prof.name || ""} ${prof.lastName || ""}`.trim();
      }
      const found = allMembers.value.find(m => String(m._id) === String(prof) || String(m.document) === String(prof));
      return found ? `${found.name || ""} ${found.lastName || ""}`.trim() : String(prof);
    };

    const getStudentName = (student) => {
      if (typeof student === "object" && student !== null) {
        return `${student.name || ""} ${student.lastName || ""}`.trim();
      }
      const found = allMembers.value.find(m => String(m._id) === String(student) || String(m.document) === String(student));
      return found ? `${found.name || ""} ${found.lastName || ""}`.trim() : String(student);
    };

    // Status helpers
    const enrollmentStatusColor = (status) => {
      const map = { active: "success", completed: "primary", dropped: "error" };
      return map[status] || "secondary";
    };
    const enrollmentStatusLabel = (status) => {
      const map = { active: "Activo", completed: "Completado", dropped: "Baja" };
      return map[status] || status;
    };
    const submissionStatusColor = (status) => {
      const map = { pending_review: "warning", approved: "success", rejected: "error" };
      return map[status] || "secondary";
    };
    const submissionStatusLabel = (status) => {
      const map = { pending_review: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
      return map[status] || status;
    };
    const moduleResultStatusColor = (status) => {
      const map = { pending: "secondary", in_progress: "warning", approved: "success", failed: "error" };
      return map[status] || "secondary";
    };
    const moduleResultStatusLabel = (status) => {
      const map = { pending: "Pendiente", in_progress: "En curso", approved: "Aprobado", failed: "Reprobado" };
      return map[status] || status;
    };

    // Table headers
    const moduleHeaders = [
      { title: "Orden", key: "order", sortable: true, width: "80px" },
      { title: "Nombre", key: "name", sortable: true },
      { title: "Descripción", key: "description", sortable: false },
      { title: "Profesores", key: "professors", sortable: false },
      { title: "Material", key: "materialLinks", sortable: false },
      { title: "Acciones", key: "actions", sortable: false, align: "end" },
    ];

    const enrollmentHeaders = [
      { title: "Alumno", key: "student", sortable: true },
      { title: "Estado", key: "status", sortable: true },
      { title: "Progreso", key: "moduleResults", sortable: false },
      { title: "Acciones", key: "actions", sortable: false, align: "end" },
    ];

    const submissionHeaders = [
      { title: "Alumno", key: "student", sortable: true },
      { title: "Módulo", key: "academicModule", sortable: true },
      { title: "Archivo", key: "fileName", sortable: false },
      { title: "Estado", key: "status", sortable: true },
      { title: "Acciones", key: "actions", sortable: false, align: "end" },
    ];

    const moduleResultHeaders = [
      { title: "Módulo", key: "academicModule", sortable: false },
      { title: "Estado", key: "status", sortable: false },
    ];

    const moduleResultStatuses = [
      { title: "Pendiente", value: "pending" },
      { title: "En curso", value: "in_progress" },
      { title: "Aprobado", value: "approved" },
      { title: "Reprobado", value: "failed" },
    ];

    const filteredSubmissions = computed(() => {
      return submissions.value;
    });

    // Actions
    const saveSchoolInfo = async () => {
      try {
        savingInfo.value = true;
        const response = await updateSchool(schoolDetail.value);
        store.updateSchool(response);
        snackbar.text = "Escuela actualizada";
        snackbar.color = "success";
        snackbar.show = true;
      } catch (err) {
        console.error("Error updating school:", err);
        snackbar.text = "Error al actualizar";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        savingInfo.value = false;
      }
    };

    const openModuleDialog = (mod) => {
      editingModule.value = mod ? { ...mod } : null;
      moduleDialog.value = true;
    };

    const onModuleSaved = () => {
      fetchModules();
    };

    const openEnrollmentDialog = () => {
      enrollmentDialog.value = true;
    };

    const onEnrollmentSaved = () => {
      fetchEnrollments();
    };

    const openEnrollmentDetail = (enrollment) => {
      selectedEnrollment.value = { ...enrollment };
      enrollmentDetailDialog.value = true;
    };

    const updateResult = async (enrollment, moduleResult) => {
      try {
        await updateModuleResult(enrollment._id, {
          academicModule: moduleResult.academicModule?._id || moduleResult.academicModule,
          status: moduleResult.status,
        });
        snackbar.text = "Resultado actualizado";
        snackbar.color = "success";
        snackbar.show = true;
        fetchEnrollments();
      } catch (err) {
        console.error("Error updating module result:", err);
        snackbar.text = "Error al actualizar resultado";
        snackbar.color = "error";
        snackbar.show = true;
      }
    };

    const openSubmissionDetail = (submission) => {
      selectedSubmission.value = { ...submission };
      submissionDialog.value = true;
    };

    const onSubmissionReviewed = () => {
      if (selectedModuleForSubmissions.value) {
        fetchSubmissions(selectedModuleForSubmissions.value);
      }
    };

    // Delete logic
    const confirmDelete = () => {
      deleteMessage.value = `¿Estás seguro de eliminar la escuela "${schoolDetail.value.name}"?`;
      deleteAction.value = async () => {
        await deleteSchool(schoolDetail.value._id);
        store.deleteSchool(schoolDetail.value._id);
        router.push("/schools");
      };
      deleteDialog.value = true;
    };

    const confirmDeleteModule = (mod) => {
      deleteMessage.value = `¿Estás seguro de eliminar el módulo "${mod.name}"?`;
      deleteAction.value = async () => {
        await deleteAcademicModule(mod._id);
        fetchModules();
      };
      deleteDialog.value = true;
    };

    const confirmDeleteEnrollment = (enrollment) => {
      deleteMessage.value = `¿Estás seguro de eliminar esta inscripción?`;
      deleteAction.value = async () => {
        await deleteEnrollment(enrollment._id);
        fetchEnrollments();
      };
      deleteDialog.value = true;
    };

    const executeDelete = async () => {
      try {
        deleting.value = true;
        if (deleteAction.value) await deleteAction.value();
        deleteDialog.value = false;
        snackbar.text = "Eliminado correctamente";
        snackbar.color = "success";
        snackbar.show = true;
      } catch (err) {
        console.error("Error deleting:", err);
        snackbar.text = "Error al eliminar";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        deleting.value = false;
      }
    };

    const goBack = () => {
      store.setSelectedSchool(null);
      router.push("/schools");
    };

    return {
      schoolDetail, activeTab, isManager,
      modules, enrollments, submissions, allMembers,
      loadingModules, loadingEnrollments, loadingSubmissions, savingInfo,
      moduleHeaders, enrollmentHeaders, submissionHeaders, moduleResultHeaders,
      moduleResultStatuses, filteredSubmissions, selectedModuleForSubmissions,
      // Helpers
      getProfessorName, getStudentName,
      enrollmentStatusColor, enrollmentStatusLabel,
      submissionStatusColor, submissionStatusLabel,
      moduleResultStatusColor, moduleResultStatusLabel,
      // Dialogs
      moduleDialog, editingModule, enrollmentDialog,
      enrollmentDetailDialog, selectedEnrollment,
      submissionDialog, selectedSubmission,
      // Actions
      saveSchoolInfo, openModuleDialog, onModuleSaved,
      openEnrollmentDialog, onEnrollmentSaved,
      openEnrollmentDetail, updateResult,
      openSubmissionDetail, onSubmissionReviewed,
      // Delete
      deleteDialog, deleteMessage, deleting,
      confirmDelete, confirmDeleteModule, confirmDeleteEnrollment, executeDelete,
      goBack, snackbar,
    };
  },
};
</script>

<style lang="scss" scoped>
.school-detail-page {
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
  margin-bottom: 2px;
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

.school-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.tab-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 12px;
}

.tab-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1A1918;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
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

.detail-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.detail-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
