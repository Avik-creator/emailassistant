"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
export default function AuthSection() {
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    if (session?.data){
      router.push("/chat")
    }else{
      await signIn("google", { callbackUrl: "/chat" })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-md"
    >
      <Card className="w-full shadow-lg border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Connect Email Account</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in with your Google account to access your emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              This application requires access to your email to provide the following features:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 ml-2">
              <li>Read emails using natural language commands</li>
              <li>Send new emails through conversation</li>
              <li>Delete and organize your inbox effortlessly</li>
              <li>Switch between chat and traditional email views</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">We use secure OAuth authentication and never store your password.</p>
          </div>
        </CardContent>
        <CardFooter>
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                "Connecting..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
