<template>
  <div class="schools-page">
    <!-- MANAGER VIEW: Schools list -->
    <template v-if="isManager">
      <div class="page-header">
        <div>
          <h1 class="page-title">Escuelas</h1>
          <p class="page-subtitle">Gestión de escuelas y programas académicos</p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="new-btn"
          @click="createNewSchool"
        >
          Nueva escuela
        </v-btn>
      </div>

      <v-card class="search-card">
        <div class="search-wrapper">
          <v-text-field
            v-model="searchValue"
            label="Buscar por nombre..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            class="search-input"
          ></v-text-field>
        </div>

        <v-data-table
          :items="filteredSchools"
          :loading="loading"
          items-per-page="25"
          item-value="name"
          :headers="schoolHeaders"
          @click:row="getSchoolDetail"
          class="data-table"
          hover
        >
          <template #item.isActive="{ item }">
            <v-chip
              :color="item.isActive !== false ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ item.isActive !== false ? 'Activa' : 'Inactiva' }}
            </v-chip>
          </template>

          <template #item.createdBy="{ item }">
            <span v-if="item.createdBy">
              {{ item.createdBy.name ? `${item.createdBy.name} ${item.createdBy.lastName || ''}`.trim() : item.createdBy }}
            </span>
            <span v-else class="text-medium-emphasis">—</span>
          </template>
        </v-data-table>
      </v-card>
    </template>

    <!-- STUDENT VIEW: My enrollments -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">Mis Inscripciones</h1>
          <p class="page-subtitle">Seleccioná una escuela para ver tus módulos</p>
        </div>
      </div>

      <v-card class="search-card">
        <div class="search-wrapper">
          <v-text-field
            v-model="searchValue"
            label="Buscar por escuela..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            class="search-input"
          ></v-text-field>
        </div>

        <v-data-table
          :items="filteredEnrollments"
          :loading="loading"
          items-per-page="25"
          :headers="enrollmentHeaders"
          class="data-table"
          hover
          @click:row="goToEnrollmentModules"
        >
          <template #item.school="{ item }">
            <span class="school-name">{{ item.school?.name || item.school }}</span>
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

          <template #item.actions>
            <v-icon color="primary" size="small">mdi-chevron-right</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSchoolStore } from "@/store/school";
import { useMemberStore } from "@/store/member";
import { useEnrollmentStore } from "@/store/enrollment";
import { getSchools } from "@/services/schools";
import { getMyEnrollments } from "@/services/enrollments";

export default {
  name: "SchoolsList",
  setup() {
    const store = useSchoolStore();
    const memberStore = useMemberStore();
    const enrollmentStore = useEnrollmentStore();
    const searchValue = ref("");
    const router = useRouter();
    const schools = ref([]);
    const enrollments = ref([]);
    const loading = ref(false);

    const isManager = computed(() => memberStore.isManager);

    const fetchSchools = async () => {
      try {
        loading.value = true;
        const schoolsData = await getSchools();
        schools.value = schoolsData;
        store.setSchools(schoolsData);
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchMyEnrollments = async () => {
      try {
        loading.value = true;
        enrollments.value = await getMyEnrollments();
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      if (isManager.value) {
        fetchSchools();
      } else {
        fetchMyEnrollments();
      }
    });

    // Manager
    const schoolHeaders = [
      { title: "Nombre", key: "name", sortable: true },
      { title: "Descripción", key: "description", sortable: false },
      { title: "Estado", key: "isActive", sortable: true },
      { title: "Creada por", key: "createdBy", sortable: false },
    ];

    const filteredSchools = computed(() => {
      if (!schools.value) return [];
      return searchValue.value
        ? schools.value.filter((s) => s.name.toLowerCase().includes(searchValue.value.toLowerCase()))
        : schools.value;
    });

    const getSchoolDetail = (_, row) => {
      store.setSelectedSchool(row.item);
      router.push("/schools/detail");
    };

    const createNewSchool = () => {
      router.push("/schools/new");
    };

    // Student
    const enrollmentHeaders = [
      { title: "Escuela", key: "school", sortable: true },
      { title: "Estado", key: "status", sortable: true },
      { title: "Progreso", key: "moduleResults", sortable: false },
      { title: "", key: "actions", sortable: false, align: "end", width: "40px" },
    ];

    const filteredEnrollments = computed(() => {
      if (!enrollments.value) return [];
      if (!searchValue.value) return enrollments.value;
      const lower = searchValue.value.toLowerCase();
      return enrollments.value.filter((e) => {
        const schoolName = e.school?.name || "";
        return schoolName.toLowerCase().includes(lower);
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

    const goToEnrollmentModules = (_, row) => {
      enrollmentStore.setSelectedEnrollment(row.item);
      router.push("/schools/modules");
    };

    return {
      schools, enrollments, searchValue, loading, isManager,
      schoolHeaders, filteredSchools, getSchoolDetail, createNewSchool,
      enrollmentHeaders, filteredEnrollments,
      enrollmentStatusColor, enrollmentStatusLabel,
      goToEnrollmentModules,
    };
  },
};
</script>

<style lang="scss" scoped>
.schools-page {
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

.new-btn {
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

.data-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.data-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.school-name {
  font-weight: 500;
}
</style>
