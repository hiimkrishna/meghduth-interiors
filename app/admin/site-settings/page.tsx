// সাইট সেটিংস — এক ফরম: নাম, ফোন, ইমেইল, ঠিকানা।
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { siteSettingsSchema } from "@/packages/contracts/src/site.schema";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from "@/features/admin/site-settings/site-settings.service";
import { ApiError } from "@/lib/api";
import { adminErrorMessage } from "@/features/admin/shared/use-admin-list";
import {
  AdminCard,
  AdminPageHeader,
  ErrorState,
  FieldErrorText,
  LoadingState,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/features/admin/shared/admin-ui";

// চুক্তি থেকেই ক্ষেত্র — বাকি (লোগো/সোশ্যাল) অপরিবর্তিত থাকে।
const settingsFormSchema = siteSettingsSchema.pick({
  siteName: true,
  phone: true,
  email: true,
  address: true,
  footerDescription: true,
  copyright: true,
});
type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSiteSettingsPage(): ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [nonce, setNonce] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: "",
      phone: "",
      email: "",
      address: "",
      footerDescription: "",
      copyright: "",
    },
  });

  useEffect(() => {
    let active = true;
    getAdminSiteSettings()
      .then((s) => {
        if (!active) return;
        reset({
          siteName: s.siteName,
          phone: s.phone ?? "",
          email: s.email ?? "",
          address: s.address ?? "",
          footerDescription: s.footerDescription ?? "",
          copyright: s.copyright ?? "",
        });
        setLoadError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setLoadError(adminErrorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce, reset, router]);

  const onSubmit = async (data: SettingsFormValues): Promise<void> => {
    setSaveError(null);
    setSaved(false);
    try {
      const current = await getAdminSiteSettings();
      await updateAdminSiteSettings({ ...current, ...data });
      setSaved(true);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setSaveError(adminErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Site Settings" />
        <LoadingState />
      </>
    );
  }

  if (loadError !== null) {
    return (
      <>
        <AdminPageHeader title="Site Settings" />
        <ErrorState
          message={loadError}
          onRetry={() => {
            setLoading(true);
            setLoadError(null);
            setNonce((n) => n + 1);
          }}
        />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="Site Settings" subtitle="Name, phone, email, address" />
      <AdminCard>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="set-name">Site name</label>
            <input id="set-name" className={inputClass} {...register("siteName")} />
            <FieldErrorText message={errors.siteName?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="set-phone">Phone</label>
              <input id="set-phone" className={inputClass} {...register("phone")} />
              <FieldErrorText message={errors.phone?.message} />
            </div>
            <div>
              <label className={labelClass} htmlFor="set-email">Email</label>
              <input id="set-email" type="email" className={inputClass} {...register("email")} />
              <FieldErrorText message={errors.email?.message} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="set-addr">Address</label>
            <textarea id="set-addr" rows={2} className={inputClass} {...register("address")} />
            <FieldErrorText message={errors.address?.message} />
          </div>
          <div>
            <label className={labelClass} htmlFor="set-footer-desc">Footer description</label>
            <textarea id="set-footer-desc" rows={3} className={inputClass} {...register("footerDescription")} />
            <FieldErrorText message={errors.footerDescription?.message} />
          </div>
          <div>
            <label className={labelClass} htmlFor="set-copyright">Copyright text</label>
            <input id="set-copyright" className={inputClass} placeholder="© 2026 Meghduth Design Studio..." {...register("copyright")} />
            <FieldErrorText message={errors.copyright?.message} />
          </div>
          {saveError !== null && <p className="text-sm text-red-400">{saveError}</p>}
          {saved && <p className="text-sm text-green-400">Settings saved.</p>}
          <button type="submit" className={primaryBtnClass} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </button>
        </form>
      </AdminCard>
    </>
  );
}
