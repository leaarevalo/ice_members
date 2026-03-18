<template>
  <div class="small-groups-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Grupos Pequeños</h1>
        <p class="page-subtitle">Gestioná tus grupos asignados y sus subgrupos</p>
      </div>
      <v-btn
        v-if="isManager || assignedGroups.length > 0"
        color="primary"
        prepend-icon="mdi-plus"
        class="new-small-group-btn"
        @click="openCreateDialog"
      >
        Nuevo grupo pequeño
      </v-btn>
    </div>

    <!-- Top Filter Section -->
    <v-card class="filter-card mb-6" variant="outlined">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="selectedParentGroup"
              :items="parentGroupOptions"
              item-title="name"
              item-value="_id"
              label="Mis Grupos"
              placeholder="Seleccionar grupo para ver sus grupos pequeños..."
              hide-details
              variant="outlined"
              prepend-inner-icon="mdi-account-group"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right text-left mt-4 mt-md-0" v-if="selectedParentGroup">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="new-small-group-btn"
              @click="openCreateDialog"
            >
              Nuevo grupo pequeño
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Small Groups Section -->
    <div class="section-container mt-8">
      <h2 class="section-title">Mis Grupos Pequeños</h2>
      
      <v-card class="search-card">
        <div class="search-wrapper">
          <v-text-field
            v-model="searchValue"
            label="Buscar grupos pequeños..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            class="search-input"
          ></v-text-field>
        </div>

        <v-data-table
          :items="filteredSmallGroups"
          :loading="loading"
          items-per-page="25"
          :headers="tableHeaders"
          class="small-groups-table"
          hover
          v-if="selectedParentGroup"
        >
          <template #item.group="{ item }">
            <v-chip size="small" variant="tonal" color="primary">
              {{ getGroupName(item.group || item.parentGroup) }}
            </v-chip>
          </template>
          
          <template #item.leaders="{ item }">
             <v-chip
              v-for="leader in item.leaders"
              :key="leader._id || leader"
              size="small"
              class="mr-1"
            >
              {{ leader.name ? leader.name + (leader.lastName ? ' ' + leader.lastName : '') : 'Responsable' }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="goToDetail(item)"
              class="mr-2"
            >
              <v-tooltip activator="parent" location="top">Ver detalle</v-tooltip>
            </v-btn>
          </template>
        </v-data-table>
        <div v-else class="text-center pa-8 text-medium-emphasis">
          Seleccioná un grupo de la lista superior para ver sus grupos pequeños.
        </div>
      </v-card>
    </div>

    <!-- Create Dialog -->
    <v-dialog v-model="createDialog" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="dialog-title">
          Nuevo Grupo Pequeño
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              v-model="newSmallGroup.name"
              label="Nombre"
              :rules="[v => !!v || 'El nombre es obligatorio']"
              variant="outlined"
              required
            ></v-text-field>

            <v-textarea
              v-model="newSmallGroup.description"
              label="Descripción"
              variant="outlined"
              rows="3"
            ></v-textarea>

            <v-autocomplete
              v-model="newSmallGroup.parentGroup"
              :items="parentGroupOptions"
              item-title="name"
              item-value="_id"
              label="Grupo Padre"
              :rules="[v => !!v || 'Debe seleccionar un grupo padre']"
              variant="outlined"
              required
              readonly
            ></v-autocomplete>

            <v-autocomplete
              v-model="newSmallGroup.leaders"
              :items="availableCollaboratorsForNewGroup"
              :item-title="getMemberLabel"
              item-value="document"
              label="Colaborador a cargo"
              variant="outlined"
              multiple
              chips
              closable-chips
              placeholder="Asignale un colaborador del grupo padre..."
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn variant="text" color="secondary" @click="closeCreateDialog">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" :disabled="!isFormValid" @click="saveSmallGroup">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMemberStore } from "@/store/member";
import { useSmallGroupStore } from "@/store/smallGroup";
import { getSmallGroups, getSmallGroupsByGroup, createSmallGroup, updateSmallGroup } from "@/services/smallGroups";
import { getGroups } from "@/services/groups";
import { getMembers } from "@/services/members";
import { useRouter } from "vue-router";

export default {
  name: "SmallGroupsView",
  setup() {
    const store = useMemberStore();
    const sgStore = useSmallGroupStore();
    const router = useRouter();
    const smallGroups = ref([]);
    const allGroups = ref([]); // To map parent group IDs to names
    const allMembersList = ref([]); 
    const loading = ref(false);
    const searchValue = ref("");
    const selectedParentGroup = ref(null);

    const isManager = store.isManager;
    const isLider = store.isLider;
    
    // Create form state
    const createDialog = ref(false);
    const saving = ref(false);
    const isFormValid = ref(false);
    const form = ref(null);
    const newSmallGroup = ref({
      name: "",
      description: "",
      parentGroup: null,
      leaders: [],
    });
    
    // In VueX/Pinia getters, if an object has full group definitions it returns full objects.
    const assignedGroups = computed(() => store.getAssignedGroups);

    const getGroupName = (groupField) => {
      if (!groupField) return 'Desconocido';
      if (typeof groupField === 'object' && groupField.name) return groupField.name;
      
      const groupId = groupField._id || groupField;
      const g = allGroups.value.find(group => group._id === groupId);
      if (g) return g.name;
      // Also try to find it in assignedGroups if full object
      const ag = assignedGroups.value.find(group => group._id === groupId);
      if (ag) return ag.name;
      return 'Desconocido';
    };

    const fetchAllData = async () => {
      loading.value = true;
      try {
        const [allGrps, members] = await Promise.all([
          getGroups(),
          getMembers(),
        ]);
        allGroups.value = allGrps;
        allMembersList.value = members;

        if (isManager && !isLider) {
          // Admin can see everything
          smallGroups.value = await getSmallGroups();
        } else if (assignedGroups.value.length > 0) {
          // Lider fetches only for assigned groups
          let fetchedGroups = [];
          for (let group of assignedGroups.value) {
            const groupId = group._id || group;
            const res = await getSmallGroupsByGroup(groupId);
            fetchedGroups.push(...res);
          }
          smallGroups.value = fetchedGroups;
        }
      } catch (error) {
        console.error("Error fetching small groups data:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchAllData();
    });

    const tableHeaders = [
      { title: "Nombre", key: "name", sortable: true },
      { title: "Descripción", key: "description", sortable: false },
      { title: "Grupo Padre", key: "group", sortable: false },
      { title: "Responsable(s)", key: "leaders", sortable: false },
      { title: "Acciones", key: "actions", sortable: false, align: "end" },
    ];

    const filteredSmallGroups = computed(() => {
      let filtered = smallGroups.value;
      
      if (selectedParentGroup.value) {
        filtered = filtered.filter(sg => {
          const sgGroupId = sg.group?._id || sg.group;
          const sgParentId = sg.parentGroup?._id || sg.parentGroup;
          return sgGroupId === selectedParentGroup.value || sgParentId === selectedParentGroup.value;
        });
      } else {
        return [];
      }

      if (searchValue.value) {
        const lowerSearch = searchValue.value.toLowerCase();
        filtered = filtered.filter((sg) => {
          return sg.name?.toLowerCase().includes(lowerSearch) ||
                 sg.description?.toLowerCase().includes(lowerSearch);
        });
      }
      return filtered;
    });

    const parentGroupOptions = computed(() => {
      if (isManager && !isLider) {
        return allGroups.value;
      }
      return assignedGroups.value;
    });

    const availableCollaboratorsForNewGroup = computed(() => {
      if (!newSmallGroup.value.parentGroup) return [];
      const parentGrpId = newSmallGroup.value.parentGroup;
      const groupData = allGroups.value.find(g => g._id === parentGrpId);
      return groupData ? (groupData.collaborators || []) : [];
    });

    const getMemberLabel = (member) => {
      if (typeof member === 'string') {
        const found = allMembersList.value.find(m => m.document === member || m.username === member || m._id === member);
        if (found) return `${found.name} ${found.lastName || ""}`.trim();
        return member;
      }
      return `${member.name} ${member.lastName || ""}`.trim();
    };

    const openCreateDialog = () => {
      newSmallGroup.value = { 
        name: "", 
        description: "", 
        parentGroup: selectedParentGroup.value || null,
        leaders: [],
      };
      if (form.value) form.value.resetValidation();
      createDialog.value = true;
    };

    const goToDetail = (item) => {
      sgStore.setSelectedSmallGroup(item);
      router.push("/small-groups/detail");
    };

    const closeCreateDialog = () => {
      createDialog.value = false;
    };

    const saveSmallGroup = async () => {
      if (!isFormValid.value) return;
      try {
        saving.value = true;
        const payload = {
          name: newSmallGroup.value.name,
          description: newSmallGroup.value.description,
          group: newSmallGroup.value.parentGroup, 
          leaders: newSmallGroup.value.leaders, // string arrays
        };

        await createSmallGroup(payload);

        closeCreateDialog();
        await fetchAllData(); 
      } catch (error) {
        console.error("Error saving small group:", error);
      } finally {
        saving.value = false;
      }
    };

    return {
      assignedGroups,
      smallGroups,
      filteredSmallGroups,
      searchValue,
      selectedParentGroup,
      loading,
      tableHeaders,
      getGroupName,
      createDialog,
      saving,
      isFormValid,
      form,
      newSmallGroup,
      parentGroupOptions,
      allMembersList,
      getMemberLabel,
      availableCollaboratorsForNewGroup,
      openCreateDialog,
      goToDetail,
      closeCreateDialog,
      saveSmallGroup,
      isManager,
    };
  },
};
</script>

<style lang="scss" scoped>
.small-groups-page {
  max-width: 1100px;
}

.page-header {
  margin-bottom: 32px;
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

.section-container {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A1918;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.group-card {
  border-color: rgba(0, 0, 0, 0.08) !important;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--v-primary-base) !important;
    background-color: rgba(217, 119, 6, 0.02);
  }
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

.small-groups-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.small-groups-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.new-small-group-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
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
