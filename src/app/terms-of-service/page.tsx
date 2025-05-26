import React from 'react'

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-green-100">
      <h1 className="text-3xl font-bold mb-8 text-green-400">Terms of Service</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Email Assistant, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">2. Service Description</h2>
          <p className="mb-4">
            Email Assistant is an AI-powered email management system that integrates with Gmail to provide the following services:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Email management through natural language commands</li>
            <li>Email composition and sending</li>
            <li>Email search and organization</li>
            <li>AI-assisted email processing and responses</li>
            <li>Integration with Google Gmail services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">3. User Accounts and Requirements</h2>
          <div className="space-y-4">
            <p>To use Email Assistant, you must:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Have a valid Google account</li>
              <li>Be at least 13 years of age</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept our Privacy Policy</li>
            </ul>
            <p>
              You are responsible for all activities that occur under your account.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">4. User Responsibilities</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the service for any illegal purposes</li>
            <li>Send spam or malicious content</li>
            <li>Attempt to gain unauthorized access to the service</li>
            <li>Interfere with or disrupt the service</li>
            <li>Reverse engineer or decompile the service</li>
            <li>Share your account credentials with others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">5. Intellectual Property</h2>
          <p className="mb-4">
            All rights, title, and interest in and to the Email Assistant service, including all intellectual property rights, are and will remain the exclusive property of Email Assistant and its licensors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">6. Third-Party Services</h2>
          <p className="mb-4">
            Our service integrates with Google Gmail and other third-party services. Your use of such third-party services is governed by their respective terms of service and privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">7. Limitation of Liability</h2>
          <div className="space-y-4">
            <p>
              Email Assistant is provided "as is" without any warranties, expressed or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The service will be error-free or uninterrupted</li>
              <li>Any errors will be corrected</li>
              <li>The service will be available at any particular time or location</li>
              <li>The results of using the service will meet your requirements</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">8. Service Modifications</h2>
          <p className="mb-4">
            We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice. We may also impose limits on certain features or restrict access to parts or all of the service without notice or liability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">9. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">10. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Email Assistant operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">12. Contact Information</h2>
          <p className="mb-4">
            For any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            Email: terms@emailassistant.com
          </p>
        </section>

        <footer className="mt-8 pt-4 border-t border-green-800 text-sm text-green-400">
          Last Updated: {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  )
}

export default TermsOfService
