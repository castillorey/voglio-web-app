import supabase from "../supabase-client";

export async function fetchTakenVoglioIds(
  voglioIds: number[],
  userId: string
): Promise<Set<number>> {
  if (voglioIds.length === 0 || !userId) return new Set();

  const { data, error } = await supabase
    .from("voglio_taken")
    .select("voglio_id")
    .in("voglio_id", voglioIds)
    .eq("user_id", userId);

  if (error) {
    console.log("Error fetching taken voglios: ", error);
    return new Set();
  }

  return new Set((data || []).map((row) => row.voglio_id));
}

export async function toggleVoglioTaken(
  voglioId: number,
  userId: string,
  currentlyTaken: boolean
): Promise<boolean> {
  if (!userId) return currentlyTaken;

  if (currentlyTaken) {
    const { error } = await supabase
      .from("voglio_taken")
      .delete()
      .eq("voglio_id", voglioId)
      .eq("user_id", userId);

    if (error) {
      console.log("Error unmarking voglio: ", error);
      return true;
    }

    const { count } = await supabase
      .from("voglio_taken")
      .select("*", { count: "exact", head: true })
      .eq("voglio_id", voglioId);

    await supabase
      .from("voglio")
      .update({ is_taken: (count ?? 0) > 0 })
      .eq("id", voglioId);

    return false;
  } else {
    const { error } = await supabase
      .from("voglio_taken")
      .insert({ voglio_id: voglioId, user_id: userId });

    if (error) {
      console.log("Error marking voglio: ", error);
      return false;
    }

    await supabase
      .from("voglio")
      .update({ is_taken: true })
      .eq("id", voglioId);

    return true;
  }
}
