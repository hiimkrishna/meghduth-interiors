// মতামত ফরম — contracts স্কিমা + zodResolver; নতুন=create, সম্পাদনা=পূর্ণ update।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  TESTIMONIAL_STATUSES,
  createTestimonialSchema,
  testimonialStatusSchema,
  type Testimonial,
} from "@/packages/contracts/src/testimonial.schema";
import {
  createAdminTestimonial,
  updateAdminTestimonial,
} from "./admin-testimonials.service";
import { adminErrorMessage } from "../shared/use-admin-list";
import { ApiError } from "@/lib/api";
import { ImageField } from "../shared/image-field";
import {
  AdminCard,
  FieldErrorText,
  ghostBtnClass,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "../shared/admin-ui";

// তৈরি ফিল্ড + অনুমোদন ফিল্ড — দুটোই contracts থেকে।
const testimonialFormSchema = createTestimonialSchema.extend({
  designation: z.string().trim().max(200).optional(),
  imageKey: z.string().trim().max(512).optional(),
  status: testimonialStatusSchema,
  published: z.boolean(),
});
type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface TestimonialFormProps {
  initial?: Testimonial;
  onDone: () => void;
  onCancel: () => void;
}

export function TestimonialForm(props: TestimonialFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      designation: initial?.designation ?? "",
      text: initial?.text ?? "",
      rating: initial?.rating ?? 5,
      imageKey: initial?.imageKey ?? "",
      status: initial?.status ?? "pending",
      published: initial?.published ?? false,
    },
  });

  const imageKey = watch("imageKey") ?? "";

  const onSubmit = async (data: TestimonialFormValues): Promise<void> => {
    setFormError(null);
    try {
      if (initial !== undefined) {
        // সম্পাদনা — পুরো ফরম সার্ভারে যায় (কনটেন্ট + status/published)।
        await updateAdminTestimonial(initial.id, {
          name: data.name,
          designation:
            data.designation === undefined || data.designation.trim() === ""
              ? undefined
              : data.designation,
          text: data.text,
          rating: data.rating,
          imageKey:
            data.imageKey === undefined || data.imageKey === ""
              ? undefined
              : data.imageKey,
          status: data.status,
          published: data.published,
        });
      } else {
        await createAdminTestimonial({
          name: data.name,
          designation:
            data.designation === undefined || data.designation.trim() === ""
              ? undefined
              : data.designation,
          text: data.text,
          rating: data.rating,
          imageKey:
            data.imageKey === undefined || data.imageKey === ""
              ? undefined
              : data.imageKey,
        });
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
        <ImageField
          label="Image (optional)"
          value={imageKey}
          onChange={(key) => setValue("imageKey", key, { shouldValidate: true })}
          error={errors.imageKey?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
              <label className={labelClass} htmlFor="tm-name">Name</label>
            <input id="tm-name" className={inputClass} {...register("name")} />
            <FieldErrorText message={errors.name?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="tm-desig">Role (optional)</label>
            <input id="tm-desig" className={inputClass} {...register("designation")} />
            <FieldErrorText message={errors.designation?.message} />
          </div>
        </div>
        <div>
            <label className={labelClass} htmlFor="tm-text">Testimonial</label>
          <textarea id="tm-text" rows={3} className={inputClass} {...register("text")} />
          <FieldErrorText message={errors.text?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
              <label className={labelClass} htmlFor="tm-rating">Rating</label>
            <input
              id="tm-rating"
              type="number"
              min={1}
              max={5}
              className={inputClass}
              {...register("rating", { valueAsNumber: true })}
            />
            <FieldErrorText message={errors.rating?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="tm-status">Status</label>
            <select id="tm-status" className={inputClass} {...register("status")}>
              {TESTIMONIAL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <FieldErrorText message={errors.status?.message} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="tm-pub" type="checkbox" {...register("published")} />
            <label htmlFor="tm-pub" className="text-sm text-[#b6bcc5]">Published</label>
          </div>
        </div>
        {formError !== null && <p className="text-sm text-red-400">{formError}</p>}
        <div className="flex gap-2">
          <button type="submit" className={primaryBtnClass} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : initial !== undefined ? "Save changes" : "Create"}
          </button>
          <button type="button" className={ghostBtnClass} onClick={props.onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
