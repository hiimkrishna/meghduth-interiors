import type * as React from "react";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

// সাইট-লোডিং — Skeleton-ভিত্তিক (হিরো + শিরোনাম + কার্ড-গ্রিড)।
export default function SiteLoading(): React.JSX.Element {
  return (
    <main className="bg-[#111315] pt-28 pb-20">
      <Container>
        <Skeleton className="h-[46vh] w-full rounded-3xl" />
        <Skeleton className="mx-auto mt-10 h-10 w-2/3" />
        <Skeleton className="mx-auto mt-4 h-5 w-full max-w-2xl" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </Container>
    </main>
  );
}
