<template>
  <div class="home-page">
    <!-- Welcome Header -->
    <div class="welcome-section">
      <h1 class="welcome-title">
        Bienvenido, <span class="welcome-name">{{ userName }}</span>
      </h1>
      <p class="welcome-subtitle">Iglesia de Cristo — Panel de administración</p>
    </div>

    <!-- Stats Cards -->
    <v-row class="stats-row">
      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card" @click="$router.push('/members')" style="cursor: pointer;">
          <div class="stat-icon-wrapper">
            <v-icon size="24" color="primary">mdi-account-group</v-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ membersCount }}</span>
            <span class="stat-label">Miembros registrados</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card" @click="$router.push('/groups')" style="cursor: pointer;">
          <div class="stat-icon-wrapper stat-icon-groups">
            <v-icon size="24" color="#7C3AED">mdi-account-supervisor-outline</v-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ groupsCount }}</span>
            <span class="stat-label">Grupos registrados</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useMemberStore } from "@/store/member";
import { useGroupStore } from "@/store/group";
import { getMembers } from "@/services/members";
import { getGroups } from "@/services/groups";

export default {
  name: "HomePage",
  setup() {
    const memberStore = useMemberStore();
    const groupStore = useGroupStore();
    const membersCount = ref(0);
    const groupsCount = ref(0);

    onMounted(async () => {
      try {
        const members = await getMembers();
        memberStore.setMembers(members);
        membersCount.value = members.length;
      } catch (e) {
        membersCount.value = memberStore.getMembersCount;
      }
      try {
        const groups = await getGroups();
        groupStore.setGroups(groups);
        groupsCount.value = groups.length;
      } catch (e) {
        groupsCount.value = groupStore.getGroupsCount;
      }
    });

    const userName = computed(() => {
      const user = memberStore.getUser;
      return user?.name || user?.username || "Usuario";
    });

    return { membersCount, groupsCount, userName };
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 900px;
}

.welcome-section {
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1A1918;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.welcome-name {
  color: #D97706;
}

.welcome-subtitle {
  font-size: 0.95rem;
  color: #6B6560;
  margin: 0;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    transform: translateY(-1px);
  }
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(217, 119, 6, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-groups {
  background: rgba(124, 58, 237, 0.1);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1918;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.82rem;
  color: #6B6560;
}
</style>
