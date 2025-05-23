import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Mail, MessageSquare, Trash2, Zap } from "lucide-react"
import AuthSection from "@/components/landingPage/auth-section"
import FeatureCard from "@/components/feature-card"
import AnimatedHeader from "@/components/landingPage/animated-header"
import AnimatedImage from "@/components/landingPage/animated-image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <AnimatedHeader>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Email Made <span className="text-blue-400">Conversational</span>
                </h1>
              </AnimatedHeader>

              <p className="text-xl text-neutral-300 max-w-lg">
                Manage your inbox effortlessly with natural language commands. No more complex interfaces or endless
                clicking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="#get-started" className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="#features">See Features</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <AnimatedImage>
                <div className="relative bg-neutral-900 rounded-xl shadow-xl overflow-hidden border border-neutral-800">
                  <div className="bg-black p-2 border-b border-neutral-800">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="bg-blue-900 rounded-lg p-3 text-sm text-blue-100">
                        Show me all unread emails from last week
                      </div>
                    </div>
                    <div className="flex items-start gap-4 mb-4 justify-end">
                      <div className="bg-neutral-800 rounded-lg p-3 text-sm text-neutral-200">
                        Found 5 unread emails from last week. Here they are:
                        <ul className="mt-2 space-y-1">
                          <li>• Meeting invitation from Sarah</li>
                          <li>• Project update from Team</li>
                          <li>• Newsletter: Tech Weekly</li>
                          <li>• Invoice #1234 from Acme Co</li>
                          <li>• New comment on your document</li>
                        </ul>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-neutral-200" />
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="bg-blue-900 rounded-lg p-3 text-sm text-blue-100">
                        Reply to Sarah that I'll attend the meeting
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedImage>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Simplify your email workflow with these powerful capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-blue-400" />}
              title="Natural Language Commands"
              description="Read and manage emails using simple conversational prompts instead of complex interfaces."
              delay={0.1}
            />

            <FeatureCard
              icon={<Mail className="h-6 w-6 text-blue-400" />}
              title="Smart Composition"
              description="Draft emails quickly with AI assistance that matches your writing style and intent."
              delay={0.2}
            />

            <FeatureCard
              icon={<Trash2 className="h-6 w-6 text-blue-400" />}
              title="Effortless Organization"
              description="Clean up your inbox with simple commands to delete, archive, or categorize messages."
              delay={0.3}
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6 text-blue-400" />}
              title="Quick Actions"
              description="Perform multiple email actions in seconds with a single natural language request."
              delay={0.4}
            />

            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-blue-400" />}
              title="Priority Handling"
              description="Automatically identify and highlight important emails that need your attention."
              delay={0.5}
            />

            <FeatureCard
              icon={<ArrowRight className="h-6 w-6 text-blue-400" />}
              title="Seamless Switching"
              description="Toggle between chat interface and traditional email view with a single click."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-8 rounded-xl shadow-sm border border-neutral-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 pt-2 text-white">Connect Your Account</h3>
              <p className="text-neutral-300">
                Sign in with your Google account to securely connect your email. We never store your password.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl shadow-sm border border-neutral-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 pt-2 text-white">Start a Conversation</h3>
              <p className="text-neutral-300">
                Type natural language commands to read, send, or organize your emails through a chat interface.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl shadow-sm border border-neutral-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 pt-2 text-white">Enjoy Simplified Email</h3>
              <p className="text-neutral-300">
                Experience a more intuitive way to manage your inbox without the complexity of traditional email
                clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="get-started" className="py-16 md:py-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started Today</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Connect your email account and start experiencing a better way to manage your inbox
            </p>
          </div>

          <div className="flex justify-center">
            <AuthSection />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Email Chat</h3>
              <p className="text-neutral-400">Making email management conversational and intuitive.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-neutral-400 hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-neutral-400 hover:text-white transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>© {new Date().getFullYear()} Email Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
