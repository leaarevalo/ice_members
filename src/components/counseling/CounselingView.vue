<template>
  <div class="counseling-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Consejería</h1>
        <p class="page-subtitle">Historial de consejería por miembro</p>
      </div>
    </div>

    <div class="counseling-layout">
      <!-- Left Panel: Members List -->
      <v-card class="members-panel">
        <div class="panel-header">
          <v-text-field
            v-model="searchValue"
            label="Buscar miembro..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            density="compact"
          ></v-text-field>
        </div>

        <v-list class="members-list" density="compact" nav>
          <v-list-item
            v-for="member in filteredMembers"
            :key="member._id"
            :active="selectedMember?._id === member._id"
            @click="selectMember(member)"
            rounded="lg"
            class="member-item"
          >
            <template v-slot:prepend>
              <v-avatar size="32" color="#D97706">
                <span class="text-white text-caption font-weight-bold">
                  {{ member.name?.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="member-name">
              {{ member.name }} {{ member.lastName }}
            </v-list-item-title>
          </v-list-item>

          <div v-if="filteredMembers.length === 0 && !loadingMembers" class="no-results">
            <v-icon color="#8A857E" size="32">mdi-account-search-outline</v-icon>
            <span>No se encontraron miembros</span>
          </div>
        </v-list>
      </v-card>

      <!-- Right Panel: History -->
      <div class="history-panel">
        <!-- No member selected -->
        <v-card v-if="!selectedMember" class="empty-state">
          <v-icon color="#B8B4AC" size="64">mdi-notebook-outline</v-icon>
          <p class="empty-text">Seleccioná un miembro para ver su historial</p>
        </v-card>

        <!-- Member selected -->
        <template v-else>
          <!-- Selected member header -->
          <v-card class="selected-header">
            <div class="selected-info">
              <v-avatar size="40" color="#D97706">
                <span class="text-white font-weight-bold">
                  {{ selectedMember.name?.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
              <div>
                <h3 class="selected-name">{{ selectedMember.name }} {{ selectedMember.lastName }}</h3>
                <span class="selected-meta">{{ selectedMember.email }}</span>
              </div>
            </div>
          </v-card>

          <!-- New entry form -->
          <v-card class="new-entry-card">
            <h4 class="section-title">Nueva entrada</h4>
            <v-textarea
              v-model="newContent"
              label="Escribí el contenido de la sesión..."
              prepend-inner-icon="mdi-note-edit-outline"
              rows="3"
              hide-details
            ></v-textarea>
            <div class="new-entry-actions">
              <v-btn
                color="primary"
                :disabled="!newContent.trim()"
                :loading="saving"
                prepend-icon="mdi-content-save-outline"
                @click="saveEntry"
              >
                Guardar entrada
              </v-btn>
            </div>
          </v-card>

          <!-- History entries -->
          <v-card class="history-card">
            <h4 class="section-title">Historial</h4>

            <div v-if="loadingHistory" class="loading-state">
              <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
            </div>

            <div v-else-if="history.length === 0" class="no-history">
              <v-icon color="#B8B4AC" size="40">mdi-text-box-remove-outline</v-icon>
              <span>Sin registros de consejería</span>
            </div>

            <div v-else class="history-timeline">
              <div
                v-for="entry in history"
                :key="entry._id"
                class="history-entry"
              >
                <div class="entry-date">
                  <v-icon size="16" color="#D97706">mdi-calendar-outline</v-icon>
                  {{ formatDate(entry.createdAt) }}
                </div>
                <p class="entry-content">{{ entry.content }}</p>
              </div>
            </div>
          </v-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getMembers } from "@/services/members";
import { getHistoryByUser, createHistory } from "@/services/counseling";

export default {
  name: "CounselingView",
  setup() {
    const searchValue = ref("");
    const members = ref([]);
    const loadingMembers = ref(false);
    const selectedMember = ref(null);
    const history = ref([]);
    const loadingHistory = ref(false);
    const newContent = ref("");
    const saving = ref(false);

    const fetchMembers = async () => {
      try {
        loadingMembers.value = true;
        members.value = await getMembers();
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        loadingMembers.value = false;
      }
    };

    onMounted(() => {
      fetchMembers();
    });

    const filteredMembers = computed(() => {
      if (!members.value) return [];
      if (!searchValue.value) return members.value;
      const search = searchValue.value.toLowerCase();
      return members.value.filter((m) => {
        const fullName = `${m.name} ${m.lastName || ""}`.toLowerCase();
        return fullName.includes(search);
      });
    });

    const selectMember = async (member) => {
      selectedMember.value = member;
      newContent.value = "";
      await fetchHistory(member._id);
    };

    const fetchHistory = async (userId) => {
      try {
        loadingHistory.value = true;
        history.value = await getHistoryByUser(userId);
      } catch (error) {
        console.error("Error fetching history:", error);
        history.value = [];
      } finally {
        loadingHistory.value = false;
      }
    };

    const saveEntry = async () => {
      if (!newContent.value.trim() || !selectedMember.value) return;
      try {
        saving.value = true;
        const entry = await createHistory(selectedMember.value._id, newContent.value);
        history.value.unshift(entry);
        newContent.value = "";
      } catch (error) {
        console.error("Error creating history entry:", error);
      } finally {
        saving.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return {
      searchValue,
      members,
      loadingMembers,
      filteredMembers,
      selectedMember,
      selectMember,
      history,
      loadingHistory,
      newContent,
      saving,
      saveEntry,
      formatDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.counseling-page {
  max-width: 1200px;
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

/* Layout */
.counseling-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Left panel */
.members-panel {
  width: 300px;
  min-width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  max-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px 16px 8px;
}

.members-list {
  overflow-y: auto;
  flex: 1;
  padding: 4px 8px !important;
  background: transparent !important;
}

.member-item {
  margin-bottom: 2px;

  &.v-list-item--active {
    background-color: rgba(217, 119, 6, 0.08) !important;
    color: #D97706 !important;
  }
}

.member-name {
  font-size: 0.85rem;
  font-weight: 500;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: #8A857E;
  font-size: 0.85rem;
}

/* Right panel */
.history-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 40px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.empty-text {
  color: #8A857E;
  font-size: 0.95rem;
}

.selected-header {
  padding: 16px 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1A1918;
  margin: 0;
}

.selected-meta {
  font-size: 0.8rem;
  color: #8A857E;
}

.new-entry-card,
.history-card {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6B6560;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.new-entry-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;

  .v-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 32px;
}

.no-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: #8A857E;
  font-size: 0.85rem;
}

/* Timeline */
.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-entry {
  padding: 16px;
  background: #F5F3EF;
  border-radius: 12px;
  border-left: 3px solid #D97706;
}

.entry-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #8A857E;
  margin-bottom: 8px;
}

.entry-content {
  font-size: 0.9rem;
  color: #1A1918;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
}
</style>
