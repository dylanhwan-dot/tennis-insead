"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CAMPUSES,
  COHORTS,
  DAYS_OF_WEEK,
  INTENSITIES,
  SKILL_TIER_DESCRIPTIONS,
  SKILL_TIERS,
  TIME_BLOCKS,
} from "@/lib/constants";
import type {
  AvailabilityRow,
  Campus,
  Cohort,
  DayOfWeek,
  Intensity,
  ProfileRow,
  SkillTier,
  TimeBlock,
} from "@/lib/supabase/types";

type Props = {
  userId: string;
  email: string;
  profile: ProfileRow | null;
  availability: AvailabilityRow[];
};

function slotKey(day: DayOfWeek, block: TimeBlock) {
  return `${day}-${block}`;
}

export default function ProfileForm({
  userId,
  email,
  profile,
  availability,
}: Props) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [cohort, setCohort] = useState<Cohort>(profile?.cohort ?? COHORTS[0]);
  const [cohortOther, setCohortOther] = useState(profile?.cohort_other ?? "");
  const [campus, setCampus] = useState<Campus>(
    profile?.campus ?? CAMPUSES[0],
  );
  const [skillTier, setSkillTier] = useState<SkillTier>(
    profile?.skill_tier ?? SKILL_TIERS[0],
  );
  const [nationality, setNationality] = useState(profile?.nationality ?? "");
  const [yearsPlaying, setYearsPlaying] = useState(
    profile?.years_playing?.toString() ?? "",
  );
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [intensity, setIntensity] = useState<Intensity | "">(
    profile?.intensity ?? "",
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [slots, setSlots] = useState<Set<string>>(
    new Set(availability.map((a) => slotKey(a.day_of_week, a.time_block))),
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  function toggleSlot(day: DayOfWeek, block: TimeBlock) {
    const key = slotKey(day, block);
    setSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage("");
    const supabase = createClient();

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name: fullName.trim(),
      cohort,
      cohort_other: cohort === "Other" ? cohortOther.trim() : null,
      campus,
      skill_tier: skillTier,
      nationality: nationality.trim() || null,
      years_playing: yearsPlaying ? Number(yearsPlaying) : null,
      whatsapp: whatsapp.trim() || null,
      intensity: intensity || null,
      bio: bio.trim() || null,
    });

    if (profileError) {
      setStatus("error");
      setErrorMessage(profileError.message);
      return;
    }

    await supabase.from("availability").delete().eq("user_id", userId);

    const rows = Array.from(slots).map((key) => {
      const [day, block] = key.split("-") as [DayOfWeek, TimeBlock];
      return { user_id: userId, day_of_week: day, time_block: block };
    });

    if (rows.length > 0) {
      const { error: availabilityError } = await supabase
        .from("availability")
        .insert(rows);
      if (availabilityError) {
        setStatus("error");
        setErrorMessage(availabilityError.message);
        return;
      }
    }

    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <Field label="Full name">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Cohort">
        <select
          value={cohort}
          onChange={(e) => setCohort(e.target.value as Cohort)}
          className="input"
        >
          {COHORTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {cohort === "Other" && (
          <input
            required
            placeholder="e.g. PhD, Exchange…"
            value={cohortOther}
            onChange={(e) => setCohortOther(e.target.value)}
            className="input mt-2"
          />
        )}
      </Field>

      <Field label="Campus">
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value as Campus)}
          className="input"
        >
          {CAMPUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-700">
          Skill tier
        </span>
        <div role="radiogroup" className="flex flex-col gap-2">
          {SKILL_TIERS.map((t) => {
            const active = skillTier === t;
            return (
              <label
                key={t}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-md border px-3 py-2 transition ${
                  active
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="skill_tier"
                    value={t}
                    checked={active}
                    onChange={() => setSkillTier(t)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-sm font-medium text-neutral-900">
                    {t}
                  </span>
                </span>
                <span className="pl-5 text-xs text-neutral-500">
                  {SKILL_TIER_DESCRIPTIONS[t]}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Field label="Preferred intensity (optional)">
        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value as Intensity | "")}
          className="input"
        >
          <option value="">—</option>
          {INTENSITIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Nationality (optional)">
        <input
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Years playing (optional)">
        <input
          type="number"
          min={0}
          max={80}
          value={yearsPlaying}
          onChange={(e) => setYearsPlaying(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="WhatsApp number (optional)">
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          className="input"
        />
      </Field>

      <Field label={`Bio (optional, max 80 characters) — ${bio.length}/80`}>
        <textarea
          maxLength={80}
          rows={2}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="input resize-none"
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-700">
          Availability
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-1 text-left text-xs font-normal text-neutral-400">
                  &nbsp;
                </th>
                {TIME_BLOCKS.map((block) => (
                  <th
                    key={block}
                    className="p-1 text-center text-xs font-medium capitalize text-neutral-500"
                  >
                    {block}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((day) => (
                <tr key={day}>
                  <td className="p-1 text-xs text-neutral-600">{day}</td>
                  {TIME_BLOCKS.map((block) => {
                    const active = slots.has(slotKey(day, block));
                    return (
                      <td key={block} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSlot(day, block)}
                          aria-pressed={active}
                          className={`h-7 w-full rounded-md border text-xs transition ${
                            active
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-400"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      {status === "saved" && (
        <p className="text-sm text-emerald-700">Profile saved.</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}
