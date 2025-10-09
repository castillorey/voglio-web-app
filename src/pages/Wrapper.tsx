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
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow px-6 pt-5 lg:px-8 box-border border-b-[70px]">
            <Outlet></Outlet>
          </main>
          <Navbar></Navbar>
        </div>
      );
    }
    return <Navigate to={"/login"} />;
  }
}
