<template>
  <div class="content px-10 pt-10 pb-6 w-100 h-100">
    <div class="page-header mb-8">
      <div>
        <h1 class="page-title">Detalle del grupo pequeño</h1>
        <p class="page-subtitle">Visualizá y editá la información del subgrupo</p>
      </div>
    </div>

    <!-- MAIN FORM CARD -->
    <v-card class="elevation-1 table-card p-4 mx-auto" max-width="800" rounded="xl" v-if="smallGroupDetail">
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" class="mt-4">
          
          <v-text-field
            v-model="smallGroupDetail.name"
            label="Nombre del grupo pequeño"
            variant="outlined"
            class="mb-6"
            :rules="[v => !!v || 'El nombre es obligatorio']"
            required
            prepend-inner-icon="mdi-account-group"
          ></v-text-field>

          <v-textarea
            v-model="smallGroupDetail.description"
            label="Descripción"
            variant="outlined"
            class="mb-6"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-text-box-outline"
          ></v-textarea>

          <v-divider class="mb-6"></v-divider>

          <div v-if="loadingData" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-2 text-medium-emphasis">Cargando responsables y participantes...</p>
          </div>
          
          <div v-else>
            <h3 class="text-h6 mb-4">Integrantes</h3>
            
            <v-autocomplete
              v-model="smallGroupDetail.leaders"
              :items="parentGroupCollaborators"
              :item-title="getMemberLabel"
              item-value="document"
              label="Responsable(s)"
              variant="outlined"
              multiple
              chips
              closable-chips
              class="mb-6"
              prepend-inner-icon="mdi-account-star-outline"
              placeholder="Asignale un colaborador del grupo padre"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" color="primary" variant="flat">
                  {{ item.raw.name }} {{ item.raw.lastName || "" }}
                </v-chip>
              </template>
            </v-autocomplete>

            <v-autocomplete
              v-model="smallGroupDetail.participants"
              :items="allMembersList"
              :item-title="getMemberLabel"
              item-value="document"
              label="Participantes"
              variant="outlined"
              multiple
              chips
              closable-chips
              class="mb-4"
              prepend-inner-icon="mdi-account-multiple-outline"
              placeholder="Añade participantes registrados"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" color="secondary" variant="flat">
                  {{ item.raw.name }} {{ item.raw.lastName || "" }}
                </v-chip>
              </template>
            </v-autocomplete>
          </div>
          
        </v-form>
      </v-card-text>

      <!-- CARD ACTIONS -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4 bg-grey-lighten-4 justify-end rounded-b-xl">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="px-6 mr-3 text-none"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Volver
        </v-btn>
        <v-btn
          color="warning"
          variant="elevated"
          class="px-6 text-none"
          prepend-icon="mdi-content-save"
          :disabled="!isFormValid || loadingData"
          @click="saveSmallGroupInformation"
        >
          Guardar cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { updateSmallGroup } from "@/services/smallGroups";
import { getMembers } from "@/services/members";
import { getGroups } from "@/services/groups";
import { useSmallGroupStore } from "@/store/smallGroup";
import { useRouter } from "vue-router";

export default {
  name: "SmallGroupDetail",
  setup() {
    const router = useRouter();
    const store = useSmallGroupStore();
    
    // Safety check - redirect if accessed directly without selection
    if (!store.getSelectedSmallGroup) {
      router.push("/small-groups");
      return;
    }

    // Clone the state so we can edit it without polluting the store instantly
    const smallGroupDetail = ref({ ...store.getSelectedSmallGroup });
    const isFormValid = ref(false);
    
    const allMembersList = ref([]);
    const parentGroupCollaborators = ref([]);
    const loadingData = ref(false);

    const fetchData = async () => {
      loadingData.value = true;
      try {
        const [members, groups] = await Promise.all([
          getMembers(),
          getGroups()
        ]);
        
        allMembersList.value = members;
        
        // Find parent group to populate available collaborators
        const parentId = typeof smallGroupDetail.value.group === 'object' 
          ? smallGroupDetail.value.group._id 
          : smallGroupDetail.value.group;
        
        const parentGrp = groups.find(g => g._id === parentId);
        
        // Parent Collaborators
        if (parentGrp && parentGrp.collaborators) {
           parentGroupCollaborators.value = members.filter(m => 
             parentGrp.collaborators.some(collab => 
                (typeof collab === 'object' && collab._id === m._id) || 
                (collab === m._id || collab === m.document || collab === m.username)
             )
           );
        }

        // Map existing Leaders
        if (smallGroupDetail.value.leaders && Array.isArray(smallGroupDetail.value.leaders)) {
          smallGroupDetail.value.leaders = smallGroupDetail.value.leaders.map((m) => {
            const idToMatch = typeof m === "object" && m !== null ? String(m.document || m.username || m._id) : String(m);
            const found = allMembersList.value.find(member => String(member.document) === idToMatch || String(member.username) === idToMatch || String(member._id) === idToMatch);
            return found || m;
          });
        }

        // Map existing Participants
        if (smallGroupDetail.value.participants && Array.isArray(smallGroupDetail.value.participants)) {
          smallGroupDetail.value.participants = smallGroupDetail.value.participants.map((m) => {
            const idToMatch = typeof m === "object" && m !== null ? String(m.document || m.username || m._id) : String(m);
            const found = allMembersList.value.find(member => String(member.document) === idToMatch || String(member.username) === idToMatch || String(member._id) === idToMatch);
            return found || m;
          });
        }
      } catch (error) {
        console.error("Error fetching dependencies:", error);
      } finally {
        loadingData.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    const getMemberLabel = (member) => {
      if (typeof member === 'string') {
        const found = allMembersList.value.find(m => m.document === member || m.username === member || m._id === member);
        if (found) return `${found.name} ${found.lastName || ""}`.trim();
        return member;
      }
      return `${member.name} ${member.lastName || ""}`.trim();
    };

    const saveSmallGroupInformation = async () => {
      try {
        const payload = {
          ...smallGroupDetail.value,
          group: typeof smallGroupDetail.value.group === 'object' ? smallGroupDetail.value.group._id : smallGroupDetail.value.group,
          leaders: (smallGroupDetail.value.leaders || []).map((m) =>
            typeof m === "object" && m !== null ? String(m.document || m.username || m._id) : String(m)
          ),
          participants: (smallGroupDetail.value.participants || []).map((m) =>
            typeof m === "object" && m !== null ? String(m.document || m.username || m._id) : String(m)
          ),
        };
        const response = await updateSmallGroup(payload);
        store.updateSmallGroup(response);
        router.push("/small-groups");
      } catch (err) {
        console.error("Error updating small group:", err);
      }
    };

    const goBack = () => {
      store.setSelectedSmallGroup(null);
      window.history.back();
    };

    return {
      smallGroupDetail,
      isFormValid,
      allMembersList,
      parentGroupCollaborators,
      loadingData,
      getMemberLabel,
      saveSmallGroupInformation,
      goBack,
    };
  },
};
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}
.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-top: 4px;
}

.table-card {
  border-radius: 16px !important;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
}
</style>
