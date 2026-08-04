import supabase from "../supabase-client";

export async function fetchTakenVoglioIds(
  voglioIds: number[]
): Promise<Map<number, string>> {
  if (voglioIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("voglio_taken")
    .select("voglio_id, user_id")
    .in("voglio_id", voglioIds);

  if (error) {
    console.log("Error fetching taken voglios: ", error);
    return new Map();
  }

  const map = new Map<number, string>();
  for (const row of data || []) {
    map.set(row.voglio_id, row.user_id);
  }
  return map;
}

export async function toggleVoglioTaken(
  voglioId: number,
  currentUserId: string
): Promise<{ taken: boolean; taker: string | null }> {
  if (!currentUserId) return { taken: false, taker: null };

  const { data: rows, error: fetchError } = await supabase
    .from("voglio_taken")
    .select("user_id")
    .eq("voglio_id", voglioId);

  if (fetchError) {
    console.log("Error checking taken state: ", fetchError);
    return { taken: false, taker: null };
  }

  const takenRows = rows || [];
  const myTaken = takenRows.some((r) => r.user_id === currentUserId);
  const otherTaker =
    takenRows.find((r) => r.user_id !== currentUserId)?.user_id ?? null;

  if (myTaken) {
    const { error } = await supabase
      .from("voglio_taken")
      .delete()
      .eq("voglio_id", voglioId)
      .eq("user_id", currentUserId);

    if (error) {
      console.log("Error unmarking voglio: ", error);
      return { taken: true, taker: currentUserId };
    }

    const { count } = await supabase
      .from("voglio_taken")
      .select("*", { count: "exact", head: true })
      .eq("voglio_id", voglioId);

    await supabase
      .from("voglio")
      .update({ is_taken: (count ?? 0) > 0 })
      .eq("id", voglioId);

    return { taken: false, taker: null };
  }

  if (otherTaker) {
    return { taken: true, taker: otherTaker };
  }

  const { error } = await supabase
    .from("voglio_taken")
    .insert({ voglio_id: voglioId, user_id: currentUserId });

  if (error) {
    console.log("Error marking voglio: ", error);
    return { taken: false, taker: null };
  }

  await supabase
    .from("voglio")
    .update({ is_taken: true })
    .eq("id", voglioId);

  return { taken: true, taker: currentUserId };
}
