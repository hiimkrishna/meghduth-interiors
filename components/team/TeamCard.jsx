import Image from "next/image";

import Card from "@/components/common/Card";

const TeamCard = ({ member }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-80">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
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
