"use client";

import { useMemo, useState } from "react";
import {
  CAMPUSES,
  DAYS_OF_WEEK,
  INTENSITIES,
  SKILL_TIERS,
  TIME_BLOCKS,
} from "@/lib/constants";
import type {
  AvailabilityRow,
  Campus,
  DayOfWeek,
  Intensity,
  ProfileRow,
  SkillTier,
  TimeBlock,
} from "@/lib/supabase/types";

type Props = {
  profiles: ProfileRow[];
  availability: AvailabilityRow[];
};

const ANY = "Any";

export default function DirectoryClient({ profiles, availability }: Props) {
  const [campus, setCampus] = useState<Campus | typeof ANY>(ANY);
  const [skillTier, setSkillTier] = useState<SkillTier | typeof ANY>(ANY);
  const [intensity, setIntensity] = useState<Intensity | typeof ANY>(ANY);
  const [day, setDay] = useState<DayOfWeek | typeof ANY>(ANY);
  const [timeBlock, setTimeBlock] = useState<TimeBlock | typeof ANY>(ANY);

  const availabilityByUser = useMemo(() => {
    const map = new Map<string, AvailabilityRow[]>();
    for (const row of availability) {
      const list = map.get(row.user_id) ?? [];
      list.push(row);
      map.set(row.user_id, list);
    }
    return map;
  }, [availability]);

  const filtered = profiles.filter((p) => {
    if (campus !== ANY && p.campus !== campus) return false;
    if (skillTier !== ANY && p.skill_tier !== skillTier) return false;
    if (intensity !== ANY && p.intensity !== intensity) return false;

    if (day !== ANY || timeBlock !== ANY) {
      const slots = availabilityByUser.get(p.id) ?? [];
      const matches = slots.some(
        (s) =>
          (day === ANY || s.day_of_week === day) &&
          (timeBlock === ANY || s.time_block === timeBlock),
      );
      if (!matches) return false;
    }

    return true;
  });

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Select
          label="Campus"
          value={campus}
          onChange={setCampus}
          options={CAMPUSES}
        />
        <Select
          label="Skill tier"
          value={skillTier}
          onChange={setSkillTier}
          options={SKILL_TIERS}
        />
        <Select
          label="Intensity"
          value={intensity}
          onChange={setIntensity}
          options={INTENSITIES}
        />
        <Select label="Day" value={day} onChange={setDay} options={DAYS_OF_WEEK} />
        <Select
          label="Time"
          value={timeBlock}
          onChange={setTimeBlock}
          options={TIME_BLOCKS}
          capitalize
        />
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        {filtered.length} of {profiles.length} students
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-medium text-neutral-900">{p.full_name}</h2>
              <span className="shrink-0 text-xs text-neutral-400">
                {p.campus}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">
              {p.cohort === "Other" && p.cohort_other
                ? p.cohort_other
                : p.cohort}{" "}
              · {p.skill_tier}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
              {p.intensity && <span>{p.intensity}</span>}
              {p.nationality && <span>{p.nationality}</span>}
              {p.years_playing !== null && (
                <span>
                  {p.years_playing} yr{p.years_playing === 1 ? "" : "s"}{" "}
                  playing
                </span>
              )}
            </div>

            {p.bio && (
              <p className="mt-2 text-sm text-neutral-700">{p.bio}</p>
            )}

            <AvailabilityTags rows={availabilityByUser.get(p.id) ?? []} />

            {p.whatsapp && (
              <p className="mt-2 text-xs text-neutral-500">
                WhatsApp: {p.whatsapp}
              </p>
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-neutral-400">
          No students match these filters yet.
        </p>
      )}
    </>
  );
}

function AvailabilityTags({ rows }: { rows: AvailabilityRow[] }) {
  if (rows.length === 0) return null;

  const byDay = new Map<DayOfWeek, TimeBlock[]>();
  for (const row of rows) {
    const list = byDay.get(row.day_of_week) ?? [];
    list.push(row.time_block);
    byDay.set(row.day_of_week, list);
  }

  return (
    <p className="mt-2 text-xs text-neutral-400">
      {DAYS_OF_WEEK.filter((d) => byDay.has(d))
        .map((d) => `${d.slice(0, 3)} ${byDay.get(d)!.join("/")}`)
        .join(", ")}
    </p>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  capitalize,
}: {
  label: string;
  value: T | typeof ANY;
  onChange: (value: T | typeof ANY) => void;
  options: readonly T[];
  capitalize?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | typeof ANY)}
        className={`input ${capitalize ? "capitalize" : ""}`}
      >
        <option value={ANY}>{ANY}</option>
        {options.map((o) => (
          <option key={o} value={o} className={capitalize ? "capitalize" : ""}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
