<template>
  <div class="managers-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Administración de Líderes</h1>
        <p class="page-subtitle">Gestioná los roles y los grupos asignados</p>
      </div>
    </div>

    <v-card class="search-card">
      <div class="search-wrapper">
        <v-text-field
          v-model="searchValue"
          label="Buscar por nombre o usuario..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          class="search-input"
        ></v-text-field>
      </div>

      <v-data-table
        :items="filteredManagers"
        :loading="loading"
        items-per-page="25"
        item-value="id"
        :headers="tableHeaders"
        class="managers-table"
        hover
      >
        <template #item.role="{ item }">
          <v-chip :color="getRoleColor(item.role)" size="small" class="text-uppercase" font-weight-bold>
            {{ item.role }}
          </v-chip>
        </template>
        
        <template #item.assignedGroups="{ item }">
           <div class="groups-chips">
            <v-chip
              v-for="group in (item.assignedGroups || []).slice(0, 2)"
              :key="group._id"
              size="small"
              color="primary"
              variant="tonal"
              class="mr-1"
            >
              {{ group.name }}
            </v-chip>
            <v-chip
              v-if="(item.assignedGroups || []).length > 2"
              size="small"
              variant="outlined"
            >
              +{{ item.assignedGroups.length - 2 }}
            </v-chip>
            <span v-if="!(item.assignedGroups || []).length" class="text-caption text-grey">Ninguno</span>
          </div>
        </template>
        
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="small"
            color="primary"
            @click="openEditDialog(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">
          Editar {{ selectedManager?.username }}
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="editRole"
            :items="roleOptions"
            label="Rol del Usuario"
            variant="outlined"
          ></v-select>

          <v-autocomplete
            v-if="editRole === 'lider' || editRole === 'manager'"
            v-model="editGroups"
            :items="availableGroups"
            item-title="name"
            item-value="_id"
            label="Grupos Asignados"
            multiple
            chips
            closable-chips
            variant="outlined"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="text" color="secondary" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveManager">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getManagers, updateManager } from "@/services/managers";
import { getGroups } from "@/services/groups";
import { getMembers } from "@/services/members";

export default {
  name: "ManagersList",
  setup() {
    const managers = ref([]);
    const availableGroups = ref([]);
    const searchValue = ref("");
    const loading = ref(false);
    
    // Dialog state
    const dialog = ref(false);
    const saving = ref(false);
    const selectedManager = ref(null);
    const editRole = ref("");
    const editGroups = ref([]);
    
    const roleOptions = [
      { title: "Manager", value: "manager" },
      { title: "Líder", value: "lider" },
      { title: "User", value: "user" },
      { title: "Consejero", value: "counselor" }
    ];

    const fetchManagers = async () => {
      try {
        loading.value = true;
        const [authManagers, allMembers] = await Promise.all([
          getManagers(),
          getMembers()
        ]);
        
        managers.value = authManagers.map(manager => {
          const memberInfo = allMembers.find(m => String(m.document) === String(manager.username));
          return {
            ...manager,
            document: memberInfo?.document || manager.username,
            name: memberInfo?.name || "Desconocido",
            lastName: memberInfo?.lastName || ""
          };
        });
      } catch (error) {
        console.error("Error fetching leaders:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchGroups = async () => {
      try {
        const groupsData = await getGroups();
        availableGroups.value = groupsData;
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    onMounted(() => {
      fetchManagers();
      fetchGroups();
    });

    const tableHeaders = [
      { text: "DNI", value: "document" },
      { text: "Nombre", value: "name" },
      { text: "Apellido", value: "lastName" },
      { text: "Usuario", value: "username" },
      { text: "Rol", value: "role" },
      { text: "Grupos Asignados", value: "assignedGroups" },
      { text: "Acciones", value: "actions", sortable: false, align: "end" },
    ];

    const filteredManagers = computed(() => {
      if (!searchValue.value) return managers.value;
      const lowerSearch = searchValue.value.toLowerCase();
      return managers.value.filter((m) => {
        const dStr = m.document ? String(m.document).toLowerCase() : "";
        const uStr = m.username ? m.username.toLowerCase() : "";
        const nStr = m.name ? m.name.toLowerCase() : "";
        const lnStr = m.lastName ? m.lastName.toLowerCase() : "";
        
        return uStr.includes(lowerSearch) || 
               nStr.includes(lowerSearch) || 
               lnStr.includes(lowerSearch) || 
               dStr.includes(lowerSearch);
      });
    });

    const getRoleColor = (role) => {
      const colors = {
        manager: "primary",
        lider: "info",
        counselor: "success",
        user: "grey"
      };
      return colors[role] || "grey";
    };

    const openEditDialog = (manager) => {
      selectedManager.value = manager;
      editRole.value = manager.role;
      editGroups.value = (manager.assignedGroups || []).map(g => g._id || g);
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      selectedManager.value = null;
      editRole.value = "";
      editGroups.value = [];
    };

    const saveManager = async () => {
      if (!selectedManager.value) return;
      try {
        saving.value = true;
        const managerId = selectedManager.value.id || selectedManager.value._id;
        
        const updateData = {
          role: editRole.value,
          assignedGroups: editGroups.value
        };
        
        await updateManager(managerId, updateData);
        await fetchManagers(); // Refresh list to get populated groups
        closeDialog();
      } catch (error) {
        console.error("Error updating manager:", error);
      } finally {
        saving.value = false;
      }
    };

    return {
      managers,
      availableGroups,
      searchValue,
      filteredManagers,
      tableHeaders,
      loading,
      getRoleColor,
      dialog,
      saving,
      selectedManager,
      editRole,
      editGroups,
      roleOptions,
      openEditDialog,
      closeDialog,
      saveManager,
    };
  },
};
</script>

<style lang="scss" scoped>
.managers-page {
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

.managers-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.managers-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.groups-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 0;
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
}
</style>
