import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      }
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) {
    return <span>Loading...</span>;
  } else {
    if (authenticated) {
      return (
        <>
          <main className="px-6 pt-5 lg:px-8">
            <Outlet></Outlet>
          </main>
        </>
      );
    }
    return <Navigate to={"/login"} />;
  }
}
