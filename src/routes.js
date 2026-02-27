import * as VueRouter from "vue-router";
import MemberList from "./components/members/MembersList.vue";
import MemberDetail from "./components/members/MemberDetail.vue";
import CreateMember from "./components/members/CreateMember.vue";
import GroupsList from "./components/groups/GroupsList.vue";
import CreateGroup from "./components/groups/CreateGroup.vue";
import GroupDetail from "./components/groups/GroupDetail.vue";
import CounselingView from "./components/counseling/CounselingView.vue";
import Login from "./components/Login.vue"
import Home from "./components/Home.vue"
import { isAuthenticated } from "./services/login.js";


const routes = [
  { path: "/", component: Login },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/members", component: MemberList, meta: { requiresAuth: true } },
  { path: "/members/new", component: CreateMember, meta: { requiresAuth: true } },
  { path: "/members/detail", component: MemberDetail, meta: { requiresAuth: true } },
  { path: "/groups", component: GroupsList, meta: { requiresAuth: true } },
  { path: "/groups/new", component: CreateGroup, meta: { requiresAuth: true } },
  { path: "/groups/detail", component: GroupDetail, meta: { requiresAuth: true } },
  { path: "/counseling", component: CounselingView, meta: { requiresAuth: true } },
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/');
  } else {
    next();
  }
});

export default router;
