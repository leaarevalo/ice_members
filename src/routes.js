import * as VueRouter from "vue-router";
import MemberList from "./components/members/MembersList.vue";
import MemberDetail from "./components/members/MemberDetail.vue";
import CreateMember from "./components/members/CreateMember.vue";
import GroupsList from "./components/groups/GroupsList.vue";
import CreateGroup from "./components/groups/CreateGroup.vue";
import GroupDetail from "./components/groups/GroupDetail.vue";
import CounselingView from "./components/counseling/CounselingView.vue";
import ManagersList from "./components/managers/ManagersList.vue";
import SmallGroupsView from "./components/small-groups/SmallGroupsView.vue";
import SmallGroupDetail from "./components/small-groups/SmallGroupDetail.vue";
import SchoolsList from "./components/schools/SchoolsList.vue";
import CreateSchool from "./components/schools/CreateSchool.vue";
import SchoolDetail from "./components/schools/SchoolDetail.vue";
import StudentModules from "./components/schools/StudentModules.vue";
import StudentModuleDetail from "./components/schools/StudentModuleDetail.vue";
import ProfessorModules from "./components/schools/ProfessorModules.vue";
import ProfessorModuleDetail from "./components/schools/ProfessorModuleDetail.vue";
import ProfessorEnrollments from "./components/schools/ProfessorEnrollments.vue";
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
  { path: "/managers", component: ManagersList, meta: { requiresAuth: true } },
  { path: "/small-groups", component: SmallGroupsView, meta: { requiresAuth: true } },
  { path: "/small-groups/detail", component: SmallGroupDetail, meta: { requiresAuth: true } },
  { path: "/schools", component: SchoolsList, meta: { requiresAuth: true } },
  { path: "/schools/new", component: CreateSchool, meta: { requiresAuth: true } },
  { path: "/schools/detail", component: SchoolDetail, meta: { requiresAuth: true } },
  { path: "/schools/modules", component: StudentModules, meta: { requiresAuth: true } },
  { path: "/schools/module", component: StudentModuleDetail, meta: { requiresAuth: true } },
  { path: "/professor", component: ProfessorModules, meta: { requiresAuth: true } },
  { path: "/professor/module", component: ProfessorModuleDetail, meta: { requiresAuth: true } },
  { path: "/professor/enrollments", component: ProfessorEnrollments, meta: { requiresAuth: true } },
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
