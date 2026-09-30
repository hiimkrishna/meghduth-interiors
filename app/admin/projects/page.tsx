// প্রজেক্ট — তালিকা + নতুন + সম্পাদনা।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Project } from "@/packages/contracts/src/project.schema";
import {
  deleteAdminProject,
  listAdminProjects,
} from "@/features/admin/projects/admin-projects.service";
import type { AdminId } from "@/features/admin/hero-slides/hero-slides.service";
import { ProjectForm } from "@/features/admin/projects/ProjectForm";
import {
  useAdminList,
  useAdminMutationGuard,
} from "@/features/admin/shared/use-admin-list";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
  dangerBtnClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";
import SectionEditor from "@/features/admin/page-sections/SectionEditor";
import {
  projectsHeroFallback,
  projectsIntroFallback,
} from "@/lib/page-fallbacks/projects";

type Mode = { name: "list" } | { name: "new" } | { name: "edit"; item: Project };

export default function AdminProjectsPage(): ReactNode {
  const { items, loading, error, reload } = useAdminList(listAdminProjects);
  const guard = useAdminMutationGuard();
  const [mode, setMode] = useState<Mode>({ name: "list" });
  const [deletingId, setDeletingId] = useState<AdminId | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Delete this project?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAdminProject(id);
      reload();
    } catch (err: unknown) {
      const msg = guard(err);
      if (msg !== null) setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const done = (): void => {
    setMode({ name: "list" });
    reload();
  };

  if (mode.name !== "list") {
    return (
      <>
        <AdminPageHeader title={mode.name === "new" ? "New Project" : "Edit Project"} />
        <ProjectForm
          initial={mode.name === "edit" ? mode.item : undefined}
          onDone={done}
          onCancel={() => setMode({ name: "list" })}
        />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Projects"
        subtitle={`${items.length} projects`}
        action={
          <button type="button" className={primaryBtnClass} onClick={() => setMode({ name: "new" })}>
            New
          </button>
        }
      />
      {deleteError !== null && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={reload} />}
      {!loading && error === null && items.length === 0 && <EmptyState text="No projects yet" />}
      {!loading && error === null && items.length > 0 && (
        <AdminCard>
          <ul className="divide-y divide-[#2d3238]">
            {items.map((p) => (
              <li key={String(p.id)} className="flex flex-wrap items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-[#f5f5f2]">{p.title}</p>
                  <p className="mt-0.5 text-xs text-[#7a828c]">
                    {p.category} · Order {p.order ?? 0}
                  </p>
                </div>
                {p.featured === true && <StatusBadge text="Featured" tone="yellow" />}
                <StatusBadge
                  text={p.published === true ? "Published" : "Draft"}
                  tone={p.published === true ? "green" : "gray"}
                />
                <button type="button" className={smallBtnClass} onClick={() => setMode({ name: "edit", item: p })}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerBtnClass}
                  disabled={deletingId === p.id}
                  onClick={() => void onDelete(p.id)}
                >
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
        Page content
      </h2>
      <div className="space-y-6">
        <SectionEditor
          page="projects"
          section="hero"
          title="Page hero"
          hint="Top banner of /projects."
          initial={projectsHeroFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "image", label: "Image path or key" },
          ]}
        />
        <SectionEditor
          page="projects"
          section="intro"
          title="Grid intro"
          hint="Header above the projects grid."
          initial={projectsIntroFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
          ]}
        />
      </div>
    </>
  );
}
