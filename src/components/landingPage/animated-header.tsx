"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedHeaderProps {
  children: ReactNode
}

export default function AnimatedHeader({ children }: AnimatedHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
