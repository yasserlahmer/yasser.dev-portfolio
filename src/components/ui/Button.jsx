import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  dark = true,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    rounded-lg transition-all duration-300
  `

  const variants = {
    primary: `bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/30`,
    outline: dark
      ? `bg-transparent border border-white/20 text-white hover:bg-white/5`
      : `bg-transparent border border-dark/20 text-dark hover:bg-dark/5`,
    ghost: dark
      ? `bg-transparent text-white hover:bg-white/5`
      : `bg-transparent text-dark hover:bg-dark/5`,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl font-bold',
  }

  const Component = href ? motion.a : motion.button

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </Component>
  )
}
