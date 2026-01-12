import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
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
        <h1 className="heading-lg mb-12">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="heading-md mb-4">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              Smart Chef (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recipe generation service.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">2. Information We Collect</h2>
            <p className="text-muted leading-relaxed mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Account information (email address, password)</li>
              <li>Ingredient and spice preferences you submit</li>
              <li>Recipes you save to your account</li>
              <li>Usage data and interaction with our services</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-md mb-4">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized recipe recommendations</li>
              <li>Process and store your saved recipes</li>
              <li>Communicate with you about updates and features</li>
              <li>Protect against fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-md mb-4">4. Information Sharing</h2>
            <p className="text-muted leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with service providers who assist us in operating our platform (such as Supabase for authentication and database services, and OpenAI for recipe generation), subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">5. Data Security</h2>
            <p className="text-muted leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">6. Your Rights</h2>
            <p className="text-muted leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-md mb-4">7. Cookies</h2>
            <p className="text-muted leading-relaxed">
              We use essential cookies to maintain your session and authentication state. These cookies are necessary for the service to function and cannot be disabled.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">8. Changes to This Policy</h2>
            <p className="text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="heading-md mb-4">9. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@smartchef.com.
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
