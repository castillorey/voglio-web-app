import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "../supabase-client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, createProfile, updateProfile, getCurrentUserId, IProfile } from "../services/profile";
import { getFollowing } from "../services/follow";

const GENDER_OPTIONS = ["", "Male", "Female", "Non-binary", "Other", "Prefer not to say"];
const SHIRT_SIZES = ["", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const PANTS_SIZES = ["", "28", "30", "32", "34", "36", "38", "40"];
const SHOE_SIZES = ["", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];

export default function Perfil() {
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [shirtSize, setShirtSize] = useState("");
    const [pantsSize, setPantsSize] = useState("");
    const [shoeSize, setShoeSize] = useState("");
    const [favoriteColor, setFavoriteColor] = useState("");
    const [favoriteFood, setFavoriteFood] = useState("");
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
                setBirthDate(prof.birth_date || "");
                setGender(prof.gender || "");
                setShirtSize(prof.shirt_size || "");
                setPantsSize(prof.pants_size || "");
                setShoeSize(prof.shoe_size || "");
                setFavoriteColor(prof.favorite_color || "");
                setFavoriteFood(prof.favorite_food || "");
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
            const prof = await createProfile({
                id: currentUserId,
                username,
                display_name: displayName || undefined,
                birth_date: birthDate || null,
                gender: gender || null,
                shirt_size: shirtSize || null,
                pants_size: pantsSize || null,
                shoe_size: shoeSize || null,
                favorite_color: favoriteColor || null,
                favorite_food: favoriteFood || null,
            });
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
            const updated = await updateProfile(currentUserId, {
                display_name: displayName,
                birth_date: birthDate || null,
                gender: gender || null,
                shirt_size: shirtSize || null,
                pants_size: pantsSize || null,
                shoe_size: shoeSize || null,
                favorite_color: favoriteColor || null,
                favorite_food: favoriteFood || null,
            });
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
                <h2 className="text-xl font-bold">Perfil</h2>
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
            <h2 className="text-xl font-bold">Profile</h2>
            <p className="mt-2 h-2 w-full border-b border-gray-300" />

            <div className="flex items-start gap-3 mt-4">
                <Avatar className="size-12">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <span className="font-semibold tracking-tight leading-none text-lg">
                        {profile.display_name}
                    </span>
                    <span className="leading-none text-sm text-muted-foreground">
                        @{profile.username}
                    </span>
                    <span className="text-sm text-gray-500">{followingCount} following</span>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Basic info</h3>
                    <div>
                        <Label htmlFor="displayName" className="text-xs text-gray-500">Display name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="mt-1 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Personal</h3>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="birthDate" className="text-xs text-gray-500">Birth date</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="mt-1 text-sm"
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender" className="text-xs text-gray-500">Gender</Label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt || "Select..."}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Sizes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <Label htmlFor="shirtSize" className="text-xs text-gray-500">Shirt</Label>
                            <select
                                id="shirtSize"
                                value={shirtSize}
                                onChange={(e) => setShirtSize(e.target.value)}
                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {SHIRT_SIZES.map((opt) => (
                                    <option key={opt} value={opt}>{opt || "Select..."}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="pantsSize" className="text-xs text-gray-500">Pants</Label>
                            <select
                                id="pantsSize"
                                value={pantsSize}
                                onChange={(e) => setPantsSize(e.target.value)}
                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {PANTS_SIZES.map((opt) => (
                                    <option key={opt} value={opt}>{opt || "Select..."}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="shoeSize" className="text-xs text-gray-500">Shoe</Label>
                            <select
                                id="shoeSize"
                                value={shoeSize}
                                onChange={(e) => setShoeSize(e.target.value)}
                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {SHOE_SIZES.map((opt) => (
                                    <option key={opt} value={opt}>{opt || "Select..."}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="favoriteColor" className="text-xs text-gray-500">Favorite color</Label>
                            <Input
                                id="favoriteColor"
                                value={favoriteColor}
                                onChange={(e) => setFavoriteColor(e.target.value)}
                                className="mt-1 text-sm"
                                placeholder="Blue, red, green..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="favoriteFood" className="text-xs text-gray-500">Favorite food</Label>
                            <Input
                                id="favoriteFood"
                                value={favoriteFood}
                                onChange={(e) => setFavoriteFood(e.target.value)}
                                className="mt-1 text-sm"
                                placeholder="Pizza, sushi, pasta..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="destructive" onClick={signOut}>
                        Log out
                    </Button>
                </div>
            </div>
        </>
    );
}
