import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { Navbar } from "./Navbar";

function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsub;
  }, []);

  return hasHydrated;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7c3aed] border-t-transparent" />
    </div>
  );
}

export function ProtectedLayout() {
  const hasHydrated = useHasHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function GuestLayout() {
  const hasHydrated = useHasHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  if (accessToken) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Outlet />
    </div>
  );
}

