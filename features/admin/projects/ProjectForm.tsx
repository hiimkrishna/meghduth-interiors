// প্রজেক্ট ফরম — contracts স্কিমা + zodResolver (খালি ঐচ্ছিক → undefined)।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createProjectSchema,
  type Project,
} from "@/packages/contracts/src/project.schema";
import {
  createAdminProject,
  updateAdminProject,
} from "./admin-projects.service";
import { adminErrorMessage } from "../shared/use-admin-list";
import { ApiError } from "@/lib/api";
import { ImageField } from "../shared/image-field";
import { ProjectGalleryField } from "./ProjectGalleryField";
import {
  AdminCard,
  FieldErrorText,
  ghostBtnClass,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "../shared/admin-ui";

const projectFormSchema = createProjectSchema.extend({
  imageKey: z.string().trim().max(512).optional(),
  location: z.string().trim().max(200).optional(),
  year: z.string().trim().max(16).optional(),
  description: z.string().trim().max(4000).optional(),
});
type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initial?: Project;
  onDone: () => void;
  onCancel: () => void;
}

const blankToUndefined = (v: string | undefined): string | undefined =>
  v === undefined || v.trim() === "" ? undefined : v;

export function ProjectForm(props: ProjectFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      category: initial?.category ?? "",
      location: initial?.location ?? "",
      year: initial?.year ?? "",
      description: initial?.description ?? "",
      imageKey: initial?.imageKey ?? "",
      featured: initial?.featured ?? false,
      order: initial?.order ?? 0,
      published: initial?.published ?? true,
    },
  });

  const imageKey = watch("imageKey") ?? "";

  const onSubmit = async (data: ProjectFormValues): Promise<void> => {
    setFormError(null);
    const payload = {
      ...data,
      location: blankToUndefined(data.location),
      year: blankToUndefined(data.year),
      description: blankToUndefined(data.description),
      imageKey: blankToUndefined(data.imageKey),
    };
    try {
      if (initial !== undefined) {
        await updateAdminProject(initial.id, payload);
      } else {
        await createAdminProject(payload);
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
          onChange={(key) => setValue("imageKey", key, { shouldValidate: true })}
          error={errors.imageKey?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
              <label className={labelClass} htmlFor="prj-slug">Slug</label>
            <input id="prj-slug" className={inputClass} {...register("slug")} />
            <FieldErrorText message={errors.slug?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="prj-title">Title</label>
            <input id="prj-title" className={inputClass} {...register("title")} />
            <FieldErrorText message={errors.title?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="prj-cat">Category</label>
            <input id="prj-cat" className={inputClass} {...register("category")} />
            <FieldErrorText message={errors.category?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="prj-loc">Location (optional)</label>
            <input id="prj-loc" className={inputClass} {...register("location")} />
            <FieldErrorText message={errors.location?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="prj-year">Year (optional)</label>
            <input id="prj-year" className={inputClass} {...register("year")} />
            <FieldErrorText message={errors.year?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="prj-order">Order</label>
            <input id="prj-order" type="number" min={0} className={inputClass} {...register("order", { valueAsNumber: true })} />
            <FieldErrorText message={errors.order?.message} />
          </div>
        </div>
        <div>
            <label className={labelClass} htmlFor="prj-desc">Description (optional)</label>
          <textarea id="prj-desc" rows={4} className={inputClass} {...register("description")} />
          <FieldErrorText message={errors.description?.message} />
        </div>
        <div className="flex flex-wrap gap-5">
          <div className="flex items-center gap-2">
            <input id="prj-feat" type="checkbox" {...register("featured")} />
            <label htmlFor="prj-feat" className="text-sm text-[#b6bcc5]">Featured</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="prj-pub" type="checkbox" {...register("published")} />
            <label htmlFor="prj-pub" className="text-sm text-[#b6bcc5]">Published</label>
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
      <ProjectGalleryField projectId={initial.id} />
    ) : (
      <AdminCard>
        <p className="text-xs leading-5 text-[#7a828c]">
          Save the project first — then you can add up to 5 gallery images at a time here.
        </p>
      </AdminCard>
    )}
    </div>
  );
}
