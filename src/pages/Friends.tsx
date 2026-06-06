import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, UserCheck, ChevronLeft } from "lucide-react";
import { searchProfiles, getCurrentUserId, IProfile } from "../services/profile";
import { followUser, unfollowUser, getFollowing } from "../services/follow";

export default function Friends() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (currentUserId) {
      getFollowing(currentUserId)
        .then(setFollowingIds)
        .catch(console.log);
    }
  }, [currentUserId]);

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
      } else {
        await followUser(userId);
        setFollowingIds([...followingIds, userId]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button variant="secondary" size="icon" className="size-8 self-start" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </Button>

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
              onClick={() => navigate(`/u/${profile.username}`)}
            >
              <div className="flex items-center justify-center size-10 rounded-full bg-gray-100">
                <Users className="size-5 text-gray-500" />
              </div>
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

      {!searched && followingIds.length > 0 && (
        <>
          <p className="mt-6 mb-3 text-sm text-gray-500">People you follow</p>
          <div className="space-y-3">
            {results.length === 0 && followingIds.map((id) => (
              <div key={id} className="text-xs text-gray-400">Loading...</div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
