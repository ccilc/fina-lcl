import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/simulateur",
    name: "simulator",
    component: () => import("@/views/LoanSimulatorView.vue"),
  },
  {
    path: "/prets-personnels",
    name: "personal-loan",
    component: () => import("@/views/PersonalLoanView.vue"),
  },
  {
    path: "/prets-professionnels",
    name: "professional-loan",
    component: () => import("@/views/ProfessionalLoanView.vue"),
  },
  {
    path: "/cartes-bancaires",
    name: "cards",
    component: () => import("@/views/CardsView.vue"),
  },
  {
    path: "/comptes-epargne",
    name: "accounts",
    component: () => import("@/views/AccountsView.vue"),
  },
  {
    path: "/investissements",
    name: "investments",
    component: () => import("@/views/InvestmentsView.vue"),
  },
  {
    path: "/fondation",
    name: "foundation",
    component: () => import("@/views/FoundationView.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("@/views/FaqView.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/ContactView.vue"),
  },
  {
    path: "/connexion",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/inscription",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/mon-espace",
    name: "client-dashboard",
    component: () => import("@/views/ClientDashboardView.vue"),
    meta: { requiresAuth: true, roles: ["client"] },
  },
  {
    path: "/administration",
    name: "admin-dashboard",
    component: () => import("@/views/AdminDashboardView.vue"),
    meta: { requiresAuth: true, roles: ["admin", "advisor"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const requiredRoles = to.meta.roles as string[] | undefined;
  if (!requiredRoles) return true;

  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated.value) {
    return { path: "/connexion", query: { redirect: to.fullPath } };
  }

  if (!requiredRoles.includes(user.value!.role)) {
    // Connecté mais mauvais rôle : on redirige vers son propre espace
    return user.value!.role === "client" ? { path: "/mon-espace" } : { path: "/administration" };
  }

  return true;
});

export default router;
