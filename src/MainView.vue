<template>
  <v-layout class="app-layout">
    <!-- Sidebar Navigation -->
    <v-navigation-drawer
      v-if="$route.path !== '/'"
      permanent
      width="260"
      class="sidebar"
    >
      <!-- Logo Section -->
      <div class="sidebar-logo">
        <v-img
          src="https://iglesiadecristotuc.org.ar/media/imagen/top_bar/logo.png"
          max-width="48"
          class="sidebar-logo-img"
        ></v-img>
        <span class="sidebar-logo-text">ICE Members</span>
      </div>

      <v-divider class="sidebar-divider"></v-divider>

      <!-- Navigation Items -->
      <v-list class="sidebar-nav" density="compact" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          :href="item.href"
          :active="$route.path === item.href"
          class="sidebar-nav-item"
          rounded="lg"
        >
        </v-list-item>
      </v-list>

      <!-- User Section at Bottom -->
      <template v-slot:append>
        <div class="sidebar-user">
          <v-divider class="sidebar-divider"></v-divider>
          <div class="sidebar-user-info">
            <v-avatar size="36" color="#D97706" class="sidebar-avatar">
              <span class="text-white text-body-2 font-weight-bold">
                {{ userInitials }}
              </span>
            </v-avatar>
            <div class="sidebar-user-details">
              <span class="sidebar-user-name">{{ userName }}</span>
              <span class="sidebar-user-role">{{ userRole }}</span>
            </div>
          </div>
          <v-btn
            icon="mdi-logout"
            variant="text"
            size="small"
            class="sidebar-logout-btn"
            @click="logout"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="main-container">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { useMemberStore } from "@/store/member";
import { useRouter } from "vue-router";
import { onMounted, computed } from "vue";

export default {
  name: "MainView",
  setup() {
    const store = useMemberStore();
    const router = useRouter();

    const navItems = computed(() => {
      const items = [
        { icon: "mdi-view-dashboard-outline", title: "Inicio", value: "home", href: "/home" },
        { icon: "mdi-account-group-outline", title: "Miembros", value: "members", href: "/members" },
        { icon: "mdi-account-supervisor-outline", title: "Grupos", value: "groups", href: "/groups" },
      ];
      if (store.isCounselor) {
        items.push({ icon: "mdi-notebook-heart-outline", title: "Consejería", value: "counseling", href: "/counseling" });
      }
      return items;
    });

    onMounted(() => {
      store.initializeUser();
    });

    const userName = computed(() => {
      const user = store.getUser;
      return user?.name || user?.username || "Usuario";
    });

    const userInitials = computed(() => {
      const name = userName.value;
      return name.charAt(0).toUpperCase();
    });

    const userRole = computed(() => {
      if (store.isManager) return "Administrador";
      if (store.isCounselor) return "Consejero";
      return "Miembro";
    });

    const logout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("member");
      store.removeUser();
      router.replace("/");
    };

    return { logout, navItems, userName, userInitials, userRole };
  },
};
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  background-color: #2C2B28 !important;
  border-right: none !important;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 16px;
}

.sidebar-logo-img {
  border-radius: 10px;
}

.sidebar-logo-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #E8E5DE;
  letter-spacing: -0.02em;
}

.sidebar-divider {
  border-color: rgba(232, 229, 222, 0.1) !important;
  margin: 0 16px;
}

.sidebar-nav {
  padding: 8px 12px !important;
  background: transparent !important;
}

.sidebar-nav-item {
  color: #B8B4AC !important;
  margin-bottom: 2px;
  border-radius: 10px !important;
  transition: all 0.2s ease !important;

  &:hover {
    background-color: #3D3C38 !important;
    color: #E8E5DE !important;
  }

  &.v-list-item--active {
    background-color: #3D3C38 !important;
    color: #D97706 !important;
    border-left: 3px solid #D97706;

    .v-icon {
      color: #D97706 !important;
    }
  }
}

/* User Section */
.sidebar-user {
  padding: 12px 16px 16px;
}

.sidebar-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 4px;
}

.sidebar-avatar {
  flex-shrink: 0;
}

.sidebar-user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #E8E5DE;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 0.72rem;
  color: #8A857E;
}

.sidebar-logout-btn {
  color: #8A857E !important;
  position: absolute;
  right: 16px;
  bottom: 22px;

  &:hover {
    color: #DC2626 !important;
    background-color: rgba(220, 38, 38, 0.1) !important;
  }
}

/* Main Content */
.main-content {
  background-color: #FAF9F7 !important;
}

.main-container {
  max-width: 1200px;
  padding: 32px 40px;
}
</style>
