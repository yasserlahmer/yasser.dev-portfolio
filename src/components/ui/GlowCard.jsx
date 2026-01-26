import { motion } from 'framer-motion'

export default function GlowCard({
  children,
  className = '',
  glowColor = 'cyan',
  ...props
}) {
  const glowColors = {
    cyan: 'hover:shadow-neon-cyan border-neon-cyan/30 hover:border-neon-cyan',
    purple: 'hover:shadow-neon-purple border-neon-purple/30 hover:border-neon-purple',
    pink: 'hover:shadow-neon-pink border-neon-pink/30 hover:border-neon-pink',
  }

  return (
    <motion.div
      className={`
        relative bg-secondary/50 backdrop-blur-sm rounded-xl
        border transition-all duration-300
        ${glowColors[glowColor]}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      {...props}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {children}
    </motion.div>
  )
}
