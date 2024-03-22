<template>
  <!-- <MainView /> -->
  <loginMember/>
</template>

<script>
// import MainView from "./MainView.vue";
import loginMember from "./components/loginMember.vue";

export default {
  name: "App",
  components: {
    // // MainView,
    loginMember
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
