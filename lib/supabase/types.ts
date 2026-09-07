export type Cohort = "MIM '28" | "MBA '27J" | "MBA '26D" | "Executive MBA" | "Other";
export type Campus = "Fontainebleau" | "Singapore";
export type SkillTier =
  | "Beginner"
  | "Improver"
  | "Intermediate"
  | "Advanced"
  | "Semi-professional/ex-professional";
export type Intensity = "Casual rally" | "Competitive match" | "Either";
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type TimeBlock = "morning" | "afternoon" | "evening";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  cohort: Cohort;
  cohort_other: string | null;
  campus: Campus;
  skill_tier: SkillTier;
  nationality: string | null;
  years_playing: number | null;
  whatsapp: string | null;
  intensity: Intensity | null;
  bio: string | null;
  created_at: string;
};

export type AvailabilityRow = {
  id: string;
  user_id: string;
  day_of_week: DayOfWeek;
  time_block: TimeBlock;
};

// NOTE: this must be a `type`, not an `interface` — with an interface here,
// the current @supabase/supabase-js (2.116.x) generic defaults resolve
// Insert/Update to `never` and every .insert()/.upsert() call fails to
// type-check. Verified empirically; keep as `type`.
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at"> & { created_at?: string };
        Update: Partial<Omit<ProfileRow, "id">>;
        Relationships: [];
      };
      availability: {
        Row: AvailabilityRow;
        Insert: Omit<AvailabilityRow, "id"> & { id?: string };
        Update: Partial<Omit<AvailabilityRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
