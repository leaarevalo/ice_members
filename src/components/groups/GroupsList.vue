<template>
  <div class="groups-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Grupos</h1>
        <p class="page-subtitle">Gestión de grupos de la iglesia</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="new-group-btn"
        @click="createNewGroup"
      >
        Nuevo grupo
      </v-btn>
    </div>

    <!-- Search -->
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

      <!-- Data Table -->
      <v-data-table
        :items="groupsList"
        :loading="loading"
        items-per-page="25"
        item-value="name"
        :headers="tableHeaders"
        @click:row="getGroupDetail"
        class="groups-table"
        hover
      >
        <template #item.managers="{ item }">
          <div class="managers-chips">
            <v-chip
              v-for="manager in (item.managers || []).slice(0, 3)"
              :key="manager._id"
              size="small"
              color="primary"
              variant="tonal"
              class="mr-1"
            >
              {{ manager.name }} {{ manager.lastName }}
            </v-chip>
            <v-chip
              v-if="(item.managers || []).length > 3"
              size="small"
              variant="outlined"
            >
              +{{ item.managers.length - 3 }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGroupStore } from "@/store/group";
import { getGroups } from "@/services/groups";

export default {
  name: "GroupsList",
  setup() {
    const store = useGroupStore();
    const searchValue = ref("");
    const router = useRouter();
    const groups = ref([]);
    const loading = ref(false);

    const fetchGroups = async () => {
      try {
        loading.value = true;
        const groupsData = await getGroups();
        groups.value = groupsData;
        store.setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchGroups();
    });

    const tableHeaders = [
      { text: "Nombre", value: "name" },
      { text: "Descripción", value: "description" },
      { text: "Managers", value: "managers" },
    ];

    const groupsList = computed(() => {
      if (!groups.value) return [];
      return searchValue.value
        ? groups.value.filter((group) => {
            return group.name
              .toLowerCase()
              .includes(searchValue.value.toLowerCase());
          })
        : groups.value;
    });

    const getGroupDetail = (_, row) => {
      const group = row.item;
      store.setSelectedGroup(group);
      router.push("/groups/detail");
    };

    const createNewGroup = () => {
      router.push("/groups/new");
    };

    return {
      groups,
      searchValue,
      groupsList,
      tableHeaders,
      getGroupDetail,
      createNewGroup,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.groups-page {
  max-width: 1100px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

.new-group-btn {
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

.groups-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.groups-table :deep(tr) {
  cursor: pointer;
}

.groups-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.managers-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 0;
}
</style>
