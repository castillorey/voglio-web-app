import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import supabase from "../supabase-client";
import { getCurrentUserId, IProfile, searchProfiles, getProfile } from "../services/profile";
import { followUser, unfollowUser, getFollowing } from "../services/follow";

// Procedurally generate a stable location for the premium visual aesthetic
const getProfileLocation = (username: string) => {
  const locations = [
    "Madrid, España",
    "Barcelona, España",
    "Valencia, España",
    "Sevilla, España",
    "Bilbao, España",
    "Zaragoza, España",
    "Málaga, España",
    "Murcia, España",
    "Palma, España",
    "Alicante, España"
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % locations.length;
  return locations[index];
};

export default function Friends() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  
  const [activeTab, setActiveTab] = useState<"todos" | "siguiendo" | "seguidores">("todos");
  const [query, setQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Data lists
  const [allProfiles, setAllProfiles] = useState<IProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<IProfile[]>([]);
  const [followersProfiles, setFollowersProfiles] = useState<IProfile[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      loadData();
    }
  }, [currentUserId]);

  const loadData = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      // 1. Fetch followed IDs
      const followedIds = await getFollowing(currentUserId);
      setFollowingIds(followedIds);

      // 2. Fetch all profiles (excluding current user) for "Todos" discovery
      const { data: allProfs, error: allErr } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId)
        .limit(50);
      if (allErr) throw allErr;
      setAllProfiles(allProfs as IProfile[]);

      // 3. Fetch following profiles in a single query (batch)
      if (followedIds.length > 0) {
        const { data: followingProfs, error: folErr } = await supabase
          .from("profiles")
          .select("*")
          .in("id", followedIds);
        if (folErr) throw folErr;
        setFollowingProfiles(followingProfs as IProfile[]);
      } else {
        setFollowingProfiles([]);
      }

      // 4. Fetch followers in a single query (batch)
      const { data: followerRelations, error: relErr } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("following_id", currentUserId);
      if (relErr) throw relErr;

      const fIds = followerRelations.map((f) => f.follower_id);
      if (fIds.length > 0) {
        const { data: followerProfs, error: fErr } = await supabase
          .from("profiles")
          .select("*")
          .in("id", fIds);
        if (fErr) throw fErr;
        setFollowersProfiles(followerProfs as IProfile[]);
      } else {
        setFollowersProfiles([]);
      }
    } catch (err) {
      console.error("Error loading friends data:", err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      // If cleared, reload all profiles
      loadData();
      return;
    }
    setLoading(true);
    try {
      const results = await searchProfiles(query.trim());
      // Filter out self
      const filtered = results.filter((p) => p.id !== currentUserId);
      setAllProfiles(filtered);
      setActiveTab("todos"); // Switch to search/discovery tab
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFollow = async (userId: string, username: string) => {
    try {
      if (followingIds.includes(userId)) {
        await unfollowUser(userId);
        setFollowingIds((prev) => prev.filter((id) => id !== userId));
        setFollowingProfiles((prev) => prev.filter((p) => p.id !== userId));
        showToast(`Dejaste de seguir a @${username}`);
      } else {
        await followUser(userId);
        setFollowingIds((prev) => [...prev, userId]);
        const prof = await getProfile(userId);
        if (prof) {
          setFollowingProfiles((prev) => [...prev, prof]);
        }
        showToast(`¡Ahora sigues a @${username}!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live filter profiles based on query
  const getFilteredProfiles = () => {
    const q = query.toLowerCase().trim();
    let baseList: IProfile[] = [];

    if (activeTab === "todos") baseList = allProfiles;
    else if (activeTab === "siguiendo") baseList = followingProfiles;
    else if (activeTab === "seguidores") baseList = followersProfiles;

    if (!q) return baseList;
    return baseList.filter(
      (p) =>
        p.username.toLowerCase().includes(q) ||
        (p.display_name && p.display_name.toLowerCase().includes(q))
    );
  };

  const displayList = getFilteredProfiles();

  return (
    <div className="relative">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#1B1B2D] text-white text-sm rounded-full shadow-lg flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="size-4 text-[#FF59C7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        
        {/* Search bar with absolute icon */}
        <div className="relative flex items-center mt-5">
          <Search className="absolute left-4 size-5 text-[#8C8F9E]" />
          <input
            type="text"
            placeholder="Buscar amigos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full h-12 pl-12 pr-4 bg-white border border-[#F0F1F6] rounded-[16px] text-sm text-[#1B1B2D] placeholder-[#8C8F9E] focus:outline-none focus:ring-1 focus:ring-[#7B61FF] focus:border-[#7B61FF] transition-all shadow-sm"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,.01)" }}
          />
        </div>

        {/* Tab category pills */}
        <div className="flex gap-2.5 mt-5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "todos", label: "Todos" },
            { id: "siguiendo", label: "Siguiendo" },
            { id: "seguidores", label: "Seguidores" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  active
                    ? "text-white bg-gradient-to-r from-[#9E7BFF] to-[#7B61FF] shadow-md shadow-[#7B61FF]/15 scale-[1.02]"
                    : "text-[#5E6173] bg-white border border-[#F0F1F6] hover:bg-[#F8F8FB]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profiles List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[#7B61FF] border-t-transparent animate-spin" />
              <p className="text-xs text-[#8C8F9E] mt-3">Cargando...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 border border-[#F0F1F6] text-center shadow-sm">
              <p className="text-sm font-medium text-[#5E6173]">No se encontraron amigos</p>
              <p className="text-xs text-[#8C8F9E] mt-1">Intenta con otra búsqueda o explora otras pestañas.</p>
            </div>
          ) : (
            displayList.map((profile) => {
              const isFollowingUser = followingIds.includes(profile.id);
              return (
                <div
                  key={profile.id}
                  onClick={() => navigate(`/friends/u/${profile.username}`)}
                  className="flex items-center justify-between p-4 bg-white rounded-[20px] border border-[#F0F1F6] shadow-[0_8px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px] transition-all"
                >
                  {/* Left Side: Avatar + Details */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-[#F0F1F6]">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                        <AvatarFallback className="text-lg font-bold bg-[#EBEBF0] text-[#5E6173]">
                          {profile.display_name?.slice(0, 2).toUpperCase() || profile.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[15px] text-[#1B1B2D] truncate">@{profile.username}</p>
                      <p className="text-xs text-[#5E6173] font-medium mt-0.5 truncate">
                        {profile.display_name || profile.username}
                      </p>
                      <p className="text-[11px] text-[#8C8F9E] mt-0.5 font-medium">
                        {getProfileLocation(profile.username)}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Follow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(profile.id, profile.username);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
                      isFollowingUser
                        ? "border border-[#E6E2FF] text-[#7B61FF] bg-[#F7F5FF] hover:bg-[#F0ECFF]"
                        : "bg-[#7B61FF] text-white hover:bg-[#6B4EFF] shadow-md shadow-[#7B61FF]/10"
                    }`}
                  >
                    {isFollowingUser ? "Siguiendo" : "Seguir"}
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
