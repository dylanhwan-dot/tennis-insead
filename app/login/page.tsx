"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed.endsWith("@insead.edu")) {
      setStatus("error");
      setErrorMessage("Please use your @insead.edu email address.");
      return;
    }

    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Sign in to Tennis @INSEAD
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Open to current INSEAD MIM and MBA students. Use your @insead.edu
        email to get a magic link.
      </p>

      {status === "sent" ? (
        <p className="mt-6 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Check your inbox at <strong>{email}</strong> for a sign-in link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="you@insead.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
          {status === "error" && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {status === "sending" ? "Sending link…" : "Send magic link"}
          </button>
        </form>
      )}
    </main>
  );
}
