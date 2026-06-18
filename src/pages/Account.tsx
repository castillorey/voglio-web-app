import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "../supabase-client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getProfile, createProfile, updateProfile, getCurrentUserId, IProfile, fetchColorOptions } from "../services/profile";
import { getFollowing } from "../services/follow";
import { fetchPreferences, PreferenceMap } from "../services/preferences";
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import ProfileEdit from "@/components/profile/ProfileEdit";
import { getZodiacSign } from "@/components/profile/profile-utils";

export default function Perfil() {
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");
    const [shirtSize, setShirtSize] = useState("");
    const [pantsSize, setPantsSize] = useState("");
    const [shoeSize, setShoeSize] = useState("");
    const [followingCount, setFollowingCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [preferences, setPreferences] = useState<PreferenceMap>({});
    const [newPrefItem, setNewPrefItem] = useState<Record<string, string>>({});
    const [newPrefCategory, setNewPrefCategory] = useState("");
    const [colorOptions, setColorOptions] = useState<{ name: string; hex: string }[]>([]);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const CDNURL = import.meta.env.VITE_CDNURL;

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
                setLocation(prof.location || "");
                setShirtSize(prof.shirt_size || "");
                setPantsSize(prof.pants_size || "");
                setShoeSize(prof.shoe_size || "");
                const following = await getFollowing(currentUserId);
                setFollowingCount(following.length);
                const prefs = await fetchPreferences(currentUserId);
                const grouped: PreferenceMap = {};
                for (const p of prefs) {
                  if (!grouped[p.category_name]) grouped[p.category_name] = [];
                  grouped[p.category_name].push(p);
                }
                setPreferences(grouped);
                const colors = await fetchColorOptions();
                setColorOptions(colors);
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
                location: location || null,
                shirt_size: shirtSize || null,
                pants_size: pantsSize || null,
                shoe_size: shoeSize || null,
                zodiac_sign: getZodiacSign(birthDate) || null,
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
                location: location || null,
                shirt_size: shirtSize || null,
                pants_size: pantsSize || null,
                shoe_size: shoeSize || null,
                zodiac_sign: getZodiacSign(birthDate) || null,
            });
            setProfile(updated);
            setEditing(false);
        } catch (err) {
            console.log(err);
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUserId || !profile) return;

        setUploading(true);
        try {
            const fileName = currentUserId + "/avatars/" + uuidv4();
            const { error } = await supabase.storage
                .from("images")
                .upload(fileName, file);

            if (error) {
                console.error(error);
                setUploading(false);
                return;
            }

            const avatarUrl = CDNURL + fileName;
            const updated = await updateProfile(currentUserId, { avatar_url: avatarUrl });
            setProfile(updated);
        } catch (err) {
            console.error(err);
        }
        setUploading(false);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate("/login");
    };

    if (loading) return <div className="mt-8 text-center text-gray-500">Loading...</div>;

    if (!profile) {
        return (
            <div className="min-h-screen" style={{ background: "#F8F8FB" }}>
              <div className="mx-auto" style={{ maxWidth: 430, padding: 20 }}>
                <h2 className="text-xl font-bold text-[#1B1B2D]">Profile</h2>
                <p className="mt-2 text-sm text-[#5E6173]">Set up your profile to get started</p>
                <div className="mt-6 space-y-4">
                    <div>
                        <Label htmlFor="displayName" className="text-xs text-[#8C8F9E]">Display name</Label>
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
              </div>
            </div>
        );
    }

    if (editing) {
        return (
            <ProfileEdit
                profile={profile}
                displayName={displayName} setDisplayName={setDisplayName}
                birthDate={birthDate} setBirthDate={setBirthDate}
                gender={gender} setGender={setGender}
                location={location} setLocation={setLocation}
                shirtSize={shirtSize} setShirtSize={setShirtSize}
                pantsSize={pantsSize} setPantsSize={setPantsSize}
                shoeSize={shoeSize} setShoeSize={setShoeSize}
                preferences={preferences} setPreferences={setPreferences}
                newPrefItem={newPrefItem} setNewPrefItem={setNewPrefItem}
                newPrefCategory={newPrefCategory} setNewPrefCategory={setNewPrefCategory}
                colorOptions={colorOptions}
                saving={saving}
                uploading={uploading}
                currentUserId={currentUserId!}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
                onSignOut={signOut}
                onAvatarUpload={handleAvatarUpload}
                avatarInputRef={avatarInputRef}
            />
        );
    }

    return (
        <ProfileDisplay
            profile={profile}
            preferences={preferences}
            colorOptions={colorOptions}
            followingCount={followingCount}
            onEdit={() => setEditing(true)}
            signOut={signOut}
        />
    );
}
