import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-full px-4 py-8 text-white bg-black">
      <h1 className="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Email Assistant. We are committed to protecting your privacy and handling your data with transparency and care. This Privacy Policy explains how we collect, use, and safeguard your information when you use our email management service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2 text-white">2.1 Account Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Your Google account email address</li>
            <li>OAuth 2.0 authentication tokens</li>
            <li>Account preferences and settings</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 text-white">2.2 Email Data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Email content (subject lines, body text, attachments)</li>
            <li>Email metadata (sender, recipient, date, labels)</li>
            <li>Email search queries and filters</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide email management services through our application</li>
            <li>To process and respond to your email-related commands</li>
            <li>To authenticate your access to your Gmail account</li>
            <li>To maintain and improve our services</li>
            <li>To protect against unauthorized access and ensure data security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
          <p className="mb-4">
            We implement robust security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Secure OAuth 2.0 authentication for Gmail access</li>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Strict access controls and monitoring</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>With Google services as necessary for email functionality</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">6. AI Processing</h2>
          <p className="mb-4">
            Our service uses AI technology to process and manage emails:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Natural language processing of email commands</li>
            <li>Email content analysis for smart features</li>
            <li>AI-assisted email composition and replies</li>
          </ul>
          <p className="mb-4">
            All AI processing is performed securely and in accordance with our data protection standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">7. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
            <li>Revoke Gmail access permissions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the <b>Last Updated</b> date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mb-4">
            Email: avikm744@gmail.com
          </p>
        </section>

        <footer className="mt-8 pt-4 border-t border-white text-sm text-white">
          Last Updated: {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  )
}

export default PrivacyPolicy
