<template>
  <div class="professor-modules-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mis Módulos</h1>
        <p class="page-subtitle">Módulos académicos que tenés asignados como profesor</p>
      </div>
    </div>

    <v-card class="search-card">
      <div class="search-wrapper">
        <v-text-field
          v-model="searchValue"
          label="Buscar módulo..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          class="search-input"
        ></v-text-field>
      </div>

      <v-data-table
        :items="filteredModules"
        :loading="loading"
        items-per-page="25"
        :headers="headers"
        class="data-table"
        hover
        @click:row="goToModuleDetail"
      >
        <template #item.order="{ item }">
          <span class="module-order">{{ item.order || '—' }}</span>
        </template>
        <template #item.school="{ item }">
          <v-chip size="small" color="primary" variant="tonal">
            {{ item.school?.name || item.school }}
          </v-chip>
        </template>
        <template #item.materialLinks="{ item }">
          <span v-if="item.materialLinks && item.materialLinks.length">
            {{ item.materialLinks.length }} enlace(s)
          </span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="text"
            color="secondary"
            icon="mdi-account-group"
            @click.stop="goToEnrollments(item)"
          >
            <v-icon>mdi-account-group</v-icon>
            <v-tooltip activator="parent" location="top">Alumnos de la escuela</v-tooltip>
          </v-btn>
          <v-icon color="primary" size="small" class="ml-2">mdi-chevron-right</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEnrollmentStore } from "@/store/enrollment";
import { getAcademicModules } from "@/services/academicModules";

export default {
  name: "ProfessorModules",
  setup() {
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();
    const modules = ref([]);
    const loading = ref(false);
    const searchValue = ref("");

    const headers = [
      { title: "#", key: "order", sortable: true, width: "60px" },
      { title: "Módulo", key: "name", sortable: true },
      { title: "Escuela", key: "school", sortable: true },
      { title: "Material", key: "materialLinks", sortable: false },
      { title: "", key: "actions", sortable: false, align: "end", width: "100px" },
    ];

    const fetchModules = async () => {
      try {
        loading.value = true;
        modules.value = await getAcademicModules();
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchModules();
    });

    const filteredModules = computed(() => {
      if (!modules.value) return [];
      if (!searchValue.value) return modules.value;
      const lower = searchValue.value.toLowerCase();
      return modules.value.filter((m) =>
        m.name.toLowerCase().includes(lower) ||
        (m.school?.name || "").toLowerCase().includes(lower)
      );
    });

    const goToModuleDetail = (_, row) => {
      enrollmentStore.setSelectedModule(row.item);
      router.push("/professor/module");
    };

    const goToEnrollments = (mod) => {
      enrollmentStore.setSelectedModule(mod);
      router.push("/professor/enrollments");
    };

    return {
      modules, loading, searchValue, headers, filteredModules,
      goToModuleDetail, goToEnrollments,
    };
  },
};
</script>

<style lang="scss" scoped>
.professor-modules-page {
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

.module-order {
  font-weight: 600;
  color: #6B6560;
}
</style>
