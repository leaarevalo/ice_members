<template>
  <div class="form-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Crear grupo</h1>
        <p class="page-subtitle">Completá los datos del nuevo grupo</p>
      </div>
    </div>

    <v-card class="form-card">
      <v-form ref="form">
        <v-container class="form-container">
          <!-- Nombre -->
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="group.name"
                label="Nombre del grupo"
                prepend-inner-icon="mdi-account-group-outline"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Descripción -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="group.description"
                label="Descripción"
                prepend-inner-icon="mdi-text-box-outline"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Managers -->
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="group.managers"
                :items="membersList"
                :item-title="getMemberLabel"
                item-value="_id"
                label="Managers (responsables)"
                prepend-inner-icon="mdi-account-supervisor-outline"
                multiple
                chips
                closable-chips
                :loading="loadingMembers"
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>

        <!-- Action Buttons -->
        <div class="form-actions">
          <v-btn variant="outlined" color="secondary" @click="goBack" prepend-icon="mdi-arrow-left">
            Volver
          </v-btn>
          <v-btn color="primary" @click="saveGroup" prepend-icon="mdi-content-save-outline">
            Guardar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { createGroup } from "@/services/groups";
import { getMembers } from "@/services/members";
import { useGroupStore } from "@/store/group";
import { useRouter } from "vue-router";

export default {
  name: "CreateGroup",
  setup() {
    const router = useRouter();
    const store = useGroupStore();
    const membersList = ref([]);
    const loadingMembers = ref(false);

    const group = ref({
      name: "",
      description: "",
      managers: [],
    });

    const fetchMembers = async () => {
      try {
        loadingMembers.value = true;
        membersList.value = await getMembers();
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        loadingMembers.value = false;
      }
    };

    onMounted(() => {
      fetchMembers();
    });

    const getMemberLabel = (member) => {
      return `${member.name} ${member.lastName || ""}`.trim();
    };

    const saveGroup = async () => {
      try {
        const newGroup = {
          ...group.value,
          managers: group.value.managers.map((m) => m._id),
        };
        const response = await createGroup(newGroup);
        store.addNewGroup(response);
        router.push("/groups");
      } catch (err) {
        console.error("Error creating group:", err);
      }
    };

    const goBack = () => {
      window.history.back();
    };

    return {
      group,
      membersList,
      loadingMembers,
      getMemberLabel,
      saveGroup,
      goBack,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-page {
  max-width: 900px;
}

.page-header {
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

.form-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
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
</style>
