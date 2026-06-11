import supabase from "../supabase-client";

export interface IUserPreference {
  id: number;
  user_id: string;
  category_name: string;
  item_value: string;
  display_order: number;
}

export type PreferenceMap = Record<string, IUserPreference[]>;

export async function fetchPreferences(userId: string): Promise<IUserPreference[]> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .order("display_order");

  if (error) throw error;
  return data || [];
}

export async function fetchPreferencesGrouped(userId: string): Promise<PreferenceMap> {
  const items = await fetchPreferences(userId);
  const map: PreferenceMap = {};
  for (const item of items) {
    if (!map[item.category_name]) map[item.category_name] = [];
    map[item.category_name].push(item);
  }
  return map;
}

export async function addPreferenceItem(
  userId: string,
  categoryName: string,
  itemValue: string,
  displayOrder?: number
): Promise<IUserPreference> {
  const { data, error } = await supabase
    .from("user_preferences")
    .insert({ user_id: userId, category_name: categoryName, item_value: itemValue, display_order: displayOrder ?? 0 })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removePreferenceItem(id: number): Promise<void> {
  const { error } = await supabase
    .from("user_preferences")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function deletePreferenceCategory(userId: string, categoryName: string): Promise<void> {
  const { error } = await supabase
    .from("user_preferences")
    .delete()
    .eq("user_id", userId)
    .eq("category_name", categoryName);

  if (error) throw error;
}
