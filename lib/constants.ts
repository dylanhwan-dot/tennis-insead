import type {
  Campus,
  Cohort,
  DayOfWeek,
  Intensity,
  SkillTier,
  TimeBlock,
} from "./supabase/types";

export const COHORTS: Cohort[] = [
  "MIM '28",
  "MBA '27J",
  "MBA '26D",
  "Executive MBA",
  "Other",
];

export const CAMPUSES: Campus[] = ["Fontainebleau", "Singapore"];

export const SKILL_TIERS: SkillTier[] = [
  "Beginner",
  "Improver",
  "Intermediate",
  "Advanced",
  "Semi-professional/ex-professional",
];

export const SKILL_TIER_DESCRIPTIONS: Record<SkillTier, string> = {
  Beginner: "Still learning strokes",
  Improver: "Rallies consistently",
  Intermediate: "Plays competitive points",
  Advanced: "Strong technical game, has competitive match experience",
  "Semi-professional/ex-professional":
    "Currently or previously played (semi-)professional tennis",
};

export const INTENSITIES: Intensity[] = [
  "Casual rally",
  "Competitive match",
  "Either",
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIME_BLOCKS: TimeBlock[] = ["morning", "afternoon", "evening"];
