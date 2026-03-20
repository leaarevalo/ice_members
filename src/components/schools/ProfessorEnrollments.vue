<template>
  <div class="professor-enrollments-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Alumnos — {{ schoolName }}</h1>
        <p class="page-subtitle">Inscripciones y progreso de los alumnos en la escuela</p>
      </div>
      <div class="header-actions">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="enrollDialog = true" class="action-btn mr-2">
          Inscribir alumno
        </v-btn>
        <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left" class="action-btn">
          Volver
        </v-btn>
      </div>
    </div>

    <v-card class="search-card">
      <div class="search-wrapper">
        <v-text-field
          v-model="searchValue"
          label="Buscar alumno..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          class="search-input"
        ></v-text-field>
      </div>

      <v-data-table
        :items="filteredEnrollments"
        :loading="loading"
        :headers="headers"
        items-per-page="25"
        class="data-table"
        hover
      >
        <template #item.student="{ item }">
          {{ item.student?.name ? `${item.student.name} ${item.student.lastName || ''}`.trim() : item.student }}
        </template>
        <template #item.document="{ item }">
          {{ item.student?.document || '—' }}
        </template>
        <template #item.status="{ item }">
          <v-chip :color="enrollmentStatusColor(item.status)" size="small" variant="tonal">
            {{ enrollmentStatusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.progress="{ item }">
          <span v-if="item.moduleResults && item.moduleResults.length">
            {{ item.moduleResults.filter(mr => mr.status === 'approved').length }}/{{ item.moduleResults.length }} aprobados
          </span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" color="primary" icon="mdi-clipboard-check-outline" @click="openGradeDialog(item)">
            <v-icon>mdi-clipboard-check-outline</v-icon>
            <v-tooltip activator="parent" location="top">Calificar módulos</v-tooltip>
          </v-btn>
          <v-btn size="small" variant="text" color="error" icon="mdi-account-remove" @click="confirmUnenroll(item)">
            <v-icon>mdi-account-remove</v-icon>
            <v-tooltip activator="parent" location="top">Desinscribir</v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Enroll dialog -->
    <v-dialog v-model="enrollDialog" max-width="450">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">Inscribir alumno</v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="enrollForm" v-model="isEnrollFormValid">
            <v-autocomplete
              v-model="enrollStudentDoc"
              :items="allMembers"
              :item-title="getMemberLabel"
              item-value="document"
              label="Seleccionar alumno"
              :rules="[v => !!v || 'Obligatorio']"
              prepend-inner-icon="mdi-account-search-outline"
              required
              :loading="loadingMembers"
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="enrollDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="enrolling" :disabled="!isEnrollFormValid" @click="enrollStudent">Inscribir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Grade dialog -->
    <v-dialog v-model="gradeDialog" max-width="700">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">
          Calificar — {{ gradingEnrollment?.student?.name ? `${gradingEnrollment.student.name} ${gradingEnrollment.student.lastName || ''}`.trim() : '' }}
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-if="gradingEnrollment"
            :items="gradingEnrollment.moduleResults || []"
            :headers="gradeHeaders"
            items-per-page="-1"
            density="compact"
            class="grade-table"
          >
            <template #item.academicModule="{ item }">
              {{ item.academicModule?.name || item.academicModule }}
            </template>
            <template #item.status="{ item }">
              <v-select
                v-model="item.status"
                :items="moduleResultStatuses"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 180px;"
                @update:model-value="gradeModuleResult(gradingEnrollment, item)"
              ></v-select>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="gradeDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unenroll confirmation -->
    <v-dialog v-model="unenrollDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">Confirmar desinscripción</v-card-title>
        <v-card-text>
          ¿Estás seguro de desinscribir a <strong>{{ unenrollStudentName }}</strong>?
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="secondary" @click="unenrollDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="unenrolling" @click="executeUnenroll">Desinscribir</v-btn>
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
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useEnrollmentStore } from "@/store/enrollment";
import { getEnrollmentsBySchool, createEnrollment, deleteEnrollment, updateModuleResult } from "@/services/enrollments";
import { getMembers } from "@/services/members";

export default {
  name: "ProfessorEnrollments",
  setup() {
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();
    const moduleData = enrollmentStore.getSelectedModule;
    const schoolId = moduleData?.school?._id || moduleData?.school;
    const schoolName = moduleData?.school?.name || "Escuela";

    const enrollments = ref([]);
    const loading = ref(false);
    const searchValue = ref("");
    const allMembers = ref([]);
    const loadingMembers = ref(false);

    const snackbar = reactive({ show: false, text: "", color: "" });

    const headers = [
      { title: "Alumno", key: "student", sortable: true },
      { title: "Documento", key: "document", sortable: true },
      { title: "Estado", key: "status", sortable: true },
      { title: "Progreso", key: "progress", sortable: false },
      { title: "Acciones", key: "actions", sortable: false, align: "end" },
    ];

    const gradeHeaders = [
      { title: "Módulo", key: "academicModule", sortable: false },
      { title: "Estado", key: "status", sortable: false },
    ];

    const moduleResultStatuses = [
      { title: "Pendiente", value: "pending" },
      { title: "En curso", value: "in_progress" },
      { title: "Aprobado", value: "approved" },
      { title: "Reprobado", value: "failed" },
    ];

    const fetchEnrollments = async () => {
      if (!schoolId) return;
      try {
        loading.value = true;
        enrollments.value = await getEnrollmentsBySchool(schoolId);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchMembers = async () => {
      try {
        loadingMembers.value = true;
        allMembers.value = await getMembers();
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        loadingMembers.value = false;
      }
    };

    onMounted(() => {
      fetchEnrollments();
      fetchMembers();
    });

    const filteredEnrollments = computed(() => {
      if (!enrollments.value) return [];
      if (!searchValue.value) return enrollments.value;
      const lower = searchValue.value.toLowerCase();
      return enrollments.value.filter((e) => {
        const name = e.student?.name || "";
        const lastName = e.student?.lastName || "";
        const doc = e.student?.document || "";
        return `${name} ${lastName} ${doc}`.toLowerCase().includes(lower);
      });
    });

    const enrollmentStatusColor = (status) => {
      const map = { active: "success", completed: "primary", dropped: "error" };
      return map[status] || "secondary";
    };
    const enrollmentStatusLabel = (status) => {
      const map = { active: "Activo", completed: "Completado", dropped: "Baja" };
      return map[status] || status;
    };

    const getMemberLabel = (member) => {
      if (typeof member === "string") return member;
      return `${member.name || ""} ${member.lastName || ""} (${member.document || ""})`.trim();
    };

    // Enroll
    const enrollDialog = ref(false);
    const enrollStudentDoc = ref(null);
    const isEnrollFormValid = ref(false);
    const enrolling = ref(false);

    const enrollStudent = async () => {
      if (!isEnrollFormValid.value) return;
      try {
        enrolling.value = true;
        await createEnrollment({
          studentDocument: enrollStudentDoc.value,
          school: schoolId,
        });
        enrollDialog.value = false;
        enrollStudentDoc.value = null;
        snackbar.text = "Alumno inscripto correctamente";
        snackbar.color = "success";
        snackbar.show = true;
        fetchEnrollments();
      } catch (err) {
        console.error("Error enrolling:", err);
        snackbar.text = "Error al inscribir";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        enrolling.value = false;
      }
    };

    // Unenroll
    const unenrollDialog = ref(false);
    const unenrollTarget = ref(null);
    const unenrolling = ref(false);
    const unenrollStudentName = computed(() => {
      if (!unenrollTarget.value?.student) return "";
      const s = unenrollTarget.value.student;
      return s.name ? `${s.name} ${s.lastName || ""}`.trim() : s;
    });

    const confirmUnenroll = (enrollment) => {
      unenrollTarget.value = enrollment;
      unenrollDialog.value = true;
    };

    const executeUnenroll = async () => {
      if (!unenrollTarget.value) return;
      try {
        unenrolling.value = true;
        await deleteEnrollment(unenrollTarget.value._id);
        unenrollDialog.value = false;
        snackbar.text = "Alumno desinscripto";
        snackbar.color = "success";
        snackbar.show = true;
        fetchEnrollments();
      } catch (err) {
        console.error("Error unenrolling:", err);
        snackbar.text = "Error al desinscribir";
        snackbar.color = "error";
        snackbar.show = true;
      } finally {
        unenrolling.value = false;
      }
    };

    // Grade
    const gradeDialog = ref(false);
    const gradingEnrollment = ref(null);

    const openGradeDialog = (enrollment) => {
      gradingEnrollment.value = JSON.parse(JSON.stringify(enrollment));
      gradeDialog.value = true;
    };

    const gradeModuleResult = async (enrollment, moduleResult) => {
      try {
        await updateModuleResult(enrollment._id, {
          academicModule: moduleResult.academicModule?._id || moduleResult.academicModule,
          status: moduleResult.status,
        });
        snackbar.text = "Calificación actualizada";
        snackbar.color = "success";
        snackbar.show = true;
        fetchEnrollments();
      } catch (err) {
        console.error("Error grading:", err);
        snackbar.text = "Error al calificar";
        snackbar.color = "error";
        snackbar.show = true;
      }
    };

    const goBack = () => {
      router.push("/professor/module");
    };

    return {
      schoolName, enrollments, loading, searchValue, headers,
      filteredEnrollments, enrollmentStatusColor, enrollmentStatusLabel,
      allMembers, loadingMembers, getMemberLabel,
      // Enroll
      enrollDialog, enrollStudentDoc, isEnrollFormValid, enrolling, enrollStudent,
      // Unenroll
      unenrollDialog, unenrollTarget, unenrolling, unenrollStudentName,
      confirmUnenroll, executeUnenroll,
      // Grade
      gradeDialog, gradingEnrollment, gradeHeaders, moduleResultStatuses,
      openGradeDialog, gradeModuleResult,
      goBack, snackbar,
    };
  },
};
</script>

<style lang="scss" scoped>
.professor-enrollments-page {
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

.header-actions {
  display: flex;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.search-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.search-wrapper {
  padding: 20px 24px 12px;
}

.search-input {
  max-width: 380px;
}

.data-table :deep(th),
.grade-table :deep(th) {
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

.file-link {
  color: #D97706;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>
