import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { SQL_QUOTES } from "../lib/constants";
import { Terminal, Lock, Mail, AlertCircle } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  const loginMutation = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SQL_QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/problems"),
      }
    );
  };

  const errorMessage = loginMutation.error?.response?.data?.message || loginMutation.error?.message;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-2">
            <Terminal size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f1f5f9] font-display">
            MeetSQL
          </h1>
          <p className="text-sm text-[#64748b]">
            Oracle SQL practice platform for engineering students
          </p>
        </div>

        {/* Card */}
        <Card className="border-[#252d3d] bg-[#111827]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>Enter your credentials to access your sandboxed environment</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1.5">
                  <Mail size={14} className="text-[#64748b]" />
                  <span>Email Address</span>
                </label>
                <Input
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1.5">
                  <Lock size={14} className="text-[#64748b]" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Connecting to sandbox..." : "Log In"}
              </Button>

              <div className="text-center text-xs text-[#64748b]">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#a78bfa] hover:underline font-medium">
                  Create one now →
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Dynamic SQL Quote Footer */}
        <div className="text-center p-3 rounded-lg border border-[#252d3d]/50 bg-[#1a2233]/40">
          <p className="font-mono text-xs text-[#64748b] transition-all duration-300">
            {SQL_QUOTES[quoteIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
