import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "./DirectoryClient";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  const { data: availability } = await supabase
    .from("availability")
    .select("*");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Find a tennis partner</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Browse INSEAD students across Fontainebleau and Singapore. Sign in
        to add yourself to the directory.
      </p>
      <DirectoryClient
        profiles={profiles ?? []}
        availability={availability ?? []}
      />
    </main>
  );
}
