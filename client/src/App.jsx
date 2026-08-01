import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedLayout, GuestLayout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemDetailPage } from "./pages/ProblemDetailPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Guest Routes */}
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:slug" element={<ProblemDetailPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/problems" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
