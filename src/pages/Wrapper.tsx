import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Navigate, Outlet } from "react-router-dom";
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
          <main className="flex-grow px-6 pt-5 lg:px-8 box-border pb-28">
            <Outlet></Outlet>
          </main>
          <Navbar></Navbar>
        </div>
      );
    }
    return <Navigate to={"/login"} />;
  }
}
