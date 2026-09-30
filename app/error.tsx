"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111315] px-4">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-semibold text-white">Something went wrong</h1>
          <p className="text-base text-neutral-400">
            An unexpected error occurred. Please try again.
          </p>
          <div className="flex gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}