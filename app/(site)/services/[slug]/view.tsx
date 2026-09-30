"use client";

import type * as React from "react";
import { useParams } from "next/navigation";
import ServiceDetails from "@/features/services/components/ServiceDetails";

// ক্লায়েন্ট খোলস — slug URL থেকে পড়ে বিস্তারিত দেখায়।
export default function ServiceDetailsView(): React.JSX.Element {
  const params = useParams<{ slug?: string | string[] }>();
  const raw = params.slug;
  const slug = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return <ServiceDetails slug={slug} />;
}
