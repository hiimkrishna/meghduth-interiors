// নেভিগেশন ফরম — contracts স্কিমা + zodResolver।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createNavigationItemSchema,
  type NavigationItem,
} from "@/packages/contracts/src/site.schema";
import {
  createAdminNavigation,
  updateAdminNavigation,
} from "./admin-navigations.service";
import { adminErrorMessage } from "../shared/use-admin-list";
import { ApiError } from "@/lib/api";
import {
  AdminCard,
  FieldErrorText,
  ghostBtnClass,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "../shared/admin-ui";

type NavigationFormValues = z.infer<typeof createNavigationItemSchema>;

interface NavigationFormProps {
  initial?: NavigationItem;
  onDone: () => void;
  onCancel: () => void;
}

export function NavigationForm(props: NavigationFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NavigationFormValues>({
    resolver: zodResolver(createNavigationItemSchema),
    defaultValues: {
      label: initial?.label ?? "",
      href: initial?.href ?? "",
      order: initial?.order ?? 0,
      visible: initial?.visible ?? true,
      showInFooter: initial?.showInFooter ?? true,
    },
  });

  const onSubmit = async (data: NavigationFormValues): Promise<void> => {
    setFormError(null);
    try {
      if (initial !== undefined) {
        await updateAdminNavigation(initial.id, data);
      } else {
        await createAdminNavigation(data);
      }
      props.onDone();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setFormError(adminErrorMessage(err));
    }
  };

  return (
    <AdminCard>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
              <label className={labelClass} htmlFor="nav-label">Label</label>
            <input id="nav-label" className={inputClass} {...register("label")} />
            <FieldErrorText message={errors.label?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="nav-href">Link</label>
            <input id="nav-href" className={inputClass} placeholder="/about" {...register("href")} />
            <FieldErrorText message={errors.href?.message} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass} htmlFor="nav-order">Order</label>
            <input id="nav-order" type="number" min={0} className={inputClass} {...register("order", { valueAsNumber: true })} />
            <FieldErrorText message={errors.order?.message} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="nav-vis" type="checkbox" {...register("visible")} />
            <label htmlFor="nav-vis" className="text-sm text-[#b6bcc5]">Visible</label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="nav-footer" type="checkbox" {...register("showInFooter")} />
          <label htmlFor="nav-footer" className="text-sm text-[#b6bcc5]">Show in footer</label>
        </div>
        <FieldErrorText message={errors.showInFooter?.message} />
        {formError !== null && <p className="text-sm text-red-400">{formError}</p>}
        <div className="flex gap-2">
          <button type="submit" className={primaryBtnClass} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : initial !== undefined ? "Update" : "Create"}
          </button>
          <button type="button" className={ghostBtnClass} onClick={props.onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
