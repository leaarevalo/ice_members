<template>
  <div class="home-page">
    <!-- Welcome Header -->
    <div class="welcome-section">
      <h1 class="welcome-title">
        Bienvenido, <span class="welcome-name">{{ userName }}</span>
      </h1>
      <p class="welcome-subtitle">{{ isUser ? 'IDC Centro — Portal del miembro' : isLider ? 'IDC Centro — Panel del líder' : 'IDC Centro — Panel de administración' }}</p>
    </div>

    <!-- User role: welcome & explanation -->
    <template v-if="isUser">
      <v-card class="welcome-card mb-6">
        <div class="welcome-card-content">
          <v-icon size="40" color="primary" class="mb-3">mdi-hand-wave-outline</v-icon>
          <h2 class="welcome-card-title">Bienvenido al portal de IDC Centro</h2>
          <p class="welcome-card-text">
            Este es tu espacio personal dentro de la comunidad. Desde aquí podés acceder a las diferentes secciones disponibles para vos.
          </p>
        </div>
      </v-card>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card class="feature-card" @click="$router.push('/groups')" style="cursor: pointer;">
            <div class="feature-icon-wrapper">
              <v-icon size="28" color="primary">mdi-account-supervisor-outline</v-icon>
            </div>
            <h3 class="feature-title">Grupos</h3>
            <p class="feature-desc">Consultá los grupos de los que formás parte y sus integrantes.</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card class="feature-card" @click="$router.push('/small-groups')" style="cursor: pointer;">
            <div class="feature-icon-wrapper feature-icon-small-groups">
              <v-icon size="28" color="#7C3AED">mdi-account-group</v-icon>
            </div>
            <h3 class="feature-title">Grupos Pequeños</h3>
            <p class="feature-desc">Accedé a la información de tus grupos pequeños y participantes.</p>
          </v-card>
        </v-col>
        <v-col v-if="isStudent" cols="12" sm="6" md="4">
          <v-card class="feature-card" @click="$router.push('/schools')" style="cursor: pointer;">
            <div class="feature-icon-wrapper feature-icon-schools">
              <v-icon size="28" color="#059669">mdi-school-outline</v-icon>
            </div>
            <h3 class="feature-title">Mis Inscripciones</h3>
            <p class="feature-desc">Revisá tus módulos, subí entregas y seguí tu progreso académico.</p>
          </v-card>
        </v-col>
        <v-col v-if="isProfessor" cols="12" sm="6" md="4">
          <v-card class="feature-card" @click="$router.push('/professor')" style="cursor: pointer;">
            <div class="feature-icon-wrapper feature-icon-professor">
              <v-icon size="28" color="#2563EB">mdi-human-male-board</v-icon>
            </div>
            <h3 class="feature-title">Mis Módulos</h3>
            <p class="feature-desc">Gestioná los módulos donde sos profesor, revisá entregas y calificá.</p>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Lider: groups, small groups, professor modules -->
    <template v-else-if="isLider">
      <v-progress-linear v-if="liderLoading" indeterminate color="primary" class="mb-4"></v-progress-linear>

      <!-- Stats row -->
      <v-row class="stats-row">
        <v-col cols="12" sm="4">
          <v-card class="stat-card" @click="$router.push('/groups')" style="cursor: pointer;">
            <div class="stat-icon-wrapper">
              <v-icon size="24" color="primary">mdi-account-supervisor-outline</v-icon>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ liderGroups.length }}</span>
              <span class="stat-label">{{ liderGroups.length === 1 ? 'Grupo asignado' : 'Grupos asignados' }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="stat-card" @click="$router.push('/small-groups')" style="cursor: pointer;">
            <div class="stat-icon-wrapper stat-icon-groups">
              <v-icon size="24" color="#7C3AED">mdi-account-group</v-icon>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ liderSmallGroups.length }}</span>
              <span class="stat-label">Grupos pequeños</span>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="isProfessor" cols="12" sm="4">
          <v-card class="stat-card" @click="$router.push('/professor')" style="cursor: pointer;">
            <div class="stat-icon-wrapper stat-icon-modules">
              <v-icon size="24" color="#2563EB">mdi-human-male-board</v-icon>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ liderModules.length }}</span>
              <span class="stat-label">{{ liderModules.length === 1 ? 'Módulo como profesor' : 'Módulos como profesor' }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Groups detail -->
      <div class="section-header">
        <h2 class="section-title">Mis Grupos</h2>
      </div>
      <v-row class="mb-6">
        <v-col v-for="group in liderGroups" :key="group._id" cols="12" sm="6" md="4">
          <v-card class="detail-card" @click="$router.push('/groups')" style="cursor: pointer;">
            <div class="detail-card-header">
              <v-icon size="20" color="primary" class="mr-2">mdi-account-supervisor-outline</v-icon>
              <span class="detail-card-name">{{ group.name }}</span>
            </div>
            <p v-if="group.description" class="detail-card-desc">{{ group.description }}</p>
            <div class="detail-card-meta">
              <v-chip size="x-small" variant="tonal" color="primary">
                {{ (group.collaborators?.length || 0) }} colaboradores
              </v-chip>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="!liderLoading && !liderGroups.length" cols="12">
          <p class="text-medium-emphasis">No tenés grupos asignados.</p>
        </v-col>
      </v-row>

      <!-- Small groups detail -->
      <div class="section-header">
        <h2 class="section-title">Grupos Pequeños</h2>
      </div>
      <v-row class="mb-6">
        <v-col v-for="sg in liderSmallGroups" :key="sg._id" cols="12" sm="6" md="4">
          <v-card class="detail-card" @click="$router.push('/small-groups')" style="cursor: pointer;">
            <div class="detail-card-header">
              <v-icon size="20" color="#7C3AED" class="mr-2">mdi-account-group</v-icon>
              <span class="detail-card-name">{{ sg.name }}</span>
            </div>
            <p v-if="sg.description" class="detail-card-desc">{{ sg.description }}</p>
            <div class="detail-card-meta">
              <v-chip size="x-small" variant="tonal" color="deep-purple">
                {{ (sg.participants?.length || 0) }} participantes
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="secondary" class="ml-1">
                {{ (sg.leaders?.length || 0) }} líderes
              </v-chip>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="!liderLoading && !liderSmallGroups.length" cols="12">
          <p class="text-medium-emphasis">No hay grupos pequeños en tus grupos.</p>
        </v-col>
      </v-row>

      <!-- Professor modules -->
      <template v-if="isProfessor">
        <div class="section-header">
          <h2 class="section-title">Módulos como Profesor</h2>
        </div>
        <v-row class="mb-6">
          <v-col v-for="mod in liderModules" :key="mod._id" cols="12" sm="6" md="4">
            <v-card class="detail-card" @click="$router.push('/professor')" style="cursor: pointer;">
              <div class="detail-card-header">
                <v-icon size="20" color="#2563EB" class="mr-2">mdi-human-male-board</v-icon>
                <span class="detail-card-name">{{ mod.name }}</span>
              </div>
              <p v-if="mod.description" class="detail-card-desc">{{ mod.description }}</p>
              <div class="detail-card-meta">
                <v-chip v-if="mod.school?.name" size="x-small" variant="tonal" color="secondary">
                  {{ mod.school.name }}
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </template>

    <!-- Admin/Counselor: Stats Cards -->
    <template v-else>
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
    </template>
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useMemberStore } from "@/store/member";
import { useGroupStore } from "@/store/group";
import { getMembers } from "@/services/members";
import { getGroups } from "@/services/groups";
import { getSmallGroups } from "@/services/smallGroups";
import { getAcademicModules } from "@/services/academicModules";

