import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "./DirectoryClient";
import { maskName, maskWhatsapp } from "@/lib/mask";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = user !== null;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  const { data: availability } = await supabase
    .from("availability")
    .select("*");

  // Sort by real name first (above), then mask for display so
  // unauthenticated visitors never receive the full name/number in the
  // page's data at all, not just in what's rendered.
  const visibleProfiles = isAuthenticated
    ? (profiles ?? [])
    : (profiles ?? []).map((p) => ({
        ...p,
        full_name: maskName(p.full_name),
        whatsapp: p.whatsapp ? maskWhatsapp(p.whatsapp) : p.whatsapp,
      }));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Find a tennis partner</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Browse INSEAD students across Fontainebleau and Singapore. Sign in
        to add yourself to the directory.
      </p>
      <DirectoryClient
        profiles={visibleProfiles}
        availability={availability ?? []}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
