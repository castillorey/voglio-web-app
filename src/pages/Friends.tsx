import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { searchProfiles, getProfile, getCurrentUserId, IProfile } from "../services/profile";
import { followUser, unfollowUser, getFollowing } from "../services/follow";

export default function Friends() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<IProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [searched, setSearched] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (currentUserId) {
      loadFollowing();
    }
  }, [currentUserId]);

  const loadFollowing = async () => {
    if (!currentUserId) return;
    setLoadingFollowing(true);
    try {
      const ids = await getFollowing(currentUserId);
      setFollowingIds(ids);
      const profiles = (await Promise.all(ids.map((id) => getProfile(id)))).filter(Boolean) as IProfile[];
      setFollowingProfiles(profiles);
    } catch (err) {
      console.log(err);
    }
    setLoadingFollowing(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const profiles = await searchProfiles(query.trim());
      setResults(profiles.filter((p) => p.id !== currentUserId));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleFollow = async (userId: string) => {
    try {
      if (followingIds.includes(userId)) {
        await unfollowUser(userId);
        setFollowingIds(followingIds.filter((id) => id !== userId));
        setFollowingProfiles(followingProfiles.filter((p) => p.id !== userId));
      } else {
        await followUser(userId);
        setFollowingIds([...followingIds, userId]);
        const prof = await getProfile(userId);
        if (prof) setFollowingProfiles([...followingProfiles, prof]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mt-2">Friends</h2>

      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Search users by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="text-sm"
        />
        <Button size="sm" onClick={handleSearch} disabled={loading}>
          <Search className="size-4" />
        </Button>
      </div>

      <p className="mt-4 h-2 w-full border-b border-gray-300" />

      {loading && <div className="mt-4 text-center text-gray-500">Searching...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No users found</div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/friends/u/${profile.username}`)}
            >
              <Avatar className="size-10">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                <AvatarFallback className="text-xs bg-gray-100">
                  {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {profile.display_name || profile.username}
                </p>
                <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
              </div>
              <Button
                size="sm"
                variant={followingIds.includes(profile.id) ? "outline" : "default"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(profile.id);
                }}
              >
                {followingIds.includes(profile.id) ? (
                  <UserCheck className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {!searched && (
        <>
          <p className="mt-6 mb-3 text-sm text-gray-500">
            {loadingFollowing ? "Loading..." : `${followingProfiles.length} following`}
          </p>
          <div className="space-y-3">
            {loadingFollowing ? (
              <div className="text-center text-gray-400 text-sm py-4">Loading...</div>
            ) : followingProfiles.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-4">
                You're not following anyone yet. Search for users above.
              </div>
            ) : (
              followingProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/friends/u/${profile.username}`)}
                >
                  <Avatar className="size-10">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                    <AvatarFallback className="text-xs bg-gray-100">
                      {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {profile.display_name || profile.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(profile.id);
                    }}
                  >
                    <UserX className="size-4 mr-1" />
                    Unfollow
                  </Button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}
