<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer permanent class="bg-deep-purple">
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Home"
          value="home"
          href="/"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-forum"
          title="Members"
          value="Members"
          href="/members"
        >
        </v-list-item>
      </v-list>
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
export default {
  name: "MainView",
};
</script>
