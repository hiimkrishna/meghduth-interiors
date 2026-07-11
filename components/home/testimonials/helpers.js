export const getPreviousIndex = (current, total) => {
  return (current - 1 + total) % total;
};


export const getNextIndex = (current, total) => {
  return (current + 1) % total;
};


export const getVisibleTestimonials = (
  testimonials,
  current
) => {
  const total = testimonials.length;

  const previousIndex = getPreviousIndex(
    current,
    total
  );

  const nextIndex = getNextIndex(
    current,
    total
  );

  return testimonials.map((item, index) => {
    let position = "hidden";

    if (index === previousIndex) {
      position = "left";
    }

    if (index === current) {
      position = "center";
    }

    if (index === nextIndex) {
      position = "right";
    }

    return {
      ...item,
      position,
    };
  });
};