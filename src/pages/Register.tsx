import { SyntheticEvent, useState } from "react";
import supabase from "../supabase-client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data) {
      setMessage("Account created! Check your email.");
    }
    setEmail("");
    setPassword("");
  };

  const handleOAuthSignUp = async (provider: "google") => {
    setMessage("");
    setOauthLoading(provider);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    setOauthLoading(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl text-[#1B1B2D] leading-tight">
            voglio
          </h1>
          <p className="text-sm text-[#6B6E85] mt-2">
            Create your account
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-[#F0F1F6] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wide">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-[#EFEFF4] text-sm focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wide">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-[#EFEFF4] text-sm focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 h-11 rounded-xl bg-[#7B61FF] hover:bg-[#6B4EFF] text-white font-semibold shadow-md shadow-[#7B61FF]/15"
            >
              {loading && <Spinner />}
              {loading ? "Creating..." : "Create account"}
            </Button>

            {message && (
              <p className={`mt-3 text-xs text-center ${message.includes("error") || message.includes("Error") ? "text-red-500" : "text-green-600"}`}>{message}</p>
            )}
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F0F1F6]" />
            </div>
            <div className="relative flex justify-center text-xs text-[#6B6E85]">
              <span className="bg-white px-2">or sign up with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              disabled={!!oauthLoading}
              onClick={() => handleOAuthSignUp("google")}
              className="w-full h-11 rounded-xl border-[#EFEFF4] text-sm font-medium text-[#1B1B2D] hover:bg-[#F5F3FF] hover:border-[#7B61FF]/30"
            >
              {oauthLoading === "google" ? (
                <Spinner />
              ) : (
                <GoogleIcon className="w-5 h-5 mr-2 shrink-0" />
              )}
              {oauthLoading === "google" ? "Redirecting..." : "Continue with Google"}
            </Button>

          </div>

          <p className="mt-6 text-center text-xs text-[#6B6E85]">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-[#7B61FF] hover:text-[#6B4EFF]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
