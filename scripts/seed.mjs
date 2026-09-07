// One-off seed script: creates auth users (via the admin API) and matching
// profiles/availability rows for launch demo data.
//
// Usage:
//   node --env-file=.env.local scripts/seed.mjs
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
// environment (see .env.local). The service role key bypasses RLS — never
// hardcode it here, never commit it.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/seed.mjs",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DAY_MAP = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

function parseAvailability(spec) {
  return spec.split(",").flatMap((part) => {
    const [dayAbbrev, blocksStr] = part.trim().split(/\s+/, 2);
    const day = DAY_MAP[dayAbbrev];
    if (!day) throw new Error(`Unknown day abbreviation: "${dayAbbrev}"`);
    return blocksStr
      .split("/")
      .map((time_block) => ({ day_of_week: day, time_block }));
  });
}

function emailFor(fullName) {
  const slug = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining accents (e + accent -> e)
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .join(".");
  return `${slug}@insead.edu`;
}

const people = [
  {
    full_name: "Cédric Akse",
    campus: "Fontainebleau",
    cohort: "MBA '27J",
    skill_tier: "Advanced",
    intensity: "Competitive match",
    nationality: "French",
    whatsapp: "+33612345678",
    availability:
      "Tue morning, Wed evening, Thu evening, Sat morning/afternoon, Sun morning/afternoon",
  },
  {
    full_name: "Nemo van Dam",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Beginner",
    intensity: "Casual rally",
    nationality: "Belgian",
    whatsapp: "+32473456789",
    availability: "Tue afternoon, Thu afternoon, Sat morning, Sun afternoon",
  },
  {
    full_name: "Kiarash Khaleghi",
    campus: "Singapore",
    cohort: "MBA '26D",
    skill_tier: "Beginner",
    intensity: "Casual rally",
    nationality: "Iranian",
    whatsapp: "+989123456789",
    availability: "Wed afternoon, Sat morning, Sun morning/afternoon",
  },
  {
    full_name: "Max Vermeulen",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Intermediate",
    intensity: "Either",
    nationality: "Belgian",
    whatsapp: "+32496123456",
    availability:
      "Tue afternoon, Thu afternoon/evening, Sat afternoon, Sun afternoon/evening",
  },
  {
    full_name: "Philip van Amstel",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Advanced",
    intensity: "Competitive match",
    nationality: "Surinamese",
    whatsapp: "+5978123456",
    availability:
      "Mon evening, Tue morning/evening, Thu morning/evening, Sat morning/afternoon, Sun morning",
  },
  {
    full_name: "Alex Klopper",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Intermediate",
    intensity: "Either",
    nationality: "South African",
    whatsapp: "+27821234567",
    availability:
      "Mon evening, Wed evening, Fri afternoon/evening, Sat morning/afternoon, Sun afternoon",
  },
  {
    full_name: "Lance Kokke",
    campus: "Singapore",
    cohort: "MBA '27J",
    skill_tier: "Advanced",
    intensity: "Competitive match",
    nationality: "Australian",
    whatsapp: "+61412345678",
    availability:
      "Mon morning/evening, Wed morning/evening, Fri morning, Sat morning/afternoon, Sun morning",
  },
  {
    full_name: "Sebastiaan Truyens",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Intermediate",
    intensity: "Either",
    nationality: "Belgian",
    whatsapp: "+32478912345",
    availability: "Tue evening, Wed evening, Sat morning/afternoon, Sun afternoon",
  },
  {
    full_name: "Thymen Tensen",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Advanced",
    intensity: "Competitive match",
    nationality: "German",
    whatsapp: "+491621234567",
    availability:
      "Mon morning, Wed morning/evening, Fri morning, Sat morning/afternoon, Sun morning/afternoon",
  },
  {
    full_name: "David Verboom",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Improver",
    intensity: "Casual rally",
    nationality: "Belgian",
    whatsapp: "+32488765432",
    availability: "Mon afternoon, Wed afternoon, Sat afternoon, Sun afternoon",
  },
  {
    full_name: "Tobias Bijl",
    campus: "Fontainebleau",
    cohort: "MBA '27J",
    skill_tier: "Improver",
    intensity: "Casual rally",
    nationality: "German",
    whatsapp: "+491701234567",
    availability: "Tue afternoon, Thu afternoon, Sat afternoon, Sun morning",
  },
  {
    full_name: "Sam Onland",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Improver",
    intensity: "Either",
    nationality: "Curaçaoan",
    whatsapp: "+5999561234",
    availability: "Mon afternoon, Wed afternoon, Fri afternoon, Sun afternoon/evening",
  },
  {
    full_name: "Matis Sankaranarayanan",
    campus: "Singapore",
    cohort: "MBA '27J",
    skill_tier: "Semi-professional/ex-professional",
    intensity: "Competitive match",
    nationality: "Mauritian",
    whatsapp: "+23057234567",
    availability:
      "Mon morning/afternoon, Tue morning, Wed morning/afternoon, Fri morning, Sat morning/afternoon, Sun morning",
  },
  {
    full_name: "Dirk van Weegen",
    campus: "Fontainebleau",
    cohort: "MIM '28",
    skill_tier: "Intermediate",
    intensity: "Either",
    nationality: "Dutch",
    whatsapp: "+31687654321",
    availability:
      "Tue evening, Thu evening, Fri evening, Sat morning/afternoon/evening, Sun afternoon",
  },
  {
    full_name: "David de Beijer",
    campus: "Fontainebleau",
    cohort: "MBA '26D",
    skill_tier: "Intermediate",
    intensity: "Either",
    nationality: "South African",
    whatsapp: "+27834567891",
    availability:
      "Mon afternoon/evening, Wed evening, Fri evening, Sat afternoon, Sun evening",
  },
  {
    full_name: "Max van Beusekom",
    campus: "Fontainebleau",
    cohort: "MBA '27J",
    skill_tier: "Improver",
    intensity: "Casual rally",
    nationality: "French",
    whatsapp: "+33698765432",
    availability: "Wed evening, Fri evening, Sat afternoon, Sun afternoon",
  },
];

