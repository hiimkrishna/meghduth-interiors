import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  href: string;
}

export default function WhatsAppButton({
  href,
}: WhatsAppButtonProps): React.JSX.Element {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed
        bottom-[max(1.25rem,env(safe-area-inset-bottom))]
        right-5
        z-40

        flex
        h-14
        w-14
        items-center
        justify-center

        rounded-full
        bg-[#25D366]
        text-white

        shadow-lg
        shadow-black/30

        transition-transform
        duration-300

        hover:scale-110
      "
    >
      <MessageCircle size={26} />
    </Link>
  );
}
