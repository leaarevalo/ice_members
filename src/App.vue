<template>
  <router-view></router-view>
  <!-- <div id="app">
    <router-view></router-view>
  </div> -->
  <!-- <MainView /> -->
  <!-- <Login/> -->
  <!-- <Home/> -->
</template>

<script>
import MainView from "./MainView.vue";
import Login from "./components/Login.vue";
import Home from "./components/Home.vue"

export default {
  name: "App",
  // components: {
  //   //MainView,
  //   //Login,
  //   //Home
  // },
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
