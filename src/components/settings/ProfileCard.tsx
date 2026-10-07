"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { SettingsCard, field } from "./SettingsCard";
import { DefaultAvatar } from "../brand";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc } from "@/lib/store";

export function ProfileCard() {
  const profile = useWinterArc((s) => s.profile);
  const setProfile = useWinterArc((s) => s.setProfile);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    const apply = () => {
      setProfile({ name: name.trim(), email: email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    };
    requireAuth({ route: "/settings", label: "Change profile", replay: apply });
  };

  return (
    <SettingsCard
      icon={<User className="h-6 w-6 text-accent" />}
      title="Profile"
      sub="Manage your basic information."
    >
      <div className="flex items-center gap-4">
        <DefaultAvatar name={name.trim() || profile.name} className="h-16 w-16 text-xl" />
        <div className="min-w-0 flex-1">
          <label htmlFor="pf-name" className="text-sm text-muted">Name</label>
          <input
            id="pf-name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); setSaved(false); }}
            maxLength={30}
            className={`${field} mt-0.5`}
          />
        </div>
      </div>
      <label htmlFor="pf-email" className="mt-3 block text-sm text-muted">Email</label>
      <input
        id="pf-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); setSaved(false); }}
        aria-invalid={!!error}
        aria-describedby={error ? "profile-error" : undefined}
        maxLength={60}
        placeholder="you@example.com"
        className={`${field} mt-0.5`}
      />
      {error && <p id="profile-error" role="alert" className="mt-2 text-sm text-red-500">{error}</p>}
      <button
        onClick={save}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
      >
        {saved ? "SAVED ✓" : "SAVE"}
      </button>
    </SettingsCard>
  );
}
