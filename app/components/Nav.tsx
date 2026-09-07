import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-neutral-900">
          Tennis @INSEAD
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                My profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
