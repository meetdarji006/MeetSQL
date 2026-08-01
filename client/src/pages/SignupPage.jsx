import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Terminal, Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react";

export function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useSignup();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation.mutate(
      { displayName, email, password },
      {
        onSuccess: () => navigate("/problems"),
      }
    );
  };

  const errorMessage = signupMutation.error?.response?.data?.message || signupMutation.error?.message;
  const validationErrors = signupMutation.error?.response?.data?.error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      {/* Ambient background glow */}
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
            Create a student profile & get your dedicated Oracle schema
          </p>
        </div>

        {/* Card */}
        <Card className="border-[#252d3d] bg-[#111827]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Register Account</CardTitle>
            <CardDescription>Instant access — no domain restriction required</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  {Array.isArray(validationErrors) && (
                    <ul className="list-disc list-inside pl-5 space-y-0.5 text-[11px] text-red-300">
                      {validationErrors.map((v, i) => (
                        <li key={i}>{v.field}: {v.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1.5">
                  <User size={14} className="text-[#64748b]" />
                  <span>Display Name</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

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
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1.5">
                  <Lock size={14} className="text-[#64748b]" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  placeholder="At least 8 chars (upper, lower, digit)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Password complexity helper */}
              <div className="rounded border border-[#252d3d] bg-[#1a2233]/50 p-2.5 space-y-1">
                <p className="text-[11px] text-[#64748b]">Password requirements:</p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-400" : "text-[#64748b]"}`}>
                    <CheckCircle2 size={12} /> Min 8 characters
                  </span>
                  <span className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-400" : "text-[#64748b]"}`}>
                    <CheckCircle2 size={12} /> 1 Uppercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-400" : "text-[#64748b]"}`}>
                    <CheckCircle2 size={12} /> 1 Lowercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-green-400" : "text-[#64748b]"}`}>
                    <CheckCircle2 size={12} /> 1 Number
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Provisioning Oracle Schema..." : "Create Account & Provision Schema"}
              </Button>

              <div className="text-center text-xs text-[#64748b]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#a78bfa] hover:underline font-medium">
                  Log in here →
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
