import { motion } from 'motion/react';

interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"
      />
    </div>
  );
}
