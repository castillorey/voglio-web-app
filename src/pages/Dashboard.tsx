import { useNavigate } from "react-router";
import supabase from "../supabase-client";

function dashboard() {
  const navigate = useNavigate();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  return (
    <div>
      <h2>Your logged in!</h2>
      <button
        className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={signOut}
      >
        Sign out
      </button>
    </div>
  );
}

export default dashboard;
