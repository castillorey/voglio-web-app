import { SyntheticEvent, useState } from "react";
import supabase from "../supabase-client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/");
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
            Sign in to your account
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
                  autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {message && (
              <p className="mt-3 text-xs text-center text-red-500">{message}</p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-[#6B6E85]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#7B61FF] hover:text-[#6B4EFF]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
