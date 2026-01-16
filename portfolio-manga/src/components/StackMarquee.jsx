import { motion } from 'framer-motion';
import { PORTFOLIO_DATA } from '../lib/data';

export default function StackMarquee() {
  // Repeat the stack list multiple times to ensure no gaps
  const repeatedStack = [
    ...PORTFOLIO_DATA.stack,
    ...PORTFOLIO_DATA.stack,
    ...PORTFOLIO_DATA.stack,
    ...PORTFOLIO_DATA.stack,
  ];

  // Create the marquee text with separators
  const marqueeText = repeatedStack.map((tech, index) => (
    <span key={index} className="inline-flex items-center">
      <span className="uppercase">{tech}</span>
      <span className="mx-6 opacity-50">*</span>
    </span>
  ));

  return (
    <section className="relative w-full overflow-hidden border-y border-white/20 py-6 bg-[#050505]">
      <div className="flex">
        {/* First marquee line */}
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {marqueeText}
        </motion.div>

        {/* Duplicate for seamless loop */}
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {marqueeText}
        </motion.div>
      </div>
    </section>
  );
}
