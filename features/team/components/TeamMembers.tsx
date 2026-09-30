"use client";

import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import { useTeam } from "../hooks/use-team";
import TeamCard from "./TeamCard";

export interface TeamMembersIntro {
  eyebrow?: string;
  title: string;
  description?: string;
}

interface TeamMembersProps {
  intro: TeamMembersIntro;
}

const TeamMembers = ({ intro }: TeamMembersProps) => {
  const { data: members, loading, error, retry } = useTeam();

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <CommonSectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />

        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-96" />
            ))}
          </div>
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-base text-neutral-400">
              Failed to load team: {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
            >
              Try again
            </button>
          </div>
        )}
        {/* শূন্য অবস্থা */}
        {!loading && error === null && members.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-base text-neutral-400">
              No team members found.
            </p>
          </div>
        )}
        {!loading && error === null && members.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default TeamMembers;
