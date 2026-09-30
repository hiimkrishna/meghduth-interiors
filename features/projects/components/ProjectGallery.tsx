import ProjectCard, {
  type ProjectCardItem,
} from "@/features/home/featured-projects/components/ProjectCard";

interface ProjectGalleryProps {
  projects: ProjectCardItem[];
}

const ProjectGallery = ({ projects }: ProjectGalleryProps) => {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGallery;
