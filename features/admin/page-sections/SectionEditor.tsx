// সেকশন এডিটর — এক (পেজ, সেকশন) সারির জেনেরিক ফর্ম।
// initial = বর্তমান লাইভ কনটেন্ট (কোড-ফলব্যাক), DB-সারি থাকলে তা initial-এর উপর বসে।
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PageKey } from "@/packages/contracts/src/page-section.schema";
import {
  getAdminSection,
  saveAdminSection,
} from "@/features/admin/page-sections/page-sections.service";
import {
  AdminCard,
  ErrorState,
  LoadingState,
  primaryBtnClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";

export type FieldDef =
  | { kind: "text"; key: string; label: string; placeholder?: string }
  | { kind: "textarea"; key: string; label: string; placeholder?: string; rows?: number }
  | {
      kind: "list";
      key: string;
      label: string;
      addLabel: string;
      itemFields: Array<{ key: string; label: string; kind: "text" | "textarea" }>;
      // itemPrimitive: rows are plain strings (e.g. paragraphs) — shape preserved on save.
      itemPrimitive?: boolean;
    };

interface SectionEditorProps {
  page: PageKey;
  section: string;
  title: string;
  hint?: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
}

const inputClass =
  "w-full rounded-lg border border-[#2d3238] bg-[#111315] px-3 py-2 text-sm text-[#f5f5f2] placeholder:text-[#7a828c] focus:border-[#b79a6a] focus:outline-none";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringRows(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asRows(value: unknown): Array<Record<string, string>> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
    .map((r) => {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(r)) out[k] = asString(v);
      return out;
    });
}

export default function SectionEditor({
  page,
  section,
  title,
  hint,
  fields,
  initial,
}: SectionEditorProps): ReactNode {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedTick, setSavedTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    getAdminSection(page, section)
      .then((data) => {
        if (!active) return;
        setValues(data === null ? initial : { ...initial, ...data });
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load");
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, section]);

  const set = (key: string, value: unknown): void => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async (): Promise<void> => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveAdminSection(page, section, values);
      setSavedTick(Date.now());
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCard>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#f5f5f2]">{title}</h3>
          {hint !== undefined && hint !== "" && (
            <p className="mt-1 text-xs text-[#7a828c]">{hint}</p>
          )}
        </div>
        <button type="button" className={primaryBtnClass} disabled={saving || loading} onClick={() => void onSave()}>
          {saving ? "Saving…" : savedTick > 0 ? "Saved ✓ — Save" : "Save"}
        </button>
      </div>
      {loading && <LoadingState />}
      {!loading && loadError !== null && (
        <ErrorState
          message={loadError}
          onRetry={() => {
            setLoading(true);
            setLoadError(null);
            getAdminSection(page, section)
              .then((data) => {
                setValues(data === null ? initial : { ...initial, ...data });
                setLoading(false);
              })
              .catch((err: unknown) => {
                setLoadError(err instanceof Error ? err.message : "Failed to load");
                setLoading(false);
              });
          }}
        />
      )}
      {!loading && loadError === null && (
        <div className="space-y-4">
          {saveError !== null && <p className="text-sm text-red-400">{saveError}</p>}
          {fields.map((f) => {
            if (f.kind === "text") {
              return (
                <label key={f.key} className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#b6bcc5]">
                    {f.label}
                  </span>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={f.placeholder ?? ""}
                    value={asString(values[f.key])}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </label>
              );
            }
            if (f.kind === "textarea") {
              return (
                <label key={f.key} className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#b6bcc5]">
                    {f.label}
                  </span>
                  <textarea
                    className={inputClass}
                    rows={f.rows ?? 3}
                    placeholder={f.placeholder ?? ""}
                    value={asString(values[f.key])}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </label>
              );
            }
            if (f.itemPrimitive === true) {
              const rows = asStringRows(values[f.key]);
              const field = f.itemFields[0];
              return (
                <div key={f.key}>
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#b6bcc5]">
                    {f.label} ({rows.length})
                  </span>
                  <div className="space-y-3">
                    {rows.map((row, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          {field === undefined || field.kind === "textarea" ? (
                            <textarea
                              className={inputClass}
                              rows={2}
                              aria-label={field?.label ?? f.label}
                              value={row}
                              onChange={(e) => {
                                const next = rows.map((r, j) => (j === i ? e.target.value : r));
                                set(f.key, next);
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              className={inputClass}
                              aria-label={field.label}
                              value={row}
                              onChange={(e) => {
                                const next = rows.map((r, j) => (j === i ? e.target.value : r));
                                set(f.key, next);
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          className={smallBtnClass}
                          onClick={() => set(f.key, rows.filter((_, j) => j !== i))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`${smallBtnClass} mt-2`}
                    onClick={() => set(f.key, [...rows, ""])}
                  >
                    {f.addLabel}
                  </button>
                </div>
              );
            }
            const rows = asRows(values[f.key]);
            return (
              <div key={f.key}>
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#b6bcc5]">
                  {f.label} ({rows.length})
                </span>
                <div className="space-y-3">
                  {rows.map((row, i) => (
                    <div key={i} className="rounded-lg border border-[#2d3238] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-[#7a828c]">#{i + 1}</span>
                        <button
                          type="button"
                          className={smallBtnClass}
                          onClick={() =>
                            set(
                              f.key,
                              rows.filter((_, j) => j !== i),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        {f.itemFields.map((it) =>
                          it.kind === "textarea" ? (
                            <label key={it.key} className="block">
                              <span className="mb-1 block text-xs text-[#b6bcc5]">{it.label}</span>
                              <textarea
                                className={inputClass}
                                rows={2}
                                value={row[it.key] ?? ""}
                                onChange={(e) => {
                                  const next = rows.map((r, j) =>
                                    j === i ? { ...r, [it.key]: e.target.value } : r,
                                  );
                                  set(f.key, next);
                                }}
                              />
                            </label>
                          ) : (
                            <label key={it.key} className="block">
                              <span className="mb-1 block text-xs text-[#b6bcc5]">{it.label}</span>
                              <input
                                type="text"
                                className={inputClass}
                                value={row[it.key] ?? ""}
                                onChange={(e) => {
                                  const next = rows.map((r, j) =>
                                    j === i ? { ...r, [it.key]: e.target.value } : r,
                                  );
                                  set(f.key, next);
                                }}
                              />
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={`${smallBtnClass} mt-2`}
                  onClick={() => {
                    const blank: Record<string, string> = {};
                    for (const it of f.itemFields) blank[it.key] = "";
                    set(f.key, [...rows, blank]);
                  }}
                >
                  {f.addLabel}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
