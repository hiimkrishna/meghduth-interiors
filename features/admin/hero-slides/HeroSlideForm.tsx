// হিরো স্লাইড ফরম — contracts স্কিমা + zodResolver, নতুন/সম্পাদনা দুটোই।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createHeroSlideSchema,
  type HeroSlide,
} from "@/packages/contracts/src/hero.schema";
import {
  createHeroSlide,
  updateHeroSlide,
} from "./hero-slides.service";
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

type HeroFormValues = z.infer<typeof createHeroSlideSchema>;

interface HeroSlideFormProps {
  initial?: HeroSlide;
  onDone: () => void;
  onCancel: () => void;
}

export function HeroSlideForm(props: HeroSlideFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(createHeroSlideSchema),
    defaultValues: {
      imageKey: initial?.image ?? "",
      badge: initial?.badge ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      order: initial?.order ?? 0,
      published: initial?.published ?? true,
    },
  });

  const imageKey = watch("imageKey");

  const onSubmit = async (data: HeroFormValues): Promise<void> => {
    setFormError(null);
    try {
      if (initial !== undefined) {
        await updateHeroSlide(initial.id, data);
      } else {
        await createHeroSlide(data);
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
          label="Image"
          value={imageKey}
          onChange={(key) =>
            setValue("imageKey", key, { shouldValidate: true })
          }
          error={errors.imageKey?.message}
        />
        <div>
            <label className={labelClass} htmlFor="hero-badge">Badge</label>
          <input id="hero-badge" className={inputClass} {...register("badge")} />
          <FieldErrorText message={errors.badge?.message} />
        </div>
        <div>
            <label className={labelClass} htmlFor="hero-title">Title</label>
          <input id="hero-title" className={inputClass} {...register("title")} />
          <FieldErrorText message={errors.title?.message} />
        </div>
        <div>
            <label className={labelClass} htmlFor="hero-desc">Description</label>
          <textarea
            id="hero-desc"
            rows={3}
            className={inputClass}
            {...register("description")}
          />
          <FieldErrorText message={errors.description?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="hero-order">Order</label>
            <input
              id="hero-order"
              type="number"
              min={0}
              className={inputClass}
              {...register("order", { valueAsNumber: true })}
            />
            <FieldErrorText message={errors.order?.message} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="hero-pub" type="checkbox" {...register("published")} />
            <label htmlFor="hero-pub" className="text-sm text-[#b6bcc5]">
              Published
            </label>
          </div>
        </div>
        {formError !== null && (
          <p className="text-sm text-red-400">{formError}</p>
        )}
        <div className="flex gap-2">
          <button type="submit" className={primaryBtnClass} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : initial !== undefined ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className={ghostBtnClass}
            onClick={props.onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
