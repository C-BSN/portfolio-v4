import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PORTFOLIO_DATA } from '../lib/data';

export default function Hero() {
  const containerRef = useRef(null);
  
  // Scroll animation setup
  const { scrollY } = useScroll();
  
  // Transform: title spreads horizontally when scrolling
  const titleScale = useTransform(scrollY, [0, 500], [1, 1.5]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const letterSpacing = useTransform(scrollY, [0, 500], [0, 50]);
  
  // Animation variants for words
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95]
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95]
      }
    }
  };

  // Split title into words for animation
  const titleWords = PORTFOLIO_DATA.hero.title.split(' ');

  return (
    <section 
      ref={containerRef}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Main Title */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          scale: titleScale,
          opacity: titleOpacity,
        }}
      >
        {titleWords.map((word, index) => (
          <motion.h1
            key={index}
            variants={wordVariants}
            className="text-[12vw] font-bold uppercase leading-none"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              letterSpacing: `${index === 0 ? 0 : letterSpacing}px`
            }}
          >
            {word}
          </motion.h1>
        ))}
      </motion.div>

      {/* Subtitle - Technical Label Style */}
      <motion.div
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        className="border border-[#F0F0F0] px-6 py-3 relative"
      >
        <motion.p 
          className="text-sm md:text-base tracking-[0.3em] font-normal uppercase"
          style={{ letterSpacing: '0.3em' }}
        >
          {PORTFOLIO_DATA.hero.subtitle}
        </motion.p>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#F0F0F0] -translate-x-[2px] -translate-y-[2px]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#F0F0F0] translate-x-[2px] -translate-y-[2px]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#F0F0F0] -translate-x-[2px] translate-y-[2px]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#F0F0F0] translate-x-[2px] translate-y-[2px]" />
      </motion.div>

      {/* Location & Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-12 flex items-center gap-4 text-xs md:text-sm tracking-wider opacity-70"
      >
        <span>{PORTFOLIO_DATA.hero.location}</span>
        <span className="w-1 h-1 bg-[#F0F0F0] rounded-full" />
        <span>{PORTFOLIO_DATA.hero.status}</span>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 1.5, 
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#F0F0F0] to-transparent" />
      </motion.div>
    </section>
  );
}
