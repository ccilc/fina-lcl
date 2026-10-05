import { reactive, computed } from "vue";
import api from "@/services/api";
import type { AuthUser, LoginForm, RegisterForm } from "@/types/api";

const TOKEN_KEY = "cfc_admin_token"; // conservé pour compatibilité avec services/api.ts
const USER_KEY = "fina_lcl_user";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const state = reactive<AuthState>({
  user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
  token: localStorage.getItem(TOKEN_KEY),
});

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token && !!state.user);
  const isStaff = computed(() => state.user?.role === "admin" || state.user?.role === "advisor");
  const isClient = computed(() => state.user?.role === "client");

  async function login(payload: LoginForm) {
    const { data } = await api.post("/auth/login", payload);
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user as AuthUser;
  }

  async function register(payload: RegisterForm) {
    const { data } = await api.post("/auth/register", payload);
    return data as { message: string };
  }

  function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    user: computed(() => state.user),
    isAuthenticated,
    isStaff,
    isClient,
    login,
    register,
    logout,
  };
}
