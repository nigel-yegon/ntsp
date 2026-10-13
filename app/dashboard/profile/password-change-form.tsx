// app/dashboard/profile/password-change-form.tsx
"use client";

import { useState, useTransition } from "react";
import { changePassword } from "./profile-actions";
import { Field, Errors, SavedBanner } from "./customer-profile-form";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setSaved(false);

    startTransition(async () => {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
    >
      <header>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          Password
        </h3>
        <p className="mt-1 text-xs text-deep-500 dark:text-cream-400">
          Leave blank if you signed up with Google or GitHub — those accounts
          don't have a password.
        </p>
      </header>

      <Field
        label="Current password"
        type="password"
        value={currentPassword}
        onChange={setCurrentPassword}
        required
      />
      <Field
        label="New password"
        type="password"
        value={newPassword}
        onChange={setNewPassword}
        required
        hint="At least 8 characters."
      />
      <Field
        label="Confirm new password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
      />

      {errors.length > 0 && <Errors errors={errors} />}
      {saved && <SavedBanner />}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}