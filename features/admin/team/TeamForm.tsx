// দল ফরম — contracts স্কিমা + zodResolver (খালি ঐচ্ছিক → undefined)।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createTeamMemberSchema,
  type TeamMember,
} from "@/packages/contracts/src/team.schema";
import {
  createAdminTeamMember,
  updateAdminTeamMember,
} from "./admin-team.service";
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

const teamFormSchema = createTeamMemberSchema.extend({
  bio: z.string().trim().max(2000).optional(),
  imageKey: z.string().trim().max(512).optional(),
});
type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  initial?: TeamMember;
  onDone: () => void;
  onCancel: () => void;
}

export function TeamForm(props: TeamFormProps): ReactNode {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const initial = props.initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      designation: initial?.designation ?? "",
      bio: initial?.bio ?? "",
      imageKey: initial?.imageKey ?? "",
      order: initial?.order ?? 0,
      published: initial?.published ?? true,
    },
  });

  const imageKey = watch("imageKey") ?? "";

  const onSubmit = async (data: TeamFormValues): Promise<void> => {
    setFormError(null);
    const payload = {
      ...data,
      bio: data.bio === undefined || data.bio.trim() === "" ? undefined : data.bio,
      imageKey:
        data.imageKey === undefined || data.imageKey === ""
          ? undefined
          : data.imageKey,
    };
    try {
      if (initial !== undefined) {
        await updateAdminTeamMember(initial.id, payload);
      } else {
        await createAdminTeamMember(payload);
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
              <label className={labelClass} htmlFor="team-name">Name</label>
            <input id="team-name" className={inputClass} {...register("name")} />
            <FieldErrorText message={errors.name?.message} />
          </div>
          <div>
              <label className={labelClass} htmlFor="team-desig">Role</label>
            <input id="team-desig" className={inputClass} {...register("designation")} />
            <FieldErrorText message={errors.designation?.message} />
          </div>
        </div>
        <div>
            <label className={labelClass} htmlFor="team-bio">Bio (optional)</label>
          <textarea id="team-bio" rows={3} className={inputClass} {...register("bio")} />
          <FieldErrorText message={errors.bio?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass} htmlFor="team-order">Order</label>
            <input id="team-order" type="number" min={0} className={inputClass} {...register("order", { valueAsNumber: true })} />
            <FieldErrorText message={errors.order?.message} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="team-pub" type="checkbox" {...register("published")} />
            <label htmlFor="team-pub" className="text-sm text-[#b6bcc5]">Published</label>
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
  );
}
