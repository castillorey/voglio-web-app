import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

export function Wrapper() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f6f4]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a1a1a] border-t-transparent" />
          <p className="text-sm text-[#8a8a8a]">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? (
    <div className="min-h-screen bg-[#f8f6f4] text-[#1a1a1a]">
      <Navbar />
      <main className="mx-auto max-w-screen-2xl pt-16 pb-16">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
