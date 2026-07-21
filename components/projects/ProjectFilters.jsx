"use client";

const ProjectFilters = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-4">
      {["All", ...categories].map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              rounded-full
              px-6
              py-3
              transition-all
              duration-300
              border

              ${
                active
                  ? "bg-[#B79A6A] border-[#B79A6A] text-black"
                  : "border-white/10 text-neutral-300 hover:border-[#B79A6A] hover:text-white"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectFilters;
