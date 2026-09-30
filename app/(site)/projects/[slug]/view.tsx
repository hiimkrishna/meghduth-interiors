"use client";

import type * as React from "react";
import { useParams } from "next/navigation";
import ProjectDetails from "@/features/projects/components/ProjectDetails";

// ক্লায়েন্ট খোলস — slug URL থেকে পড়ে বিস্তারিত দেখায়।
export default function ProjectDetailsView(): React.JSX.Element {
  const params = useParams<{ slug?: string | string[] }>();
  const raw = params.slug;
  const slug = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return <ProjectDetails slug={slug} />;
}
