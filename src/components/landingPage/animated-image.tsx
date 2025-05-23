"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedImageProps {
  children: ReactNode
}

export default function AnimatedImage({ children }: AnimatedImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
