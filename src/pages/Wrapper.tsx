import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Navigate } from "react-router-dom";

function wrapper({ children } : any) {
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
      return <>{ children }</>;
    }
    return <Navigate to={"/login"} />;
  }
}

export default wrapper;
