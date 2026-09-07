// Display-only privacy masking for unauthenticated visitors to the public
// directory. This does not affect the database or RLS — a determined
// visitor could still read full data straight from the Supabase API — it
// just keeps the normal page markup from showing more than a public,
// unauthenticated view needs.

export function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return fullName;
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${first} ${lastInitial}.`;
}

export function maskWhatsapp(raw: string): string {
  const value = raw.trim();
  if (!value) return value;

  const hasPlus = value.startsWith("+");
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return value;

  const firstToken = value.split(/\s+/)[0] ?? "";
  const firstTokenDigits = firstToken.replace(/\D/g, "");
  const countryCodeLength =
    hasPlus && firstTokenDigits.length > 0 && firstTokenDigits.length <= 3
      ? firstTokenDigits.length
      : Math.min(2, digits.length);

  const countryCode = digits.slice(0, countryCodeLength);
  const rest = digits.slice(countryCodeLength);
  const revealCount = Math.min(1, rest.length);

  const groups: string[] = [];
  for (let i = 0; i < rest.length; i += 3) {
    const chunk = rest.slice(i, i + 3);
    let group = "";
    for (let j = 0; j < chunk.length; j++) {
      group += i + j < revealCount ? chunk[j] : "X";
    }
    groups.push(group);
  }

  return [`${hasPlus ? "+" : ""}${countryCode}`, ...groups]
    .filter(Boolean)
    .join(" ");
}
