import * as VueRouter from "vue-router";
import MemberList from "./components/members/MembersList.vue";
import MemberDetail from "./components/members/MemberDetail.vue";
import CreateMember from "./components/members/CreateMember.vue";
import Login from "./components/Login.vue"
import Home from "./components/Home.vue"


const routes = [
  { path: "/", component: Login },
  { path: "/home", component: Home },
  { path: "/members", component: MemberList },
  { path: "/members/new", component: CreateMember },
  { path: "/members/detail", component: MemberDetail },
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
