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
        <v-card class="stat-card">
          <div class="stat-icon-wrapper">
            <v-icon size="24" color="primary">mdi-account-group</v-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ membersCount }}</span>
            <span class="stat-label">Miembros registrados</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cronograma Section -->
    <v-card class="cronograma-card">
      <div class="cronograma-header">
        <v-icon size="20" color="primary" class="mr-2">mdi-calendar-month</v-icon>
        <h2 class="cronograma-title">Cronograma</h2>
      </div>
      <div class="cronograma-image-wrapper">
        <img class="cronograma-image" src="../../public/cronograma.jpeg" alt="Cronograma" />
      </div>
    </v-card>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useMemberStore } from "@/store/member";

export default {
  name: "HomePage",
  setup() {
    const store = useMemberStore();
    onMounted(async () => {});
    const membersCount = computed(() => store.getMembersCount);
    const userName = computed(() => {
      const user = store.getUser;
      return user?.name || user?.username || "Usuario";
    });
    return { membersCount, userName };
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

.cronograma-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.cronograma-header {
  display: flex;
  align-items: center;
  padding: 18px 24px 0;
}

.cronograma-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1A1918;
  margin: 0;
}

.cronograma-image-wrapper {
  padding: 16px 24px 24px;
}

.cronograma-image {
  width: 100%;
  max-width: 560px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
}
</style>
