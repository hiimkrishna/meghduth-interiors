"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import { emailSchema } from "@/packages/contracts/src/common";
import { ApiError, api } from "@/lib/api";

const newsletterEmailSchema = z.object({ email: emailSchema });

type Status = "idle" | "success";

export default function FooterNewsletter(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const parsed = newsletterEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    api
      .post("/leads", {
        name: "Newsletter Subscriber",
        email: parsed.data.email,
        message: "Newsletter signup via footer.",
        source: "newsletter",
      })
      .then(() => {
        setStatus("success");
        setEmail("");
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not subscribe. Please try again.",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (status === "success") {
    return (
      <p role="status" className="text-sm text-emerald-400">
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#17191B]
            px-5
            py-3
            text-sm
            text-white
            outline-none
            placeholder:text-neutral-500
            focus:border-[#B79A6A]/60
          "
        />
        <button
          type="submit"
          disabled={submitting}
          className="
            shrink-0
            rounded-xl
            bg-[#B79A6A]
            px-6
            py-3
            text-sm
            font-semibold
            text-black
            transition-all
            duration-300
            hover:bg-[#c9ab7d]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {error !== null && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