export default {
  name: "HomePage",
  setup() {
    const memberStore = useMemberStore();
    const groupStore = useGroupStore();

    const isUser = computed(() => memberStore.getUser?.role === 'user');
    const isLider = computed(() => memberStore.isLider);
    const isProfessor = computed(() => memberStore.isProfessor);
    const isStudent = computed(() => memberStore.isStudent);

    // Lider data
    const liderGroups = ref([]);
    const liderSmallGroups = ref([]);
    const liderModules = ref([]);
    const liderLoading = ref(false);

    const fetchLiderData = async () => {
      liderLoading.value = true;
      try {
        const [groups, smallGroups] = await Promise.all([
          getGroups().catch(() => []),
          getSmallGroups().catch(() => []),
        ]);
        liderGroups.value = groups;
        liderSmallGroups.value = smallGroups;

        if (isProfessor.value) {
          liderModules.value = await getAcademicModules().catch(() => []);
        }
      } catch (e) {
        console.error("Error fetching lider data:", e);
      } finally {
        liderLoading.value = false;
      }
    };

    onMounted(async () => {
      if (isUser.value) return;
      if (isLider.value) {
        fetchLiderData();
        return;
      }
      try {
        const members = await getMembers();
        memberStore.setMembers(members);
      } catch (e) {
        console.error("Error fetching members:", e);
      }
      try {
        const groups = await getGroups();
        groupStore.setGroups(groups);
      } catch (e) {
        console.error("Error fetching groups:", e);
      }
    });

    const membersCount = computed(() => memberStore.getMembersCount);
    const groupsCount = computed(() => groupStore.getGroupsCount);

    const userName = computed(() => {
      const user = memberStore.getUser;
      return user?.name || user?.username || "Usuario";
    });

    return {
      membersCount, groupsCount, userName,
      isUser, isLider, isProfessor, isStudent,
      liderGroups, liderSmallGroups, liderModules, liderLoading,
    };
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

/* User welcome card */
.welcome-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.welcome-card-content {
  padding: 32px;
  text-align: center;
}

.welcome-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A1918;
  margin-bottom: 8px;
}

.welcome-card-text {
  font-size: 0.95rem;
  color: #6B6560;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Feature cards */
.feature-card {
  padding: 24px;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    transform: translateY(-1px);
  }
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(217, 119, 6, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.feature-icon-small-groups {
  background: rgba(124, 58, 237, 0.1);
}

.feature-icon-schools {
  background: rgba(5, 150, 105, 0.1);
}

.feature-icon-professor {
  background: rgba(37, 99, 235, 0.1);
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1A1918;
  margin-bottom: 6px;
}

.feature-desc {
  font-size: 0.85rem;
  color: #6B6560;
  line-height: 1.5;
  margin: 0;
}

/* Lider sections */
.stat-icon-modules {
  background: rgba(37, 99, 235, 0.1);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A1918;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.detail-card {
  padding: 18px 20px;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    transform: translateY(-1px);
  }
}

.detail-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.detail-card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1A1918;
}

.detail-card-desc {
  font-size: 0.82rem;
  color: #6B6560;
  line-height: 1.5;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
