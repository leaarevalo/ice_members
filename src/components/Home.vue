<template>
  <v-sheet class="main-container">
    <h1>Iglesia de Cristo</h1>
    <v-row class="main-content">
      <img class="main-image" src="../../public/cronograma.jpeg" alt="" />
    </v-row>
  </v-sheet>
</template>
<script>
import { onMounted } from "vue";
import { useMemberStore } from "@/store/member";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  setup() {
    const store = useMemberStore();
    onMounted(async () => {});
    const membersCount = store.getMembersCount;
    return { membersCount };
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}
.main-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  align-content: start;
  margin-top: 30px;
}

.main-image {
  width: 600px;
  height: 700px;
}
</style>
