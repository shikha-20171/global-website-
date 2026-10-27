"use client";

import { motion } from "framer-motion";

export default function AnimatedHeroTitle({
  text = "Technology That Moves Businesses Forward.",
}) {
  // Split words to animate each word with smooth staggered physics
  const words = text.trim().split(/\s+/);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        y: {
          type: "spring",
          stiffness: 140,
          damping: 20,
        },
        opacity: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
    },
  };

  return (
    <motion.span
      className="relative inline-block leading-[1.18] sm:leading-[1.08] tracking-tight overflow-visible select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── CONTINUOUS METALLIC LIGHT SHEEN SWEEP (Sweeps across the heading every 4.5s) ─── */}
      <motion.span
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        aria-hidden="true"
      >
        <motion.span
          className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-sky-300/25 to-transparent skew-x-[-22deg] blur-sm"
          animate={{
            x: ["-120%", "280%"],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </motion.span>

      {words.map((word, index) => {
        // Remove trailing punctuation for matching
        const cleanWord = word.replace(/[.,!?;:]/g, "");
        const isHighlight =
          cleanWord.toLowerCase() === "businesses" ||
          (words.length > 3 && index === words.length - 2 && !cleanWord.toLowerCase().includes("business"));
        const hasDot = word.endsWith(".");

        if (isHighlight) {
          return (
            <motion.span
              key={index}
              variants={wordVariants}
              className="relative inline-block mx-1 sm:mx-1.5 align-baseline my-0.5"
            >
              {/* Radial Sapphire / Globe Glow Aura behind "Businesses" */}
              <motion.span
                className="pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 rounded-2xl bg-gradient-to-r from-[#1d4ed8]/40 via-[#3b82f6]/45 to-[#60a5fa]/40 blur-xl"
                animate={{
                  opacity: [0.55, 0.95, 0.55],
                  scale: [0.96, 1.05, 0.96],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Shimmering Gradient Text Matching 3D Globe Colors */}
              <motion.span
                className="relative inline-block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] via-[#93c5fd] to-[#3b82f6] drop-shadow-[0_0_30px_rgba(59,130,246,0.75)]"
                animate={{
                  backgroundPosition: ["0% 50%", "200% 50%"],
                  scale: [1, 1.025, 1],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                {cleanWord}
              </motion.span>

              {/* Dynamic Laser Underline Beam Matching 3D Globe Halo */}
              <motion.span
                className="absolute left-0 bottom-0 sm:-bottom-1 right-0 h-[3px] rounded-full overflow-hidden bg-white/15 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                aria-hidden="true"
              >
                <motion.span
                  className="absolute inset-y-0 w-3/5 rounded-full bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent shadow-[0_0_16px_#38bdf8]"
                  animate={{
                    x: ["-100%", "220%"],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.span>

              {/* Trailing punctuation if any */}
              {word.slice(cleanWord.length) && (
                <span className="text-white ml-0.5">{word.slice(cleanWord.length)}</span>
              )}
            </motion.span>
          );
        }

        // Standard words ("Technology", "That", "Moves", "Forward.")
        return (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-[0.24em] text-white transition-colors duration-300 hover:text-sky-200"
          >
            {hasDot ? (
              <>
                <span>{word.slice(0, -1)}</span>
                <motion.span
                  className="inline-block text-sky-400 font-extrabold ml-[1px]"
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  .
                </motion.span>
              </>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

