"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111315] px-4">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-semibold text-white">404</h1>
          <p className="text-lg text-neutral-400">
            Page not found. The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="mt-4">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}