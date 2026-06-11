export function getColorHex(color: string, colors: { name: string; hex: string }[]): string {
  const trimmed = color.trim().toLowerCase();
  const found = colors.find((c) => c.name.toLowerCase() === trimmed);
  return found?.hex || "#CBD5E1";
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export function getZodiacSign(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Tauro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Géminis";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cáncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitario";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricornio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Acuario";
  return "Piscis";
}
