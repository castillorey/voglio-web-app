import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Main from "./Main";

export default function Wrapper() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
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
          <Navbar />
          <Main />
        </>
      );
    }
    return <Navigate to={"/login"} />;
  }
}
