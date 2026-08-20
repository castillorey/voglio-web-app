import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Cake, MapPin, Shirt, Palette } from "lucide-react";
import { IProfile } from "@/services/profile";
import { PreferenceMap } from "@/services/preferences";
import { Card, Chip, ProfileRow } from "./profile-shared";
import { getColorHex, formatDate } from "./profile-utils";
import { getCurrencySymbol } from "./profile-currencies";
import { useTranslation } from "react-i18next";

interface ProfileDisplayProps {
  profile: IProfile;
  preferences: PreferenceMap;
  colorOptions: { name: string; hex: string }[];
  followingCount: number;
  onEdit: () => void;
  signOut: () => void;
  city?: string;
  currency?: string;
}

export default function ProfileDisplay({
  profile,
  preferences,
  colorOptions,
  followingCount,
  onEdit,
  signOut,
  city,
  currency,
}: ProfileDisplayProps) {
  const { t, i18n } = useTranslation();
  const zodiacSign = profile.zodiac_sign || "";
  const hasAboutData = profile.birth_date || profile.gender || profile.location || profile.city || zodiacSign;
  const sizingFormat = profile.sizing_format || "US";
  const sizeData = [
    { label: t("profile.shirt"), value: profile.shirt_size },
    { label: t("profile.pants"), value: profile.pants_size },
    { label: t("profile.shoe"), value: profile.shoe_size },
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
            <p className="text-sm text-[#8C8F9E] mt-2">{followingCount} {t("friends.following")}</p>
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
            {t("common.edit")}
          </Button>
        </div>

        {/* Empty state */}
        {!hasAboutData && !hasSizeData && Object.keys(preferences).length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-[#E0E1E8] p-6 text-center">
            <p className="text-sm font-medium text-[#1B1B2D]">
              {t("profile.emptyProfile")}
            </p>
            <p className="text-xs text-[#6B6E85] mt-1">
              {t("profile.tapEditToAdd")}
            </p>
            <div className="flex justify-center gap-4 mt-5">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#FFF0F5] flex items-center justify-center">
                  <Cake className="size-4 text-[#FF59C7]" />
                </div>
                <span className="text-[10px] text-[#8C8F9E]">{t("profile.birthday")}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center">
                  <MapPin className="size-4 text-[#4A8CFF]" />
                </div>
                <span className="text-[10px] text-[#8C8F9E]">{t("profile.location")}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#F0FFF4] flex items-center justify-center">
                  <Shirt className="size-4 text-[#34C759]" />
                </div>
                <span className="text-[10px] text-[#8C8F9E]">{t("profile.sizes")}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#FFF8EE] flex items-center justify-center">
                  <Palette className="size-4 text-[#FF9F0A]" />
                </div>
                <span className="text-[10px] text-[#8C8F9E]">{t("profile.colors")}</span>
              </div>
            </div>
          </div>
        )}

        {/* About Me Card */}
        {hasAboutData && (
          <Card className="mt-6">
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-1">{t("profile.aboutMe")}</h3>
            <div className="divide-y divide-[#F3F4F7]">
              <ProfileRow label={t("profile.birthDate")} value={formatDate(profile.birth_date || "")} />
              <ProfileRow label={t("profile.location")} value={profile.location ? (city ? `${profile.location}, ${city}` : profile.location) : (city || undefined)} />
              <ProfileRow label={t("profile.currency")} value={currency ? `${getCurrencySymbol(currency)} — ${getCurrencyName(currency)}` : undefined} />
              <ProfileRow label={t("profile.gender")} value={profile.gender} />
              <ProfileRow label={t("profile.zodiacSign")} value={zodiacSign} />
            </div>
          </Card>
        )}

        {/* Sizes + Colors Row */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {hasSizeData && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#1B1B2D] uppercase tracking-wide">{t("profile.sizes")}</h3>
                <span className="text-[10px] font-medium text-[#8C8F9E] bg-[#F0F1F6] px-2 py-0.5 rounded">{sizingFormat}</span>
              </div>
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
                <h3 className="text-xs font-semibold text-[#1B1B2D] mb-3 uppercase tracking-wide">{t("profile.favoriteColors")}</h3>
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
            {t("auth.signOut")}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="mt-4 flex justify-center">
          <div className="flex rounded-lg border border-[#E8E9EE] overflow-hidden">
            {[
              { value: "en", label: "EN" },
              { value: "es", label: "ES" },
              { value: "pt", label: "PT" },
            ].map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => i18n.changeLanguage(lang.value)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  i18n.language === lang.value
                    ? "bg-[#1B1B2D] text-white"
                    : "bg-white text-[#8C8F9E] hover:text-[#1B1B2D]"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-8" />

      </div>
    </div>
  );
}
