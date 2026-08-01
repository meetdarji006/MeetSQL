import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { Navbar } from "./Navbar";

export function ProtectedLayout() {
  const accessToken = useAuthStore((s) => s.accessToken);

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
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Outlet />
    </div>
  );
}
