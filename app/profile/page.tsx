import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", user.id);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">My profile</h1>
      <p className="mt-1 text-sm text-neutral-500">
        This is what other students will see in the directory.
      </p>
      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        profile={profile}
        availability={availability ?? []}
      />
    </main>
  );
}
