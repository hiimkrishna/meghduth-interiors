import Image from "next/image";
import type { TeamMember } from "@/packages/contracts/src/team.schema";
import Card from "@/components/common/Card";
import { resolveImageSrc } from "@/lib/image-url";

// TeamMembers (পেজ data: image) ও ভবিষ্যৎ API (TeamMember: imageKey) — দুটোই চলে।
export type TeamCardItem = TeamMember & {
  image?: string;
};

interface TeamCardProps {
  member: TeamCardItem;
}

const TeamCard = ({ member }: TeamCardProps) => {
  if (!member) return null;

  // ছবি না থাকলে খালি src-তে <Image> রেন্ডার নিষেধ (ব্রাউজার ওয়ার্নিং হয়) —
  // একই জায়গায় গ্রেডিয়েন্ট ফলব্যাক থাকে, লেআউট হুবহু থাকে।
  // DB-তে শুধু key থাকে — resolveImageSrc দেখানোর URL বানায় (খালি হলে ফলব্যাক)।
  const imageSrc: string | undefined = resolveImageSrc(member.imageKey ?? member.image);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-80">
        {imageSrc !== undefined && imageSrc !== "" ? (
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
          />
        )}
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-semibold text-white">{member.name}</h3>

        <p className="mt-2 uppercase tracking-[0.2em] text-sm text-[#B79A6A]">
          {member.designation}
        </p>

        <p className="mt-5 leading-8 text-neutral-400">{member.bio}</p>
      </div>
    </Card>
  );
};

export default TeamCard;
