<template>
  <div class="student-modules-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ enrollment?.school?.name || 'Módulos' }}</h1>
        <p class="page-subtitle">
          Estado de inscripción:
          <v-chip :color="enrollmentStatusColor(enrollment?.status)" size="small" variant="tonal" class="ml-1">
            {{ enrollmentStatusLabel(enrollment?.status) }}
          </v-chip>
          <span class="ml-3">
            {{ approvedCount }}/{{ totalCount }} módulos aprobados
          </span>
        </p>
      </div>
      <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left" class="back-btn">
        Volver
      </v-btn>
    </div>

    <v-card class="modules-card">
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
        :headers="headers"
        items-per-page="25"
        class="modules-table"
        hover
        @click:row="goToModuleDetail"
      >
        <template #item.order="{ item }">
          <span class="module-order">{{ item.academicModule?.order || '—' }}</span>
        </template>
        <template #item.name="{ item }">
          <span class="module-name">{{ item.academicModule?.name || item.academicModule }}</span>
        </template>
        <template #item.description="{ item }">
          <span class="text-medium-emphasis">{{ item.academicModule?.description || '' }}</span>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="moduleResultStatusColor(item.status)" size="small" variant="tonal">
            {{ moduleResultStatusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-chevron-right" variant="text" size="small" color="primary" @click.stop="goToModuleDetail(null, { item })">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useEnrollmentStore } from "@/store/enrollment";

export default {
  name: "StudentModules",
  setup() {
    const router = useRouter();
    const enrollmentStore = useEnrollmentStore();
    const enrollment = enrollmentStore.getSelectedEnrollment;
    const searchValue = ref("");

    const moduleResults = computed(() => enrollment?.moduleResults || []);
    const approvedCount = computed(() => moduleResults.value.filter(mr => mr.status === 'approved').length);
    const totalCount = computed(() => moduleResults.value.length);

    const headers = [
      { title: "#", key: "order", sortable: true, width: "60px" },
      { title: "Módulo", key: "name", sortable: true },
      { title: "Descripción", key: "description", sortable: false },
      { title: "Estado", key: "status", sortable: true },
      { title: "", key: "actions", sortable: false, align: "end", width: "60px" },
    ];

    const filteredModules = computed(() => {
      if (!searchValue.value) return moduleResults.value;
      const lower = searchValue.value.toLowerCase();
      return moduleResults.value.filter(mr => {
        const name = mr.academicModule?.name || "";
        return name.toLowerCase().includes(lower);
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
    const moduleResultStatusColor = (status) => {
      const map = { pending: "secondary", in_progress: "warning", approved: "success", failed: "error" };
      return map[status] || "secondary";
    };
    const moduleResultStatusLabel = (status) => {
      const map = { pending: "Pendiente", in_progress: "En curso", approved: "Aprobado", failed: "Reprobado" };
      return map[status] || status;
    };

    const goToModuleDetail = (_, row) => {
      const moduleResult = row.item;
      const academicModule = moduleResult.academicModule;
      if (!academicModule) return;
      enrollmentStore.setSelectedModule(academicModule);
      router.push("/schools/module");
    };

    const goBack = () => {
      enrollmentStore.setSelectedEnrollment(null);
      router.push("/schools");
    };

    return {
      enrollment, searchValue, headers, filteredModules,
      approvedCount, totalCount,
      enrollmentStatusColor, enrollmentStatusLabel,
      moduleResultStatusColor, moduleResultStatusLabel,
      goToModuleDetail, goBack,
    };
  },
};
</script>

<style lang="scss" scoped>
.student-modules-page {
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
  display: flex;
  align-items: center;
}

.back-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.modules-card {
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

.modules-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.modules-table :deep(th) {
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

.module-name {
  font-weight: 500;
}
</style>
