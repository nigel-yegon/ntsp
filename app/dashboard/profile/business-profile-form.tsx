// app/dashboard/profile/business-profile-form.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BusinessVerificationBadge } from "@/app/components/dashboard/business-verification-badge";
import { updateBusinessProfile } from "./profile-actions";
import { Field, ReadOnlyField, Errors, SavedBanner } from "./customer-profile-form";
import type { BusinessVerification } from "@/lib/db-types";
import { ImageUpload } from "@/app/components/image-upload";

type BusinessProfileData = {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    registrationNo: string;
    kraPin: string;
    website: string;
    description: string;
    logoUrl: string;
    verificationStatus: BusinessVerification;
};

export function BusinessProfileForm({
    defaultName,
    defaultPhone,
    email,
    profile,
}: {
    defaultName: string;
    defaultPhone: string;
    email: string;
    profile: BusinessProfileData;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [errors, setErrors] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);

    // User fields
    const [name, setName] = useState(defaultName);
    const [phone, setPhone] = useState(defaultPhone);

    // Business fields
    const [businessName, setBusinessName] = useState(profile.businessName);
    const [contactEmail, setContactEmail] = useState(profile.contactEmail);
    const [contactPhone, setContactPhone] = useState(profile.contactPhone);
    const [registrationNo, setRegistrationNo] = useState(profile.registrationNo);
    const [kraPin, setKraPin] = useState(profile.kraPin);
    const [website, setWebsite] = useState(profile.website);
    const [description, setDescription] = useState(profile.description);
    const [logoUrl, setLogoUrl] = useState(profile.logoUrl);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors([]);
        setSaved(false);

        startTransition(async () => {
            const result = await updateBusinessProfile({
                name,
                phone,
                businessName,
                contactEmail,
                contactPhone,
                registrationNo,
                kraPin,
                website,
                description,
                logoUrl,
            });
            if (!result.ok) {
                setErrors(result.errors);
                return;
            }
            setSaved(true);
            router.refresh();
        });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {profile.verificationStatus === "PENDING" && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    Your business is awaiting administrator review. You can edit your
                    details now — changes will be visible once approved.
                </p>
            )}
            {profile.verificationStatus === "SUSPENDED" && (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Your business is currently suspended. Contact the administrator to
                    restore access.
                </p>
            )}

            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
                        Your details
                    </h3>
                    <BusinessVerificationBadge status={profile.verificationStatus} />
                </div>

                <div className="space-y-5">
                    <Field label="Your full name" value={name} onChange={setName} required />
                    <Field
                        label="Your phone number"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+254 700 000 000"
                        hint="Optional. Not shown publicly."
                    />
                    <ReadOnlyField
                        label="Sign-in email"
                        value={email}
                        hint="Contact support to change the email on your account."
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
                    Business details
                </h3>

                <div className="space-y-5">
                    <Field
                        label="Business name"
                        value={businessName}
                        onChange={setBusinessName}
                        required
                    />
                    <Field
                        label="Public contact email"
                        type="email"
                        value={contactEmail}
                        onChange={setContactEmail}
                        required
                        hint="Shown to customers on your listings. Can differ from your sign-in email."
                    />
                    <Field
                        label="Public contact phone"
                        value={contactPhone}
                        onChange={setContactPhone}
                        placeholder="+254 700 000 000"
                    />
                    <Field
                        label="Business registration number"
                        value={registrationNo}
                        onChange={setRegistrationNo}
                        hint="Optional. Helps speed up verification."
                    />
                    <Field label="KRA PIN" value={kraPin} onChange={setKraPin} />
                    <Field
                        label="Website"
                        value={website}
                        onChange={setWebsite}
                        placeholder="https://example.com"
                    />
                    <Field
                        label="Short description"
                        as="textarea"
                        value={description}
                        onChange={setDescription}
                        rows={4}
                        hint="Appears on your public listings."
                    />
                    <ImageUpload
                        label="Business logo"
                        value={logoUrl}
                        onChange={setLogoUrl}
                        hint="Shown to customers on your listings and messages."
                        maxSizeMb={2}
                        aspect="square"
                    />
                </div>
            </div>

            {errors.length > 0 && <Errors errors={errors} />}
            {saved && <SavedBanner />}

            <div>
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
                >
                    {pending ? "Saving…" : "Save changes"}
                </button>
            </div>
        </form>
    );
}