// Idempotent: safe to rerun. Looks up existing auth users by email instead
// of always creating new ones, upserts profiles, and refreshes
// availability rows rather than blindly inserting.

async function loadExistingUsersByEmail() {
  // No direct "get user by email" in the admin API; page through listUsers
  // once up front and index by email.
  const byEmail = new Map();
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    for (const u of data.users) byEmail.set(u.email, u);
    if (data.users.length < perPage) break;
    page++;
  }
  return byEmail;
}

const existingUsersByEmail = await loadExistingUsersByEmail();

let created = 0;
let updated = 0;
let failed = 0;

for (const person of people) {
  const email = emailFor(person.full_name);
  process.stdout.write(`${person.full_name} <${email}> ... `);

  let userId;
  const existing = existingUsersByEmail.get(email);

  if (existing) {
    userId = existing.id;
  } else {
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });
    if (userError) {
      console.log(`FAILED (auth user): ${userError.message}`);
      failed++;
      continue;
    }
    userId = userData.user.id;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: person.full_name,
    cohort: person.cohort,
    cohort_other: null,
    campus: person.campus,
    skill_tier: person.skill_tier,
    nationality: person.nationality,
    years_playing: null,
    whatsapp: person.whatsapp,
    intensity: person.intensity,
    bio: null,
  });

  if (profileError) {
    console.log(`FAILED (profile): ${profileError.message}`);
    failed++;
    continue;
  }

  await supabase.from("availability").delete().eq("user_id", userId);

  const rows = parseAvailability(person.availability).map((a) => ({
    user_id: userId,
    ...a,
  }));

  const { error: availabilityError } = await supabase
    .from("availability")
    .insert(rows);

  if (availabilityError) {
    console.log(`FAILED (availability): ${availabilityError.message}`);
    failed++;
    continue;
  }

  console.log(
    `OK ${existing ? "(reused existing user)" : "(new user)"} — ${rows.length} availability rows`,
  );
  if (existing) updated++;
  else created++;
}

console.log(`\nDone. ${created} created, ${updated} updated, ${failed} failed.`);
