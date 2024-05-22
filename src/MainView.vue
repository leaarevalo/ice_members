<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer
      permanent
      class="bg-deep-purple"
      v-if="$route.path !== '/'"
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Inicio"
          value="home"
          href="/home"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-forum"
          title="Miembros"
          value="Members"
          href="/members"
        >
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Salir"
          value="logout"
          @click="logout"
        >
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { useMemberStore } from "@/store/member";
import { useRouter } from "vue-router";
export default {
  name: "MainView",
  setup() {
    const store = useMemberStore();
    const router = useRouter();
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("member");
      store.removeUser;
      router.replace("/");
    };
    return { logout };
  },
};
</script>
