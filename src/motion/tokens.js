export const duration = { instant: .10, fast: .18, base: .28, slow: .45, page: .55 };
export const ease = { standard: [0.4, 0, 0.2, 1], decel: [0, 0, 0.2, 1], accel: [0.4, 0, 1, 1] };

export const spring = {
  buttery: { type: "spring", stiffness: 300, damping: 30, mass: .9 },
  snappy: { type: "spring", stiffness: 420, damping: 26, mass: .7 },
  gentle: { type: "spring", stiffness: 180, damping: 22 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { ...spring.buttery, delay: i * 0.05 } 
  }),
};

export const floatIdle = {
  animate: (i = 0) => ({ 
    y: [0, -6, 0], 
    transition: { duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 } 
  }),
};

export const popIn = {
  hidden: { opacity: 0, scale: .92 },
  show: { opacity: 1, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, scale: .95, transition: { duration: duration.fast } },
};
