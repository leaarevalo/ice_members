import * as VueRouter from "vue-router";
import MemberList from "./components/members/MembersList.vue";
import MemberDetail from "./components/members/MemberDetail.vue";
import CreateMember from "./components/members/CreateMember.vue";
import LoginMember from "./components/loginMember.vue"


const routes = [
  { path: "/", component: LoginMember },
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
