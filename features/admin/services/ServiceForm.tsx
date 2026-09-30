// সেবা ফরম — contracts স্কিমা + zodResolver (খালি ছবি → undefined)।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createServiceSchema,
  type ServiceItem,
} from "@/packages/contracts/src/service.schema";
import {
  createAdminService,
  updateAdminService,
} from "./admin-services.service";
import { adminErrorMessage } from "../shared/use-admin-list";
import { ApiError } from "@/lib/api";
import { ImageField } from "../shared/image-field";
import { ServiceGalleryField } from "./ServiceGalleryField";
import {
  AdminCard,
  FieldErrorText,
  ghostBtnClass,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "../shared/admin-ui";

// ঐচ্ছিক ছবিতে খালি স্ট্রিংও বৈধ — জমায় undefined বানানো হয়।
const serviceFormSchema = createServiceSchema.extend({
  imageKey: z.string().trim().max(512).optional(),
});
type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  initial?: ServiceItem;
  onDone: () => void;
  onCancel: () => void;
}

export function ServiceForm(props: ServiceFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      imageKey: initial?.imageKey ?? "",
      order: initial?.order ?? 0,
      published: initial?.published ?? true,
    },
  });

  const imageKey = watch("imageKey") ?? "";

  const onSubmit = async (data: ServiceFormValues): Promise<void> => {
    setFormError(null);
    const payload = {
      ...data,
      imageKey:
        data.imageKey === undefined || data.imageKey === ""
          ? undefined
          : data.imageKey,
    };
    try {
      if (initial !== undefined) {
        await updateAdminService(initial.id, payload);
      } else {
        await createAdminService(payload);
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
    <div className="space-y-4">
    <AdminCard>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
        <ImageField
          label="Image (optional)"
          value={imageKey}
          onChange={(key) =>
            setValue("imageKey", key, { shouldValidate: true })
          }
          error={errors.imageKey?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
              <label className={labelClass} htmlFor="svc-slug">Slug</label>
            <input id="svc-slug" className={inputClass} placeholder="residential-design" {...register("slug")} />
            <FieldErrorText message={errors.slug?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="svc-title">Title</label>
            <input id="svc-title" className={inputClass} {...register("title")} />
            <FieldErrorText message={errors.title?.message} />
          </div>
        </div>
        <div>
            <label className={labelClass} htmlFor="svc-desc">Description</label>
          <textarea id="svc-desc" rows={8} className={`${inputClass} font-mono text-[13px] leading-6`} {...register("description")} />
          <FieldErrorText message={errors.description?.message} />
          <details className="mt-2 rounded-lg border border-[#2d3238] bg-[#111315] px-3.5 py-2.5">
            <summary className="cursor-pointer text-xs font-medium text-[#b79a6a]">
              How to format the description — click to see the pattern
            </summary>
            <div className="mt-2 space-y-1.5 text-xs leading-5 text-[#b6bcc5]">
              <p>Blank line = new paragraph. Lines starting with <code className="text-[#f5f5f2]">- </code> become bullets. Lines starting with <code className="text-[#f5f5f2]">## </code> become sub-headings.</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-black/40 p-3 font-mono text-[11px] leading-5 text-[#7a828c]">
{`First intro paragraph (2-3 lines).

Second paragraph about your approach.

## Why this service?

- Benefit one
- Benefit two

## What's included

- Deliverable one
- Deliverable two

Closing paragraph (2 lines).`}
              </pre>
            </div>
          </details>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass} htmlFor="svc-order">Order</label>
            <input id="svc-order" type="number" min={0} className={inputClass} {...register("order", { valueAsNumber: true })} />
            <FieldErrorText message={errors.order?.message} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="svc-pub" type="checkbox" {...register("published")} />
            <label htmlFor="svc-pub" className="text-sm text-[#b6bcc5]">Published</label>
          </div>
        </div>
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
    {initial !== undefined ? (
      <ServiceGalleryField serviceId={initial.id} />
    ) : (
      <AdminCard>
        <p className="text-xs leading-5 text-[#7a828c]">
          Save the service first — then you can add up to 5 gallery images at a time here.
        </p>
      </AdminCard>
    )}
    </div>
  );
}
