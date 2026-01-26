import { motion } from 'framer-motion'
import NeonText from './NeonText'

export default function SectionTitle({ title, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <NeonText
        as="h2"
        color="gradient"
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        {title}
      </NeonText>
      {subtitle && (
        <motion.p
          className="text-text-secondary text-lg md:text-xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        className="w-24 h-1 mx-auto mt-6 rounded-full gradient-neon"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </div>
  )
}
