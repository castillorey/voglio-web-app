import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function Wrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f6f4]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a1a1a] border-t-transparent" />
          <p className="text-sm text-[#8a8a8a]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F7FC] pb-28">
      <main className="flex-grow px-5 lg:px-8 box-border mx-auto w-full" style={{ maxWidth: 480 }}>
        <div className="mt-5">
          <Outlet />
        </div>
      </main>
      <Navbar />
    </div>
  );
}
