import { motion } from 'framer-motion'

export default function NeonText({
  children,
  as = 'h1',
  color = 'cyan',
  glitch = false,
  className = '',
  ...props
}) {
  const Tag = motion[as] || motion.span

  const colors = {
    cyan: 'text-neon-cyan neon-text',
    purple: 'text-neon-purple neon-text-purple',
    pink: 'text-neon-pink neon-text-pink',
    gradient: 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent',
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  if (glitch) {
    return (
      <Tag
        className={`glitch font-orbitron ${colors[color]} ${className}`}
        data-text={children}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={textVariants}
        {...props}
      >
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={`font-orbitron ${colors[color]} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={textVariants}
      {...props}
    >
      {children}
    </Tag>
  )
}
