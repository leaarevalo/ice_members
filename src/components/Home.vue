<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="text-center"> Bienvenido </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { onMounted } from "vue";
import { getMembers } from "@/services/members";
import { useMemberStore } from "@/store/member";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  setup() {
    const store = useMemberStore();
    onMounted(async () => {
      console.log("Home component mounted");
      const members = await getMembers();
      console.log(store);
      store.setMembers(members);
      console.log("members: ", members);
    });
    return {};
  },
};
</script>
