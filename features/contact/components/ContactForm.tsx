"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLeadSchema,
  type CreateLead,
} from "@/packages/contracts/src/lead.schema";
import { ApiError } from "@/lib/api";
import { createLead } from "../services/leads.service";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/common/SectionHeader";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#17191B] px-6 py-4 text-white outline-none";

const ContactForm = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [failed, setFailed] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLead>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  // জমা — POST /leads, সফলে রিসেট + বার্তা।
  const onSubmit = async (values: CreateLead): Promise<void> => {
    setStatus(null);
    setFailed(false);
    try {
      await createLead(values);
      reset();
      setFailed(false);
      setStatus("Thanks — your message has been received. We'll be in touch soon.");
    } catch (err) {
      setFailed(true);
      setStatus(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not send your message. Please try again.",
      );
    }
  };

  return (
    <section className="pb-20 lg:pb-32">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Get in touch"
          title="Let's Discuss Your Project"
          description="Share a few details about your space — we usually reply within one working day."
        />
        <form
          className="mx-auto mt-12 max-w-3xl space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label className="sr-only" htmlFor="contact-name">
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your Name"
              aria-label="Your Name"
              className={inputClass}
              {...register("name")}
            />
            {errors.name !== undefined && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="sr-only" htmlFor="contact-email">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
              className={inputClass}
              {...register("email")}
            />
            {errors.email !== undefined && (
              <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="sr-only" htmlFor="contact-subject">
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Subject"
              aria-label="Subject"
              className={inputClass}
              {...register("subject")}
            />
            {errors.subject !== undefined && (
              <p className="mt-2 text-sm text-red-400">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label className="sr-only" htmlFor="contact-message">
              Tell us about your project
            </label>
            <textarea
              id="contact-message"
              rows={6}
              placeholder="Tell us about your project..."
              aria-label="Tell us about your project"
              className={inputClass}
              {...register("message")}
            />
            {errors.message !== undefined && (
              <p className="mt-2 text-sm text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>

          {status !== null && (
            <p
              role={failed ? "alert" : "status"}
              className={
                failed
                  ? "text-sm text-red-400"
                  : "text-sm text-emerald-400"
              }
            >
              {status}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send Message"}
          </Button>
        </form>
      </Container>
    </section>
  );
};

export default ContactForm;
