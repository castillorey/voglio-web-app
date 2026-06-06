import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "../supabase-client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, createProfile, updateProfile, getCurrentUserId, IProfile } from "../services/profile";
import { getFollowing } from "../services/follow";

export default function Account() {
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [followingCount, setFollowingCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUserId) return;
        loadProfile();
    }, [currentUserId]);

    const loadProfile = async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const prof = await getProfile(currentUserId);
            if (prof) {
                setProfile(prof);
                setDisplayName(prof.display_name || "");
                const following = await getFollowing(currentUserId);
                setFollowingCount(following.length);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!currentUserId) return;
        setSaving(true);
        try {
            const username = displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_") || `user_${currentUserId.slice(0, 8)}`;
            const prof = await createProfile({ id: currentUserId, username, display_name: displayName || undefined });
            setProfile(prof);
        } catch (err) {
            console.log(err);
        }
        setSaving(false);
    };

    const handleSave = async () => {
        if (!currentUserId || !profile) return;
        setSaving(true);
        try {
            const updated = await updateProfile(currentUserId, { display_name: displayName });
            setProfile(updated);
        } catch (err) {
            console.log(err);
        }
        setSaving(false);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate("/login");
    };

    if (loading) return <div className="mt-8 text-center text-gray-500">Loading...</div>;

    if (!profile) {
        return (
            <>
                <h2 className="text-xl font-bold">Account</h2>
                <p className="mt-2 text-sm text-gray-500">Set up your profile to get started</p>
                <div className="mt-4 space-y-3">
                    <div>
                        <Label htmlFor="displayName" className="text-xs text-gray-500">Display name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="mt-1 text-sm"
                            placeholder="Your name"
                        />
                    </div>
                    <Button size="sm" onClick={handleCreate} disabled={saving}>
                        {saving ? "Creating..." : "Create profile"}
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div>
                <div className="flex items-start gap-3">
                    <Avatar className="size-9">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold tracking-tight leading-none">
                            {profile.display_name}
                        </span>
                        <span className="leading-none text-sm text-muted-foreground">
                            @{profile.username}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>{followingCount} following</span>
                </div>
                <div className="mt-4 space-y-3">
                    <div>
                        <Label htmlFor="displayName" className="text-xs text-gray-500">Display name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="mt-1 text-sm"
                        />
                    </div>
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
                <p className="mt-4 h-2 w-full border-b border-gray-300"></p>
            </div>
            <Button className="mt-2" variant="destructive" onClick={signOut}>Log out</Button>
        </>
    );
}
