export const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
    },
  },
};

export const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const background = {
  initial: {
    opacity: 0,
    scale: 1,
  },

  animate: {
    opacity: 1,
    scale: 1.05,
    transition: {
      opacity: {
        duration: 2.5,
      },
      scale: {
        duration: 9,
        ease: "linear",
      },
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 2.5,
    },
  },
};