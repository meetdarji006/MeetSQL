import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useAuthStore } from "../stores/auth-store";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
    },
  });
}

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
    },
  });
}

export function useLogout() {
  const { refreshToken, logout } = useAuthStore.getState();

  return useMutation({
    mutationFn: () => authApi.logout({ refreshToken }),
    onSettled: () => logout(),
  });
}
