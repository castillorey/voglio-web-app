import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { IProfile } from "@/services/profile";
import { PreferenceMap } from "@/services/preferences";
import { Card, Chip, ProfileRow } from "./profile-shared";
import { getColorHex, formatDate } from "./profile-utils";

interface ProfileDisplayProps {
  profile: IProfile;
  preferences: PreferenceMap;
  colorOptions: { name: string; hex: string }[];
  followingCount: number;
  onEdit: () => void;
  signOut: () => void;
}

export default function ProfileDisplay({
  profile,
  preferences,
  colorOptions,
  followingCount,
  onEdit,
  signOut,
}: ProfileDisplayProps) {
  const zodiacSign = profile.zodiac_sign || "";
  const hasAboutData = profile.birth_date || profile.gender || profile.location || zodiacSign;
  const sizeData = [
    { label: "Camisa", value: profile.shirt_size },
    { label: "Pantalón", value: profile.pants_size },
    { label: "Zapatos", value: profile.shoe_size },
  ].filter((s) => s.value);
  const hasSizeData = sizeData.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "#F8F8FB" }}>
      <div className="mx-auto" style={{ maxWidth: 430, padding: 20 }}>

        {/* Profile Header */}
        <div className="flex items-start gap-6 mt-4">
          <div className="relative shrink-0">
            <div className="w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] rounded-full p-[3px]" style={{ background: "linear-gradient(135deg, #FF59C7, #7B61FF)" }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                  <AvatarFallback className="text-4xl">
                    {profile.display_name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="font-display text-[28px] sm:text-[34px] leading-tight text-[#1B1B2D] break-words">
              @{profile.username}
            </h1>
            <p className="text-[18px] sm:text-[22px] font-medium text-[#55566A] mt-0.5">
              {profile.display_name}
            </p>
            {profile.birth_date && (
              <p className="text-[16px] sm:text-[18px] leading-[1.5] text-[#6E7080] mt-1">
                {zodiacSign}
              </p>
            )}
            <p className="text-sm text-[#8C8F9E] mt-2">{followingCount} following</p>
          </div>
        </div>

        {/* Edit button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-[#7B61FF] hover:text-[#6B4EFF] hover:bg-[#F3EEFF]"
          >
            <Settings className="size-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* About Me Card */}
        {hasAboutData && (
          <Card className="mt-6">
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-1">About me</h3>
            <div className="divide-y divide-[#F3F4F7]">
              <ProfileRow label="Fecha de nacimiento" value={formatDate(profile.birth_date || "")} />
              <ProfileRow label="Ubicación" value={profile.location} />
              <ProfileRow label="Género" value={profile.gender} />
              <ProfileRow label="Signo zodiacal" value={zodiacSign} />
            </div>
          </Card>
        )}

        {/* Sizes + Colors Row */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {hasSizeData && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-[#1B1B2D] mb-3 uppercase tracking-wide">Tallas</h3>
              <div className="space-y-2.5">
                {sizeData.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-[#8C8F9E]">{s.label}</span>
                    <span className="text-sm font-semibold text-[#1B1B2D]">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {(() => {
            const colors = preferences["Colores favoritos"] || [];
            if (colors.length === 0) return null;
            return (
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-[#1B1B2D] mb-3 uppercase tracking-wide">Colores fav</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {colors.map((c) => (
                    <div key={c.id} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-[32px] h-[32px] rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: getColorHex(c.item_value, colorOptions), boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
                      />
                      <span className="text-[9px] text-[#5E6173] capitalize">{c.item_value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </div>

        {/* Dynamic Preference Categories (exclude Colores favoritos) */}
        {Object.entries(preferences).map(([catName, items]) => {
          if (catName === "Colores favoritos") return null;
          return (
            <Card key={catName} className="mt-6">
              <h3 className="text-sm font-semibold text-[#1B1B2D] mb-3">{catName}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Chip key={item.id}>{item.item_value}</Chip>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Logout */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={signOut}
            className="text-sm text-[#8C8F9E] hover:text-[#EF4444] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="h-8" />

      </div>
    </div>
  );
}
