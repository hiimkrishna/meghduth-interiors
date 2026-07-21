import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";

import TeamCard from "./TeamCard";

const TeamMembers = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.intro.eyebrow}
          title={data.intro.title}
          description={data.intro.description}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {data.members.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TeamMembers;
