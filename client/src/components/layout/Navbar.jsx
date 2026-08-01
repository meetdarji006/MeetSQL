import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { useLogout } from "../../hooks/use-auth";
import { Database, LogOut, User, Trophy, BookOpen, History } from "lucide-react";
import { Button } from "../ui/button";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  const navItems = [
    { label: "Problems", path: "/problems", icon: BookOpen },
    { label: "Submissions", path: "/submissions", icon: History },
    { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#252d3d] bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/problems" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-[#f1f5f9] hover:text-white transition-colors">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30">
              ◆
            </span>
            <span>MeetSQL</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#1a2233] text-[#f1f5f9] border border-[#252d3d]"
                        : "text-[#64748b] hover:bg-[#111827] hover:text-[#cbd5e1]"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-[#a78bfa]" : "text-[#64748b]"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* User profile / actions */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-full border border-[#252d3d] bg-[#111827] px-3 py-1.5 text-sm font-medium text-[#cbd5e1] hover:border-[#7c3aed]/40 hover:text-white transition-all"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7c3aed] text-xs font-bold text-white">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </div>
              <span className="hidden sm:inline font-mono text-xs text-[#a78bfa]">{user.oracleSchema || user.email}</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#64748b] hover:text-red-400 hover:bg-red-500/10"
              title="Log out"
            >
              <LogOut size={16} />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile nav bar */}
      {user && (
        <div className="flex md:hidden border-t border-[#252d3d] bg-[#111827] px-4 py-2 justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 text-xs font-medium py-1 px-3 rounded ${
                  active ? "text-[#a78bfa]" : "text-[#64748b]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
