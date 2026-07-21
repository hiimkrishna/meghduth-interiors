import ProjectCard from "@/components/home/featured-projects/ProjectCard";

const ProjectGallery = ({ projects }) => {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGallery;
