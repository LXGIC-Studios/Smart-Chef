import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-border">
        <Link href="/" className="h-20 md:h-24 ml-8 md:ml-16">
          <Image
            src="/smartcheflogo.png"
            alt="Smart Chef"
            width={360}
            height={96}
            className="h-full w-auto"
            priority
          />
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <p className="label mb-2">Legal</p>
        <h1 className="heading-lg mb-12">Terms of Service</h1>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="heading-md mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              By accessing or using Smart Chef, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">2. Description of Service</h2>
            <p className="text-muted leading-relaxed">
              Smart Chef is a recipe generation platform that creates personalized recipes based on ingredients and spices you provide. The service suggests recipes and does not guarantee specific nutritional outcomes or dietary compliance.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">3. User Accounts</h2>
            <p className="text-muted leading-relaxed mb-4">When you create an account, you agree to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-md mb-4">4. Acceptable Use</h2>
            <p className="text-muted leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Upload malicious code or content</li>
              <li>Abuse, harass, or harm other users</li>
              <li>Use automated systems to access the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-md mb-4">5. Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              The Smart Chef name, logo, and all related content are owned by us or our licensors. Generated recipes are provided for your personal use. You retain ownership of any content you submit, but grant us a license to use it for providing the service.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-muted leading-relaxed">
              Smart Chef is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that recipes will meet your dietary needs, taste preferences, or be free from allergens. Always verify ingredients and cooking instructions, especially if you have food allergies or dietary restrictions.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">7. Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              To the maximum extent permitted by law, Smart Chef shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to foodborne illness, allergic reactions, or any other health-related issues.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">8. Indemnification</h2>
            <p className="text-muted leading-relaxed">
              You agree to indemnify and hold harmless Smart Chef and its affiliates from any claims, damages, or expenses arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">9. Termination</h2>
            <p className="text-muted leading-relaxed">
              We may terminate or suspend your account at any time for violations of these terms. You may delete your account at any time. Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">10. Changes to Terms</h2>
            <p className="text-muted leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">11. Governing Law</h2>
            <p className="text-muted leading-relaxed">
              These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">12. Contact</h2>
            <p className="text-muted leading-relaxed">
              For questions about these Terms of Service, please contact us at legal@smartchef.com.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
