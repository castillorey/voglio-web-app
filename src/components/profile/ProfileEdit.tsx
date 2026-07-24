import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Camera, Plus, Trash2, LogOut } from "lucide-react";
import { RefObject } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProfile } from "@/services/profile";
import {
  addPreferenceItem,
  removePreferenceItem,
  deletePreferenceCategory,
  PreferenceMap,
} from "@/services/preferences";
import { Card } from "./profile-shared";
import { getColorHex } from "./profile-utils";
import { SIZES, SIZING_FORMATS, SizingFormat } from "./profile-sizes";
import { useTranslation } from "react-i18next";

const GENDER_OPTIONS = ["", "Male", "Female", "Non-binary", "Other", "Prefer not to say"];

interface ProfileEditProps {
  profile: IProfile;
  displayName: string;
  setDisplayName: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  shirtSize: string;
  setShirtSize: (v: string) => void;
  pantsSize: string;
  setPantsSize: (v: string) => void;
  shoeSize: string;
  setShoeSize: (v: string) => void;
  sizingFormat: SizingFormat;
  setSizingFormat: (v: SizingFormat) => void;
  preferences: PreferenceMap;
  setPreferences: (p: PreferenceMap | ((prev: PreferenceMap) => PreferenceMap)) => void;
  newPrefItem: Record<string, string>;
  setNewPrefItem: (p: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  newPrefCategory: string;
  setNewPrefCategory: (v: string) => void;
  colorOptions: { name: string; hex: string }[];
  saving: boolean;
  uploading: boolean;
  currentUserId: string;
  onSave: () => void;
  onCancel: () => void;
  onSignOut: () => void;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatarInputRef: RefObject<HTMLInputElement>;
}

export default function ProfileEdit({
  profile,
  displayName, setDisplayName,
  birthDate, setBirthDate,
  gender, setGender,
  location, setLocation,
  shirtSize, setShirtSize,
  pantsSize, setPantsSize,
  shoeSize, setShoeSize,
  sizingFormat, setSizingFormat,
  preferences, setPreferences,
  newPrefItem, setNewPrefItem,
  newPrefCategory, setNewPrefCategory,
  colorOptions,
  saving,
  uploading,
  currentUserId,
  onSave,
  onCancel,
  onSignOut,
  onAvatarUpload,
  avatarInputRef,
}: ProfileEditProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen" style={{ background: "#F8F8FB" }}>
      <div className="mx-auto" style={{ maxWidth: 430, padding: 20 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-[#1B1B2D]">{t("profile.editProfile")}</h2>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-[#7B61FF]">
            {t("common.cancel")}
          </Button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <div className="w-[120px] h-[120px] rounded-full p-[3px]" style={{ background: "linear-gradient(135deg, #FF59C7, #7B61FF)" }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                  <AvatarFallback className="text-3xl">
                    {profile.display_name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="size-6 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <span className="text-xs text-white">...</span>
              </div>
            )}
          </div>
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={onAvatarUpload}
          className="sr-only"
        />

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-4">{t("profile.basicInfo")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-xs text-[#8C8F9E]">{t("profile.displayName")}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-xs text-[#8C8F9E]">{t("profile.location")}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder={t("profile.locationPlaceholder")}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-4">{t("profile.personal")}</h3>
            <div className="space-y-4">
              <DatePicker
                id="birthDate"
                label={t("profile.birthDate")}
                value={birthDate}
                onChange={setBirthDate}
              />
              <div>
                <Label htmlFor="gender" className="text-xs text-[#8C8F9E]">{t("profile.gender")}</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-[#F0F1F6] bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B61FF]"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt || t("common.select")}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1B1B2D]">{t("profile.sizes")}</h3>
              <div className="flex rounded-lg border border-[#E8E9EE] overflow-hidden">
                {SIZING_FORMATS.map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => { setSizingFormat(fmt.value); setShirtSize(""); setPantsSize(""); setShoeSize(""); }}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      sizingFormat === fmt.value
                        ? "bg-[#1B1B2D] text-white"
                        : "bg-white text-[#8C8F9E] hover:text-[#1B1B2D]"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="shirtSize" className="text-xs text-[#8C8F9E]">{t("profile.shirt")}</Label>
                <select
                  id="shirtSize"
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-[#F0F1F6] bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B61FF]"
                >
                  <option value="">{t("common.select")}</option>
                  {SIZES[sizingFormat].shirt.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="pantsSize" className="text-xs text-[#8C8F9E]">{t("profile.pants")}</Label>
                <select
                  id="pantsSize"
                  value={pantsSize}
                  onChange={(e) => setPantsSize(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-[#F0F1F6] bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B61FF]"
                >
                  <option value="">{t("common.select")}</option>
                  {SIZES[sizingFormat].pants.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="shoeSize" className="text-xs text-[#8C8F9E]">{t("profile.shoe")}</Label>
                <select
                  id="shoeSize"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-[#F0F1F6] bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7B61FF]"
                >
                  <option value="">{t("common.select")}</option>
                  {SIZES[sizingFormat].shoe.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-4">{t("profile.favoriteColors")}</h3>
            {(() => {
              const colors = preferences["Colores favoritos"] || [];
              return (
                <>
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {colors.map((c) => (
                        <div key={c.id} className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <div
                              className="w-[36px] h-[36px] rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: getColorHex(c.item_value, colorOptions), boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
                            />
                            <button
                              onClick={async () => {
                                await removePreferenceItem(c.id);
                                setPreferences((prev) => {
                                  const next = { ...prev };
                                  next["Colores favoritos"] = next["Colores favoritos"].filter((i) => i.id !== c.id);
                                  if (next["Colores favoritos"].length === 0) delete next["Colores favoritos"];
                                  return next;
                                });
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          </div>
                          <span className="text-[10px] text-[#5E6173] capitalize">{c.item_value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Select onValueChange={async (val) => {
                    const item = await addPreferenceItem(currentUserId, "Colores favoritos", val, colors.length);
                    setPreferences((prev) => ({
                      ...prev,
                      "Colores favoritos": [...(prev["Colores favoritos"] || []), item],
                    }));
                  }}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={t("profile.addColor")} />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                            {c.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              );
            })()}
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-[#1B1B2D] mb-4">{t("profile.customPreferences")}</h3>

            {Object.entries(preferences).filter(([catName]) => catName !== "Colores favoritos").map(([catName, items]) => (
              <div key={catName} className="mb-4 pb-4 border-b border-[#F3F4F7] last:border-b-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1B1B2D]">{catName}</span>
                  <button
                    onClick={async () => {
                      await deletePreferenceCategory(currentUserId, catName);
                      const { [catName]: _, ...rest } = preferences;
                      setPreferences(rest);
                    }}
                    className="text-[#8C8F9E] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {items.map((item) => (
                    <span key={item.id} className="inline-flex items-center gap-1 px-[10px] py-[4px] rounded-full text-xs text-[#5E6173] bg-[#F7F7FA] border border-[#ECECF2]">
                      {item.item_value}
                      <button
                        onClick={async () => {
                          await removePreferenceItem(item.id);
                          setPreferences((prev) => {
                            const next = { ...prev };
                            next[catName] = next[catName].filter((i) => i.id !== item.id);
                            if (next[catName].length === 0) delete next[catName];
                            return next;
                          });
                        }}
                        className="text-[#8C8F9E] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Input
                    value={newPrefItem[catName] || ""}
                    onChange={(e) => setNewPrefItem((prev) => ({ ...prev, [catName]: e.target.value }))}
                    placeholder={t("profile.addItem")}
                    className="h-8 text-xs flex-1"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && newPrefItem[catName]?.trim()) {
                        const item = await addPreferenceItem(currentUserId, catName, newPrefItem[catName].trim(), items.length);
                        setPreferences((prev) => ({
                          ...prev,
                          [catName]: [...(prev[catName] || []), item],
                        }));
                        setNewPrefItem((prev) => ({ ...prev, [catName]: "" }));
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-[#7B61FF]"
                    onClick={async () => {
                      const val = newPrefItem[catName]?.trim();
                      if (!val) return;
                      const item = await addPreferenceItem(currentUserId, catName, val, items.length);
                      setPreferences((prev) => ({
                        ...prev,
                        [catName]: [...(prev[catName] || []), item],
                      }));
                      setNewPrefItem((prev) => ({ ...prev, [catName]: "" }));
                    }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-4 pt-4 border-t border-[#F3F4F7]">
              <Input
                value={newPrefCategory}
                onChange={(e) => setNewPrefCategory(e.target.value)}
                placeholder={t("profile.newCategoryName")}
                className="h-9 text-sm flex-1"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && newPrefCategory.trim()) {
                    const name = newPrefCategory.trim();
                    setPreferences((prev) => ({ ...prev, [name]: [] }));
                    setNewPrefCategory("");
                  }
                }}
              />
              <Button
                size="sm"
                className="shrink-0 h-9 bg-[#7B61FF] hover:bg-[#6B4EFF] text-white"
                onClick={async () => {
                  const name = newPrefCategory.trim();
                  if (!name || preferences[name]) return;
                  setPreferences((prev) => ({ ...prev, [name]: [] }));
                  setNewPrefCategory("");
                }}
              >
                <Plus className="size-4 mr-1" /> {t("common.add")}
              </Button>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={onSave} disabled={saving} className="flex-1 bg-[#7B61FF] hover:bg-[#6B4EFF] text-white">
              {saving ? t("common.saving") : t("common.save")}
            </Button>
            <Button variant="outline" onClick={onSignOut} className="border-[#F0F1F6] text-[#5E6173]">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
