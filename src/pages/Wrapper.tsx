import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import { createProfile, getProfile } from "../services/profile";

export default function Wrapper() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
        setAuthenticated(!!session);
        ensureProfile(session.user);
      }
      setLoading(false);
    };

    getSession();
  }, []);

  const ensureProfile = async (user: { id: string; email?: string }) => {
    try {
      await getProfile(user.id);
    } catch {
      const username = (user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`).toLowerCase().replace(/[^a-z0-9_]/g, "_");
      try {
        await createProfile({ id: user.id, username, display_name: username });
      } catch {
        // profile may have been created by another process, ignore
      }
    }
  };

  if (loading) {
    return <span>Loading...</span>;
  } else {
    if (authenticated) {
      return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow px-6 lg:px-8 box-border pb-24">
            <Navbar />
            <div className="mt-6">
              <Outlet />
            </div>
          </main>
          <Link
            to="/collections"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#9E7BFF] to-[#7B61FF] text-white shadow-lg shadow-[#7B61FF]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="size-6" strokeWidth={2.5} />
          </Link>
        </div>
      );
    }
    return <Navigate to={"/login"} />;
  }
}
