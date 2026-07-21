import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const ContactForm = () => {
  return (
    <section className="pb-20 lg:pb-32">
      <Container>
        <form className="mx-auto max-w-3xl space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full rounded-xl border border-white/10 bg-[#17191B] px-6 py-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/10 bg-[#17191B] px-6 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Subject"
            className="w-full rounded-xl border border-white/10 bg-[#17191B] px-6 py-4 text-white outline-none"
          />

          <textarea
            rows={6}
            placeholder="Tell us about your project..."
            className="w-full rounded-xl border border-white/10 bg-[#17191B] px-6 py-4 text-white outline-none"
          />

          <Button href="#">Send Message</Button>
        </form>
      </Container>
    </section>
  );
};

export default ContactForm;
